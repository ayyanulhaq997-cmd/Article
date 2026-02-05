
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
  Settings 
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
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
  
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
    const cloudArticles = await db.getAllArticles();
    
    // Check if cloud works with provided keys
    const hasUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const hasKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    if (hasUrl && hasKey) {
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
    
    // Save to Cloud!
    const success = await db.saveArticle(articleToSave);
    
    if (success) {
      alert('GLOBAL SUCCESS: Article is now live for EVERYONE on the website!');
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
      // Fallback to local storage if DB keys are missing or request fails
      const currentLocal = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      localStorage.setItem('ayyan_articles', JSON.stringify([...currentLocal, articleToSave]));
      alert('LOCAL ONLY: Cloud sync failed or credentials missing. Article saved to your browser only.');
      loadData();
    }
    setIsSyncing(false);
  };

  const deleteArticle = async (id: string) => {
    if (confirm('Delete this article from the Cloud?')) {
      setIsSyncing(true);
      const success = await db.deleteArticle(id);
      if (success) {
        alert('Deleted from Cloud Database.');
      } else {
        // Try local storage delete as fallback
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
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border ${dbStatus === 'online' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {dbStatus === 'online' ? <Globe size={14} /> : <AlertTriangle size={14} />}
                {dbStatus === 'online' ? 'Cloud Database Connected' : 'Local Preview Only'}
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

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Recent Transactions</h3>
              <div className="space-y-4">
                {sales.length > 0 ? sales.slice(-5).reverse().map((sale, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"><ShoppingCart size={18} className="text-green-500" /></div>
                      <div><p className="font-bold text-slate-900 text-sm">{sale.name}</p><p className="text-xs text-slate-400">{new Date(sale.timestamp).toLocaleDateString()}</p></div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">+${sale.price}</div>
                  </div>
                )) : <div className="text-center py-12 text-slate-400 italic">No sales recorded yet.</div>}
              </div>
            </div>
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
                      <Type size={14} className="text-blue-500" /> Short Excerpt (Summary for the List)
                    </label>
                    <textarea rows={2} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Appears below the title on the Blog page..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                      <AlignLeft size={14} className="text-blue-500" /> Intro Highlight Box (Preamble)
                    </label>
                    <textarea rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm" value={newArticle.introText} onChange={e => setNewArticle({...newArticle, introText: e.target.value})} placeholder="Highlighted summary block at the start of the post..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Main Article Content</label>
                    <textarea rows={10} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Full Markdown/Text content..." />
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
              <div className="bg-slate-900 p-6 rounded-3xl text-white">
                 <h4 className="text-sm font-black text-blue-400 uppercase mb-2 flex items-center gap-2 tracking-widest"><Settings size={16}/> Sync Status</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">
                   {dbStatus === 'online' 
                    ? "Live Cloud Database is active. Every article you publish here is visible to the entire world instantly." 
                    : "No Cloud DB detected. Articles are being stored locally in your browser. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."}
                 </p>
              </div>
              
              <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest ml-4">Global Inventory</h3>
              <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
                {isSyncing && allArticles.length === 0 ? (
                  <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
                ) : allArticles.slice().reverse().map((a: Article) => (
                  <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-blue-200 transition-all">
                    <img src={a.image || 'https://picsum.photos/seed/tech/100'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{a.title}</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[10px] text-blue-600 font-black tracking-tight uppercase">{a.category}</p>
                         {!ARTICLES.find(sa => sa.id === a.id) && (
                           <span className="text-[8px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-black uppercase">Live</span>
                         )}
                      </div>
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

        {activeTab === 'sales' && (
          <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Earnings Report</h3>
               <div className="px-8 py-4 bg-green-50 text-green-600 rounded-[1.5rem] font-black text-2xl border border-green-100">${totalRevenue.toFixed(2)}</div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-slate-100 font-black text-xs text-slate-400 uppercase tracking-widest">
                     <th className="pb-4">Date</th>
                     <th className="pb-4">Product</th>
                     <th className="pb-4 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                   {sales.slice().reverse().map((sale, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="py-6 text-slate-500">{new Date(sale.timestamp).toLocaleDateString()}</td>
                       <td className="py-6 font-bold text-slate-900">{sale.name}</td>
                       <td className="py-6 font-black text-green-600 text-right">+${sale.price.toFixed(2)}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
