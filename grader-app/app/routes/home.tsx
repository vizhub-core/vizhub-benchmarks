import { useState, useEffect } from "react";
import { csvParse, csvFormat } from "d3-dsv";
import type { Route } from "./+types/home";
import { Form } from "react-router";
import { GradeResult } from "../components/GradeResult";
import type { Result } from "../types/result";
import { writeFile, readFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

async function getGraderName() {
  try {
    const { stdout } = await execAsync('git config user.name');
    return stdout.trim().replace(/\s+/g, '-').toLowerCase();
  } catch (error) {
    console.warn('Could not get git user name, using anonymous');
    return 'anonymous';
  }
}

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

export async function action({ request }) {
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

  useEffect(() => {
    if (loaderData?.csvContent) {
      parseResults(loaderData.csvContent);
    }
  }, [loaderData]);

  const parseResults = (csvContent: string) => {
    try {
      const data = csvParse(csvContent);
      console.log(data);
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

  const handleGradeChange = (
    index: number,
    type: "technical" | "aesthetics",
    value: number
  ) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = {
        ...newResults[index],
        [type]: value,
      };
      return newResults;
    });
    saveResults();
  };

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

    // Remove the broken fetch-based save - we'll use the form submission instead
    console.log('Grades will be saved when you click Save Results button');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header mb-8">
        <h1 className="text-2xl font-bold">
          Grade Result Player
        </h1>
        <input
          type="text"
          className="reviewer-input"
          placeholder="Reviewer name"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="fullscreen-grader">
          <div className="position-indicator">
            {currentIndex + 1}/{results.length}
          </div>
          
          <div className="split-layout">
            <div className="visualization-panel">
              <img 
                src={`/benchmarks/visualizations/${results[currentIndex].challenge}/${results[currentIndex].model}/output.png`} 
                alt="Visualization" 
                className="viz-image"
              />
            </div>
            
            <div className="code-panel">
              <div className="code-viewer">
                <div className="challenge-info">
                  {results[currentIndex].challenge} - {results[currentIndex].model}
                </div>
                <div className="code-content">
                  [Code viewer will go here]
                </div>
              </div>
            </div>
          </div>
          
          <div className="grading-controls">
            <div className="grade-section">
              <span>Technical: {results[currentIndex].technical || 'ungraded'}</span>
              <span>Aesthetics: {results[currentIndex].aesthetics || 'ungraded'}</span>
            </div>
          </div>
        </div>
      )}


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
        <button type="submit" className="save-button">
          Save Results
        </button>
      </Form>
    </div>
  );
}
