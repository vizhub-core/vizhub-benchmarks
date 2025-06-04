import { exec } from "child_process";
import { promisify } from "util";

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
  return Response.json({ graderName });
}