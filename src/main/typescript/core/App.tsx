import React, { useState, useEffect } from 'react';
import CategoryBar from '../components/layout/CategoryBar';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import SettingsModal from '../components/ui/SettingsModal';
import AddCategoryModal from '../components/ui/AddCategoryModal';
import CategorySettingsModal from '../components/ui/CategorySettingsModal';
import SpaceSettingsModal from '../components/ui/SpaceSettingsModal';
import { CollectionGroup, UserSettings, Category, Space } from '@/models/types';
import { getCollections, getUserSettings, initializeData, saveUserSettings, initializeMockCollections, saveLastSelected, getLastSelected } from '@/services/storageService';
import { getSpaces, initializeMockSpaces, updateSpace, deleteSpace } from '@/services/spaceService';
import { getCategories, initializeMockCategories, createCategory, updateCategory, deleteCategory } from '@/services/categoryService';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategorySettingsOpen, setIsCategorySettingsOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isSpaceSettingsOpen, setIsSpaceSettingsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  
  // 四層架構：Category -> Space -> Collection -> Item
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await initializeData(); // 確保資料已初始化
      await initializeMockCategories(); // 初始化 Categories 假資料
      await initializeMockSpaces(); // 初始化 Spaces 假資料
      await initializeMockCollections(); // 初始化 Collections 假資料
      
      const [storedCollections, storedSettings, storedSpaces, storedCategories, lastSelected] = await Promise.all([
        getCollections(),
        getUserSettings(),
        getSpaces(),
        getCategories(),
        getLastSelected()
      ]);
      
      setCollections(storedCollections);
      setSpaces(storedSpaces);
      setCategories(storedCategories);
      
      if (storedSettings) {
        setSettings(storedSettings);
      }
      
      // 恢復上次選擇的 Category 和 Space
      if (lastSelected) {
        if (lastSelected.categoryId && storedCategories.some(c => c.id === lastSelected.categoryId)) {
          setSelectedCategoryId(lastSelected.categoryId);
        }
        if (lastSelected.spaceId && storedSpaces.some(s => s.id === lastSelected.spaceId)) {
          setSelectedSpaceId(lastSelected.spaceId);
        }
      } else {
        // 首次使用：自動選中第一個 Category 的第一個 Space
        const firstCategory = storedCategories[0];
        if (firstCategory) {
          setSelectedCategoryId(firstCategory.id);
          const firstSpace = storedSpaces.find(s => s.categoryId === firstCategory.id);
          if (firstSpace) {
            setSelectedSpaceId(firstSpace.id);
            await saveLastSelected({
              categoryId: firstCategory.id,
              spaceId: firstSpace.id
            });
          }
        }
      }
      
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 當 Category 或 Space 改變時，保存選擇
  useEffect(() => {
    if (!isLoading && selectedCategoryId) {
      saveLastSelected({
        categoryId: selectedCategoryId,
        spaceId: selectedSpaceId
      });
    }
  }, [selectedCategoryId, selectedSpaceId, isLoading]);

  // Apply dark class to html element based on settings or state
  useEffect(() => {
    const isDark = settings?.isDarkMode ?? false;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings?.isDarkMode]);

  const toggleTheme = async () => {
    if (!settings) return;
    const newSettings = { ...settings, isDarkMode: !settings.isDarkMode };
    setSettings(newSettings);
    await saveUserSettings(newSettings);
  };

  // 新增分類
  const handleAddCategory = async (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      order: categories.length
    };
    
    try {
      await createCategory(newCategory);
      await loadData(); // 重新載入資料
      setIsAddCategoryOpen(false);
      
      // 自動選中新增的分類
      setSelectedCategoryId(newCategory.id);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  // 更新分類
  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      await updateCategory(updatedCategory);
      await loadData();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  // 刪除分類
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const selectedSpaceBelongsToDeletedCategory = selectedSpace?.categoryId === categoryId;

      await deleteCategory(categoryId);
      
      // 如果刪除的是當前選中的分類，清除選擇
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
        setSelectedSpaceId(null);
      }
      // 即使目前沒選到該分類，但選到的 Space 在其底下，也要清掉避免 orphan
      if (selectedSpaceBelongsToDeletedCategory) {
        setSelectedSpaceId(null);
      }
      
      setIsCategorySettingsOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  // 更新 Space
  const handleSaveSpaceName = async (spaceId: string, name: string) => {
    try {
      await updateSpace(spaceId, { name });
      await loadData();
    } catch (error) {
      console.error('Failed to update space:', error);
    }
  };

  // 刪除 Space
  const handleDeleteSpace = async (spaceId: string) => {
    try {
      await deleteSpace(spaceId);
      setSelectedSpaceId(null);
      setIsSpaceSettingsOpen(false);
      await loadData();
    } catch (error) {
      console.error('Failed to delete space:', error);
    }
  };

  // 根據選中的 Space 篩選 Collections
  const displayedCollections = selectedSpaceId
    ? collections.filter(c => c.spaceId === selectedSpaceId)
    : [];

  // 根據選中的 Category 篩選 Spaces
  const filteredSpaces = selectedCategoryId
    ? spaces.filter(s => s.categoryId === selectedCategoryId)
    : spaces;

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;
  const selectedSpace = spaces.find(s => s.id === selectedSpaceId) || null;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper dark:bg-dark-bg text-charcoal dark:text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-brand-hover border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-paper dark:bg-dark-bg overflow-hidden font-sans text-charcoal dark:text-gray-200 transition-colors duration-200">
      <CategoryBar 
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onAddCategory={() => setIsAddCategoryOpen(true)}
        onOpenSettings={() => setIsCategorySettingsOpen(true)}
      />
      <LeftSidebar 
        spaces={filteredSpaces}
        selectedCategoryId={selectedCategoryId}
        selectedSpaceId={selectedSpaceId}
        onSelectSpace={setSelectedSpaceId}
        onRefresh={loadData}
        onOpenAccountSettings={() => setIsSettingsOpen(true)}
        onOpenSpaceSettings={() => setIsSpaceSettingsOpen(true)}
      />
      <MainContent 
        collections={displayedCollections} 
        onRefresh={loadData}
        isDarkMode={settings?.isDarkMode ?? false} 
        toggleTheme={toggleTheme}
        autoCloseTab={settings?.autoCloseTab ?? false}
        selectedSpaceId={selectedSpaceId}
        selectedSpaceName={selectedSpace?.name || '我的收藏 (My Collections)'}
      />
      <RightSidebar 
        collections={collections}
        onRefresh={loadData}
        autoCloseTab={settings?.autoCloseTab ?? false}
      />
      
      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={settings?.isDarkMode ?? false}
        toggleTheme={toggleTheme}
        onSettingsChange={loadData}
      />
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onConfirm={handleAddCategory}
      />
      <CategorySettingsModal
        isOpen={isCategorySettingsOpen}
        onClose={() => setIsCategorySettingsOpen(false)}
        selectedCategory={selectedCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
      />
      <SpaceSettingsModal
        isOpen={isSpaceSettingsOpen}
        onClose={() => setIsSpaceSettingsOpen(false)}
        selectedSpace={selectedSpace}
        onSaveSpaceName={handleSaveSpaceName}
        onDeleteSpace={handleDeleteSpace}
      />
    </div>
  );
};

export default App;
