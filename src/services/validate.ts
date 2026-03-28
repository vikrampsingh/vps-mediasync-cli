import { execSync } from 'child_process';

export const filterExistingPaths = (paths: string[]): string[] => {
  const valid: string[] = [];

  for (const path of paths) {
    try {
      execSync(`adb shell "[ -d '${path}' ]"`);
      valid.push(path);
    } catch {
      // skip non-existing paths
    }
  }

  return valid;
};