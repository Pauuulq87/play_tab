import React from 'react';
import { X, ImageIcon } from 'lucide-react';

interface ImageSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    isLoading: boolean;
    onSelect: (imageUrl: string) => void;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
    isOpen,
    onClose,
    images,
    isLoading,
    onSelect,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col border border-steel/20 dark:border-gray-700">
                {/* Header */}
                <div className="px-6 py-4 border-b border-steel/10 dark:border-gray-800 flex items-center justify-between bg-steel/5 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                        <ImageIcon size={18} className="text-brand-hover" />
                        <h3 className="text-base font-medium text-charcoal dark:text-white">選擇預覽圖片</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-10 h-10 border-4 border-brand-hover/20 border-t-brand-hover rounded-full animate-spin"></div>
                            <p className="text-sm text-steel dark:text-gray-400 text-animate-pulse">正在抓取網頁圖片...</p>
                        </div>
                    ) : images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelect(img)}
                                    className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-hover transition-all active:scale-95 bg-steel/5 dark:bg-gray-800/50"
                                    title={img}
                                >
                                    <img
                                        src={img}
                                        alt={`Option ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                        onError={(e) => {
                                            e.currentTarget.parentElement?.classList.add('hidden');
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-brand-hover/0 group-hover:bg-brand-hover/10 transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-steel/5 dark:bg-gray-800/30 rounded-xl border border-dashed border-steel/30 dark:border-gray-700">
                            <span className="text-3xl mb-3 opacity-50">🖼️</span>
                            <p className="text-charcoal dark:text-white font-medium">N/A</p>
                            <p className="text-xs text-steel dark:text-gray-500 mt-1">無法在該網址中找到可用圖片</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-steel/10 dark:border-gray-800 flex justify-end bg-steel/5 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm text-steel dark:text-gray-400 hover:text-charcoal dark:hover:text-white transition-colors"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageSelectionModal;
