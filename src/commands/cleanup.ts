import { Command, Flags } from "@oclif/core";
import { selectDevice } from "../services/device.js";
import { resolvePaths } from "../services/resolver.js";
import { runCleanup } from "../services/cleanup-engine.js";
import { askCheckbox, askInput } from "../utils/prompt.js";
import { logger } from "../core/logger.js";
import { CategoryKey } from "../core/categories.js";
import { execSync } from "child_process";
import { checkDependencies } from '../services/dependency.js';

export default class Cleanup extends Command {
  static description = "Clean old files from Android device";

  static flags = {
    "dry-run": Flags.boolean({
      description: "Preview deletion without removing files",
      default: false,
    }),
  };

  async run(): Promise<void> {
    
    const { flags } = await this.parse(Cleanup);

       // -------------------
    // Check dependencies
    // -------------------
    const ready = await checkDependencies();
      if (!ready) return;

    // -------------------
    // Device selection
    // -------------------
    const device = await selectDevice();
    if (!device) return;

    // -------------------
    // Category selection
    // -------------------
    const categories = (await askCheckbox("What do you want to clean?", [
      { name: "Images (Camera, Screenshots, WhatsApp)", value: "images" },
      { name: "Videos (Camera, WhatsApp)", value: "videos" },
      { name: "Downloads", value: "downloads" },
      { name: "Documents", value: "documents" },
      { name: "Audio / Recordings", value: "audio" },
    ])) as CategoryKey[];

    if (!categories || categories.length === 0) {
      logger.warning("No categories selected");
      return;
    }

    // -------------------
    // Retention input
    // -------------------
    const monthsInput = await askInput(
      "Delete files older than how many months? (default: 6)",
    );

    const months = Number(monthsInput || 6);

    if (isNaN(months) || months < 0) {
      logger.error("Invalid number of months");
      return;
    }

    // -------------------
    // Resolve paths
    // -------------------
    const paths = resolvePaths(categories);

    if (paths.length === 0) {
      logger.error("No valid paths resolved");
      return;
    }

    // -------------------
    // Execute cleanup
    // -------------------
    // await runCleanup(paths, months, flags['dry-run']);

    const files = await runCleanup(paths, months, flags["dry-run"]);

    if (!files || files.length === 0) return;

    // confirm
    const confirm = await askInput(
      flags["dry-run"]
        ? "Dry-run: press enter to simulate cleanup"
        : "Type yes to confirm deletion",
    );

    if (!flags["dry-run"] && confirm !== "yes") {
      logger.warning("Cleanup cancelled");
      return;
    }

    // execute
    for (const file of files) {
      if (flags["dry-run"]) {
        console.log(`🧪 Would delete: ${file}`);
      } else {
        try {
          execSync(`adb shell rm "${file}"`);
          console.log(`🗑 Deleted: ${file}`);
        } catch {
          console.log(`❌ Failed: ${file}`);
        }
      }
    }

    logger.success(flags["dry-run"] ? "Dry-run complete" : "Cleanup complete");
  }
}
