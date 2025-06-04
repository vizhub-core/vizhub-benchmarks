import { useState, useEffect } from "react";
import { csvParse, csvFormat } from "d3-dsv";
import type { Route } from "./+types/home";
import { Form } from "react-router";
import { CodeViewer } from "../components/CodeViewer";
import type { Result } from "../types/result";
import { writeFile, readFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

/**
 * Retrieves the current user's name from git configuration
 * Converts spaces to hyphens and lowercases for consistent file naming
 * @returns {Promise<string>} The grader's normalized name or 'anonymous' as fallback
 */
async function getGraderName(): Promise<string> {
  try {
    const { stdout } = await execAsync('git config user.name');
    return stdout.trim().replace(/\s+/g, '-').toLowerCase();
  } catch (error) {
    console.warn('Could not get git user name, using anonymous');
    return 'anonymous';
  }
}

/**
 * Server-side loader function that fetches initial data for the grading interface
 * Reads the main results CSV file and gets the current grader's name
 * @returns {Promise<{graderName: string, csvContent: string}>} Initial data for the component
 */
export async function loader() {
  const graderName = await getGraderName();
  
  // Read results from main repo
  try {
    const resultsPath = path.join(
      process.cwd(),
      "..",
      "benchmarks", 
      "results",
      "results.csv"
    );
    const csvContent = await readFile(resultsPath, 'utf-8');
    return { graderName, csvContent };
  } catch (error) {
    console.error('Failed to read results:', error);
    return { graderName, csvContent: '' };
  }
}

/**
 * Server-side action function that handles form submissions for saving grades
 * Saves individual grader results to their own CSV file in the grades directory
 * @param {Object} params - The request parameters
 * @param {Request} params.request - The HTTP request containing form data
 * @returns {Promise<{ok: boolean}>} Success status of the save operation
 */
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const csvContent = formData.get("results") as string;
  const graderName = await getGraderName();

  // Save to main repo grades directory
  const filePath = path.join(
    process.cwd(),
    "..", // Go up from grader-app to main repo
    "benchmarks",
    "results",
    "grades",
    `${graderName}.csv`
  );
  await writeFile(filePath, csvContent);

  return { ok: true };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Grade Result Player" },
    {
      name: "description",
      content: "Grade AI-generated visualizations",
    },
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewer, setReviewer] = useState(loaderData?.graderName || "anonymous");
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);
  const [challengePrompt, setChallengePrompt] = useState<string>("");

  useEffect(() => {
    if (loaderData?.csvContent) {
      parseResults(loaderData.csvContent);
      loadExistingGrades();
    }
  }, [loaderData]);

  /**
   * Keyboard event handler for grading hotkeys and navigation
   * Handles: 1-5 (technical), Shift+1-5 (aesthetics), 0 (auto-fail), arrows (navigate)
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Use event.code instead of event.key to avoid symbol issues with Shift
      const code = event.code;
      const isShift = event.shiftKey;
      
      // Number keys 1-5 for technical grading (without shift)
      if (!isShift && ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(code)) {
        event.preventDefault();
        const number = parseInt(code.replace('Digit', ''));
        handleGradeChange("technical", number);
        return;
      }
      
      // Shift + number keys 1-5 for aesthetics grading  
      if (isShift && ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(code)) {
        event.preventDefault();
        const number = parseInt(code.replace('Digit', ''));
        handleGradeChange("aesthetics", number);
        return;
      }
      
      // Zero key for auto-fail
      if (code === 'Digit0') {
        event.preventDefault();
        autoFail();
        return;
      }
      
      // Arrow keys and WASD for navigation (use event.key for these)
      const key = event.key;
      if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        event.preventDefault();
        prevResult();
        return;
      }
      
      if (key === 'ArrowRight' || key === 'd' || key === 'D' || key === ' ') {
        event.preventDefault();
        nextResult();
        return;
      }
    };

    // Add event listener to document to ensure it captures all key events
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, results.length]); // Re-bind when navigation state changes

  /**
   * Fetch the challenge prompt/description to show full context
   * Loads the LLM response file that contains the original prompt
   */
  const loadChallengePrompt = async (challenge: string, model: string) => {
    try {
      const response = await fetch(`/api/code/${challenge}/${model}`);
      const data = await response.json();
      
      if (response.ok && data.files) {
        // Look for llmResponse.md which contains the original prompt
        const promptFile = data.files.find((f: any) => f.filename === 'llmResponse.md');
        if (promptFile) {
          setChallengePrompt(promptFile.content);
        } else {
          setChallengePrompt("No prompt details available for this challenge.");
        }
      }
    } catch (error) {
      console.error('Failed to load challenge prompt:', error);
      setChallengePrompt("Failed to load challenge details.");
    }
  };

  /**
   * Load any existing grades from the current grader's saved file
   * This allows users to see their previous work and make tweaks
   * @returns {Promise<void>} Resolves when grades are loaded and merged
   */
  const loadExistingGrades = async () => {
    try {
      const response = await fetch('/api/grades');
      const data = await response.json();
      
      if (response.ok && data.grades) {
        // Merge existing grades with current results
        setResults((prev) => 
          prev.map((result) => {
            const key = `${result.challenge}-${result.model}`;
            const existingGrade = data.grades[key];
            
            if (existingGrade) {
              return {
                ...result,
                technical: existingGrade.technical,
                aesthetics: existingGrade.aesthetics,
                notes: existingGrade.notes || result.notes,
                reviewedBy: existingGrade.reviewedBy || result.reviewedBy,
                reviewedAt: existingGrade.reviewedAt || result.reviewedAt,
              };
            }
            return result;
          })
        );
        
        // Successfully loaded existing grades
      }
    } catch (error) {
      console.error('Failed to load existing grades:', error);
    }
  };

  /**
   * Parse CSV content into Result objects for the grading interface
   * Filters for visualization-type results only
   * @param {string} csvContent - Raw CSV string from the results file
   */
  const parseResults = (csvContent: string) => {
    try {
      const data = csvParse(csvContent);
      const parsedResults = data
        .map((row) => ({
          challenge: row.challenge,
          model: row.model,
          type: row.type,
          passFail: row.passFail,
          technical: row.grade
            ? Number(row.grade)
            : undefined,
          aesthetics: row.aesthetics
            ? Number(row.aesthetics)
            : undefined,
          reviewedBy: row.reviewedBy,
          reviewedAt: row.reviewedAt,
          notes: row.notes,
        }))
        .filter(
          (result) => result.type === "visualization"
        );
      setResults(parsedResults);
    } catch (error) {
      console.error("Failed to parse results:", error);
    }
  };

  /**
   * Handle grade changes for the current result
   * Updates both the local state and triggers auto-save
   */
  const handleGradeChange = (
    type: "technical" | "aesthetics",
    value: number
  ) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[currentIndex] = {
        ...newResults[currentIndex],
        [type]: value,
      };
      return newResults;
    });
    saveResults();
  };

  /**
   * Navigation functions for moving between results
   * Includes bounds checking to prevent out-of-range navigation
   */
  const nextResult = () => {
    if (currentIndex < results.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevResult = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  /**
   * Auto-fail the current result by setting both grades to 0
   * Useful for clearly failed visualizations
   */
  const autoFail = () => {
    handleGradeChange("technical", 0);
    handleGradeChange("aesthetics", 0);
  };

  /**
   * Update notes for a specific result
   * @param {number} index - Index of the result to update
   * @param {string} notes - New notes content
   */
  const handleNotesChange = (
    index: number,
    notes: string
  ) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], notes };
      return newResults;
    });
    saveResults();
  };

  /**
   * Generate CSV content from current results
   * Note: Auto-save replaced by form submission for reliability
   * @returns {Promise<void>} Resolves when save operation completes
   */
  const saveResults = async () => {
    const reviewerName = reviewer || "anonymous";
    let csv =
      "challenge,model,passFail,grade,aesthetics,reviewedBy,reviewedAt,notes\n";

    results.forEach((r) => {
      csv +=
        [
          r.challenge,
          r.model,
          r.passFail,
          r.technical || "",
          r.aesthetics || "",
          reviewerName,
          new Date().toISOString(),
          `"${(r.notes || "").replace(/"/g, '""')}"`,
        ].join(",") + "\n";
    });

    // Auto-save functionality replaced by form submission for reliability
  };

  return (
    <div className="w-full h-full p-0 m-0">{/* Hidden header for fullscreen mode - using challenge labels instead */}

      {results.length > 0 && (
        <div className="fullscreen-grader">
          <div className="position-indicator">
            {currentIndex + 1}/{results.length}
            {(results[currentIndex]?.technical || results[currentIndex]?.aesthetics) && (
              <span className="graded-indicator" title="Previously graded">✓</span>
            )}
          </div>
          
          {/* Expandable challenge and model labels */}
          <div className="challenge-labels">
            <div 
              className="challenge-header"
              role="button"
              tabIndex={0}
              aria-expanded={showChallengeDetails}
              aria-label="Toggle challenge details"
              onClick={() => {
                setShowChallengeDetails(!showChallengeDetails);
                if (!showChallengeDetails && !challengePrompt) {
                  loadChallengePrompt(results[currentIndex].challenge, results[currentIndex].model);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowChallengeDetails(!showChallengeDetails);
                  if (!showChallengeDetails && !challengePrompt) {
                    loadChallengePrompt(results[currentIndex].challenge, results[currentIndex].model);
                  }
                }
              }}
            >
              <div className="challenge-name">
                <span className="label">Challenge:</span>
                <span className="value">{results[currentIndex].challenge}</span>
              </div>
              <div className="model-name">
                <span className="label">Model:</span>
                <span className="value">{results[currentIndex].model}</span>
              </div>
              <span className="expand-indicator">
                {showChallengeDetails ? '▲' : '▼'}
              </span>
            </div>
            
            {showChallengeDetails && (
              <div className="challenge-details">
                <div className="challenge-prompt">
                  <h4>Challenge Prompt:</h4>
                  <pre className="prompt-text">{challengePrompt}</pre>
                </div>
              </div>
            )}
          </div>
          
          <div className="split-layout">
            <div className="visualization-panel">
              <img 
                src={`/benchmarks/visualizations/${results[currentIndex].challenge}/${results[currentIndex].model}/output.png`} 
                alt={`Generated visualization for ${results[currentIndex].challenge} by ${results[currentIndex].model}`}
                className="viz-image"
              />
            </div>
            
            <div className="code-panel">
              <CodeViewer 
                challenge={results[currentIndex].challenge}
                model={results[currentIndex].model}
              />
            </div>
          </div>
          
          {/* Enhanced grading controls with clear instructions */}
          <div className="grading-panel" role="region" aria-label="Grading controls">
            <div className="grading-instructions">
              <h3>Grade this visualization:</h3>
              <div className="grade-categories">
                <div className="grade-category">
                  <label id="technical-label">Technical (1-5 keys):</label>
                  <div className="grade-buttons" role="group" aria-labelledby="technical-label">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={`tech-${value}`}
                        className={`grade-btn ${results[currentIndex].technical === value ? 'selected' : ''}`}
                        onClick={() => handleGradeChange("technical", value)}
                        title={`Technical grade: ${value}`}
                        aria-label={`Set technical grade to ${value}`}
                        aria-pressed={results[currentIndex].technical === value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="current-grade">
                    {results[currentIndex].technical || 'ungraded'}
                  </span>
                </div>
                
                <div className="grade-category">
                  <label id="aesthetics-label">Aesthetics (Shift+1-5):</label>
                  <div className="grade-buttons" role="group" aria-labelledby="aesthetics-label">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={`aes-${value}`}
                        className={`grade-btn ${results[currentIndex].aesthetics === value ? 'selected' : ''}`}
                        onClick={() => handleGradeChange("aesthetics", value)}
                        title={`Aesthetics grade: ${value}`}
                        aria-label={`Set aesthetics grade to ${value}`}
                        aria-pressed={results[currentIndex].aesthetics === value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="current-grade">
                    {results[currentIndex].aesthetics || 'ungraded'}
                  </span>
                </div>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="auto-fail-btn"
                  onClick={autoFail}
                  title="Auto-fail: Set both grades to 0 (hotkey: 0)"
                  aria-label="Auto-fail: Set both technical and aesthetics grades to 0"
                >
                  ✗ Auto-fail (0 key)
                </button>
              </div>
            </div>
            
            <div className="navigation-controls" role="navigation" aria-label="Result navigation">
              <button 
                className="nav-btn prev"
                onClick={prevResult}
                disabled={currentIndex === 0}
                title="Previous result (← key)"
                aria-label="Go to previous result"
              >
                ← Previous
              </button>
              
              <div className="progress-info">
                <span className="position" aria-label={`Viewing result ${currentIndex + 1} of ${results.length}`}>
                  {currentIndex + 1} / {results.length}
                </span>
                <div className="progress-bar" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={results.length}>
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentIndex + 1) / results.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <button 
                className="nav-btn next"
                onClick={nextResult}
                disabled={currentIndex === results.length - 1}
                title="Next result (→ or Space key)"
                aria-label="Go to next result"
              >
                Next →
              </button>
            </div>
            
            <div className="hotkey-reference">
              <strong>Hotkeys:</strong> 1-5 (Technical) | Shift+1-5 (Aesthetics) | 0 (Auto-fail) | ←→ (Navigate)
            </div>
            
            {/* Save Results integrated into grading panel */}
            <div className="save-section">
              <Form method="post">
                <input
                  type="hidden"
                  name="results"
                  value={csvFormat(
                    results.map((r) => ({
                      challenge: r.challenge,
                      model: r.model,
                      type: r.type,
                      passFail: r.passFail,
                      grade: r.technical || "",
                      aesthetics: r.aesthetics || "",
                      reviewedBy: reviewer || "anonymous",
                      reviewedAt: new Date().toISOString(),
                      notes: r.notes || "",
                    }))
                  )}
                />
                <button 
                  type="submit" 
                  className="save-results-btn"
                  aria-label="Save all grades to file"
                >
                  Save All Grades
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
