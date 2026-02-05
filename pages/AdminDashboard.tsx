
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  PlusCircle, 
  LogOut, 
  Image as ImageIcon,
  Trash2,
  Lock,
  ShoppingCart,
  Layers,
  TrendingUp,
  CheckCircle,
  FileText
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category } from '../types';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  // Use sessionStorage so closing the tab logs you out for better privacy
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem('ayyan_admin_auth') === 'true');
  const [key, setKey] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'sales'>('overview');
  
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: Category.Serverless,
    price: 45,
    image: '',
    isPLR: true
  });

  useEffect(() => {
    const savedArticles = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
    setAllArticles([...ARTICLES, ...savedArticles]);
    const savedSales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
    setSales(savedSales);
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

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `art-${Date.now()}`;
    const articleToSave = { 
      ...newArticle, 
      id, 
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '5 min'
    };
    
    const currentDynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
    const updated = [...currentDynamic, articleToSave];
    localStorage.setItem('ayyan_articles', JSON.stringify(updated));
    
    setAllArticles([...ARTICLES, ...updated]);
    setNewArticle({
      title: '',
      excerpt: '',
      content: '',
      category: Category.Serverless,
      price: 45,
      image: '',
      isPLR: true
    });
    alert('Article published successfully!');
  };

  const deleteArticle = (id: string) => {
    if (confirm('Delete this article?')) {
      const currentDynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      const updated = currentDynamic.filter((a: any) => a.id !== id);
      localStorage.setItem('ayyan_articles', JSON.stringify(updated));
      setAllArticles([...ARTICLES, ...updated]);
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
  const soldArticleIds = new Set(sales.map(s => s.id));
  const soldCount = soldArticleIds.size;
  const unsoldCount = allArticles.length - soldCount;

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
            <PlusCircle size={18} /> Manage Content
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
            <header>
              <h1 className="text-4xl font-black text-slate-900">Platform Health</h1>
              <p className="text-slate-500 font-medium">Real-time status of your tech writing business.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><DollarSign size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</p><h3 className="text-3xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Sold Items</p><h3 className="text-3xl font-black text-slate-900">{soldCount}</h3></div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center"><Layers size={32} /></div>
                <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Not Sold</p><h3 className="text-3xl font-black text-slate-900">{unsoldCount < 0 ? 0 : unsoldCount}</h3></div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Recent Activity</h3>
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
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><PlusCircle className="text-blue-600" /> New Tech Post</h3>
                <form onSubmit={handleAddArticle} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Title</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price (USD)</label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.price} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Image Link</label>
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="https://unsplash.com/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Content Body</label>
                    <textarea rows={8} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">Publish Article</button>
                </form>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest ml-4">Live Inventory</h3>
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                {allArticles.slice().reverse().map((a: any) => (
                  <div key={a.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <img src={a.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-grow"><p className="font-bold text-slate-900 text-sm line-clamp-1">{a.title}</p><p className="text-[10px] text-blue-600 font-black">${a.price}</p></div>
                    {a.id.startsWith('art-') && <button onClick={() => deleteArticle(a.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm max-w-6xl mx-auto">
             <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
               <h3 className="text-2xl font-black text-slate-900">Earnings Ledger</h3>
               <div className="px-8 py-4 bg-green-50 text-green-600 rounded-[1.5rem] font-black text-2xl border border-green-100">${totalRevenue.toFixed(2)}</div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-slate-100 font-black text-xs text-slate-400 uppercase tracking-widest">
                     <th className="pb-4">Date</th>
                     <th className="pb-4">Order ID</th>
                     <th className="pb-4">Item</th>
                     <th className="pb-4 text-right">Revenue</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                   {sales.slice().reverse().map((sale, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="py-6 text-slate-500">{new Date(sale.timestamp).toLocaleDateString()}</td>
                       <td className="py-6 font-mono text-slate-400 font-bold">{sale.orderId || 'N/A'}</td>
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
