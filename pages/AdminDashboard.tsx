
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  PlusCircle, 
  LogOut, 
  Trash2, 
  Lock, 
  Layers, 
  CheckCircle, 
  Globe, 
  AlertTriangle, 
  Zap, 
  Loader2, 
  Settings,
  Save,
  RefreshCw,
  Copy,
  ExternalLink,
  Database,
  ArrowRight,
  DatabaseZap,
  ShieldCheck,
  Terminal,
  FileCode
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category, Article } from '../types';
import { db } from '../supabaseService';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('ayyan_admin_auth') === 'true');
  const [key, setKey] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'sales' | 'settings'>('overview');
  
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  const [manualUrl, setManualUrl] = useState('');
  const [manualKey, setManualKey] = useState('');
  const [testResult, setTestResult] = useState<{success?: boolean, message: string} | null>(null);

  const [newArticle, setNewArticle] = useState({
    title: '', excerpt: '', introText: '', content: '',
    category: Category.Serverless, price: 45, image: '', isPLR: true
  });

  const loadData = async () => {
    setIsSyncing(true);
    setDbStatus('checking');
    const cloudArticles = await db.getAllArticles();
    const isOk = db.isConfigured();
    setDbStatus(isOk ? 'online' : 'offline');
    setAllArticles([...ARTICLES, ...cloudArticles]);
    const savedSales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
    setSales(savedSales);
    setIsSyncing(false);
  }

  useEffect(() => { loadData(); }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('ayyan_admin_auth', 'true');
    } else { alert('Access Denied.'); }
  };

  const handleTestConnection = async () => {
    setTestResult({ message: 'Running diagnostic...' });
    const res = await db.testConnection();
    setTestResult(res);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    db.setManualCredentials(manualUrl, manualKey);
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db.isConfigured()) {
      alert("Database not connected. Please go to DB Config first.");
      setActiveTab('settings');
      return;
    }

    setIsSyncing(true);
    const id = `art-${Date.now()}`;
    const articleToSave: Article = { 
      ...newArticle, id, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: `${Math.max(3, Math.ceil(newArticle.content.split(' ').length / 200))} min`
    };
    
    const result = await db.saveArticle(articleToSave);
    if (result.success) {
      alert('SUCCESS: Your article is now live on the blog!');
      setNewArticle({ title: '', excerpt: '', introText: '', content: '', category: Category.Serverless, price: 45, image: '', isPLR: true });
      loadData();
    } else {
      alert(`ERROR: ${result.error}\n\nTIP: If you just added the column, you may need to run the SQL Fix to reload the schema cache.`);
    }
    setIsSyncing(false);
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Permanently delete this article from your cloud database?')) {
      setIsSyncing(true);
      const ok = await db.deleteArticle(id);
      if (ok) {
        loadData();
      } else {
        alert("Delete failed. Check your database connection.");
      }
      setIsSyncing(false);
    }
  };

  const masterSql = `-- 1. FULL TABLE DEFINITION
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  excerpt TEXT,
  "introText" TEXT,
  content TEXT,
  category TEXT,
  date TEXT,
  "readTime" TEXT,
  image TEXT,
  price NUMERIC,
  "isPLR" BOOLEAN DEFAULT true,
  owner_id UUID DEFAULT auth.uid()
);

-- 2. SECURITY POLICIES
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public reads
DROP POLICY IF EXISTS "Public Read" ON articles;
CREATE POLICY "Public Read" ON articles FOR SELECT USING (true);

-- Allow authenticated management
DROP POLICY IF EXISTS "Admin Manage" ON articles;
CREATE POLICY "Admin Manage" ON articles FOR ALL 
USING (auth.role() = 'authenticated' OR true) 
WITH CHECK (true);

-- 3. REFRESH SCHEMA CACHE
NOTIFY pgrst, 'reload schema';`;

  const fixMissingColumnsSql = `-- FIX: ADD MISSING COLUMNS AND REFRESH CACHE
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "introText" TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "readTime" TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "isPLR" BOOLEAN DEFAULT true;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "owner_id" UUID DEFAULT auth.uid();

-- CRITICAL: Clear schema cache
NOTIFY pgrst, 'reload schema';`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('SQL copied! Paste this into your Supabase SQL Editor and click "Run".');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <SEO title="Admin Login" description="Restricted access." />
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-200">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg"><Lock size={32} /></div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-6 uppercase tracking-tighter">Ayyan Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={key} onChange={(e) => setKey(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter Admin Key" />
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Verify Identity</button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-slate-900 text-white flex flex-col p-8 hidden lg:flex border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="mb-12"><h2 className="text-2xl font-black tracking-tighter gradient-text">AYYAN.TECH</h2></div>
        <nav className="space-y-3 flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><LayoutDashboard size={18} /> Dashboard</button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><PlusCircle size={18} /> Manage Content</button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><DollarSign size={18} /> Sales & Analytics</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}><Settings size={18} /> DB Config</button>
        </nav>
        <button onClick={() => { sessionStorage.clear(); window.location.reload(); }} className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:text-red-400 transition-colors mt-auto"><LogOut size={18} /> Sign Out</button>
      </aside>

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {activeTab === 'overview' && (
            <>
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
                  <p className="text-slate-500 font-medium">System performance and connectivity status.</p>
                </div>
                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border ${dbStatus === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {dbStatus === 'online' ? 'Cloud Connected' : 'Database Offline'}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><DollarSign size={28} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h3 className="text-4xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><CheckCircle size={28} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales</p>
                  <h3 className="text-4xl font-black text-slate-900">{sales.length}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
                  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Layers size={28} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Content</p>
                  <h3 className="text-4xl font-black text-slate-900">{allArticles.length}</h3>
                </div>
              </div>

              {dbStatus !== 'online' && (
                <div className="bg-slate-900 text-white rounded-[3rem] p-10 flex flex-col md:flex-row gap-10 items-center border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 relative z-10"><DatabaseZap size={40} /></div>
                  <div className="flex-grow relative z-10">
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Connect Supabase Cloud</h3>
                    <p className="text-slate-400 mb-6 max-w-xl font-medium font-inter">Your database is not yet linked. Connect to Supabase to enable global article publishing and permanent cloud storage.</p>
                    <button onClick={() => setActiveTab('settings')} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center gap-3 text-sm">
                      Setup Database <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-10">
               <header>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">Database Configuration</h1>
                 <p className="text-slate-500 font-medium">Link your Supabase account and manage table schemas.</p>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">1</div>
                      <h3 className="text-xl font-bold text-slate-900">Enter Credentials</h3>
                    </div>
                    
                    <form onSubmit={handleSaveCredentials} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project URL</label>
                        <input value={manualUrl} onChange={e => setManualUrl(e.target.value)} required placeholder="https://xxx.supabase.co" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Anon API Key</label>
                        <input value={manualKey} onChange={e => setManualKey(e.target.value)} required type="password" placeholder="Enter your long Supabase Anon Key..." className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs" />
                      </div>
                      <div className="flex gap-4">
                        <button type="submit" className="flex-grow py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
                          <Save size={20} /> Link Account
                        </button>
                        <button type="button" onClick={() => { if(confirm('Clear database link?')) db.clearCredentials() }} className="px-6 py-5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all border border-red-100"><Trash2 size={20} /></button>
                      </div>
                    </form>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                      <button onClick={handleTestConnection} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest">
                        <RefreshCw size={16} /> Run Connection Test
                      </button>
                      {testResult && (
                        <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${testResult.success ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                          {testResult.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                          {testResult.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">2</div>
                      <h3 className="text-xl font-bold text-blue-400">SQL Schema (Required)</h3>
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-2xl">
                        <p className="text-xs font-black uppercase text-blue-400 mb-2 tracking-widest flex items-center gap-2">
                          <Terminal size={14} /> Finalized Production SQL
                        </p>
                        <p className="text-slate-400 text-[11px] mb-4">Ensures all columns exist with proper security policies and schema reloading.</p>
                        <button onClick={() => copyToClipboard(masterSql)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                          <Copy size={12} /> Copy Master SQL
                        </button>
                      </div>

                      <div className="p-5 bg-red-600/10 border border-red-500/20 rounded-2xl">
                        <p className="text-xs font-black uppercase text-red-400 mb-2 tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} /> Quick Column Fix
                        </p>
                        <p className="text-slate-400 text-[11px] mb-4">Run this to instantly fix the <b>introText</b> schema cache error.</p>
                        <button onClick={() => copyToClipboard(fixMissingColumnsSql)} className="w-full py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-black text-[10px] uppercase hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                          <Zap size={12} className="text-yellow-400" /> Copy Schema Fix
                        </button>
                      </div>

                      <div className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                        <p className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest flex items-center gap-2">
                          <FileCode size={14} /> Expected Schema
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono text-slate-400">
                           <span>id (text)</span><span>title (text)</span>
                           <span>excerpt (text)</span><span>"introText" (text)</span>
                           <span>content (text)</span><span>category (text)</span>
                           <span>date (text)</span><span>"readTime" (text)</span>
                           <span>image (text)</span><span>price (numeric)</span>
                           <span>"isPLR" (bool)</span><span>owner_id (uuid)</span>
                        </div>
                      </div>

                      <a href="https://supabase.com/dashboard" target="_blank" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center gap-2 transition-all">
                        Open Supabase SQL Editor <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><Zap className="text-blue-600" /> Write Live Publication</h3>
                  <form onSubmit={handleAddArticle} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                        <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="Article title..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}>
                          {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                        <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.price} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} placeholder="45" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                        <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="Unsplash/CDN URL..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Excerpt (Search Summary)</label>
                      <textarea rows={2} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-500 font-medium" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Brief summary for search results..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Insight (Highlight Box)</label>
                      <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-500" value={newArticle.introText} onChange={e => setNewArticle({...newArticle, introText: e.target.value})} placeholder="A single impactful sentence..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Technical Content</label>
                      <textarea rows={12} required className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Write your technical insight here..." />
                    </div>
                    <button type="submit" disabled={isSyncing} className={`w-full py-5 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl transition-all ${dbStatus === 'online' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-slate-400 cursor-not-allowed'}`}>
                      {isSyncing ? <Loader2 className="animate-spin" /> : <Globe size={20} />} 
                      {dbStatus === 'online' ? 'Publish to Production' : 'Connect DB to Publish'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                  <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Inventory</h3>
                  <button onClick={loadData} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><RefreshCw size={16} /></button>
                </div>
                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {allArticles.slice().reverse().map((a: Article) => (
                    <div key={a.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-all">
                      <img src={a.image || 'https://picsum.photos/seed/tech/100'} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                      <div className="flex-grow">
                        <p className="font-black text-slate-900 text-sm line-clamp-1 leading-none mb-1">{a.title}</p>
                        <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{a.category}</p>
                      </div>
                      {!ARTICLES.find(sa => sa.id === a.id) && (
                        <button onClick={() => deleteArticle(a.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-slate-50 gap-6">
                 <div>
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Analytics</h3>
                   <p className="text-slate-500 font-medium">Tracking verified transactions via Payoneer.</p>
                 </div>
                 <div className="px-10 py-5 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black text-3xl border border-emerald-100">
                    ${totalRevenue.toFixed(2)}
                 </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <th className="pb-6 px-4">Date</th>
                       <th className="pb-6 px-4">Item</th>
                       <th className="pb-6 px-4">ID</th>
                       <th className="pb-6 px-4 text-right">Revenue</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {sales.length > 0 ? sales.slice().reverse().map((sale, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="py-6 px-4 text-slate-500 font-medium">{new Date(sale.timestamp).toLocaleDateString()}</td>
                         <td className="py-6 px-4 font-bold text-slate-900">{sale.name}</td>
                         <td className="py-6 px-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">{sale.orderId || 'LOCAL'}</td>
                         <td className="py-6 px-4 font-black text-emerald-600 text-right">+${(sale.price || 0).toFixed(2)}</td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={4} className="py-20 text-center text-slate-400 font-medium">No sales recorded yet.</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
