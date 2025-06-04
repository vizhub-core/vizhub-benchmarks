import { readFile } from "fs/promises";
import path from "path";

export async function loader() {
  try {
    // Read from main repo results file
    const filePath = path.join(
      process.cwd(),
      "..", // Go up from grader-app to main repo
      "benchmarks",
      "results",
      "results.csv"
    );
    const csvContent = await readFile(filePath, 'utf-8');
    
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Failed to read results file:', error);
    return new Response('Error reading results file', { status: 500 });
  }
}