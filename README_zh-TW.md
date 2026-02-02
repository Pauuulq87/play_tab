<div align="center">
  <h1><img src="https://api.iconify.design/lucide/layout-grid.svg?color=%2300c9ff" width="28" height="28" /> Play Tab</h1>
  <p><strong>瀏覽器分頁與書籤管理器</strong></p>
  <p>仿 Raindrop.io 的 Chrome 擴充功能。拖曳分頁即可儲存、用集合整理、卡片式深色模式 UI。</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Chrome-Extension-blue.svg" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React" />
</p>

<p align="center">
  <a href="README.md">English</a> • <strong>繁體中文</strong> • <a href="README_zh-CN.md">简体中文</a>
</p>

---

### <img src="https://api.iconify.design/lucide/triangle-alert.svg?color=%23ff6b6b" width="18" height="18" /> 痛點

瀏覽器分頁越開越多。書籤埋在巢狀資料夾裡找不到。在分頁和收藏間切換很笨拙。

### <img src="https://api.iconify.design/lucide/sparkles.svg?color=%2300c9ff" width="18" height="18" /> 解決方案

Chrome 側邊面板的視覺化書籤 + 分頁管理器：

- **拖放功能** — 拖曳開啟的分頁到收藏集合
- **卡片式 UI** — 視覺預覽含 favicon 和 OG 圖片
- **多層級整理** — 空間 > 集合 > 標籤
- **深色模式** — Tailwind CSS 現代化 UI
- **即時分頁清單** — 右側欄顯示所有開啟分頁

### <img src="https://api.iconify.design/lucide/download.svg?color=%2300c9ff" width="18" height="18" /> 安裝

**前置需求**
- Node.js >= 18.0.0
- npm >= 9.0.0

**設定**
```bash
git clone https://github.com/Pauuulq87/play_tab.git
cd play_tab

# 安裝依賴
npm install

# 正式版建置
npm run build

# 載入到 Chrome
# 1. 開啟 chrome://extensions/
# 2. 啟用開發人員模式
# 3. 點擊「載入未封裝項目」
# 4. 選擇 dist/ 資料夾
```

### <img src="https://api.iconify.design/lucide/rocket.svg?color=%2300c9ff" width="18" height="18" /> 使用方式

**儲存分頁**
1. 開啟側邊面板
2. 從右側欄拖曳分頁到集合
3. 自動儲存 favicon + 標題

**整理收藏**
- 建立空間（頂層分類）
- 在空間內新增集合
- 用標籤標記書籤，跨集合搜尋

**快速操作**
- 點擊書籤卡片 → 開啟分頁
- 右鍵 → 編輯/刪除/移動
- 搜尋列 → 過濾所有書籤

### <img src="https://api.iconify.design/lucide/wrench.svg?color=%2300c9ff" width="18" height="18" /> 開發

```bash
# 開發模式（熱重載）
npm run dev

# 建置
npm run build

# 類型檢查
npm run type-check
```

**技術棧**
- React 18 + TypeScript
- Vite + CRXJS
- Tailwind CSS
- dnd-kit（拖放功能）
- Chrome Extension Manifest V3

---

<div align="center">
  <p><strong>MIT License</strong> - 專為分頁囤積者和整理控打造。</p>
  <p><em>謝謝 GitHub 開發者把智慧與經驗分享出來，才有今天的我。</em></p>
</div>
