import React from 'react';

export interface TabItem {
  id: string;
  title: string;
  url?: string;
  favicon?: string;
  windowId?: number;
  description?: string;
  createdAt?: string; // ISO 8601 格式
  previewImageAutoUrl?: string; // 由 URL 來源自動抓取（og:image / twitter:image）
  previewImageUserDataUrl?: string; // 使用者上傳後裁切成固定比例的 data URL
}

export interface WindowGroup {
  windowId: number;
  tabs: TabItem[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Space {
  id: string;
  name: string;
  categoryId: string;
  order: number;
}

export interface CollectionGroup {
  id: string;
  title: string;
  spaceId: string;
  items: TabItem[];
  isOpen: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isSpace?: boolean;
}

export interface UserSettings {
  isDarkMode: boolean;
  openCardsOnSameTab: boolean;
  autoCloseTab: boolean;
  removeDuplicateTabs: boolean;
  enableShortcuts: boolean;
  enableTabGroups: boolean;
}
