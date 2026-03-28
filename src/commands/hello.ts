import { Command } from '@oclif/core';
import { askInput } from '../utils/prompt.js';
import { createSpinner } from '../utils/spinner.js';
import { logger } from '../core/logger.js';

export default class Hello extends Command {
  static description = 'Test interactive UX';

  async run(): Promise<void> {
    logger.step('Starting CLI interaction');

    const name = await askInput('What is your name?');

    const spinner = createSpinner('Processing...');
    spinner.start();

    await new Promise((r) => setTimeout(r, 1500));

    spinner.succeed('Done');

    logger.success(`Hello ${name} 👋`);
  }
}