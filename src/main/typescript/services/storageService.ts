import { CollectionGroup, UserSettings, TabItem } from '@/models/types';

const ensureChromeStorage = (): typeof chrome.storage => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    throw new Error('chrome.storage is unavailable in this environment');
  }
  return chrome.storage;
};

const COLLECTIONS_KEY = 'collections';
const SETTINGS_KEY = 'settings';
const INITIALIZED_KEY = 'initialized';
const LAST_SELECTED_KEY = 'last_selected'; // 記憶上次選擇的 Category 和 Space

// ==================== 開發環境相容性 (使用 localStorage) ====================

const mockStorage = {
  local: {
    get: async (key: string | string[]) => {
      const keys = Array.isArray(key) ? key : [key];
      const result: any = {};
      keys.forEach(k => {
        const val = localStorage.getItem(k);
        result[k] = val ? JSON.parse(val) : undefined;
      });
      return result;
    },
    set: async (items: any) => {
      Object.entries(items).forEach(([k, v]) => {
        localStorage.setItem(k, JSON.stringify(v));
      });
    },
    clear: async () => {
      localStorage.clear();
    }
  }
};

const getStorage = () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage;
  }
  return mockStorage as any;
};

// ==================== 基礎讀寫 ====================

export const getCollections = async (): Promise<CollectionGroup[]> => {
  const storageApi = getStorage();
  const result = await storageApi.local.get(COLLECTIONS_KEY);
  return (result[COLLECTIONS_KEY] as CollectionGroup[]) ?? [];
};

export const saveCollections = async (collections: CollectionGroup[]): Promise<void> => {
  const storageApi = getStorage();
  await storageApi.local.set({ [COLLECTIONS_KEY]: collections });
};

export const getUserSettings = async (defaults?: UserSettings): Promise<UserSettings | undefined> => {
  const storageApi = getStorage();
  const result = await storageApi.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY] as UserSettings | undefined;
  return stored ?? defaults;
};

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  const storageApi = getStorage();
  await storageApi.local.set({ [SETTINGS_KEY]: settings });
};

// ==================== 收藏集 CRUD ====================

export const createCollection = async (collection: CollectionGroup): Promise<void> => {
  const collections = await getCollections();
  collections.push(collection);
  await saveCollections(collections);
};

export const getCollectionById = async (id: string): Promise<CollectionGroup | undefined> => {
  const collections = await getCollections();
  return collections.find(c => c.id === id);
};

export const updateCollection = async (id: string, updates: Partial<CollectionGroup>): Promise<void> => {
  const collections = await getCollections();
  const index = collections.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error(`Collection with id ${id} not found`);
  }
  
  collections[index] = { ...collections[index], ...updates };
  await saveCollections(collections);
};

export const deleteCollection = async (id: string): Promise<void> => {
  const collections = await getCollections();
  const filtered = collections.filter(c => c.id !== id);
  await saveCollections(filtered);
};

export const clearAllCollections = async (): Promise<void> => {
  await saveCollections([]);
};

// ==================== 書籤項目 CRUD ====================

export const addItemToCollection = async (collectionId: string, item: TabItem): Promise<void> => {
  const collections = await getCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    throw new Error(`Collection with id ${collectionId} not found`);
  }
  
  collection.items.push(item);
  await saveCollections(collections);
};

export const removeItemFromCollection = async (collectionId: string, itemId: string): Promise<void> => {
  const collections = await getCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    throw new Error(`Collection with id ${collectionId} not found`);
  }
  
  collection.items = collection.items.filter(item => item.id !== itemId);
  await saveCollections(collections);
};

export const updateItemInCollection = async (
  collectionId: string,
  itemId: string,
  updates: Partial<TabItem>
): Promise<void> => {
  const collections = await getCollections();
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    throw new Error(`Collection with id ${collectionId} not found`);
  }
  
  const itemIndex = collection.items.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error(`Item with id ${itemId} not found in collection ${collectionId}`);
  }
  
  collection.items[itemIndex] = { ...collection.items[itemIndex], ...updates };
  await saveCollections(collections);
};

// ==================== 資料初始化 ====================

export const isInitialized = async (): Promise<boolean> => {
  const storageApi = getStorage();
  const result = await storageApi.local.get(INITIALIZED_KEY);
  return result[INITIALIZED_KEY] === true;
};

export const initializeData = async (): Promise<void> => {
  const initialized = await isInitialized();
  
  if (initialized) {
    return;
  }
  
  // 預設收藏集（空的起始結構，由使用者自行新增）
  const defaultCollections: CollectionGroup[] = [];
  
  // 預設使用者設定
  const defaultSettings: UserSettings = {
    isDarkMode: true,
    openCardsOnSameTab: true,
    autoCloseTab: false,
    removeDuplicateTabs: false,
    enableShortcuts: true,
    enableTabGroups: false,
  };
  
  await saveCollections(defaultCollections);
  await saveUserSettings(defaultSettings);
  
  const storageApi = getStorage();
  await storageApi.local.set({ [INITIALIZED_KEY]: true });
};

// ==================== 收藏集展開/收合 ====================

export const toggleCollectionOpen = async (id: string): Promise<void> => {
  const collections = await getCollections();
  const index = collections.findIndex(c => c.id === id);
  
  if (index === -1) return;
  
  collections[index].isOpen = !collections[index].isOpen;
  await saveCollections(collections);
};

// ==================== 記憶上次選擇 ====================

export interface LastSelected {
  categoryId: string | null;
  spaceId: string | null;
}

/**
 * 保存用戶最後選擇的 Category 和 Space
 */
export const saveLastSelected = async (lastSelected: LastSelected): Promise<void> => {
  const storageApi = getStorage();
  await storageApi.local.set({ [LAST_SELECTED_KEY]: lastSelected });
};

/**
 * 獲取用戶最後選擇的 Category 和 Space
 */
export const getLastSelected = async (): Promise<LastSelected | null> => {
  const storageApi = getStorage();
  const result = await storageApi.local.get(LAST_SELECTED_KEY);
  return result[LAST_SELECTED_KEY] || null;
};

// ==================== 測試用假資料初始化 ====================

/**
 * 初始化測試用的 Collections 假資料
 */
export const initializeMockCollections = async (): Promise<void> => {
  const existingCollections = await getCollections();
  if (existingCollections.length > 0) {
    return; // 已有資料，不初始化
  }

  const mockCollections: CollectionGroup[] = [
    // 閱讀 > 故事書 > 天下雜誌
    {
      id: 'col-commonwealth',
      title: '天下雜誌',
      spaceId: 'space-story',
      isOpen: true,
      items: [
        {
          id: 'item-1',
          title: '2024企業最愛大學生調查',
          url: 'https://www.cw.com.tw/article/1',
          favicon: 'https://www.cw.com.tw/favicon.ico'
        },
        {
          id: 'item-2',
          title: 'AI時代的人才培育',
          url: 'https://www.cw.com.tw/article/2',
          favicon: 'https://www.cw.com.tw/favicon.ico'
        }
      ]
    },
    // 閱讀 > 故事書 > 商業周刊
    {
      id: 'col-business-weekly',
      title: '商業周刊',
      spaceId: 'space-story',
      isOpen: true,
      items: [
        {
          id: 'item-3',
          title: '台積電2024展望',
          url: 'https://www.businessweekly.com.tw/article/1',
          favicon: 'https://www.businessweekly.com.tw/favicon.ico'
        }
      ]
    },
    // 閱讀 > 故事書 > 網路文章
    {
      id: 'col-web-articles',
      title: '網路文章',
      spaceId: 'space-story',
      isOpen: false,
      items: []
    },
    // 閱讀 > 小說 > 台灣
    {
      id: 'col-novel-taiwan',
      title: '台灣',
      spaceId: 'space-novel',
      isOpen: true,
      items: [
        {
          id: 'item-4',
          title: '博客來 - 台灣小說專區',
          url: 'https://www.books.com.tw/taiwan-novels',
          favicon: 'https://www.books.com.tw/favicon.ico'
        }
      ]
    },
    // 閱讀 > 小說 > 美國
    {
      id: 'col-novel-usa',
      title: '美國',
      spaceId: 'space-novel',
      isOpen: true,
      items: [
        {
          id: 'item-5',
          title: 'Amazon - Best Sellers in Literature',
          url: 'https://www.amazon.com/best-sellers-books',
          favicon: 'https://www.amazon.com/favicon.ico'
        }
      ]
    },
    // 閱讀 > 工具書 > 財經
    {
      id: 'col-finance',
      title: '財經',
      spaceId: 'space-reference',
      isOpen: true,
      items: [
        {
          id: 'item-6',
          title: '財經M平方',
          url: 'https://www.macromicro.me/',
          favicon: 'https://www.macromicro.me/favicon.ico'
        }
      ]
    },
    // 閱讀 > 工具書 > AI
    {
      id: 'col-ai',
      title: 'AI',
      spaceId: 'space-reference',
      isOpen: true,
      items: [
        {
          id: 'item-7',
          title: 'OpenAI Documentation',
          url: 'https://platform.openai.com/docs',
          favicon: 'https://platform.openai.com/favicon.ico'
        },
        {
          id: 'item-8',
          title: 'Claude Documentation',
          url: 'https://docs.anthropic.com/',
          favicon: 'https://docs.anthropic.com/favicon.ico'
        }
      ]
    },
    // 工作 > 網站 > 購物網站
    {
      id: 'col-shopping',
      title: '購物網站',
      spaceId: 'space-website',
      isOpen: true,
      items: [
        {
          id: 'item-9',
          title: 'Shopify - 電商平台範例',
          url: 'https://www.shopify.com/examples',
          favicon: 'https://www.shopify.com/favicon.ico'
        }
      ]
    },
    // 工作 > 網站 > 形象網站
    {
      id: 'col-corporate',
      title: '形象網站',
      spaceId: 'space-website',
      isOpen: true,
      items: [
        {
          id: 'item-10',
          title: 'Awwwards - 最佳網站設計',
          url: 'https://www.awwwards.com/',
          favicon: 'https://www.awwwards.com/favicon.ico'
        }
      ]
    },
    // 工作 > 網站 > 部落格網站
    {
      id: 'col-blog',
      title: '部落格網站',
      spaceId: 'space-website',
      isOpen: true,
      items: [
        {
          id: 'item-11',
          title: 'Medium - 設計文章',
          url: 'https://medium.com/design',
          favicon: 'https://medium.com/favicon.ico'
        }
      ]
    },
    // 工作 > 靈感 > 文章
    {
      id: 'col-inspiration-articles',
      title: '文章',
      spaceId: 'space-inspiration',
      isOpen: true,
      items: [
        {
          id: 'item-12',
          title: 'Design Inspiration - Dribbble',
          url: 'https://dribbble.com/',
          favicon: 'https://dribbble.com/favicon.ico'
        }
      ]
    },
    // 工作 > 靈感 > LOGO設計
    {
      id: 'col-logo-design',
      title: 'LOGO設計',
      spaceId: 'space-inspiration',
      isOpen: true,
      items: [
        {
          id: 'item-13',
          title: 'LogoLounge',
          url: 'https://www.logolounge.com/',
          favicon: 'https://www.logolounge.com/favicon.ico'
        }
      ]
    },
    // 工作 > 參考 > 日本
    {
      id: 'col-ref-japan',
      title: '日本',
      spaceId: 'space-reference-work',
      isOpen: true,
      items: [
        {
          id: 'item-14',
          title: '日本設計網站精選',
          url: 'https://www.japandesign.ne.jp/',
          favicon: 'https://www.japandesign.ne.jp/favicon.ico'
        }
      ]
    },
    // 工作 > 參考 > 台灣
    {
      id: 'col-ref-taiwan',
      title: '台灣',
      spaceId: 'space-reference-work',
      isOpen: true,
      items: [
        {
          id: 'item-15',
          title: '台灣設計師週',
          url: 'https://www.designersweek.tw/',
          favicon: 'https://www.designersweek.tw/favicon.ico'
        }
      ]
    }
  ];

  await saveCollections(mockCollections);
};

