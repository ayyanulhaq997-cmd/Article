
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  ShoppingCart, 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Copy, 
  Check, 
  Type, 
  Plus, 
  Minus, 
  RefreshCcw,
  MessageCircle,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { getArticleSummary } from '../geminiService';
import SEO from '../components/SEO';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(18); // Default 18px (prose-lg equivalent)
  
  const article = ARTICLES.find(a => a.id === id);

  if (!article) return <div className="text-center py-20 font-bold">Article not found.</div>;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const res = await getArticleSummary(article.excerpt + " " + article.content);
    setSummary(res);
    setIsSummarizing(false);
  };

  const shareUrl = window.location.href;
  const shareTitle = article.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const changeFontSize = (delta: number) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 14), 32));
  };

  // Specific share URLs that pre-fill article title and URL
  // Pre-filling with a specific template for better Twitter/X engagement
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle}\n\nRead more at: `)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this article by Ayyan u l Haq:\n\n${shareTitle}\n\n${shareUrl}`)}`,
  };

  return (
    <div className="pb-20">
      <SEO 
        title={`${article.title} | Ayyan's Tech Hub`}
        description={article.excerpt}
        keywords={`${article.category}, tech tutorial, ${article.title.split(' ').slice(0, 3).join(', ')}`}
        ogImage={article.image}
        ogType="article"
      />
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
            {/* Top Bar with Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-50">
              <div className="flex items-center flex-wrap gap-3">
                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button 
                    onClick={() => changeFontSize(-2)}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                    title="Decrease font size"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="px-4 flex items-center gap-2 text-sm font-bold text-slate-700 min-w-[100px] justify-center">
                    <Type size={14} className="text-blue-600" /> {fontSize}px
                  </div>
                  <button 
                    onClick={() => changeFontSize(2)}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"
                    title="Increase font size"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {/* Copy Link Button with Visual Feedback */}
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                    copied 
                    ? 'bg-green-50 text-green-600 border-green-200 shadow-green-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                  }`}
                  title="Copy article link"
                >
                  {copied ? <Check size={14} /> : <LinkIcon size={14} />}
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </button>

                <button 
                  onClick={() => setFontSize(18)}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100"
                  title="Reset font size"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>

              {/* Quick Summary Trigger */}
              {!summary && !isSummarizing && (
                <button 
                  onClick={handleSummarize}
                  className="flex items-center gap-2 text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  <Sparkles size={14} /> Quick AI Summary
                </button>
              )}
            </div>

            {/* AI Summary Box */}
            {(summary || isSummarizing) && (
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 font-bold text-indigo-900 mb-3">
                  <Sparkles size={20} className="text-indigo-600" /> AI Insights
                </div>
                {isSummarizing ? (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                    <div className="text-indigo-400 text-sm font-medium">Distilling core tech concepts...</div>
                  </div>
                ) : (
                  <p className="text-indigo-800 text-sm leading-relaxed italic">
                    "{summary}"
                  </p>
                )}
              </div>
            )}

            {/* Article Content with Dynamic Font Size */}
            <article 
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed transition-all duration-300"
              style={{ fontSize: `${fontSize}px` }}
            >
              <p className="font-semibold text-slate-900" style={{ fontSize: `${fontSize * 1.15}px` }}>
                {article.excerpt}
              </p>
              
              <div className="mt-8 space-y-6">
                <p>
                  Building modern serverless applications requires a shift in how we think about infrastructure. 
                  Instead of managing servers, we focus on functions and services that scale automatically based on demand. 
                  This not only reduces operational overhead but also enables developers to iterate faster and deliver value 
                  to users more efficiently.
                </p>
                
                <h2 className="text-slate-900 font-bold" style={{ fontSize: `${fontSize * 1.4}px` }}>The Core Concepts</h2>
                <p>
                  At its heart, {article.title.split(':')[0]} is about abstraction. Whether you're working with AWS Lambda, 
                  Google Cloud Functions, or specialized SaaS platforms, the goal is always the same: let the platform 
                  handle the "boring" parts of scaling, patching, and availability.
                </p>

                <ul className="list-disc pl-6 space-y-4">
                  <li><strong>Pay-as-you-go:</strong> Only pay for the compute time you actually consume.</li>
                  <li><strong>Auto-scaling:</strong> From zero to thousands of concurrent requests without manual intervention.</li>
                  <li><strong>Event-driven:</strong> Trigger logic based on database changes, file uploads, or HTTP requests.</li>
                </ul>

                <p>
                  {article.content} [Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                  aliquip ex ea commodo consequat.]
                </p>
              </div>
              
              <h2 className="text-slate-900 font-bold mt-12 mb-6" style={{ fontSize: `${fontSize * 1.4}px` }}>Key Takeaways</h2>
              <ul className="list-disc pl-6 space-y-4">
                <li>Serverless architecture reduces operational overhead significantly.</li>
                <li>SaaS models provide predictable recurring revenue for modern tech firms.</li>
                <li>Cloud security is a shared responsibility model.</li>
              </ul>
            </article>

            {/* Marketplace Callout */}
            {article.price && (
              <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white text-center shadow-xl shadow-slate-200">
                <h3 className="text-2xl font-bold mb-4">Want to publish this on your blog?</h3>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">This article is available for purchase with full PLR rights. You'll get the full source, high-res image, and distribution rights.</p>
                <Link to={`/checkout?id=${article.id}`} className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                  <ShoppingCart size={20} /> Buy Full Rights for ${article.price}
                </Link>
              </div>
            )}

            {/* Social Share Enhanced */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Share2 size={16} className="text-blue-600" /> Share
                </span>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={shareLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-black hover:text-white transition-all"
                    title="Share on X (Twitter)"
                  >
                    <Twitter size={18} />
                  </a>
                  <a 
                    href={shareLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#0077b5] hover:text-white transition-all"
                    title="Share on LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a 
                    href={shareLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#1877f2] hover:text-white transition-all"
                    title="Share on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a 
                    href={shareLinks.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-[#25D366] hover:text-white transition-all"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <a 
                    href={shareLinks.email} 
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
                    title="Share via Email"
                  >
                    <Mail size={18} />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                      copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'
                    }`}
                    title="Copy Link"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
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
