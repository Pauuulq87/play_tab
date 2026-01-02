import React, { useState, useEffect } from 'react';
import { Sidebar, Download, X, ChevronDown, BookmarkPlus, Check } from 'lucide-react';
import { TabItem, CollectionGroup, WindowGroup } from '@/models/types';
import { queryAllWindowsWithTabs, activateTab, closeTab } from '@/services/tabService';
import { addItemToCollection } from '@/services/storageService';

interface RightSidebarProps {
  collections: CollectionGroup[];
  onRefresh: () => void;
  autoCloseTab?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ collections, onRefresh, autoCloseTab = false }) => {
  const [windows, setWindows] = useState<WindowGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingTabId, setSavingTabId] = useState<string | null>(null);
  const [showCollectionPicker, setShowCollectionPicker] = useState<string | null>(null);

  const loadTabs = async () => {
    try {
      setIsLoading(true);
      const windowGroups = await queryAllWindowsWithTabs();
      setWindows(windowGroups);
    } catch (error) {
      console.error('Failed to load tabs:', error);
      setWindows([]);
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
      console.warn('開發環境無法切換分頁');
    }
  };

  const handleTabClose = async (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    try {
      await closeTab(parseInt(tabId));
      await loadTabs();
    } catch (error) {
      console.warn('開發環境無法關閉分頁');
      // 在開發環境中模擬移除
      setWindows(prev => 
        prev.map(w => ({
          ...w,
          tabs: w.tabs.filter(t => t.id !== tabId)
        }))
      );
    }
  };

  const handleSaveTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    // 顯示收藏集選擇器
    setShowCollectionPicker(tabId);
  };

  const handleSelectCollection = async (collectionId: string, tab: TabItem) => {
    setSavingTabId(tab.id);
    try {
      const newItem: TabItem = {
        id: crypto.randomUUID(),
        title: tab.title,
        url: tab.url,
        favicon: tab.favicon,
      };
      await addItemToCollection(collectionId, newItem);
      
      // 如果設定中啟用了「自動關閉分頁」，則關閉該分頁
      if (autoCloseTab && tab.id) {
        try {
          await closeTab(parseInt(tab.id));
        } catch (error) {
          console.warn('無法關閉分頁');
        }
      }
      
      onRefresh();
      await loadTabs(); // 重新載入分頁列表
      
      // 顯示成功動畫
      setTimeout(() => {
        setSavingTabId(null);
        setShowCollectionPicker(null);
      }, 500);
    } catch (error) {
      console.error('Failed to save tab:', error);
      setSavingTabId(null);
      setShowCollectionPicker(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, tab: TabItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(tab));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const totalTabs = windows.reduce((acc, w) => acc + w.tabs.length, 0);

  return (
    <aside className="w-80 flex-shrink-0 flex flex-col border-l border-steel dark:border-gray-700 h-screen bg-charcoal dark:bg-dark-surface text-paper dark:text-gray-300 transition-colors duration-200">
      {/* Header */}
      <div className="h-16 border-b border-steel dark:border-gray-700 flex items-center justify-between px-4 shrink-0 bg-charcoal dark:bg-dark-surface">
        <Sidebar size={18} className="text-steel-light dark:text-gray-500 hover:text-brand-hover cursor-pointer transition-colors" title="切換側欄" />
        <span className="text-xs font-normal tracking-[0.2em] text-white dark:text-gray-300 uppercase">開啟的分頁</span>
      </div>

      {/* Window Selector / Info */}
      <div className="h-16 px-4 border-b border-steel dark:border-gray-700 bg-charcoal dark:bg-dark-surface flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-normal text-white">{windows.length} 個視窗</span>
        </div>
        <div className="flex items-center gap-3 text-steel-light">
          <Download 
            size={14} 
            className="hover:text-brand-hover cursor-pointer transition-colors"
            onClick={loadTabs}
            title="重新整理分頁列表"
          />
        </div>
      </div>

      {/* Tabs List - Grouped by Window */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-steel-light text-xs py-4">載入中...</div>
        ) : windows.length === 0 ? (
          <div className="text-center text-steel-light text-xs py-4">無開啟的分頁</div>
        ) : (
          windows.map((window, windowIndex) => (
            <div key={window.windowId} className="space-y-2">
              {/* Window Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[10px] text-steel-light uppercase tracking-wider font-sans">
                  視窗 {windowIndex + 1}
                </span>
                <span className="text-[10px] text-steel-light/50">
                  {window.tabs.length} 個分頁
                </span>
              </div>

              {/* Tabs in this window */}
              {window.tabs.map((tab) => (
                <div key={tab.id} className="relative">
                  <div 
                    onClick={() => handleTabClick(tab.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tab)}
                    className={`
                      group relative bg-steel/20 dark:bg-black/20 border border-transparent hover:border-l-4 hover:border-l-brand-hover hover:bg-steel/30 dark:hover:bg-black/40
                      px-3 py-3 transition-all cursor-pointer min-h-[40px] flex items-center gap-2
                      ${savingTabId === tab.id ? 'bg-green-500/20 border-l-4 border-l-green-500' : ''}
                    `}
                  >
                    {tab.favicon && (
                      <img src={tab.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="text-xs font-sans text-gray-300 group-hover:text-brand-hover line-clamp-2 leading-relaxed transition-colors flex-1">
                      {tab.title}
                    </span>
                    {/* Hover Actions */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2">
                      {savingTabId === tab.id ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <BookmarkPlus 
                          size={12} 
                          className="text-white opacity-50 hover:opacity-100 hover:text-brand-hover"
                          onClick={(e) => handleSaveTab(e, tab.id)}
                          title="儲存到收藏"
                        />
                      )}
                      <X 
                        size={12} 
                        className="text-white opacity-50 hover:opacity-100 hover:text-brand-hover"
                        onClick={(e) => handleTabClose(e, tab.id)}
                        title="關閉分頁"
                      />
                    </div>
                  </div>

                  {/* Collection Picker Dropdown */}
                  {showCollectionPicker === tab.id && (
                    <div className="absolute right-0 top-full mt-1 z-50 bg-charcoal dark:bg-dark-surface border border-steel/50 shadow-lg min-w-[200px]">
                      <div className="p-2 border-b border-steel/30 text-xs text-gray-400">
                        選擇收藏集
                      </div>
                      {collections.length === 0 ? (
                        <div className="p-3 text-xs text-gray-500 italic">
                          尚無收藏集，請先建立
                        </div>
                      ) : (
                        collections.map((collection) => (
                          <div
                            key={collection.id}
                            onClick={() => handleSelectCollection(collection.id, tab)}
                            className="px-3 py-2 text-xs text-gray-300 hover:bg-brand-hover hover:text-white cursor-pointer transition-colors"
                          >
                            {collection.title}
                          </div>
                        ))
                      )}
                      <div 
                        onClick={() => setShowCollectionPicker(null)}
                        className="p-2 border-t border-steel/30 text-xs text-gray-500 hover:text-gray-300 cursor-pointer text-center"
                      >
                        取消
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      
      {/* Footer Info */}
      <div className="p-2 text-center border-t border-steel/30 dark:border-gray-700">
          <span className="text-[10px] text-steel-light font-sans font-thin">
            共 {totalTabs} 個分頁開啟中
          </span>
      </div>

      {/* Click outside to close picker */}
      {showCollectionPicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCollectionPicker(null)}
        />
      )}
    </aside>
  );
};

export default RightSidebar;
