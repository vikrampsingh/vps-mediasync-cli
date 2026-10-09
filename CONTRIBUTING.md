# Contributing to MediaSync CLI

Thanks for your interest in building MediaSync. Contributions of all kinds
are welcome: new features, bug fixes, and documentation improvements.

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).

---

## 1. Ways to Contribute

* **Features** — check [docs/specs/roadmap.md](docs/specs/roadmap.md) for
  the current milestone and planned direction
* **Bug fixes** — small, focused fixes are always welcome
* **Documentation** — corrections and improvements to `docs/` and the README

For larger features, open an issue first to discuss the approach before
investing significant time.

---

## 2. Development Setup

### Prerequisites

* macOS
* Node.js >= 18
* ADB (`brew install android-platform-tools`)
* rsync (pre-installed on macOS)

### Clone, install, build

```bash
git clone https://github.com/vikrampsingh/vps-mediasync-cli.git
cd vps-mediasync-cli
npm install
npm run build
```

### Run the CLI locally

```bash
node ./bin/run.js --help
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
```

Or expose the local build globally:

```bash
npm link
vps-mediasync-cli backup
```

To test against a real device, connect an Android phone with USB debugging
enabled (see [docs/specs/user-guide.md](docs/specs/user-guide.md) §4).

---

## 3. Before Changing Code

1. Read the relevant specification in [docs/specs/](docs/specs/) — they
   describe what the product must do, how it is built, and how it should
   interact with users.
2. Read [AGENTS.md](AGENTS.md) — the repository's workflow and safety rules
   (written for coding agents, but the technical rules apply to everyone).
3. Inspect the existing implementation and its dependencies before editing.

---

## 4. Project Orientation

```text
src/
├── commands/       oclif commands — thin orchestration only
├── core/           domain concepts (categories, logger)
├── services/       operational logic (ADB, sync, cleanup, resolver, ...)
└── utils/          reusable CLI UX helpers (prompts, spinners)
```

* The executable entry point is `bin/run.js`; oclif discovers compiled
  commands from `dist/commands/`. `src/index.ts` is **not** the CLI entry.
* Commands coordinate; services do the work. Do not put filesystem, ADB,
  sync, or cleanup logic directly into command classes.
* Layer and design details: [docs/specs/architecture-design.md](docs/specs/architecture-design.md)

---

## 5. Making Changes

* Keep changes **small and focused** — one concern per PR.
* TypeScript strictness stays enabled; do not weaken `tsconfig` to make
  something compile.
* ESM imports of local modules keep the `.js` extension:

  ```ts
  import { logger } from '../core/logger.js';
  ```

* Filesystem operations must be defensive: validate paths, handle missing or
  inaccessible paths, never build destructive shell commands from unchecked
  input.
* Follow the UX conventions in
  [docs/specs/ux-guidelines.md](docs/specs/ux-guidelines.md): friendly names
  over package IDs, no raw Android paths in normal UX, spinners for long
  operations.
* Preserve working behavior — no unrelated refactoring inside a feature PR.

---

## 6. Testing Your Change

There is no automated test suite yet, so every change requires:

```bash
npm run build
```

plus manual verification of the affected workflow:

```bash
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
```

Rules:

* A feature is not "tested" merely because TypeScript compiles.
* For cleanup changes, always test `--dry-run` **before** any real deletion.
  `--dry-run` must never modify device data.
* Test both the success path and relevant failure/cancellation paths.
* When possible, verify against a real Android device.

---

## 7. Updating Documentation

Documentation is part of the change, not an afterthought. When your change
affects behavior, update the matching document:

| Change | Update |
| ------ | ------ |
| Product requirement / feature scope | `docs/specs/product-requirements.md` |
| Architecture or design decision | `docs/specs/architecture-design.md` |
| Interaction, prompts, messages | `docs/specs/ux-guidelines.md` |
| Installation or usage | `docs/specs/user-guide.md` |
| Development direction | `docs/specs/roadmap.md` |

For multi-step features, add a checklist plan under `docs/plans/<feature>.md`
(see `docs/plans/backup-dry-run.md` for the format).

---

## 8. Submitting a Pull Request

1. Create a feature branch from `main`.
2. Keep commits focused with meaningful messages:

   ```text
   ✔ Add application discovery
   ✔ Fix backup path resolution

   ✗ Fix stuff
   ✗ Updates
   ```

3. Before pushing, review your own diff:

   ```bash
   git status
   git diff
   ```

   Check for unrelated changes, debug code, or accidentally included files.
4. In the PR description, cover:
   * **What** changed and **why**
   * **How** it was tested (commands run, device used)
   * Any limitations or follow-ups
5. **Do not** bump the package version or run `npm publish` in a PR —
   versioning and releases are maintainer activities.

---

## 9. Questions?

Open an issue on
[GitHub](https://github.com/vikrampsingh/vps-mediasync-cli/issues) — whether
it's a bug, a feature idea, or a question about the codebase.
