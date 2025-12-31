import React, { useState, useEffect } from 'react';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import SettingsModal from '../components/ui/SettingsModal';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full bg-paper dark:bg-dark-bg overflow-hidden font-sans text-charcoal dark:text-gray-200 transition-colors duration-200">
      <LeftSidebar />
      <MainContent isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      <RightSidebar />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
};

export default App;

