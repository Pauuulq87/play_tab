import { Space } from '@/models/types';

const STORAGE_KEYS = {
  SPACES: 'play_tab_spaces'
};

// Mock storage 用於開發環境
const mockStorage = {
  local: {
    get: (keys: string | string[]) => {
      const keysArray = Array.isArray(keys) ? keys : [keys];
      const result: Record<string, any> = {};
      keysArray.forEach(key => {
        const value = localStorage.getItem(key);
        result[key] = value ? JSON.parse(value) : undefined;
      });
      return Promise.resolve(result);
    },
    set: (items: Record<string, any>) => {
      Object.entries(items).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      return Promise.resolve();
    }
  }
};

function getStorage() {
  return typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : mockStorage;
}

/**
 * 獲取所有 Spaces
 */
export async function getSpaces(): Promise<Space[]> {
  try {
    const result = await getStorage().local.get(STORAGE_KEYS.SPACES);
    return result[STORAGE_KEYS.SPACES] || [];
  } catch (error) {
    console.error('Failed to get spaces:', error);
    return [];
  }
}

/**
 * 儲存 Spaces
 */
export async function saveSpaces(spaces: Space[]): Promise<void> {
  try {
    await getStorage().local.set({ [STORAGE_KEYS.SPACES]: spaces });
  } catch (error) {
    console.error('Failed to save spaces:', error);
    throw error;
  }
}

/**
 * 新增 Space
 */
export async function createSpace(space: Space): Promise<void> {
  try {
    const spaces = await getSpaces();
    spaces.push(space);
    await saveSpaces(spaces);
  } catch (error) {
    console.error('Failed to create space:', error);
    throw error;
  }
}

/**
 * 更新 Space
 */
export async function updateSpace(spaceId: string, updates: Partial<Space>): Promise<void> {
  try {
    const spaces = await getSpaces();
    const index = spaces.findIndex(s => s.id === spaceId);
    if (index !== -1) {
      spaces[index] = { ...spaces[index], ...updates };
      await saveSpaces(spaces);
    }
  } catch (error) {
    console.error('Failed to update space:', error);
    throw error;
  }
}

/**
 * 刪除 Space
 */
export async function deleteSpace(spaceId: string): Promise<void> {
  try {
    const spaces = await getSpaces();
    const filtered = spaces.filter(s => s.id !== spaceId);
    await saveSpaces(filtered);
  } catch (error) {
    console.error('Failed to delete space:', error);
    throw error;
  }
}

/**
 * 根據 Category ID 獲取 Spaces
 */
export async function getSpacesByCategory(categoryId: string): Promise<Space[]> {
  try {
    const spaces = await getSpaces();
    return spaces.filter(s => s.categoryId === categoryId).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to get spaces by category:', error);
    return [];
  }
}

/**
 * 初始化假資料（用於開發測試）
 */
export async function initializeMockSpaces(): Promise<void> {
  const existingSpaces = await getSpaces();
  if (existingSpaces.length > 0) {
    return; // 已有資料，不初始化
  }

  const mockSpaces: Space[] = [
    // 閱讀分類下的 Spaces
    { id: 'space-story', name: '故事書', categoryId: 'cat-reading', order: 0 },
    { id: 'space-novel', name: '小說', categoryId: 'cat-reading', order: 1 },
    { id: 'space-reference', name: '工具書', categoryId: 'cat-reading', order: 2 },
    // 工作分類下的 Spaces
    { id: 'space-website', name: '網站', categoryId: 'cat-work', order: 0 },
    { id: 'space-inspiration', name: '靈感', categoryId: 'cat-work', order: 1 },
    { id: 'space-reference-work', name: '參考', categoryId: 'cat-work', order: 2 }
  ];

  await saveSpaces(mockSpaces);
}

