
import { Article } from './types';

/**
 * Robust environment variable helper
 * Normalizes input by removing whitespace and accidental quotes
 */
const getEnv = (key: string): string => {
  const keysToTry = [key, `VITE_${key}`, key.replace('VITE_', '')];
  
  for (const k of keysToTry) {
    try {
      const meta = import.meta as any;
      if (meta.env && meta.env[k]) return meta.env[k].trim().replace(/['"]/g, '');
    } catch {}
    try {
      if (typeof process !== 'undefined' && process.env && process.env[k]) return process.env[k].trim().replace(/['"]/g, '');
    } catch {}
    try {
      const win = window as any;
      if (win[k]) return win[k].trim().replace(/['"]/g, '');
    } catch {}
  }
  
  // Final fallback: LocalStorage
  const stored = localStorage.getItem(`AYYAN_DB_${key}`);
  return stored ? stored.trim().replace(/['"]/g, '') : '';
};

const getCredentials = () => {
  const url = getEnv('VITE_SUPABASE_URL');
  const key = getEnv('VITE_SUPABASE_ANON_KEY');
  
  return {
    url: url.replace(/\/$/, ''), // Strip trailing slash
    key: key
  };
};

export const db = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const { url, key } = getCredentials();
    if (!url) return { success: false, message: "Missing Project URL" };
    if (!key) return { success: false, message: "Missing Anon Key" };
    if (!url.startsWith('https://')) return { success: false, message: "URL must start with https:// (Don't use the postgres:// string)" };

    try {
      const response = await fetch(`${url}/rest/v1/articles?select=id&limit=1`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      if (response.ok) {
        return { success: true, message: "Connection Successful!" };
      } else {
        const error = await response.json();
        if (response.status === 401) return { success: false, message: "Invalid API Key (Unauthorized)" };
        if (response.status === 404) return { success: false, message: "Table 'articles' not found. Did you run the SQL?" };
        return { success: false, message: error.message || `Error ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: "Network Error: Could not reach Supabase. Check the URL." };
    }
  },

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
        const error = await response.text();
        console.error("Supabase API Error:", error);
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
      
      if (!response.ok) {
        console.error("Supabase Save Error:", await response.text());
        return false;
      }
      return true;
    } catch (error) {
      console.error("Supabase Network Error during save:", error);
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
    return url.length > 0 && key.length > 0 && url.startsWith('https');
  },

  setManualCredentials(url: string, key: string) {
    localStorage.setItem('AYYAN_DB_VITE_SUPABASE_URL', url.trim());
    localStorage.setItem('AYYAN_DB_VITE_SUPABASE_ANON_KEY', key.trim());
    window.location.reload();
  },

  clearCredentials() {
    localStorage.removeItem('AYYAN_DB_VITE_SUPABASE_URL');
    localStorage.removeItem('AYYAN_DB_VITE_SUPABASE_ANON_KEY');
    window.location.reload();
  },

  getConfigs() {
    const { url, key } = getCredentials();
    return {
      url: url || 'MISSING',
      key: key ? 'CONFIGURED' : 'MISSING'
    };
  }
};
