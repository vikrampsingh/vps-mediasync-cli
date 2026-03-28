import { input, checkbox, select } from '@inquirer/prompts';

export const askInput = async (message: string) => {
  return input({ message });
};

export const askPath = async (message: string) => {
  return input({
    message,
    default: '~/phone-backup'
  });
};

export const askSelect = async (message: string, choices: any[]) => {
  return select({
    message,
    choices,
  });
};

export const askCheckbox = async (message: string, choices: any[]) => {
  return checkbox({
    message,
    choices,
  });
};