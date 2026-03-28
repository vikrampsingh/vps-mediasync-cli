import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue(msg)),

  success: (msg: string) => console.log(chalk.green(`✅ ${msg}`)),

  warning: (msg: string) => console.log(chalk.yellow(`⚠️ ${msg}`)),

  error: (msg: string) => console.error(chalk.red(`❌ ${msg}`)),

  step: (msg: string) => console.log(chalk.cyan(`\n▶ ${msg}`)),
};