# MediaSync CLI — User Guide

MediaSync CLI is an interactive command-line tool for backing up selected data from an Android phone to a folder on your Mac.

It uses **ADB (Android Debug Bridge)** to retrieve data from the phone and **rsync** to maintain an incremental backup on your Mac.

---

## 1. What can MediaSync do?

MediaSync currently provides two main commands:

| Command   | Purpose                                                               |
| --------- | --------------------------------------------------------------------- |
| `backup`  | Pull selected data from Android and incrementally sync it to your Mac |
| `cleanup` | Find and remove selected old files from Android                       |
| `hello`   | Test the CLI installation and interactive UX                          |

### Backup

The backup workflow lets you:

* Select an Android device
* Select the types of data you want to back up
* Select a destination folder on your Mac or attached storage
* Pull the selected data into temporary storage
* Incrementally synchronize it to the selected permanent destination
* Remove temporary files after the backup

### Cleanup

The cleanup workflow lets you:

* Select an Android device
* Select the categories to clean
* Specify how old files must be before they are considered for deletion
* Review the files identified for deletion
* Confirm the operation
* Run the cleanup
* Use `--dry-run` to preview the operation without deleting anything

---

# 2. Requirements

## Operating system

The current V1 workflow is designed primarily for **macOS**.

## Node.js

MediaSync is distributed as an npm CLI package and requires Node.js.

Check your version:

```bash
node --version
```

## ADB

MediaSync uses Android Debug Bridge to communicate with your Android device.

Check:

```bash
adb version
```

If ADB is not installed, MediaSync can offer to install it automatically through Homebrew.

Alternatively:

```bash
brew install android-platform-tools
```

## rsync

MediaSync uses rsync for incremental synchronization.

macOS normally includes rsync 2.6.9, which is sufficient for the current V1 backup implementation.

Check:

```bash
rsync --version
```

---

# 3. Installation

Install MediaSync globally using npm:

```bash
npm install -g vps-mediasync-cli
```

Verify the installation:

```bash
vps-mediasync-cli --version
```

Show available commands:

```bash
vps-mediasync-cli --help
```

---

# 4. Connecting your Android phone

MediaSync uses ADB to communicate with your phone.

## USB connection

On your Android phone:

1. Open **Settings → About Phone**
2. Enable **Developer Options**
3. Enable **USB Debugging**
4. Connect the phone to your Mac using USB
5. Accept the **ad** prompt on the phone

Verify:

```bash
adb devices
```

You should see something similar to:

```text
List of devices attached
edd07889    device
```

MediaSync will detect the device automatically.

---

## Wi-Fi connection

ADB can also communicate with an Android device over Wi-Fi.

The exact connection procedure depends on the Android version and device configuration.

Once the device has been connected through ADB, verify:

```bash
adb devices
```

MediaSync will treat USB and Wi-Fi connected devices in the same way.

---

# 5. Backup

Run:

```bash
vps-mediasync-cli backup
```

MediaSync will guide you through the complete process.

---

## Step 1 — Dependency check

MediaSync first checks required tools:

```text
▶ Checking dependencies...
✔ ADB available
⚠ Using system rsync
```

If ADB is missing, you will be asked whether you want MediaSync to install it.

---

## Step 2 — Select your Android device

MediaSync always asks you to select the device, even when only one device is connected.

For example:

```text
? Select a device:
❯ OnePlus CPH2487 • Android 15 (edd07889)
```

This prevents MediaSync from silently choosing the wrong phone when multiple devices are connected.

---

## Step 3 — Select what to back up

MediaSync uses **user-oriented categories** rather than requiring you to understand Android's storage structure.

For example:

```text
? What do you want to backup?

◯ Images
◯ Videos
◯ Downloads
◯ Documents
◯ Audio / Recordings
◯ Apps
```

### Images

Includes common locations such as:

```text
Camera
Screenshots
Pictures
```

### Videos

Includes common video locations such as:

```text
Camera
Movies
```

### Downloads

Includes:

```text
Downloads
```

### Documents

Includes:

```text
Documents
```

### Audio / Recordings

Includes:

```text
Music
Recordings
```

MediaSync converts these high-level choices into the appropriate Android storage paths.

---

# 6. App-aware backup

When the **Apps** category is selected, MediaSync can inspect the installed Android applications and allow the user to select applications whose media should be backed up.

For example:

```text
? Select apps:

◯ WhatsApp
◯ Telegram
◯ Adobe Scan
```

The user does not need to know the underlying Android directory structure.

MediaSync determines the corresponding application storage location.

> App-aware backup is currently being developed as part of the V1 feature set.

---

# 7. Backup destination

MediaSync allows you to select the permanent backup destination interactively.

The destination can be:

* A folder on your Mac
* An external USB drive
* An attached SSD/HDD
* Another mounted volume

For example:

```text
? Select destination:

/Users/vps
  📁 Applications
  📁 Backups
  📁 Desktop
  📁 Documents
  📁 Downloads
```

You can navigate the filesystem and select the destination folder.

MediaSync creates its backup folders underneath the selected destination.

---

# 8. How backup works

MediaSync uses a two-stage process.

```text
Android
   │
   │ ADB
   ▼
Temporary local storage
   │
   │ rsync
   ▼
Permanent backup destination
```

### Stage 1 — Pull

Selected Android folders are copied to temporary storage using ADB.

### Stage 2 — Sync

The temporary data is incrementally synchronized to the permanent backup location using rsync.

Existing files are not unnecessarily copied again.

### Stage 3 — Cleanup

After synchronization, the temporary MediaSync directory is removed.

The permanent backup remains untouched.

---

# 9. Incremental backups

MediaSync is designed for repeated backups.

For example:

```text
First backup
Android → Mac
1000 files copied

Second backup
Android → Mac
50 new files copied
```

Previously backed-up files are not copied again when they already exist in the destination.

This makes subsequent backups significantly more efficient than repeatedly copying the entire phone.

---

# 10. Cleanup

Run:

```bash
vps-mediasync-cli cleanup
```

MediaSync will ask:

1. Which categories should be cleaned?
2. How old should a file be before it is considered for deletion?
3. Whether you want to proceed.

For example:

```text
? What do you want to clean?

◯ Images
◯ Videos
◯ Downloads
◯ Documents
◯ Audio

? Delete files older than how many months?
❯ 6
```

MediaSync identifies files matching the selected criteria before deletion.

---

# 11. Dry-run mode

Cleanup is potentially destructive, so MediaSync provides a dry-run mode.

Run:

```bash
vps-mediasync-cli cleanup --dry-run
```

Dry-run mode performs the discovery and preview stages but **does not delete files**.

Use this before performing an unfamiliar cleanup operation.

Conceptually:

```text
Normal:

Android → Find files → Confirm → Delete

Dry-run:

Android → Find files → Preview → STOP
```

---

# 12. Hello command

The `hello` command is primarily a development/scaffolding command.

```bash
vps-mediasync-cli hello
```

It can be used to verify that:

* The CLI is installed
* oclif command discovery works
* Interactive prompts work
* The basic CLI runtime is functioning

It is not part of the actual backup workflow.

---

# 13. Command summary

```bash
# Show help
vps-mediasync-cli --help

# Show version
vps-mediasync-cli --version

# Backup Android data
vps-mediasync-cli backup

# Clean old Android files
vps-mediasync-cli cleanup

# Preview cleanup without deleting
vps-mediasync-cli cleanup --dry-run

# Test CLI installation
vps-mediasync-cli hello
```

---

# 14. Safety recommendations

Before using `cleanup`:

1. Run a backup first.
2. Use `--dry-run` to inspect what will be deleted.
3. Review the selected categories carefully.
4. Confirm that the correct Android device is selected.
5. Do not disconnect the phone during an active operation.

For important data, maintain an additional backup rather than relying on a single copy.

---

# 15. Typical workflow

A typical MediaSync session looks like:

```text
Install MediaSync
       │
       ▼
Connect Android phone
       │
       ▼
vps-mediasync-cli backup
       │
       ├── Check dependencies
       │
       ├── Select device
       │
       ├── Select data categories
       │
       ├── Select apps (if required)
       │
       ├── Select destination
       │
       ├── ADB pull
       │
       ├── Incremental rsync
       │
       └── Remove temporary files
       │
       ▼
     Backup
       │
       ▼
vps-mediasync-cli cleanup --dry-run
       │
       ▼
Review files
       │
       ▼
vps-mediasync-cli cleanup
       │
       ▼
Remove unwanted old files
```

---

## Quick Start

For most users, the complete process is simply:

```bash
npm install -g vps-mediasync-cli
```

Connect your Android phone and enable USB debugging, then:

```bash
vps-mediasync-cli backup
```

Follow the interactive prompts.

For safely reviewing old files:

```bash
vps-mediasync-cli cleanup --dry-run
```

When satisfied with the preview:

```bash
vps-mediasync-cli cleanup
```
