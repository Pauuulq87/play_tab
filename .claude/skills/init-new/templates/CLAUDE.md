# [PROJECT_NAME]

## 基本資訊

- 類型：[PROJECT_TYPE]
- 語言：[LANGUAGE]
- 狀態：開發中
- 建立日期：[DATE]

---

## 文件索引

專案管理文件位於 `docs/rules/`：

- @docs/rules/CURRENT.md — 當前任務狀態（AI 維護）
- @docs/rules/CONTEXT.md — 專案背景與知識庫（AI 維護）
- @docs/rules/REQUIREMENTS.md — 需求與目的（用戶填寫）
- @docs/rules/ARCHITECTURE.md — 技術架構（AI 維護）
- @docs/rules/RULES.md — 開發規則（模板）
- @docs/rules/CHANGELOG.md — 變更日誌（AI 維護）

---

## 絕對禁止事項

1. **絕不** 在根目錄建立程式檔案 → 使用 `src/` 結構
2. **絕不** 直接將輸出檔案寫入根目錄 → 使用 `output/`
3. **絕不** 建立重複檔案（如 `*_v2.py`、`*_new.js`）→ 擴充現有檔案
4. **絕不** 硬編碼敏感資訊 → 使用環境變數
5. **絕不** 提交含有密碼、API Key 的檔案 → 安全檢查會擋下

---

## 使用者專屬區域

`user/` 目錄為私人區域：

- 未授權不得讀寫
- 不得納入版控
- 不得自動化處理

---

## 外部資源

[Technical PM 根據專案情況填充]

---

## 常用命令

[Technical PM 根據專案情況填充]
