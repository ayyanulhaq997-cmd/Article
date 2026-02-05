
import { Article } from './types';

/**
 * Robust environment variable helper
 * Checks process.env (Node/Webpack) and import.meta.env (Vite)
 */
const getEnv = (key: string): string => {
  try {
    // @ts-ignore - process might not exist in all environments
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    // Fix: Access import.meta.env by casting to any to resolve property access issues with 'env' in TypeScript environments where ImportMeta is strictly defined
    const meta = import.meta as any;
    if (typeof import.meta !== 'undefined' && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    // Silently handle cases where access might throw
  }
  return '';
};

const SB_URL = (getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || '').replace(/\/$/, '');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_KEY') || '';

export const db = {
  async getAllArticles(): Promise<Article[]> {
    if (!SB_URL || !SB_KEY) {
      console.warn("Supabase credentials missing. Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return [];
    }

    try {
      const response = await fetch(`${SB_URL}/rest/v1/articles?select=*`, {
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`
        }
      });
      if (!response.ok) {
        const err = await response.text();
        console.error("Supabase Fetch Error:", err);
        throw new Error('DB Fetch Failed');
      }
      return await response.json();
    } catch (error) {
      console.error("Database connection error:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<boolean> {
    if (!SB_URL || !SB_KEY) {
      console.error("Cannot save: Supabase URL or Key is missing in environment variables.");
      return false;
    }

    try {
      const response = await fetch(`${SB_URL}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(article)
      });
      
      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Supabase Save Error. Ensure the 'articles' table exists with correct columns.", errorDetail);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Database save request failed:", error);
      return false;
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (!SB_URL || !SB_KEY) return false;
    try {
      const response = await fetch(`${SB_URL}/rest/v1/articles?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error("Database delete error:", error);
      return false;
    }
  },

  // Helper to check if config is present
  isConfigured(): boolean {
    return !!(SB_URL && SB_KEY);
  }
};
