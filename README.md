# 瀏覽器分頁與書籤管理插件開發：介面仿製與技術架構分析

這張截圖顯示的是一個類似 **Raindrop.io** 風格的高級書籤管理器與分頁（Tab）管理工具。要開發類似這樣的瀏覽器插件（Browser Extension），你需要採用現代化的前端技術棧，並深入理解瀏覽器擴充功能的 Manifest V3 架構。

以下是基於圖片中介面與功能的詳細開發分析與建議。

---

### 1. 核心功能需求分析 (基於截圖)

根據圖片，這個應用程式主要分為三個區塊，你的開發計畫需包含以下核心功能：

* **左側導航欄 (Sidebar Navigation)：**
* **多層級分類：** 支援 Spaces（空間）、Collections（集合）與標籤。
* **拖曳功能：** 支援拖曳分類順序。
* **帳戶與狀態：** 顯示使用者名稱 (Paul) 與升級提示 (SaaS 模式常見設計)。


* **中間主視圖 (Main Content Grid)：**
* **卡片式佈局：** 將書籤顯示為帶有預覽圖（Favicon/OG Image）、標題與描述的卡片。
* **分組顯示：** 依據分類（如「孟書」、「卡片筆記」）進行區塊分隔。
* **CRUD 操作：** 能夠新增、編輯、刪除書籤。


* **右側分頁欄 (Tab Manager - Side Panel)：**
* **即時分頁獲取：** 讀取瀏覽器當前開啟的所有分頁 (Open Tabs)。
* **分頁操作：** 點擊跳轉、關閉分頁、將分頁拖曳存入中間的收藏庫。



---

### 2. 推薦技術棧

為了實現這種桌面應用級別的流暢度，建議不使用原生的 HTML/JS，而是使用現代框架：

* **核心框架：** **React** 或 **Vue 3** (建議 React，生態系對 Extension 支援較好)。
* **建置工具：** **Vite** 搭配 **CRXJS Vite Plugin** (這能極大簡化 HMR 熱更新與 Manifest 配置)。
* **樣式庫：** **Tailwind CSS** (這張圖是典型的深色模式 UI，Tailwind 處理 Dark Mode 非常高效)。
* **拖曳套件：** **dnd-kit** (React) 或 **SortableJS**，用於實現從右側分頁拖曳到中間收藏區的功能。
* **狀態管理：** **Zustand** 或 **TanStack Query** (管理本地分頁狀態與雲端書籤數據)。
* **後端資料庫 (若需雲端同步)：** **Supabase** 或 **Firebase** (用於儲存 Collections 結構，因為瀏覽器原生 Bookmarks API 欄位有限，難以達成圖中的豐富卡片筆記功能)。

---

### 3. 架構設計與 Manifest V3 權限

在 `manifest.json` 中，你需要申請以下關鍵權限才能達成圖中功能：

```json
{
  "manifest_version": 3,
  "name": "My Bookmark Manager",
  "version": "1.0.0",
  "permissions": [
    "tabs",           // 讀取右側 Open Tabs 需要
    "activeTab",      // 獲取當前頁面資訊
    "storage",        // 儲存用戶偏好
    "bookmarks",      // 如果你要同步原生書籤
    "favicon"         // 讀取網站圖示
  ],
  "action": {
    "default_title": "Open Manager"
  },
  "side_panel": {
    "default_path": "sidepanel.html" // 如果你想做成瀏覽器側邊欄形式
  },
  "options_page": "options.html",    // 全螢幕管理介面（即截圖中的樣子）
  "background": {
    "service_worker": "background.js"
  }
}

```

---

### 4. 介面佈局實作策略 (CSS Grid)

這張圖是經典的「三欄式佈局」，在 CSS 中建議使用 Grid 佈局來處理：

```css
/* Tailwind CSS 概念代碼 */
<div className="h-screen w-screen bg-gray-900 text-white grid grid-cols-[250px_1fr_300px]">
  
  {/* Left Sidebar: Navigation */}
  <aside className="border-r border-gray-700 p-4 overflow-y-auto">
    {/* Search, Spaces, Collections List */}
  </aside>

  {/* Main Content: Card Grid */}
  <main className="p-6 bg-gray-800 overflow-y-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {/* Cards go here */}
    </div>
  </main>

  {/* Right Sidebar: Open Tabs */}
  <aside className="border-l border-gray-700 p-4 bg-gray-900 overflow-y-auto">
    <h3 className="text-sm font-bold mb-4">Open Tabs</h3>
    {/* Tab List Items */}
  </aside>

</div>

```

---

### 5. 關鍵功能實作邏輯：獲取右側分頁列表

這是截圖右側功能的技術核心。你需要使用 Chrome Extension API 來獲取當前視窗的分頁：

```javascript
// 在 React 組件中獲取當前分頁列表
import { useEffect, useState } from 'react';

const TabList = () => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    // 檢查是否在 Extension 環境中
    if (chrome && chrome.tabs) {
      // 查詢當前視窗的所有分頁
      chrome.tabs.query({ currentWindow: true }, (result) => {
        setTabs(result);
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {tabs.map((tab) => (
        <div key={tab.id} className="p-2 bg-gray-800 rounded hover:bg-gray-700 cursor-pointer flex items-center gap-2">
          <img src={tab.favIconUrl} className="w-4 h-4" alt="" />
          <span className="truncate text-sm">{tab.title}</span>
        </div>
      ))}
    </div>
  );
};

```

---

### 6. 開發建議步驟

1. **環境建置：** 使用 `npm create vite@latest my-extension -- --template react` 初始化專案，並安裝 `active-tab` 或 `crxjs`。
2. **靜態切版：** 先不要接 API，用假資料（Mock Data）把左、中、右三欄的 CSS 樣式刻出來，確保深色模式與 RWD 效果。
3. **串接 Chrome API：** 實作右側「讀取分頁」功能。
4. **資料結構設計：** 設計一個 JSON 結構來儲存 Collection 和書籤（例如：`{ id, title, url, collectionId, tags }`）。
5. **拖曳互動：** 實作從右側分頁列表拖曳項目到中間區域，觸發「新增書籤」的動作。

---

## 專案資訊

- **專案名稱**：play_tab
- **專案類型**：Standard
- **主要語言**：TypeScript
- **技術棧**：React + Vite + Tailwind CSS + Chrome Extension API

---

## 快速開始

### 🚀 立即開始

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 開啟瀏覽器
open http://localhost:3000
```

### 📚 文件導覽

- **快速入門**：閱讀 `QUICKSTART.md`
- **詳細設置**：閱讀 `docs/SETUP.md`
- **專案規範**：閱讀 `CLAUDE.md`

### ✅ 專案狀態

- [x] 前端架構初始化完成
- [x] 三欄式介面實作完成
- [x] 深色模式支援
- [x] Chrome Extension 基礎設定
- [ ] Chrome Tabs API 整合
- [ ] 拖曳互動功能
- [ ] 資料持久化

---

## 專案結構

```
play_tab/
├── src/
│   ├── main/
│   │   ├── typescript/
│   │   │   ├── core/          # 核心邏輯
│   │   │   ├── utils/         # 工具函式
│   │   │   ├── models/        # 資料模型
│   │   │   ├── services/      # 服務層
│   │   │   ├── api/           # API 介面
│   │   │   ├── components/    # React 元件
│   │   │   └── pages/         # 頁面元件
│   │   └── resources/
│   │       ├── config/        # 設定檔
│   │       └── assets/        # 靜態資源
│   └── test/
│       ├── unit/              # 單元測試
│       └── integration/       # 整合測試
├── docs/
│   ├── rules/                 # 開發規則
│   └── specs/                 # 規格文件
├── tools/                     # 開發工具
├── examples/                  # 範例程式
├── output/                    # 輸出檔案
└── user/                      # 私人區域（不進版控）
    ├── docs/                  # 使用者文件
    ├── references/            # 參考資料
    ├── external/              # 外部資源
    └── inputs/                # 輸入資料
```

---

## 文件索引

詳見 `user/docs/CLAUDE.md` 的完整文件索引。

