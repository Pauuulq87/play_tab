import { TabItem, CollectionGroup, SidebarItem } from '../../typescript/models/types';
import { 
  Star, 
  ShoppingBag, 
  Briefcase, 
  Monitor, 
  Map, 
  BookOpen, 
  LayoutGrid
} from 'lucide-react';
import React from 'react';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'starred', label: '星標收藏 (Starred)', icon: <Star size={16} />, isSpace: true },
  { id: 'my-collections', label: '我的收藏 (My Collections)', icon: <LayoutGrid size={16} />, isSpace: true },
  { id: 'shopping', label: '購物清單', icon: <ShoppingBag size={16} />, isSpace: true },
  { id: 'work', label: '工作', icon: <Briefcase size={16} />, isSpace: true },
  { id: 'win11', label: 'Win 11 系統', icon: <Monitor size={16} />, isSpace: true },
  { id: 'map', label: '地圖', icon: <Map size={16} />, isSpace: true },
  { id: 'study', label: '學習', icon: <BookOpen size={16} />, isSpace: true },
];

export const MOCK_COLLECTIONS: CollectionGroup[] = [
  {
    id: 'c1',
    title: '孟書',
    isOpen: true,
    items: [
      { id: 't1', title: '地圖查詢-全國教保資訊網', url: 'ap.ece.moe.edu.tw' }
    ]
  },
  {
    id: 'c2',
    title: '卡片筆記',
    isOpen: true,
    items: [
      { id: 't2', title: '(245) 富習寫 | Melody - YouTube', url: 'youtube.com' }
    ]
  },
  {
    id: 'c3',
    title: '太陽能實務',
    isOpen: true,
    items: [
      { id: 't3', title: 'THALES 泰勒斯科技有限公司', url: 'thales-tech.com.tw' }
    ]
  },
  {
    id: 'c4',
    title: 'YT Ai學習相關',
    isOpen: false,
    items: []
  }
];

export const OPEN_TABS: TabItem[] = [
  { id: 'ot1', title: 'Architecture and landscape architecture tutorials' },
  { id: 'ot2', title: 'Web Design Clip | Webデザインギャラリー' },
  { id: 'ot3', title: 'TOP' },
  { id: 'ot4', title: 'I/O 3000 | Webデザインギャラリー' },
  { id: 'ot5', title: '提示詞庫 - Claude Docs' },
  { id: 'ot6', title: 'BLOG POS 0901 - 管理網站 - 資訊主頁' },
  { id: 'ot7', title: 'Workflow runs · Pauuulq87/BLOG_POS_0901' },
  { id: 'ot8', title: 'Posts | Pauuul.OS' },
  { id: 'ot9', title: 'localhost' },
  { id: 'ot10', title: 'localhost' },
  { id: 'ot11', title: '猛建樂減重：保肌燃脂戰略指南 - NotebookLM' },
  { id: 'ot12', title: '台灣公司登記住家地址影響與差異 - Grok' },
  { id: 'ot13', title: 'Google Gemini' },
  { id: 'ot14', title: 'Gemini - 直接與 Google AI 互動' },
  { id: 'ot15', title: 'Railway' },
  { id: 'ot16', title: 'Replicate - Run AI with an API' },
];

