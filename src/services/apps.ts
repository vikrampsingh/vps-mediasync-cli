import { execSync } from 'child_process';

export const detectApps = (): string[] => {
  try {
    const output = execSync(
      'adb shell ls /sdcard/Android/media'
    ).toString();

    return output
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

  } catch {
    return [];
  }
};