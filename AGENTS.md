
````md
# MediaSync CLI — Agent Instructions

## 1. Before Working on the Project

Read the specifications under:

```text
docs/project/
```

They are the authoritative reference for the product:

* `docs/project/product-requirements.md`
  → product purpose, target users, V1 scope, functional and safety
    requirements, definition of done
* `docs/project/architecture-design.md`
  → architecture, components, runtime, internal pipelines,
    important architectural decisions
* `docs/project/ux-guidelines.md`
  → interaction model, prompts, message style, error UX
* `docs/project/user-guide.md`
  → installation, device setup, command usage
* `docs/project/roadmap.md`
  → current development priorities and longer-term direction

This file (`AGENTS.md`) defines **how a coding agent should work** on the project.

When a task relates to a documented feature, read the relevant specification before implementing it.

Do not duplicate complete product, architecture, or feature specifications in this file.

---

## 2. Project Stack

MediaSync CLI is built with:

* Node.js
* TypeScript
* ESM
* oclif v4
* `@inquirer/prompts`
* `chalk`
* `ora`

Runtime system dependencies:

* ADB
* rsync

Target platform:

* macOS

Node requirement:

```text
>=18
```

---

## 3. Repository Structure

```text
src/
├── commands/       CLI commands and orchestration
├── core/           Domain concepts and shared application logic
├── services/       System integrations and operational logic
└── utils/          Reusable CLI UX helpers

bin/
└── run.js          npm/oclif executable entry point

docs/
├── project/        Product documentation (see §23)
│   ├── product-requirements.md
│   ├── architecture-design.md
│   ├── ux-guidelines.md
│   ├── user-guide.md
│   └── roadmap.md
└── plans/          Per-feature implementation plans

dist/
└──                 Generated TypeScript output
```

Do not treat `src/index.ts` as the CLI entry point.

The actual executable is:

```text
bin/run.js
```

oclif discovers commands from:

```text
dist/commands/
```

---

## 4. Architecture Rules

### Commands

Files under:

```text
src/commands/
```

should remain thin orchestration layers.

They should:

* parse flags
* coordinate workflows
* call prompts
* call services
* present high-level results

Do not put substantial business logic, filesystem logic, ADB logic,
synchronization logic, or cleanup logic directly into command classes.

### Services

Files under:

```text
src/services/
```

contain operational and integration logic.

Examples:

* ADB
* device discovery
* application discovery
* dependency checking
* filesystem operations
* path resolution
* synchronization
* cleanup

Prefer reusable services over duplicating logic across commands.

### Core

Files under:

```text
src/core/
```

contain shared domain concepts and application-level logic.

### Utils

Files under:

```text
src/utils/
```

contain reusable CLI presentation and interaction helpers.

Do not duplicate prompt, spinner, or common formatting logic across commands.

---

## 5. Existing Components

Current commands:

```text
src/commands/
├── backup.ts
├── cleanup.ts
└── hello.ts
```

`hello` is scaffolding only.

Current services:

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

Do not rename or reorganize existing components without a concrete
architectural reason.

---

## 6. Development Workflow

For every non-trivial task:

### Step 1 — Inspect

Before changing code:

* read the relevant source files
* read the relevant specification under `docs/project/`
* understand existing behavior
* identify dependencies between components
* inspect the current Git state

### Step 2 — Plan

Explain:

* what needs to change
* which files will change
* why the changes are required
* how existing behavior will be preserved
* how the change will be tested

For substantial changes, wait for human approval before implementation.

### Step 3 — Implement

Make the smallest coherent change that satisfies the requirement.

Do not:

* rewrite unrelated code
* refactor working components unnecessarily
* introduce new dependencies without justification
* change architecture merely for stylistic reasons
* silently change product behavior

### Step 4 — Build

Run:

```bash
npm run build
```

### Step 5 — Test

Run the affected CLI command(s).

For example:

```bash
vps-mediasync-cli backup
```

or:

```bash
vps-mediasync-cli cleanup --dry-run
```

### Step 6 — Review

Inspect:

```bash
git diff
```

and:

```bash
git status
```

Check for:

* unintended changes
* debug code
* unnecessary dependencies
* unsafe filesystem operations
* broken UX
* unrelated refactoring

### Step 7 — Report

Summarize:

* files changed
* behavior added or changed
* tests performed
* remaining limitations
* any decisions requiring human input

---

## 7. Build Commands

Build:

```bash
npm run build
```

Clean build:

```bash
rm -rf dist
npm run build
```

Run directly:

```bash
node ./bin/run.js --help
node ./bin/run.js --version
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
node ./bin/run.js hello
```

During local development, the project may be globally linked:

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

## 8. TypeScript / ESM Rules

This is an ESM project.

When importing local TypeScript modules, retain the `.js` extension:

```ts
import { logger } from '../core/logger.js';
```

Do not change this to:

```ts
import { logger } from '../core/logger';
```

Commands must be default exports extending oclif's `Command`:

```ts
export default class Backup extends Command {
}
```

Keep TypeScript strictness enabled.

Do not weaken TypeScript configuration merely to make a change compile.

---

## 9. Dependency Rules

ADB and rsync are runtime system dependencies.

Dependency checking belongs in:

```text
src/services/dependency.ts
```

Commands should not independently implement their own ADB/rsync detection.

Before operations requiring these tools, use the existing dependency-checking mechanism.

Do not assume a dependency exists simply because it exists on the developer's machine.

---

## 10. Android / ADB Rules

Use the existing ADB service for ADB-related operations.

Do not duplicate ADB device discovery logic in commands.

Device selection should:

* verify ADB availability
* detect usable devices
* allow the user to select a device
* present human-readable device information
* retain the actual device ID internally

Do not make users enter Android filesystem paths as part of normal workflows.

---

## 11. Backup Rules

The backup workflow is conceptually:

```text
dependencies
    ↓
device selection
    ↓
category selection
    ↓
application selection where applicable
    ↓
path resolution
    ↓
destination selection
    ↓
ADB → temporary directory
    ↓
rsync → permanent destination
    ↓
temporary directory cleanup
```

Preserve this separation.

Do not bypass the temporary extraction stage without an explicit architectural decision.

Do not replace the incremental synchronization mechanism without first understanding the existing `sync.ts` implementation.

---

## 12. Category and Application Rules

Users should select high-level categories such as:

```text
Images
Videos
Downloads
Documents
Audio / Recordings
Applications
```

Do not expose Android filesystem structure unnecessarily.

Application-aware backup should prefer friendly application names such as:

```text
WhatsApp
Telegram
Instagram
Adobe Scan
```

over:

```text
com.whatsapp
org.telegram.messenger
com.instagram.android
```

Application discovery belongs in:

```text
src/services/apps.ts
```

Path mapping belongs in:

```text
src/services/resolver.ts
```

Do not hard-code application-specific behavior into `backup.ts`
unless there is a compelling architectural reason.

---

## 13. Filesystem Rules

Filesystem operations must be defensive.

Before reading, copying, synchronizing, or deleting:

* validate paths
* handle missing paths
* handle inaccessible paths
* avoid accidental traversal outside the intended scope

Do not construct destructive shell commands from unchecked user input.

Prefer existing filesystem services over duplicating filesystem logic.

Never assume a path exists merely because it exists on the development machine.

---

## 14. Cleanup Safety Rules

Cleanup is destructive.

Therefore:

> Never delete user data without explicit confirmation.

The cleanup flow must maintain:

```text
select scope
    ↓
select age
    ↓
identify candidates
    ↓
preview
    ↓
explicit confirmation
    ↓
delete
```

`--dry-run` must never modify Android data.

The cleanup engine belongs in:

```text
src/services/cleanup-engine.ts
```

Do not move destructive logic into the oclif command merely for convenience.

When modifying cleanup behavior, test with:

```bash
vps-mediasync-cli cleanup --dry-run
```

before performing any real deletion.

---

## 15. CLI UX Rules

MediaSync is an interactive utility.

Prefer clear messages such as:

```text
▶ Checking dependencies...
✔ ADB available
✔ Device selected
▶ Backing up images...
✔ Backup complete
```

Use the existing UX utilities:

```text
src/utils/prompt.ts
src/utils/spinner.ts
```

Prefer:

* `select` for single-choice decisions
* `checkbox` for multiple selections
* input prompts for values
* spinners for long-running operations

Avoid:

* unnecessary technical output
* raw Android paths in normal UX
* raw package IDs where friendly names are available
* uncontrolled streams of filenames
* unexplained shell output

Errors should be understandable to normal users.

---

## 16. Error Handling

Do not silently swallow operational failures.

Handle common failures explicitly, including:

* ADB unavailable
* no devices
* unauthorized device
* missing Android path
* inaccessible destination
* rsync failure
* permission errors
* cleanup failures

Do not expose stack traces during normal operation unless a debugging
mechanism explicitly requires them.

Do not invent successful outcomes after a failed operation.

---

## 17. Testing Expectations

There is currently no formal automated test suite.

Therefore every change should at minimum include:

```bash
npm run build
```

plus manual testing of the affected behavior.

Do not claim that a feature is tested merely because TypeScript compiles.

When appropriate, test against a real Android device.

For destructive functionality:

```bash
vps-mediasync-cli cleanup --dry-run
```

must be tested before real cleanup.

When a feature has multiple workflow states, test both the expected
success path and relevant failure/cancellation paths.

---

## 18. Package Testing

Before release:

```bash
npm pack --dry-run
```

Then:

```bash
npm pack
```

Install the generated tarball in a separate environment:

```bash
npm install -g ./vps-mediasync-cli-X.Y.Z.tgz
```

Verify:

```bash
vps-mediasync-cli --version
vps-mediasync-cli --help
```

This tests the actual npm package rather than only the development checkout.

---

## 19. npm Publishing

npm publishing is a release operation.

Do not publish after every development change.

Before publishing:

```bash
npm whoami
npm profile get
npm pkg get name version
npm run build
npm pack --dry-run
```

The package executable configuration must remain:

```json
"bin": {
  "vps-mediasync-cli": "bin/run.js"
}
```

Do not change it to an alternative form without understanding npm/oclif
packaging behavior.

Publishing:

```bash
npm publish
```

After publishing:

```bash
npm view vps-mediasync-cli version
```

Publishing must never be used as a substitute for local testing.

If npm publishing is unavailable because of account, authentication,
security, or registry issues, continue local development and package
testing rather than repeatedly attempting publication.

---

## 20. Versioning

Use semantic versioning.

Bug fix:

```bash
npm version patch
```

Backward-compatible feature:

```bash
npm version minor
```

Breaking change:

```bash
npm version major
```

Do not increment versions merely because development continues.

Only create a release version when the project has reached a meaningful
release milestone.

---

## 21. Git Rules

Before making substantial changes:

```bash
git status
```

After implementation:

```bash
git diff
git status
```

Do not overwrite or discard unrelated user changes.

Do not reset, checkout, or revert user changes unless explicitly instructed.

Keep commits focused and meaningful.

Prefer commits such as:

```text
Add application discovery
Improve Android device selection
Implement cleanup dry-run
Fix backup path resolution
```

Avoid vague commits such as:

```text
Fix stuff
Updates
Changes
```

Do not commit generated artifacts unless the repository explicitly requires them.

---

## 22. Scope Control

When asked to implement a feature:

1. Understand the requested behavior.
2. Read the relevant specification.
3. Inspect the existing implementation.
4. Identify the minimum affected components.
5. Change only what is necessary.
6. Preserve working behavior.
7. Test the affected workflow.
8. Do not perform unrelated refactoring.

If the requested feature reveals an architectural problem:

1. identify the problem
2. explain why it matters
3. propose the smallest reasonable architectural change
4. obtain approval before performing a broad redesign

Do not turn a feature request into an unsolicited rewrite.

---

## 23. Documentation Rules

Documentation responsibilities:

```text
docs/project/product-requirements.md
    → what the product is and must do
      (purpose, users, scope, functional / safety / non-functional
       requirements, definition of done)

docs/project/architecture-design.md
    → how the product is built
      (layers, components, runtime, pipelines, design decisions,
       architectural principles)

docs/project/ux-guidelines.md
    → how the product interacts
      (interaction model, prompts, message style, error UX)

docs/project/user-guide.md
    → how to install and use the product

docs/project/roadmap.md
    → current milestone and future direction

docs/plans/
    → per-feature implementation plans with checklists

AGENTS.md
    → how a coding agent works on the project
      (behavior, development workflow, safety constraints,
       project-specific implementation rules)
```

Keep these responsibilities separate.

When a product requirement changes, update
`docs/project/product-requirements.md`.

When an architectural decision changes, update
`docs/project/architecture-design.md`.

When interaction or UX behavior changes, update
`docs/project/ux-guidelines.md`.

When installation or usage changes, update `docs/project/user-guide.md`.

When development direction changes, update `docs/project/roadmap.md`.

When an agent workflow rule changes, update `AGENTS.md`.

Do not duplicate the same information across these locations.

---

## 24. Current Priority

The current major development milestone is:

### App-aware backup

Focus on:

1. Discovering installed Android applications.
2. Identifying applications relevant to media backup.
3. Presenting friendly application names.
4. Allowing application selection.
5. Resolving application media paths.
6. Integrating application selection into the existing backup workflow.
7. Testing the complete flow against a real Android device.

Do not redesign unrelated parts of MediaSync while implementing this milestone.

---

## 25. Agent Behavior

The agent is an implementation assistant, not the product owner.

For straightforward changes, implement directly.

For non-trivial changes:

```text
inspect
    ↓
understand
    ↓
read relevant specification
    ↓
plan
    ↓
ask for approval
    ↓
implement
    ↓
build
    ↓
test
    ↓
review
    ↓
report
```

When requirements are ambiguous:

* identify the ambiguity
* explain the relevant options
* ask for a decision

Do not silently make significant product or architectural decisions.

Always favor:

* small changes
* explicit reasoning
* existing abstractions
* safety
* testability
* maintainability

over cleverness or unnecessary abstraction.

---

## 26. Plan Documents & Verification

- Multi-step features are planned in `docs/plans/<feature>.md` with a Markdown todo checklist.
- Track progress against that checklist during implementation and report status per item.
- Never mark a task complete until the user verifies the result — ask explicitly.
- Feature work follows the staged workflow: ISSUE → READ REPOSITORY → PLAN →
  IMPLEMENT/EDIT → RUN TESTS → INSPECT RESULT → PATCH (if needed) → TEST AGAIN →
  report (files changed, behavior, tests, side effects, limitations).

````

### Documentation hierarchy

```text
AGENTS.md
    → how to work

docs/project/
    → what the product is, how it is architected, how it interacts,
      how to use it, and where it is going (see §23)
````
