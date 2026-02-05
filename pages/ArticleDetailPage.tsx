
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ShoppingCart, 
  Sparkles, 
  Plus, 
  Minus,
  Quote
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { getArticleSummary } from '../geminiService';
import SEO from '../components/SEO';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [article, setArticle] = useState<any>(null);
  
  useEffect(() => {
    const staticArticle = ARTICLES.find(a => a.id === id);
    if (staticArticle) {
      setArticle(staticArticle);
    } else {
      const dynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      const found = dynamic.find((a: any) => a.id === id);
      setArticle(found);
    }
  }, [id]);

  if (!article) return <div className="text-center py-20 font-bold">Article not found.</div>;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const res = await getArticleSummary(article.excerpt + " " + article.content);
    setSummary(res);
    setIsSummarizing(false);
  };

  return (
    <div className="pb-20">
      <SEO title={article.title} description={article.excerpt} ogImage={article.image} />
      <div className="bg-slate-50 pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8">
            <ArrowLeft size={18} className="mr-2" /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2"><Calendar size={16} /> {article.date}</div>
            <div className="flex items-center gap-2"><Clock size={16} /> {article.readTime} read</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-12">
          <img src={article.image} alt={article.title} className="w-full aspect-video object-cover" />
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex justify-between items-center border-b pb-6">
               <button onClick={handleSummarize} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100">
                 <Sparkles size={14} className="inline mr-1" /> Quick AI Summary
               </button>
               <div className="flex gap-2">
                 <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-2 bg-slate-50 rounded-lg"><Minus size={14}/></button>
                 <span className="px-4 py-2 bg-slate-50 rounded-lg font-bold text-sm">{fontSize}px</span>
                 <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-2 bg-slate-50 rounded-lg"><Plus size={14}/></button>
               </div>
            </div>

            {summary && (
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm italic text-indigo-900 animate-in fade-in slide-in-from-top-4">
                "{summary}"
              </div>
            )}

            {/* NEW INTRO BOX */}
            {article.introText && (
              <div className="bg-slate-50 border-l-4 border-blue-600 p-8 rounded-r-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-blue-100 group-hover:text-blue-200 transition-colors">
                  <Quote size={40} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Article Insight</h4>
                  <p className="text-slate-800 font-medium leading-relaxed italic">
                    {article.introText}
                  </p>
                </div>
              </div>
            )}

            <article style={{ fontSize: `${fontSize}px` }} className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </article>

            {article.price && (
              <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Own this article?</h3>
                <p className="text-slate-400 mb-8">Purchase full rights to publish this content on your own platform.</p>
                <Link to={`/checkout?id=${article.id}`} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                  Buy Full Rights for ${article.price}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
