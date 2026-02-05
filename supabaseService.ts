
import { Article } from './types';

const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = process.env.SUPABASE_KEY || '';

/**
 * Note: For this to work, you must create a table named 'articles' in Supabase with these columns:
 * id (text, primary key), title (text), excerpt (text), introText (text), 
 * content (text), category (text), date (text), readTime (text), 
 * image (text), price (numeric)
 */

export const db = {
  async getAllArticles(): Promise<Article[]> {
    if (!SB_URL || !SB_KEY) {
      console.warn("Supabase credentials missing. Falling back to local/static data.");
      return [];
    }

    try {
      const response = await fetch(`${SB_URL}/rest/v1/articles?select=*`, {
        headers: {
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`
        }
      });
      if (!response.ok) throw new Error('DB Fetch Failed');
      return await response.json();
    } catch (error) {
      console.error("Database error:", error);
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
      return response.ok;
    } catch (error) {
      console.error("Database save error:", error);
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
  }
};
