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

