import { Command } from '@oclif/core';
import { selectDevice } from '../services/device.js';
import { resolvePaths } from '../services/resolver.js';
import { selectDestination } from '../services/filesystem.js';
import { runBackup } from '../services/sync.js';
import { askCheckbox } from '../utils/prompt.js';
import { logger } from '../core/logger.js';
import { CategoryKey } from '../core/categories.js';

export default class Backup extends Command {
  static description = 'Backup media from Android device';

  async run(): Promise<void> {

    // -------------------
    // Device selection
    // -------------------
    const device = await selectDevice();
    if (!device) return;

    // -------------------
    // Category selection
    // -------------------
    const categories = await askCheckbox(
      'What do you want to backup?',
      [
        { name: 'Images (Camera, Screenshots, WhatsApp)', value: 'images' },
        { name: 'Videos (Camera, WhatsApp)', value: 'videos' },
        { name: 'Downloads', value: 'downloads' },
        { name: 'Documents', value: 'documents' },
        { name: 'Audio / Recordings', value: 'audio' },
      ]
    ) as CategoryKey[];

    if (!categories || categories.length === 0) {
      logger.warning('No categories selected');
      return;
    }

    // -------------------
    // Resolve paths
    // -------------------
    const paths = resolvePaths(categories);

    if (paths.length === 0) {
      logger.error('No valid paths resolved');
      return;
    }

    // -------------------
    // Summary
    // -------------------
    logger.step('Backup Summary');

    paths.forEach(p => console.log(`• ${p}`));

    // -------------------
    // Destination
    // -------------------
    const DEST = await selectDestination();

    // -------------------
    // Execute backup
    // -------------------
    await runBackup(paths, DEST);
  }
}