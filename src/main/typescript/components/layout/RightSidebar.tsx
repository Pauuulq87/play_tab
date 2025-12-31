import React, { useState, useEffect } from 'react';
import { Sidebar, Download, X, ChevronDown, BookmarkPlus } from 'lucide-react';
import { TabItem } from '@/models/types';
import { queryCurrentWindowTabs, activateTab, closeTab } from '@/services/tabService';

interface RightSidebarProps {
  onSaveTab?: (tab: TabItem) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onSaveTab }) => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTabs = async () => {
    try {
      setIsLoading(true);
      const currentTabs = await queryCurrentWindowTabs();
      setTabs(currentTabs);
    } catch (error) {
      console.error('Failed to load tabs:', error);
      // 如果 Chrome API 無法使用（開發模式），使用空陣列
      setTabs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTabs();

    // 監聽分頁變化並自動重載
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const handleTabUpdate = () => loadTabs();
      chrome.tabs.onCreated.addListener(handleTabUpdate);
      chrome.tabs.onRemoved.addListener(handleTabUpdate);
      chrome.tabs.onUpdated.addListener(handleTabUpdate);

      return () => {
        chrome.tabs.onCreated.removeListener(handleTabUpdate);
        chrome.tabs.onRemoved.removeListener(handleTabUpdate);
        chrome.tabs.onUpdated.removeListener(handleTabUpdate);
      };
    }
  }, []);

  const handleTabClick = async (tabId: string) => {
    try {
      await activateTab(parseInt(tabId));
    } catch (error) {
      console.error('Failed to activate tab:', error);
    }
  };

  const handleTabClose = async (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    try {
      await closeTab(parseInt(tabId));
      await loadTabs();
    } catch (error) {
      console.error('Failed to close tab:', error);
    }
  };

  const handleSaveTab = (e: React.MouseEvent, tab: TabItem) => {
    e.stopPropagation();
    if (onSaveTab) {
      onSaveTab(tab);
    }
  };

  const handleDragStart = (e: React.DragEvent, tab: TabItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(tab));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col border-l border-steel dark:border-gray-700 h-screen bg-charcoal dark:bg-dark-surface text-paper dark:text-gray-300 transition-colors duration-200">
      {/* Header */}
      <div className="h-16 border-b border-steel/50 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 bg-charcoal dark:bg-dark-surface">
        <Sidebar size={18} className="text-steel-light dark:text-gray-500 hover:text-brand-hover cursor-pointer transition-colors" />
        <span className="text-xs font-normal tracking-[0.2em] text-white dark:text-gray-300 uppercase">Open Tabs</span>
      </div>

      {/* Window Selector */}
      <div className="p-4 border-b border-steel/30 dark:border-gray-700 bg-charcoal dark:bg-dark-surface">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 cursor-pointer group">
            <span className="font-sans text-sm font-normal text-white group-hover:text-brand-hover transition-colors">Window 1</span>
            <ChevronDown size={14} className="text-steel-light group-hover:text-brand-hover transition-colors" />
          </div>
          <div className="flex items-center gap-3 text-steel-light">
            <Download 
              size={14} 
              className="hover:text-brand-hover cursor-pointer transition-colors"
              onClick={loadTabs}
              title="重新整理分頁列表"
            />
            <X size={14} className="hover:text-brand-hover cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {isLoading ? (
          <div className="text-center text-steel-light text-xs py-4">載入中...</div>
        ) : tabs.length === 0 ? (
          <div className="text-center text-steel-light text-xs py-4">無開啟的分頁</div>
        ) : (
          tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              draggable
              onDragStart={(e) => handleDragStart(e, tab)}
              className="
                group relative bg-steel/20 dark:bg-black/20 border border-transparent hover:border-l-4 hover:border-l-brand-hover hover:bg-steel/30 dark:hover:bg-black/40
                px-3 py-3 transition-all cursor-pointer min-h-[40px] flex items-center gap-2
              "
            >
              {tab.favicon && (
                <img src={tab.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-xs font-sans text-gray-300 group-hover:text-brand-hover line-clamp-2 leading-relaxed transition-colors flex-1">
                {tab.title}
              </span>
              {/* Hover Actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2">
                <BookmarkPlus 
                  size={12} 
                  className="text-white opacity-50 hover:opacity-100 hover:text-brand-hover"
                  onClick={(e) => handleSaveTab(e, tab)}
                  title="儲存到收藏"
                />
                <X 
                  size={12} 
                  className="text-white opacity-50 hover:opacity-100 hover:text-brand-hover"
                  onClick={(e) => handleTabClose(e, tab.id)}
                  title="關閉分頁"
                />
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer Info */}
      <div className="p-2 text-center border-t border-steel/30 dark:border-gray-700">
          <span className="text-[10px] text-steel-light font-sans font-thin">
            {tabs.length} Tabs Open
          </span>
      </div>
    </aside>
  );
};

export default RightSidebar;

