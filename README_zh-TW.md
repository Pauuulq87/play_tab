<div align="center">

# Play Tab

<img src="https://api.iconify.design/mdi/tab.svg" width="64" height="64" alt="Tab Manager"/>

瀏覽器分頁與書籤管理插件。Raindrop.io 風格 UI，深色模式、拖曳功能、雲端同步。

[English](./README.md) | **繁體中文** | [简体中文](./README_zh-CN.md)

</div>

---

## 功能特色

- **三欄式佈局** — 左側導航（集合）、中間網格（書籤）、右側面板（開啟的分頁）
- **卡片視圖** — 豐富的書籤卡片，含 Favicon、標題、描述
- **拖曳功能** — 從右側面板拖曳分頁存為書籤
- **深色模式** — 現代深色 UI 設計
- **Chrome 擴充功能** — Manifest V3 規範

## 技術棧

- React 19 + TypeScript
- Vite + Tailwind CSS
- Chrome Extension API
- Supabase（可選雲端同步）

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置
npm run build
```

## 載入擴充功能

1. 開啟 `chrome://extensions/`
2. 啟用「開發人員模式」
3. 點擊「載入未封裝項目」
4. 選擇 `dist/` 資料夾

## 專案結構

```
play_tab/
├── src/
│   ├── components/    # React 元件
│   ├── pages/         # 頁面元件
│   ├── services/      # 服務層
│   └── utils/         # 工具函式
├── docs/              # 文件
└── public/            # 靜態資源
```

## 文件

- [QUICKSTART.md](./QUICKSTART.md) — 快速入門
- [docs/SETUP.md](./docs/SETUP.md) — 詳細設置
- [CLAUDE.md](./CLAUDE.md) — 專案規範

## 開發狀態

- [x] 前端架構初始化完成
- [x] 三欄式介面實作完成
- [x] 深色模式支援
- [x] Chrome Extension 基礎設定
- [ ] Chrome Tabs API 整合
- [ ] 拖曳互動功能
- [ ] 資料持久化

---

## 授權

MIT

## 致謝

Made with ❤️ by **Pauuulq87**
