# Play Tab 專案設置指南

版本：1.0.0
最後更新：2025-12-31

---

## 前置需求

- Node.js 18+ 
- npm 或 yarn
- Chrome 或 Edge 瀏覽器（支援 Manifest V3）

---

## 安裝步驟

### 1. 安裝依賴

```bash
npm install
```

### 2. 開發模式

```bash
npm run dev
```

瀏覽器開啟 `http://localhost:3000` 預覽介面。

### 3. 建置生產版本

```bash
npm run build
```

輸出檔案位於 `output/dist/`。

---

## 作為 Chrome Extension 安裝

### 1. 建置專案

```bash
npm run build
```

### 2. 載入 Extension

1. 開啟 Chrome，輸入 `chrome://extensions/`
2. 開啟右上角「開發人員模式」
3. 點擊「載入未封裝項目」
4. 選擇 `output/dist/` 資料夾

### 3. 使用

- 點擊瀏覽器工具列的 Play Tab 圖示
- 或在新分頁開啟（需調整 manifest.json）

---

## 專案結構

```
play_tab/
├── src/main/
│   ├── typescript/          # TypeScript 原始碼
│   │   ├── components/      # React 元件
│   │   ├── core/            # 核心邏輯
│   │   ├── models/          # 資料模型
│   │   └── index.tsx        # 入口
│   └── resources/
│       ├── config/          # 設定檔
│       └── assets/          # 靜態資源
├── public/                  # Extension 公開檔案
│   ├── manifest.json
│   └── background.js
├── docs/                    # 文件
├── output/                  # 建置輸出
└── user/                    # 私人區域（不進版控）
```

---

## 開發規範

請閱讀：

- `CLAUDE.md` — 專案規則總覽
- `docs/rules/` — 開發規則
- `docs/specs/` — 規格文件

---

## 疑難排解

### 無法安裝依賴

```bash
# 清除快取重試
rm -rf node_modules package-lock.json
npm install
```

### Vite 啟動失敗

檢查埠號 3000 是否被佔用：

```bash
lsof -i :3000
kill -9 <PID>
```

### Extension 無法載入

1. 確認 `output/dist/manifest.json` 存在
2. 確認 manifest 格式正確（JSON 語法）
3. 查看 Chrome Extensions 頁面的錯誤訊息

---

## 下一步

1. 整合真實 Chrome Tabs API（目前使用 Mock 資料）
2. 實作拖曳功能（dnd-kit）
3. 新增資料持久化（chrome.storage）
4. 雲端同步（Supabase 整合）

