import React, { useState, useEffect } from 'react';
import { X, Trash2, RefreshCw } from 'lucide-react';
import { fetchPreviewImageUrl, fetchAllPreviewImages } from '@/services/previewService';
import ImageSelectionModal from './ImageSelectionModal';

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
    previewImageAutoUrl?: string;
    previewImageUserDataUrl?: string;
  };
  collectionId: string;
  onSave: (
    collectionId: string,
    itemId: string,
    updates: {
      title: string;
      url: string;
      description: string;
      previewImageAutoUrl?: string;
      previewImageUserDataUrl?: string;
    }
  ) => Promise<void>;
  onDelete: (collectionId: string, itemId: string) => Promise<void>;
}

const cropImageToAspectDataUrl = async (
  file: File,
  aspectRatio: number,
  maxWidth: number
): Promise<string> => {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = dataUrl;
  });

  const srcW = img.naturalWidth || img.width;
  const srcH = img.naturalHeight || img.height;

  let cropW = srcW;
  let cropH = cropW / aspectRatio;
  if (cropH > srcH) {
    cropH = srcH;
    cropW = cropH * aspectRatio;
  }

  const sx = Math.max(0, Math.round((srcW - cropW) / 2));
  const sy = Math.max(0, Math.round((srcH - cropH) / 2));

  const outW = Math.min(maxWidth, Math.round(cropW));
  const outH = Math.round(outW / aspectRatio);

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(img, sx, sy, Math.round(cropW), Math.round(cropH), 0, 0, outW, outH);
  return canvas.toDataURL('image/jpeg', 0.85);
};

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
  const [previewImageAutoUrl, setPreviewImageAutoUrl] = useState(item.previewImageAutoUrl || '');
  const [previewImageUserDataUrl, setPreviewImageUserDataUrl] = useState(item.previewImageUserDataUrl || '');
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(item.title);
      setDescription(item.description || '');
      setUrl(item.url || '');
      setPreviewImageAutoUrl(item.previewImageAutoUrl || '');
      setPreviewImageUserDataUrl(item.previewImageUserDataUrl || '');
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const activePreviewUrl = previewImageUserDataUrl || previewImageAutoUrl;

  const handleUploadPreviewImage = async (file: File) => {
    try {
      const cropped = await cropImageToAspectDataUrl(file, 16 / 9, 1200);
      setPreviewImageUserDataUrl(cropped);
    } catch (error) {
      console.error('Failed to process preview image:', error);
      alert('圖片處理失敗');
    }
  };

  const handleFetchAutoPreview = async () => {
    if (!url.trim()) {
      alert('請先填寫網址');
      return;
    }

    try {
      setIsFetchingPreview(true);
      const fetched = await fetchPreviewImageUrl(url.trim());
      if (!fetched) {
        alert('未找到可用的預覽圖片（og:image / twitter:image）');
        return;
      }
      setPreviewImageAutoUrl(fetched);
    } catch (error) {
      console.error('Failed to fetch preview image:', error);
      alert('抓取預覽圖失敗');
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const handleRefetchImages = async () => {
    if (!url.trim()) {
      alert('請先填寫網址');
      return;
    }

    setIsSelectionModalOpen(true);
    setIsFetchingAll(true);
    try {
      const images = await fetchAllPreviewImages(url.trim());
      setFetchedImages(images);
    } catch (error) {
      console.error('Failed to refetch all images:', error);
      setFetchedImages([]);
    } finally {
      setIsFetchingAll(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setPreviewImageUserDataUrl(imageUrl);
    setIsSelectionModalOpen(false);
  };

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
        description: description.trim(),
        previewImageAutoUrl: previewImageAutoUrl || undefined,
        previewImageUserDataUrl: previewImageUserDataUrl || undefined
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

          {/* Preview Image */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-sans text-charcoal dark:text-white font-medium">
                預覽圖片（固定比例 16:9）
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefetchImages}
                  className="p-1 text-steel dark:text-gray-400 hover:text-brand-hover transition-colors rounded-full hover:bg-steel/10 dark:hover:bg-gray-700/50"
                  title="重新抓取圖片"
                >
                  <RefreshCw size={14} className={isFetchingAll ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={handleFetchAutoPreview}
                  disabled={isFetchingPreview}
                  className="text-xs text-steel dark:text-gray-400 hover:text-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingPreview ? '抓取中...' : '自動抓取'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadPreviewImage(file);
                  e.currentTarget.value = '';
                }}
                className="block w-full text-xs text-steel dark:text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:bg-steel/10 file:text-charcoal dark:file:bg-gray-700 dark:file:text-white hover:file:bg-brand-hover/10"
              />
              {previewImageUserDataUrl && (
                <button
                  onClick={() => setPreviewImageUserDataUrl('')}
                  className="text-xs text-steel dark:text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap"
                  title="清除自訂圖片"
                >
                  清除
                </button>
              )}
            </div>

            {activePreviewUrl ? (
              <div className="w-full border border-steel/50 dark:border-gray-700 rounded overflow-hidden bg-steel/5 dark:bg-gray-800/30">
                <div className="w-full aspect-video">
                  <img
                    src={activePreviewUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="px-3 py-2 text-[11px] text-steel dark:text-gray-500 break-all">
                  {previewImageUserDataUrl ? '來源：自訂圖片' : `來源：${previewImageAutoUrl || '自動抓取'}`}
                </div>
              </div>
            ) : (
              <div className="text-xs text-steel dark:text-gray-500">
                尚未設定預覽圖（可自動抓取或上傳）
              </div>
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

      <ImageSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        images={fetchedImages}
        isLoading={isFetchingAll}
        onSelect={handleSelectImage}
      />
    </div>
  );
};

export default EditItemModal;
