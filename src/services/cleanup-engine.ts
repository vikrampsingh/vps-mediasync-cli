import { execSync } from 'child_process';
import { logger } from '../core/logger.js';

// -----------------------------
// Get old files
// -----------------------------
const getOldFiles = (path: string, months: number): string[] => {
  try {
    const cmd = `adb shell "find '${path}' -type f -mtime +${months * 30}"`;

    const output = execSync(cmd).toString();

    return output
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

  } catch {
    return [];
  }
};

// -----------------------------
// Delete files
// -----------------------------
const deleteFiles = (files: string[], dryRun: boolean) => {

  for (const file of files) {

    if (dryRun) {
      console.log(`🧪 [dry-run] Would delete: ${file}`);
      continue;
    }

    try {
      execSync(`adb shell rm "${file}"`);
      console.log(`🗑 Deleted: ${file}`);
    } catch {
      console.log(`❌ Failed: ${file}`);
    }
  }
};

// -----------------------------
// Main Cleanup Engine
// -----------------------------
export const runCleanup = async (
  paths: string[],
  months: number,
  dryRun: boolean = false
) => {

  logger.step(`Finding files older than ${months} months`);

  let allFiles: string[] = [];

  for (const p of paths) {
    const files = getOldFiles(p, months);

    logger.info(`${p} → ${files.length} files`);

    allFiles.push(...files);
  }

  if (allFiles.length === 0) {
    logger.success('No old files found');
    return;
  }

  console.log(`\n📊 Total files to delete: ${allFiles.length}`);

  // Preview (first 10)
  console.log('\nPreview:');
  allFiles.slice(0, 10).forEach(f => console.log(`• ${f}`));

  // 👉 NO prompts here (important)
  return allFiles;
};