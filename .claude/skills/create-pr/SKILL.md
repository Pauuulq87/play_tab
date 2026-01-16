---
name: create-pr
description: 將 Clone 的變更推送到 GitHub 並建立 Pull Request。任務完成後使用此 Skill 發起 PR。關鍵字：建立 PR、推送、提交、pull request、射後不理。
allowed-tools: Bash(git:*, gh:*)
---

# 建立 Pull Request (Create PR)

將本地變更推送到遠端，並使用 GitHub CLI 建立 Pull Request。

## 使用時機

- 開發任務完成後
- 需要提交變更供審核
- 準備合併到 main 分支

## 參數

由用戶在對話中指定：
- **clone_path**: 目標 Clone 資料夾路徑
- **commit_msg**: 提交訊息（遵循 Conventional Commits）
- **pr_title**: PR 標題
- **pr_body**: PR 內容描述（選填）

## 執行步驟

### 步驟 1：切換到目標 Clone 並確認狀態

```bash
cd {clone_path}
git status
git branch --show-current
```

確認：
- 有變更需要提交
- 在功能分支上（非 main）

### 步驟 2：提交變更

```bash
git add .
git diff --cached --stat  # 確認即將提交的內容
git commit -m "{commit_msg}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 步驟 3：推送到遠端

```bash
current_branch=$(git branch --show-current)
git push origin $current_branch
```

如果是新分支第一次推送：
```bash
git push -u origin $current_branch
```

### 步驟 4：建立 Pull Request

```bash
gh pr create --title "{pr_title}" --body "$(cat <<'EOF'
## Summary
{pr_body}

## Changes
- [列出主要變更]

## Test Plan
- [ ] 已執行驗證指令

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" --base main
```

### 步驟 5：確認結果

```bash
gh pr view --web  # 可選：在瀏覽器中開啟 PR
gh pr list
```

## 輸出範例

```
✅ Pull Request 已建立

分支：feat/login-page
提交：abc1234 feat: 完成登入頁面

PR 連結：https://github.com/your-username/your-repo/pull/42

標題：feat: 完成登入頁面
狀態：Open (等待審核)

下一步：
- 在 GitHub 上審核並合併
- 或通知其他 Clone 可以開始新任務
```

## Commit Message 規範

遵循 Conventional Commits：

```
<type>: <description>

[optional body]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**類型 (type)**：
- `feat`: 新功能
- `fix`: Bug 修復
- `docs`: 文件更新
- `refactor`: 重構
- `test`: 測試
- `chore`: 雜項

**範例**：
```
feat: 新增登入頁面

- 實作 LoginForm 元件
- 新增表單驗證邏輯
- 整合 API 端點

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

## 錯誤處理

### Push 被拒絕（遠端有更新）

```bash
git fetch origin main
git merge origin/main
# 解決衝突後
git push origin $current_branch
```

### GitHub CLI 未登入

```bash
gh auth status
# 如未登入
gh auth login
```

### PR 已存在

```bash
gh pr list
# 確認是否有相同分支的 PR
gh pr view {branch_name}
```

## 射後不理 (Fire and Forget)

PR 建立後，此 Clone 的任務即視為**完成**。

- 不需要等待 PR 合併
- Clone 可以重新初始化執行新任務
- 合併由人類在 GitHub 網頁上審核

## 後續步驟

1. **人類審核**：在 GitHub 上審核 PR
2. **合併**：審核通過後按下 "Squash and Merge"
3. **同步**：其他 Clone 使用 `sync-upstream` 同步最新 main
