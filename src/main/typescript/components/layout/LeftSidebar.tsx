import React from 'react';
import { Search, Link as LinkIcon, ArrowRight, Plus, ArrowDownAZ, LogOut } from 'lucide-react';
import { SIDEBAR_ITEMS } from '../../../resources/config/constants';

interface LeftSidebarProps {
  onOpenSettings: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onOpenSettings }) => {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col border-r border-steel dark:border-gray-700 h-screen bg-paper dark:bg-dark-surface text-charcoal dark:text-gray-200 select-none transition-colors duration-200">
      {/* User Header */}
      <div className="p-4 border-b border-steel dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-charcoal dark:bg-gray-700 text-paper flex items-center justify-center font-serif text-sm border border-charcoal dark:border-gray-600">
            PA
          </div>
          <span className="font-serif font-bold text-lg dark:text-white">Paul</span>
        </div>
        <div className="cursor-pointer hover:bg-steel/10 dark:hover:bg-white/10 p-1">
          <LogOut size={16} className="text-steel dark:text-gray-400" />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-steel dark:border-gray-700">
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-steel dark:text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent border border-steel dark:border-gray-600 py-2 pl-9 pr-2 text-sm focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-charcoal dark:focus:border-gray-400 transition-colors font-sans placeholder-steel-light dark:placeholder-gray-500 dark:text-white"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 border-b border-steel dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-2 text-sm text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white cursor-pointer group">
          <LinkIcon size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">To / Links</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white cursor-pointer group">
          <ArrowRight size={16} className="group-hover:stroke-[2px]" />
          <span className="font-sans">Next (1)</span>
        </div>
      </div>

      {/* Spaces Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-steel dark:text-gray-500 font-serif uppercase">Spaces</span>
        <div className="flex gap-2 text-steel dark:text-gray-400">
          <ArrowDownAZ size={14} className="cursor-pointer hover:text-charcoal dark:hover:text-white" />
          <Plus size={14} className="cursor-pointer hover:text-charcoal dark:hover:text-white" />
        </div>
      </div>

      {/* Spaces List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-1 pb-4">
        {SIDEBAR_ITEMS.map((item) => (
          <div 
            key={item.id}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-all border border-transparent
              ${item.id === 'my-collections' 
                ? 'bg-steel/10 dark:bg-white/10 border-steel dark:border-gray-600 text-charcoal dark:text-white font-medium' 
                : 'text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white hover:border-steel/30 dark:hover:border-gray-600'}
            `}
          >
            {item.icon}
            <span className="font-sans truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-steel dark:border-gray-700 bg-paper dark:bg-dark-surface mt-auto">
        <div className="grid grid-cols-5 divide-x divide-steel dark:divide-gray-700">
          {[
            { icon: '?', label: 'FAQ' },
            { icon: '🔔', label: 'Updates' },
            { icon: '👤', label: 'Account', onClick: onOpenSettings },
            { icon: '👥', label: 'Invite' },
            { icon: '⚙️', label: 'Settings' }
          ].map((item, idx) => (
             <div 
               key={idx} 
               onClick={item.onClick}
               className="flex flex-col items-center justify-center p-3 hover:bg-steel/10 dark:hover:bg-white/10 cursor-pointer group h-16"
             >
               <div className="text-steel dark:text-gray-400 group-hover:text-charcoal dark:group-hover:text-white mb-1 text-lg">{item.icon}</div>
             </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;

