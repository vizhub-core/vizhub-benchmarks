import { readFile, readdir } from "fs/promises";
import path from "path";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { challenge } = params;
  const modelPath = params["*"]; // The splat captures everything after challenge/
  
  if (!challenge || !modelPath) {
    return Response.json({ error: "Missing challenge or model path" }, { status: 400 });
  }

  try {
    // Get directory path for the challenge/model
    // modelPath will be something like "deepseek/deepseek-r1"
    const challengePath = path.join(
      process.cwd(),
      "..",
      "benchmarks",
      "challenges", 
      challenge,
      modelPath
    );

    // Read all files in the directory
    const files = await readdir(challengePath);
    
    // Filter for code files
    const codeFiles = files.filter(file => 
      file.endsWith('.mjs') || 
      file.endsWith('.html') || 
      file.endsWith('.js') ||
      file.endsWith('.css') ||
      file.endsWith('.csv')
    );

    // Read content of each code file
    const fileContents = await Promise.all(
      codeFiles.map(async (filename) => {
        const filePath = path.join(challengePath, filename);
        const content = await readFile(filePath, 'utf-8');
        return {
          filename,
          content
        };
      })
    );

    return Response.json({ 
      challenge,
      model: modelPath,
      files: fileContents 
    });

  } catch (error) {
    console.error('Failed to read challenge files:', error);
    return Response.json({ 
      error: "Failed to read files",
      challenge,
      model: modelPath 
    }, { status: 500 });
  }
}