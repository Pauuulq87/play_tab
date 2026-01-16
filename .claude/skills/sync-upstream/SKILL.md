---
name: sync-upstream
description: 當 Remote main 更新後，同步變更到當前分支。處理分支過時、合併衝突的情況。關鍵字：同步、衝突、更新、merge、rebase、分支過時。
allowed-tools: Bash(git:*), Read, Edit
---

# 同步上游變更 (Sync Upstream)

當遠端 main 已更新，將最新的變更拉回當前分支以解決衝突或保持同步。

## 使用時機

- Clone 1 的 PR 已合併，Clone 2 需要同步
- GitHub 顯示 "This branch is out-of-date"
- 推送 PR 時被告知有衝突
- 主動保持分支與 main 同步

## 參數

由用戶在對話中指定：
- **clone_path**: 目標 Clone 資料夾路徑

## 執行步驟

### 步驟 1：切換到目標 Clone 並檢查狀態

```bash
cd {clone_path}
git status
git branch --show-current
```

確認當前沒有未提交的變更。如果有，先提交或暫存：
```bash
git stash  # 暫存未提交的變更
```

### 步驟 2：抓取遠端最新狀態

```bash
git fetch origin main
```

### 步驟 3：檢查與遠端的差異

```bash
git log HEAD..origin/main --oneline  # 檢視遠端比本地多了什麼
git log origin/main..HEAD --oneline  # 檢視本地比遠端多了什麼
```

### 步驟 4：嘗試合併遠端 main

```bash
git merge origin/main --no-edit
```

**兩種可能的結果**：

#### 結果 A：合併成功（無衝突）

```
✅ Sync successful
Already up to date.
# 或
Merge made by the 'ort' strategy.
```

直接進入步驟 6。

#### 結果 B：有衝突 (CONFLICT)

```
Auto-merging src/App.tsx
CONFLICT (content): Merge conflict in src/App.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

進入步驟 5。

### 步驟 5：解決衝突（如有）

#### 5.1 列出衝突檔案

```bash
git diff --name-only --diff-filter=U
```

#### 5.2 讀取並理解衝突

```bash
# 使用 Read 工具讀取衝突檔案
# 尋找 <<<<<<< HEAD 和 >>>>>>> origin/main 標記
```

衝突標記格式：
```
<<<<<<< HEAD
你的本地變更
=======
遠端的變更
>>>>>>> origin/main
```

#### 5.3 修復衝突

使用 Edit 工具：
- 保留需要的程式碼
- 刪除衝突標記
- 確保邏輯正確

#### 5.4 標記衝突已解決

```bash
git add {衝突的檔案}
git commit -m "merge: 合併 origin/main 並解決衝突"
```

### 步驟 6：驗證結果

```bash
git status
git log --oneline -5
{test_command}  # 確保合併後仍可建置
```

### 步驟 7：推送更新（如已有遠端分支）

```bash
git push origin $(git branch --show-current)
```

## 輸出範例

### 無衝突情況

```
✅ 同步完成（無衝突）

分支：feat/new-feature
合併了 3 個來自 origin/main 的 commit
建置驗證：✅ 通過
```

### 有衝突情況

```
⚠️ 發現衝突，已自動解決

衝突檔案：
- src/App.tsx（已解決）
- src/types.ts（已解決）

解決方式：
- 保留雙方的新增功能
- 合併重複的 import

建置驗證：✅ 通過
```

## 衝突解決策略

### 1. 加法優先

如果雙方都在新增內容（不同位置），通常可以保留兩者：

```typescript
// 保留 HEAD 的新增
const featureA = () => {...}

// 也保留 origin/main 的新增
const featureB = () => {...}
```

### 2. 相同位置的修改

需要理解兩邊的意圖，選擇正確的版本或合併邏輯。

### 3. 刪除 vs 修改

- 如果一方刪除、一方修改，優先保留修改（除非刪除是有意的重構）

## 替代方案：Rebase

如果偏好線性歷史，可以使用 rebase 替代 merge：

```bash
git fetch origin main
git rebase origin/main

# 如有衝突，解決後
git rebase --continue

# 完成後需要 force push
git push origin $(git branch --show-current) --force-with-lease
```

> **注意**：rebase 會改寫歷史，需要 force push。在共享分支上請謹慎使用。

## 後續步驟

同步完成後：
- 如果 PR 尚未建立，繼續開發或使用 `create-pr`
- 如果 PR 已存在，push 後 GitHub 會自動更新 PR 狀態
