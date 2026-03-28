
import fs from 'fs';
import path from 'path';
import os from 'os';
import { select } from '@inquirer/prompts';

export const selectDestination = async (): Promise<string> => {

  let currentPath = os.homedir();

  while (true) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    const choices = [
      { name: `📁 . (Select this folder)`, value: 'SELECT' },
      { name: `⬆️  .. (Go up)`, value: 'UP' },
      ...entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(e => ({
          name: `📁 ${e.name}`,
          value: path.join(currentPath, e.name)
        }))
    ];

    const choice = await select({
      message: `Select destination:\n${currentPath}`,
      choices
    });

    if (choice === 'SELECT') {
      return currentPath;
    }

    if (choice === 'UP') {
      currentPath = path.dirname(currentPath);
    } else {
      currentPath = choice;
    }
  }
};