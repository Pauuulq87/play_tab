# Play Tab 快速開始

## 專案已完成初始化

### 已完成項目

✅ 更新 docs/specs/ 規格文件（tech-choices, data-model, module-structure）
✅ 初始化 Vite + React + TypeScript + Tailwind 專案
✅ 複製參考專案元件到 src/ 結構
✅ 建立 manifest.json (Chrome Extension)
✅ 更新 changelog.md

---

## 安裝與執行

### 1. 安裝依賴

```bash
npm install
```

### 2. 開發模式

```bash
npm run dev
```

瀏覽器開啟 `http://localhost:3000` 預覽介面。

---

## 專案結構總覽

```
play_tab/
├── src/main/
│   ├── typescript/
│   │   ├── components/
│   │   │   ├── layout/           # LeftSidebar, MainContent, RightSidebar
│   │   │   └── ui/               # SettingsModal
│   │   ├── core/                 # App.tsx
│   │   ├── models/               # types.ts
│   │   └── index.tsx             # 入口
│   └── resources/
│       ├── config/               # constants.tsx (Mock 資料)
│       └── assets/               # index.css
├── public/
│   ├── manifest.json             # Chrome Extension 設定
│   └── background.js             # Service Worker
├── docs/
│   ├── SETUP.md                  # 詳細設置指南
│   ├── specs/                    # 規格文件
│   └── changelog.md              # 變更日誌
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 功能特色

### 已實作

- 三欄式介面（左側導航 / 中央收藏區 / 右側分頁列表）
- 深色模式切換
- 設定彈窗
- Mock 資料展示

### 待開發

- 整合真實 Chrome Tabs API
- 拖曳互動（從右側分頁拖曳到中央收藏區）
- 資料持久化（chrome.storage）
- 雲端同步（Supabase）

---

## 相關文件

- `CLAUDE.md` — 專案規則總覽
- `docs/SETUP.md` — 詳細設置指南
- `docs/specs/tech-choices.md` — 技術選型說明
- `docs/specs/data-model.md` — 資料模型
- `docs/specs/module-structure.md` — 模組結構

---

## 下一步建議

1. 執行 `npm install` 安裝依賴
2. 執行 `npm run dev` 啟動開發伺服器
3. 開啟 `http://localhost:3000` 查看介面
4. 閱讀 `docs/SETUP.md` 了解如何載入 Chrome Extension

