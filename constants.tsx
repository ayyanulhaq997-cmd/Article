
import { Article, Category, Service, PortfolioItem } from './types';

export const INTRODUCTION = `Hi! I’m Ayyan u l Haq, a professional tech content writer specializing in serverless architecture, SaaS, cloud computing, and other tech topics. I create original, SEO-optimized, and beginner-friendly articles that are ready to publish and designed to attract readers and boost website traffic. I also offer custom writing services, PLR rights, and fast delivery to help businesses and blogs grow their online presence.`;

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Mastering AWS Lambda: A Beginner\'s Guide to Serverless',
    excerpt: 'Explore how to build scalable applications without managing servers using AWS Lambda and the Serverless Framework.',
    content: 'Full article content about AWS Lambda...',
    category: Category.Serverless,
    date: 'Oct 12, 2023',
    readTime: '8 min',
    image: 'https://picsum.photos/seed/lambda/800/600',
    price: 45,
    isPLR: true
  },
  {
    id: '2',
    title: 'Why SaaS is the Future of Enterprise Software',
    excerpt: 'Analyzing the shift from on-premise solutions to Software as a Service and what it means for modern businesses.',
    content: 'Full article content about SaaS...',
    category: Category.SaaS,
    date: 'Nov 05, 2023',
    readTime: '6 min',
    image: 'https://picsum.photos/seed/saas/800/600',
    price: 35
  },
  {
    id: '3',
    title: 'Multi-Cloud vs Hybrid Cloud: Which One to Choose?',
    excerpt: 'Deciding on a cloud strategy can be daunting. We break down the differences between multi-cloud and hybrid environments.',
    content: 'Full article content about Cloud strategies...',
    category: Category.Cloud,
    date: 'Dec 01, 2023',
    readTime: '10 min',
    image: 'https://picsum.photos/seed/cloud/800/600',
    price: 50,
    isPLR: true
  },
  {
    id: '4',
    title: 'Top 10 Productivity Tips for Remote Tech Teams',
    excerpt: 'How to keep your development team synchronized and productive across different time zones.',
    content: 'Full article content about remote work...',
    category: Category.TechTips,
    date: 'Jan 15, 2024',
    readTime: '5 min',
    image: 'https://picsum.photos/seed/tips/800/600'
  },
  {
    id: '5',
    title: 'Edge Computing: Bringing Logic Closer to the User',
    excerpt: 'Understand why edge computing is essential for latency-sensitive applications in 2024.',
    content: 'Full article content about Edge computing...',
    category: Category.Cloud,
    date: 'Feb 10, 2024',
    readTime: '7 min',
    image: 'https://picsum.photos/seed/edge/800/600',
    price: 40
  }
];

export const SERVICES: Service[] = [
  {
    id: 'custom-article',
    name: 'Custom Tech Article',
    description: 'Deep-dive technical content tailored to your specific audience and keywords.',
    price: 120,
    features: ['1000+ Words', 'SEO Optimization', '2 Rounds of Edits', 'Custom Research'],
    deliveryTime: '3 Days'
  },
  {
    id: 'plr-package',
    name: 'PLR / Full Rights Bundle',
    description: 'Get exclusive ownership of high-quality tech articles ready for your blog.',
    price: 250,
    features: ['5 Pre-written Articles', 'Full Ownership Rights', 'Ready to Publish', 'Metadata Included'],
    deliveryTime: 'Instant'
  },
  {
    id: 'seo-audit',
    name: 'Keyword Research & Strategy',
    description: 'Don\'t just write—rank. I find the best topics for your niche.',
    price: 80,
    features: ['Target Keywords', 'Competitor Analysis', 'Content Roadmap', 'Meta Descriptions'],
    deliveryTime: '2 Days'
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'The Rise of Serverless Databases',
    client: 'CloudInsights Blog',
    topic: 'Cloud Computing',
    wordCount: 1200,
    snippet: 'This deep dive explored FaunaDB and DynamoDB, highlighting the benefits of pay-per-request pricing models for startups.'
  },
  {
    id: 'p2',
    title: 'SaaS Security Best Practices',
    client: 'SecureFlow Inc.',
    topic: 'SaaS / Cybersecurity',
    wordCount: 1500,
    snippet: 'An SEO-focused piece that ranked #1 for "SaaS security checklists" within 3 months of publication.'
  }
];
