import { Article } from './types';

const getEnv = (key: string): string => {
  const normalizedKey = key.replace('VITE_', '');
  
  // 1. Try LocalStorage (User manually entered in Admin Dashboard)
  const stored = localStorage.getItem(`AYYAN_DB_VITE_${normalizedKey}`) || localStorage.getItem(`AYYAN_DB_${normalizedKey}`);
  if (stored) return stored.trim().replace(/['"]/g, '');

  // 2. Try Environment Variables
  const keysToTry = [`VITE_${normalizedKey}`, normalizedKey];
  for (const k of keysToTry) {
    try {
      const meta = (import.meta as any);
      if (meta.env && meta.env[k]) return meta.env[k].trim().replace(/['"]/g, '');
    } catch {}
    try {
      if (typeof process !== 'undefined' && process.env && process.env[k]) return (process.env[k] as string).trim().replace(/['"]/g, '');
    } catch {}
  }
  
  return '';
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
    if (!url) return { success: false, message: "Missing Project URL. Please check your Supabase API settings." };
    if (!key) return { success: false, message: "Missing Anon Key. Please check your Supabase API settings." };
    if (!url.startsWith('https://')) return { success: false, message: "Invalid URL format. It must start with https://" };

    try {
      const response = await fetch(`${url}/rest/v1/articles?select=id&limit=1`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      
      if (response.ok) {
        return { success: true, message: "Connection verified! Your database is ready." };
      } else {
        const error = await response.json().catch(() => ({ message: 'Table "articles" not found.' }));
        return { success: false, message: error.message || `API Error: ${response.status}` };
      }
    } catch (e) {
      return { success: false, message: "Connection failed. Please verify your Project URL and internet connection." };
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
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Supabase Fetch Error:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    const { url, key } = getCredentials();
    if (!url || !key) return { success: false, error: "Database not configured. Please go to DB Config." };

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
        const errorBody = await response.json().catch(() => ({ message: 'Database rejected the request. Ensure the "articles" table exists with correct columns.' }));
        return { success: false, error: errorBody.message || "Failed to publish." };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network error. Could not reach Supabase." };
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
    return url.length > 10 && key.length > 20;
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
  }
};