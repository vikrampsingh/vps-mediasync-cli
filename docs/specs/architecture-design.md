# MediaSync CLI — Architecture & Design

This document describes **how MediaSync is built**: its structure, runtime,
internal pipelines, and the design decisions that must remain stable.

* What it must do → `product-requirements.md`
* How it interacts → `ux-guidelines.md`

---

## 1. Layered Architecture

The project follows a layered CLI architecture:

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
```

Source layout:

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

Commands remain thin. They must not contain large amounts of filesystem,
ADB, synchronization, or cleanup logic.

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

UX implementation is centralized here rather than duplicated throughout
commands.

---

## 2. Current Components

### Commands

```text
src/commands/
├── backup.ts
├── cleanup.ts
└── hello.ts
```

`hello` is scaffolding used to test the CLI's interactive UX. It is not part
of the product's core functionality.

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

## 3. Runtime Architecture

The application is a Node.js (>=18) ESM application written in TypeScript.

Source code is compiled with `tsc` into:

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

Do not introduce a second CLI entry mechanism without a specific
architectural reason.

Technology stack:

* Node.js (ESM), TypeScript
* `@oclif/core` — CLI framework
* `@inquirer/prompts` — prompts
* `chalk` — colors
* `ora` — spinners
* ADB via `child_process` — device communication
* rsync — incremental synchronization

---

## 4. Backup Pipeline Architecture

The backup architecture intentionally separates Android extraction from
permanent synchronization:

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

The permanent destination should not be unnecessarily recopied. rsync is
used to synchronize data incrementally, within the compatibility constraints
defined in `product-requirements.md` (§6.2).

Do not replace the incremental synchronization mechanism without first
understanding the existing `src/services/sync.ts` implementation.

---

## 5. ADB / Device Integration Layer

ADB is the underlying Android communication mechanism. All ADB-related
operations go through the ADB service (`src/services/adb.ts`); device
discovery lives in `src/services/device.ts`.

### Responsibilities

* Detect connected devices.
* Execute shell commands on the device.
* List files.
* Pull files.
* Delete files (cleanup only, after confirmation).

### Key operations

```text
getConnectedDevice()
listFiles(path)
pullFiles(remotePath, localPath)
deleteFiles(paths)
```

### Constraints

* Must not assume device root access.
* Must handle:
  * no device connected
  * multiple devices
  * unauthorized devices
  * permission issues

ADB works with both USB-connected and network-connected devices as long as
they are visible through `adb devices`. MediaSync does not expose the
underlying connection mechanism to normal users.

Device-selection behavior (always ask, human-readable descriptions) is a UX
concern specified in `ux-guidelines.md`.

---

## 6. Category & Path Resolution

Users select high-level categories:

```text
Images
Videos
Downloads
Documents
Audio / Recordings
Applications
```

Categories are resolved internally to one or more Android paths:

```text
Images
    ↓
DCIM/Camera
DCIM/Screenshots
Pictures
```

The category model belongs in:

```text
src/core/categories.ts
```

The category/application → path mapping belongs in:

```text
src/services/resolver.ts
```

### App → path mapping

Application media locations are resolved the same way, e.g.:

```text
WhatsApp    → /sdcard/WhatsApp/Media
Camera      → /sdcard/DCIM/Camera
Screenshots → /sdcard/Pictures/Screenshots
Downloads   → /sdcard/Download
```

The mapping layer should remain extensible: new mappings can be added, and
the long-term direction is dynamic detection (see `roadmap.md`).

Raw Android paths are never the primary user-facing interface; they are
internal resolution results.

---

## 7. Application Discovery

Application discovery belongs in:

```text
src/services/apps.ts
```

Design direction:

1. Discover installed packages through ADB.
2. Identify applications relevant to media management.
3. Resolve package identifiers into friendly names where possible.
4. Resolve selected applications to their media locations via `resolver.ts`.
5. Integrate the resulting paths into the normal backup workflow.

Application-specific behavior should not be hard-coded into `backup.ts`
unless there is a compelling architectural reason.

---

## 8. Filesystem & Destination Handling

The filesystem selector belongs in:

```text
src/services/filesystem.ts
```

The backup destination is selected interactively and may be:

* a directory on the Mac
* an attached external drive
* another mounted filesystem

Hidden system/configuration directories are generally hidden from the normal
selection experience to reduce clutter.

### Defensive filesystem rules

Before reading, copying, synchronizing, or deleting:

* validate paths
* handle missing paths
* handle inaccessible paths
* avoid accidental traversal outside the intended scope

Do not construct destructive shell commands from unchecked user input.

Never assume a path exists merely because it exists on the development
machine.

---

## 9. Dependency Management Design

ADB and rsync are runtime system dependencies.

Dependency checking belongs in:

```text
src/services/dependency.ts
```

Commands do not independently implement their own ADB/rsync detection.
Before operations requiring these tools, the existing dependency-checking
mechanism is used.

---

## 10. Cleanup Engine Design

Deletion logic belongs in:

```text
src/services/cleanup-engine.ts
```

The oclif command orchestrates the interaction; the engine performs
candidate discovery, validation, and deletion.

Implementation guarantees:

* Path validation happens before deletion.
* `--dry-run` performs only read-only discovery and preview; it returns
  before any deletion path can execute.
* Destructive logic is not moved into the command layer for convenience.

---

## 11. TypeScript / ESM Conventions

The project uses TypeScript with ESM.

Imports retain `.js` extensions:

```ts
import { logger } from '../core/logger.js';
```

even though the source file is `logger.ts`.

oclif commands:

* extend `Command`
* use a default export

```ts
export default class Backup extends Command {
  ...
}
```

TypeScript strictness stays enabled. Do not weaken the TypeScript
configuration merely to make a change compile.

---

## 12. Architectural Principles

The following principles remain stable unless there is a deliberate
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

Technical identifiers are used internally and translated into meaningful
user-facing information.

### Principle 9 — Human-controlled agentic development

Coding agents can implement and test changes, but significant architectural
and product decisions remain human-approved.

### Principle 10 — Publishing is a release activity

Local development, testing and Git workflows must not depend on successful
npm publication.
