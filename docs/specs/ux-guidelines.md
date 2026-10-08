# MediaSync CLI — UX Guidelines

This document defines **how MediaSync interacts with the user**. It is the
reference for all prompts, messages, and interactive flows.

* What the product must do → `product-requirements.md`
* How interactions are implemented → `architecture-design.md` (`utils/`)

---

## 1. Interaction Model

MediaSync is **guided-first, flags-second**.

Default mode — the CLI behaves like a wizard:

```bash
vps-mediasync-cli backup
```

→ interactive prompts walk the user through the complete workflow.

Advanced mode — flags may shorten or bypass prompts:

```bash
vps-mediasync-cli cleanup --dry-run
```

Interactive prompts remain the primary experience; flags are conveniences,
never a requirement for normal use.

---

## 2. Intent-Based Selection

Replace folder selection with intent-based selection.

Users choose from high-level categories:

```text
? What do you want to backup?

◯ Images
◯ Videos
◯ Downloads
◯ Documents
◯ Audio / Recordings
◯ Apps
```

The user never needs to know Android's storage structure. MediaSync converts
these choices into the appropriate Android paths internally (see
`architecture-design.md` §6).

Prompt-type conventions:

* `select` for single-choice decisions
* `checkbox` for multiple selections
* input prompts for values (e.g. age threshold)
* spinners for long-running operations

---

## 3. Device Presentation

Always ask the user to select a device, even when only one device is
connected. This prevents silently choosing the wrong phone.

Present a human-readable device description:

```text
? Select a device:
❯ OnePlus CPH2487 • Android 16 (edd07889)
```

The device ID remains visible (useful for disambiguation) but is never the
primary user-facing description.

---

## 4. Application Naming

Present friendly application names:

```text
? Select apps:

◯ WhatsApp
◯ Telegram
◯ Instagram
◯ Adobe Scan
```

rather than raw package identifiers:

```text
✗ com.whatsapp
✗ org.telegram.messenger
```

Package IDs are internal identifiers, translated into meaningful names
wherever a friendly name is available.

---

## 5. Destination Selection

The backup destination is selected through interactive filesystem
navigation:

```text
? Select destination:

/Users/vps
  📁 Applications
  📁 Backups
  📁 Desktop
  📁 Documents
  📁 Downloads
```

Rules:

* The user navigates and selects a folder — never types an Android-style
  path or constructs shell commands.
* Hidden system/configuration directories are generally hidden to reduce
  clutter.

---

## 6. Safety UX

For destructive operations, the flow is always:

### Step 1 — Preview

```text
⚠ 1,245 files older than 6 months will be deleted
```

### Step 2 — Confirm

```text
? Proceed? (yes/no)
```

Deletion happens only after explicit confirmation. `--dry-run` stops after
the preview — it is a genuine non-destructive preview, not a display option
(see `product-requirements.md` §5).

---

## 7. Feedback & Message Style

The CLI should feel like an interactive utility application.

Prefer:

```text
▶ Checking dependencies...
✔ ADB available
✔ Device selected
✔ Destination selected
▶ Backing up images...
✔ Backup complete
```

Use:

* prompts for choices
* checkboxes for multiple selections
* spinners for operations that take time
* clear success/warning/error messages
* concise summaries

Avoid:

* unnecessary technical details
* raw package identifiers where friendly names are available
* raw Android paths in normal UX
* large uncontrolled streams of filenames
* unexplained shell output or shell errors

Technical details may be exposed when useful for troubleshooting, but never
as the default experience.

---

## 8. Error Messages

Errors should be understandable to normal users and handled at the
appropriate layer:

* Services detect and report operational failures.
* Commands turn those failures into understandable CLI outcomes.

Common failure cases that must produce clear messages:

* ADB unavailable
* no Android device connected
* Android device unauthorized
* destination inaccessible
* source path unavailable
* rsync failure
* insufficient permissions
* cleanup candidate discovery failure

Rules:

* Do not swallow errors silently.
* Do not expose raw stack traces during normal operation (an explicit
  debugging/developer mode may relax this).
* Do not invent successful outcomes after a failed operation.
