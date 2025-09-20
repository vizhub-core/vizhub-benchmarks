import fs from "fs";
import path from "path";
import { Challenge } from "./types";
import { VizFiles } from "@vizhub/viz-types";

interface ChallengeMetadata {
  name: string;
  type?: "code" | "visualization";
  sampleData?: string;
}

/**
 * Loads all challenges from the benchmarks/challenges directory
 */
export function loadChallengesFromFiles(
  challengesDir: string = "benchmarks/challenges"
): Challenge[] {
  const challenges: Challenge[] = [];

  if (!fs.existsSync(challengesDir)) {
    console.warn(`Challenges directory not found: ${challengesDir}`);
    return challenges;
  }

  const challengeNames = fs
    .readdirSync(challengesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const challengeName of challengeNames) {
    try {
      const challenge = loadSingleChallenge(challengesDir, challengeName);
      if (challenge) {
        challenges.push(challenge);
      }
    } catch (error) {
      console.error(`Error loading challenge ${challengeName}:`, error);
    }
  }

  return challenges;
}

/**
 * Loads a single challenge from its directory
 */
function loadSingleChallenge(
  challengesDir: string,
  challengeName: string
): Challenge | null {
  const challengeDir = path.join(challengesDir, challengeName);

  // Check if this is a challenge definition directory (has challenge.json)
  const metadataPath = path.join(challengeDir, "challenge.json");
  if (!fs.existsSync(metadataPath)) {
    // Skip directories that don't have challenge.json (like model result directories)
    return null;
  }

  // Load metadata
  const metadata: ChallengeMetadata = JSON.parse(
    fs.readFileSync(metadataPath, "utf-8")
  );

  // Load prompt
  const promptPath = path.join(challengeDir, "prompt.md");
  const prompt = fs.existsSync(promptPath)
    ? fs.readFileSync(promptPath, "utf-8").trim()
    : "";

  // Load files from the files subdirectory
  const filesDir = path.join(challengeDir, "files");
  const files: VizFiles = {};

  if (fs.existsSync(filesDir)) {
    const fileNames = fs.readdirSync(filesDir);
    let fileIndex = 1;

    for (const fileName of fileNames) {
      const filePath = path.join(filesDir, fileName);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        files[`file${fileIndex}`] = {
          name: fileName,
          text: fileContent,
        };
        fileIndex++;
      }
    }
  }

  // Load sample data if specified
  let sampleData = metadata.sampleData;
  if (sampleData && sampleData.startsWith("file:")) {
    // If sampleData starts with "file:", load it from a file
    const sampleDataPath = path.join(challengeDir, sampleData.substring(5));
    if (fs.existsSync(sampleDataPath)) {
      sampleData = fs.readFileSync(sampleDataPath, "utf-8");
    }
  }

  return {
    name: metadata.name,
    prompt,
    files,
    type: metadata.type,
    sampleData,
  };
}

/**
 * Saves a challenge to the file system
 */
export function saveChallengeToFiles(
  challenge: Challenge,
  challengesDir: string = "benchmarks/challenges"
): void {
  const challengeDir = path.join(challengesDir, challenge.name);

  // Create challenge directory
  fs.mkdirSync(challengeDir, { recursive: true });

  // Save metadata
  const metadata: ChallengeMetadata = {
    name: challenge.name,
    type: challenge.type,
    sampleData: challenge.sampleData,
  };
  fs.writeFileSync(
    path.join(challengeDir, "challenge.json"),
    JSON.stringify(metadata, null, 2)
  );

  // Save prompt
  fs.writeFileSync(path.join(challengeDir, "prompt.md"), challenge.prompt);

  // Save files
  const filesDir = path.join(challengeDir, "files");
  fs.mkdirSync(filesDir, { recursive: true });

  Object.values(challenge.files).forEach((file) => {
    fs.writeFileSync(path.join(filesDir, file.name), file.text);
  });
}

/**
 * Validates that a challenge directory has the correct structure
 */
export function validateChallengeStructure(challengeDir: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if challenge.json exists
  const metadataPath = path.join(challengeDir, "challenge.json");
  if (!fs.existsSync(metadataPath)) {
    errors.push("Missing challenge.json file");
  } else {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      if (!metadata.name) {
        errors.push("challenge.json missing required 'name' field");
      }
    } catch (error) {
      errors.push("Invalid JSON in challenge.json");
    }
  }

  // Check if prompt.md exists
  const promptPath = path.join(challengeDir, "prompt.md");
  if (!fs.existsSync(promptPath)) {
    errors.push("Missing prompt.md file");
  }

  // Check if files directory exists
  const filesDir = path.join(challengeDir, "files");
  if (!fs.existsSync(filesDir)) {
    errors.push("Missing files directory");
  } else {
    const fileCount = fs.readdirSync(filesDir).length;
    if (fileCount === 0) {
      errors.push("Files directory is empty");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
