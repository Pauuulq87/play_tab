# 變更日誌 (Changelog)

本檔案記錄專案的所有重要變更。
格式參考 [Keep a Changelog](https://keepachangelog.com/)。

---

## [Unreleased]

### 新增 (Added)

- [待發布的新功能]

### 變更 (Changed)

- [待發布的變更]

### 修正 (Fixed)

- [待發布的修正]

---

## [1.0.0] - 2025-12-31

### 新增 (Added)

- 初始專案結構
- AGENTS.md 治理文件
- 規則文件（git-rules, security-rules, file-rules, env-rules）
- 規格文件模板
- pre-commit 安全檢查

### 變更 (Changed)

- （無）

### 修正 (Fixed)

- （無）

### 移除 (Removed)

- （無）

### 安全性 (Security)

- 設定 gitleaks 防止敏感資訊提交
- 設定依賴漏洞掃描

---

## 版本號規則

採用 [語意化版本](https://semver.org/lang/zh-TW/)：

```
主版本.次版本.修訂版本

主版本：不相容的 API 變更
次版本：向下相容的功能新增
修訂版本：向下相容的問題修正
```

範例：
- `1.0.0` → `1.0.1`：修正 bug
- `1.0.1` → `1.1.0`：新增功能
- `1.1.0` → `2.0.0`：重大架構變更

---

## 變更類型說明

| 類型 | 說明 |
|-----|------|
| Added | 新增功能 |
| Changed | 現有功能變更 |
| Deprecated | 即將移除的功能 |
| Removed | 已移除的功能 |
| Fixed | 錯誤修正 |
| Security | 安全性修補 |
