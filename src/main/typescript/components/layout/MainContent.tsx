import React from 'react';
import { Settings, GripVertical, Tag, LayoutGrid, Plus, ChevronDown, MonitorPlay, FileText, Sun, Moon } from 'lucide-react';
import { MOCK_COLLECTIONS } from '../../../resources/config/constants';

interface MainContentProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <main className="flex-1 flex flex-col h-screen bg-paper dark:bg-dark-bg overflow-hidden transition-colors duration-200">
      {/* Header */}
      <header className="h-16 border-b border-steel dark:border-gray-700 flex items-center justify-between px-6 bg-paper dark:bg-dark-bg shrink-0 transition-colors duration-200">
        <div className="flex items-baseline gap-4">
          <h1 className="font-sans text-2xl font-normal text-charcoal dark:text-white">我的收藏 (My Collections)</h1>
          <span className="font-sans text-xs text-steel dark:text-gray-500">| 10 個收藏</span>
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
          <button className="text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-12 border-b border-steel dark:border-gray-700 flex items-center justify-between px-6 bg-paper/50 dark:bg-dark-bg/95 backdrop-blur-sm shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
            <GripVertical size={14} />
            <span>拖曳排序</span>
            <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
            <Tag size={14} />
            <span>標籤篩選</span>
            <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-2 text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
            <LayoutGrid size={14} />
            <span>檢視</span>
            <ChevronDown size={12} />
          </button>
          <div className="w-px h-4 bg-steel/30 dark:bg-gray-700 mx-2"></div>
          <button className="text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover uppercase tracking-wider transition-colors">展開</button>
          <button className="text-xs font-sans text-steel dark:text-gray-400 hover:text-brand-hover uppercase tracking-wider transition-colors">折疊</button>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-steel dark:border-gray-500 bg-steel dark:bg-gray-700 text-white text-xs font-normal uppercase hover:bg-brand-hover hover:border-brand-hover transition-colors">
          <Plus size={14} strokeWidth={3} />
          新增收藏
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F4F4F4] dark:bg-[#121212] transition-colors duration-200">
        {MOCK_COLLECTIONS.map((collection) => (
          <div key={collection.id} className="group">
            {/* Collection Header */}
            <div className="flex items-center gap-2 mb-4 cursor-pointer hover:text-brand-hover transition-colors group">
              <h2 className="font-sans text-xl font-normal text-charcoal dark:text-gray-100 group-hover:text-brand-hover transition-colors">{collection.title}</h2>
              <ChevronDown size={20} className="text-steel dark:text-gray-500 group-hover:text-brand-hover transition-colors" />
            </div>

            {/* Collection Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {collection.items.length > 0 ? (
                collection.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="
                      bg-white dark:bg-[#1E1E1E] border border-steel dark:border-gray-700 p-4 h-32 flex flex-col justify-between 
                      hover:shadow-[4px_4px_0px_0px_rgba(230,182,68,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(230,182,68,0.5)] 
                      hover:border-brand-hover transition-all cursor-pointer relative group/item
                    "
                  >
                    <div className="flex items-start gap-3">
                      {/* Dynamic Icon based on content */}
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-paper dark:bg-gray-800 border border-steel dark:border-gray-600 text-steel dark:text-gray-400 group-hover/item:border-brand-hover group-hover/item:text-brand-hover transition-colors">
                        {item.url?.includes('youtube') ? <MonitorPlay size={16} /> : 
                         item.url?.includes('thales') ? <FileText size={16} /> :
                         <div className="font-sans font-thin text-xs">W</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans text-sm font-normal text-charcoal dark:text-gray-200 line-clamp-2 leading-tight mb-1 group-hover/item:text-brand-hover transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-dashed border-steel/30 dark:border-gray-700">
                       <p className="text-[10px] font-sans font-thin text-steel dark:text-gray-500 truncate group-hover/item:text-brand-hover transition-colors">{item.url}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 border border-dashed border-steel/40 dark:border-gray-700 flex items-center justify-center text-steel dark:text-gray-600 text-sm font-sans italic bg-paper dark:bg-transparent">
                  此收藏集尚無項目
                </div>
              )}
            </div>
            {/* Divider between collections */}
            <div className="h-px w-full bg-steel/20 dark:bg-gray-800 mt-8"></div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MainContent;

