
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, ChevronRight, ShoppingCart } from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category } from '../types';
import SEO from '../components/SEO';
import NewsletterSection from '../components/NewsletterSection';

const BlogPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [allArticles, setAllArticles] = useState(ARTICLES);

  useEffect(() => {
    // Merge constant articles with dynamic local ones
    const dynamic = localStorage.getItem('ayyan_articles');
    if (dynamic) {
      const parsed = JSON.parse(dynamic);
      setAllArticles([...ARTICLES, ...parsed]);
    }
  }, []);

  const categories = ['All', ...Object.values(Category)];

  const filtered = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:text-left">
          <SEO 
            title="Tech Insights & Articles | Ayyan's Tech Hub" 
            description="Deep dives into serverless architecture, SaaS growth, and cloud infrastructure. High-quality tech articles for developers and founders."
            keywords="tech blog, serverless articles, cloud computing tutorials, SaaS growth, developer content"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Tech Insights</h1>
          <p className="text-slate-600 max-w-2xl">
            Deep dives into serverless architecture, SaaS growth, and cloud infrastructure. 
            Selected articles are available for exclusive purchase with full commercial rights.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 hidden sm:inline">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? filtered.reverse().map((article) => (
            <div key={article.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                  {article.isPLR && (
                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1">
                      PLR Rights
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                  <Tag size={12} className="text-blue-500" />
                  <span>{article.date} • {article.readTime}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                  <Link 
                    to={`/blog/${article.id}`} 
                    className="text-slate-900 font-bold hover:text-blue-600 transition-colors text-sm flex items-center gap-1"
                  >
                    Read More <ChevronRight size={16} />
                  </Link>
                  
                  {article.price && (
                    <Link 
                      to={`/checkout?id=${article.id}`} 
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-slate-900 transition-all flex items-center gap-2 text-xs font-bold shadow-lg shadow-blue-100 whitespace-nowrap"
                    >
                      <ShoppingCart size={14} /> Buy Article <span className="opacity-70 font-medium ml-1">${article.price}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No matching articles</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
      
      <NewsletterSection />
    </div>
  );
};

export default BlogPage;
