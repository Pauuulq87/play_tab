---
name: execute-task
description: 在指定 Clone 中執行開發任務。包含編碼、測試、驗證的完整流程。當需要在分身中寫程式、修 bug、或實作功能時使用。關鍵字：執行任務、開發、編碼、實作功能。
allowed-tools: Bash(*), Read, Write, Edit, Glob, Grep
---

# 執行任務 (Execute Task)

在指定 Clone 中執行開發任務，包含編碼、測試驗證的完整流程。

## 使用時機

- 在指定 Clone 中開發新功能
- 修復 Bug
- 重構程式碼
- 任何需要修改程式碼的任務

## 參數

由用戶在對話中指定：
- **clone_path**: 目標 Clone 資料夾路徑
- **instruction**: 具體的開發需求描述
- **test_command**: 驗證任務是否成功的指令（可在 clone.conf 中設定 TEST_COMMAND）

## 執行步驟

### 步驟 1：切換到目標 Clone

```bash
cd {clone_path}
pwd
git status
git branch --show-current
```

確認：
- 工作目錄正確
- 在正確的功能分支上（非 main）
- 無未預期的暫存變更

### 步驟 2：執行開發任務

根據 `{instruction}` 的內容，使用適當的工具：

- **Read**：閱讀需要修改的檔案
- **Edit**：修改現有程式碼
- **Write**：建立新檔案
- **Glob/Grep**：搜尋相關程式碼

### 步驟 3：驗證變更

執行測試/建置指令：

```bash
cd {clone_path}
{test_command}  # 預設 npm run build，可在 clone.conf 中自訂
```

**判斷結果**：
- ✅ 成功：回傳 "Ready for PR"
- ❌ 失敗：分析錯誤並修正，重複直到通過

### 步驟 4：確認變更摘要

```bash
git status
git diff --stat
```

回報：
- 修改了哪些檔案
- 新增了哪些檔案
- 刪除了哪些檔案

## 輸出範例

```
✅ 任務執行完成

變更摘要：
- 修改：src/components/LoginForm.tsx (+45, -12)
- 新增：src/hooks/useAuth.ts (+78)
- 修改：src/types.ts (+5, -0)

建置驗證：{test_command} ✅ 通過

狀態：Ready for PR
```

## 最佳實踐

### 1. 小步提交

如果任務較大，建議分成多個小的變更：
```bash
git add src/types.ts
git commit -m "feat: 定義 Auth 型別"

git add src/hooks/useAuth.ts
git commit -m "feat: 實作 useAuth hook"
```

### 2. 遵循專案規範

- 遵循現有的程式碼風格
- 不要過度工程化

### 3. 驗證優先

在每次重大修改後都執行驗證：
```bash
{test_command}
```

## 錯誤處理

### Build 失敗

1. 閱讀錯誤訊息
2. 定位問題檔案和行數
3. 修正問題
4. 重新執行 build

### TypeScript 型別錯誤

1. 檢查型別定義
2. 確認 import 路徑正確
3. 必要時更新型別定義

## 後續步驟

任務完成後，使用 `create-pr` Skill 建立 Pull Request。
