# MediaSync CLI — Product Requirements

This document defines **what** MediaSync is and **what it must do**.

* How it is built → `architecture-design.md`
* How it interacts → `ux-guidelines.md`
* How to install and use it → `user-guide.md`
* Where it is going → `roadmap.md`

---

## 1. Product Overview

MediaSync CLI is an interactive command-line application for managing media
between Android devices and a Mac.

The primary goals are:

- Back up media from an Android device to a Mac or attached storage.
- Incrementally synchronize backed-up media.
- Clean old media from an Android device in a controlled and safe manner.
- Hide Android filesystem complexity from the user.
- Provide a simple, interactive CLI experience rather than requiring users
  to remember ADB commands or Android storage paths.

The package is distributed through npm as:

```text
vps-mediasync-cli
```

The primary target platform is macOS.

---

## 2. Product Philosophy

MediaSync behaves like a small utility application rather than a collection
of low-level ADB commands.

Users think in terms of:

- Images
- Videos
- Downloads
- Documents
- Audio / Recordings
- Applications

and not in terms of:

- `/sdcard/DCIM/Camera`
- `/sdcard/Android/media/...`
- ADB pull commands
- rsync commands

The application translates user intent into the appropriate Android
filesystem operations.

### Core principle

> The user describes WHAT they want to manage; MediaSync determines HOW
> to access it.

This is a user-facing product delivered via CLI. Therefore:

- UX is first-class
- Safety is mandatory
- Abstractions matter

---

## 3. Target Users

- Developers
- Power users
- Tech-savvy individuals managing device storage
- Future: general users (via a GUI wrapper — see `roadmap.md`)

---

## 4. Functional Requirements

### 4.1 Backup

Command:

```bash
vps-mediasync-cli backup
```

Required workflow:

1. Check required dependencies.
2. Detect connected Android devices.
3. Ask the user to select a device.
4. Ask which media categories should be backed up.
5. Where appropriate, detect relevant installed applications.
6. Ask the user which applications should be included.
7. Resolve categories and applications into Android paths.
8. Ask the user to select a destination.
9. Pull data from Android into temporary local storage.
10. Incrementally synchronize temporary data to the permanent destination.
11. Remove temporary data.
12. Report the result.

The permanent destination must not be unnecessarily recopied: repeated
backups transfer only new or changed files.

`backup --dry-run` previews the backup (per-path file counts, total,
destination) without creating directories, pulling data, or running rsync.

### 4.2 Cleanup

Command:

```bash
vps-mediasync-cli cleanup
```

Required workflow:

1. Check required dependencies.
2. Select Android device.
3. Select categories.
4. Specify an age threshold.
5. Identify candidate files.
6. Preview what will be removed.
7. Request explicit confirmation.
8. Delete only after confirmation.
9. Report the result.

Cleanup must avoid system-critical and unknown directories.

### 4.3 Application-Aware Backup

Many Android applications store user-generated media under
application-specific directories.

The application layer must:

1. Discover installed packages through ADB.
2. Identify applications relevant to media management.
3. Resolve package identifiers into friendly names where possible.
4. Let the user select applications.
5. Resolve selected applications to their media locations.
6. Integrate the resulting paths into the normal backup workflow.

This functionality should evolve toward dynamic discovery rather than
maintaining a permanently hard-coded list of applications.

### 4.4 Dependency Management

The CLI depends on external system tools:

```text
ADB
rsync
```

The application must:

- detect missing dependencies
- explain what is missing
- provide installation guidance
- automatically install dependencies only where this is safe and supported
- verify that installation succeeded before continuing

The CLI must not silently assume that required system tools exist.

---

## 5. Safety Requirements

Cleanup is inherently destructive. Therefore:

> No destructive cleanup operation may occur without explicit user
> confirmation.

The cleanup flow must provide:

- clear scope
- age threshold
- candidate preview
- explicit confirmation

Deletion rules:

- Never delete system directories.
- Never delete unknown or unvalidated paths.
- Always preview before delete.
- Always require confirmation.
- Validate paths before deletion.

`cleanup --dry-run` must provide a genuine non-destructive preview. It must
never be treated as merely a display option while still allowing deletion
through another execution path.

---

## 6. Non-Functional Requirements

### 6.1 Platform

- macOS is the primary supported platform.
- ADB and rsync must be available on the host system.
- macOS normally ships rsync 2.6.9, which is the supported baseline.

### 6.2 rsync Compatibility

The implementation must remain compatible with the rsync version available
on the target Mac.

Do not assume that all macOS installations have the same rsync version.

Avoid rsync options unavailable in the supported baseline version unless the
compatibility strategy is explicitly changed.

### 6.3 Performance

- Avoid loading entire file lists into memory where avoidable.
- Stream file operations where possible.
- Batch operations where practical.

### 6.4 Reliability

- Fail gracefully with clear error messages.
- Use meaningful exit codes.
- Never invent successful outcomes after a failed operation.

---

## 7. Definition of Done (V1)

- `vps-mediasync-cli backup` works end-to-end.
- `vps-mediasync-cli cleanup` safely deletes old files with preview and
  confirmation.
- Interactive UX implemented per `ux-guidelines.md`.
- Packaged and installable via npm.
- Works reliably on Mac + Android.

---

## 8. Out of Scope for V1

The following were considered during early product design but are **not**
part of the current implementation. They are tracked in `roadmap.md`:

- A standalone `config` command (default backup path, retention settings)
- A standalone `apps` discovery command
- Conversational/natural-language CLI input
- GUI wrapper
