# 📦 MediaSync CLI

Backup and clean Android media to your Mac — safely and interactively.

---

## 🚀 Install

```bash
npm install -g vps-mediasync-cli
```

---

## ⚡ Usage

### Backup media

```bash
vps-mediasync-cli backup
```

### Clean old files

```bash
vps-mediasync-cli cleanup
```

---

## ✨ Features

* 📱 Detect connected Android devices (USB / WiFi)
* 🧠 Category-based backup (Images, Videos, Documents, etc.)
* 🔄 Incremental sync using rsync
* 🧹 Safe cleanup with dry-run mode
* 📂 Interactive folder selection

---

## 📋 Requirements

* ADB (Android Debug Bridge)
* rsync (pre-installed on macOS)

---

## 📱 Supported Data

* Images (Camera, Screenshots, WhatsApp)
* Videos
* Downloads
* Documents
* Audio / Recordings

---

## ⚠️ Safety

* Cleanup supports `--dry-run`
* No destructive actions without confirmation

---

## 🛠 Built With

* Node.js (ESM)
* TypeScript
* oclif
* Inquirer
* ADB + rsync

---

## 🚀 Roadmap

* [ ] Auto-install dependencies (ADB, rsync)
* [ ] App-level backup (WhatsApp, Telegram, etc.)
* [ ] Device naming (Pixel, Samsung, etc.)
* [ ] WiFi connection flow
* [ ] GUI wrapper (future)

---

## 👨‍💻 Author

Vikram Singh

---

## ⭐ Support

If you find this useful, consider starring the repo.
