#!/usr/bin/env node

/**
 * HuggingFace RLHF Dataset Export Script
 * 
 * Converts human-graded code generation results to industry-standard RLHF format
 * following Anthropic/hh-rlhf schema for training dataset compatibility.
 * 
 * Output format: {prompt, chosen, rejected} triplets with metadata
 * Usage: node scripts/export-huggingface.js [--output file.jsonl] [--min-votes 1]
 */

import fs from 'fs/promises';
import path from 'path';
import { csvParse } from 'd3-dsv';

const DEFAULT_OUTPUT = 'exports/training-dataset-v1.0.jsonl';
const BENCHMARKS_DIR = 'benchmarks';

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    output: DEFAULT_OUTPUT,
    minVotes: 1,
    verbose: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--output':
        config.output = args[++i];
        break;
      case '--min-votes':
        config.minVotes = parseInt(args[++i]);
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--help':
        console.log(`
Usage: node scripts/export-huggingface.js [options]

Options:
  --output <file>     Output file path (default: ${DEFAULT_OUTPUT})
  --min-votes <n>     Minimum votes required for consensus (default: 1)
  --verbose           Enable verbose logging
  --help              Show this help
`);
        process.exit(0);
    }
  }
  
  return config;
}

/**
 * Load all grader files from benchmarks/results/grades/
 */
async function loadGraderFiles() {
  const gradesDir = path.join(BENCHMARKS_DIR, 'results', 'grades');
  
  try {
    const files = await fs.readdir(gradesDir);
    const csvFiles = files.filter(f => f.endsWith('.csv'));
    
    const allGrades = [];
    
    for (const file of csvFiles) {
      const graderName = path.basename(file, '.csv');
      const filePath = path.join(gradesDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const grades = csvParse(content);
      
      // Add grader metadata to each grade
      grades.forEach(grade => {
        grade.grader = graderName;
        grade.technical = grade.grade ? parseInt(grade.grade) : null;
        grade.aesthetic = grade.aesthetics ? parseInt(grade.aesthetics) : null;
      });
      
      allGrades.push(...grades);
    }
    
    return allGrades;
  } catch (error) {
    console.error('Error loading grader files:', error.message);
    process.exit(1);
  }
}

/**
 * Load prompt from challenge's llmResponse.md file
 */
async function loadChallengePrompt(challenge, model) {
  const promptPath = path.join(BENCHMARKS_DIR, 'challenges', challenge, model, 'llmResponse.md');
  
  try {
    const content = await fs.readFile(promptPath, 'utf8');
    
    // Extract the prompt from markdown - often the first paragraph or before code blocks
    const lines = content.split('\n');
    let prompt = '';
    
    for (const line of lines) {
      if (line.startsWith('```') || line.startsWith('#')) break;
      if (line.trim()) {
        prompt += line + ' ';
      }
    }
    
    // Fallback: use challenge name as prompt if no clear prompt found
    if (!prompt.trim()) {
      prompt = `Generate code for the ${challenge} challenge.`;
    }
    
    return prompt.trim();
  } catch (error) {
    // Fallback prompt if file doesn't exist
    return `Generate code for the ${challenge} challenge.`;
  }
}

/**
 * Load generated code files for a challenge/model combination
 */
async function loadChallengeCode(challenge, model) {
  const challengePath = path.join(BENCHMARKS_DIR, 'challenges', challenge, model);
  
  try {
    const files = await fs.readdir(challengePath);
    const codeFiles = {};
    
    for (const file of files) {
      if (file.endsWith('.mjs') || file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
        const filePath = path.join(challengePath, file);
        const content = await fs.readFile(filePath, 'utf8');
        codeFiles[file] = content;
      }
    }
    
    return codeFiles;
  } catch (error) {
    console.warn(`Warning: Could not load code files for ${challenge}/${model}:`, error.message);
    return {};
  }
}

/**
 * Calculate consensus scores and identify chosen/rejected pairs
 */
function calculateConsensus(grades) {
  const groupedByChallenge = {};
  
  // Group grades by challenge/model combination
  grades.forEach(grade => {
    const key = `${grade.challenge}-${grade.model}`;
    if (!groupedByChallenge[key]) {
      groupedByChallenge[key] = [];
    }
    groupedByChallenge[key].push(grade);
  });
  
  const consensusResults = [];
  
  for (const [key, challengeGrades] of Object.entries(groupedByChallenge)) {
    // Filter out empty grades
    const validGrades = challengeGrades.filter(g => g.technical !== null && g.aesthetic !== null);
    
    if (validGrades.length === 0) continue;
    
    // Calculate consensus scores
    const technicalScores = validGrades.map(g => g.technical);
    const aestheticScores = validGrades.map(g => g.aesthetic);
    
    const consensus = {
      challenge: validGrades[0].challenge,
      model: validGrades[0].model,
      technical_mean: technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length,
      aesthetic_mean: aestheticScores.reduce((a, b) => a + b, 0) / aestheticScores.length,
      vote_count: validGrades.length,
      technical_scores: technicalScores,
      aesthetic_scores: aestheticScores
    };
    
    consensus.overall_score = (consensus.technical_mean + consensus.aesthetic_mean) / 2;
    
    consensusResults.push(consensus);
  }
  
  return consensusResults;
}

/**
 * Create RLHF training examples from consensus data
 */
async function createRLHFExamples(consensusResults, minVotes = 1, verbose = false) {
  const examples = [];
  
  // Filter results with sufficient votes
  const validResults = consensusResults.filter(r => r.vote_count >= minVotes);
  
  if (verbose) {
    console.log(`Processing ${validResults.length} results with >= ${minVotes} votes`);
  }
  
  // Sort by overall score to identify chosen/rejected pairs
  validResults.sort((a, b) => b.overall_score - a.overall_score);
  
  // Group by challenge to create pairwise comparisons
  const byChallenge = {};
  validResults.forEach(result => {
    if (!byChallenge[result.challenge]) {
      byChallenge[result.challenge] = [];
    }
    byChallenge[result.challenge].push(result);
  });
  
  for (const [challenge, results] of Object.entries(byChallenge)) {
    if (results.length < 2) continue; // Need at least 2 models for comparison
    
    const sortedResults = results.sort((a, b) => b.overall_score - a.overall_score);
    
    // Create pairwise comparisons: top performer vs others
    const chosen = sortedResults[0];
    
    for (let i = 1; i < sortedResults.length; i++) {
      const rejected = sortedResults[i];
      
      // Only create pairs with meaningful score differences
      if (chosen.overall_score - rejected.overall_score < 0.5) continue;
      
      try {
        // Load prompt and code for both models
        const prompt = await loadChallengePrompt(challenge, chosen.model);
        const chosenCode = await loadChallengeCode(challenge, chosen.model);
        const rejectedCode = await loadChallengeCode(challenge, rejected.model);
        
        // Format code as strings
        const chosenCodeStr = Object.entries(chosenCode)
          .map(([file, content]) => `**${file}**\n\n\`\`\`\n${content}\n\`\`\``)
          .join('\n\n');
          
        const rejectedCodeStr = Object.entries(rejectedCode)
          .map(([file, content]) => `**${file}**\n\n\`\`\`\n${content}\n\`\`\``)
          .join('\n\n');
        
        if (!chosenCodeStr || !rejectedCodeStr) continue;
        
        const example = {
          prompt: prompt,
          chosen: chosenCodeStr,
          rejected: rejectedCodeStr,
          metadata: {
            challenge: challenge,
            chosen_model: chosen.model,
            rejected_model: rejected.model,
            chosen_scores: {
              technical: chosen.technical_mean,
              aesthetic: chosen.aesthetic_mean,
              overall: chosen.overall_score,
              vote_count: chosen.vote_count
            },
            rejected_scores: {
              technical: rejected.technical_mean,
              aesthetic: rejected.aesthetic_mean,
              overall: rejected.overall_score,
              vote_count: rejected.vote_count
            },
            score_difference: chosen.overall_score - rejected.overall_score,
            dataset_version: "1.0.0",
            generated_at: new Date().toISOString()
          }
        };
        
        examples.push(example);
        
        if (verbose) {
          console.log(`Created pair: ${chosen.model} (${chosen.overall_score.toFixed(2)}) vs ${rejected.model} (${rejected.overall_score.toFixed(2)})`);
        }
        
      } catch (error) {
        console.warn(`Warning: Could not create example for ${challenge}: ${error.message}`);
      }
    }
  }
  
  return examples;
}

/**
 * Main export function
 */
async function exportHuggingFaceDataset() {
  const config = parseArgs();
  
  console.log('🚀 Starting HuggingFace RLHF dataset export...');
  console.log(`📊 Output: ${config.output}`);
  console.log(`🗳️  Minimum votes: ${config.minVotes}`);
  
  // Load all grader data
  console.log('📂 Loading grader files...');
  const grades = await loadGraderFiles();
  console.log(`✅ Loaded ${grades.length} grades from ${new Set(grades.map(g => g.grader)).size} graders`);
  
  // Calculate consensus scores
  console.log('🧮 Calculating consensus scores...');
  const consensus = calculateConsensus(grades);
  console.log(`✅ Calculated consensus for ${consensus.length} challenge/model combinations`);
  
  // Create RLHF training examples
  console.log('🔄 Creating RLHF training examples...');
  const examples = await createRLHFExamples(consensus, config.minVotes, config.verbose);
  console.log(`✅ Created ${examples.length} training examples`);
  
  if (examples.length === 0) {
    console.warn('⚠️  No training examples generated. Check that you have sufficient graded data.');
    process.exit(1);
  }
  
  // Ensure output directory exists
  await fs.mkdir(path.dirname(config.output), { recursive: true });
  
  // Write JSONL format (one JSON object per line)
  const jsonlContent = examples.map(ex => JSON.stringify(ex)).join('\n');
  await fs.writeFile(config.output, jsonlContent);
  
  console.log(`🎉 Successfully exported ${examples.length} training examples to ${config.output}`);
  console.log(`📈 Dataset statistics:`);
  console.log(`   - Challenges: ${new Set(examples.map(ex => ex.metadata.challenge)).size}`);
  console.log(`   - Models: ${new Set([...examples.map(ex => ex.metadata.chosen_model), ...examples.map(ex => ex.metadata.rejected_model)]).size}`);
  console.log(`   - Average score difference: ${(examples.reduce((sum, ex) => sum + ex.metadata.score_difference, 0) / examples.length).toFixed(2)}`);
  
  // Generate summary statistics
  const stats = {
    total_examples: examples.length,
    challenges: [...new Set(examples.map(ex => ex.metadata.challenge))],
    models: [...new Set([...examples.map(ex => ex.metadata.chosen_model), ...examples.map(ex => ex.metadata.rejected_model)])],
    export_timestamp: new Date().toISOString(),
    format_version: "1.0.0"
  };
  
  await fs.writeFile(config.output.replace('.jsonl', '.meta.json'), JSON.stringify(stats, null, 2));
  console.log(`📋 Metadata saved to ${config.output.replace('.jsonl', '.meta.json')}`);
}

// Run the export
if (import.meta.url === `file://${process.argv[1]}`) {
  exportHuggingFaceDataset().catch(error => {
    console.error('❌ Export failed:', error);
    process.exit(1);
  });
}