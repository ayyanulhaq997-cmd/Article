
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
    if (!url) return { success: false, message: "Missing Project URL." };
    if (!key) return { success: false, message: "Missing Anon Key." };

    try {
      const response = await fetch(`${url}/rest/v1/articles?select=id&limit=1`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      });
      return response.ok 
        ? { success: true, message: "Cloud Connection Active!" } 
        : { success: false, message: "Table not found or API restricted." };
    } catch (e) {
      return { success: false, message: "Network error. Check your URL." };
    }
  },

  // ARTICLES
  async getAllArticles(): Promise<Article[]> {
    const { url, key } = getCredentials();
    if (!url || !key) return [];
    try {
      const response = await fetch(`${url}/rest/v1/articles?select=*`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      });
      return response.ok ? await response.json() : [];
    } catch { return []; }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    const { url, key } = getCredentials();
    if (!url || !key) return { success: false, error: "Database not configured." };
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
      return response.ok ? { success: true } : { success: false, error: "Publish failed. Check table schema." };
    } catch { return { success: false, error: "Network error." }; }
  },

  async deleteArticle(id: string): Promise<boolean> {
    const { url, key } = getCredentials();
    if (!url || !key) return false;
    try {
      const response = await fetch(`${url}/rest/v1/articles?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      });
      return response.ok;
    } catch { return false; }
  },

  // SALES (NEW: CLOUD STORAGE)
  async getAllSales(): Promise<any[]> {
    const { url, key } = getCredentials();
    if (!url || !key) return [];
    try {
      const response = await fetch(`${url}/rest/v1/sales?select=*&order=created_at.desc`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      });
      return response.ok ? await response.json() : [];
    } catch { return []; }
  },

  async recordSale(saleData: any): Promise<boolean> {
    const { url, key } = getCredentials();
    if (!url || !key) return false;
    try {
      const response = await fetch(`${url}/rest/v1/sales`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          article_id: saleData.itemId,
          order_id: saleData.orderId,
          item_name: saleData.itemName,
          amount: saleData.price,
          created_at: new Date().toISOString()
        })
      });
      return response.ok;
    } catch { return false; }
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
