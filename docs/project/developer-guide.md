# MediaSync CLI — Developer Guide

Technical reference for developing, testing, and debugging MediaSync CLI.

* Contribution process (branches, PRs, ground rules) → [CONTRIBUTING.md](../../../CONTRIBUTING.md)
* Product documentation (requirements, architecture, UX, usage, roadmap) → the sibling documents in this directory
* Coding-agent workflow rules → [AGENTS.md](../../../AGENTS.md)

---

## 1. Project Structure

```text
vps-mediasync-cli/
├── bin/
│   └── run.js              npm/oclif executable entry point
│
├── src/
│   ├── commands/           oclif commands (thin orchestration)
│   │   ├── backup.ts
│   │   ├── cleanup.ts
│   │   └── hello.ts
│   │
│   ├── core/               domain concepts and shared logic
│   │   ├── categories.ts
│   │   └── logger.ts
│   │
│   ├── services/           operational logic and integrations
│   │   ├── adb.ts
│   │   ├── apps.ts
│   │   ├── cleanup-engine.ts
│   │   ├── dependency.ts
│   │   ├── device.ts
│   │   ├── filesystem.ts
│   │   ├── resolver.ts
│   │   ├── sync.ts
│   │   └── validate.ts
│   │
│   └── utils/              reusable CLI UX helpers
│       ├── prompt.ts
│       └── spinner.ts
│
├── dist/                   generated output — never edit manually
├── docs/                   documentation (see README)
├── package.json
├── tsconfig.json
└── README.md
```

| Directory | Responsibility |
| --------- | -------------- |
| `commands/` | CLI commands and orchestration |
| `core/` | Core concepts / business rules |
| `services/` | ADB, filesystem, sync and other operations |
| `utils/` | Reusable CLI UX |
| `bin/` | npm executable entry point |
| `dist/` | Compiled TypeScript |

A useful rule:

> Commands orchestrate; services do the work.

Full layer responsibilities and design decisions:
[architecture-design.md](architecture-design.md)

---

## 2. Requirements

Development requires:

```bash
node --version
npm --version
adb version
rsync --version
```

Current development environment used for this project:

* Node.js 24.x
* npm 11.x

The package itself supports:

```json
"engines": {
  "node": ">=18"
}
```

The CLI uses the system-installed rsync (macOS ships rsync 2.6.9, which is
the supported baseline — see [product-requirements.md](product-requirements.md) §6.2).

---

## 3. Setup and Build

```bash
git clone https://github.com/vikrampsingh/vps-mediasync-cli.git
cd vps-mediasync-cli
npm install
```

Compile TypeScript:

```bash
npm run build
```

This creates `dist/`. A successful build ends without TypeScript errors.

For a clean rebuild after source changes:

```bash
rm -rf dist
npm run build
```

Never manually edit files inside `dist/`.

---

## 4. Running During Development

### Option A — direct execution (no installation)

```bash
node ./bin/run.js --help
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
```

Fastest loop for quick checks.

### Option B — npm link (preferred while actively developing)

```bash
npm link
```

This exposes the local project globally as `vps-mediasync-cli`:

```bash
vps-mediasync-cli --version
# vps-mediasync-cli/1.0.1 darwin-x64 node-v24.1.0

vps-mediasync-cli --help
```

Remember to rebuild (`npm run build`) after source changes — the linked
command runs the compiled `dist/`.

---

## 5. Testing the Commands

```bash
vps-mediasync-cli --help
vps-mediasync-cli --version
vps-mediasync-cli hello           # scaffolding — verifies interactive UX
vps-mediasync-cli backup
vps-mediasync-cli cleanup
vps-mediasync-cli cleanup --dry-run
vps-mediasync-cli backup --dry-run
```

Note on `--dry-run`: it belongs to the `backup` and `cleanup` commands, not
the root CLI. Therefore this is **not** valid:

```bash
vps-mediasync-cli --dry-run
```

Always test destructive workflows with `--dry-run` first — both commands
support a genuine non-destructive preview mode.

---

## 6. Android Device Testing

Check ADB and connected devices:

```bash
adb devices
```

Expected:

```text
List of devices attached
edd07889    device
```

If you see:

```text
edd07889    unauthorized
```

unlock the Android phone and accept the USB debugging authorization prompt,
then check again. The CLI itself also performs this check and reports
unauthorized devices clearly (see [ux-guidelines.md](ux-guidelines.md) §8).

---

## 7. Device Information

Useful while developing:

```bash
adb -s <device-id> shell getprop ro.product.manufacturer
adb -s <device-id> shell getprop ro.product.model
adb -s <device-id> shell getprop ro.build.version.release
```

Example values:

```text
OnePlus
CPH2487
16
```

The CLI combines these into the human-readable device description:

```text
OnePlus CPH2487 • Android 16 (edd07889)
```

---

## 8. App Discovery Testing

List installed Android packages:

```bash
adb -s <device-id> shell pm list packages
```

The application-discovery implementation lives in:

```text
src/services/apps.ts
```

This is the focus of the current development milestone
([roadmap.md](roadmap.md) §1). The UX must eventually expose:

```text
WhatsApp
Telegram
Instagram
Adobe Scan
```

rather than requiring users to understand:

```text
com.whatsapp
org.telegram.messenger
```

---

## 9. Backup Development Flow

The intended backup flow:

```text
Start backup
    │
    ▼
Check dependencies
    │
    ▼
Select Android device
    │
    ▼
Select categories
    │
    ▼
Select relevant applications        ← current milestone
    │
    ▼
Resolve Android paths
    │
    ▼
Select destination
    │
    ▼
ADB pull → temporary directory
    │
    ▼
rsync → permanent destination
    │
    ▼
Remove temporary directory
```

The user should never need to know Android filesystem paths.

Requirements: [product-requirements.md](product-requirements.md) §4.1
Pipeline design: [architecture-design.md](architecture-design.md) §4

---

## 10. Cleanup Development Flow

The intended cleanup flow:

```text
Start cleanup
    │
    ▼
Check dependencies
    │
    ▼
Select device
    │
    ▼
Select categories
    │
    ▼
Select age threshold
    │
    ▼
Find candidate files
    │
    ▼
Preview
    │
    ▼
Confirmation
    │
    ├── No → exit
    │
    └── Yes → delete
```

For testing, always start with:

```bash
vps-mediasync-cli cleanup --dry-run
```

Cleanup performs destructive operations — dry-run first, always.

Safety requirements: [product-requirements.md](product-requirements.md) §5

---

## 11. Git Rhythm

Before asking an agent (or yourself) to modify the project:

```bash
git status
```

Ideally:

```text
nothing to commit, working tree clean
```

Inspect changes and history:

```bash
git diff
git log --oneline --decorate -10
```

A good development rhythm:

```text
feature
  ↓
build
  ↓
test
  ↓
git diff
  ↓
commit
  ↓
push
```

Commit and PR conventions: [CONTRIBUTING.md](../../CONTRIBUTING.md) §8
Agent-assisted workflow: [AGENTS.md](../../AGENTS.md) §6

---

## 12. Package Configuration

Important sections of `package.json`:

```json
{
  "name": "vps-mediasync-cli",
  "version": "1.0.1",
  "type": "module",
  "bin": {
    "vps-mediasync-cli": "bin/run.js"
  },
  "oclif": {
    "commands": "./dist/commands",
    "bin": "vps-mediasync-cli"
  }
}
```

The `bin` path must remain:

```json
"bin": {
  "vps-mediasync-cli": "bin/run.js"
}
```

We previously discovered that npm 11 auto-corrected the older form
`"./bin/run.js"` during publishing and removed the executable definition.
The current form is valid and must be preserved. npm's `bin` field maps the
installed command name to the executable file.

---

## 13. Pre-Release Package Testing

Test the actual npm package locally before any release.

Preview what npm would publish (no tarball created):

```bash
npm pack --dry-run
```

Create and inspect the tarball:

```bash
npm run build
npm pack
tar -tzf vps-mediasync-cli-1.0.1.tgz
```

Test global installation from the tarball — the closest local simulation of
`npm install -g vps-mediasync-cli`:

```bash
cd /tmp
npm install -g /full/path/to/vps-mediasync-cli-1.0.1.tgz
vps-mediasync-cli --version
vps-mediasync-cli --help
```

This catches problems with `package.json`, `bin/run.js`, oclif command
discovery, `dist/`, dependencies, and global executable installation.
(`*.tgz` is gitignored — tarballs never belong in the repository.)

> Releasing to npm is a **maintainer-only** operation. The full release
> runbook is kept privately by the maintainer and is not part of this
> repository. Contributors propose changes through pull requests; the
> maintainer reviews, merges, versions, and publishes.
