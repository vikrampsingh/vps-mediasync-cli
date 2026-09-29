// src/services/adb.ts

import { execSync } from "child_process";

export const checkAdb = (): boolean => {
  try {
    execSync("adb version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

export const getDevices = (): string[] => {
  try {
    const output = execSync("adb devices").toString();

    const lines = output.split("\n").slice(1);

    const devices: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const [id, status] = trimmed.split("\t");

      if (status === "device" && id) {
        devices.push(id);
      }
    }

    return devices;
  } catch {
    return [];
  }
};

// -----------------------------
// Count files in an Android path
// -----------------------------
export const countFiles = (path: string): number | null => {
  try {
    const output = execSync(`adb shell "find '${path}' -type f | wc -l"`).toString().trim();
    const count = parseInt(output, 10);
    return Number.isNaN(count) ? null : count;
  } catch {
    return null;
  }
};