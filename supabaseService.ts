import { createClient } from '@supabase/supabase-js';
import { Article } from './types';

// These should be set in Replit Secrets
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const db = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      return { success: false, message: "Supabase URL or Anon Key is missing in environment variables." };
    }
    try {
      const { data, error } = await supabase.from('articles').select('id').limit(1);
      if (error) throw error;
      return { success: true, message: "Connected to Supabase successfully!" };
    } catch (e: any) {
      return { success: false, message: `Connection failed: ${e.message}` };
    }
  },

  async getAllArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Supabase Fetch Error:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('articles')
        .insert([article]);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Supabase Save Error:", error);
      return { success: false, error: error.message };
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Supabase Delete Error:", error);
      return false;
    }
  },

  isConfigured(): boolean {
    return !!(supabaseUrl && supabaseAnonKey);
  },

  getConfigs() {
    return {
      url: supabaseUrl || 'MISSING',
      key: supabaseAnonKey ? 'CONFIGURED' : 'MISSING'
    };
  }
};
