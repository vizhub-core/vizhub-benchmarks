#!/usr/bin/env node
import { challenges } from "./challenges";
import {
  saveChallengeToFiles,
  validateChallengeStructure,
} from "./challengeLoader";
import path from "path";

/**
 * Migrates challenges from the hardcoded format to file-based format
 */
async function migrateChallenges() {
  console.log("Starting challenge migration...");

  const challengesDir = "benchmarks/challenges";
  let successCount = 0;
  let errorCount = 0;

  for (const challenge of challenges) {
    try {
      console.log(`Migrating challenge: ${challenge.name}`);

      // Save challenge to files
      saveChallengeToFiles(challenge, challengesDir);

      // Validate the saved challenge
      const challengeDir = path.join(challengesDir, challenge.name);
      const validation = validateChallengeStructure(challengeDir);

      if (validation.valid) {
        console.log(`✓ Successfully migrated ${challenge.name}`);
        successCount++;
      } else {
        console.error(
          `✗ Validation failed for ${challenge.name}:`,
          validation.errors
        );
        errorCount++;
      }
    } catch (error) {
      console.error(`✗ Error migrating ${challenge.name}:`, error);
      errorCount++;
    }
  }

  console.log("\nMigration complete!");
  console.log(`Successfully migrated: ${successCount} challenges`);
  console.log(`Errors: ${errorCount} challenges`);

  if (errorCount === 0) {
    console.log("\n🎉 All challenges migrated successfully!");
    console.log(
      "You can now update your code to use loadChallengesFromFiles() instead of the hardcoded challenges array."
    );
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateChallenges().catch(console.error);
}

export { migrateChallenges };
