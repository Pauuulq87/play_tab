import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { CollectionGroup, UserSettings } from '@/models/types';

// ==================== 初始化 ====================

let supabaseClient: SupabaseClient | null = null;

export const initSupabase = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not found in environment variables');
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
};

// ==================== 認證 ====================

export const signUp = async (email: string, password: string): Promise<User | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }

  return data.user;
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }

  return data.user;
};

export const signOut = async (): Promise<void> => {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

// ==================== 收藏集同步 ====================

export interface DbCollection {
  id: string;
  user_id: string;
  title: string;
  items: any[];
  is_open: boolean;
  created_at?: string;
  updated_at?: string;
}

export const syncCollectionsToCloud = async (collections: CollectionGroup[]): Promise<void> => {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // 將本地格式轉換為資料庫格式
  const dbCollections: Omit<DbCollection, 'created_at' | 'updated_at'>[] = collections.map(c => ({
    id: c.id,
    user_id: user.id,
    title: c.title,
    items: c.items,
    is_open: c.isOpen,
  }));

  // 使用 upsert 來插入或更新
  const { error } = await supabase
    .from('collections')
    .upsert(dbCollections, { onConflict: 'id' });

  if (error) {
    throw new Error(`Failed to sync collections: ${error.message}`);
  }
};

export const fetchCollectionsFromCloud = async (): Promise<CollectionGroup[]> => {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch collections: ${error.message}`);
  }

  // 將資料庫格式轉換為本地格式
  return (data as DbCollection[]).map(db => ({
    id: db.id,
    title: db.title,
    items: db.items,
    isOpen: db.is_open,
  }));
};

export const deleteCollectionFromCloud = async (collectionId: string): Promise<void> => {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete collection: ${error.message}`);
  }
};

// ==================== 使用者設定同步 ====================

export interface DbUserSettings {
  user_id: string;
  settings: UserSettings;
  updated_at?: string;
}

export const syncSettingsToCloud = async (settings: UserSettings): Promise<void> => {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      settings,
    }, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Failed to sync settings: ${error.message}`);
  }
};

export const fetchSettingsFromCloud = async (): Promise<UserSettings | null> => {
  const supabase = getSupabase();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 找不到資料，返回 null
      return null;
    }
    throw new Error(`Failed to fetch settings: ${error.message}`);
  }

  return (data as DbUserSettings).settings;
};

// ==================== 即時訂閱 ====================

export const subscribeToCollections = (
  userId: string,
  callback: (collections: CollectionGroup[]) => void
): (() => void) => {
  const supabase = getSupabase();

  const channel = supabase
    .channel('collections-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'collections',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        // 當有變更時重新取得資料
        const collections = await fetchCollectionsFromCloud();
        callback(collections);
      }
    )
    .subscribe();

  // 返回取消訂閱函式
  return () => {
    supabase.removeChannel(channel);
  };
};

// ==================== 雙向同步邏輯 ====================

export interface SyncResult {
  success: boolean;
  localToCloud: boolean;
  cloudToLocal: boolean;
  error?: string;
}

export const performBidirectionalSync = async (
  localCollections: CollectionGroup[],
  localSettings?: UserSettings
): Promise<SyncResult> => {
  try {
    const isAuth = await isAuthenticated();
    
    if (!isAuth) {
      return {
        success: false,
        localToCloud: false,
        cloudToLocal: false,
        error: 'User not authenticated',
      };
    }

    // 上傳本地資料到雲端
    await syncCollectionsToCloud(localCollections);
    if (localSettings) {
      await syncSettingsToCloud(localSettings);
    }

    // 從雲端取得最新資料
    const cloudCollections = await fetchCollectionsFromCloud();
    const cloudSettings = await fetchSettingsFromCloud();

    return {
      success: true,
      localToCloud: true,
      cloudToLocal: true,
    };
  } catch (error) {
    return {
      success: false,
      localToCloud: false,
      cloudToLocal: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

