# 開發規則

## Git 規則

### Commit 格式

```
<type>: <description>

[optional body]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

類型：feat, fix, docs, refactor, test, chore

### 分支策略

- main：穩定版本
- dev：開發中
- feature/*：新功能

---

## 安全規則

- 敏感資訊放 .env，永不進版控
- API Key 使用環境變數
- 不在程式碼中硬編碼密碼

---

## 檔案規則

- 檔名使用 kebab-case
- 元件使用 PascalCase
- 變數使用 camelCase

---

## 環境規則

- 開發環境設定放 .env.local
- 生產環境設定放 .env.production
- 範例設定放 .env.example

---

## Agent 規則

- 執行破壞性操作前必須確認
- 不主動修改 user/ 目錄
- 任務完成後更新 CURRENT.md
- 重要決策記錄到 CONTEXT.md
