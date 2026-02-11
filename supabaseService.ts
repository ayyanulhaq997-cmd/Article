import { Article } from './types';

export const db = {
  async getAllArticles(): Promise<Article[]> {
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  async saveArticle(article: Article): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      if (!response.ok) return { success: false, error: "Failed to save" };
      return { success: true };
    } catch (error) {
      return { success: false, error: "Network Error" };
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  isConfigured(): boolean { return true; },
  getConfigs() { return { url: 'INTERNAL', key: 'INTERNAL' }; },
  testConnection() { return Promise.resolve({ success: true, message: "Connected to API" }); }
};
