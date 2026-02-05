
import { Article } from './types';

/**
 * SQL SCHEMA FOR SUPABASE
 * -----------------------
 * Run this in your Supabase SQL Editor:
 * 
 * CREATE TABLE articles (
 *   id TEXT PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   excerpt TEXT,
 *   introText TEXT,
 *   content TEXT,
 *   category TEXT,
 *   date TEXT,
 *   readTime TEXT,
 *   image TEXT,
 *   price NUMERIC,
 *   isPLR BOOLEAN DEFAULT true
 * );
 * 
 * ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "Public read" ON articles FOR SELECT USING (true);
 * CREATE POLICY "Public insert" ON articles FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Public delete" ON articles FOR DELETE USING (true);
 */

const getEnv = (key: string): string => {
  const keysToTry = [key, `VITE_${key}`, key.replace('VITE_', '')];
  
  for (const k of keysToTry) {
    try {
      const meta = import.meta as any;
      if (meta.env && meta.env[k]) return meta.env[k];
    } catch {}
    try {
      if (typeof process !== 'undefined' && process.env && process.env[k]) return process.env[k];
    } catch {}
    try {
      const win = window as any;
      if (win[k]) return win[k];
    } catch {}
  }
  
  // Final fallback: LocalStorage (User entered in UI)
  return localStorage.getItem(`AYYAN_DB_${key}`) || '';
};

const getCredentials = () => ({
  url: (getEnv('VITE_SUPABASE_URL') || '').replace(/\/$/, ''),
  key: getEnv('VITE_SUPABASE_ANON_KEY')
});

export const db = {
  async getAllArticles(): Promise<Article[]> {
    const { url, key } = getCredentials();
    if (!url || !key) return [];

    try {
      const response = await fetch(`${url}/rest/v1/articles?select=*`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      if (!response.ok) {
        console.error("Supabase Error:", await response.text());
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Supabase Fetch Failed:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<boolean> {
    const { url, key } = getCredentials();
    if (!url || !key) return false;

    try {
      const response = await fetch(`${url}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(article)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    const { url, key } = getCredentials();
    if (!url || !key) return false;
    try {
      const response = await fetch(`${url}/rest/v1/articles?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  isConfigured(): boolean {
    const { url, key } = getCredentials();
    return url.length > 0 && key.length > 0;
  },

  setManualCredentials(url: string, key: string) {
    localStorage.setItem('AYYAN_DB_VITE_SUPABASE_URL', url);
    localStorage.setItem('AYYAN_DB_VITE_SUPABASE_ANON_KEY', key);
    window.location.reload(); // Refresh to apply changes
  },

  getConfigs() {
    const { url, key } = getCredentials();
    return {
      url: url || 'MISSING',
      key: key ? 'CONFIGURED (Masked)' : 'MISSING'
    };
  }
};
