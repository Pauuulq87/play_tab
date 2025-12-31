import React from 'react';
import { Search, Link as LinkIcon, ArrowRight, Plus, ArrowDownAZ, LogOut, LayoutGrid } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../../../resources/config/constants';
import { CollectionGroup } from '@/models/types';

interface LeftSidebarProps {
  collections: CollectionGroup[];
  onRefresh: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ collections, onRefresh }) => {
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
        <div className="cursor-pointer hover:text-brand-hover p-1 transition-colors">
          <LogOut size={16} className="text-steel dark:text-gray-400" />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-steel dark:border-gray-700">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-steel dark:text-gray-400 w-4 h-4 group-hover:text-brand-hover transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent border border-steel dark:border-gray-600 py-2 pl-9 pr-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-brand-hover dark:focus:border-brand-hover transition-colors font-sans placeholder-steel-light dark:placeholder-gray-500 dark:text-white"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 border-b border-steel dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-2 text-sm text-steel dark:text-gray-400 hover:text-brand-hover cursor-pointer group transition-colors">
          <LinkIcon size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">To / Links</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-steel dark:text-gray-400 hover:text-brand-hover cursor-pointer group transition-colors">
          <ArrowRight size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">Next (1)</span>
        </div>
      </div>

      {/* Spaces Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-normal tracking-widest text-steel dark:text-gray-500 font-sans uppercase">Spaces</span>
        <div className="flex gap-2 text-steel dark:text-gray-400">
          <ArrowDownAZ size={14} className="cursor-pointer hover:text-brand-hover transition-colors" />
          <Plus size={14} className="cursor-pointer hover:text-brand-hover transition-colors" />
        </div>
      </div>

      {/* Spaces List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1 pb-4">
        {/* Fixed Spaces */}
        {SIDEBAR_ITEMS.map((item) => (
          <div 
            key={item.id}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-all border border-transparent
              ${item.id === 'my-collections' 
                ? 'bg-steel/10 dark:bg-white/10 border-steel dark:border-gray-600 text-charcoal dark:text-white font-normal' 
                : 'text-steel dark:text-gray-400 hover:text-brand-hover hover:border-brand-hover/30 dark:hover:border-brand-hover/30'}
            `}
          >
            {item.icon}
            <span className="font-sans truncate">{item.label}</span>
          </div>
        ))}

        {/* Dynamic Collections List */}
        <div className="pt-4 pb-2 px-2">
          <span className="text-[10px] font-normal tracking-widest text-steel dark:text-gray-600 font-sans uppercase">Collections</span>
        </div>
        {collections.map((collection) => (
          <div 
            key={collection.id}
            className="flex items-center gap-3 px-3 py-1.5 text-xs text-steel dark:text-gray-400 hover:text-brand-hover cursor-pointer transition-all border border-transparent hover:bg-steel/5 dark:hover:bg-white/5"
          >
            <LayoutGrid size={12} />
            <span className="font-sans truncate">{collection.title}</span>
            <span className="ml-auto text-[10px] opacity-50">{collection.items.length}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;

