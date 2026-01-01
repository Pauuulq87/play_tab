import React, { useState } from 'react';
import { Search, Link as LinkIcon, ArrowRight, Plus, ArrowDownAZ, LogOut, LayoutGrid, MoreVertical } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../../../resources/config/constants';
import { CollectionGroup } from '@/models/types';
import { createCollection } from '@/services/storageService';

interface LeftSidebarProps {
  collections: CollectionGroup[];
  onRefresh: () => void;
  onSelectCollection?: (collectionId: string | null) => void;
  selectedCollectionId?: string | null;
  onOpenAccountSettings?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  collections, 
  onRefresh, 
  onSelectCollection,
  selectedCollectionId,
  onOpenAccountSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCollection = async () => {
    const title = prompt('請輸入新收藏集的名稱：');
    if (!title) return;

    try {
      const newCollection: CollectionGroup = {
        id: crypto.randomUUID(),
        title: title,
        items: [],
        isOpen: true,
      };
      await createCollection(newCollection);
      onRefresh();
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const handleSortCollections = () => {
    alert('排序功能開發中');
  };

  // 篩選收藏集
  const filteredCollections = collections.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-steel dark:border-gray-700 h-screen bg-paper dark:bg-dark-surface text-charcoal dark:text-gray-200 select-none transition-colors duration-200">
      {/* User Header */}
      <div className="p-4 border-b border-steel dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-charcoal dark:bg-gray-700 text-paper flex items-center justify-center font-sans font-normal text-sm border border-charcoal dark:border-gray-600">
            PA
          </div>
          <span className="font-sans font-normal text-lg dark:text-white">Paul</span>
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
      <div className="p-4 border-b border-steel dark:border-gray-700">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-steel dark:text-gray-400 w-4 h-4 group-hover:text-brand-hover transition-colors" />
          <input 
            type="text" 
            placeholder="搜尋收藏集..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-steel dark:border-gray-600 py-2 pl-9 pr-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-brand-hover dark:focus:border-brand-hover transition-colors font-sans placeholder-steel-light dark:placeholder-gray-500 dark:text-white"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-xs text-steel dark:text-gray-500">
            找到 {filteredCollections.length} 個結果
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="p-4 border-b border-steel dark:border-gray-700 space-y-3">
        <div 
          onClick={() => onSelectCollection?.(null)}
          className={`flex items-center gap-2 text-sm cursor-pointer group transition-colors ${
            selectedCollectionId === null 
              ? 'text-brand-hover' 
              : 'text-steel dark:text-gray-400 hover:text-brand-hover'
          }`}
        >
          <LinkIcon size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">全部收藏</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-steel dark:text-gray-400 hover:text-brand-hover cursor-pointer group transition-colors opacity-50" title="功能開發中">
          <ArrowRight size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">最近使用</span>
        </div>
      </div>

      {/* Spaces Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-normal tracking-widest text-steel dark:text-gray-500 font-sans uppercase">Spaces</span>
        <div className="flex gap-2 text-steel dark:text-gray-400">
          <ArrowDownAZ 
            size={14} 
            className="cursor-pointer hover:text-brand-hover transition-colors" 
            onClick={handleSortCollections}
            title="排序"
          />
          <Plus 
            size={14} 
            className="cursor-pointer hover:text-brand-hover transition-colors" 
            onClick={handleAddCollection}
            title="新增收藏集"
          />
        </div>
      </div>

      {/* Spaces List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1 pb-4">
        {/* 使用者建立的 Spaces/Collections */}
        {filteredCollections.length === 0 ? (
          <div className="text-center text-xs text-steel dark:text-gray-600 py-8 italic">
            {searchTerm ? '找不到符合的收藏集' : (
              <>
                尚無收藏集
                <br />
                點擊右上角 + 新增
              </>
            )}
          </div>
        ) : (
          filteredCollections.map((collection) => (
            <div 
              key={collection.id}
              onClick={() => onSelectCollection?.(collection.id)}
              className={`flex items-center gap-3 px-3 py-1.5 text-xs cursor-pointer transition-all border border-transparent ${
                selectedCollectionId === collection.id 
                  ? 'bg-brand-hover/20 border-brand-hover text-brand-hover' 
                  : 'text-steel dark:text-gray-400 hover:text-brand-hover hover:bg-steel/5 dark:hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={12} />
              <span className="font-sans truncate">{collection.title}</span>
              <span className="ml-auto text-[10px] opacity-50">{collection.items.length}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
