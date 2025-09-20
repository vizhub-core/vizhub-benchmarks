#!/usr/bin/env node
import fs from "fs";
import path from "path";
import {
  saveChallengeToFiles,
  validateChallengeStructure,
} from "./challengeLoader";
import { Challenge } from "./types";

/**
 * Creates a new challenge from a template
 */
function createNewChallenge(
  name: string,
  type: "code" | "visualization" = "code",
  challengesDir: string = "benchmarks/challenges"
): void {
  const challengeDir = path.join(challengesDir, name);

  // Check if challenge already exists
  if (fs.existsSync(challengeDir)) {
    console.error(`Challenge "${name}" already exists at ${challengeDir}`);
    process.exit(1);
  }

  // Create basic challenge structure
  const challenge: Challenge = {
    name,
    type,
    prompt: `TODO: Write the prompt for the ${name} challenge.`,
    files:
      type === "code"
        ? createCodeTemplate(name)
        : createVisualizationTemplate(name),
    sampleData:
      type === "visualization" ? "TODO: Add sample data if needed" : undefined,
  };

  try {
    // Save the challenge
    saveChallengeToFiles(challenge, challengesDir);

    // Validate the created challenge
    const validation = validateChallengeStructure(challengeDir);

    if (validation.valid) {
      console.log(`✓ Successfully created challenge: ${name}`);
      console.log(`Challenge directory: ${challengeDir}`);
      console.log("\nNext steps:");
      console.log(
        `1. Edit ${path.join(
          challengeDir,
          "prompt.md"
        )} to add the challenge description`
      );
      console.log(
        `2. Update the template files in ${path.join(
          challengeDir,
          "files/"
        )} as needed`
      );
      if (type === "visualization") {
        console.log(
          `3. Update the sampleData in ${path.join(
            challengeDir,
            "challenge.json"
          )} if needed`
        );
      }
    } else {
      console.error(`✗ Validation failed for ${name}:`, validation.errors);
      process.exit(1);
    }
  } catch (error) {
    console.error(`✗ Error creating challenge ${name}:`, error);
    process.exit(1);
  }
}

/**
 * Creates a basic code challenge template
 */
function createCodeTemplate(challengeName: string) {
  return {
    file1: {
      name: "index.mjs",
      text: `import { ${challengeName} } from "./functions.mjs";

// TODO: Add test cases for the ${challengeName} function
const result = ${challengeName}(/* TODO: add test input */);
if (result !== /* TODO: expected result */) {
  console.error(\`Test failed: expected /* TODO */, got \${result}\`);
  process.exit(1);
}
console.log("${challengeName} test passed");
process.exit(0);
`,
    },
    file2: {
      name: "functions.mjs",
      text: `// TODO: Implement the ${challengeName} function
export function ${challengeName}(/* TODO: add parameters */) {
  // Your implementation here
}
`,
    },
  };
}

/**
 * Creates a basic visualization challenge template
 */
function createVisualizationTemplate(challengeName: string) {
  return {
    file1: {
      name: "index.html",
      text: `<!DOCTYPE html>
<html>
<head>
  <title>${challengeName} Visualization</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    body { font-family: sans-serif; }
    /* TODO: Add styling for the visualization */
  </style>
</head>
<body>
  <div id="chart"></div>
  <script type="module">
    // TODO: Implement the ${challengeName} visualization using D3.js
    
    const margin = {top: 40, right: 30, bottom: 40, left: 60};
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", \`translate(\${margin.left},\${margin.top})\`);

    // TODO: Load data and create visualization
    
    // Placeholder: Add a title
    svg.append("text")
       .attr("class", "chart-title")
       .attr("x", width / 2)
       .attr("y", 0 - (margin.top / 2))
       .attr("text-anchor", "middle")
       .text("${challengeName} Visualization (TODO: Implement)");

  </script>
</body>
</html>`,
    },
    file2: {
      name: "data.csv",
      text: `// TODO: Add sample data for the visualization
// Example:
// name,value
// A,10
// B,20
// C,15`,
    },
  };
}

/**
 * CLI interface for creating challenges
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: ts-node src/createChallenge.ts <challenge-name> [type]

Arguments:
  challenge-name    Name of the challenge to create
  type             Challenge type: "code" or "visualization" (default: "code")

Examples:
  ts-node src/createChallenge.ts fibonacci
  ts-node src/createChallenge.ts scatterPlot visualization
`);
    process.exit(1);
  }

  const challengeName = args[0];
  const type = (args[1] as "code" | "visualization") || "code";

  if (type !== "code" && type !== "visualization") {
    console.error('Type must be either "code" or "visualization"');
    process.exit(1);
  }

  createNewChallenge(challengeName, type);
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

export { createNewChallenge };
