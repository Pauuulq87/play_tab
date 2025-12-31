import React from 'react';

export interface TabItem {
  id: string;
  title: string;
  url?: string;
  favicon?: string;
}

export interface CollectionGroup {
  id: string;
  title: string;
  items: TabItem[];
  isOpen: boolean;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isSpace?: boolean;
}

