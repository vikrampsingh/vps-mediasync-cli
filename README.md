# MediaSync CLI

**Back up Android media to your Mac and review old files before cleanup.**

MediaSync CLI is an interactive command-line tool that helps you copy media from an Android device to a local folder or attached drive. It uses Android Debug Bridge (ADB) to access the device and `rsync` to synchronize files to the destination.

MediaSync is currently focused on **Android devices connected to a macOS host**. It is an evolving project; see [current limitations](#current-status-and-limitations) before relying on it for important data.

## What it can do

- Discover Android devices visible to ADB and let you select a device.
- Back up selected categories: images, videos, downloads, documents, and audio/recordings.
- Choose a local destination interactively, including folders on attached storage.
- Use incremental synchronization to avoid copying files that already exist at the destination.
- Preview a backup with `backup --dry-run`.
- Find older files for review and preview cleanup with `cleanup --dry-run`.
- Present interactive prompts and summaries rather than requiring users to remember ADB and rsync commands.

## Requirements

- macOS
- Node.js 18 or newer
- Android Debug Bridge (ADB)
- `rsync`
- An Android device with USB debugging enabled, or an Android device already connected through ADB over Wi-Fi

The CLI checks for ADB and rsync when a command starts. On macOS, it can offer to install ADB through Homebrew. If rsync is missing, install it using Homebrew:

```bash
brew install rsync
```

To connect an Android device, enable Developer Options and USB debugging, connect the phone, unlock it, and accept the debugging authorization prompt. To use Wi-Fi, first pair/connect the device using the supported ADB workflow.

## Installation

### From npm

When a published release is available:

```bash
npm install -g vps-mediasync-cli
```

Verify the installation:

```bash
vps-mediasync-cli --help
```

### From a source checkout

Use this route when developing MediaSync or when an npm release is not available:

```bash
git clone https://github.com/vikrampsingh/vps-mediasync-cli.git
cd vps-mediasync-cli
npm install
npm run build
node ./bin/run.js --help
```

You can run commands directly with `node ./bin/run.js`, or use `npm link` to make the local CLI available as `vps-mediasync-cli`.

## Quick start

### 1. Back up media

```bash
vps-mediasync-cli backup
```

Follow the prompts to select the Android device, media categories, and destination.

### 2. Preview a backup

```bash
vps-mediasync-cli backup --dry-run
```

The dry-run counts files in the resolved Android paths and displays a summary without running `adb pull` or `rsync`, or creating the normal backup temporary directory and destination directories. It still needs to connect to the device and read file counts, so it is not an offline simulation.

### 3. Review old files before cleanup

```bash
vps-mediasync-cli cleanup --dry-run
```

Select categories and an age threshold to preview candidate files. To perform actual cleanup, run `vps-mediasync-cli cleanup` and carefully review the candidates before confirming deletion.

**Important:** Cleanup can permanently delete files from your phone. Keep a separate, verified backup of important media before deleting anything.

## Commands

| Command | Purpose |
| --- | --- |
| `vps-mediasync-cli --help` | List available commands |
| `vps-mediasync-cli backup` | Interactively back up selected media |
| `vps-mediasync-cli backup --dry-run` | Preview backup paths and file counts without copying |
| `vps-mediasync-cli cleanup` | Find old files and proceed through the cleanup confirmation flow |
| `vps-mediasync-cli cleanup --dry-run` | Preview cleanup candidates without deleting them |

You can also run these commands from a source checkout with `node ./bin/run.js` in place of `vps-mediasync-cli`.

## Safety notes

- A backup operation is intended to copy data from the phone to the selected destination; it should not delete source files.
- Use `backup --dry-run` to review the planned source paths and counts before copying.
- Use `cleanup --dry-run` first. Actual cleanup requires a separate run and explicit confirmation.
- Verify that important files exist and can be opened at the backup destination before deleting originals.
- Disconnecting a drive, losing device authorization, running out of space, or encountering inaccessible Android paths can cause a backup to be incomplete.
- Do not treat a successful command exit alone as proof that every intended file was backed up. Review the command output and verify important data.

## Current status and limitations

MediaSync is under active development.

- The current host target is macOS; Linux and Windows host support are not yet established.
- Until ADB operations are consistently scoped to the selected device, connect only one Android device when running backup or cleanup commands.
- The current backup workflow exposes category selection, but full application-aware selection is not yet integrated into that workflow.
- Android access is limited to paths available through the configured ADB connection. ADB does not provide unrestricted access to every app's private data.
- Backup manifests, persistent backup history, comprehensive integrity verification, and restore workflows are future work unless explicitly documented as implemented elsewhere.
- Automated test coverage is currently limited; build success does not replace testing against a real device.

Please report reproducible issues with your macOS version, Node.js version, ADB version, command used, and relevant redacted output. Do not attach private media or device data.

## Documentation

- [User guide](docs/project/user-guide.md) — setup and everyday usage
- [Architecture](docs/project/architecture-design.md) — components and system design
- [Developer guide](docs/project/developer-guide.md) — local development, build and debugging
- [UX guidelines](docs/project/ux-guidelines.md) — interaction and CLI presentation conventions
- [Product requirements](docs/project/product-requirements.md) — product requirements and acceptance criteria
- [Roadmap](docs/project/roadmap.md) — current milestones and future direction
- [Implementation plans](docs/plans/) — implementation approach and actionable TODO checklists
- [Specifications](docs/specs/) — developer-authored specifications
- [Architecture decision records](docs/adr/) — rationale for significant technical decisions

## Contributing

Contributions and workshop-driven improvements are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), read the [developer guide](docs/project/developer-guide.md), and follow the repository instructions in [AGENTS.md](AGENTS.md) when using a coding agent.

Please keep changes focused, preserve existing behavior unless the task requires changing it, and include test evidence in pull requests.

## Technology

- Node.js and TypeScript (ES modules)
- [oclif](https://oclif.io/) for the CLI
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) for interactive prompts
- ADB for Android device access
- rsync for incremental synchronization

## Security

Please report vulnerabilities privately. See [SECURITY.md](SECURITY.md) for the reporting process.

## License

MediaSync CLI is distributed under the [MIT License](LICENSE).