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

export const queryCurrentWindowTabs = async (): Promise<TabItem[]> => {
  const tabsApi = ensureChromeTabs();
  const tabs = await tabsApi.query({ currentWindow: true });
  return tabs.map(mapToTabItem);
};

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

