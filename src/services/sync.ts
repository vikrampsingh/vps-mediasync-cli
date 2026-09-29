import { spawn } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';
import ora from 'ora';
import { logger } from '../core/logger.js';
import { countFiles } from './adb.js';

// -----------------------------
// RSYNC PROGRESS HANDLER
// -----------------------------
const runRsync = (
  src: string,
  dest: string,
  label: string
) => {
  return new Promise<void>((resolve, reject) => {

    const proc = spawn('rsync', [
      '-av',                  // verbose (shows files)
      '--ignore-existing',
      `${src}/`,
      `${dest}/`
    ]);

    let started = false;

    proc.stdout.on('data', (data) => {
      const output = data.toString();

      // show minimal feedback (avoid spam)
      if (!started) {
        process.stdout.write(`🔄 ${label} → syncing...\n`);
        started = true;
      }
    });

    proc.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`rsync exited with code ${code}`));
      }
    });
  });
};

// -----------------------------
// ADB PULL (SPINNER BASED)
// -----------------------------
const runAdbPull = (source: string, target: string, label: string) => {
  return new Promise<void>((resolve, reject) => {

    const spinner = ora(`📥 Pulling ${label}`).start();

    const proc = spawn('adb', ['pull', source, target]);

    let summary = '';

    proc.stdout.on('data', (data) => {
      summary = data.toString();
    });

    proc.stderr.on('data', (data) => {
      // optional: log adb errors
      process.stderr.write(data);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(`Pulled ${label}`);

        if (summary.includes('files pulled')) {
          console.log(`   ${summary.trim()}`);
        }

        resolve();
      } else {
        spinner.fail(`Failed ${label}`);
        reject(new Error(`adb pull failed (${code})`));
      }
    });
  });
};

// -----------------------------
// Resolve actual source folder
// -----------------------------
const resolveSourcePath = (basePath: string, folderName: string): string | null => {

  if (!fs.existsSync(basePath)) {
    return null;
  }

  // case 1: expected structure
  const direct = basePath;

  // case 2: nested structure (adb quirk)
  const nested = path.join(basePath, folderName);

  if (fs.existsSync(nested)) {
    return nested;
  }

  return direct;
};

// -----------------------------
// MAIN BACKUP
// -----------------------------
export const runBackup = async (
  paths: string[],
  DEST: string,
  dryRun: boolean = false
) => {

  logger.step('Starting backup');

  // -------------------
  // DRY-RUN PREVIEW
  // -------------------

  if (dryRun) {
    logger.step('Backup dry-run (no files will be copied)');
    let total = 0;

    for (const p of paths) {
      const folderName = path.basename(p);
      logger.info(`Counting files in ${folderName}...`);
      const count = countFiles(p);

      if (count === null) {
        logger.error(`Could not count ${folderName}`);
      } else {
        logger.success(`${folderName} → ${count} files`);
        total += count;
      }
    }

    console.log(`\n📊 Total files: ${total}`);
    console.log(`📂 Destination: ${DEST}`);
    logger.success('Dry-run complete — nothing was copied');
    return;
  }

  const TMP = path.join(os.homedir(), 'mediasync_tmp');

  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

  // -------------------
  // ADB PULL
  // -------------------

  for (const p of paths) {
    const folderName = path.basename(p);
    const target = path.join(TMP, folderName);

    try {
      await runAdbPull(p, target, folderName);
    } catch (err: any) {
      logger.error(`Failed ${folderName}`);
      console.log(`   Reason: ${err?.message}`);
    }
  }

  // -------------------
  // RSYNC
  // -------------------

  logger.step('Syncing to destination');

  for (const p of paths) {

    const folderName = path.basename(p);
    const baseSrc = path.join(TMP, folderName);

    const resolvedSrc = resolveSourcePath(baseSrc, folderName);

    if (!resolvedSrc) {
      logger.error(`Source not found: ${baseSrc}`);
      continue;
    }

    const dest = path.join(DEST, folderName);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    logger.info(`\n🔄 ${folderName}`);
    console.log(`   Source: ${resolvedSrc}`);
    console.log(`   Dest:   ${dest}`);

    try {
      await runRsync(resolvedSrc, dest, folderName);
        logger.success(`Synced ${folderName}`);
    } catch (err: any) {
      logger.error(`Failed sync ${folderName}`);
      console.log(`   Reason: ${err?.message}`);
    }
  }

  // -------------------
  // CLEAN TMP
  // -------------------

  fs.rmSync(TMP, { recursive: true, force: true });

  logger.success(`Backup complete → ${DEST}`);
};