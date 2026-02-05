
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  PlusCircle, 
  LogOut, 
  Trash2, 
  Lock, 
  ShoppingCart, 
  Layers, 
  TrendingUp, 
  CheckCircle, 
  AlignLeft, 
  Type, 
  Globe, 
  AlertTriangle, 
  Zap, 
  Loader2, 
  Settings,
  Code
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category, Article } from '../types';
import { db } from '../supabaseService';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('ayyan_admin_auth') === 'true');
  const [key, setKey] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'sales'>('overview');
  
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    introText: '',
    content: '',
    category: Category.Serverless,
    price: 45,
    image: '',
    isPLR: true
  });

  const loadData = async () => {
    setIsSyncing(true);
    setDbStatus('checking');
    
    const cloudArticles = await db.getAllArticles();
    
    if (db.isConfigured()) {
      setDbStatus('online');
    } else {
      setDbStatus('offline');
    }

    setAllArticles([...ARTICLES, ...cloudArticles]);
    const savedSales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
    setSales(savedSales);
    setIsSyncing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('ayyan_admin_auth', 'true');
    } else {
      alert('Access Denied: Invalid Master Key.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('ayyan_admin_auth');
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    const id = `art-${Date.now()}`;
    const articleToSave: Article = { 
      ...newArticle, 
      id, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '5 min'
    };
    
    const success = await db.saveArticle(articleToSave);
    
    if (success) {
      alert('SUCCESS: Published to Cloud.');
      setNewArticle({
        title: '',
        excerpt: '',
        introText: '',
        content: '',
        category: Category.Serverless,
        price: 45,
        image: '',
        isPLR: true
      });
      loadData();
    } else {
      const currentLocal = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      localStorage.setItem('ayyan_articles', JSON.stringify([...currentLocal, articleToSave]));
      alert('SYNC ERROR: Saved locally. Check console for details.');
      loadData();
    }
    setIsSyncing(false);
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Delete this article?')) {
      setIsSyncing(true);
      const success = await db.deleteArticle(id);
      if (!success) {
        const currentLocal = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
        localStorage.setItem('ayyan_articles', JSON.stringify(currentLocal.filter((a: any) => a.id !== id)));
      }
      loadData();
      setIsSyncing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <SEO title="Restricted Access" description="Admin management." />
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-200">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-6 uppercase tracking-tighter">Master Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={key} 
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-slate-900 transition-all text-center font-mono tracking-widest"
              placeholder="ENTER MASTER KEY"
              autoFocus
              required
            />
            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200">
              Verify Identity
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
  const soldCount = new Set(sales.map(s => s.id)).size;
  const configs = db.getConfigs();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 hidden lg:flex border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-xl font-black tracking-tighter gradient-text">AYYAN.ADMIN</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <PlusCircle size={18} /> Global Content
          </button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-blue-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <DollarSign size={18} /> Transactions
          </button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 transition-all mt-auto border-t border-slate-800 pt-6">
          <LogOut size={18} /> Exit Secret Mode
        </button>
      </aside>

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-12 max-w-6xl mx-auto">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900">Platform Health</h1>
                <p className="text-slate-500 font-medium">Real-time status of your global tech writing platform.</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${dbStatus === 'online' ? 'bg-green-50 text-green-600 border-green-100' : dbStatus === 'checking' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {dbStatus === 'online' ? <Globe size={14} /> : dbStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                {dbStatus === 'online' ? 'Cloud Database Connected' : dbStatus === 'checking' ? 'Verifying Cloud...' : 'Cloud Disconnected'}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><DollarSign size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Revenue</p><h3 className="text-3xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</p><h3 className="text-3xl font-black text-slate-900">{soldCount}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Layers size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Live Posts</p><h3 className="text-3xl font-black text-slate-900">{allArticles.length}</h3></div>
              </div>
            </div>

            {dbStatus !== 'online' && (
              <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black text-red-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                  <AlertTriangle size={24} /> Supabase Configuration Required
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-red-800">Your environment is missing the following keys:</p>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl border border-red-200 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase">VITE_SUPABASE_URL</span>
                        <span className={configs.url === 'MISSING' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{configs.url === 'MISSING' ? 'MISSING' : 'FOUND'}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-red-200 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400 uppercase">VITE_SUPABASE_ANON_KEY</span>
                        <span className={configs.key === 'MISSING' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>{configs.key}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/50 rounded-2xl text-[11px] text-red-700 leading-relaxed italic">
                      Add these to your environment variables or .env file and restart your application.
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-red-800 flex items-center gap-2"><Code size={16}/> Database Setup:</p>
                    <div className="bg-slate-900 text-blue-300 p-6 rounded-3xl text-[10px] font-mono leading-relaxed overflow-x-auto h-48 border border-slate-800">
                      <pre>{`CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  date TEXT,
  image TEXT,
  price NUMERIC
);
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON articles FOR SELECT USING (true);
CREATE POLICY "Public Write" ON articles FOR INSERT WITH CHECK (true);`}</pre>
                    </div>
                    <p className="text-[10px] text-red-600 font-medium">Run this SQL in your Supabase Dashboard to create the required table structure.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Zap className="text-blue-600" /> Publish New Post</h3>
                <form onSubmit={handleAddArticle} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Title</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="Article Title" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Topic</label>
                      <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}>
                        {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price ($)</label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.price} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Thumbnail URL</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                      <Type size={14} className="text-blue-500" /> Short Excerpt
                    </label>
                    <textarea rows={2} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Short summary..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Main Article Content</label>
                    <textarea rows={10} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Markdown allowed..." />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSyncing}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSyncing ? <Loader2 className="animate-spin" /> : <Globe size={20} />}
                    Publish Globally
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                 <h4 className="text-sm font-black text-blue-400 uppercase mb-4 flex items-center gap-2 tracking-widest"><Settings size={16}/> Supabase Status</h4>
                 <div className="space-y-2 text-[10px] font-mono text-slate-400">
                    <p>ENDPOINT: {configs.url.substring(0, 30)}...</p>
                    <p>STATUS: {dbStatus.toUpperCase()}</p>
                 </div>
              </div>
              
              <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest ml-4">Inventory</h3>
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {allArticles.slice().reverse().map((a: Article) => (
                  <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
                    <img src={a.image || 'https://picsum.photos/seed/tech/100'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{a.title}</p>
                      <p className="text-[10px] text-blue-600 font-black tracking-tight uppercase">{a.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!ARTICLES.find(sa => sa.id === a.id) && (
                        <button onClick={() => deleteArticle(a.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
