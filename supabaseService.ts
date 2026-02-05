
import { Article } from './types';

/**
 * Robust environment variable helper
 */
const getEnv = (key: string): string => {
  // 1. Try Vite's preferred method
  try {
    const meta = import.meta as any;
    if (meta.env && meta.env[key]) return meta.env[key];
  } catch {}

  // 2. Try process.env (Node/some CI)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  } catch {}

  // 3. Try window (Global shim)
  try {
    const win = window as any;
    if (win[key]) return win[key];
    if (win.process?.env?.[key]) return win.process.env[key];
  } catch {}

  return '';
};

const SB_URL = (getEnv('VITE_SUPABASE_URL') || '').replace(/\/$/, '');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || '';

/**
 * SQL FOR SUPABASE (Run this in your Supabase SQL Editor):
 * 
 * create table articles (
 *   id text primary key,
 *   title text not null,
 *   excerpt text,
 *   introText text,
 *   content text,
 *   category text,
 *   date text,
 *   readTime text,
 *   image text,
 *   price numeric,
 *   isPLR boolean default true
 * );
 * 
 * -- Enable public access (Read)
 * alter table articles enable row level security;
 * create policy "Public Access" on articles for select using (true);
 * create policy "Admin Insert" on articles for insert with check (true);
 * create policy "Admin Delete" on articles for delete using (true);
 */

export const db = {
  async getAllArticles(): Promise<Article[]> {
    if (!SB_URL || !SB_KEY) {
      console.warn("Supabase Config Missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined in .env");
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
        const errorMsg = await response.text();
        console.error(`Supabase Fetch Error (${response.status}):`, errorMsg);
        return [];
      }
      
      return await response.json();
    } catch (error) {
      console.error("Supabase Network Connection Failed:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<boolean> {
    if (!SB_URL || !SB_KEY) return false;

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
        console.error(`Supabase Save Failed (${response.status}):`, errorDetail);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Supabase Save Request Failed:", error);
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
      return false;
    }
  },

  isConfigured(): boolean {
    return !!(SB_URL && SB_KEY);
  }
};
