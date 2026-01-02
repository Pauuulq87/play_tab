import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    url?: string;
    favicon?: string;
    description?: string;
    createdAt?: string;
  };
  collectionId: string;
  onSave: (collectionId: string, itemId: string, updates: { title: string; url: string; description: string }) => Promise<void>;
  onDelete: (collectionId: string, itemId: string) => Promise<void>;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  item,
  collectionId,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [url, setUrl] = useState(item.url || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(item.title);
      setDescription(item.description || '');
      setUrl(item.url || '');
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
      alert('標題和網址不能為空');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(collectionId, item.id, { 
        title: title.trim(), 
        url: url.trim(),
        description: description.trim()
      });
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除此項目嗎？')) return;

    try {
      await onDelete(collectionId, item.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('刪除失敗');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-steel dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.favicon && (
              <img src={item.favicon} alt="" className="w-6 h-6 rounded" onError={(e) => e.currentTarget.style.display = 'none'} />
            )}
            <h2 className="text-lg font-sans font-normal text-charcoal dark:text-white">編輯項目</h2>
          </div>
          <button
            onClick={onClose}
            className="text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
              標題
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-steel dark:border-gray-600 rounded bg-transparent text-charcoal dark:text-white focus:outline-none focus:border-brand-hover transition-colors"
              placeholder="輸入標題"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
              描述
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-steel dark:border-gray-600 rounded bg-transparent text-charcoal dark:text-white focus:outline-none focus:border-brand-hover transition-colors"
              placeholder="輸入描述"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
              網址
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-steel dark:border-gray-600 rounded bg-transparent text-charcoal dark:text-white focus:outline-none focus:border-brand-hover transition-colors"
              placeholder="https://example.com"
            />
            {url && (
              <p className="text-xs text-steel dark:text-gray-500 break-all">
                完整網址: {url}
              </p>
            )}
          </div>

          {/* Created Date */}
          {item.createdAt && (
            <div className="space-y-2">
              <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
                加入日期
              </label>
              <div className="px-3 py-2 border border-steel/50 dark:border-gray-700 rounded bg-steel/5 dark:bg-gray-800/50 text-charcoal dark:text-gray-400 text-sm">
                {new Date(item.createdAt).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\//g, '-')}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-steel dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
            刪除
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm bg-brand-hover hover:bg-brand-hover/90 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '儲存中...' : '完成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;

