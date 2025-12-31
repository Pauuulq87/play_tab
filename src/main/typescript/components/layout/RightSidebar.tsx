import React from 'react';
import { Sidebar, Download, X, ChevronDown } from 'lucide-react';
import { OPEN_TABS } from '../../../resources/config/constants';

const RightSidebar: React.FC = () => {
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
            <Download size={14} className="hover:text-brand-hover cursor-pointer transition-colors" />
            <X size={14} className="hover:text-brand-hover cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {OPEN_TABS.map((tab) => (
          <div 
            key={tab.id}
            className="
              group relative bg-steel/20 dark:bg-black/20 border border-transparent hover:border-l-4 hover:border-l-brand-hover hover:bg-steel/30 dark:hover:bg-black/40
              px-3 py-3 transition-all cursor-pointer min-h-[40px] flex items-center
            "
          >
            <span className="text-xs font-sans text-gray-300 group-hover:text-brand-hover line-clamp-2 leading-relaxed transition-colors">
              {tab.title}
            </span>
            {/* Hover Actions (Invisible by default, visible on hover) */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2">
               <X size={12} className="text-white opacity-50 hover:opacity-100 hover:text-brand-hover" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Info */}
      <div className="p-2 text-center border-t border-steel/30 dark:border-gray-700">
          <span className="text-[10px] text-steel-light font-sans font-thin">16 Tabs Open</span>
      </div>
    </aside>
  );
};

export default RightSidebar;

