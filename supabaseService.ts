
import { createClient } from '@supabase/supabase-js';
import { Article } from './types';

// Use the provided credentials as defaults
const DEFAULT_URL = 'https://qbsjzxbuolqsxulyhguw.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2p6eGJ1b2xxc3h1bHloZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTU3NTEsImV4cCI6MjA4NTg3MTc1MX0.2k6Ve0eNTD8UzkNfDOzlmEmesZ3LM1AVFoIMJibGpTQ';

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
  
  // 3. Fallback to hardcoded defaults
  if (normalizedKey === 'SUPABASE_URL') return DEFAULT_URL;
  if (normalizedKey === 'SUPABASE_ANON_KEY') return DEFAULT_KEY;
  
  return '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_KEY = getEnv('SUPABASE_ANON_KEY');

// Initialize the client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase.from('articles').select('id').limit(1);
      if (error) throw error;
      return { success: true, message: "Cloud connection successful! Tables found." };
    } catch (e: any) {
      console.error("Connection error:", e);
      return { success: false, message: e.message || "Failed to connect to Supabase." };
    }
  },

  // ARTICLES
  async getAllArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Fetch articles error:", e);
      return [];
    }
  },

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Fetch article error:", e);
      return null;
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    try {
      // Clean the article object to match table columns
      const payload = {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        introText: article.introText,
        content: article.content,
        category: article.category,
        date: article.date,
        readTime: article.readTime,
        image: article.image,
        price: article.price,
        isPLR: article.isPLR
      };

      const { error } = await supabase.from('articles').insert(payload);
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      console.error("Save article error:", e);
      return { success: false, error: e.message || "Unknown cloud error." };
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Delete article error:", e);
      return false;
    }
  },

  // SALES
  async getAllSales(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Fetch sales error:", e);
      return [];
    }
  },

  async recordSale(saleData: any): Promise<boolean> {
    try {
      const payload = {
        article_id: saleData.itemId,
        order_id: saleData.orderId,
        item_name: saleData.itemName,
        amount: saleData.price
      };

      const { error } = await supabase.from('sales').insert(payload);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Record sale error:", e);
      return false;
    }
  },

  isConfigured(): boolean {
    return SUPABASE_URL.length > 10 && SUPABASE_KEY.length > 20;
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
