# **Product Specification**

---

# **1\. 🧭 Product Overview**

## **1.1 Objective**

MediaSync is a **cross-platform CLI tool** designed to enable users to:

* Backup media from Android devices to Macbook  
* Clean up old files safely from device storage  
* Select data based on **intent (images, apps, time range)** instead of raw folders

---

## **1.2 Product Philosophy**

Raw filesystem → Abstracted user intent → Guided CLI experience

MediaSync transforms:

* Low-level ADB/file operations  
  → into  
* High-level, user-friendly workflows

---

## **1.3 Target Users**

* Developers  
* Power users  
* Tech-savvy individuals managing device storage  
* Future: general users (via GUI wrapper)

---

# **2\. 🧱 Core Features (V1 Scope)**

## **2.1 Sync (Primary Feature)**

### **Command**

mediasync sync

### **Capabilities**

* Detect connected Android device  
* Allow user to select:  
  * Data types (images, videos, documents)  
  * App-based media (WhatsApp, Camera, Screenshots, etc.)  
* Transfer files to local machine  
* Maintain directory structure

---

## **2.2 Clean (Storage Cleanup)**

### **Command**

mediasync clean

### **Capabilities**

* Identify old files based on time threshold  
* Preview files before deletion  
* Confirm deletion explicitly  
* Avoid system-critical directories

---

## **2.3 Apps (Discovery Layer)**

### **Command**

mediasync apps

### **Capabilities**

* Detect installed apps  
* Map apps → known storage paths  
* Allow selection of app-specific data

---

## **2.4 Config**

### **Command**

mediasync config set \<key\> \<value\>

### **Capabilities**

* Store:  
  * Default backup path  
  * Default retention period  
* Persist config in local file

---

# **3\. 🧠 UX Design Principles**

## **3.1 Interaction Model**

MediaSync is **guided-first, flags-second**

### **Default Mode**

mediasync sync

→ interactive prompts

### **Advanced Mode**

mediasync sync \--images \--whatsapp \--since=30d

---

## **3.2 Selection UX (Critical)**

### **Replace:**

* Folder selection

### **With:**

* Intent-based selection

Example:

What do you want to backup?

☑ Images  
   ├── ☑ Camera  
   ├── ☑ Screenshots  
   └── ☑ WhatsApp Images

☑ Videos  
☐ Documents

---

## **3.3 Safety UX (Critical)**

For destructive operations:

### **Step 1: Preview**

⚠️  1,245 files older than 3 months will be deleted

### **Step 2: Confirm**

Proceed? (yes/no)

---

## **3.4 Feedback UX**

* Spinners for long operations  
* Clear success/failure messages  
* Progress indication (future enhancement)

---

# **4\. 🏗️ System Architecture**

## **4.1 High-Level Layers**

CLI Layer (commands)  
↓  
UX Layer (prompts, formatting)  
↓  
Core Logic Layer  
↓  
Device Service Layer (ADB)  
↓  
Filesystem

---

## **4.2 Directory Structure**

src/  
  commands/  
    sync/  
    clean/  
    apps/  
    config/

  services/  
    device/  
      adb.ts  
      android.ts  
    sync/  
    cleanup/

  core/  
    config.ts  
    logger.ts  
    errors.ts

  utils/  
    prompt.ts  
    spinner.ts  
    formatter.ts

---

# **5\. 🔌 Device Integration (ADB Layer)**

## **5.1 Responsibilities**

* Detect device  
* Execute shell commands  
* List files  
* Pull files  
* Delete files

---

## **5.2 Key Functions**

getConnectedDevice()  
listFiles(path)  
pullFiles(remotePath, localPath)  
deleteFiles(paths)

---

## **5.3 Constraints**

* Must not assume device root access  
* Must handle:  
  * No device connected  
  * Multiple devices  
  * Permission issues

---

# **6\. 📂 Data Mapping Layer**

## **6.1 App → Path Mapping**

Example:

{  
  "whatsapp": "/sdcard/WhatsApp/Media",  
  "camera": "/sdcard/DCIM/Camera",  
  "screenshots": "/sdcard/Pictures/Screenshots",  
  "downloads": "/sdcard/Download"  
}

---

## **6.2 Extensibility**

* Allow adding new mappings  
* Future: dynamic detection

---

# **7\. ⚙️ Technology Stack**

## **7.1 Core Stack**

* Node.js (ESM)  
* TypeScript

---

## **7.2 CLI Framework**

* `@oclif/core`

---

## **7.3 UX Libraries**

* `inquirer` → prompts  
* `chalk` → colors  
* `ora` → spinners

---

## **7.4 Build**

* `esbuild`

---

## **7.5 Device Communication**

* ADB (via child\_process)

---

# **8\. 📦 Packaging & Distribution**

## **8.1 Package Type**

* npm package (primary)

---

## **8.2 Installation**

npm install \-g mediasync

---

## **8.3 package.json Requirements**

{  
  "name": "mediasync",  
  "bin": {  
    "mediasync": "./dist/index.js"  
  }  
}

---

## **8.4 Build Pipeline**

src → esbuild → dist → npm publish

---

## **8.5 Versioning**

* Semantic versioning (semver)

---

## **8.6 Alternative Distribution (Future)**

* Standalone binary (pkg/nexe)  
* GitHub releases

---

# **9\. 🔐 Safety & Reliability**

## **9.1 File Safety Rules**

* Never delete:  
  * system directories  
  * unknown paths  
* Always:  
  * preview before delete  
  * require confirmation

---

## **9.2 Error Handling**

* Graceful failures  
* Clear error messages  
* Exit codes

---

# **10\. ⚡ Performance Considerations**

* Avoid loading entire file lists into memory  
* Stream file operations where possible  
* Batch operations

---

# **11\. 🔮 Future Enhancements**

## **11.1 UX**

* Progress bars  
* Resume interrupted transfers

## **11.2 Intelligence**

* Smart recommendations:  
  * “You can free 3GB by deleting old WhatsApp videos”

## **11.3 Conversational CLI**

mediasync "backup whatsapp images from last 3 months"

## **11.4 GUI Wrapper**

* Electron or web-based UI

---

# **12\. 🧪 Development Roadmap**

## **Phase 1 (Now)**

* CLI scaffold  
* `sync` command (interactive, mock)

## **Phase 2**

* ADB integration  
* Real file transfer

## **Phase 3**

* `clean` command  
* Safety UX

## **Phase 4**

* Config system  
* npm publish

## **Phase 5**

* Polish \+ optimization

---

# **13\. 🧠 Key Design Decisions**

## **13.1 Intent over filesystem**

Users think:

* “backup WhatsApp images”  
  NOT:  
* “/sdcard/WhatsApp/Media/Images”

---

## **13.2 Guided UX over flags**

* CLI behaves like a wizard by default

---

## **13.3 Modular architecture**

* Commands ≠ business logic

---

# **14\. ✅ Definition of Done (V1)**

* `mediasync sync` works end-to-end  
* `mediasync clean` safely deletes old files  
* Interactive UX implemented  
* Packaged and installable via npm  
* Works reliably on Mac \+ Android

---

# **🔥 Final Note (Important for your coding agent)**

This is not a scripting tool.

This is:

A user-facing product delivered via CLI

So:

* UX is first-class  
* Safety is mandatory  
* Abstractions matter

---

If you want next, we can:  
👉 Convert this into a **task-by-task execution plan for your coding agent**  
or  
👉 Start implementing **the exact `mediasync sync` command with real ADB integration**

