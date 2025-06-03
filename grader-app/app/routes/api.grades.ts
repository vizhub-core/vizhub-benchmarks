import { readFile } from "fs/promises";
import { csvParse } from "d3-dsv";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

/**
 * Get the current grader's name from git config
 * Used to identify which grades file to load
 */
async function getGraderName() {
  try {
    const { stdout } = await execAsync('git config user.name');
    return stdout.trim().replace(/\s+/g, '-').toLowerCase();
  } catch (error) {
    console.warn('Could not get git user name, using anonymous');
    return 'anonymous';
  }
}

/**
 * API route to load existing grades for the current grader
 * Returns previously saved grades so users can see their work and make tweaks
 */
export async function loader() {
  try {
    const graderName = await getGraderName();
    
    // Try to read the grader's existing grades file
    const gradesFilePath = path.join(
      process.cwd(),
      "..",
      "benchmarks",
      "results",
      "grades",
      `${graderName}.csv`
    );

    try {
      const csvContent = await readFile(gradesFilePath, 'utf-8');
      const grades = csvParse(csvContent);
      
      // Convert grades to a more usable format
      const gradeMap = new Map();
      grades.forEach((grade) => {
        const key = `${grade.challenge}-${grade.model}`;
        gradeMap.set(key, {
          technical: grade.grade ? Number(grade.grade) : undefined,
          aesthetics: grade.aesthetics ? Number(grade.aesthetics) : undefined,
          notes: grade.notes || '',
          reviewedBy: grade.reviewedBy,
          reviewedAt: grade.reviewedAt
        });
      });

      return Response.json({ 
        graderName,
        grades: Object.fromEntries(gradeMap),
        hasExistingGrades: grades.length > 0
      });

    } catch (fileError) {
      // File doesn't exist yet - that's fine for new graders
      console.log(`No existing grades file found for ${graderName}`);
      return Response.json({ 
        graderName,
        grades: {},
        hasExistingGrades: false
      });
    }

  } catch (error) {
    console.error('Failed to load grades:', error);
    return Response.json({ 
      error: "Failed to load existing grades",
      graderName: 'anonymous',
      grades: {},
      hasExistingGrades: false
    }, { status: 500 });
  }
}