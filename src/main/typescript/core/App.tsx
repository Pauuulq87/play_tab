import React, { useState, useEffect } from 'react';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import SettingsModal from '../components/ui/SettingsModal';
import { CollectionGroup, UserSettings } from '@/models/types';
import { getCollections, getUserSettings, initializeData } from '@/services/storageService';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    // 注意：這裡應該呼叫 saveUserSettings，但為了簡化先只更新 UI 狀態
    // 待 SettingsModal 完整整合時再實作持久化
  };

  return (
    <div className="flex h-screen w-full bg-paper dark:bg-dark-bg overflow-hidden font-sans text-charcoal dark:text-gray-200 transition-colors duration-200">
      <LeftSidebar collections={collections} onRefresh={loadData} />
      <MainContent 
        collections={collections} 
        onRefresh={loadData}
        isDarkMode={settings?.isDarkMode ?? false} 
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <RightSidebar onSaveTab={() => loadData()} />
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

