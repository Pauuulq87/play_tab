import React, { useState } from 'react';
import { X, HelpCircle, Download, Upload, Trash2 } from 'lucide-react';
import { Category } from '@/models/types';

interface CategorySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category | null;
  onUpdate: (category: Category) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

const CategorySettingsModal: React.FC<CategorySettingsModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onUpdate,
  onDelete
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name);
    }
  }, [selectedCategory]);

  if (!isOpen || !selectedCategory) return null;

  const handleSaveName = async () => {
    if (!categoryName.trim() || categoryName === selectedCategory.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await onUpdate({ ...selectedCategory, name: categoryName.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update category name:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(selectedCategory.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="w-[700px] bg-paper dark:bg-[#3b3e54] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex max-h-[90vh]">
        
        {/* Left Sidebar */}
        <div className="w-[200px] border-r border-steel dark:border-gray-600 p-4 space-y-2 bg-steel/5 dark:bg-black/20">
          <div className="px-3 py-2 text-sm font-medium text-brand-hover bg-brand-hover/10 border-l-2 border-brand-hover">
            偏好設定
          </div>
          <div className="px-3 py-2 text-sm text-steel dark:text-gray-500 hover:text-charcoal dark:hover:text-gray-300 cursor-not-allowed opacity-50">
            成員
          </div>
          <div className="px-3 py-2 text-sm text-steel dark:text-gray-500 hover:text-charcoal dark:hover:text-gray-300 cursor-not-allowed opacity-50">
            訂閱
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-steel dark:border-gray-600">
            <h2 className="text-xl font-sans text-charcoal dark:text-white font-normal">
              {selectedCategory.name} 偏好設定
            </h2>
            <button onClick={onClose} className="text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
            
            {/* Logo Section */}
            <div>
              <label className="text-sm font-medium text-charcoal dark:text-gray-300 mb-2 block">
                圖示
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  {selectedCategory.name.substring(0, 2).toUpperCase()}
                </div>
                <button className="text-sm text-brand-hover hover:underline flex items-center gap-2">
                  變更
                  <HelpCircle size={14} />
                </button>
              </div>
            </div>

            {/* Organization Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-charcoal dark:text-gray-300">
                  分類名稱
                </label>
                {!isEditingName ? (
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="text-sm text-brand-hover hover:underline"
                  >
                    編輯
                  </button>
                ) : (
                  <button 
                    onClick={handleSaveName}
                    className="text-sm text-brand-hover hover:underline"
                  >
                    儲存
                  </button>
                )}
              </div>
              {isEditingName ? (
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="w-full text-sm text-charcoal dark:text-gray-300 bg-white dark:bg-[#2D3042] px-3 py-2 border border-brand-hover dark:border-brand-hover focus:outline-none"
                  autoFocus
                />
              ) : (
                <div className="text-sm text-charcoal dark:text-gray-300 bg-steel/5 dark:bg-black/20 px-3 py-2 border border-steel dark:border-gray-600">
                  {selectedCategory.name}
                </div>
              )}
            </div>

            {/* Theme */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-charcoal dark:text-gray-300">
                  主題
                </label>
                <button className="text-sm text-brand-hover hover:underline">
                  變更
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-charcoal dark:text-gray-300">
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <span>自訂顏色</span>
              </div>
            </div>

            {/* Export Data */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-charcoal dark:text-gray-300">匯出資料</h3>
                  <p className="text-xs text-steel dark:text-gray-500 mt-1">
                    下載此分類的收藏集與已儲存分頁的備份。
                  </p>
                </div>
                <button className="text-sm text-brand-hover hover:underline flex items-center gap-1">
                  <Download size={14} />
                  匯出
                </button>
              </div>
            </div>

            {/* Import */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-charcoal dark:text-gray-300">匯入</h3>
                  <p className="text-xs text-steel dark:text-gray-500 mt-1">
                    將資料上傳至此分類。
                  </p>
                </div>
                <label className="text-sm text-brand-hover hover:underline cursor-pointer flex items-center gap-1">
                  <Upload size={14} />
                  匯入
                  <input type="file" accept=".json" className="hidden" />
                </label>
              </div>
            </div>

            {/* Delete Organization */}
            <div className="pt-4 border-t border-steel dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium text-charcoal dark:text-gray-300">刪除分類</h3>
                  <p className="text-xs text-steel dark:text-gray-500 mt-1">
                    一旦刪除該分類，將無法復原。此分類下的所有空間和收藏集也會被刪除。
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  刪除分類
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-steel dark:border-gray-600 p-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-hover text-white text-sm hover:opacity-90 transition-opacity uppercase tracking-wider"
            >
              關閉
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="text-center">
              <Trash2 size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">
                確認刪除分類？
              </h3>
              <p className="text-sm text-steel dark:text-gray-400 mb-4">
                此操作無法復原。您確定要永久刪除「{selectedCategory.name}」分類及其所有空間和收藏集嗎？
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-charcoal dark:text-white rounded border border-steel dark:border-gray-600 hover:bg-steel/20 dark:hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  確認刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySettingsModal;

