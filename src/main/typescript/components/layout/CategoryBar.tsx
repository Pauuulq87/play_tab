import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { Category } from '@/models/types';

interface CategoryBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
  onOpenSettings: () => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onOpenSettings
}) => {
  return (
    <div className="w-16 flex-shrink-0 flex flex-col border-r border-steel dark:border-gray-700 h-screen bg-charcoal dark:bg-dark-surface text-paper dark:text-gray-300">
      {/* Categories List */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
              selectedCategoryId === category.id
                ? 'ring-2 ring-brand-hover ring-offset-2 ring-offset-charcoal dark:ring-offset-dark-surface scale-110'
                : 'hover:scale-105 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: category.color }}
            title={category.name}
          >
            {category.name.substring(0, 2).toUpperCase()}
          </div>
        ))}

        {/* Add Category Button */}
        <div
          onClick={onAddCategory}
          className="mx-auto w-10 h-10 rounded-full border-2 border-dashed border-steel dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-brand-hover hover:text-brand-hover transition-all"
          title="新增分類"
        >
          <Plus size={20} />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-steel dark:border-gray-700 py-3">
        <div
          onClick={onOpenSettings}
          className="mx-auto w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-steel/20 dark:hover:bg-white/10 transition-all text-steel dark:text-gray-400 hover:text-brand-hover"
          title="組織設定"
        >
          <Settings size={18} />
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;

