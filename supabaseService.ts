
import { createClient } from '@supabase/supabase-js';
import { Article } from './types';

// User provided Supabase Credentials
let SUPABASE_URL = 'https://qbsjzxbuolqsxulyhguw.supabase.co';
let SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2p6eGJ1b2xxc3h1bHloZ3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTU3NTEsImV4cCI6MjA4NTg3MTc1MX0.2k6Ve0eNTD8UzkNfDOzlmEmesZ3LM1AVFoIMJibGpTQ';

// Initialize the official Supabase client
let supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  // Fix: Added setManualCredentials to allow updating credentials at runtime as required by AdminDashboard.tsx
  /**
   * Updates Supabase credentials at runtime and re-initializes the client.
   */
  setManualCredentials(url: string, key: string) {
    SUPABASE_URL = url;
    SUPABASE_KEY = key;
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  },

  /**
   * Tests the connection to Supabase by trying to select from the articles table.
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.from('articles').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          return { success: false, message: "Connected to Supabase, but the 'articles' table does not exist. Please run the SQL script." };
        }
        throw error;
      }
      return { success: true, message: "Cloud connection active and tables are ready!" };
    } catch (e: any) {
      console.error("Connection error:", e);
      return { success: false, message: e.message || "Failed to connect to Supabase. Check your network." };
    }
  },

  // ARTICLES OPERATIONS
  async getAllArticles(): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Fetch articles error:", e);
      return [];
    }
  },

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Fetch article error:", e);
      return null;
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    try {
      // We map the object to ensure only valid columns are sent
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
      return { success: false, error: e.message || "Cloud insert failed. Ensure tables are created." };
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

  // SALES OPERATIONS
  async getAllSales(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      
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
    return SUPABASE_URL.includes('supabase.co') && SUPABASE_KEY.length > 20;
  }
};
