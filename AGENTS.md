# MediaSync CLI --- Agent Instructions

## 1. Purpose and Context

MediaSync CLI is a local-first media management tool focused on reliable
media backup and safe cleanup, initially targeting Android devices and
macOS.

Before making changes: - Inspect the relevant implementation, repository
structure, and Git state. - Read the documentation relevant to the
task. - Check `docs/specs/` for applicable feature specifications. -
Check `docs/adr/` for relevant architecture decisions. - Treat the
implementation as the source of truth for current behavior;
documentation may describe intended or future behavior. - Avoid
duplicate abstractions, documentation, and functionality. - Keep changes
focused and preserve existing behavior unless the task requires a
change.

This file defines how AI coding agents should work. It does not replace
product specifications or authorize the agent to make unresolved product
or architectural decisions.

## 2. Documentation Map

-   `README.md` --- project overview, installation, quick start, and
    primary entry point.
-   `CONTRIBUTING.md` --- contribution workflow and development
    expectations.
-   `AGENTS.md` --- instructions for AI coding agents.
-   `SECURITY.md` --- security reporting and supported security
    practices.
-   `docs/project/product-requirements.md` --- product goals,
    requirements, scope, and constraints.
-   `docs/project/architecture-design.md` --- architecture and major
    design choices.
-   `docs/project/developer-guide.md` --- development environment,
    commands, and implementation guidance.
-   `docs/project/user-guide.md` --- user-facing workflows and command
    usage.
-   `docs/project/ux-guidelines.md` --- CLI interaction, prompts,
    progress, errors, and safety-related UX.
-   `docs/project/roadmap.md` --- planned capabilities and development
    priorities.
-   `docs/plans/` --- implementation plans for non-trivial work.
-   `docs/specs/` --- feature specifications defining intended behavior
    and acceptance criteria.
-   `docs/adr/` --- architecture decision records.
-   `docs/private/` --- maintainer-local material only; contents must
    remain ignored and must not be committed.

Read only the documents relevant to the task. Do not load every document
by default.

Keep private operational information, credentials, tokens, and
account-specific release details out of public documentation. A
directory named `private` is not automatically excluded from Git; verify
ignore rules before adding sensitive material.

When documentation paths change, update affected references rather than
creating duplicate copies.

## 3. Technology Stack and Repository Structure~

The project uses: - Node.js and TypeScript with ECMAScript modules
(ESM). - oclif v4 for CLI commands. - `@inquirer/prompts` for
interactive input. - `chalk` for terminal styling. - `ora` for progress
indicators. - ADB and rsync as external runtime dependencies.

The initial target is Android media management from macOS. Do not claim
support for other operating systems, device types, or connection modes
unless the implementation and tests establish it.

Follow the existing repository structure. Important areas include: -
`src/commands/` --- CLI command entry points and workflow
orchestration. - `src/services/` --- operational logic and integrations,
including device, dependency, filesystem, path resolution,
synchronization, and cleanup behavior. - `src/core/` --- shared domain
concepts and application-level logic, where present. - `src/utils/` ---
reusable CLI presentation and interaction helpers, where present. -
`bin/run.js` --- executable entry point. - `dist/` --- generated
TypeScript output. - `docs/` --- project documentation.

Inspect the actual tree before relying on a path or assuming a module
exists. oclif discovers compiled commands from `dist/commands`; do not
assume the application is launched through `src/index.ts`.

## 4. Architecture Rules

-   Keep command handlers focused on argument parsing, orchestration,
    prompts, and high-level results.
-   Put reusable operational logic and external integrations in
    appropriate services.
-   Keep domain logic independent of terminal presentation where
    practical.
-   Reuse established helpers and patterns before introducing new
    abstractions.
-   Avoid unnecessary dependencies and architectural complexity.
-   Keep business logic testable without a connected Android device
    wherever practical.
-   Do not duplicate functionality across commands or services.
-   Consult relevant ADRs before making changes that conflict with
    established decisions.
-   Do not rename or reorganize existing components without a concrete
    reason and an appropriately scoped plan.

Use the existing service responsibilities where they exist: -
`src/services/dependency.ts` --- checks for required external
dependencies such as ADB and rsync. - `src/services/device.ts` --- ADB
device discovery and device-related operations. - `src/services/apps.ts`
--- application discovery. - `src/services/resolver.ts` --- mapping
selected categories or applications to source paths. -
`src/services/filesystem.ts` --- filesystem operations. -
`src/services/sync.ts` --- synchronization using rsync. -
`src/services/cleanup-engine.ts` --- cleanup candidate processing and
deletion workflow. - `src/utils/prompt.ts` and `src/utils/spinner.ts`
--- shared terminal interaction helpers.

These paths describe expected responsibilities based on the existing
design. Verify the current tree and implementation before editing or
relying on a particular module.

## 5. Development Workflow

For non-trivial work: 1. Inspect the repository, relevant code,
documentation, dependencies, tests, and Git status. 2. Understand
current behavior, requirements, constraints, and the intended outcome.
3. Create or update a written plan under `docs/plans/` before
implementation. 4. Identify the smallest coherent implementation,
affected areas, risks, and validation strategy. 5. Implement focused
changes consistent with the existing architecture. 6. Build and run
relevant tests. 7. Review the complete diff for correctness, unintended
changes, and missing documentation. 8. Address issues found and repeat
relevant validation. 9. Update the plan with actual progress, decisions,
blockers, deviations, and verification evidence. 10. Report the changes
and the validation actually performed.

Small, straightforward changes do not require a separate implementation
plan. Use judgment: a change is non-trivial when it involves multiple
steps, meaningful risk, behavior changes, architectural/refactoring
work, or coordinated documentation, dependency, tooling, build, test, or
configuration changes.

For significant, risky, destructive, or approval-dependent changes,
present the plan and obtain the project author's approval before
implementation where required. A written plan is not itself approval. Do
not silently make material product or architectural decisions.

Do not claim that a build, test, or manual verification passed unless it
was actually performed.

## 6. TypeScript, ESM, and oclif Conventions

-   Preserve the existing TypeScript configuration and strictness.
-   Use `.js` extensions in relative imports between local TypeScript
    modules when required by the project's ESM conventions.
-   Follow the existing oclif command structure and default-export
    conventions.
-   Prefer explicit types and clear interfaces over unnecessary
    complexity.
-   Avoid introducing `any` or suppressing type errors without a
    justified reason.
-   Do not weaken compiler settings to make a change pass.
-   Follow existing naming, formatting, and error-handling conventions.

Example ESM import:

``` ts
import { logger } from '../core/logger.js';
```

## 7. Device and Dependency Handling

-   Use the established dependency service rather than duplicating ADB
    or rsync checks in command handlers.
-   Before an operation requiring ADB or rsync, check the required
    dependency using the existing mechanism.
-   Handle missing dependencies, absent devices, unauthorized devices,
    disconnected devices, failed commands, and inaccessible paths
    gracefully.
-   Device selection must retain the actual device ID internally while
    presenting useful human-readable device information.
-   Ensure every device-specific operation targets the intended selected
    device; propagate the selected device ID through the complete
    workflow.
-   Never assume only one Android device is connected.
-   Do not claim reliable multi-device support until selection is
    consistently propagated through relevant operations and the behavior
    has been tested.
-   Do not bypass device authorization or other security controls.
-   Avoid exposing unnecessary raw command output when a clear,
    actionable error can be provided.
-   Do not require users to enter Android filesystem paths as part of
    normal workflows.

## 8. Backup and Filesystem Safety

Preserve the established backup pipeline unless an explicitly approved
architecture change says otherwise:

1.  Check dependencies.
2.  Select the Android device.
3.  Select media categories and application scope where supported.
4.  Resolve source paths.
5.  Select the destination.
6.  Use ADB to copy source media into a temporary directory.
7.  Use rsync to synchronize into the permanent destination.
8.  Clean up temporary data only when safe.

Rules: - Preserve original source media during backup. - Do not bypass
the temporary extraction stage without first understanding the current
implementation and obtaining approval for an architectural change. - Do
not replace the incremental synchronization mechanism without
understanding the existing `sync.ts` implementation and relevant
requirements. - Validate source and destination paths before
operations. - Prevent unintended overwrites, path traversal, and writes
outside the intended destination. - Handle filenames, spaces, unusual
characters, missing files, inaccessible paths, and filesystem errors
safely. - Clean up temporary files only when safe to do so. - Report
actual outcomes accurately, including partial failures. - Distinguish a
successful copy from a verified backup. - A dry-run must preview the
intended plan without performing data-changing backup operations. - Do
not imply that media is protected merely because a backup was attempted.

## 9. Categories, Applications, and Path Resolution

-   Prefer high-level categories such as Images, Videos, Downloads,
    Documents, Audio/Recordings, and Applications where those are
    supported by the implementation.
-   Do not expose Android filesystem structure unnecessarily.
-   When application-aware selection is implemented, prefer friendly
    names such as WhatsApp or Telegram over package IDs where possible.
-   Keep application discovery and source-path mapping in the
    established service layers rather than hard-coding
    application-specific behavior into command handlers without a
    compelling reason.
-   Verify supported categories, app-aware behavior, and source paths
    against the implementation and product requirements before
    documenting or changing them.

## 10. Cleanup and Destructive Operations

Cleanup can permanently delete user media. Treat it as high risk.

-   Show users what is proposed for deletion before destructive
    operations.
-   Require explicit confirmation before deleting data.
-   Ensure dry-run mode never modifies Android media or performs
    deletion.
-   Do not delete files solely because they are old, large, visually
    similar, or identified as possible duplicates.
-   Account for backup status and verification where cleanup safety
    depends on them.
-   Never represent an unverified backup as a safe recovery copy.
-   Handle cancellation, interruptions, and partial failures without
    falsely reporting success.
-   Prefer conservative behavior whenever file identity, backup status,
    or deletion safety is uncertain.
-   Never run destructive tests against real user media without explicit
    authorization.
-   Use the cleanup dry-run workflow to inspect candidates before any
    real cleanup operation.

## 11. CLI User Experience and Error Handling

Follow `docs/project/ux-guidelines.md` and existing UX utilities.

-   Provide clear, actionable errors and useful progress feedback.
-   Keep prompts understandable and avoid unnecessary interaction.
-   Use consistent terminal styling and existing prompt/spinner helpers.
-   Prefer friendly device and application names when available.
-   Clearly distinguish completed, skipped, failed, and cancelled
    operations.
-   Avoid false success messages and misleading progress indicators.
-   Ensure cancellation does not accidentally trigger destructive
    actions.
-   Keep non-interactive behavior predictable when supported.
-   Do not silently swallow operational failures.
-   Handle common failures explicitly, including unavailable ADB, no
    devices, unauthorized devices, missing Android paths, inaccessible
    destinations, rsync failures, permission errors, and cleanup
    failures.
-   Avoid exposing stack traces during normal operation unless a
    debugging mechanism explicitly requires them.

## 12. Build, Run, and Validation Commands

Build the project:

``` bash
npm run build
```

Run the CLI from the source checkout:

``` bash
node ./bin/run.js --help
node ./bin/run.js --version
node ./bin/run.js backup
node ./bin/run.js backup --dry-run
node ./bin/run.js cleanup --dry-run
```

If the project is linked locally:

``` bash
npm link
vps-mediasync-cli --help
```

Choose validation appropriate to the change: - Run `npm run build` after
meaningful code changes. - Run relevant automated tests, adding or
updating tests for new behavior and regressions. - Test failure paths,
cancellation, invalid input, and boundary conditions where relevant. -
Use mocks and fixtures where real devices or destructive actions are
unnecessary. - Use a real Android device when integration behavior
cannot be established adequately through automated tests. - For
destructive functionality, test the dry-run and confirmation behavior
without risking real user data. - Clearly state which checks were run,
which were not run, and any unresolved limitations. - Do not claim a
feature is tested merely because TypeScript compiles.

## 13. Implementation Plans and Task Tracking

A written plan under `docs/plans/` is required for non-trivial changes,
including: - New features and enhancements. - Bug fixes that require
multiple steps or affect meaningful behavior. - Refactoring and
architectural changes. - Multi-step documentation changes. - Dependency,
tooling, build, testing, and configuration changes that require
coordinated work. - Other work involving meaningful risk or a sequence
of actions.

Small, straightforward changes do not need a separate plan.

### 13.1 Plan Before Implementation

Before implementing non-trivial work: 1. Inspect the relevant code,
documentation, tests, and repository state. 2. Understand the requested
outcome and identify requirements and constraints. 3. Create or update a
plan document under `docs/plans/`. 4. Describe the approach, scope,
affected areas, dependencies, risks, and validation strategy as
appropriate. 5. End the plan with an actionable Markdown `TODO`
checklist. 6. Identify decisions or actions that require the project
author's approval.

Do not begin non-trivial implementation until its plan is written. If
the task is substantial or requires approval, present the plan and
obtain approval before proceeding.

Use descriptive filenames such as `fix-device-selection.md` or
`feature-backup-verification.md`. Update an existing plan when
continuing the same piece of work rather than creating duplicate plans.

### 13.2 Plans and Specifications Are Different

-   **Specifications** in `docs/specs/` define intended behavior,
    requirements, acceptance criteria, and constraints.
    Developers/project authors create or own these specifications.
-   **Implementation plans** in `docs/plans/` describe how the agent
    will implement a feature, fix, or other non-trivial change. AI
    agents create and maintain these plans and their TODO checklists.

Use applicable specifications as inputs to a plan. Do not silently
change requirements or treat a plan as authorization to expand scope. Do
not create a specification merely because a plan is required. If
requirements are ambiguous, conflicting, or require a material
product/architecture decision, ask the project author.

### 13.3 Maintain Plans and Verify Completion

AI agents are responsible for keeping plans and TODO checklists current
during implementation and review.

-   Keep incomplete, blocked, and unverified tasks unchecked.
-   Revise checklist items when scope or approach changes, and explain
    material deviations in the plan.
-   Record important decisions, validation results, blockers, and
    deviations where useful.
-   Obtain the project author's approval before actions or decisions
    that require it; a plan does not itself constitute approval.
-   **Do not mark a task complete until the user/project author has
    verified the result.** Before that verification, leave the relevant
    task unchecked and clearly report what implementation and testing
    have been completed, along with what remains for user verification.
-   At completion, ensure the plan reflects the actual state and any
    remaining limitations.

Plans are living execution records. Keep them useful and current rather
than treating them as documents written once and then ignored. Do not
put task-specific TODO lists in this permanent instruction file; task
checklists belong in their individual plans.

## 14. Documentation Maintenance

Update documentation when a change affects documented behavior,
workflows, architecture, or user expectations.

Use the established locations: - Requirements and product scope:
`docs/project/product-requirements.md` - Architecture and design:
`docs/project/architecture-design.md` - Development instructions:
`docs/project/developer-guide.md` - User workflows and commands:
`docs/project/user-guide.md` - CLI interaction standards:
`docs/project/ux-guidelines.md` - Roadmap and priorities:
`docs/project/roadmap.md` - Implementation plans and task tracking:
`docs/plans/` - Feature specifications: `docs/specs/` - Architecture
decision records: `docs/adr/`

Do not create a separate document for every task if it belongs to an
existing plan. Keep documentation consistent with implemented behavior
and label proposed or future capabilities clearly.

## 15. Packaging, Release, and Versioning

Packaging and publishing are release activities, not routine development
steps.

Before a release, inspect package contents and verify the executable
configuration. When appropriate, run:

``` bash
npm run build
npm pack --dry-run
npm pack
```

Test the generated package in a separate environment when preparing a
release, for example:

``` bash
npm install -g ./vps-mediasync-cli-X.Y.Z.tgz
vps-mediasync-cli --version
vps-mediasync-cli --help
```

The package executable configuration should remain consistent with the
existing entry point:

``` json
{
  "bin": {
    "vps-mediasync-cli": "bin/run.js"
  }
}
```

-   Do not publish after every development change.
-   Never use publishing as a substitute for local testing.
-   Before publishing, verify the package name/version, account/registry
    state, build, and package contents.
-   If publishing is blocked by account, authentication, security, or
    registry issues, continue local development and package testing
    rather than repeatedly attempting publication.
-   Use semantic versioning: patch for compatible fixes, minor for
    backward-compatible features, and major for breaking changes.
-   Do not increment versions merely because development continues.
    Release only at meaningful milestones.
-   Follow the maintainer's private release notes when available; never
    commit private release details or credentials.

## 16. Git and Change Scope

-   Inspect `git status` before editing and before finalizing.
-   Review the complete diff and staged diff before committing.
-   Preserve unrelated user changes and untracked files.
-   Keep changes focused on the requested task.
-   Do not run destructive Git commands such as `git reset --hard`,
    `git clean`, or broad reverts without explicit permission.
-   Do not commit, push, publish, or create a release unless requested
    or otherwise explicitly authorized.
-   Do not commit generated artifacts unless the repository explicitly
    requires them.

## 17. Completion Report

At the end of a task, report: - What changed and why. - Which files were
affected. - Which build, test, or validation commands actually ran and
their results. - What the user/project author still needs to verify. -
Any limitations, risks, blockers, or follow-up work.

Be precise about verification. Do not claim functionality is complete,
safe, or tested beyond the evidence available.
