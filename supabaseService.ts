
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
  const normalizedKey = key.replace('VITE_', '');
  const keysToTry = [
    `VITE_${normalizedKey}`,
    normalizedKey,
    `AYYAN_DB_VITE_${normalizedKey}`,
    `AYYAN_DB_${normalizedKey}`
  ];
  
  // Try Environment Variables first
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
  
  // Fallback to LocalStorage specifically
  const stored = localStorage.getItem(`AYYAN_DB_VITE_${normalizedKey}`) || localStorage.getItem(`AYYAN_DB_${normalizedKey}`);
  return stored ? stored.trim().replace(/['"]/g, '') : '';
};

const getCredentials = () => {
  const url = getEnv('VITE_SUPABASE_URL');
  const key = getEnv('VITE_SUPABASE_ANON_KEY');
  
  return {
    url: url.replace(/\/$/, ''), 
    key: key
  };
};

export const db = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const { url, key } = getCredentials();
    if (!url) return { success: false, message: "Missing Project URL" };
    if (!key) return { success: false, message: "Missing Anon Key" };
    if (!url.startsWith('https://')) return { success: false, message: "URL must start with https:// (Ensure it's the Project URL, not the DB string)" };

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
        const error = await response.json().catch(() => ({ message: 'Unknown API Error' }));
        if (response.status === 401) return { success: false, message: "Invalid API Key (Unauthorized). Check your Anon Key." };
        if (response.status === 404) return { success: false, message: "API Endpoint not found. Check your Project URL." };
        return { success: false, message: error.message || `Error ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: "Network Error: Could not reach Supabase. Check your internet or URL." };
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
        console.error("Supabase Fetch Error:", error);
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error("Supabase Fetch Failed:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    const { url, key } = getCredentials();
    if (!url || !key) return { success: false, error: "Cloud credentials not configured." };

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
        const errorBody = await response.json().catch(() => ({ message: 'Unknown Server Error' }));
        let message = errorBody.message || "Failed to publish.";
        
        // Handle specific PostgREST errors
        if (errorBody.code === '42703') {
          message = "DATABASE SCHEMA MISMATCH: Your table is missing columns (like introText or isPLR). Update your SQL schema.";
        } else if (response.status === 401) {
          message = "INVALID CREDENTIALS: The Anon Key is incorrect or expired.";
        }
        
        console.error("Supabase Save Error Details:", errorBody);
        return { success: false, error: message };
      }
      return { success: true };
    } catch (error) {
      console.error("Supabase Network Error during save:", error);
      return { success: false, error: "Network Error: Could not reach Supabase." };
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
      key: key ? 'CONFIGURED (Masked)' : 'MISSING'
    };
  }
};
