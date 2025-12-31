# 資料模型概要

版本：1.0.0
最後更新：2025-12-31

---

## 概述

本文件描述瀏覽器分頁管理插件的資料結構，供 AI 代理查閱。
保持簡潔，降低 token 成本。

---

## 資料表/集合清單

| 名稱 | 用途 | 主鍵 |
|-----|------|-----|
| TabItem | 單一分頁或書籤項目 | id |
| CollectionGroup | 收藏集合（分類） | id |
| SidebarItem | 側邊欄導航項目 | id |
| UserSettings | 使用者偏好設定 | - |

---

## 資料結構

### TabItem

```
欄位名稱        類型        必填    說明
--------------------------------------------
id             string      是      主鍵（UUID）
title          string      是      分頁/書籤標題
url            string      否      網址
favicon        string      否      網站圖示 URL
```

### CollectionGroup

```
欄位名稱        類型        必填    說明
--------------------------------------------
id             string      是      主鍵（UUID）
title          string      是      收藏集名稱
items          TabItem[]   是      收藏項目陣列
isOpen         boolean     是      是否展開
```

### SidebarItem

```
欄位名稱        類型        必填    說明
--------------------------------------------
id             string      是      主鍵
label          string      是      顯示名稱
icon           ReactNode   否      圖示元件
isSpace        boolean     否      是否為 Space 類型
```

### UserSettings

```
欄位名稱                    類型        必填    說明
----------------------------------------------------
isDarkMode                 boolean     是      深色模式開關
openCardsOnSameTab         boolean     是      同分頁開啟卡片
autoCloseTab               boolean     是      自動關閉分頁
removeDuplicateTabs        boolean     是      移除重複分頁
enableShortcuts            boolean     是      啟用快捷鍵
enableTabGroups            boolean     是      啟用分頁群組
```

---

## 關聯

```
CollectionGroup 1 --- N TabItem    # 一個收藏集有多個項目
SidebarItem（獨立，無外部關聯）
UserSettings（獨立，單例）
```

---

## 儲存方式

### 開發階段

- 使用 React State + Mock Data
- 資料重載後重置

### 正式版本

- 使用 `chrome.storage.local` 儲存
- 配額：5MB（足夠儲存數千筆書籤）

### 未來擴充

- 使用 `chrome.storage.sync` 跨裝置同步
- 配額限制：100KB（需壓縮或分頁）
- 或整合 Supabase 實現雲端同步

---

## 索引

| 儲存位置 | 索引欄位 | 用途 |
|---------|---------|------|
| collections | id | 快速查找收藏集 |
| tabs (Chrome API) | id | 分頁操作 |

---

## 列舉值

### 暫無列舉

目前資料模型簡單，尚無需列舉值定義。

---

## 變更記錄

| 日期 | 變更 | 影響 |
|-----|------|-----|
| 2025-12-31 | 初始化資料模型 | 建立核心資料結構 |
