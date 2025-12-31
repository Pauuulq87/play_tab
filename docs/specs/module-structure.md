# 模組結構概要

版本：1.0.0
最後更新：2025-12-31

---

## 概述

本文件描述瀏覽器分頁管理插件的模組架構，供 AI 代理查閱。

---

## 目錄結構

```
src/main/
├── typescript/
│   ├── components/         # React 元件
│   │   ├── layout/         # 佈局元件
│   │   │   ├── LeftSidebar.tsx
│   │   │   ├── MainContent.tsx
│   │   │   └── RightSidebar.tsx
│   │   ├── ui/             # 通用 UI 元件
│   │   │   └── SettingsModal.tsx
│   │   └── index.ts        # 統一匯出
│   │
│   ├── core/               # 核心邏輯
│   │   └── App.tsx         # 應用程式進入點
│   │
│   ├── models/             # 資料模型（TypeScript 型別）
│   │   └── types.ts
│   │
│   ├── services/           # 服務層
│   │   ├── tabService.ts   # Chrome Tabs API 封裝
│   │   └── storageService.ts # Chrome Storage API 封裝
│   │
│   ├── utils/              # 工具函式
│   │   └── helpers.ts
│   │
│   ├── api/                # API 介面（未來雲端同步）
│   │
│   └── pages/              # 頁面元件
│       └── options.tsx     # 選項頁面
│
└── resources/
    ├── config/             # 設定檔
    │   └── constants.ts    # 常數定義
    │
    └── assets/             # 靜態資源
        └── icons/          # 插件圖示
```

---

## 模組職責

### components/layout/

| 元件 | 職責 |
|-----|------|
| LeftSidebar | 左側導航：使用者資訊、搜尋、Spaces 列表 |
| MainContent | 中央區域：收藏集卡片網格、工具列 |
| RightSidebar | 右側面板：開啟中的分頁列表 |

### components/ui/

| 元件 | 職責 |
|-----|------|
| SettingsModal | 設定彈窗：帳戶資訊、偏好設定 |

### core/

| 檔案 | 職責 |
|-----|------|
| App.tsx | 應用根元件，管理全域狀態（主題切換） |

### models/

| 檔案 | 職責 |
|-----|------|
| types.ts | TypeScript 介面定義：TabItem、CollectionGroup、SidebarItem |

### services/

| 檔案 | 職責 |
|-----|------|
| tabService.ts | 封裝 chrome.tabs API（查詢、關閉、切換分頁） |
| storageService.ts | 封裝 chrome.storage API（讀寫設定、書籤） |

### resources/config/

| 檔案 | 職責 |
|-----|------|
| constants.ts | Mock 資料、預設值、靜態配置 |

---

## 依賴關係

```
App.tsx
├── LeftSidebar
│   └── constants.ts (SIDEBAR_ITEMS)
├── MainContent
│   └── constants.ts (MOCK_COLLECTIONS)
├── RightSidebar
│   └── constants.ts (OPEN_TABS)
│   └── tabService.ts (未來整合)
└── SettingsModal
    └── storageService.ts (未來整合)
```

---

## 匯入慣例

### 路徑別名

使用 `@/` 代表 `src/main/typescript/`

```typescript
// 範例
import { TabItem } from '@/models/types';
import { LeftSidebar } from '@/components/layout';
import { SIDEBAR_ITEMS } from '@/resources/config/constants';
```

### 匯出策略

- 元件使用 `export default`
- 型別使用 `export interface`
- 工具函式使用 `export const`

---

## 變更記錄

| 日期 | 變更 | 影響 |
|-----|------|-----|
| 2025-12-31 | 初始化模組結構 | 建立專案架構 |
