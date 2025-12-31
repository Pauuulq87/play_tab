import React from 'react';
import { X, Info, Rocket } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode, toggleTheme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-[2px]">
      {/* Modal Container - Always Dark for Settings as per screenshot style */}
      <div className="w-[480px] bg-[#3b3e54] text-[#d1d5db] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh] overflow-y-auto rounded-none border border-[#4A5568]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
            <h2 className="text-xl font-sans text-white font-normal tracking-wide">Account</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-hover transition-colors">
                <X size={24} strokeWidth={1.5} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-8 font-sans">
            {/* User Info */}
            <div className="space-y-1 relative">
                <div className="flex justify-between items-center">
                    <span className="text-white font-normal text-base">Paul</span>
                    <button className="text-sm text-gray-300 hover:text-brand-hover transition-colors">Log out</button>
                </div>
                <div className="text-sm text-gray-400 pb-2">paul.1q87@gmail.com</div>
                <div className="flex flex-col gap-1.5 text-sm text-gray-300">
                    <button className="text-left hover:text-brand-hover w-fit transition-colors">Edit account</button>
                    <button className="text-left hover:text-brand-hover w-fit transition-colors">Change Password</button>
                </div>
                <div className="border-b border-gray-600 mt-6"></div>
            </div>

            {/* General Preferences */}
            <div>
                <h3 className="text-xs font-normal text-gray-400 uppercase tracking-widest mb-5">General Preferences</h3>
                <div className="space-y-4">
                    <ToggleRow label="Open cards on the same tab" />
                    <ToggleRow 
                        label="Dark Theme" 
                        checked={isDarkMode} 
                        onClick={toggleTheme}
                    />
                    <ToggleRow label="Auto theme with OS" />
                    <ToggleRow label="Automatically close tabs" checked info />
                    <ToggleRow label="Remove duplicate tabs" icon={<Rocket size={14} className="text-blue-400 ml-1.5 inline"/>} info />
                    <ToggleRow label="Enable Shortcuts" checked info />
                    <ToggleRow label="Enable Tab Groups" info />
                </div>
            </div>

            {/* Banner */}
            <div className="bg-[#2D3042] px-4 py-3 rounded-none border border-transparent flex items-center justify-center text-center">
                <span className="text-sm text-gray-300">
                    不喜歡新分頁的 Play Tab？試試 <span className="text-blue-400 cursor-pointer hover:underline hover:text-brand-hover transition-colors">Play Tab Mini</span>
                </span>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-3 gap-8 pt-4 border-t border-gray-600">
                <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">About</h4>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">Keyboard shortcuts</div>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">Submit feedback</div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">Help</h4>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">FAQ</div>
                </div>
                 <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">Data</h4>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">Export Account</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleRowProps {
    label: string;
    checked?: boolean;
    info?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked = false, info = false, icon = null, onClick }) => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
        <div className={`w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${checked ? 'bg-blue-500' : 'bg-gray-600 group-hover:bg-brand-hover'}`}>
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 shadow-sm ${checked ? 'translate-x-5' : 'translate-x-1'}`}></div>
        </div>
        <div className="flex items-center text-sm text-gray-300 group-hover:text-brand-hover transition-colors select-none">
            {label}
            {info && <Info size={14} className="ml-2 text-gray-500 group-hover:text-brand-hover" />}
            {icon}
        </div>
    </div>
);

export default SettingsModal;

