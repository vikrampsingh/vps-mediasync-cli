# MediaSync Roadmap

MediaSynch is a safe, cross-platform personal media management application. Its goal is to make media transfers, backup destinations, and cleanup workflows easier to understand and safer to operate. Helps people back up, organize and reclaim space on their phones without losing valuable data or putting their devices at risk.

This roadmap communicates the product's current capabilities, development priorities, and longer-term direction. Priorities may evolve as the product develops and real-world usage reveals new needs.

A foundational architectural principle guides this evolution: One reliable media-management engine, multiple interfaces.

## Product Direction

MediaSync will evolve through three broad stages:

- **Protect:** Build a dependable backup engine and make storage cleanup safe and predictable.
- **Manage:** Extend device and storage support, then provide a desktop application built on the same core engine.
- **Discover:** Organize backed-up media into a personal library and make it easier to search, explore, and understand.

## Phase 0: Trust, safety and engineering foundation

**Status:** In progress

**Objective:** Evolve the current CLI into a backup engine that users can trust. Prevent unintended data loss; make behavior testable and predictable.

**Focus areas:**
- Establish clear and consistent safety guarantees for backup and cleanup operations.
- Make device selection, destination handling, and filesystem operations predictable.
- Improve error handling, failure reporting, and recovery from interrupted operations.
- Strengthen automated tests around critical operations and failure scenarios.
- Make destructive actions explicit, reviewable, and appropriately guarded.
- Establish reliable development, validation, and release practices.

**Outcome:** A safer, testable foundation on which more advanced backup and media-management capabilities can be built.

**Features available:** The current product provides an interactive command-line workflow for Android media management.

- **Device selection:** Discover Android devices available through ADB and select a device.
- **Selective backup:** Choose supported media categories to copy.
- **Flexible destinations:** Select a local folder or an attached storage destination.
- **Incremental synchronization:** Use rsync to synchronize media to the destination.
- **Backup preview:** Use `backup --dry-run` to inspect planned paths and file counts without copying files.
- **Cleanup preview:** Use `cleanup --dry-run` to review candidate files before deletion.

## Phase 1: Reliable backup engine

**Status:** Planned

**Objective:** Evolve the current CLI into a backup engine that offers users a dependable, incremental and verifiable backup experience.

**Focus areas:**
- Reliable incremental backup operations.
- Clear reporting of copied, skipped, failed, and incomplete transfers.
- Backup manifests and persistent operation history.
- Verification of backed-up files and improved confidence in backup completeness.
- Better handling of interrupted operations, retries, and repeated backups.
- Clear visibility into backup results and outstanding problems.

**Outcome:** Users can understand what was backed up, identify what needs attention, and have greater confidence in the resulting copy.

## Phase 2: Safe phone cleanup and storage management

**Status:** Planned

**Objective:** Help users reclaim space confidently, without deleting important memories or app data. Identify reclaimable space, preview actions and protect important files.

**Focus areas:**
- Identify files and categories that may be suitable for cleanup.
- Estimate reclaimable storage before taking action.
- Preview cleanup candidates and explain why they were selected.
- Protect important files and distinguish backed-up data from data that is not safely backed up.
- Provide clear confirmation, deletion reporting, and safeguards against unintended loss.

**Outcome:** Users can make informed storage-management decisions while minimizing the risk of losing important data.

## Phase 3: Device and operating-system expansion

**Status:** Planned

**Objective:** Support more phone types and host computers without multiplying bugs or compromising safety.

**Focus areas:**
- Support multiple phones and make device identity explicit throughout operations.
- Expand host support beyond the initial macOS target.
- Support multiple computers and multiple storage destinations.
- Make destination selection, device handling, and operation state consistent across environments.
- Extend automated and real-device testing across supported combinations.

**Outcome:** MediaSync becomes more flexible across devices and environments while preserving consistent behaviour and safety guarantees.

## Phase 4: Electron desktop application

**Status:** Planned

**Objective:** Make MediaSync accessible to people who do not want to work in a terminal.

**Focus areas:**
- Visual device and destination management.
- Guided backup and cleanup workflows.
- Progress indicators and meaningful operation results.
- Backup history and access to previous operation details.
- Application settings and configuration.
- Clear presentation of errors, warnings, and safety confirmations.

The desktop application should use the same reliable media-management engine as the CLI. It should not independently reimplement backup, cleanup, or other core operations.

**Outcome:** Users can manage their media through a graphical interface without sacrificing the reliability and safety of the underlying engine.

An important product decision is to build one reliable media-management engine with multiple interfaces, rather than separate CLI and desktop implementations that eventually drift apart.

## Phase 5: Personal media library

**Status:** TBD

**Objective:** Turn backed-up files into an organized, searchable personal media collection.

**Focus areas:**
- Index media across supported storage destinations.
- Detect potential duplicates and help users understand redundant files.
- Explore media through timelines and other useful organizational views.
- Search and filter the collection using metadata and available media attributes.
- Organize media without losing track of original files and their locations.
- Preserve the relationship between indexed items and the underlying media.

**Outcome:** Users can find and organize their personal media without manually navigating large collections of folders.

## Guiding Principles

The following principles apply across all phases:

- **Local-first control:** Users should retain control over their media and where it is stored.
- **Safety before convenience:** Convenience must not come at the expense of data integrity or user intent.
- **One core engine:** Interfaces should share core media-management capabilities and safety guarantees.
- **Transparent operations:** Users should understand what the system is doing, what succeeded, and what needs attention.
- **Incremental evolution:** New capabilities should build on a dependable foundation rather than bypass it.
- **Verifiable progress:** A feature is not considered complete merely because it has been planned, implemented, or compiled; its required behaviour must be validated.

This roadmap describes what the product is working towards, not the complete functional or technical design of every feature.

For detailed functional expectations, see [product-requirements.md](product-requirements.md).

For feature-level behaviour and implementation constraints, consult the relevant specifications in [docs/specs/](../specs/).

For architecture and architecture decision records, see [docs/adr/](../adr/).