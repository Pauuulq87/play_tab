import { Category } from '@/models/types';
import { getStorage, getCollections, saveCollections } from './storageService';
import { getSpaces, saveSpaces } from './spaceService';

const CATEGORIES_KEY = 'categories';

// ==================== Category CRUD ====================

/**
 * 取得所有分類
 */
export const getCategories = async (): Promise<Category[]> => {
  const storageApi = getStorage();
  const result = await storageApi.local.get(CATEGORIES_KEY);
  return (result[CATEGORIES_KEY] as Category[]) ?? [];
};

/**
 * 儲存所有分類
 */
export const saveCategories = async (categories: Category[]): Promise<void> => {
  const storageApi = getStorage();
  await storageApi.local.set({ [CATEGORIES_KEY]: categories });
};

/**
 * 新增分類
 */
export const createCategory = async (category: Category): Promise<void> => {
  const categories = await getCategories();
  categories.push(category);
  await saveCategories(categories);
};

/**
 * 更新分類
 */
export const updateCategory = async (updatedCategory: Category): Promise<void> => {
  const categories = await getCategories();
  const index = categories.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
    await saveCategories(categories);
  }
};

/**
 * 刪除分類
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  // 1) 刪除分類本身
  const categories = await getCategories();
  const remainingCategories = categories.filter(c => c.id !== categoryId);
  await saveCategories(remainingCategories);

  // 2) 級聯刪除該分類下的 Spaces
  const spaces = await getSpaces();
  const deletedSpaceIds = new Set(spaces.filter(s => s.categoryId === categoryId).map(s => s.id));
  const remainingSpaces = spaces.filter(s => s.categoryId !== categoryId);
  await saveSpaces(remainingSpaces);

  // 3) 級聯刪除屬於被刪除 Spaces 的 Collections
  if (deletedSpaceIds.size > 0) {
    const collections = await getCollections();
    const remainingCollections = collections.filter(c => !deletedSpaceIds.has(c.spaceId));
    await saveCollections(remainingCollections);
  }
};

/**
 * 根據 ID 取得分類
 */
export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  const categories = await getCategories();
  return categories.find(c => c.id === id);
};

/**
 * 更新分類順序
 */
export const reorderCategories = async (categoryIds: string[]): Promise<void> => {
  const categories = await getCategories();
  const reordered = categoryIds.map((id, index) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      return { ...category, order: index };
    }
    return null;
  }).filter(Boolean) as Category[];
  
  await saveCategories(reordered);
};

/**
 * 初始化預設分類 (首次使用時)
 */
export const initializeMockCategories = async (): Promise<void> => {
  const existingCategories = await getCategories();
  if (existingCategories.length > 0) {
    return; // 已有分類，不初始化
  }

  const mockCategories: Category[] = [
    { id: 'cat-reading', name: '閱讀', color: '#3B82F6', order: 0 },
    { id: 'cat-work', name: '工作', color: '#EF4444', order: 1 },
  ];
  
  await saveCategories(mockCategories);
};

/**
 * 清除所有分類
 */
export const clearAllCategories = async (): Promise<void> => {
  await saveCategories([]);
};
