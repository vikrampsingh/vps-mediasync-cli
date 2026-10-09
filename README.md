# 📦 MediaSync CLI

Backup and clean Android media to your Mac — safely and interactively.

---

## ✨ Features

* 📱 Detect connected Android devices (USB / WiFi)
* 🧠 Category-based backup (Images, Videos, Documents, etc.)
* 🔄 Incremental sync using rsync
* 🧹 Safe cleanup with dry-run mode
* 📂 Interactive folder selection

---

## 🚀 Install

```bash
npm install -g vps-mediasync-cli
```

---

## ⚡ Usage

```bash
# Backup media
vps-mediasync-cli backup

# Preview a backup without copying anything
vps-mediasync-cli backup --dry-run

# Clean old files
vps-mediasync-cli cleanup

# Preview a cleanup without deleting anything
vps-mediasync-cli cleanup --dry-run
```

📖 Full walkthrough with examples: [docs/specs/user-guide.md](docs/specs/user-guide.md)

---

## 📋 Requirements

* macOS
* Node.js >= 18
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

## 📚 Documentation

| Document | What it covers |
| -------- | -------------- |
| [docs/specs/product-requirements.md](docs/specs/product-requirements.md) | What the product is and must do |
| [docs/specs/architecture-design.md](docs/specs/architecture-design.md) | How the product is built |
| [docs/specs/ux-guidelines.md](docs/specs/ux-guidelines.md) | How the product interacts |
| [docs/specs/user-guide.md](docs/specs/user-guide.md) | How to install and use the product |
| [docs/specs/roadmap.md](docs/specs/roadmap.md) | Where the product is going |
| [docs/plans/](docs/plans/) | Per-feature implementation plans |

---

## 🤝 Contributing

Contributions are welcome — features, bug fixes, and documentation.

Quick start:

```bash
git clone https://github.com/vikrampsingh/vps-mediasync-cli.git
cd vps-mediasync-cli
npm install
npm run build
node ./bin/run.js backup
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

---

## 🛠 Built With

* Node.js (ESM)
* TypeScript
* oclif
* Inquirer
* ADB + rsync

---

## 🚀 Roadmap

See [docs/specs/roadmap.md](docs/specs/roadmap.md) for the current milestone and future direction.

---

## 👨‍💻 Author

Vikram Singh

---

## 📄 License

[MIT](LICENSE)

---

## ⭐ Support

If you find this useful, consider starring the repo.
