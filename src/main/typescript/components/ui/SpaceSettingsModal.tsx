import React, { useState, useEffect } from 'react';
import { X, Settings, Search } from 'lucide-react';
import { Space } from '@/models/types';

interface SpaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpace: Space | null;
  onSaveSpaceName: (spaceId: string, name: string) => Promise<void>;
  onDeleteSpace: (spaceId: string) => Promise<void>;
}

const SpaceSettingsModal: React.FC<SpaceSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedSpace,
  onSaveSpaceName,
  onDeleteSpace
}) => {
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (selectedSpace) {
      setEditedName(selectedSpace.name);
    }
  }, [selectedSpace]);

  if (!isOpen || !selectedSpace) return null;

  const handleSaveName = async () => {
    if (editedName.trim() && editedName !== selectedSpace.name) {
      try {
        await onSaveSpaceName(selectedSpace.id, editedName.trim());
        onClose();
      } catch (error) {
        console.error('Failed to save space name:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm(`確定要刪除空間「${selectedSpace.name}」嗎？此操作無法復原。`)) {
      try {
        await onDeleteSpace(selectedSpace.id);
      } catch (error) {
        console.error('Failed to delete space:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-steel dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-sans font-normal text-charcoal dark:text-white">
            編輯空間：{selectedSpace.name}
          </h2>
          <button
            onClick={onClose}
            className="text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <>
              {/* Space Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
                    空間名稱
                  </label>
                  <button
                    onClick={handleSaveName}
                    className="text-xs text-brand-hover hover:underline"
                  >
                    儲存
                  </button>
                </div>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 border border-steel dark:border-gray-600 rounded bg-transparent text-charcoal dark:text-white focus:outline-none focus:border-brand-hover transition-colors"
                  placeholder="輸入空間名稱"
                />
              </div>

              {/* Search Duplicates */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
                    搜尋重複項目
                  </label>
                  <button className="text-xs text-brand-hover hover:underline opacity-50 cursor-not-allowed">
                    升級
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border border-steel dark:border-gray-600 rounded bg-steel/5 dark:bg-gray-800 cursor-not-allowed opacity-60">
                  <Search size={16} className="text-steel dark:text-gray-400" />
                  <span className="text-sm text-steel dark:text-gray-400">尋找並移除重複的分頁</span>
                </div>
                <p className="text-xs text-steel dark:text-gray-500">
                  清理此空間中重複的分頁項目。
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-steel dark:border-gray-700"></div>

              {/* Delete Space */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
                    刪除空間
                  </label>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline"
                  >
                    刪除
                  </button>
                </div>
                <p className="text-xs text-steel dark:text-gray-500">
                  刪除空間後，所有收藏集與項目將永久移除，此操作無法復原。
                </p>
              </div>
            </>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-steel dark:border-gray-700 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-sans text-brand-hover hover:text-brand-hover/80 transition-colors uppercase tracking-wider"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceSettingsModal;

