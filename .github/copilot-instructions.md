---
description: "vps-mediasync-cli is a TypeScript CLI utility using oclif. Agents should understand the command structure, build process, and naming conventions before adding features."
---

# vps-mediasync-cli Workspace Instructions

## Quick Start

- **Build**: `npm run build` compiles TypeScript to `dist/`
- **Run**: `npm start` or `vps-mediasync-cli <command>`
- **Test a command**: `node ./bin/run.js <command>` (bypasses build step)

## Project Overview

- **Framework**: [oclif v4](https://oclif.io/) — Open CLI Framework with built-in help, versioning, plugins
- **Language**: TypeScript (ES2022, strict mode enabled)
- **Entry point**: `bin/run.js` → uses oclif's `run()` to load commands
- **Command registration**: oclif auto-discovers commands from `dist/commands/` (configured in `package.json`)

## Architecture

### Directory Structure

```
bin/           # Node shebang entry point
src/
  commands/    # CLI commands (extend Command class from @oclif/core)
  core/        # Domain logic, orchestration
  services/    # External integrations, APIs
  utils/       # Helpers, formatters
dist/          # Compiled JS (generated, not committed)
```

### How Commands Work

1. Each file in `src/commands/` defines a class extending `Command`
2. File name → command name (e.g., `hello.ts` → `vps-mediasync-cli hello`)
3. Command class must export `static description` and `async run()` method
4. Use `this.log()` to output; chalk for colors, ora for spinners

**Example**:
```typescript
import { Command } from '@oclif/core';
import chalk from 'chalk';

export default class MyCmd extends Command {
  static description = 'What this does';
  static args = [...];  // oclif Args schema
  static flags = {...}; // oclif Flags schema
  
  async run(): Promise<void> {
    const { args, flags } = await this.parse(MyCmd);
    // implementation
  }
}
```

## Key Conventions

- **Command naming**: kebab-case in filename (e.g., `sync-media.ts` → `vps-mediasync-cli sync-media`)
- **Async/await**: All commands are async; use Promise<void>
- **Errors**: Throw oclif errors or custom errors — oclif handles gracefully
- **Output**: Use `this.log()` from Command.
  - Colorize with chalk: `chalk.green()`, `chalk.red()`, `chalk.yellow()`, `chalk.cyan()`
  - Show progress with ora spinners from `ora` package

## Dependencies

- `@oclif/core`: CLI framework (commands, flags, help, plugins)
- `chalk`: Terminal colors
- `inquirer`: Interactive prompts
- `ora`: Loading spinners
- `@types/node`: TypeScript definitions

## Common Pitfalls

1. **Forgot to build**: After adding a command, run `npm run build`. The CLI loads from `dist/`, not `src/`.
2. **Missing async/await**: oclif expects commands to be async; returning a Promise is required.
3. **Flags/args not parsed**: Always call `this.parse(ClassName)` before using `args` or `flags`.
4. **Import issues**: Ensure default export in command file and correct path in bin/run.js.
5. **ESM entry point**: This project uses oclif v4 with ESM. `bin/run.js` must call `execute({ dir: import.meta.url })`, not `run()`. This is critical for command discovery.

## Testing Commands

Run a single command without building:
```bash
node ./bin/run.js hello
```

Or build and use the bin alias:
```bash
npm run build
npm start hello
# or
vps-mediasync-cli hello
```

## Project Status

- ✅ Scaffolded with oclif, TypeScript, dev dependencies
- ✅ Hello command example (basic)
- ✅ Directory structure ready for expansion
- ⚠️ No tests, CI/CD, or documentation yet
- 📝 Core, services, utils directories reserved for future use

## Next Steps (Suggestions)

- Add new commands following the Command pattern
- Set up npm test script with Jest or Vitest
- Add integration tests for end-to-end command flows
- Create CONTRIBUTING.md if multiple people will work on this

---

**oclif Resources**: [Documentation](https://oclif.io/docs/introduction), [Flags & Args](https://oclif.io/docs/flags_and_args)
