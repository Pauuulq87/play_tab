---
name: check-status
description: 檢查 Clone 的 Git 狀態、PR 狀態、與遠端的同步狀態。用於 Clone PM 決策調度、或快速了解分身狀態。關鍵字：檢查狀態、git status、PR 狀態、同步狀態、分身狀態。
allowed-tools: Bash(git:*, gh:*, cd, pwd, ls)
---

# 檢查狀態 (Check Status)

檢查指定 Clone 的完整狀態，包括 Git 狀態、PR 狀態、與遠端的同步狀態。

## 使用時機

- 想知道某個 Clone 的當前狀態
- Clone PM 需要決定任務分配
- 確認 PR 是否已合併
- 檢查是否需要同步

## 參數

由用戶在對話中指定：
- **clone_path**: 目標 Clone 資料夾路徑（可選，預設檢查當前目錄）

## 執行步驟

### 步驟 1：基本資訊

```bash
cd {clone_path}
echo "=== 基本資訊 ==="
echo "路徑：$(pwd)"
echo "分支：$(git branch --show-current)"
echo "最新 commit：$(git log -1 --oneline)"
```

### 步驟 2：工作區狀態

```bash
echo ""
echo "=== 工作區狀態 ==="
git status --short
```

**狀態碼說明**：
- ` M` - 已修改（未暫存）
- `M ` - 已修改（已暫存）
- `A ` - 新增（已暫存）
- `??` - 未追蹤
- `D ` - 已刪除

### 步驟 3：與遠端同步狀態

```bash
echo ""
echo "=== 遠端同步狀態 ==="
git fetch origin main --quiet

# 本地領先遠端多少
ahead=$(git rev-list origin/main..HEAD --count)
echo "本地領先 origin/main：$ahead 個 commit"

# 本地落後遠端多少
behind=$(git rev-list HEAD..origin/main --count)
echo "本地落後 origin/main：$behind 個 commit"
```

### 步驟 4：PR 狀態

```bash
echo ""
echo "=== Pull Request 狀態 ==="
current_branch=$(git branch --show-current)

if [ "$current_branch" = "main" ]; then
    echo "當前在 main 分支，無 PR"
else
    gh pr view $current_branch --json state,title,url,mergeable 2>/dev/null || echo "此分支尚無 PR"
fi
```

### 步驟 5：所有開放的 PR

```bash
echo ""
echo "=== 所有開放的 PR ==="
gh pr list --state open --json number,title,headRefName --jq '.[] | "#\(.number) [\(.headRefName)] \(.title)"'
```

## 輸出範例

### Clone 閒置中

```
=== Clone 狀態報告 ===

📍 基本資訊
   路徑：{clone_path}
   分支：main
   最新 commit：abc1234 feat: 最新功能

📂 工作區狀態
   ✅ 乾淨（無未提交變更）

🔄 遠端同步狀態
   ✅ 與 origin/main 同步

📋 Pull Request 狀態
   當前在 main 分支，無 PR

🏷️ 狀態：IDLE（可接受新任務）
```

### Clone 開發中

```
=== Clone 狀態報告 ===

📍 基本資訊
   路徑：{clone_path}
   分支：feat/login-page
   最新 commit：def5678 feat: 新增登入表單

📂 工作區狀態
   M  src/components/LoginForm.tsx
   ?? src/hooks/useAuth.ts

🔄 遠端同步狀態
   本地領先 origin/main：3 個 commit
   本地落後 origin/main：0 個 commit

📋 Pull Request 狀態
   尚無 PR

🏷️ 狀態：WORKING（開發中）
```

## 狀態判斷邏輯

| 條件 | 狀態 |
|------|------|
| 在 main 分支 + 乾淨 + 同步 | IDLE |
| 在功能分支 + 有變更 | WORKING |
| 在功能分支 + 乾淨 + 無 PR | READY_FOR_PR |
| 在功能分支 + 有 PR + OPEN | PR_PENDING |
| 在功能分支 + 落後 main | NEEDS_SYNC |

## 後續操作建議

根據狀態提供建議：

| 狀態 | 建議操作 |
|------|---------|
| IDLE | 可用 `init-session` 開始新任務 |
| WORKING | 繼續開發或用 `create-pr` 提交 |
| READY_FOR_PR | 使用 `create-pr` 建立 PR |
| PR_PENDING | 等待審核或處理衝突 |
| NEEDS_SYNC | 使用 `sync-upstream` 同步 |
