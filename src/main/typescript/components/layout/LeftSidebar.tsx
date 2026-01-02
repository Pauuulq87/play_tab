import React, { useState } from 'react';
import { Search, Plus, ArrowDownAZ, LayoutGrid, MoreVertical, Settings } from 'lucide-react';
import { Space } from '@/models/types';
import { createSpace } from '@/services/spaceService';

interface LeftSidebarProps {
  spaces: Space[];
  selectedSpaceId: string | null;
  onSelectSpace: (spaceId: string | null) => void;
  onRefresh: () => void;
  onOpenAccountSettings?: () => void;
  onOpenSpaceSettings?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  spaces,
  selectedSpaceId,
  onSelectSpace,
  onRefresh,
  onOpenAccountSettings,
  onOpenSpaceSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddSpace = async () => {
    const name = prompt('請輸入新空間的名稱：');
    if (!name) return;

    try {
      const newSpace: Space = {
        id: crypto.randomUUID(),
        name: name,
        categoryId: spaces[0]?.categoryId || '', // 使用當前 Category
        order: spaces.length
      };
      await createSpace(newSpace);
      onRefresh();
    } catch (error) {
      console.error('Failed to create space:', error);
    }
  };

  const handleSortSpaces = () => {
    alert('排序功能開發中');
  };

  // 篩選 Spaces
  const filteredSpaces = spaces.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-steel dark:border-gray-700 h-screen bg-paper dark:bg-dark-surface text-charcoal dark:text-gray-200 select-none transition-colors duration-200">
      {/* User Header */}
      <div className="h-16 px-4 border-b border-steel dark:border-gray-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-sans font-normal text-lg dark:text-white">Play_Tab</span>
        </div>
        <div 
          onClick={onOpenAccountSettings}
          title="帳戶設定"
          className="cursor-pointer hover:text-brand-hover p-1 transition-colors"
        >
          <MoreVertical size={18} className="text-steel dark:text-gray-400 hover:text-brand-hover" />
        </div>
      </div>

      {/* Search */}
      <div className="h-16 px-4 border-b border-steel dark:border-gray-700 flex items-center shrink-0">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-steel dark:text-gray-400 w-4 h-4 group-hover:text-brand-hover transition-colors" />
          <input 
            type="text" 
            placeholder="搜尋空間..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-steel dark:border-gray-600 py-2 pl-9 pr-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-brand-hover dark:focus:border-brand-hover transition-colors font-sans placeholder-steel-light dark:placeholder-gray-500 dark:text-white"
          />
        </div>
      </div>

      {/* Collection Groups - 已移除 */}
      {/* TODO 後端: 移除 Starred Collections 相關功能 */}
      {/* TODO 後端: 移除固定的「我的收藏」選項，改為動態顯示當前 Space 名稱 */}

      {/* Spaces Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-normal tracking-widest text-steel dark:text-gray-500 font-sans uppercase">SPACES</span>
        <div className="flex gap-2 text-steel dark:text-gray-400">
          <ArrowDownAZ 
            size={14} 
            className="cursor-pointer hover:text-brand-hover transition-colors" 
            onClick={handleSortSpaces}
            title="排序"
          />
          <Plus 
            size={14} 
            className="cursor-pointer hover:text-brand-hover transition-colors" 
            onClick={handleAddSpace}
            title="新增空間"
          />
        </div>
      </div>

      {/* Spaces List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1 py-4">
        {filteredSpaces.length === 0 ? (
          <div className="text-center text-xs text-steel dark:text-gray-600 py-8 italic px-4">
            {searchTerm ? '找不到符合的空間' : (
              <>
                此分類尚無空間
                <br />
                點擊右上角 + 新增
              </>
            )}
          </div>
        ) : (
          filteredSpaces.map((space) => (
            <div 
              key={space.id}
              onClick={() => onSelectSpace(space.id)}
              className={`flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-all rounded border border-transparent ${
                selectedSpaceId === space.id 
                  ? 'bg-brand-hover/20 border-brand-hover text-brand-hover' 
                  : 'text-steel dark:text-gray-400 hover:text-brand-hover hover:bg-steel/5 dark:hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={14} />
              <span className="font-sans truncate flex-1">{space.name}</span>
            </div>
          ))
        )}
      </div>

      {/* Space Settings Button */}
      <div className="h-16 px-4 border-t border-steel dark:border-gray-700 flex items-center shrink-0">
        {selectedSpaceId ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSpaceSettings?.();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-steel dark:text-gray-400 hover:text-brand-hover hover:bg-steel/5 dark:hover:bg-white/5 border border-steel dark:border-gray-600 hover:border-brand-hover rounded transition-all"
          >
            <Settings size={16} />
            <span className="font-sans">空間設定</span>
          </button>
        ) : (
          <div className="w-full h-10"></div>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
