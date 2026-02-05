
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
  Code,
  Key,
  Save,
  RefreshCw,
  Info,
  XCircle
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
      setDbStatus(cloudArticles.length >= 0 ? 'online' : 'offline');
    } else {
      setDbStatus('offline');
    }

    setAllArticles([...ARTICLES, ...cloudArticles]);
    const savedSales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
    setSales(savedSales);
    setIsSyncing(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'admin123') {
      setIsLoggedIn(true);
      sessionStorage.setItem('ayyan_admin_auth', 'true');
    } else {
      alert('Access Denied.');
    }
  };

  const handleTestConnection = async () => {
    setTestResult({ message: 'Testing connection...' });
    const res = await db.testConnection();
    setTestResult(res);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.includes('postgres://')) {
      alert("WARNING: You are using a PostgreSQL connection string instead of the PROJECT URL. Please use the URL starting with https:// from the Supabase 'API' settings page.");
      return;
    }
    db.setManualCredentials(manualUrl, manualKey);
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
    
    const result = await db.saveArticle(articleToSave);
    
    if (result.success) {
      alert('SUCCESS: Article is live globally.');
      setNewArticle({
        title: '', excerpt: '', introText: '', content: '',
        category: Category.Serverless, price: 45, image: '', isPLR: true
      });
      loadData();
    } else {
      const errorMsg = result.error || "Unknown Error";
      alert(`CLOUD SYNC FAILED: ${errorMsg}\n\nSaving a local copy to your browser for now.`);
      
      const currentLocal = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      localStorage.setItem('ayyan_articles', JSON.stringify([...currentLocal, articleToSave]));
      loadData();
    }
    setIsSyncing(false);
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Delete globally?')) {
      setIsSyncing(true);
      await db.deleteArticle(id);
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
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center"><Lock size={32} /></div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-6 uppercase tracking-tighter">Ayyan Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={key} onChange={(e) => setKey(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono tracking-widest outline-none focus:ring-2 focus:ring-slate-900" placeholder="KEY: admin123" />
            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all">Verify</button>
          </form>
        </div>
      </div>
    );
  }

  const configs = db.getConfigs();
  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.price || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 hidden lg:flex border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="mb-12"><h2 className="text-xl font-black tracking-tighter gradient-text">AYYAN.ADMIN</h2></div>
        <nav className="space-y-2 flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}><LayoutDashboard size={18} /> Overview</button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}><PlusCircle size={18} /> Content Hub</button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}><DollarSign size={18} /> Sales</button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600' : 'text-slate-400 hover:text-white'}`}><Settings size={18} /> DB Config</button>
        </nav>
        <button onClick={() => { sessionStorage.clear(); window.location.reload(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 mt-auto"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-12 max-w-6xl mx-auto">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900">Dashboard</h1>
                <p className="text-slate-500 font-medium">Ayyan's premium tech platform management.</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${dbStatus === 'online' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {dbStatus === 'online' ? <Globe size={14} /> : <AlertTriangle size={14} />}
                {dbStatus === 'online' ? 'Supabase Connected' : 'Supabase Disconnected'}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><DollarSign size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase mb-1">Revenue</p><h3 className="text-3xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase mb-1">Sales</p><h3 className="text-3xl font-black text-slate-900">{sales.length}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Layers size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase mb-1">Total Posts</p><h3 className="text-3xl font-black text-slate-900">{allArticles.length}</h3></div>
              </div>
            </div>

            {dbStatus !== 'online' && (
              <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center shrink-0"><AlertTriangle size={40} /></div>
                <div>
                  <h3 className="text-xl font-black text-amber-900 mb-2 uppercase tracking-tight">Database Connectivity Warning</h3>
                  <p className="text-amber-800 text-sm mb-6 max-w-xl">Your cloud database is currently unreachable. You are working in <b>Local Offline Mode</b>. Any articles you publish now will only be visible in this browser until you fix the connection.</p>
                  <button onClick={() => setActiveTab('settings')} className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center gap-2 text-sm shadow-lg shadow-amber-200">
                    <Settings size={16} /> Troubleshoot Cloud Connection
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-10">
             <header>
               <h1 className="text-3xl font-black text-slate-900 mb-2">Cloud Configuration</h1>
               <p className="text-slate-500">Ensure your project is properly connected to Supabase.</p>
             </header>

             <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-blue-600"><Key size={20}/> Connection Details</h3>
                    <form onSubmit={handleSaveCredentials} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Project URL (API Settings)</label>
                        <input value={manualUrl} onChange={e => setManualUrl(e.target.value)} required placeholder="https://abc.supabase.co" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono" />
                        {manualUrl.startsWith('postgres') && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1"><XCircle size={10}/> THIS IS A CONNECTION STRING, NOT A URL!</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Anon Key (Public Key)</label>
                        <input value={manualKey} onChange={e => setManualKey(e.target.value)} required type="password" placeholder="The long JWT string..." className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-grow py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                          <Save size={18}/> Update Credentials
                        </button>
                        <button type="button" onClick={() => db.clearCredentials()} className="px-4 py-4 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold flex items-center gap-2 text-emerald-600"><Globe size={20}/> Status & Tools</h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <button onClick={handleTestConnection} className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                          <RefreshCw size={16} /> Run Diagnostic Test
                        </button>

                        {testResult && (
                          <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-3 ${testResult.success ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {testResult.success ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                            {testResult.message}
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-slate-200">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Setup Guide</h4>
                           <ul className="text-[10px] space-y-1 text-slate-500 font-medium">
                             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Go to Project Settings and then select API</li>
                             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Copy "Project URL" (Starts with https)</li>
                             <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full"></div> Copy "anon public" key</li>
                           </ul>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200"><Info size={24}/></div>
                  <div>
                    <h4 className="text-blue-900 font-black text-sm uppercase mb-1">Common Troubleshooting</h4>
                    <p className="text-xs text-blue-800 leading-relaxed mb-4">"Invalid Credentials" usually happens if you copy the <b>PostgreSQL URL</b> instead of the <b>Project URL</b>. If the connection test fails with "Table not found", you must run the SQL code below in your Supabase dashboard.</p>
                    <div className="bg-slate-900 p-4 rounded-2xl text-[9px] text-blue-300 font-mono overflow-auto max-h-40 border border-slate-800">
                      <pre>{`CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  introText TEXT,
  content TEXT,
  category TEXT,
  date TEXT,
  readTime TEXT,
  image TEXT,
  price NUMERIC,
  isPLR BOOLEAN DEFAULT true
);
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON articles FOR SELECT USING (true);
CREATE POLICY "Public Write" ON articles FOR INSERT WITH CHECK (true);`}</pre>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Zap className="text-blue-600" /> New Tech Post</h3>
                <form onSubmit={handleAddArticle} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="Title" />
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newArticle.price} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} placeholder="Price ($)" />
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="Image URL" />
                  </div>
                  <textarea rows={2} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Short summary..." />
                  <textarea rows={2} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" value={newArticle.introText} onChange={e => setNewArticle({...newArticle, introText: e.target.value})} placeholder="Intro Quote / Highlight text (Optional)..." />
                  <textarea rows={10} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-mono text-sm" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Article Content (Markdown allowed)..." />
                  <button type="submit" disabled={isSyncing} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">
                    {isSyncing ? <Loader2 className="animate-spin" /> : <Globe size={20} />} Publish Globally
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center ml-4">
                <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Active Inventory</h3>
                <button onClick={loadData} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><RefreshCw size={14} /></button>
              </div>
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {allArticles.slice().reverse().map((a: Article) => (
                  <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <img src={a.image || 'https://picsum.photos/seed/tech/100'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 text-xs line-clamp-1">{a.title}</p>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">{a.category}</p>
                    </div>
                    {!ARTICLES.find(sa => sa.id === a.id) && (
                      <button onClick={() => deleteArticle(a.id)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Earnings Report</h3>
               <div className="px-8 py-4 bg-green-50 text-green-600 rounded-[1.5rem] font-black text-2xl border border-green-100">${totalRevenue.toFixed(2)}</div>
             </div>
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="pb-4">Date</th>
                   <th className="pb-4">Product</th>
                   <th className="pb-4 text-right">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-sm">
                 {sales.slice().reverse().map((sale, i) => (
                   <tr key={i}>
                     <td className="py-6 text-slate-500">{new Date(sale.timestamp).toLocaleDateString()}</td>
                     <td className="py-6 font-bold text-slate-900">{sale.name}</td>
                     <td className="py-6 font-black text-green-600 text-right">+${(sale.price || 0).toFixed(2)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
