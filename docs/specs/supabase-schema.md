# Supabase 資料庫結構

版本：1.0.0
最後更新：2025-12-31

---

## 概述

本文件定義 Supabase 資料庫的表結構，用於雲端同步功能。

---

## 資料表清單

| 表名稱 | 用途 | 主鍵 |
|-------|------|-----|
| collections | 儲存使用者的收藏集 | id |
| user_settings | 儲存使用者偏好設定 | user_id |

---

## 資料表結構

### collections

儲存使用者的書籤收藏集。

```sql
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_created_at ON collections(created_at);

-- RLS (Row Level Security) 政策
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- 自動更新 updated_at 觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 欄位說明

| 欄位 | 類型 | 說明 |
|-----|------|------|
| id | TEXT | 收藏集 UUID（與本地一致） |
| user_id | UUID | 使用者 ID（外鍵至 auth.users） |
| title | TEXT | 收藏集標題 |
| items | JSONB | 書籤項目陣列（JSON 格式） |
| is_open | BOOLEAN | 是否展開 |
| created_at | TIMESTAMPTZ | 建立時間 |
| updated_at | TIMESTAMPTZ | 更新時間 |

---

### user_settings

儲存使用者的偏好設定。

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 政策
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- 自動更新 updated_at 觸發器
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 欄位說明

| 欄位 | 類型 | 說明 |
|-----|------|------|
| user_id | UUID | 使用者 ID（主鍵，外鍵至 auth.users） |
| settings | JSONB | 使用者設定 JSON 物件 |
| updated_at | TIMESTAMPTZ | 更新時間 |

---

## JSONB 結構範例

### items 欄位（collections 表）

```json
[
  {
    "id": "item-uuid-1",
    "title": "範例書籤",
    "url": "https://example.com",
    "favicon": "https://example.com/favicon.ico"
  },
  {
    "id": "item-uuid-2",
    "title": "另一個書籤",
    "url": "https://another.com"
  }
]
```

### settings 欄位（user_settings 表）

```json
{
  "isDarkMode": true,
  "openCardsOnSameTab": true,
  "autoCloseTab": false,
  "removeDuplicateTabs": false,
  "enableShortcuts": true,
  "enableTabGroups": false
}
```

---

## 安全性

### Row Level Security (RLS)

所有表格都啟用了 RLS，確保：
- 使用者只能存取自己的資料
- 未登入使用者無法存取任何資料
- 政策涵蓋 SELECT、INSERT、UPDATE、DELETE 操作

### 資料驗證

- `user_id` 必須對應至 `auth.users` 中的有效使用者
- 刪除使用者時，關聯資料會自動刪除（CASCADE）

---

## 索引策略

| 表格 | 索引 | 用途 |
|-----|------|------|
| collections | user_id | 快速查詢使用者的收藏集 |
| collections | created_at | 按建立時間排序 |

---

## 遷移步驟

1. 登入 Supabase Dashboard
2. 進入 SQL Editor
3. 依序執行上述 SQL 指令
4. 驗證表格與政策是否正確建立

---

## 同步策略

### 上傳（Local → Cloud）

- 使用 `upsert` 操作，避免衝突
- `onConflict: 'id'` 確保相同 ID 會更新而非插入

### 下載（Cloud → Local）

- 查詢 `user_id = auth.uid()` 確保只取得自己的資料
- 按 `created_at` 排序保持順序

### 即時訂閱

- 使用 Supabase Realtime 監聽變更
- 當資料變更時自動觸發回調更新 UI

---

## 變更記錄

| 日期 | 變更 | 影響 |
|-----|------|-----|
| 2025-12-31 | 初始化資料庫結構設計 | 建立表結構與 RLS 政策 |

