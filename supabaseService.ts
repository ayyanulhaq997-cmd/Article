
import { Article } from './types';

/**
 * SQL SCHEMA FOR SUPABASE
 * -----------------------
 * Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql):
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
 * -- Enable Row Level Security
 * ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create access policies
 * CREATE POLICY "Public read access" ON articles FOR SELECT USING (true);
 * CREATE POLICY "Authenticated insert access" ON articles FOR INSERT WITH CHECK (true);
 * CREATE POLICY "Authenticated delete access" ON articles FOR DELETE USING (true);
 */

/**
 * Robust environment variable helper
 */
const getEnv = (key: string): string => {
  const keysToTry = [key, `VITE_${key}`, key.replace('VITE_', '')];
  
  for (const k of keysToTry) {
    try {
      // 1. Try Vite's method
      const meta = import.meta as any;
      if (meta.env && meta.env[k]) return meta.env[k];
    } catch {}

    try {
      // 2. Try Process (Node/CI)
      if (typeof process !== 'undefined' && process.env && process.env[k]) return process.env[k];
    } catch {}

    try {
      // 3. Try Window Globals
      const win = window as any;
      if (win[k]) return win[k];
      if (win.process?.env?.[k]) return win.process.env[k];
    } catch {}
  }

  return '';
};

const SB_URL = (getEnv('VITE_SUPABASE_URL') || '').replace(/\/$/, '');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || '';

export const db = {
  async getAllArticles(): Promise<Article[]> {
    if (!this.isConfigured()) {
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
        console.error(`Supabase API Error (${response.status}):`, errorText);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error("Supabase Network Failure:", error);
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
      
      return response.ok;
    } catch (error) {
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
    return SB_URL.length > 0 && SB_KEY.length > 0;
  },

  getConfigs() {
    return {
      url: SB_URL || 'MISSING',
      key: SB_KEY ? 'CONFIGURED' : 'MISSING'
    };
  }
};
