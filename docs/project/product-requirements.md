# MediaSync Product Requirements

## Purpose and Scope

This document defines the product-level functional requirements for MediaSync. It describes what the product must do, not the detailed interaction flows or technical implementation; those belong in feature specifications and architecture documentation.

Requirements are grouped by roadmap phase and status. Checkboxes indicate tracking state:

- `[x]` Completed — currently available behaviour, as identified for this document.
- `[ ]` In progress — being implemented or validated.
- `[ ]` Planned — agreed requirement not yet implemented.

A checkbox is a status tracker, not a substitute for verification. A requirement should only be marked completed when its behaviour has been validated. Detailed acceptance scenarios and implementation constraints belong in the relevant feature specification.

## Phase 0 — Trust, Safety and Engineering Foundation

**Objective:** Evolve the current CLI into a backup engine that users can trust. Prevent unintended data loss; make behaviour testable and predictable.

### Completed

- [X] **Android device discovery and selection** — Run `vps-mediasync-cli backup` to discover Android devices available through ADB and interactively select the device to back up. No device-selection command-line option is currently documented; selection happens in the prompt flow.
- [X] **Media category selection** — Run `vps-mediasync-cli backup` and choose the supported media categories in the interactive prompts. Category-specific command-line flags are not currently documented.Let users choose supported media categories to include in a backup
- [X] **Destination selection** — Run `vps-mediasync-cli backup` and select the local destination folder interactively, including a folder on attached storage. A destination-path option is not currently documented.Let users select a local folder or an attached storage destination for backed-up media
- [X] **Incremental synchronization** — Run `vps-mediasync-cli backup` to synchronize selected media to the destination through the existing rsync-based workflow. The command has no additional documented sync flags beyond `--dry-run`.Synchronize media to the selected destination using the existing rsync-based workflow
- [X] **Backup dry-run** — Run `vps-mediasync-cli backup --dry-run` to preview planned backup paths and file counts without copying files.Let users preview planned backup paths and file counts without copying files
- [X] **Cleanup dry-run** — Run `vps-mediasync-cli cleanup --dry-run` to preview candidate files for cleanup without deleting them. Run `vps-mediasync-cli cleanup` for the interactive cleanup flow, which requires confirmation before deletion.Let users preview candidate files for cleanup without deleting them

### In Progress

No Phase 0 requirements are marked in progress in this document yet.

### Planned

- [ ] **Predictable device and destination handling** — Keep the selected device and destination explicit throughout an operation, and avoid acting on an unintended device or location.
- [ ] **Safe backup operation** — Preserve the source media during backup and report when an operation cannot complete as intended.
- [ ] **Guarded destructive actions** — Make cleanup actions explicit and reviewable, and require deliberate user confirmation before deletion.
- [ ] **Useful failure reporting** — Explain failures in terms users can act on, including device access, unavailable paths, destination problems, and interrupted operations.
- [ ] **Testable critical operations** — Strengthen automated tests for important paths and failure scenarios so core behaviour can be checked without requiring a connected device wherever practical.
- [ ] **Consistent dependency checks** — Check required external tools using the established dependency-checking service and provide actionable guidance when dependencies are missing.
- [ ] **Reliable engineering and release workflow** — Maintain repeatable build, validation, packaging, and release practices.
- [ ] **Consistent operation outcomes** — Report whether an operation completed, partially completed, failed, or was cancelled, without implying success when work remains incomplete.
- [ ] **Safer interruption handling** — Ensure temporary data and partial operations are handled predictably after errors or interruption.
- [ ] **Explicit safety boundaries** — Document and enforce the guarantees and limitations of backup and cleanup, including cases where the product cannot verify that media is safely backed up.

## Phase 1 — Reliable Backup Engine

**Objective:** Evolve the current CLI into a backup engine that offers users a dependable, incremental, and verifiable backup experience.

### Completed

No Phase 1 requirements are marked completed in this document yet.

### In Progress

No Phase 1 requirements are marked in progress in this document yet.

### Planned

- [ ] **Dependable incremental backups** — Repeated backups should transfer new or changed media without unnecessarily copying all existing media again.
- [ ] **Transfer outcome reporting** — Summarize copied, skipped, failed, and incomplete transfers so users can understand the outcome of a backup.
- [ ] **Backup manifest** — Record enough information about a backup operation and its results to support review and future verification.
- [ ] **Persistent backup history** — Let users review previous backup operations and their outcomes.
- [ ] **Backup verification** — Provide a way to verify backed-up files and identify files that are missing, incomplete, or otherwise not verified.
- [ ] **Interrupted backup recovery** — Handle interrupted or failed operations in a way that allows users to understand what remains incomplete and safely retry.
- [ ] **Repeated-backup consistency** — Ensure repeated operations behave predictably and do not silently remove destination data that is outside the intended operation.
- [ ] **Actionable backup summary** — Present a clear summary of the destination, operation result, outstanding errors, and any limitations that affect confidence in the backup.

## Non-Functional Requirements — Apply Across Phases 0 and 1

These requirements apply to all Phases capabilities unless a requirement or specification explicitly narrows their applicability.

- [ ] **Data safety** — Backup must not delete or modify source media. Destructive cleanup must be a separate, explicit operation with appropriate safeguards.
- [ ] **Predictability** — The same inputs and conditions should lead to consistent, understandable outcomes; unexpected conditions must be reported rather than silently ignored.
- [ ] **Transparency** — Users must be able to understand what the tool attempted, what succeeded, what failed, and what remains uncertain.
- [ ] **Local-first operation** — Media should be handled locally by default, with no requirement to upload personal media to a third-party service for Phase 0 or Phase 1 functionality.
- [ ] **Cross-platform readiness** — Keep product behaviour and core operations structured so additional host operating systems can be supported without duplicating core logic. Actual platform support must be stated only after it is implemented and validated.
- [ ] **Testability** — Core logic should be testable independently of terminal presentation and, where practical, without a connected Android device or real media.
- [ ] **Maintainability** — CLI commands should orchestrate operations while reusable business logic and external integrations remain in appropriate services.
- [ ] **Operational resilience** — Handle expected failures such as disconnected devices, inaccessible source paths, unavailable destinations, insufficient storage, and interrupted transfers without falsely reporting full success.
- [ ] **Privacy** — Avoid unnecessary collection or exposure of personal media, device information, and filesystem details in logs or reports.
- [ ] **Dependency clarity** — Detect required external tools and clearly explain missing or unsupported dependencies instead of assuming they are available.
- [ ] **Usability and accessibility** — Prompts, progress, errors, summaries, and destructive confirmations should use clear language and provide enough context for informed decisions.
- [ ] **Verifiability** — A requirement is complete only after its expected behaviour has been validated; a successful compilation alone does not establish functional correctness.

## Relationship to Other Documents

- [Roadmap](roadmap.md) — communicates product direction, phases, and high-level status.
- [Feature specifications](../specs/) — define detailed behaviour, workflows, edge cases, and verification scenarios for individual features.
- [Architecture design](architecture-design.md) and [architecture decision records](../adr/) — document system structure and the rationale for significant technical choices.
- [Implementation plans](../plans/) — track the execution of non-trivial changes, including validation and outstanding work.
- [User guide](user-guide.md) — explains how to use implemented capabilities.

This document intentionally excludes requirements for Phase 2 and later roadmap phases. Those requirements will be added when those phases are brought into scope.
