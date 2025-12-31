# 檔案與目錄規範

版本：1.0.0
最後更新：2025-12-31

---

## 根目錄規則

根目錄僅放置治理檔案：

| 允許 | 禁止 |
|-----|------|
| README.md | *.py |
| AGENTS.md | *.js / *.ts |
| LICENSE | *.java |
| .gitignore | 任何程式碼檔案 |
| .env.example | |
| .pre-commit-config.yaml | |
| package.json / requirements.txt | |

---

## 標準目錄結構

### Simple 專案

```
project-root/
├── AGENTS.md
├── README.md
├── .gitignore
├── .env.example
├── .pre-commit-config.yaml
├── user/                  # 私人區域（不進版控）
├── src/                   # 原始碼
├── tests/                 # 測試
├── docs/                  # 文件
└── output/                # 輸出檔案
```

### Standard 專案

```
project-root/
├── AGENTS.md
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── .pre-commit-config.yaml
├── user/                  # 私人區域
├── src/
│   ├── main/
│   │   ├── [language]/    # 程式碼
│   │   └── resources/     # 資源檔
│   └── test/
├── docs/
│   ├── rules/             # 規則文件
│   └── specs/             # 規格文件
├── tools/
├── examples/
└── output/
```

### AI/ML 專案

在 Standard 基礎上增加：

```
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
├── notebooks/
├── models/
│   ├── trained/
│   └── checkpoints/
└── experiments/
```

---

## user/ 目錄規則

### 用途

存放使用者私人資料，不納入版控。

```
user/
├── docs/         # 使用者文件
├── references/   # 參考資料
├── external/     # 外部資源暫存
└── inputs/       # 使用者輸入檔案
```

### 存取規則

| 動作 | 允許 | 條件 |
|-----|:----:|------|
| 讀取 | 有條件 | 需逐次人工明示授權 |
| 寫入 | 否 | 禁止 |
| 自動化處理 | 否 | 禁止 |
| 複製到其他位置 | 否 | 禁止 |
| 納入版控 | 否 | .gitignore 已排除 |

### 例外處理

如需讓工具讀取 `user/` 內檔案：

1. 複製檔案到 `user/external/`
2. 標註到期日期
3. 使用完畢後刪除

---

## output/ 目錄規則

### 用途

存放程式產生的輸出檔案。

### 規則

- 所有產出檔案放這裡，不放根目錄
- 已加入 .gitignore，不進版控
- 定期清理舊檔案

---

## 禁止事項

### 檔案命名

禁止使用以下命名模式：

- `*_v2.py`、`*_v3.py`
- `*_new.js`
- `*_old.ts`
- `*_backup.*`
- `enhanced_*.py`
- `improved_*.js`

正確做法：擴充現有檔案，使用 Git 追蹤版本歷史。

### 重複檔案

禁止建立功能重複的檔案：

- 同一概念只有一個權威實作
- 發現類似功能 → 擴充現有程式碼
- 不複製貼上程式碼區塊 → 提取成共享 utility

### 硬編碼

禁止硬編碼以下內容：

- API endpoints
- 資料庫連線資訊
- 第三方服務憑證
- 環境相關設定

正確做法：使用環境變數，詳見 @docs/rules/env-rules.md
