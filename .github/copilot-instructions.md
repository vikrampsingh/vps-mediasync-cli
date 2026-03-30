---
description: "vps-mediasync-cli is a TypeScript CLI utility for backing up and cleaning Android device media. Built with oclif, it provides guided workflows for selecting media categories, syncing files via ADB/rsync, and safely removing old files."
---

# vps-mediasync-cli Workspace Instructions

## Quick Start

- **Build**: `npm run build` compiles TypeScript to `dist/`
- **Run**: `npm start` or `vps-mediasync-cli <command>`
- **Test a command**: `node ./bin/run.js <command>` (bypasses build step)
- **Dev workflow**: After modifying `src/`, run `npm run build` then `npm start <command>` to test

## Project Overview

- **Purpose**: Safely backup and clean media from Android devices (connected via USB or WiFi) to Mac
- **Framework**: [oclif v4](https://oclif.io/) — Open CLI Framework with built-in help, versioning, plugins
- **Language**: TypeScript (ES2022, strict mode enabled)
- **Entry point**: `bin/run.js` → uses oclif's `run()` to load commands
- **Command registration**: oclif auto-discovers commands from `dist/commands/` (configured in `package.json`)
- **UX Philosophy**: Guided-first (interactive prompts), flags-second; intent-based selection over raw folder paths

## Architecture

### Directory Structure

```
bin/           # Node shebang entry point (bin/run.js)
src/
  commands/    # CLI commands (extend Command class from @oclif/core)
    backup.ts      # Sync media from Android device to Mac (primary feature)
    cleanup.ts     # Delete old files from device storage (with --dry-run mode)
    hello.ts       # Example command (can be removed)
  core/        # Domain logic and constants
    categories.ts  # Category types (images, videos, downloads, documents, audio, apps)
    logger.ts      # Logging utilities (step, info, success, warning, error)
  services/    # External integrations and orchestration
    adb.ts         # ADB communication (device detection, property queries)
    device.ts      # Device selection flow (USB/WiFi with human-readable names)
    sync.ts        # File sync engine (ADB pull + rsync for incremental transfer)
    cleanup-engine.ts # File discovery and deletion logic
    filesystem.ts  # Destination folder selection
    dependency.ts  # Dependency checking (ADB, rsync)
    resolver.ts    # Category → file paths mapping
    validate.ts    # Input validation utilities
    apps.ts        # (Reserved) App discovery and app-specific paths
  utils/       # Helper utilities
    prompt.ts      # Interactive prompts (checkbox, select, input from @inquirer/prompts)
    spinner.ts     # Loading spinners (ora package)
dist/          # Compiled JS (generated, not committed)
```

### Command Workflow Pattern

Each command follows a consistent orchestration pattern:

1. **Dependency Check**: `await checkDependencies()` — ensures ADB and rsync are available
2. **Device Selection**: `await selectDevice()` — lists connected devices with human-readable names (brand, model, Android version)
3. **Category/Scope Selection**: `await askCheckbox(...)` — user selects what data types to backup/clean
4. **Path Resolution**: `resolvePaths(categories)` — converts category selection to Android file paths
5. **Execution**: Runs appropriate service (sync, cleanup, etc.) with resolved paths
6. **Output**: Uses logger utilities (step, success, warning, error) and ora spinners for progress

**Backup Command Flow** (in `src/commands/backup.ts`):
```
Check Dependencies → Select Device → Select Categories → Resolve Paths → 
Show Summary → Select Destination → Run Sync (adb pull + rsync)
```

**Cleanup Command Flow** (in `src/commands/cleanup.ts`):
```
Check Dependencies → Select Device → Select Categories → Ask Retention (months) → 
Resolve Paths → Find Old Files → Preview → Execute/Dry-Run Deletion
```



1. Create file in `src/commands/name.ts` extending `Command`
2. Implement `static description` and `async run()` method
3. Use service layer functions to handle business logic
4. Use `askCheckbox()`, `askInput()`, `askSelect()` from `utils/prompt.ts` for interactivity
5. Use `logger` from `core/logger.ts` for structured output
6. Call `npm run build` to compile to `dist/`
7. Test with `node ./bin/run.js name`

**Example Command**:
```typescript
import { Command, Flags } from '@oclif/core';
import { selectDevice } from '../services/device.js';
import { logger } from '../core/logger.js';

export default class MyCmd extends Command {
  static description = 'What this command does';

  static flags = {
    'dry-run': Flags.boolean({
      description: 'Preview action without executing',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(MyCmd);
    
    logger.step('Starting operation');
    
    const device = await selectDevice();
    if (!device) return;
    
    // implementation using services
    logger.success('Complete!');
  }
}
```

## Key Conventions

- **Command naming**: kebab-case in filename (e.g., `sync-media.ts` → `vps-mediasync-cli sync-media`)
- **Async/await**: All commands and service functions are async; always use `Promise<void>` or `Promise<T>`
- **Errors**: Throw oclif `CLIError` or custom errors — oclif handles gracefully with proper formatting
- **Output**: Use logger utilities, not `this.log()` directly
  - `logger.step('Title')` — start a major step (blue)
  - `logger.info('message')` — informational (cyan)
  - `logger.success('message')` — success state (green)
  - `logger.warning('message')` — warnings (yellow)
  - `logger.error('message')` — errors (red)
  - `console.log(...)` — raw output for data/lists
  - Show progress with `ora()` spinners from ora package for long operations
- **Imports**: Use ES6 named imports from modules (end imports with `.js` for ESM)
- **Categories**: Use `CategoryKey` type from `core/categories.ts` when accepting category selections
- **Safety**: Always validate user input, check before destructive operations, support `--dry-run` for cleanup tasks

## Dependencies

- `@oclif/core@^4.10.3`: CLI framework (commands, flags, help, plugins)
- `@inquirer/prompts@^3.0.1`: Interactive prompts (checkbox, select, input, confirm)
- `chalk@^5.6.2`: Terminal colors (green, red, yellow, cyan, etc.)
- `ora@^9.3.0`: Loading spinners and progress indicators
- `@types/node@^25.5.0`: TypeScript definitions for Node.js
- `typescript@^6.0.2`: TypeScript compiler
- **System requirements**: ADB (Android Debug Bridge), rsync (pre-installed on macOS)

## Common Pitfalls & Solutions

1. **Forgot to build**: After modifying `src/`, run `npm run build`. The CLI loads from `dist/`, not `src/`.
   - **Fix**: `npm run build && npm start <command>`

2. **Missing async/await**: oclif expects commands to be async; not returning a Promise will cause hangs.
   - **Fix**: Mark all command run methods and service functions as `async` with return type `Promise<void>` or `Promise<T>`

3. **Flags/args not parsed**: Always call `this.parse(ClassName)` before using `args` or `flags`.
   - **Example**: `const { args, flags } = await this.parse(Cleanup);`

4. **ESM import issues**: This project uses ES6 modules (ESM). All imports must end with `.js`.
   - **Wrong**: `import { logger } from '../core/logger'`
   - **Correct**: `import { logger } from '../core/logger.js'`

5. **Default export required**: Command files must export a default class extending `Command`.
   - **Wrong**: `export class MyCmd extends Command`
   - **Correct**: `export default class MyCmd extends Command`

6. **Device.ts returns null gracefully**: When `selectDevice()` returns null (no device connected), the command should exit early.
   - **Pattern**: `if (!device) return;`

7. **Dependency checking**: Always call `checkDependencies()` at start of command to ensure ADB/rsync available.
   - **Pattern**: `const ready = await checkDependencies(); if (!ready) return;`

8. **Logger over console**: Use `logger.step()`, `logger.success()`, etc. instead of `console.log()` for structured output.
   - **Exception**: Use `console.log()` for displaying data/lists to users

## Development Workflow

### Build and Test Commands

**Option 1: Fast test (skip rebuild)**
```bash
node ./bin/run.js hello
```

**Option 2: Build and test via alias**
```bash
npm run build
npm start backup     # or any command name
```

**Option 3: Full flow (recommended for new code)**
```bash
npm run build && npm start backup
```

### Real Device Testing

- **USB connected**: Device must have USB Debugging enabled
- **WiFi connected**: Run `adb tcpip 5555` on device, then `adb connect <ip>`
- **List connected devices**: `adb devices`
- **Debug a device**: `adb -s <device-id> shell`

## Current Commands

### `backup` (Primary Feature)
Interactively sync media from Android device to Mac.
- **Flow**: Check dependencies → Detect device → Select categories → Choose destination → Run rsync
- **Tech**: ADB pull (for initial fetch), then rsync (for incremental syncs)
- **Safe**: No confirmation needed for initial backup; safe by default

### `cleanup` (Storage Management)
Safely remove old files from device storage.
- **Flow**: Check dependencies → Select device → Select categories → Enter retention (months) → Preview → Delete/Dry-run
- **Flags**: `--dry-run` to preview without deleting
- **Safe**: Always shows preview; supports dry-run mode

### `hello` (Example)
Template command demonstrating basic structure; can be removed.

## Project Status & Roadmap

✅ **Implemented**:
- Device detection and naming (USB + WiFi capable)
- Category-based backup (images, videos, documents, audio, downloads)
- Incremental sync with rsync
- Safe cleanup with dry-run and preview
- Dependency checking (ADB, rsync)
- Interactive prompts for user selection

⚠️ **Planned** (see spec):
- `apps` command: Detect installed apps and enable app-specific backup (e.g., WhatsApp, Telegram)
- `config` command: Persist settings (default backup path, retention period)
- Auto-install dependencies (ADB, rsync)
- GUI wrapper
- Integration tests
- CI/CD pipeline

⏸️ **Future**:
- Cross-platform support (Windows, Linux)
- Plugin system for app handlers
- Bookmark/restore specific backup snapshots

## Service Layer Reference

**Device Management** (`services/device.ts`, `services/adb.ts`):
- Detect connected devices via `adb devices`
- Fetch device properties (model, brand, Android version) for human-readable display
- Handle USB and WiFi connections

**File Sync** (`services/sync.ts`):
- `runAdbPull()` — copy from Android to local temp folder via `adb pull`
- `runRsync()` — incremental sync from temp to destination using `rsync -av --ignore-existing`
- Minimal output to avoid spam; spinners for progress

**Cleanup** (`services/cleanup-engine.ts`):
- Find old files: `adb shell find <path> -type f -mtime +<days>`
- Preview and delete via `adb shell rm`
- Supports dry-run mode for safety

**Utilities**:
- `logger.ts`: Structured logging (step, info, success, warning, error)
- `prompt.ts`: Inquirer-based interactive selections (checkbox, select, input)
- `resolver.ts`: Map categories to Android file paths with validation
- `dependency.ts`: Check ADB and rsync availability
- `filesystem.ts`: Let user choose Mac destination folder

---

**oclif Resources**: [Documentation](https://oclif.io/docs/introduction), [Flags & Args](https://oclif.io/docs/flags_and_args)
