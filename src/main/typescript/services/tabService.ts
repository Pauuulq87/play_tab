import { TabItem } from '@/models/types';

const ensureChromeTabs = (): typeof chrome.tabs => {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    throw new Error('chrome.tabs is unavailable in this environment');
  }
  return chrome.tabs;
};

const mapToTabItem = (tab: chrome.tabs.Tab): TabItem => ({
  id: tab.id?.toString() ?? '',
  title: tab.title ?? '',
  url: tab.url,
  favicon: tab.favIconUrl,
});

// ==================== 分頁查詢 ====================

export const queryCurrentWindowTabs = async (): Promise<TabItem[]> => {
  const tabsApi = ensureChromeTabs();
  const tabs = await tabsApi.query({ currentWindow: true });
  return tabs.map(mapToTabItem);
};

export const queryAllTabs = async (): Promise<TabItem[]> => {
  const tabsApi = ensureChromeTabs();
  const tabs = await tabsApi.query({});
  return tabs.map(mapToTabItem);
};

export const getCurrentTab = async (): Promise<TabItem | undefined> => {
  const tabsApi = ensureChromeTabs();
  const tabs = await tabsApi.query({ active: true, currentWindow: true });
  return tabs.length > 0 ? mapToTabItem(tabs[0]) : undefined;
};

// ==================== 分頁操作 ====================

export const activateTab = async (tabId: number): Promise<void> => {
  const tabsApi = ensureChromeTabs();
  await tabsApi.update(tabId, { active: true });
};

export const closeTab = async (tabId: number): Promise<void> => {
  const tabsApi = ensureChromeTabs();
  await tabsApi.remove(tabId);
};

export const closeTabs = async (tabIds: number[]): Promise<void> => {
  const tabsApi = ensureChromeTabs();
  if (!tabIds.length) return;
  await tabsApi.remove(tabIds);
};

export const closeCurrentTab = async (): Promise<void> => {
  const currentTab = await getCurrentTab();
  if (currentTab && currentTab.id) {
    await closeTab(parseInt(currentTab.id));
  }
};

// ==================== 分頁轉存 ====================

export const createTabItemFromTab = (tab: chrome.tabs.Tab): TabItem => {
  return mapToTabItem(tab);
};

export const createTabItemFromCurrent = async (): Promise<TabItem | undefined> => {
  return await getCurrentTab();
};

// ==================== 重複偵測 ====================

export const findDuplicateTabs = async (): Promise<Map<string, TabItem[]>> => {
  const tabs = await queryCurrentWindowTabs();
  const urlMap = new Map<string, TabItem[]>();
  
  tabs.forEach(tab => {
    if (!tab.url) return;
    
    const existing = urlMap.get(tab.url);
    if (existing) {
      existing.push(tab);
    } else {
      urlMap.set(tab.url, [tab]);
    }
  });
  
  // 只保留有重複的項目
  const duplicates = new Map<string, TabItem[]>();
  urlMap.forEach((items, url) => {
    if (items.length > 1) {
      duplicates.set(url, items);
    }
  });
  
  return duplicates;
};

export const closeDuplicateTabs = async (): Promise<number> => {
  const duplicates = await findDuplicateTabs();
  let closedCount = 0;
  
  for (const [, items] of duplicates) {
    // 保留第一個，關閉其他的
    const tabsToClose = items.slice(1).map(item => parseInt(item.id));
    await closeTabs(tabsToClose);
    closedCount += tabsToClose.length;
  }
  
  return closedCount;
};

// ==================== Tab Groups 支援 ====================

export interface TabGroup {
  id: number;
  title?: string;
  color: chrome.tabGroups.ColorEnum;
  collapsed: boolean;
}

const ensureChromeTabGroups = (): typeof chrome.tabGroups => {
  if (typeof chrome === 'undefined' || !chrome.tabGroups) {
    throw new Error('chrome.tabGroups is unavailable in this environment');
  }
  return chrome.tabGroups;
};

export const createTabGroup = async (
  tabIds: number[],
  title?: string,
  color?: chrome.tabGroups.ColorEnum
): Promise<number> => {
  const tabsApi = ensureChromeTabs();
  const groupId = await tabsApi.group({ tabIds });
  
  if (title || color) {
    const tabGroupsApi = ensureChromeTabGroups();
    await tabGroupsApi.update(groupId, {
      title: title,
      color: color || 'grey',
    });
  }
  
  return groupId;
};

export const getTabGroups = async (): Promise<TabGroup[]> => {
  try {
    const tabGroupsApi = ensureChromeTabGroups();
    const groups = await tabGroupsApi.query({});
    
    return groups.map(group => ({
      id: group.id,
      title: group.title,
      color: group.color,
      collapsed: group.collapsed,
    }));
  } catch (error) {
    console.warn('Tab Groups not available:', error);
    return [];
  }
};

export const updateTabGroup = async (
  groupId: number,
  updates: { title?: string; color?: chrome.tabGroups.ColorEnum; collapsed?: boolean }
): Promise<void> => {
  const tabGroupsApi = ensureChromeTabGroups();
  await tabGroupsApi.update(groupId, updates);
};

export const ungroupTabs = async (tabIds: number[]): Promise<void> => {
  const tabsApi = ensureChromeTabs();
  await tabsApi.ungroup(tabIds);
};

export const getTabsInGroup = async (groupId: number): Promise<TabItem[]> => {
  const tabsApi = ensureChromeTabs();
  const tabs = await tabsApi.query({ groupId });
  return tabs.map(mapToTabItem);
};

