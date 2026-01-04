# 開發進度與待辦事項 (Backlog)

版本：1.0.0
最後更新：2025-12-31

---

## 專案現況分析

| 項目 | 狀態 | 備註 |
|-----|:----:|-----|
| 前端三欄式介面 | 已完成 | 基礎佈局與深色模式 |
| 資料模型定義 | 已完成 | types.ts + UserSettings |
| Mock 資料 | 已完成 | constants.tsx (已由真實資料取代) |
| Chrome Extension 基礎設定 | 已完成 | manifest.json |
| 服務層 (services/) | 已完成 | tabService, storageService, supabaseService |
| Chrome Tabs API 整合 | 已完成 | 即時查詢、切換、關閉、轉存 |
| 資料持久化 (Storage) | 已完成 | 收藏集/書籤/設定 CRUD |
| 匯出/匯入功能 | 已完成 | JSON 格式，支援合併策略 |
| 重複分頁偵測 | 已完成 | 自動偵測與關閉 |
| Tab Groups 支援 | 已完成 | 建立、查詢、更新群組 |
| Supabase 整合 | 已完成 | 資料表設計、Auth、雙向同步、資料表已建立 |
| 介面與服務層整合 | 已完成 | App, MainContent, LeftSidebar, SettingsModal 已連動 |
| 拖曳儲存功能 | 已完成 | Native HTML5 Drag & Drop 實作 |
| 測試與發布 | 待開發 | 整合測試、打包、上架 |

---

## 開發任務清單

### 階段 0：準備工作 (Preparation)

- [x] 0.1 建立 API 準備清單與說明文件 [已完成]

### 階段 1：服務層基礎建設 (Core Services)

- [x] 1.1 建立 `tabService.ts`：封裝 Chrome Tabs API [已完成]
- [x] 1.2 建立 `storageService.ts`：封裝 Chrome Storage API [已完成]
- [x] 1.3 建立型別擴充：補充 UserSettings 介面 [已完成]

### 階段 2：資料持久化 (Data Persistence)

- [x] 2.1 實作收藏集 CRUD 功能 [已完成]
- [x] 2.2 實作書籤項目 CRUD 功能 [已完成]
- [x] 2.3 實作使用者設定讀寫邏輯 [已完成]
- [x] 2.4 實作資料初始化邏輯 (First Install) [已完成]

### 階段 3：Chrome API 整合 (Extension Logic)

- [x] 3.1 實作即時分頁查詢 (取代 Mock 資料) [已完成]
- [x] 3.2 實作分頁點擊切換功能 [已完成]
- [x] 3.3 實作分頁關閉功能 [已完成]
- [x] 3.4 實作分頁轉存收藏功能 (拖曳/點擊) [已完成]

### 階段 4：進階功能 (Advanced Features)

- [x] 4.1 實作資料匯出功能 (JSON) [已完成]
- [x] 4.2 實作資料匯入功能 (JSON) [已完成]
- [x] 4.3 實作重複分頁偵測功能 [已完成]
- [x] 4.4 實作 Chrome Tab Groups 支援 [已完成]

### 階段 5：雲端同步 (Supabase Integration)

- [x] 5.1 設計 Supabase 資料表結構 [已完成]
- [x] 5.2 整合 Supabase Auth [已完成]
- [x] 5.3 實作資料雙向同步 [已完成]
- [x] 5.4 在 Supabase 執行資料表建立 SQL [已完成]

### 階段 6：介面整合與功能打磨 (UI Integration)

- [x] 6.1 整合 `App.tsx`：應用程式啟動時呼叫 `initializeData()` [已完成]
- [x] 6.2 整合 `MainContent.tsx`：讀取本地 `chrome.storage` 資料取代 Mock [已完成]
- [x] 6.3 整合 `LeftSidebar.tsx`：動態讀取收藏集結構渲染導航列 [已完成]
- [x] 6.4 實作 `RightSidebar` → `MainContent` 拖曳儲存邏輯 (Native Drag & Drop) [已完成]
- [x] 6.5 整合 `SettingsModal.tsx`：實作登入/註冊 UI 接上 Supabase Auth [已完成]
- [x] 6.6 整合 `SettingsModal.tsx`：實作同步開關與手動同步按鈕 [已完成]
- [x] 6.7 整合 `SettingsModal.tsx`：實作 JSON 匯出/匯入 UI [已完成]
- [x] 6.8 整合 `SettingsModal.tsx`：實作重複分頁偵測與一鍵清除 UI [已完成]

### 階段 7：上層分類與組織設定 (Organization & Category)

- [x] 7.1 UI: 最左側分類欄元件 (CategoryBar) [已完成]
- [x] 7.2 UI: 新增分類對話框 (選擇顏色、命名) [已完成]
- [x] 7.3 UI: 分類設定介面 (Settings，類似 Organization Settings) [已完成]
- [x] 7.4 Backend: Category 資料模型定義 (types.ts) [已完成]
- [x] 7.5 Backend: categoryService.ts 建立 (CRUD 操作) [已完成]
- [x] 7.6 Backend: Category、Space、Collection 的關聯邏輯 [已完成]
- [x] 7.7 Backend: Supabase categories 和 spaces 資料表設計 [已完成]
- [x] 7.8 Backend: 分類顏色儲存與讀取 [已完成]
- [x] 7.9 整合: 分類切換時過濾顯示對應的 Spaces 和 Collections [已完成]
- [x] 7.10 整合: 分類設定的編輯、刪除功能 [已完成]
- [x] 7.11 整合: App.tsx 中的 mock categories 改為從 categoryService 讀取 [已完成]
- [x] 7.12 整合: SpaceSettingsModal 與 CategorySettingsModal 功能實作 [已完成]
- [x] 7.13 UI: 三種檢視模式（卡片、精簡、列表） [已完成]
- [x] 7.14 UI: 編輯項目功能（EditItemModal） [已完成]

### 階段 8：測試與發布準備 (Testing & Release)

- [ ] 8.1 本地開發環境整合測試 [待處理]
- [ ] 8.2 Chrome Extension 打包測試 (側載安裝) [待處理]
- [ ] 8.3 跨裝置同步功能驗證 [待處理]
- [ ] 8.4 效能與安全性檢查 [待處理]
- [ ] 8.5 準備 Chrome Web Store 上架素材 [待處理]

---

## 變更日誌

| 日期 | 變更內容 | 狀態 |
|-----|---------|:----:|
| 2026-01-02 | 完成階段 7 所有任務：categoryService、四層架構整合、Supabase schema 更新 | 已完成 |
| 2026-01-02 | 新增三種檢視模式（卡片、精簡、列表）與編輯項目功能 | 已完成 |
| 2026-01-01 | 完成階段 7 UI 部分：CategoryBar、AddCategoryModal、CategorySettingsModal | 已完成 |
| 2026-01-01 | 調整佈局：新增最左側分類欄，Account 移至分類欄底部 | 已完成 |
| 2025-12-31 | 完成階段 6：介面整合與服務層接軌（App, Main, Sidebar, Settings） | 已完成 |
| 2025-12-31 | 新增階段 6、7：介面整合與測試發布任務清單 | 已完成 |
| 2025-12-31 | 透過 MCP 在 Supabase 執行資料表建立 SQL | 已完成 |
| 2025-12-31 | 完成階段 5：雲端同步 (Supabase 資料表設計、Auth 整合、雙向同步) | 已完成 |
| 2025-12-31 | 完成階段 4：進階功能 (JSON 匯出/匯入、重複分頁偵測、Tab Groups 支援) | 已完成 |
| 2025-12-31 | 完成階段 3：Chrome API 整合 (即時分頁查詢、分頁操作、轉存功能) | 已完成 |
| 2025-12-31 | 完成階段 2：資料持久化 (收藏集/書籤 CRUD、設定讀寫、資料初始化) | 已完成 |
| 2025-12-31 | 完成階段 1：服務層基礎建設 (tabService.ts, storageService.ts, types 擴充) | 已完成 |
| 2025-12-31 | 建立 API 準備清單文件 (`user/docs/api-preparation.md`) | 已完成 |
| 2025-12-31 | 將 `backlog.md` 重新命名為 `todolist.md` | 已完成 |
| 2025-12-31 | 初始化 Backlog 文件 | 已完成 |
| 2025-12-31 | 完成階段 1：tabService、storageService、UserSettings 型別擴充 | 已完成 |

