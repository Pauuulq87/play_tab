import { CollectionGroup, UserSettings } from '@/models/types';

export interface ExportData {
  version: string;
  exportDate: string;
  collections: CollectionGroup[];
  settings?: UserSettings;
}

// ==================== 匯出功能 ====================

export const exportToJSON = (
  collections: CollectionGroup[],
  settings?: UserSettings
): string => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    collections,
    settings,
  };
  
  return JSON.stringify(data, null, 2);
};

export const downloadJSON = (
  collections: CollectionGroup[],
  settings?: UserSettings,
  filename?: string
): void => {
  const json = exportToJSON(collections, settings);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `play-tab-export-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// ==================== 匯入功能 ====================

export const parseImportJSON = (jsonString: string): ExportData => {
  try {
    const data = JSON.parse(jsonString) as ExportData;
    
    // 驗證基本結構
    if (!data.version || !data.collections || !Array.isArray(data.collections)) {
      throw new Error('Invalid export file format');
    }
    
    return data;
  } catch (error) {
    throw new Error(`Failed to parse import file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const importFromFile = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = parseImportJSON(content);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const validateImportData = (data: ExportData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // 檢查版本
  if (!data.version) {
    errors.push('Missing version information');
  }
  
  // 檢查收藏集
  if (!Array.isArray(data.collections)) {
    errors.push('Collections must be an array');
  } else {
    data.collections.forEach((collection, index) => {
      if (!collection.id) {
        errors.push(`Collection at index ${index} is missing an ID`);
      }
      if (!collection.title) {
        errors.push(`Collection at index ${index} is missing a title`);
      }
      if (!Array.isArray(collection.items)) {
        errors.push(`Collection at index ${index} has invalid items array`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ==================== 合併策略 ====================

export enum MergeStrategy {
  REPLACE = 'replace',     // 完全取代現有資料
  APPEND = 'append',       // 附加到現有資料
  MERGE = 'merge',         // 智慧合併（相同 ID 則更新，否則新增）
}

export const mergeCollections = (
  existing: CollectionGroup[],
  imported: CollectionGroup[],
  strategy: MergeStrategy
): CollectionGroup[] => {
  switch (strategy) {
    case MergeStrategy.REPLACE:
      return imported;
    
    case MergeStrategy.APPEND:
      return [...existing, ...imported];
    
    case MergeStrategy.MERGE: {
      const merged = [...existing];
      const existingIds = new Set(existing.map(c => c.id));
      
      imported.forEach(importedCollection => {
        const existingIndex = merged.findIndex(c => c.id === importedCollection.id);
        
        if (existingIndex >= 0) {
          // 更新現有項目
          merged[existingIndex] = importedCollection;
        } else {
          // 新增項目
          merged.push(importedCollection);
        }
      });
      
      return merged;
    }
    
    default:
      return existing;
  }
};

