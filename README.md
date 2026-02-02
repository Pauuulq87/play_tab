<div align="center">
  <h1><img src="https://api.iconify.design/lucide/layout-grid.svg?color=%2300c9ff" width="28" height="28" /> Play Tab</h1>
  <p><strong>Browser tab and bookmark manager</strong></p>
  <p>Raindrop.io-inspired extension for Chrome. Drag tabs to save, organize by collections, dark mode UI with card-based layout.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Chrome-Extension-blue.svg" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React" />
</p>

<p align="center">
  <strong>English</strong> • <a href="README_zh-TW.md">繁體中文</a> • <a href="README_zh-CN.md">简体中文</a>
</p>

---

### <img src="https://api.iconify.design/lucide/triangle-alert.svg?color=%23ff6b6b" width="18" height="18" /> The Problem

Browser tabs pile up. Bookmarks get lost in nested folders. Switching between tabs and managing collections is clunky.

### <img src="https://api.iconify.design/lucide/sparkles.svg?color=%2300c9ff" width="18" height="18" /> The Solution

Visual bookmark + tab manager in Chrome side panel:

- **Drag-and-Drop** — Drag open tabs into collections
- **Card-Based UI** — Visual previews with favicons and OG images
- **Multi-Level Organization** — Spaces > Collections > Tags
- **Dark Mode** — Modern UI with Tailwind CSS
- **Live Tab List** — See all open tabs in right sidebar

### <img src="https://api.iconify.design/lucide/download.svg?color=%2300c9ff" width="18" height="18" /> Installation

**Prerequisites**
- Node.js >= 18.0.0
- npm >= 9.0.0

**Setup**
```bash
git clone https://github.com/Pauuulq87/play_tab.git
cd play_tab

# Install dependencies
npm install

# Build for production
npm run build

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select dist/ folder
```

### <img src="https://api.iconify.design/lucide/rocket.svg?color=%2300c9ff" width="18" height="18" /> Usage

**Save Tabs**
1. Open side panel
2. Drag tab from right sidebar to collection
3. Auto-saves with favicon + title

**Organize Collections**
- Create Spaces (top-level categories)
- Add Collections within Spaces
- Tag bookmarks for cross-collection search

**Quick Actions**
- Click bookmark card → Open tab
- Right-click → Edit/Delete/Move
- Search bar → Filter across all bookmarks

### <img src="https://api.iconify.design/lucide/wrench.svg?color=%2300c9ff" width="18" height="18" /> Development

```bash
# Dev mode (hot reload)
npm run dev

# Build
npm run build

# Type check
npm run type-check
```

**Tech Stack**
- React 18 + TypeScript
- Vite + CRXJS
- Tailwind CSS
- dnd-kit (drag-and-drop)
- Chrome Extension Manifest V3

---

<div align="center">
  <p><strong>MIT License</strong> - Made with care for tab hoarders and organization enthusiasts.</p>
  <p><em>Thanks to all GitHub developers who share their wisdom and experience — you made this possible.</em></p>
</div>
