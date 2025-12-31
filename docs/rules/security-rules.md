# 安全性檢查規範

版本：1.0.0
最後更新：2025-12-31

---

## 概述

本專案使用 pre-commit hook 自動檢查安全性問題。
每次 `git commit` 前會自動執行，未通過檢查則無法提交。

---

## 檢查項目

| 檢查項目 | 工具 | 說明 |
|---------|------|------|
| 敏感資訊洩漏 | gitleaks | 偵測密碼、API Key、Token |
| 依賴套件漏洞 | safety (Python) / npm audit (JS) | 已知安全漏洞掃描 |
| 程式碼安全 | bandit (Python) / eslint-security (JS) | SQL injection、XSS 等 |
| 大型檔案 | pre-commit 內建 | 防止提交過大檔案 |
| 合併衝突標記 | pre-commit 內建 | 確保無殘留衝突標記 |

---

## pre-commit 設定

設定檔位於專案根目錄：`.pre-commit-config.yaml`

### 安裝方式

```bash
# 安裝 pre-commit
pip install pre-commit --break-system-packages

# 或使用 brew
brew install pre-commit

# 啟用 hooks
cd [project-root]
pre-commit install
```

### 手動執行檢查

```bash
# 檢查所有檔案
pre-commit run --all-files

# 檢查特定檔案
pre-commit run --files path/to/file.py
```

---

## 敏感資訊處理規則

### 絕對禁止提交

- API Keys
- 密碼 / Passwords
- Access Tokens
- Private Keys（.pem, .key）
- 資料庫連線字串
- AWS / GCP / Azure 憑證

### 正確做法

1. 敏感資訊放入環境變數
2. 使用 `.env` 檔案（已加入 .gitignore）
3. 提供 `.env.example` 作為範本

詳見 @docs/rules/env-rules.md

---

## 檢查失敗處理

### gitleaks 偵測到敏感資訊

```
[gitleaks] Detected hardcoded secret
```

處理方式：
1. 移除敏感資訊，改用環境變數
2. 如果是誤判，可加入 `.gitleaksignore`

### 依賴漏洞警告

```
[safety] Vulnerability found in package xxx
```

處理方式：
1. 升級有漏洞的套件
2. 如果無法升級，評估風險並記錄於 `docs/changelog.md`

---

## 繞過檢查（緊急情況）

> 僅限緊急情況，且必須事後補正

```bash
git commit --no-verify -m "緊急修復：[說明原因]"
```

使用後必須：
1. 在下次 commit 補上安全檢查
2. 記錄於 `docs/changelog.md`

---

## 定期維護

| 週期 | 動作 |
|-----|------|
| 每週 | 執行 `pre-commit run --all-files` |
| 每月 | 更新 pre-commit hooks：`pre-commit autoupdate` |
| 每季 | 檢視 `.gitleaksignore` 是否有過時規則 |
