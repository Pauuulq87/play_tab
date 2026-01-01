import React, { useState, useEffect } from 'react';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import SettingsModal from '../components/ui/SettingsModal';
import { CollectionGroup, UserSettings } from '@/models/types';
import { getCollections, getUserSettings, initializeData, saveUserSettings } from '@/services/storageService';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

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

  // 根據選擇的收藏集篩選顯示
  const displayedCollections = selectedCollectionId 
    ? collections.filter(c => c.id === selectedCollectionId)
    : collections;

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
        onOpenSettings={() => setIsSettingsOpen(true)}
        autoCloseTab={settings?.autoCloseTab ?? false}
      />
      <RightSidebar 
        collections={collections}
        onRefresh={loadData}
        autoCloseTab={settings?.autoCloseTab ?? false}
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={settings?.isDarkMode ?? false}
        toggleTheme={toggleTheme}
        onSettingsChange={loadData}
      />
    </div>
  );
};

export default App;
