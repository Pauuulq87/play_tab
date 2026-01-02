# Play Tab 假資料結構範例

根據用戶提供的三層分類架構建立的假資料範例。

## 資料模型定義

```typescript
// 第一層：Category（紅色區塊 - 最左側）
interface Category {
  id: string;
  name: string;      // 例：閱讀、工作
  color: string;
  order: number;
}

// 第二層：Space（藍色區塊 - 左側 SPACES）
interface Space {
  id: string;
  name: string;      // 例：故事書、小說、網站
  categoryId: string; // 關聯到 Category
  order: number;
}

// 第三層：Collection（綠色區塊 - 主內容區）
interface Collection {
  id: string;
  title: string;     // 例：天下雜誌、商業周刊
  spaceId: string;   // 關聯到 Space
  items: TabItem[];
  isOpen: boolean;
}

// 第四層：Item（Collection 內的實際頁籤）
interface TabItem {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}
```

## 假資料範例

### 第一層：Categories

```json
[
  {
    "id": "cat-reading",
    "name": "閱讀",
    "color": "#A855F7",
    "order": 0
  },
  {
    "id": "cat-work",
    "name": "工作",
    "color": "#3B82F6",
    "order": 1
  }
]
```

### 第二層：Spaces

```json
[
  // 閱讀 > 故事書
  {
    "id": "space-story",
    "name": "故事書",
    "categoryId": "cat-reading",
    "order": 0
  },
  // 閱讀 > 小說
  {
    "id": "space-novel",
    "name": "小說",
    "categoryId": "cat-reading",
    "order": 1
  },
  // 閱讀 > 工具書
  {
    "id": "space-reference",
    "name": "工具書",
    "categoryId": "cat-reading",
    "order": 2
  },
  // 工作 > 網站
  {
    "id": "space-website",
    "name": "網站",
    "categoryId": "cat-work",
    "order": 0
  },
  // 工作 > 靈感
  {
    "id": "space-inspiration",
    "name": "靈感",
    "categoryId": "cat-work",
    "order": 1
  },
  // 工作 > 參考
  {
    "id": "space-reference-work",
    "name": "參考",
    "categoryId": "cat-work",
    "order": 2
  }
]
```

### 第三層：Collections

```json
[
  // 閱讀 > 故事書 > 天下雜誌
  {
    "id": "col-commonwealth",
    "title": "天下雜誌",
    "spaceId": "space-story",
    "isOpen": true,
    "items": [
      {
        "id": "item-1",
        "title": "2024企業最愛大學生調查",
        "url": "https://www.cw.com.tw/article/1",
        "favicon": "https://www.cw.com.tw/favicon.ico"
      },
      {
        "id": "item-2",
        "title": "AI時代的人才培育",
        "url": "https://www.cw.com.tw/article/2",
        "favicon": "https://www.cw.com.tw/favicon.ico"
      }
    ]
  },
  // 閱讀 > 故事書 > 商業周刊
  {
    "id": "col-business-weekly",
    "title": "商業周刊",
    "spaceId": "space-story",
    "isOpen": true,
    "items": [
      {
        "id": "item-3",
        "title": "台積電2024展望",
        "url": "https://www.businessweekly.com.tw/article/1",
        "favicon": "https://www.businessweekly.com.tw/favicon.ico"
      }
    ]
  },
  // 閱讀 > 故事書 > 網路文章
  {
    "id": "col-web-articles",
    "title": "網路文章",
    "spaceId": "space-story",
    "isOpen": false,
    "items": []
  },
  // 閱讀 > 小說 > 台灣
  {
    "id": "col-novel-taiwan",
    "title": "台灣",
    "spaceId": "space-novel",
    "isOpen": true,
    "items": [
      {
        "id": "item-4",
        "title": "博客來 - 台灣小說專區",
        "url": "https://www.books.com.tw/taiwan-novels",
        "favicon": "https://www.books.com.tw/favicon.ico"
      }
    ]
  },
  // 閱讀 > 小說 > 美國
  {
    "id": "col-novel-usa",
    "title": "美國",
    "spaceId": "space-novel",
    "isOpen": true,
    "items": [
      {
        "id": "item-5",
        "title": "Amazon - Best Sellers in Literature",
        "url": "https://www.amazon.com/best-sellers-books",
        "favicon": "https://www.amazon.com/favicon.ico"
      }
    ]
  },
  // 閱讀 > 工具書 > 財經
  {
    "id": "col-finance",
    "title": "財經",
    "spaceId": "space-reference",
    "isOpen": true,
    "items": [
      {
        "id": "item-6",
        "title": "財經M平方",
        "url": "https://www.macromicro.me/",
        "favicon": "https://www.macromicro.me/favicon.ico"
      }
    ]
  },
  // 閱讀 > 工具書 > AI
  {
    "id": "col-ai",
    "title": "AI",
    "spaceId": "space-reference",
    "isOpen": true,
    "items": [
      {
        "id": "item-7",
        "title": "OpenAI Documentation",
        "url": "https://platform.openai.com/docs",
        "favicon": "https://platform.openai.com/favicon.ico"
      },
      {
        "id": "item-8",
        "title": "Claude Documentation",
        "url": "https://docs.anthropic.com/",
        "favicon": "https://docs.anthropic.com/favicon.ico"
      }
    ]
  },
  // 工作 > 網站 > 購物網站
  {
    "id": "col-shopping",
    "title": "購物網站",
    "spaceId": "space-website",
    "isOpen": true,
    "items": [
      {
        "id": "item-9",
        "title": "Shopify - 電商平台範例",
        "url": "https://www.shopify.com/examples",
        "favicon": "https://www.shopify.com/favicon.ico"
      }
    ]
  },
  // 工作 > 網站 > 形象網站
  {
    "id": "col-corporate",
    "title": "形象網站",
    "spaceId": "space-website",
    "isOpen": true,
    "items": [
      {
        "id": "item-10",
        "title": "Awwwards - 最佳網站設計",
        "url": "https://www.awwwards.com/",
        "favicon": "https://www.awwwards.com/favicon.ico"
      }
    ]
  },
  // 工作 > 網站 > 部落格網站
  {
    "id": "col-blog",
    "title": "部落格網站",
    "spaceId": "space-website",
    "isOpen": true,
    "items": [
      {
        "id": "item-11",
        "title": "Medium - 設計文章",
        "url": "https://medium.com/design",
        "favicon": "https://medium.com/favicon.ico"
      }
    ]
  },
  // 工作 > 靈感 > 文章
  {
    "id": "col-inspiration-articles",
    "title": "文章",
    "spaceId": "space-inspiration",
    "isOpen": true,
    "items": [
      {
        "id": "item-12",
        "title": "Design Inspiration - Dribbble",
        "url": "https://dribbble.com/",
        "favicon": "https://dribbble.com/favicon.ico"
      }
    ]
  },
  // 工作 > 靈感 > LOGO設計
  {
    "id": "col-logo-design",
    "title": "LOGO設計",
    "spaceId": "space-inspiration",
    "isOpen": true,
    "items": [
      {
        "id": "item-13",
        "title": "LogoLounge",
        "url": "https://www.logolounge.com/",
        "favicon": "https://www.logolounge.com/favicon.ico"
      }
    ]
  },
  // 工作 > 參考 > 日本
  {
    "id": "col-ref-japan",
    "title": "日本",
    "spaceId": "space-reference-work",
    "isOpen": true,
    "items": [
      {
        "id": "item-14",
        "title": "日本設計網站精選",
        "url": "https://www.japandesign.ne.jp/",
        "favicon": "https://www.japandesign.ne.jp/favicon.ico"
      }
    ]
  },
  // 工作 > 參考 > 台灣
  {
    "id": "col-ref-taiwan",
    "title": "台灣",
    "spaceId": "space-reference-work",
    "isOpen": true,
    "items": [
      {
        "id": "item-15",
        "title": "台灣設計師週",
        "url": "https://www.designersweek.tw/",
        "favicon": "https://www.designersweek.tw/favicon.ico"
      }
    ]
  }
]
```

## 使用情境範例

### 情境 1：瀏覽「閱讀 > 故事書」

1. 點擊最左側紅色區塊的「閱讀」Category
2. 左側藍色 SPACES 區域顯示：故事書、小說、工具書
3. 點擊「故事書」Space
4. 主內容綠色區域顯示：天下雜誌、商業周刊、網路文章（3個 Collections）
5. 展開「天下雜誌」可看到 2 篇文章（Items）

### 情境 2：瀏覽「工作 > 網站」

1. 點擊最左側紅色區塊的「工作」Category
2. 左側藍色 SPACES 區域顯示：網站、靈感、參考
3. 點擊「網站」Space
4. 主內容綠色區域顯示：購物網站、形象網站、部落格網站（3個 Collections）
5. 每個 Collection 包含相關的網站連結（Items）

## 資料層級關係

```
Category（第一層 - 紅色）
  └── Space（第二層 - 藍色）
        └── Collection（第三層 - 綠色）
              └── Item（第四層 - 實際內容）
```

## UI 互動流程

1. **選擇 Category**：最左側圓形按鈕
2. **LeftSidebar 更新**：
   - 標題顯示「我的收藏 (My Collections) | X collections」
   - SPACES 區域列出該 Category 下的所有 Spaces
3. **選擇 Space**：點擊 SPACES 中的項目
4. **MainContent 更新**：顯示該 Space 下的所有 Collections
5. **展開 Collection**：查看 Items
6. **操作 Item**：開啟、刪除、移動等

## 建議的資料表結構（Supabase）

### categories
- id (uuid, primary key)
- name (text)
- color (text)
- order (integer)
- user_id (uuid, foreign key)
- created_at (timestamp)

### spaces
- id (uuid, primary key)
- name (text)
- category_id (uuid, foreign key)
- order (integer)
- user_id (uuid, foreign key)
- created_at (timestamp)

### collections
- id (uuid, primary key)
- title (text)
- space_id (uuid, foreign key)
- is_open (boolean)
- user_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

### items
- id (uuid, primary key)
- title (text)
- url (text)
- favicon (text, nullable)
- collection_id (uuid, foreign key)
- order (integer)
- user_id (uuid, foreign key)
- created_at (timestamp)

