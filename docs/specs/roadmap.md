# MediaSync CLI — Roadmap

This document tracks **where the product is going**: the current milestone,
near-term features, and longer-term possibilities.

Items listed here are direction, not commitments. Do not implement future
capabilities unless they become an explicit development milestone.

---

## 1. Current Milestone — Application-Aware Backup

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

Do not redesign unrelated parts of MediaSync while implementing this
milestone.

---

## 2. Near-Term Features (post-milestone candidates)

These features were part of the original product vision but are not yet
implemented. Each requires its own specification and plan before work
begins.

### `config` command

```bash
vps-mediasync-cli config set <key> <value>
```

* Store defaults such as backup path and retention period.
* Persist configuration in a local file.

### `apps` discovery command

```bash
vps-mediasync-cli apps
```

* List installed applications relevant to media backup.
* Show app → storage path mapping.
* Allow inspection outside the backup workflow.

### Richer backup flags

Extend the guided-first model with advanced-mode flags, e.g. category and
time-range filters for non-interactive runs.

---

## 3. Longer-Term Possibilities

* Better dynamic Android media discovery
* Richer application metadata
* Wi-Fi pairing/setup assistance
* Improved backup progress reporting (progress bars)
* Backup history
* Backup verification
* Resumable backups
* Stronger cleanup filtering
* Smart recommendations (e.g. "You can free 3 GB by deleting old WhatsApp
  videos")
* Automated tests
* Structured logging / debug mode
* Cross-platform support
* Standalone binary distribution (e.g. via GitHub releases)
* Richer recovery/error handling
* Conversational CLI input
* Optional GUI wrapper (Electron or web-based)

These are future possibilities, not current requirements.

---

## 4. Release Milestones

Version changes follow semantic versioning and are cut only at meaningful
release milestones — not merely because development continues (see
`AGENTS.md` §20).
