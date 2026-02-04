
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, MessageCircle, ShoppingCart, Sparkles } from 'lucide-react';
import { ARTICLES } from '../constants';
import { getArticleSummary } from '../geminiService';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  
  const article = ARTICLES.find(a => a.id === id);

  if (!article) return <div className="text-center py-20">Article not found.</div>;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const res = await getArticleSummary(article.excerpt + " " + article.content);
    setSummary(res);
    setIsSummarizing(false);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-slate-50 pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase">
              {article.category}
            </span>
            {article.isPLR && (
              <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full uppercase">
                PLR Available
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {article.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> {article.readTime} read
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">AH</span>
              Ayyan u l Haq
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-12">
          <img src={article.image} alt={article.title} className="w-full aspect-video object-cover" />
          
          <div className="p-8 md:p-12 space-y-8">
            {/* AI Summary Box */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Sparkles size={20} className="text-indigo-600" /> Smart Summary
                </div>
                {!summary && !isSummarizing && (
                  <button 
                    onClick={handleSummarize}
                    className="text-xs font-bold bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Generate with AI
                  </button>
                )}
              </div>
              {isSummarizing ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                  <div className="text-indigo-400 text-sm font-medium">Distilling core tech concepts...</div>
                </div>
              ) : summary ? (
                <p className="text-indigo-800 text-sm leading-relaxed italic">
                  "{summary}"
                </p>
              ) : (
                <p className="text-indigo-400 text-sm">Need a quick wrap-up? Click to generate an AI summary of this piece.</p>
              )}
            </div>

            <article className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed">
              <p className="font-semibold text-xl text-slate-900">{article.excerpt}</p>
              <p>{article.content} [Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.]</p>
              
              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Key Takeaways</h2>
              <ul className="list-disc pl-6 space-y-4">
                <li>Serverless architecture reduces operational overhead significantly.</li>
                <li>SaaS models provide predictable recurring revenue for modern tech firms.</li>
                <li>Cloud security is a shared responsibility model.</li>
              </ul>
            </article>

            {/* Marketplace Callout */}
            {article.price && (
              <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Want to publish this on your blog?</h3>
                <p className="text-slate-400 mb-8">This article is available for purchase with full PLR rights. You'll get the full source, high-res image, and distribution rights.</p>
                <Link to={`/checkout?id=${article.id}`} className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                  <ShoppingCart size={20} /> Buy Full Rights for ${article.price}
                </Link>
              </div>
            )}

            {/* Social Share */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold">
                  <Share2 size={18} /> Share
                </button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold">
                  <MessageCircle size={18} /> Comment
                </button>
              </div>
              <div className="flex gap-2">
                {['Serverless', 'Cloud', 'SaaS'].map(tag => (
                  <span key={tag} className="text-xs font-medium text-slate-400 px-2 py-1 bg-slate-50 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
