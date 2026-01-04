import React from 'react';
import { Settings, GripVertical, Tag, LayoutGrid, Plus, ChevronDown, ChevronRight, MonitorPlay, FileText, Sun, Moon, ExternalLink, Trash2, Edit3, X } from 'lucide-react';
import { CollectionGroup, TabItem } from '@/models/types';
import { addItemToCollection, createCollection, toggleCollectionOpen, removeItemFromCollection, updateItemInCollection } from '@/services/storageService';
import { closeTab } from '@/services/tabService';
import { fetchPreviewImageUrl } from '@/services/previewService';
import EditItemModal from '../ui/EditItemModal';

interface MainContentProps {
  collections: CollectionGroup[];
  onRefresh: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  autoCloseTab?: boolean;
  selectedSpaceId?: string | null;
  selectedSpaceName?: string;
}

type ViewMode = 'card' | 'compact' | 'list';
type ExtendedViewMode = ViewMode | 'tweet';

const MainContent: React.FC<MainContentProps> = ({ 
  collections, 
  onRefresh, 
  isDarkMode, 
  toggleTheme,
  autoCloseTab = false,
  selectedSpaceId,
  selectedSpaceName = '我的收藏 (My Collections)'
}) => {
  const [editingItem, setEditingItem] = React.useState<{ item: TabItem; collectionId: string } | null>(null);
  const [viewMode, setViewMode] = React.useState<ExtendedViewMode>('card');
  const [showViewMenu, setShowViewMenu] = React.useState(false);
  const viewMenuRef = React.useRef<HTMLDivElement>(null);
  
  const totalItems = collections.reduce((acc, curr) => acc + curr.items.length, 0);

  // Close view menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setShowViewMenu(false);
      }
    };

    if (showViewMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showViewMenu]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent, collectionId: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const tab = JSON.parse(data) as TabItem;
      // 產生新的 UUID 避免衝突（如果是從開啟分頁拖過來的話）
      const newItem: TabItem = { 
        ...tab, 
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString() // 加入當前時間
      };
      await addItemToCollection(collectionId, newItem);
      
      // 如果設定中啟用了「自動關閉分頁」，則關閉該分頁
      if (autoCloseTab && tab.id) {
        try {
          await closeTab(parseInt(tab.id));
        } catch (error) {
          console.warn('無法關閉分頁（可能在開發環境）');
        }
      }
      
      onRefresh();

      // 先顯示項目，再背景抓取預覽圖（若不存在）
      if (newItem.url) {
        void (async () => {
          try {
            const previewUrl = await fetchPreviewImageUrl(newItem.url!);
            if (previewUrl) {
              await updateItemInCollection(collectionId, newItem.id, { previewImageAutoUrl: previewUrl });
              onRefresh();
            }
          } catch {
            // ignore
          }
        })();
      }
    } catch (error) {
      console.error('Failed to add item via drop:', error);
    }
  };

  const handleAddCollection = async () => {
    if (!selectedSpaceId) {
      alert('請先選擇一個空間（Space）');
      return;
    }

    const title = prompt('請輸入新收藏集的名稱：');
    if (!title) return;

    try {
      const newCollection: CollectionGroup = {
        id: crypto.randomUUID(),
        title: title,
        spaceId: selectedSpaceId,
        items: [],
        isOpen: true,
      };
      await createCollection(newCollection);
      onRefresh();
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleToggleCollection = async (collectionId: string) => {
    try {
      await toggleCollectionOpen(collectionId);
      onRefresh();
    } catch (error) {
      console.error('Failed to toggle collection:', error);
    }
  };

  const handleCardClick = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleDeleteItem = async (e: React.MouseEvent, collectionId: string, itemId: string) => {
    e.stopPropagation();
    if (!confirm('確定要刪除此項目嗎？')) return;
    
    try {
      await removeItemFromCollection(collectionId, itemId);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleEditItem = (e: React.MouseEvent, item: TabItem, collectionId: string) => {
    e.stopPropagation();
    setEditingItem({ item, collectionId });
  };

  const handleSaveItem = async (
    collectionId: string,
    itemId: string,
    updates: {
      title: string;
      url: string;
      description: string;
      previewImageAutoUrl?: string;
      previewImageUserDataUrl?: string;
    }
  ) => {
    try {
      await updateItemInCollection(collectionId, itemId, updates);
      onRefresh();
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  };

  const handleDeleteItemFromModal = async (collectionId: string, itemId: string) => {
    try {
      await removeItemFromCollection(collectionId, itemId);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  };

  return (
    <main className="flex-1 flex flex-col h-screen bg-paper dark:bg-dark-bg overflow-hidden transition-colors duration-200">
      {/* Header */}
      <header className="h-16 border-b border-steel dark:border-gray-700 flex items-center justify-between px-6 bg-paper dark:bg-dark-bg shrink-0 transition-colors duration-200">
        <div className="flex items-baseline gap-4">
          <h1 className="font-sans text-2xl font-normal text-charcoal dark:text-white">{selectedSpaceName}</h1>
          <span className="font-sans text-xs text-steel dark:text-gray-500">| {collections.length} 個收藏 ({totalItems} 項目)</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 text-xs font-normal text-steel dark:text-gray-400 hover:text-brand-hover uppercase tracking-wider group transition-colors"
          >
            {isDarkMode ? (
              <>
                <Sun size={14} className="group-hover:stroke-[2px]" />
                淺色模式
              </>
            ) : (
              <>
                <Moon size={14} className="group-hover:stroke-[2px]" />
                深色模式
              </>
            )}
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-16 border-b border-steel dark:border-gray-700 flex items-center justify-between px-6 bg-paper/50 dark:bg-dark-bg/95 backdrop-blur-sm shrink-0 transition-colors duration-200 relative z-50">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors opacity-50 cursor-not-allowed" title="功能開發中">
            <GripVertical size={14} />
            <span>拖曳排序</span>
            <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors opacity-50 cursor-not-allowed" title="功能開發中">
            <Tag size={14} />
            <span>標籤篩選</span>
            <ChevronDown size={12} />
          </button>
          <div ref={viewMenuRef} className="relative">
            <button 
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors"
            >
              <LayoutGrid size={14} />
              <span>檢視</span>
              <ChevronDown size={12} />
            </button>
            
            {/* View Mode Dropdown */}
            {showViewMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white dark:bg-dark-surface border border-steel dark:border-gray-700 rounded shadow-xl z-[100] min-w-[140px] py-1">
                <button
                  onClick={() => {
                    setViewMode('card');
                    setShowViewMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-hover/10 transition-colors ${
                    viewMode === 'card' ? 'bg-brand-hover/20 text-brand-hover font-medium' : 'text-charcoal dark:text-gray-300'
                  }`}
                >
                  卡片
                </button>
                <button
                  onClick={() => {
                    setViewMode('compact');
                    setShowViewMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-hover/10 transition-colors ${
                    viewMode === 'compact' ? 'bg-brand-hover/20 text-brand-hover font-medium' : 'text-charcoal dark:text-gray-300'
                  }`}
                >
                  精簡
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    setShowViewMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-hover/10 transition-colors ${
                    viewMode === 'list' ? 'bg-brand-hover/20 text-brand-hover font-medium' : 'text-charcoal dark:text-gray-300'
                  }`}
                >
                  列表
                </button>
                <button
                  onClick={() => {
                    setViewMode('tweet');
                    setShowViewMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-brand-hover/10 transition-colors ${
                    viewMode === 'tweet' ? 'bg-brand-hover/20 text-brand-hover font-medium' : 'text-charcoal dark:text-gray-300'
                  }`}
                >
                  推文
                </button>
              </div>
            )}
          </div>
          <div className="w-px h-4 bg-steel/30 dark:bg-gray-700 mx-2"></div>
          <button 
            onClick={() => {
              collections.forEach(c => {
                if (!c.isOpen) handleToggleCollection(c.id);
              });
            }}
            className="text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover uppercase tracking-wider transition-colors"
          >
            展開全部
          </button>
          <button 
            onClick={() => {
              collections.forEach(c => {
                if (c.isOpen) handleToggleCollection(c.id);
              });
            }}
            className="text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover uppercase tracking-wider transition-colors"
          >
            折疊全部
          </button>
        </div>
        
        <button 
          onClick={handleAddCollection}
          className="flex items-center gap-2 px-3 py-1.5 border border-steel dark:border-gray-500 bg-steel dark:bg-gray-700 text-white text-xs font-normal uppercase hover:bg-brand-hover hover:border-brand-hover transition-colors"
        >
          <Plus size={14} strokeWidth={3} />
          新增分項區塊
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F4F4F4] dark:bg-[#121212] transition-colors duration-200">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-steel dark:text-gray-500 gap-4">
            <p className="text-lg">尚無收藏集</p>
            <button 
              onClick={handleAddCollection}
              className="text-xs border border-steel px-4 py-2 hover:bg-brand-hover hover:border-brand-hover hover:text-white transition-all"
            >
              點此建立第一個收藏
            </button>
          </div>
        ) : (
          collections.map((collection) => (
            <div 
              key={collection.id} 
              className="group"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, collection.id)}
            >
              {/* Collection Header */}
              <div 
                onClick={() => handleToggleCollection(collection.id)}
                className="flex items-center gap-2 mb-4 cursor-pointer hover:text-brand-hover transition-colors group"
              >
                {collection.isOpen ? (
                  <ChevronDown size={20} className="text-brand-hover" />
                ) : (
                  <ChevronRight size={20} className="text-steel dark:text-gray-500 group-hover:text-brand-hover" />
                )}
                <h2 className="font-sans text-xl font-normal text-charcoal dark:text-gray-100 group-hover:text-brand-hover transition-colors">{collection.title}</h2>
                <span className="text-xs text-steel dark:text-gray-500">({collection.items.length})</span>
              </div>

              {/* Collection Items - Dynamic View */}
              {collection.isOpen && (
                <div className={
                  viewMode === 'card' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' :
                  viewMode === 'compact' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' :
                  viewMode === 'tweet' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' :
                  'flex flex-col gap-2'
                }>
                  {collection.items.length > 0 ? (
                    collection.items.map((item) => {
                      if (viewMode === 'card') {
                        // Card View
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => handleCardClick(item.url)}
                            className="
                              bg-white dark:bg-[#1E1E1E] border border-steel dark:border-gray-700 p-4 h-32 flex flex-col justify-between 
                              hover:shadow-[4px_4px_0px_0px_rgba(230,182,68,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(230,182,68,0.5)] 
                              hover:border-brand-hover transition-all cursor-pointer relative group/item
                            "
                          >
                            {/* Delete button - top right corner */}
                            <button
                              onClick={(e) => handleDeleteItem(e, collection.id, item.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                              title="刪除"
                            >
                              <X size={16} className="text-steel dark:text-gray-400 hover:text-red-500" />
                            </button>

                            <div className="flex items-start gap-3">
                              {/* Dynamic Icon based on content */}
                              <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-paper dark:bg-gray-800 border border-steel dark:border-gray-600 text-steel dark:text-gray-400 group-hover/item:border-brand-hover group-hover/item:text-brand-hover transition-colors">
                                {item.favicon ? (
                                  <img src={item.favicon} alt="" className="w-4 h-4" />
                                ) : item.url?.includes('youtube') ? (
                                  <MonitorPlay size={16} />
                                ) : (
                                  <FileText size={16} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-sans text-sm font-normal text-charcoal dark:text-gray-200 line-clamp-2 leading-tight mb-1 group-hover/item:text-brand-hover transition-colors">
                                  {item.title}
                                </h3>
                              </div>
                            </div>
                            
                            <div className="mt-2 pt-2 border-t border-dashed border-steel/30 dark:border-gray-700 flex items-center justify-between">
                               <p className="text-[10px] font-sans font-thin text-steel dark:text-gray-500 truncate flex-1 group-hover/item:text-brand-hover transition-colors">{item.url}</p>
                               {/* Edit button on hover */}
                               <div className="opacity-0 group-hover/item:opacity-100 transition-opacity ml-2">
                                 <button
                                   onClick={(e) => handleEditItem(e, item, collection.id)}
                                   className="p-1 hover:bg-brand-hover/10 rounded transition-colors"
                                   title="編輯"
                                 >
                                   <Edit3 size={14} className="text-steel dark:text-gray-400 hover:text-brand-hover" />
                                 </button>
                               </div>
                            </div>
                          </div>
                        );
                      } else if (viewMode === 'compact') {
                        // Compact View
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => handleCardClick(item.url)}
                            className="
                              bg-white dark:bg-[#1E1E1E] border border-steel dark:border-gray-700 p-2.5 h-10 flex items-center gap-2
                              hover:shadow-[2px_2px_0px_0px_rgba(230,182,68,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(230,182,68,0.5)] 
                              hover:border-brand-hover transition-all cursor-pointer relative group/item
                            "
                          >
                            {/* Delete button - top right corner */}
                            <button
                              onClick={(e) => handleDeleteItem(e, collection.id, item.id)}
                              className="absolute top-0.5 right-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 hover:bg-red-500/10 rounded"
                              title="刪除"
                            >
                              <X size={10} className="text-steel dark:text-gray-400 hover:text-red-500" />
                            </button>

                            {/* Dynamic Icon based on content */}
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-paper dark:bg-gray-800 border border-steel dark:border-gray-600 text-steel dark:text-gray-400 group-hover/item:border-brand-hover group-hover/item:text-brand-hover transition-colors">
                              {item.favicon ? (
                                <img src={item.favicon} alt="" className="w-3 h-3" />
                              ) : item.url?.includes('youtube') ? (
                                <MonitorPlay size={12} />
                              ) : (
                                <FileText size={12} />
                              )}
                            </div>
                            
                            {/* Title - single line with ellipsis */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-sans text-xs font-normal text-charcoal dark:text-gray-200 truncate group-hover/item:text-brand-hover transition-colors">
                                {item.title}
                              </h3>
                            </div>

                            {/* Edit button */}
                            <button
                              onClick={(e) => handleEditItem(e, item, collection.id)}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 hover:bg-brand-hover/10 rounded shrink-0"
                              title="編輯"
                            >
                              <Edit3 size={10} className="text-steel dark:text-gray-400 hover:text-brand-hover" />
                            </button>
                          </div>
                        );
                      } else if (viewMode === 'tweet') {
                        const previewUrl = item.previewImageUserDataUrl || item.previewImageAutoUrl;
                        const host = item.url ? (() => { try { return new URL(item.url).host; } catch { return item.url; } })() : '';

                        return (
                          <div
                            key={item.id}
                            onClick={() => handleCardClick(item.url)}
                            className="
                              bg-white dark:bg-[#1E1E1E] border border-steel dark:border-gray-700
                              hover:border-brand-hover hover:bg-brand-hover/5 transition-all cursor-pointer
                              p-4 relative group/item h-full flex flex-col
                            "
                          >
                            {/* Top Meta + Actions */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-paper dark:bg-gray-800 border border-steel dark:border-gray-600 overflow-hidden">
                                  {item.favicon ? (
                                    <img src={item.favicon} alt="" className="w-5 h-5" />
                                  ) : (
                                    <FileText size={16} className="text-steel dark:text-gray-400" />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 text-xs text-steel dark:text-gray-500 min-w-0">
                                    {host && <span className="truncate min-w-0">{host}</span>}
                                    {item.createdAt && (
                                      <span className="shrink-0">
                                        · {new Date(item.createdAt).toLocaleDateString('zh-TW').replace(/\//g, '-')}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => handleEditItem(e, item, collection.id)}
                                  className="opacity-0 group-hover/item:opacity-100 transition-opacity p-2 hover:bg-brand-hover/10 rounded"
                                  title="編輯"
                                >
                                  <Edit3 size={14} className="text-steel dark:text-gray-400 hover:text-brand-hover" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteItem(e, collection.id, item.id)}
                                  className="opacity-0 group-hover/item:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded"
                                  title="刪除"
                                >
                                  <X size={14} className="text-steel dark:text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>

                            {/* Title */}
                            <h3
                              title={item.title}
                              className="
                                mt-3 font-sans text-[16px] sm:text-[17px] font-semibold
                                text-charcoal dark:text-gray-100 leading-snug
                                [text-wrap:balance] break-words line-clamp-2
                                group-hover/item:text-brand-hover transition-colors
                              "
                            >
                              {item.title}
                            </h3>

                            {/* Body */}
                            {item.description && (
                              <p className="mt-2 text-sm text-charcoal/90 dark:text-gray-200 leading-relaxed line-clamp-2 break-words">
                                {item.description}
                              </p>
                            )}

                            {/* Preview Image */}
                            {previewUrl && (
                              <div className="mt-4 border border-steel/40 dark:border-gray-700 rounded overflow-hidden bg-steel/5 dark:bg-gray-800/30">
                                <div className="w-full aspect-video">
                                  <img
                                    src={previewUrl}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // List View
                        return (
                          <div 
                            key={item.id} 
                            onClick={() => handleCardClick(item.url)}
                            className="
                              bg-white dark:bg-[#1E1E1E] border border-steel dark:border-gray-700 p-4 
                              hover:border-brand-hover hover:bg-brand-hover/5 transition-all cursor-pointer relative group/item
                              flex items-center gap-4
                            "
                          >
                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDeleteItem(e, collection.id, item.id)}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded shrink-0"
                              title="刪除"
                            >
                              <X size={14} className="text-steel dark:text-gray-400 hover:text-red-500" />
                            </button>

                            {/* Icon */}
                            <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-paper dark:bg-gray-800 border border-steel dark:border-gray-600 text-steel dark:text-gray-400 group-hover/item:border-brand-hover group-hover/item:text-brand-hover transition-colors">
                              {item.favicon ? (
                                <img src={item.favicon} alt="" className="w-4 h-4" />
                              ) : item.url?.includes('youtube') ? (
                                <MonitorPlay size={16} />
                              ) : (
                                <FileText size={16} />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-sans text-sm font-normal text-charcoal dark:text-gray-200 truncate group-hover/item:text-brand-hover transition-colors mb-1">
                                {item.title}
                              </h3>
                              <p className="text-xs text-steel dark:text-gray-500 truncate">{item.url}</p>
                            </div>

                            {/* Edit button */}
                            <button
                              onClick={(e) => handleEditItem(e, item, collection.id)}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-2 hover:bg-brand-hover/10 rounded shrink-0"
                              title="編輯"
                            >
                              <Edit3 size={14} className="text-steel dark:text-gray-400 hover:text-brand-hover" />
                            </button>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="col-span-full py-8 border border-dashed border-steel/40 dark:border-gray-700 flex items-center justify-center text-steel dark:text-gray-600 text-sm font-sans italic bg-paper dark:bg-transparent">
                      此收藏集尚無項目（可將分頁拖曳至此）
                    </div>
                  )}
                </div>
              )}
              {/* Divider between collections */}
              <div className="h-px w-full bg-steel/20 dark:bg-gray-800 mt-8"></div>
            </div>
          ))
        )}
      </div>
      
      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          item={editingItem.item}
          collectionId={editingItem.collectionId}
          onSave={handleSaveItem}
          onDelete={handleDeleteItemFromModal}
        />
      )}
    </main>
  );
};

export default MainContent;
