# 開發進度與待辦事項 (Backlog)

版本：1.0.0
最後更新：2025-12-31

---

## 專案現況分析

| 項目 | 狀態 | 備註 |
|-----|:----:|-----|
| 前端三欄式介面 | 已完成 | 基礎佈局與深色模式 |
| 資料模型定義 | 已完成 | types.ts |
| Mock 資料 | 已完成 | constants.tsx |
| Chrome Extension 基礎設定 | 已完成 | manifest.json |
| 服務層 (services/) | 待開發 | 目錄已建立但為空 |
| Chrome Tabs API 整合 | 待開發 | - |
| 資料持久化 (Storage) | 待開發 | - |

---

## 開發任務清單

### 階段 0：準備工作 (Preparation)

- [x] 0.1 建立 API 準備清單與說明文件 [已完成]

### 階段 1：服務層基礎建設 (Core Services)

- [x] 1.1 建立 `tabService.ts`：封裝 Chrome Tabs API [已完成]
- [x] 1.2 建立 `storageService.ts`：封裝 Chrome Storage API [已完成]
- [x] 1.3 建立型別擴充：補充 UserSettings 介面 [已完成]

### 階段 2：資料持久化 (Data Persistence)

- [ ] 2.1 實作收藏集 CRUD 功能 [待處理]
- [ ] 2.2 實作書籤項目 CRUD 功能 [待處理]
- [ ] 2.3 實作使用者設定讀寫邏輯 [待處理]
- [ ] 2.4 實作資料初始化邏輯 (First Install) [待處理]

### 階段 3：Chrome API 整合 (Extension Logic)

- [ ] 3.1 實作即時分頁查詢 (取代 Mock 資料) [待處理]
- [ ] 3.2 實作分頁點擊切換功能 [待處理]
- [ ] 3.3 實作分頁關閉功能 [待處理]
- [ ] 3.4 實作分頁轉存收藏功能 (拖曳/點擊) [待處理]

### 階段 4：進階功能 (Advanced Features)

- [ ] 4.1 實作資料匯出功能 (JSON) [待處理]
- [ ] 4.2 實作資料匯入功能 (JSON) [待處理]
- [ ] 4.3 實作重複分頁偵測功能 [待處理]
- [ ] 4.4 實作 Chrome Tab Groups 支援 [待處理]

### 階段 5：雲端同步 (Future - Supabase)

- [ ] 5.1 設計 Supabase 資料表結構 [待處理]
- [ ] 5.2 整合 Supabase Auth [待處理]
- [ ] 5.3 實作資料雙向同步 [待處理]

---

## 變更日誌

| 日期 | 變更內容 | 狀態 |
|-----|---------|:----:|
| 2025-12-31 | 建立 API 準備清單文件 (`user/docs/api-preparation.md`) | 已完成 |
| 2025-12-31 | 將 `backlog.md` 重新命名為 `todolist.md` | 已完成 |
| 2025-12-31 | 初始化 Backlog 文件 | 已完成 |
| 2025-12-31 | 完成階段 1：tabService、storageService、UserSettings 型別擴充 | 已完成 |

