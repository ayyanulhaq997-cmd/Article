
import { Article } from './types';

/**
 * Robust environment variable helper
 * Checks Vite, Process, and Window globals
 */
const getEnv = (key: string): string => {
  try {
    const meta = import.meta as any;
    if (meta.env && meta.env[key]) return meta.env[key];
  } catch {}

  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  } catch {}

  try {
    const win = window as any;
    if (win[key]) return win[key];
    if (win.process?.env?.[key]) return win.process.env[key];
  } catch {}

  return '';
};

// Standard Supabase keys
const SB_URL = (getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || '').replace(/\/$/, '');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_KEY') || '';

export const db = {
  async getAllArticles(): Promise<Article[]> {
    if (!this.isConfigured()) {
      console.warn("Supabase Configuration Missing. Required: VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY");
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
        const errorText = await response.text();
        if (response.status === 401) console.error("Supabase Error: Invalid API Key (Unauthorized)");
        if (response.status === 404) console.error("Supabase Error: 'articles' table not found. Check your schema.");
        console.error(`Supabase Fetch Failed (${response.status}):`, errorText);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error("Supabase Connection Error:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<boolean> {
    if (!this.isConfigured()) return false;

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
        console.error(`Supabase Insert Failed (${response.status}):`, errorDetail);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Supabase Save Exception:", error);
      return false;
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (!this.isConfigured()) return false;
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
      return false;
    }
  },

  isConfigured(): boolean {
    const hasUrl = SB_URL.length > 0;
    const hasKey = SB_KEY.length > 0;
    
    // Log helpful hints for debugging
    if (!hasUrl) console.debug("Missing env: VITE_SUPABASE_URL");
    if (!hasKey) console.debug("Missing env: VITE_SUPABASE_ANON_KEY");
    
    return hasUrl && hasKey;
  },

  getConfigs() {
    return {
      url: SB_URL ? `${SB_URL.substring(0, 15)}...` : 'MISSING',
      key: SB_KEY ? 'PROVIDED (Masked)' : 'MISSING'
    };
  }
};
