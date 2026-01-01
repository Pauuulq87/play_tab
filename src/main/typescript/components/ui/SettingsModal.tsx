import React, { useState, useEffect } from 'react';
import { X, Info, Rocket, LogIn, Download, Upload, Trash2, RefreshCw } from 'lucide-react';
import { UserSettings } from '@/models/types';
import { getUserSettings, saveUserSettings } from '@/services/storageService';
import { signIn, signOut, getCurrentUser, isAuthenticated, performBidirectionalSync } from '@/services/supabaseService';
import { downloadJSON, importFromFile, mergeCollections, MergeStrategy } from '@/utils/exportImport';
import { getCollections, saveCollections } from '@/services/storageService';
import { closeDuplicateTabs } from '@/services/tabService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSettingsChange: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  toggleTheme,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      checkAuth();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    const stored = await getUserSettings();
    if (stored) setSettings(stored);
  };

  const checkAuth = async () => {
    const authStatus = await isAuthenticated();
    setIsAuth(authStatus);
    if (authStatus) {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    }
  };

  const handleToggle = async (key: keyof UserSettings) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    await saveUserSettings(newSettings);
    
    if (key === 'isDarkMode') {
      toggleTheme();
    }
    onSettingsChange();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      await checkAuth();
      setMessage('登入成功');
    } catch (error) {
      setMessage(`登入失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuth(false);
    setUser(null);
    setMessage('已登出');
  };

  const handleSync = async () => {
    if (!isAuth) {
      setMessage('請先登入以進行同步');
      return;
    }
    setIsSyncing(true);
    setMessage('同步中...');
    try {
      const collections = await getCollections();
      const result = await performBidirectionalSync(collections, settings || undefined);
      if (result.success) {
        setMessage('同步完成');
        onSettingsChange();
      } else {
        setMessage(`同步失敗: ${result.error}`);
      }
    } catch (error) {
      setMessage('同步發生錯誤');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExport = async () => {
    const collections = await getCollections();
    downloadJSON(collections, settings || undefined);
    setMessage('已匯出設定檔');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromFile(file);
      const existing = await getCollections();
      const merged = mergeCollections(existing, data.collections, MergeStrategy.MERGE);
      
      await saveCollections(merged);
      if (data.settings) {
        await saveUserSettings(data.settings);
      }
      
      onSettingsChange();
      setMessage('匯入成功');
    } catch (error) {
      setMessage('匯入失敗');
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      const count = await closeDuplicateTabs();
      setMessage(`已關閉 ${count} 個重複分頁`);
    } catch (error) {
      setMessage('清理失敗');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="w-[480px] bg-[#3b3e54] text-[#d1d5db] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh] overflow-y-auto rounded-none border border-[#4A5568]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
            <h2 className="text-xl font-sans text-white font-normal tracking-wide">
              {isAuth ? '個人帳戶' : '登入'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-hover transition-colors">
                <X size={24} strokeWidth={1.5} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-8 font-sans">
            {/* Auth Area */}
            {isAuth ? (
              <div className="space-y-1 relative">
                  <div className="flex justify-between items-center">
                      <span className="text-white font-normal text-base">{user?.email?.split('@')[0] || '使用者'}</span>
                      <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-brand-hover transition-colors">登出</button>
                  </div>
                  <div className="text-sm text-gray-400 pb-2">{user?.email}</div>
                  <div className="flex flex-col gap-1.5 text-sm text-gray-300">
                      <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-2 text-left hover:text-brand-hover w-fit transition-colors">
                        <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                        雲端同步 (Cloud Sync)
                      </button>
                  </div>
                  <div className="border-b border-gray-600 mt-6"></div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  type="email" 
                  placeholder="電子郵件" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#2D3042] border border-gray-600 p-2 text-sm focus:outline-none focus:border-brand-hover"
                />
                <input 
                  type="password" 
                  placeholder="密碼" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2D3042] border border-gray-600 p-2 text-sm focus:outline-none focus:border-brand-hover"
                />
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm transition-colors flex items-center justify-center gap-2">
                  <LogIn size={16} /> 登入
                </button>
                <div className="border-b border-gray-600 mt-6"></div>
              </form>
            )}

            {/* General Preferences */}
            <div>
                <h3 className="text-xs font-normal text-gray-400 uppercase tracking-widest mb-5">一般偏好設定</h3>
                <div className="space-y-4">
                    <ToggleRow 
                      label="在同一分頁開啟卡片" 
                      checked={settings?.openCardsOnSameTab}
                      onClick={() => handleToggle('openCardsOnSameTab')}
                    />
                    <ToggleRow 
                        label="深色模式 (Dark Theme)" 
                        checked={settings?.isDarkMode} 
                        onClick={() => handleToggle('isDarkMode')}
                    />
                    <ToggleRow 
                      label="自動關閉分頁" 
                      checked={settings?.autoCloseTab}
                      onClick={() => handleToggle('autoCloseTab')}
                      info 
                    />
                    <ToggleRow 
                      label="移除重複分頁" 
                      checked={settings?.removeDuplicateTabs}
                      onClick={() => handleToggle('removeDuplicateTabs')}
                      icon={<Rocket size={14} className="text-blue-400 ml-1.5 inline"/>} 
                      info 
                    />
                    <ToggleRow 
                      label="啟用快捷鍵" 
                      checked={settings?.enableShortcuts}
                      onClick={() => handleToggle('enableShortcuts')}
                      info 
                    />
                    <ToggleRow 
                      label="啟用分頁群組 (Tab Groups)" 
                      checked={settings?.enableTabGroups}
                      onClick={() => handleToggle('enableTabGroups')}
                      info 
                    />
                </div>
            </div>

            {/* Message Area */}
            {message && (
              <div className="bg-blue-900/30 text-blue-300 text-xs p-2 text-center animate-pulse">
                {message}
              </div>
            )}

            {/* Footer Links */}
            <div className="grid grid-cols-3 gap-8 pt-4 border-t border-gray-600">
                <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">關於</h4>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">快捷鍵說明</div>
                    <button onClick={handleCleanupDuplicates} className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors flex items-center gap-1">
                      <Trash2 size={12} /> 清理重複分頁
                    </button>
                </div>
                <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">幫助</h4>
                    <div className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors">常見問題 (FAQ)</div>
                </div>
                 <div className="space-y-3">
                    <h4 className="text-xs font-normal text-white uppercase tracking-wider">數據</h4>
                    <button onClick={handleExport} className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors flex items-center gap-1">
                      <Download size={12} /> 匯出 JSON
                    </button>
                    <label className="text-sm text-gray-400 cursor-pointer hover:text-brand-hover transition-colors flex items-center gap-1">
                      <Upload size={12} /> 匯入 JSON
                      <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
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
