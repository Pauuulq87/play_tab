import { CollectionGroup, UserSettings } from '@/models/types';

const ensureChromeStorage = (): typeof chrome.storage => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    throw new Error('chrome.storage is unavailable in this environment');
  }
  return chrome.storage;
};

const COLLECTIONS_KEY = 'collections';
const SETTINGS_KEY = 'settings';

export const getCollections = async (): Promise<CollectionGroup[]> => {
  const storageApi = ensureChromeStorage();
  const result = await storageApi.local.get(COLLECTIONS_KEY);
  return (result[COLLECTIONS_KEY] as CollectionGroup[]) ?? [];
};

export const saveCollections = async (collections: CollectionGroup[]): Promise<void> => {
  const storageApi = ensureChromeStorage();
  await storageApi.local.set({ [COLLECTIONS_KEY]: collections });
};

export const getUserSettings = async (defaults?: UserSettings): Promise<UserSettings | undefined> => {
  const storageApi = ensureChromeStorage();
  const result = await storageApi.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY] as UserSettings | undefined;
  return stored ?? defaults;
};

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  const storageApi = ensureChromeStorage();
  await storageApi.local.set({ [SETTINGS_KEY]: settings });
};

