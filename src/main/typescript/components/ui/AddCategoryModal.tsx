import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORY_COLORS } from '../../../resources/config/colors';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, color: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0].hex);

  const handleConfirm = () => {
    if (!name.trim()) {
      alert('請輸入分類名稱');
      return;
    }
    onConfirm(name.trim(), selectedColor);
    setName('');
    setSelectedColor(CATEGORY_COLORS[0].hex);
  };

  const handleCancel = () => {
    setName('');
    setSelectedColor(CATEGORY_COLORS[0].hex);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="w-[400px] bg-paper dark:bg-[#3b3e54] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative border border-steel dark:border-[#4A5568]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-steel dark:border-gray-600">
          <h2 className="text-xl font-sans text-charcoal dark:text-white font-normal">新增分類</h2>
          <button onClick={handleCancel} className="text-steel dark:text-gray-400 hover:text-brand-hover transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 font-sans">
          {/* Step 1: Name */}
          <div>
            <label className="text-sm font-medium text-charcoal dark:text-gray-300 mb-2 block">
              步驟 1：命名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入分類名稱..."
              className="w-full bg-white dark:bg-[#2D3042] border border-steel dark:border-gray-600 px-3 py-2 text-sm text-charcoal dark:text-white focus:outline-none focus:border-brand-hover transition-colors"
              autoFocus
            />
          </div>

          {/* Step 2: Color */}
          <div>
            <label className="text-sm font-medium text-charcoal dark:text-gray-300 mb-3 block">
              步驟 2：選擇顏色
            </label>
            <div className="grid grid-cols-5 gap-3">
              {CATEGORY_COLORS.map((color) => (
                <div
                  key={color.id}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`w-12 h-12 rounded-full cursor-pointer transition-all flex items-center justify-center ${
                    selectedColor === color.hex
                      ? 'ring-2 ring-brand-hover ring-offset-2 ring-offset-paper dark:ring-offset-[#3b3e54] scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColor === color.hex && (
                    <Check size={20} className="text-white" strokeWidth={3} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-steel dark:border-gray-600">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-steel dark:border-gray-600 text-steel dark:text-gray-300 text-sm hover:bg-steel/10 dark:hover:bg-white/10 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-brand-hover text-white text-sm hover:opacity-90 transition-opacity"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;

