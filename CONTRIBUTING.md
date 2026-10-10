# Contributing to MediaSync CLI

Thank you for your interest in contributing to MediaSync CLI!

MediaSync CLI aims to make personal media backup and cleanup reliable, safe, and accessible. Contributions may include bug fixes, new features, documentation, tests, usability improvements, and development tooling.

This guide explains how to contribute, whether you are working directly or collaborating with an AI coding agent.

## 1. Ways to Contribute

You can contribute by:

- Reporting bugs and unexpected behavior.
- Proposing features and improvements.
- Fixing issues or implementing features.
- Improving backup reliability and cleanup safety.
- Adding automated tests and improving error handling.
- Improving CLI usability and documentation.
- Reviewing code and pull requests.
- Helping new contributors understand the codebase.

For substantial changes, discuss the intended behavior and approach before investing in implementation.

## 2. Before You Start

Read the documentation relevant to your task:

- `README.md` — project overview, installation, and usage.
- `AGENTS.md` — instructions for AI coding agents.
- `docs/project/product-requirements.md` — product requirements and scope.
- `docs/project/architecture-design.md` — architecture and design decisions.
- `docs/project/developer-guide.md` — development setup and technical guidance.
- `docs/project/user-guide.md` — user-facing workflows.
- `docs/project/ux-guidelines.md` — CLI interaction guidelines.
- `docs/specs/` — feature specifications.
- `docs/adr/` — architecture decision records.
- `docs/plans/` — implementation plans and task tracking.

Read only what is relevant to your contribution.

Check for existing issues, specifications, plans, and implementations before proposing or building something new.

## 3. Development Setup

### Prerequisites

Install the versions of Node.js and npm supported by the project, as well as Git.

MediaSync CLI also relies on external runtime dependencies, including:

- Android Debug Bridge (ADB), for Android device communication.
- rsync, for file synchronization.

Consult the README and developer guide for the current setup instructions and supported environment.

### Get the Code

Fork the repository on GitHub, then clone your fork:

```bash
git clone <your-fork-url>
cd mediasync
```

Add the original repository as the upstream remote if needed:

```bash
git remote add upstream <original-repository-url>
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Check the CLI entry point:

```bash
node ./bin/run.js --help
node ./bin/run.js --version
```

If the build or setup fails, record the error and environment details before making unrelated changes.

## 4. Specifications and Implementation Plans

MediaSync CLI distinguishes between developer-authored specifications and agent-authored implementation plans.

### 4.1 Specifications — Developer-Owned

Specifications in `docs/specs/` define what a feature or change is expected to accomplish.

Developers author specifications to describe, as appropriate:

- Problem statement and motivation.
- Requirements and expected behavior.
- Scope and non-goals.
- Acceptance criteria.
- Constraints, dependencies, and relevant edge cases.

Specifications establish the intended outcome. They should be reviewed and approved by the project author when required.

AI agents must read and follow relevant specifications. Agents must not silently change requirements, expand scope, or substitute their own product decisions for developer intent.

If requirements are missing, ambiguous, or contradictory, the agent should seek clarification rather than inventing requirements.

### 4.2 Implementation Plans — Agent-Owned

Implementation plans in `docs/plans/` describe how an AI agent intends to implement a feature, fix a bug, or make another change.

**The agent is responsible for creating, maintaining, and completing its implementation plan.** Developers are not expected to write or manually maintain the plan's execution checklist.

For every planned change, the agent must:

1. Inspect the relevant implementation, documentation, tests, and repository state.
2. Read the applicable specifications and architecture decision records.
3. Create a new plan or update the existing plan in `docs/plans/`.
4. Describe the implementation approach, affected areas, dependencies, risks, and validation strategy as appropriate.
5. End the plan with a `TODO` section containing actionable Markdown checklist items.
6. Identify decisions or actions that require developer or project-author approval.
7. Present the plan for review and obtain approval before implementation when required.

Plans should be proportionate to the task. Even small changes require a plan, but a small plan can be concise. When continuing existing work, update its existing plan instead of creating a duplicate.

A plan is not a specification: it explains the proposed implementation, not a new set of product requirements.

### 4.3 Agent-Owned TODO Tracking

The agent must maintain the plan's TODO checklist throughout implementation, testing, and review.

- Mark a task complete (`[x]`) only when the work has been performed and the required verification has passed.
- Keep incomplete, blocked, and unverified tasks unchecked.
- Add, remove, or revise tasks when the implementation approach changes.
- Record material deviations, decisions, blockers, and verification results when useful.
- Obtain required approval before proceeding with approval-dependent work.
- Ensure the final checklist accurately reflects the implementation's actual state.

The agent must not treat a written plan as authorization to perform actions that require approval.

At completion, the agent should report the plan's location, summarize the work, state which validations actually ran, and identify remaining tasks or limitations.

### 4.4 Developer and Agent Responsibilities

| Activity | Primary responsibility |
|---|---|
| Define feature requirements and expected behavior | Developer |
| Author and revise feature specifications | Developer |
| Inspect the repository and relevant specifications | AI agent |
| Draft the implementation plan | AI agent |
| Review and approve the plan when required | Developer / project author |
| Implement the approved approach | AI agent, under developer direction |
| Maintain the plan's TODO checklist | AI agent |
| Review implementation and validation evidence | Developer |
| Approve material scope or architecture changes when required | Developer / project author |

These responsibilities do not prevent developers from writing implementation plans themselves when they choose to. They establish the default workflow for AI-assisted development.

## 5. Branching and Commit Practices

Create a focused branch for your contribution:

```bash
git switch -c fix/short-description
```

Examples:

```text
fix/device-selection
feat/backup-verification
docs/contribution-guide
```

Use clear commit messages that describe the change:

```text
fix: target the selected Android device
feat: add backup verification
docs: clarify development setup
```

Keep commits focused and avoid including unrelated changes. Follow the repository's existing conventions if they differ from these examples.

Do not commit secrets, credentials, personal media, temporary backup data, or generated artifacts that are not intended to be tracked.

## 6. Implementation Guidelines

Make the smallest coherent change that satisfies the requirement.

- Follow the existing architecture and coding conventions.
- Reuse existing services and abstractions where appropriate.
- Keep command handlers focused on orchestration and user interaction.
- Keep reusable operations in appropriate services.
- Avoid unnecessary dependencies and unrelated refactoring.
- Preserve TypeScript strictness.
- Use `.js` extensions in relative imports where required by the project's ESM conventions.
- Handle errors and cancellation explicitly.
- Keep user-facing messages actionable and accurate.
- Update relevant documentation when behavior or workflows change.

Do not weaken existing checks or remove tests simply to make a change pass.

For AI-assisted contributions, follow `AGENTS.md` as the detailed operational guide.

## 7. Backup, Cleanup, and Data Safety

MediaSync CLI operates on personal media, so safety is a core contribution requirement.

### Backup changes

- Preserve original source media.
- Validate source and destination paths.
- Avoid unintended overwrites.
- Handle partial failures and cancellation accurately.
- Distinguish copying from successful verification.
- Ensure dry-run previews intended operations without performing data-changing backup actions.

### Cleanup changes

- Preview deletion candidates clearly.
- Require explicit confirmation before destructive operations.
- Ensure dry-run does not modify or delete Android media.
- Do not treat age, file size, or visual similarity alone as sufficient grounds for deletion.
- Do not claim that a file is safely backed up without appropriate evidence.
- Prefer conservative behavior whenever deletion safety is uncertain.

Test destructive workflows with mocks or disposable test data whenever possible. Do not run destructive tests against real user media without explicit authorization.

## 8. Build and Test

Build after meaningful code changes:

```bash
npm run build
```

Run the project's available automated tests and any checks relevant to the change. Consult `package.json` for the scripts currently defined; do not assume a test or lint command exists if it has not been configured.

Where appropriate, validate the CLI directly:

```bash
node ./bin/run.js --help
node ./bin/run.js backup
node ./bin/run.js cleanup --dry-run
```

Commands that interact with real devices or modify data must be used with appropriate caution.

For each contribution:

- Test the affected behavior.
- Cover important failure paths, invalid input, and cancellation.
- Add or update regression tests where appropriate.
- Verify that dry-run and destructive-operation safeguards remain intact.
- Report any tests that could not be run and explain why.

A successful build alone does not establish that a feature works correctly.

## 9. Review Your Changes

Before submitting a pull request, inspect the complete change set:

```bash
git status
git diff
```

Review for:

- Unintended or unrelated modifications.
- Missing error handling or edge cases.
- Unsafe filesystem or device operations.
- Incorrect success messages.
- Debugging code or unnecessary dependencies.
- Missing tests or documentation updates.
- Inconsistencies between the implementation, specification, and plan.

Update the plan's TODO checklist to reflect the verified state of the work.

## 10. Submit a Pull Request

Push your branch and open a pull request against the repository's designated target branch.

A good pull request explains:

- **What:** What changed?
- **Why:** What problem does it solve?
- **Approach:** How was it implemented?
- **Validation:** Which builds, tests, and manual checks were performed?
- **Limitations:** What remains incomplete or unverified?
- **Plan:** Which implementation plan tracks the work?

Link relevant issues and specifications where applicable. Keep the pull request focused and respond constructively to review feedback.

Do not claim tests passed unless they were actually run.

The project maintainer may request changes, additional tests, or clarification before merging.

## 11. Contributing with AI Coding Agents

AI coding agents can help inspect the repository, prepare implementation plans, implement changes, write tests, and review diffs. They do not replace developer judgment or verification.

When using an AI coding agent:

1. **Understand the request:** Provide the task and relevant context.
2. **Inspect:** Have the agent examine the existing implementation, documentation, tests, and Git state.
3. **Read specifications:** Ensure the agent follows developer-authored specifications and applicable architecture decisions.
4. **Plan:** Have the agent create or update the implementation plan in `docs/plans/`, including its TODO checklist.
5. **Review and approve:** Review the proposed plan and provide approval when required before implementation.
6. **Implement:** Have the agent execute the agreed scope.
7. **Track:** Ensure the agent updates its TODO checklist as tasks are completed, blocked, or revised.
8. **Verify:** Review the diff and the evidence from builds, tests, and other relevant checks.
9. **Complete:** Have the agent update the plan and provide an accurate completion report.

The developer remains responsible for defining requirements, resolving product decisions, providing required approvals, and reviewing the resulting contribution. The agent remains responsible for its implementation plan and execution tracking.

Do not blindly accept generated code or treat an agent's assertion of success as proof of correctness.

## 12. Questions and Discussions

If you are uncertain about requirements, architecture, scope, or the expected behavior of a feature, ask before making assumptions that could materially affect the implementation.

Use the repository's available issue and discussion channels, and provide enough context for others to understand the question.

Thank you for helping make MediaSync CLI safer, more reliable, and easier to use.