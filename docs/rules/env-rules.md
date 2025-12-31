# 環境變數管理規範

版本：1.0.0
最後更新：2025-12-31

---

## 檔案結構

| 檔案 | 用途 | 進版控 |
|-----|------|:------:|
| `.env` | 實際環境變數（含敏感資訊） | 否 |
| `.env.example` | 範本（不含實際值） | 是 |
| `.env.local` | 本地開發覆寫 | 否 |
| `.env.production` | 正式環境設定 | 否 |

---

## .env.example 規範

### 格式

```bash
# ===================
# 應用程式設定
# ===================
APP_NAME=
APP_ENV=development
APP_DEBUG=false

# ===================
# 資料庫設定
# ===================
DATABASE_URL=
DATABASE_NAME=

# ===================
# 第三方服務
# ===================
# OpenAI
OPENAI_API_KEY=

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=

# ===================
# 其他
# ===================
LOG_LEVEL=info
```

### 規則

1. 使用註解分區
2. 敏感欄位留空
3. 非敏感欄位可給預設值
4. 說明每個變數的用途

---

## 命名規範

### 格式

```
[類別]_[子類別]_[名稱]
```

### 範例

| 變數名稱 | 說明 |
|---------|------|
| `DATABASE_URL` | 資料庫連線字串 |
| `DATABASE_HOST` | 資料庫主機 |
| `OPENAI_API_KEY` | OpenAI API 金鑰 |
| `OPENAI_MODEL` | OpenAI 模型名稱 |
| `APP_ENV` | 執行環境 |
| `APP_DEBUG` | 除錯模式 |

### 禁止

- 小寫：`database_url`
- 無底線分隔：`DATABASEURL`
- 縮寫不明確：`DB_U`

---

## 敏感等級分類

| 等級 | 說明 | 範例 | 處理方式 |
|:---:|------|------|---------|
| 高 | 外洩會造成直接損失 | API Key、密碼、Token | 絕不進版控，定期輪換 |
| 中 | 外洩會造成間接風險 | 資料庫名稱、內部 URL | 不進版控 |
| 低 | 外洩無重大影響 | APP_ENV、LOG_LEVEL | 可放 .env.example |

---

## 使用方式

### Python

```python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
debug = os.getenv("APP_DEBUG", "false").lower() == "true"
```

### JavaScript / TypeScript

```javascript
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const debug = process.env.APP_DEBUG === 'true';
```

### 安裝 dotenv

```bash
# Python
pip install python-dotenv

# Node.js
npm install dotenv
```

---

## 新增環境變數流程

1. 在程式碼中使用 `os.getenv()` 或 `process.env`
2. 在 `.env` 加入實際值
3. 在 `.env.example` 加入空值或預設值
4. 在本文件更新變數清單
5. Commit `.env.example`（不 commit `.env`）

---

## 檢查清單

新增環境變數時確認：

- [ ] 變數名稱符合命名規範
- [ ] 已加入 `.env.example`
- [ ] 敏感資訊未進版控
- [ ] 程式碼有處理變數不存在的情況
- [ ] 已更新本文件（如需要）
