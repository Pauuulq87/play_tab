# CLAUDE.md — play_tab

版本：1.0.0
最後更新：2025-12-31
專案類型：Standard

---

## 文件索引

本專案規範拆分為以下文件，請依需要查閱：

### 規則類

- @docs/rules/git-rules.md — Git 與分支規範
- @docs/rules/security-rules.md — 安全性檢查
- @docs/rules/file-rules.md — 檔案與目錄規範
- @docs/rules/env-rules.md — 環境變數管理

### 規格類（經營者視角）

- @docs/specs/tech-choices.md — 技術選型說明
- @docs/specs/key-flows.md — 關鍵流程
- @docs/specs/system-relations.md — 系統關係
- @docs/specs/decision-flows.md — 決策流程

### 規格類（技術細節，供 AI 查閱）

- @docs/specs/data-model.md — 資料模型概要
- @docs/specs/module-structure.md — 模組結構概要

### 其他

- @docs/todolist.md — 開發進度與待辦事項
- @docs/changelog.md — 變更日誌

---

## 關鍵規則摘要

> 以下為最重要的規則，Claude Code 必須優先遵守。
> 完整內容請查閱對應文件。

### 必須確認規則

在開始任何任務之前，必須回應：
「關鍵規則已確認——我將遵守所有禁令和要求。」

### 絕對禁止事項

1. **絕不** 在根目錄建立程式檔案 → 使用 `src/` 結構
2. **絕不** 直接將輸出檔案寫入根目錄 → 使用 `output/`
3. **絕不** 建立重複檔案（如 `*_v2.py`、`*_new.js`）→ 擴充現有檔案
4. **絕不** 硬編碼敏感資訊 → 使用環境變數
5. **絕不** 提交含有密碼、API Key 的檔案 → 安全檢查會擋下

### 強制要求

1. **COMMIT** — 每個完成的任務後提交
2. **PUSH** — 每次 Commit 後推送：`git push origin main`
3. **READ FIRST** — 編輯前先讀取檔案
4. **SEARCH FIRST** — 建立新檔案前先搜尋現有實作
5. **UPDATE DOCS** — 修改程式前先更新對應文件

### 任務前合規檢查

在開始任務前，驗證以下項目：

- [ ] 確認本文件的關鍵規則
- [ ] 這會在根目錄建立檔案嗎？→ 改用適當結構
- [ ] 是否已存在類似功能？→ 擴充現有程式碼
- [ ] 涉及敏感資訊嗎？→ 使用環境變數

---

## 使用者專屬區域

`user/` 目錄為私人區域：

- 未授權不得讀寫
- 不得納入版控
- 不得自動化處理

詳見 @docs/rules/file-rules.md
