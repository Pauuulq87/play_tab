# Git 與分支規範

版本：1.0.0
最後更新：2025-12-31

---

## Commit 規範（Conventional Commits）

### 類型

| 類型 | 用途 |
|-----|------|
| feat | 新增功能 |
| fix | 修正錯誤 |
| docs | 文件更新 |
| refactor | 重構（不改變功能） |
| perf | 效能優化 |
| test | 測試相關 |
| chore | 雜務（依賴更新等） |
| build | 建置相關 |
| ci | CI/CD 相關 |
| revert | 回退 |

### 訊息格式

- 語言：繁體中文
- 保留英文類型前綴
- 標題具記憶點
- 可加最多 5-6 個分項說明

### 範例

```
feat: 新增會員註冊功能

- 建立註冊表單元件
- 整合 email 驗證流程
- 新增密碼強度檢查
```

```
fix: 修正登入頁面跳轉錯誤

原因：重新導向路徑設定錯誤
```

---

## 分支策略

### 分支結構

```
main ─────────────────────────── 穩定版（可部署/開源）
  │
  └── develop ────────────────── 開發中版本
        │
        ├── feature/xxx ──────── 新功能開發
        │
        └── hotfix/xxx ───────── 緊急修復
```

### 分支說明

| 分支 | 用途 | 合併目標 |
|-----|------|---------|
| `main` | 穩定版本，隨時可部署 | — |
| `develop` | 開發中版本，整合各功能 | main |
| `feature/xxx` | 單一功能開發 | develop |
| `hotfix/xxx` | 緊急修復 | main + develop |

### 命名規則

- feature/功能名稱：`feature/user-registration`
- hotfix/問題描述：`hotfix/login-redirect-error`

### 工作流程

**一般開發：**

```bash
# 1. 從 develop 建立 feature 分支
git checkout develop
git checkout -b feature/xxx

# 2. 開發完成後合併回 develop
git checkout develop
git merge feature/xxx

# 3. develop 穩定後合併到 main
git checkout main
git merge develop
git tag v1.x.0
```

**緊急修復：**

```bash
# 1. 從 main 建立 hotfix 分支
git checkout main
git checkout -b hotfix/xxx

# 2. 修復完成後合併到 main 和 develop
git checkout main
git merge hotfix/xxx
git tag v1.x.1

git checkout develop
git merge hotfix/xxx
```

---

## 推送規則

- 每次 Commit 後推送到遠端
- 指令：`git push origin <branch-name>`
- main 分支推送後確認 CI 通過

---

## Git 使用者設定

```bash
git config --local user.name "Pauuul"
git config --local user.email "paul1q87@gmail.com"
```

---

## 禁止事項

- 禁止使用 `git` 指令的 `-i` flag（不支援互動模式）
- 禁止強制推送 `--force` 到 main 分支
- 禁止提交含敏感資訊的檔案（詳見 @docs/rules/security-rules.md）
