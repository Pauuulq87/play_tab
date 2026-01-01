import React, { useState, useEffect } from 'react';
import CategoryBar from '../components/layout/CategoryBar';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import SettingsModal from '../components/ui/SettingsModal';
import AddCategoryModal from '../components/ui/AddCategoryModal';
import CategorySettingsModal from '../components/ui/CategorySettingsModal';
import { CollectionGroup, UserSettings, Category } from '@/models/types';
import { getCollections, getUserSettings, initializeData, saveUserSettings } from '@/services/storageService';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategorySettingsOpen, setIsCategorySettingsOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  
  // TODO: 待實作後端 - Category 資料管理
  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat-1', name: 'Paul', color: '#3B82F6', order: 0 }
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('cat-1');

  const loadData = async () => {
    try {
      setIsLoading(true);
      await initializeData(); // 確保資料已初始化
      
      const [storedCollections, storedSettings] = await Promise.all([
        getCollections(),
        getUserSettings()
      ]);
      
      setCollections(storedCollections);
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

  // 根據選擇的收藏集篩選顯示
  const displayedCollections = selectedCollectionId 
    ? collections.filter(c => c.id === selectedCollectionId)
    : collections;

  // TODO: 待實作 - 根據選擇的分類篩選收藏集
  // const filteredByCategory = selectedCategoryId
  //   ? displayedCollections.filter(c => c.categoryId === selectedCategoryId)
  //   : displayedCollections;

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;

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
        onOpenAccountSettings={() => setIsSettingsOpen(true)}
      />
      <LeftSidebar 
        collections={collections} 
        onRefresh={loadData} 
        onSelectCollection={setSelectedCollectionId}
        selectedCollectionId={selectedCollectionId}
      />
      <MainContent 
        collections={displayedCollections} 
        onRefresh={loadData}
        isDarkMode={settings?.isDarkMode ?? false} 
        toggleTheme={toggleTheme}
        autoCloseTab={settings?.autoCloseTab ?? false}
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
    </div>
  );
};

export default App;
