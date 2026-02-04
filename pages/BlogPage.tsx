
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Tag } from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category } from '../types';
import SEO from '../components/SEO';

const BlogPage = () => {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<Category | 'All'>('All');

  const categories = ['All', ...Object.values(Category)];

  const filtered = ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO 
        title="Tech Insights & Articles | Ayyan's Tech Hub" 
        description="Deep dives into serverless architecture, SaaS growth, and cloud infrastructure. High-quality tech articles for developers and founders."
        keywords="tech blog, serverless articles, cloud computing tutorials, SaaS growth, developer content"
      />
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Tech Insights</h1>
        <p className="text-slate-600 max-w-2xl">
          Deep dives into serverless architecture, SaaS growth, and cloud infrastructure.
          Some articles are available for purchase with full PLR rights.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === cat 
                ? 'bg-blue-600 text-white' 
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
        {filtered.length > 0 ? filtered.map((article) => (
          <div key={article.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full uppercase">
                  {article.category}
                </span>
                {article.isPLR && (
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full uppercase flex items-center gap-1">
                    PLR
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                <Tag size={12} />
                <span>{article.date} • {article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <Link to={`/blog/${article.id}`} className="text-blue-600 font-bold hover:underline">
                  Read More
                </Link>
                {article.price && (
                  <Link to={`/checkout?id=${article.id}`} className="bg-slate-100 p-2 rounded-lg text-slate-900 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
                    <ShoppingCart size={16} /> ${article.price}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 text-lg">No articles found matching your criteria.</p>
            <button 
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
