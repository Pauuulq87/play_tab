---
name: init-new
description: 初始化全新專案（建立完整目錄結構）
keywords:
  - 初始化
  - 新專案
  - 從零開始
  - init new
  - 建立專案
  - 加入管理層
  - init existing
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
---

# Skill：init-new

初始化專案，建立 8 檔案文件系統。**自動判斷模式**：

- **全新模式**：空資料夾或只有需求文件 → 建立完整結構（含 `src/`、`output/`）
- **既有模式**：已有程式碼 → 只加管理層，不改變現有結構

---

## 步驟 1：掃描與判斷模式

### 1-A. 掃描現有檔案

```bash
# 列出所有程式碼檔案（排除 user_pauuul、node_modules、.git）
find . -type f \( -name "*.html" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.css" -o -name "*.vue" -o -name "*.svelte" -o -name "*.go" -o -name "*.rs" -o -name "*.java" \) -not -path "./user_pauuul/*" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./__pycache__/*" 2>/dev/null | head -50

# 讀取 README（如果存在）
cat README.md 2>/dev/null || echo "無 README"

# 讀取 package.json（如果存在）
cat package.json 2>/dev/null || echo "無 package.json"

# 讀取 requirements.txt（如果存在）
cat requirements.txt 2>/dev/null || echo "無 requirements.txt"

# 偵測框架
ls -la next.config.* vue.config.* nuxt.config.* manage.py tsconfig.json 2>/dev/null || echo "無特定框架檔案"

# Git 狀態
git status 2>/dev/null || echo "非 Git 專案"
```

### 1-B. 自動判斷模式

**判斷邏輯：**

| 條件 | 模式 |
|-----|------|
| 程式碼檔案 ≤ 3 個（只有 .md 或空） | **全新模式** |
| 程式碼檔案 > 3 個，或有 package.json/requirements.txt | **既有模式** |

**同時自動判斷（不詢問）：**

| 項目 | 判斷方式 |
|-----|---------|
| 專案名稱 | 資料夾名稱 |
| 專案類型 | Simple / Standard / AI-ML |
| 主要語言 | 依檔案副檔名統計 |
| 框架 | 依特徵檔案（next.config.js → Next.js 等）|

---

## 步驟 2：確認模板位置

```bash
# 檢查模板是否存在（優先順序）
if [ -d "./user_pauuul/templates" ]; then
  TEMPLATE_DIR="./user_pauuul/templates"
elif [ -d "$HOME/.claude/skills/init-new/templates" ]; then
  TEMPLATE_DIR="$HOME/.claude/skills/init-new/templates"
elif [ -d "$HOME/.claude/user_pauuul/templates" ]; then
  TEMPLATE_DIR="$HOME/.claude/user_pauuul/templates"
else
  echo "錯誤：找不到模板資料夾"
  exit 1
fi
```

---

## 步驟 3：生成預覽報告（僅既有模式）

**如果是既有模式，必須先顯示預覽，等待用戶確認：**

```
======================================
專案分析結果
======================================

模式：既有專案（只加管理層）
專案名稱：[NAME]
偵測到的框架：[Next.js / Django / Express / Vue / 無]
主要語言：[TypeScript / Python / JavaScript]
程式碼位置：[偵測到的位置，如 app/、src/、pages/]

======================================
將要執行的操作
======================================

[新增] docs/rules/ 目錄
[新增] CLAUDE.md（專案入口）
[新增] docs/rules/CURRENT.md（任務追蹤）
[新增] docs/rules/CONTEXT.md（專案脈絡）
[新增] docs/rules/REQUIREMENTS.md（需求描述）
[新增] docs/rules/ARCHITECTURE.md（記錄現有架構）
[新增] docs/rules/RULES.md（建議性開發規則）
[新增] docs/rules/CHANGELOG.md（變更日誌）
[新增] user/ 目錄（私人區域）
[新增/修改] .gitignore（追加 user/ 規則）

======================================
不會變更的內容
======================================

- 現有程式碼位置不變
- 現有目錄結構不變
- 現有設定檔不變
- 現有 README.md 不變

確認執行嗎？
```

使用 AskUserQuestion 詢問確認。如果用戶拒絕，終止流程。

**如果是全新模式，跳過此步驟直接執行。**

---

## 步驟 4：詢問 GitHub 設定

**如果已有 .git/ 目錄，跳過此步驟。**

使用 AskUserQuestion 詢問：

```
是否要為此專案設定 GitHub Repository？

選項：
1. Yes-New — 建立新 GitHub repo
2. Yes-Existing — 連接到現有 GitHub repo
3. No — 跳過
```

---

## 步驟 5：建立目錄結構

### 全新模式

```bash
mkdir -p docs/rules
mkdir -p src
mkdir -p user/{docs,references,inputs}
mkdir -p output
touch output/.gitkeep
```

### 既有模式

```bash
# 只建立管理用目錄，不動現有結構
mkdir -p docs/rules
mkdir -p user/{docs,references,inputs}
# 不建立 src/（尊重現有結構）
# 不建立 output/（尊重現有結構）
```

---

## 步驟 6：複製模板文件

```bash
# 根目錄
cp "$TEMPLATE_DIR/CLAUDE.md" ./CLAUDE.md

# docs/rules/
cp "$TEMPLATE_DIR/CURRENT.md" ./docs/rules/CURRENT.md
cp "$TEMPLATE_DIR/CONTEXT.md" ./docs/rules/CONTEXT.md
cp "$TEMPLATE_DIR/REQUIREMENTS.md" ./docs/rules/REQUIREMENTS.md
cp "$TEMPLATE_DIR/ARCHITECTURE.md" ./docs/rules/ARCHITECTURE.md
cp "$TEMPLATE_DIR/RULES.md" ./docs/rules/RULES.md
cp "$TEMPLATE_DIR/CHANGELOG.md" ./docs/rules/CHANGELOG.md
```

---

## 步驟 7：Technical PM 填充內容

以 Technical PM 角色執行：

### 全新模式

1. **CLAUDE.md**：填入專案名稱、類型、語言、文件索引、**強制性規則**
2. **CONTEXT.md**：填入專案背景（從 README 萃取）、技術棧
3. **ARCHITECTURE.md**：填入技術選型、**規定目錄結構**（src/、output/ 等）
4. **CURRENT.md**：設定初始任務為「專案初始化」，狀態「已完成」
5. **README.md**：如果不存在，生成基本版本

### 既有模式

1. **CLAUDE.md**：填入專案名稱、類型、語言、文件索引、**建議性規則**
2. **CONTEXT.md**：從 README 萃取專案背景、填充技術棧（含偵測到的框架）
3. **ARCHITECTURE.md**：**記錄現有目錄結構**（不規定應該怎樣）、記錄程式碼位置
4. **CURRENT.md**：設定初始任務為「專案管理層初始化」，狀態「已完成」
5. **README.md**：**不修改現有 README**

---

## 步驟 8：需求確認

如果用戶有放 README 或需求說明：
- 讀取並整理成 REQUIREMENTS.md 草稿
- 顯示理解的內容請用戶確認
- 確認後更新 REQUIREMENTS.md

如果沒有既有需求：
- 保留空的 REQUIREMENTS.md 模板
- 告知用戶後續可填寫

---

## 步驟 9：Git 處理

### 全新模式（無 .git/）

```bash
git init
git config --local user.name "Pauuul"
git config --local user.email "paul1q87@gmail.com"
git branch -M main

cat > .gitignore << 'EOF'
# User specific
user/
user_pauuul/

# Environment
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
venv/
env/

# JavaScript/Node
node_modules/

# IDEs
.vscode/
.idea/

# OS
.DS_Store

# Output
output/
*.log
EOF

git add .
git commit -m "feat: 初始化專案結構

- 建立 8 檔案文件系統
- Technical PM 已填充初始內容

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 既有模式（有 .git/）

```bash
# 更新 .gitignore（追加 user/ 規則）
if ! grep -q "^user/$" .gitignore 2>/dev/null; then
    echo "" >> .gitignore
    echo "# User specific (added by init-new)" >> .gitignore
    echo "user/" >> .gitignore
fi

git add .
git commit -m "feat: 加入專案管理層

- 新增 docs/rules/ 文件系統
- 新增 user/ 私人區域
- 不影響現有程式碼結構

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 既有模式（無 .git/）

```bash
git init
git config --local user.name "Pauuul"
git config --local user.email "paul1q87@gmail.com"
git branch -M main

cat > .gitignore << 'EOF'
# User specific
user/

# Environment
.env
.env.local
.env.production

# Python
__pycache__/
*.py[cod]
venv/
env/

# JavaScript/Node
node_modules/

# IDEs
.vscode/
.idea/

# OS
.DS_Store
EOF

git add .
git commit -m "feat: 初始化專案管理層

- 建立 docs/rules/ 文件系統
- 建立 user/ 私人區域
- 保留現有程式碼結構

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

根據步驟 4 的選擇處理 GitHub 設定。

---

## 步驟 10：清理模板資料夾

```bash
# 如果專案內有 user_pauuul，清理它
if [ -d "./user_pauuul" ]; then
  rm -rf ./user_pauuul
  echo "模板資料夾已清理"
fi
```

---

## 完成訊息

### 全新模式

```
專案初始化完成！

專案資訊：
- 名稱：[PROJECT_NAME]
- 類型：[PROJECT_TYPE]
- 語言：[LANGUAGE]
- GitHub：[已設定/未設定]

已建立的文件（8 個）：

根目錄：
- CLAUDE.md（專案入口）
- README.md（專案說明）

docs/rules/：
- CURRENT.md（任務追蹤）
- CONTEXT.md（專案脈絡）
- REQUIREMENTS.md（需求描述）← 你負責填寫
- ARCHITECTURE.md（技術架構）
- RULES.md（開發規則）
- CHANGELOG.md（變更日誌）

下一步：
1. 查看 CLAUDE.md 確認專案資訊
2. 填寫 docs/rules/REQUIREMENTS.md 描述你的需求
3. 開始開發！
```

### 既有模式

```
專案管理層初始化完成！

專案資訊：
- 名稱：[PROJECT_NAME]
- 類型：[PROJECT_TYPE]
- 語言：[LANGUAGE]
- 框架：[FRAMEWORK]
- GitHub：[已設定/未設定/既有]

已建立的文件（7 個）：

根目錄：
- CLAUDE.md（專案入口 - 建議版規則）

docs/rules/：
- CURRENT.md（任務追蹤）
- CONTEXT.md（專案脈絡）
- REQUIREMENTS.md（需求描述）← 你負責填寫
- ARCHITECTURE.md（記錄現有架構）
- RULES.md（建議性開發規則）
- CHANGELOG.md（變更日誌）

======================================
現有結構保持不變
======================================

你的程式碼位置：[偵測到的位置]
不需要移動任何檔案。

下一步：
1. 查看 CLAUDE.md 確認專案資訊
2. 填寫 docs/rules/REQUIREMENTS.md 描述你的需求
3. 繼續開發！
```

---

## 8 檔案系統說明

| 檔案 | 位置 | 維護者 |
|-----|------|--------|
| CLAUDE.md | `./` | AI |
| README.md | `./` | AI 生成（全新）/ 不動（既有） |
| CURRENT.md | `./docs/rules/` | AI 自動維護 |
| CONTEXT.md | `./docs/rules/` | AI |
| REQUIREMENTS.md | `./docs/rules/` | **用戶填寫** |
| ARCHITECTURE.md | `./docs/rules/` | AI |
| RULES.md | `./docs/rules/` | 模板直接用 |
| CHANGELOG.md | `./docs/rules/` | AI 自動維護 |

---

## 模式差異對照

| 項目 | 全新模式 | 既有模式 |
|-----|---------|---------|
| 目錄結構 | 建立 `src/`、`output/` | **不動現有結構** |
| 規則強度 | 強制性 | **建議性** |
| README.md | 生成新的 | **不修改** |
| 預覽確認 | 不需要 | **需要用戶確認** |
| ARCHITECTURE.md | 規定結構 | **記錄現有結構** |

---

## Technical PM 持續運作

初始化完成後，Technical PM 角色持續：

| 時機 | 職責 |
|-----|------|
| 用戶描述新需求 | 提問確認 → 更新 REQUIREMENTS.md |
| 任務開始 | 更新 CURRENT.md |
| 任務完成 | 更新 CURRENT.md → CHANGELOG.md → CONTEXT.md |
| 技術決策 | 記錄到 CONTEXT.md |
| 架構變更 | 更新 ARCHITECTURE.md |

**核心原則：用戶只需要口語輸入，所有文件由 AI 維護。**
