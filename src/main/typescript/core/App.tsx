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
import { getCollections, getUserSettings, initializeData, saveUserSettings, initializeMockCollections } from '@/services/storageService';
import { getSpaces, initializeMockSpaces, updateSpace, deleteSpace } from '@/services/spaceService';

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
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-reading', name: '閱讀', color: '#A855F7', order: 0 },
    { id: 'cat-work', name: '工作', color: '#3B82F6', order: 1 }
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('cat-reading');
  
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await initializeData(); // 確保資料已初始化
      await initializeMockSpaces(); // 初始化 Spaces 假資料
      await initializeMockCollections(); // 初始化 Collections 假資料
      
      const [storedCollections, storedSettings, storedSpaces] = await Promise.all([
        getCollections(),
        getUserSettings(),
        getSpaces()
      ]);
      
      setCollections(storedCollections);
      setSpaces(storedSpaces);
      
      if (storedSettings) {
        setSettings(storedSettings);
      }
      
      // TODO: 待實作 - 從 categoryService 載入分類資料
      // const storedCategories = await getCategories();
      // setCategories(storedCategories);
      
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  // TODO: 待實作 - 新增分類邏輯
  const handleAddCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name,
      color,
      order: categories.length
    };
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
    
    // TODO: 待實作後端 - 儲存到 categoryService
    // await createCategory(newCategory);
  };

  // 更新 Space 名稱
  const handleSaveSpaceName = async (name: string) => {
    if (!selectedSpaceId) return;
    
    try {
      await updateSpace(selectedSpaceId, { name });
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
      />
      <SpaceSettingsModal
        isOpen={isSpaceSettingsOpen}
        onClose={() => setIsSpaceSettingsOpen(false)}
        spaceName={selectedSpace?.name || ''}
        spaceId={selectedSpaceId || ''}
        onSave={handleSaveSpaceName}
        onDelete={handleDeleteSpace}
      />
    </div>
  );
};

export default App;
