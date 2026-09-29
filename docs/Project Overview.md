
# MediaSync CLI — Project & Architecture

## 1. Project Overview

MediaSync CLI is an interactive command-line application for managing media
between Android devices and a Mac.

The primary goals are:

- Back up media from an Android device to a Mac or attached storage.
- Incrementally synchronize backed-up media.
- Clean old media from an Android device in a controlled and safe manner.
- Hide Android filesystem complexity from the user.
- Provide a simple, interactive CLI experience rather than requiring users
  to remember ADB commands or Android storage paths.

The package is distributed as:

    vps-mediasync-cli

The primary target platform is macOS.

---

## 2. Product Philosophy

MediaSync should behave like a small utility application rather than a
collection of low-level ADB commands.

Users should think in terms of:

- Images
- Videos
- Downloads
- Documents
- Audio / Recordings
- Applications

and not in terms of:

- `/sdcard/DCIM/Camera`
- `/sdcard/Android/media/...`
- ADB pull commands
- rsync commands

The application is responsible for translating user intent into the
appropriate Android filesystem operations.

### Core principle

> The user describes WHAT they want to manage; MediaSync determines HOW
> to access it.

---

## 3. Primary Commands

### `backup`

Backs up selected media from an Android device.

Expected workflow:

1. Check required dependencies.
2. Detect connected Android devices.
3. Ask the user to select a device.
4. Ask which media categories should be backed up.
5. Where appropriate, detect relevant installed applications.
6. Ask the user which applications should be included.
7. Resolve categories and applications into Android paths.
8. Ask the user to select a destination.
9. Pull data from Android into temporary local storage.
10. Incrementally synchronize temporary data to the permanent destination.
11. Remove temporary data.
12. Report the result.

### `cleanup`

Removes old media from an Android device.

Expected workflow:

1. Check required dependencies.
2. Select Android device.
3. Select categories.
4. Specify an age threshold.
5. Identify candidate files.
6. Preview what will be removed.
7. Request explicit confirmation.
8. Delete only after confirmation.
9. Report the result.

`--dry-run` must never delete files.

### `hello`

`hello` is scaffolding used to test the CLI's interactive UX.

It is not part of the product's core functionality.

---

## 4. Architecture

The project follows a layered CLI architecture.

```text
CLI
 │
 ▼
commands/
 │
 ▼
core/
 │
 ▼
services/
 │
 ▼
Operating System / Android / External Tools
````

More precisely:

```text
src/
├── commands/
├── core/
├── services/
└── utils/
```

### `commands/`

Contains oclif command implementations.

Responsibilities:

* Parse command arguments and flags.
* Coordinate the workflow.
* Ask the user for input.
* Call services.
* Present high-level results.

Commands should remain thin.

They should not contain large amounts of filesystem, ADB, synchronization,
or cleanup logic.

### `core/`

Contains domain-level concepts and shared application logic.

Examples:

* Categories.
* Logging conventions.
* Shared business rules.

Core code should not depend unnecessarily on CLI presentation details.

### `services/`

Contains system integrations and operational logic.

Examples:

* ADB interaction.
* Device discovery.
* Application discovery.
* Dependency checking.
* Filesystem operations.
* Path resolution.
* Synchronization.
* Cleanup.

Services should be reusable independently of a particular oclif command
where practical.

### `utils/`

Contains reusable CLI presentation helpers.

Examples:

* Input prompts.
* Select prompts.
* Checkbox prompts.
* Spinners.
* Formatting helpers.

UX implementation should be centralized here rather than duplicated
throughout commands.

---

## 5. Current Components

### Commands

```text
src/commands/
├── backup.ts
├── cleanup.ts
└── hello.ts
```

### Core

```text
src/core/
├── categories.ts
└── logger.ts
```

### Services

```text
src/services/
├── adb.ts
├── apps.ts
├── cleanup-engine.ts
├── dependency.ts
├── device.ts
├── filesystem.ts
├── resolver.ts
├── sync.ts
└── validate.ts
```

### Utilities

```text
src/utils/
├── prompt.ts
└── spinner.ts
```

---

## 6. Runtime Architecture

The application is a Node.js ESM application written in TypeScript.

Source code is compiled into:

```text
dist/
```

The executable entry point is:

```text
bin/run.js
```

oclif discovers commands from:

```text
dist/commands/
```

The `src/index.ts` file is not the CLI entry point.

Do not introduce a second CLI entry mechanism without a specific architectural
reason.

---

## 7. Backup Architecture

The backup architecture intentionally separates Android extraction from
permanent synchronization.

```text
Android Device
      │
      │ ADB
      ▼
Temporary Local Directory
      │
      │ rsync
      ▼
Permanent Backup Destination
```

### Why temporary storage?

The temporary directory provides a boundary between:

* extracting data from Android
* synchronizing data to the final destination

This makes the workflow easier to reason about and provides a place to
validate and organize extracted data before permanent synchronization.

### Incremental synchronization

The permanent destination should not be unnecessarily recopied.

rsync is used to synchronize data incrementally.

The implementation must remain compatible with the rsync version available
on the target Mac.

Do not assume that all macOS installations have the same rsync version.

Avoid rsync options that are unavailable in the supported baseline version
unless the compatibility strategy is explicitly changed.

---

## 8. Android Device Handling

ADB is the underlying Android communication mechanism.

The application should:

1. Verify that ADB is available.
2. Detect connected devices.
3. Ignore devices that are not usable.
4. Always ask the user to select a device, even when only one device is
   connected.
5. Present a human-readable device description.

Example:

```text
OnePlus CPH2487 • Android 16 (edd07889)
```

The device ID remains useful and should be displayed, but it should not be
the primary user-facing description.

ADB can work with both USB-connected and network-connected devices as long
as they are visible through:

```bash
adb devices
```

MediaSync does not need to expose the underlying ADB connection mechanism
to normal users.

---

## 9. Media Categories

Users should select high-level categories.

Current conceptual categories:

```text
Images
Videos
Downloads
Documents
Audio / Recordings
Applications
```

Categories are resolved internally to one or more Android paths.

Example:

```text
Images
    ↓
DCIM/Camera
DCIM/Screenshots
Pictures
```

The exact mapping belongs in:

```text
src/services/resolver.ts
```

The category model belongs in:

```text
src/core/categories.ts
```

Do not expose raw Android paths as the primary UX.

---

## 10. Application-Aware Backup

Application-aware media backup is an important part of the product direction.

Many Android applications store user-generated media under application-specific
directories.

The intended experience is:

```text
Applications

☐ WhatsApp
☐ Telegram
☐ Instagram
☐ Adobe Scan
...
```

rather than:

```text
☐ com.whatsapp
☐ org.telegram.messenger
...
```

The application layer should therefore:

1. Discover installed packages through ADB.
2. Identify applications relevant to media management.
3. Resolve package identifiers into friendly names where possible.
4. Let the user select applications.
5. Resolve selected applications to their media locations.
6. Integrate the resulting paths into the normal backup workflow.

This functionality should evolve toward dynamic discovery rather than
maintaining a permanently hard-coded list of applications.

---

## 11. Destination Selection

The backup destination should be selected interactively.

The destination may be:

* a directory on the Mac
* an attached external drive
* another mounted filesystem

The user should be able to navigate the local filesystem.

Hidden system/configuration directories should generally be hidden from the
normal selection experience to reduce clutter.

The filesystem selector belongs in:

```text
src/services/filesystem.ts
```

The user should select a destination folder rather than having to provide
an Android-style path or construct shell commands.

---

## 12. Dependency Management

The CLI depends on external system tools.

Current runtime dependencies:

```text
ADB
rsync
```

Dependency checking belongs in:

```text
src/services/dependency.ts
```

The application should:

* detect missing dependencies
* explain what is missing
* provide installation guidance
* automatically install dependencies only where this is safe and supported
* verify that installation succeeded before continuing

The CLI should not silently assume that required system tools exist.

---

## 13. Cleanup Safety

Cleanup is inherently destructive.

Therefore:

> No destructive cleanup operation should occur without explicit user
> confirmation.

The cleanup flow must provide:

* clear scope
* age threshold
* candidate preview
* explicit confirmation

`--dry-run` must provide a genuine non-destructive preview.

The implementation must never treat `--dry-run` as merely a display option
while still allowing deletion through another execution path.

Path validation should happen before deletion.

Deletion logic belongs in:

```text
src/services/cleanup-engine.ts
```

The oclif command should primarily orchestrate the interaction.

---

## 14. CLI UX Principles

The CLI should feel like an interactive utility application.

Prefer:

```text
✔ ADB available
✔ Device selected
✔ Destination selected
▶ Backing up images...
✔ Backup complete
```

over raw shell output.

Use:

* prompts for choices
* checkboxes for multiple selections
* spinners for operations that take time
* clear success/warning/error messages
* concise summaries

Avoid:

* unnecessary technical details
* raw package identifiers where friendly names are available
* raw Android paths in normal UX
* large streams of filenames
* unexplained shell errors

Technical details can be exposed when useful for troubleshooting.

---

## 15. Error Handling

Errors should be handled at the appropriate layer.

Services should detect and report operational failures.

Commands should turn those failures into understandable CLI outcomes.

Examples:

* ADB unavailable
* no Android device connected
* Android device unauthorized
* destination inaccessible
* source path unavailable
* rsync failure
* insufficient permissions
* cleanup candidate discovery failure

Do not swallow errors silently.

At the same time, avoid exposing raw stack traces to normal users unless
running in an explicit debugging/developer mode.

---

## 16. TypeScript / ESM Conventions

The project uses TypeScript with ESM.

Imports should retain `.js` extensions:

```ts
import { logger } from '../core/logger.js';
```

even though the source file is:

```text
logger.ts
```

oclif commands should:

* extend `Command`
* use a default export

Example:

```ts
export default class Backup extends Command {
  ...
}
```

Keep TypeScript strictness enabled.

---

## 17. Development Commands

Build:

```bash
npm run build
```

Run directly:

```bash
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
node ./bin/run.js hello
```

Help:

```bash
node ./bin/run.js --help
```

Version:

```bash
node ./bin/run.js --version
```

During development, `npm link` can expose the local project globally:

```bash
npm link
```

Then:

```bash
vps-mediasync-cli --help
vps-mediasync-cli backup
vps-mediasync-cli cleanup --dry-run
```

---

## 18. Testing Strategy

The project currently does not have a formal automated test suite.

Until one is introduced, every meaningful change should at minimum include:

1. TypeScript build.
2. Relevant CLI execution.
3. Manual verification of affected behavior.
4. `git diff` review.

Build:

```bash
npm run build
```

Inspect:

```bash
git diff
```

Check repository state:

```bash
git status
```

Do not consider a feature complete merely because TypeScript compiles.

---

## 19. Package Testing

Before publishing:

```bash
npm pack --dry-run
```

Then create the actual package:

```bash
npm pack
```

Install the resulting tarball into a separate environment:

```bash
npm install -g ./vps-mediasync-cli-X.Y.Z.tgz
```

Then verify:

```bash
vps-mediasync-cli --version
vps-mediasync-cli --help
```

This should be treated as a release validation step.

---

## 20. npm Distribution

The package is intended to be distributed through npm:

```text
vps-mediasync-cli
```

The package executable is:

```text
vps-mediasync-cli
```

The package uses:

```json
"bin": {
  "vps-mediasync-cli": "bin/run.js"
}
```

Do not change this to an alternative entry point without understanding the
oclif packaging implications.

Publishing is a release activity, not part of normal development.

The normal development loop should work without publishing to npm.

---

## 21. Release Process

A release should follow this general sequence:

```text
Implement
   ↓
Build
   ↓
Test locally
   ↓
Review git diff
   ↓
Package with npm pack
   ↓
Test package installation
   ↓
Bump semantic version
   ↓
Build again
   ↓
npm pack --dry-run
   ↓
npm publish
   ↓
Verify npm registry
   ↓
Git commit/tag/push
```

Version changes should follow semantic versioning.

Examples:

```bash
npm version patch
npm version minor
npm version major
```

Do not bump the version merely because development continues.

---

## 22. Git Strategy

GitHub is the canonical source repository.

Keep commits focused on coherent changes.

Prefer:

```text
Add application discovery
Fix backup path resolution
Improve device selection
Add cleanup dry-run
```

over:

```text
Various changes
Updates
Fix stuff
```

Before allowing substantial automated changes:

```bash
git status
```

Afterward:

```bash
git diff
```

Review unrelated changes before committing.

---

## 23. Agent-Assisted Development

OpenCode is used as the coding agent for the project.

The agent should follow this workflow:

```text
Understand
   ↓
Inspect existing implementation
   ↓
Propose plan
   ↓
Human approval
   ↓
Implement
   ↓
Build
   ↓
Test
   ↓
Review diff
   ↓
Human approval
   ↓
Commit
```

For non-trivial changes, the agent should not immediately modify the
repository.

It should first:

* inspect relevant files
* identify dependencies
* explain its understanding
* propose affected files
* describe the implementation approach

The human developer remains responsible for product and architectural
decisions.

---

## 24. Current Development Priorities

The next major development milestone is application-aware backup.

### Priority 1 — Application discovery

Improve:

```text
src/services/apps.ts
```

to discover relevant applications dynamically.

### Priority 2 — Friendly application names

Present useful names rather than raw package identifiers.

### Priority 3 — Application media resolution

Map selected applications to their appropriate media locations.

### Priority 4 — Integrate with backup

Connect application selection to:

```text
backup.ts
→ resolver.ts
→ sync.ts
```

without unnecessarily changing unrelated components.

### Priority 5 — End-to-end testing

Test with a real Android device and representative applications.

---

## 25. Future Direction

Potential future capabilities include:

* better dynamic Android media discovery
* richer application metadata
* Wi-Fi pairing/setup assistance
* improved backup progress reporting
* backup history
* backup verification
* resumable backups
* stronger cleanup filtering
* automated tests
* structured logging/debug mode
* cross-platform support
* standalone binary distribution
* richer recovery/error handling
* optional GUI

These are future possibilities, not current requirements.

Do not implement them unless they become an explicit development milestone.

---

## 26. Architectural Principles

The following principles should remain stable unless there is a deliberate
architectural decision to change them.

### Principle 1 — User intent over implementation details

Users select what they want, not Android paths.

### Principle 2 — Thin commands

Commands coordinate; services perform operations.

### Principle 3 — Safety first

Especially for cleanup and filesystem operations.

### Principle 4 — Incremental development

Prefer small, testable changes over broad rewrites.

### Principle 5 — Preserve working behavior

Do not rewrite working components simply to make the architecture look
different.

### Principle 6 — Explicit dependencies

ADB and rsync are external system dependencies and must be detected.

### Principle 7 — Separate extraction from synchronization

ADB extraction and permanent rsync synchronization are deliberately
separate stages.

### Principle 8 — Human-readable UX

Technical identifiers should be used internally wherever possible and
translated into meaningful user-facing information.

### Principle 9 — Human-controlled agentic development

Coding agents can implement and test changes, but significant architectural
and product decisions remain human-approved.

### Principle 10 — Publishing is a release activity

Local development, testing and Git workflows must not depend on successful
npm publication.

````

