
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Sparkles, 
  Plus, 
  Minus,
  Quote,
  Loader2,
  Share2,
  Linkedin,
  Twitter
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { getArticleSummary } from '../geminiService';
import { db } from '../supabaseService';
import SEO from '../components/SEO';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      const staticArticle = ARTICLES.find(a => a.id === id);
      if (staticArticle) {
        setArticle(staticArticle);
      } else {
        const cloudArticles = await db.getAllArticles();
        const found = cloudArticles.find(a => a.id === id);
        setArticle(found);
      }
      setLoading(false);
    };
    loadArticle();
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (!article) return <div className="text-center py-20 font-bold">Article not found.</div>;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const res = await getArticleSummary(article.excerpt + " " + article.content);
    setSummary(res);
    setIsSummarizing(false);
  };

  return (
    <div className="pb-20">
      <SEO title={article.title} description={article.excerpt} ogImage={article.image} ogType="article" />
      
      {/* Article Header */}
      <div className="bg-slate-50 pt-16 pb-24 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-10 font-bold uppercase text-xs tracking-widest">
            <ArrowLeft size={16} className="mr-2" /> All Articles
          </Link>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg uppercase tracking-wider">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-[0.9] tracking-tighter">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-8 text-xs text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> {article.date}</div>
            <div className="flex items-center gap-2"><Clock size={16} className="text-blue-500" /> {article.readTime || '5 min'} READ TIME</div>
            <div className="flex items-center gap-2"><Share2 size={16} className="text-blue-500" /> TECHNICAL PUBLICATION</div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mb-12">
          <img src={article.image} alt={article.title} className="w-full aspect-video object-cover" />
          
          <div className="p-8 md:p-16 space-y-10">
            {/* Reading Controls */}
            <div className="flex justify-between items-center border-b border-slate-50 pb-8">
               <button 
                 onClick={handleSummarize} 
                 disabled={isSummarizing}
                 className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2"
               >
                 {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                 AI Editorial Summary
               </button>
               <div className="flex items-center gap-3">
                 <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><Minus size={16}/></button>
                 <span className="font-black text-xs text-slate-400 uppercase tracking-widest">{fontSize}PX</span>
                 <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"><Plus size={16}/></button>
               </div>
            </div>

            {summary && (
              <div className="p-8 bg-indigo-50/50 border-l-4 border-indigo-500 rounded-r-3xl text-base italic text-indigo-900 animate-in fade-in slide-in-from-top-4 font-medium leading-relaxed">
                <span className="not-italic font-black text-[10px] uppercase block mb-2 text-indigo-400">TL;DR Summary:</span>
                "{summary}"
              </div>
            )}

            {article.introText && (
              <div className="bg-blue-50/30 border-l-4 border-blue-600 p-10 rounded-r-[2rem] shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-blue-100/50 group-hover:text-blue-100 transition-colors">
                  <Quote size={60} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Key Insight</h4>
                  <p className="text-slate-900 font-bold leading-relaxed italic text-xl">
                    {article.introText}
                  </p>
                </div>
              </div>
            )}

            {/* Article Content */}
            <article style={{ fontSize: `${fontSize}px` }} className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line font-medium">
              {article.content}
            </article>

            {/* Author Attribution Box (AdSense Requirement) */}
            <div className="mt-20 p-10 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row items-center gap-8">
               <img src="https://picsum.photos/seed/ayyan/100" className="w-20 h-20 rounded-full border-4 border-white shadow-sm" alt="Author" />
               <div className="flex-grow text-center sm:text-left">
                  <h4 className="text-xl font-black text-slate-900 mb-2">Written by Ayyan u l Haq</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 font-medium">
                    Ayyan is a technical writer and cloud architect specializing in serverless SaaS. 
                    He helps engineering teams scale through authoritative technical content.
                  </p>
                  <div className="flex justify-center sm:justify-start gap-4">
                     <Link to="/about" className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">Full Bio</Link>
                     <span className="text-slate-200">|</span>
                     <a href="https://www.linkedin.com/in/ch-ayyan-jutt-a45a3b283" target="_blank" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-1"><Linkedin size={12}/> LinkedIn</a>
                  </div>
               </div>
            </div>

            {article.price && (
              <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Full Commercial Usage Rights</h3>
                <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium">
                  This technical publication is available for exclusive purchase. Own the full rights 
                  to publish this deep-dive on your own business blog.
                </p>
                <Link to={`/checkout?id=${article.id}`} className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20">
                  Acquire Rights for ${article.price} <ArrowLeft className="rotate-180" size={18} />
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation / Next Article */}
        <div className="flex justify-between items-center px-4">
           <Link to="/blog" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 flex items-center gap-2">
             <ArrowLeft size={16} /> Back to Library
           </Link>
           <div className="flex gap-4">
              <a href="https://twitter.com/intent/tweet" target="_blank" className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all shadow-sm"><Twitter size={18}/></a>
              <a href="https://www.linkedin.com/sharing/share-offsite/" target="_blank" className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm"><Linkedin size={18}/></a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
