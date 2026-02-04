
export enum Category {
  Serverless = 'Serverless',
  Cloud = 'Cloud Computing',
  SaaS = 'SaaS',
  TechTips = 'Tech Tips'
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  date: string;
  readTime: string;
  image: string;
  price?: number;
  isPLR?: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  deliveryTime: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  topic: string;
  wordCount: number;
  snippet: string;
}
