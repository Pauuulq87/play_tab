---
name: init-session
description: 初始化多重分身的工作環境。當開始新任務、切換 Clone、重置工作區、或需要同步最新 main 時使用。關鍵字：初始化、開始任務、重置、同步 main。
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
---

# Skill：init-session

初始化 Clone 工作環境。支援兩種模式：

1. **首次建立**：專案還沒有 Clone → 自動建立多個 Clone
2. **任務初始化**：Clone 已存在 → 重置狀態、建立新分支

---

## 執行流程

### 步驟 1：檢查 Clone 環境是否存在

```bash
# 讀取當前專案的 GitHub URL
REPO_URL=$(git remote get-url origin 2>/dev/null)

if [ -z "$REPO_URL" ]; then
  echo "錯誤：當前目錄不是 Git 專案，請先初始化 Git"
  exit 1
fi

echo "專案 URL：$REPO_URL"

# 取得專案名稱（從 URL 萃取）
PROJECT_NAME=$(basename -s .git "$REPO_URL")
echo "專案名稱：$PROJECT_NAME"

# 檢查 Clone 環境目錄
LAB_DIR="$HOME/${PROJECT_NAME}-lab"
echo "Clone 目錄：$LAB_DIR"

# 判斷是否已有 Clone
if [ -d "$LAB_DIR/clone-1" ]; then
  echo "✅ Clone 環境已存在"
  MODE="task"
else
  echo "⚠️ Clone 環境不存在，需要首次建立"
  MODE="setup"
fi
```

---

## 模式 A：首次建立 Clone 環境

### A-1. 詢問 Clone 數量

使用 AskUserQuestion 詢問：

```
要建立幾個 Clone？

選項：
1. 2 個（推薦，適合大多數情況）
2. 3 個（中型專案，更多並行能力）
3. 4 個（大型專案，最大並行能力）
```

### A-2. 建立 Clone 目錄

```bash
CLONE_COUNT=2  # 根據用戶選擇

# 建立 Lab 目錄
mkdir -p "$LAB_DIR"
cd "$LAB_DIR"

# Clone 多份
for ((i=1; i<=CLONE_COUNT; i++)); do
  if [ ! -d "clone-$i" ]; then
    echo "📦 正在建立 clone-$i..."
    git clone "$REPO_URL" "clone-$i"
    echo "   ✅ clone-$i 建立完成"
  else
    echo "   ⏭️ clone-$i 已存在，跳過"
  fi
done
```

### A-3. 建立配置檔

```bash
# 在專案根目錄建立 .claude/clone.conf
CONFIG_DIR=".claude"
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/clone.conf" << EOF
# Cl-one 配置檔
# 自動生成於 $(date +%Y-%m-%d)

REPO_URL="$REPO_URL"
CLONE_COUNT=$CLONE_COUNT
LAB_DIR="$LAB_DIR"
PROJECT_NAME="$PROJECT_NAME"
TEST_COMMAND="npm run build"  # 請根據專案調整
EOF

echo "✅ 配置檔已建立：$CONFIG_DIR/clone.conf"
```

### A-4. 自動開啟 iTerm2 視窗

Clone 建立完成後，自動開啟 iTerm2 視窗：

```bash
# 使用 osascript 開啟 iTerm2 視窗
osascript << EOF
tell application "iTerm2"
    -- 建立新視窗
    create window with default profile

    tell current window
        -- 為每個 Clone 建立分頁
        repeat with i from 1 to $CLONE_COUNT
            if i > 1 then
                create tab with default profile
            end if
            tell current session
                write text "cd '$LAB_DIR/clone-" & i & "' && echo '🟢 Clone-" & i & " Ready - $PROJECT_NAME' && claude"
            end tell
        end repeat

        -- 切回第一個 Tab
        select tab 1
    end tell

    activate
end tell
EOF

echo "✅ 已開啟 iTerm2 視窗，每個 Clone 一個分頁"
```

### A-5. 完成訊息（首次建立）

```
╔══════════════════════════════════════════════════════════════╗
║            ✅ Clone 環境初始化完成！                          ║
╚══════════════════════════════════════════════════════════════╝

📁 Clone 位置：$LAB_DIR
   ├── clone-1/  (已開啟 iTerm2 分頁)
   ├── clone-2/  (已開啟 iTerm2 分頁)
   └── ...

🖥️ iTerm2 視窗已自動開啟，每個 Clone 一個分頁。

📋 下一步：
   1. 切換到對應的 iTerm2 分頁
   2. 在該 Clone 中開始開發
   3. 使用 /check-status 查看所有 Clone 狀態

提示：所有 Clone 都可以並行開發，通過 PR 合併到 main
```

---

## 模式 B：任務初始化（Clone 已存在）

### B-1. 讀取配置

```bash
# 嘗試讀取配置
if [ -f ".claude/clone.conf" ]; then
  source ".claude/clone.conf"
elif [ -f "$HOME/.claude/clone.conf" ]; then
  source "$HOME/.claude/clone.conf"
else
  # 動態生成配置
  REPO_URL=$(git remote get-url origin)
  PROJECT_NAME=$(basename -s .git "$REPO_URL")
  LAB_DIR="$HOME/${PROJECT_NAME}-lab"
  CLONE_COUNT=2
fi
```

### B-2. 檢查 Clone 狀態

```bash
# 列出所有 Clone 的狀態
for ((i=1; i<=CLONE_COUNT; i++)); do
  CLONE_DIR="$LAB_DIR/clone-$i"
  if [ -d "$CLONE_DIR" ]; then
    cd "$CLONE_DIR"
    BRANCH=$(git branch --show-current)
    STATUS=$(git status --porcelain | wc -l | tr -d ' ')
    if [ "$STATUS" -eq 0 ] && [ "$BRANCH" = "main" ]; then
      echo "clone-$i: 🟢 IDLE (main, 乾淨)"
    else
      echo "clone-$i: 🔵 $BRANCH ($STATUS 個變更)"
    fi
  fi
done
```

### B-3. 選擇 Clone 並初始化

由用戶指定或自動選擇第一個 IDLE 的 Clone：

```bash
# 用戶指定的 Clone 編號和分支名稱
CLONE_NUM=1  # 由用戶指定
BRANCH_NAME="feat/new-feature"  # 由用戶指定

CLONE_DIR="$LAB_DIR/clone-$CLONE_NUM"
cd "$CLONE_DIR"

# 重置狀態
git reset --hard
git clean -fd

# 同步 main
git checkout main
git fetch origin main
git reset --hard origin/main

# 建立新分支
git checkout -b "$BRANCH_NAME"

# 確認結果
git status
git log -1 --oneline
echo "✅ clone-$CLONE_NUM 初始化完成，當前分支：$BRANCH_NAME"
```

### B-4. 完成訊息（任務初始化）

```
✅ Clone 初始化完成！

Clone：clone-$CLONE_NUM
位置：$CLONE_DIR
分支：$BRANCH_NAME
基於：[最新 main commit]

現在可以開始開發了。完成後使用 /create-pr 建立 PR。
```

---

## 使用範例

### 首次在專案中使用 Clone 機制

```
用戶：使用 clone-pm 初始化
AI：偵測到這是首次使用，需要建立 Clone 環境...
    → 執行模式 A
```

### 開始新任務

```
用戶：在 clone-1 開始開發登入功能
AI：初始化 clone-1，建立分支 feat/login...
    → 執行模式 B
```

---

## 配置檔說明

配置檔位置：`.claude/clone.conf`

```bash
REPO_URL="https://github.com/user/project.git"  # GitHub URL
CLONE_COUNT=2                                    # Clone 數量
LAB_DIR="$HOME/project-lab"                      # Clone 存放目錄
PROJECT_NAME="project"                           # 專案名稱
TEST_COMMAND="npm run build"                     # 驗證指令
```

---

## 注意事項

1. **首次建立需要網路**：Clone 會從 GitHub 下載
2. **任務初始化會清除變更**：未提交的變更會被刪除
3. **分支命名建議**：
   - `feat/功能名稱` - 新功能
   - `fix/問題描述` - Bug 修復
   - `refactor/範圍` - 重構
