import { execSync } from 'child_process';
import { logger } from '../core/logger.js';
import { askSelect } from '../utils/prompt.js';

// -----------------------------
// Check ADB
// -----------------------------
const checkAdb = () => {
  try {
    execSync('adb version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// -----------------------------
// Check brew
// -----------------------------
const checkBrew = () => {
  try {
    execSync('brew --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// -----------------------------
// Install ADB via brew
// -----------------------------
const installAdb = async (): Promise<boolean> => {

  const confirm = await askSelect(
    'ADB not found. Install automatically?',
    [
      { name: 'Yes', value: 'yes' },
      { name: 'No', value: 'no' }
    ]
  );

  if (confirm !== 'yes') {
    logger.warning('ADB is required. Please install manually.');
    return false;
  }

  if (!checkBrew()) {
    logger.error('Homebrew not found');

    console.log(`
👉 Install Homebrew first:

   https://brew.sh
    `);

    return false;
  }

  logger.step('Installing ADB via Homebrew...');

  try {
    execSync(
      'brew install android-platform-tools',
      { stdio: 'inherit' }
    );

    logger.success('ADB installed');
    return true;

  } catch {
    logger.error('Failed to install ADB');
    return false;
  }
};

// -----------------------------
// Check rsync
// -----------------------------
const checkRsync = (): string | null => {
  try {
    const output = execSync('rsync --version').toString();
    return output.split('\n')[0];
  } catch {
    return null;
  }
};

// -----------------------------
// MAIN DEPENDENCY CHECK
// -----------------------------
export const checkDependencies = async (): Promise<boolean> => {

  logger.step('Checking dependencies...');  

  // -------- ADB --------
  if (!checkAdb()) {
    logger.error('ADB not found');

    const installed = await installAdb();

    // re-check after install
    if (!installed || !checkAdb()) {
      logger.error('ADB still not available');
      return false;
    }
  }

  logger.success('ADB available');

  // -------- RSYNC --------
  const rsyncVersion = checkRsync();

  if (!rsyncVersion) {
    logger.error('rsync not found');

    console.log(`
👉 Install rsync:

   brew install rsync
    `);

    return false;
  }

  if (rsyncVersion.includes('2.6.9')) {
    logger.warning('Using system rsync (limited features)');
  } else {
    logger.success(`rsync available (${rsyncVersion})`);
  }

  return true;
};