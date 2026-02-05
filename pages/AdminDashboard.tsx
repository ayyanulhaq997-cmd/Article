
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  PlusCircle, 
  LogOut, 
  Package, 
  Image as ImageIcon,
  Trash2,
  Lock,
  ShoppingCart,
  Layers,
  TrendingUp,
  ExternalLink,
  /* Added missing CheckCircle import */
  CheckCircle
} from 'lucide-react';
import { ARTICLES } from '../constants';
import { Category } from '../types';
import SEO from '../components/SEO';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    // Load articles (Constants + Local)
    const savedArticles = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
    setAllArticles([...ARTICLES, ...savedArticles]);
    
    // Load sales
    const savedSales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
    setSales(savedSales);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'ayyan@techhub.com' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use ayyan@techhub.com / admin123');
    }
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
    if (confirm('Permanently delete this article from your hub?')) {
      const currentDynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
      const updated = currentDynamic.filter((a: any) => a.id !== id);
      localStorage.setItem('ayyan_articles', JSON.stringify(updated));
      setAllArticles([...ARTICLES, ...updated]);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <SEO title="Admin Login" description="Secure access to the Tech Hub dashboard." />
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-center text-slate-900 mb-2">Admin Hub</h1>
          <p className="text-center text-slate-500 mb-8 font-medium italic">Ayyan u l Haq • Tech Management</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="ayyan@techhub.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Access Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 mt-4">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CALCULATION LOGIC
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.price, 0);
  
  // An article is considered "Sold" if its ID exists in the sales records.
  const soldArticleIds = new Set(sales.map(s => s.id));
  const soldCount = soldArticleIds.size;
  const unsoldCount = allArticles.length - soldCount;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SEO title="Admin Dashboard" description="Ayyan's Tech Hub Administration" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 hidden lg:flex border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-xl font-black tracking-tighter gradient-text">AYYAN.ADMIN</h2>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Overview
          </button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <PlusCircle size={18} /> Manage Articles
          </button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'sales' ? 'bg-blue-600 shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <DollarSign size={18} /> Sales & Earnings
          </button>
        </nav>

        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 transition-all mt-auto border-t border-slate-800 pt-6">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-12 max-w-6xl mx-auto">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900">Platform Health</h1>
                <p className="text-slate-500 font-medium">Monitoring articles and revenue performance.</p>
              </div>
              <div className="text-right hidden md:block">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Last Update</span>
                <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
              </div>
            </header>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <DollarSign size={32} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Articles Sold</p>
                  <h3 className="text-3xl font-black text-slate-900">{soldCount}</h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Layers size={32} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Not Sold</p>
                  <h3 className="text-3xl font-black text-slate-900">{unsoldCount < 0 ? 0 : unsoldCount}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* RECENT SALES */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" /> Recent Activity
                </h3>
                <div className="space-y-6">
                  {sales.length > 0 ? sales.slice(-5).reverse().map((sale, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <ShoppingCart size={18} className="text-green-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{sale.name}</p>
                          <p className="text-xs text-slate-500">{new Date(sale.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="font-black text-slate-900 text-sm">+${sale.price}</div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-slate-400 italic text-sm">Waiting for first sale...</div>
                  )}
                </div>
              </div>

              {/* QUICK ADD TIP */}
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-bold mb-4 relative z-10">Daily Publishing</h3>
                <p className="text-slate-400 mb-8 leading-relaxed relative z-10">
                  Consistency is key. Publishing tech articles daily helps with SEO and authority. Use the 
                  "Manage Articles" tab to add your latest writing.
                </p>
                <button 
                  onClick={() => setActiveTab('articles')}
                  className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all inline-flex items-center gap-2 relative z-10"
                >
                  Post Article Now <PlusCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* ARTICLE FORM */}
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm sticky top-12">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <PlusCircle className="text-blue-600" /> Publish Daily Article
                </h3>
                <form onSubmit={handleAddArticle} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Article Title</label>
                      <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} placeholder="e.g. Master AWS Lambda" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price (USD)</label>
                      <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={newArticle.price} onChange={e => setNewArticle({...newArticle, price: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                      <ImageIcon size={14} /> Picture URL
                    </label>
                    <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={newArticle.image} onChange={e => setNewArticle({...newArticle, image: e.target.value})} placeholder="https://unsplash.com/photos/..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value as any})}>
                      {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Short Excerpt</label>
                    <textarea rows={2} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} placeholder="Brief hook for the reader..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Article Body</label>
                    <textarea rows={8} required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})} placeholder="Write your technical content here..." />
                  </div>
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                    Publish to Blog Hub
                  </button>
                </form>
              </div>
            </div>
            
            {/* LIVE INVENTORY */}
            <div className="space-y-6">
              <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest ml-4">Live Inventory</h3>
              <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                {allArticles.slice().reverse().map((a: any) => (
                  <div key={a.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                      <img src={a.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{a.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] text-blue-600 font-black">${a.price}</span>
                      </div>
                    </div>
                    {/* Delete only allowed for dynamically added articles for stability */}
                    {a.id.startsWith('art-') && (
                      <button onClick={() => deleteArticle(a.id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
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
               <div>
                <h3 className="text-2xl font-black text-slate-900">Earnings Ledger</h3>
                <p className="text-slate-500">History of all transactions on Ayyan's Tech Hub.</p>
               </div>
               <div className="px-8 py-4 bg-green-50 text-green-600 rounded-[1.5rem] font-black text-2xl border border-green-100">
                 ${totalRevenue.toFixed(2)}
               </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-slate-100">
                     <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest">Date</th>
                     <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest">Order ID</th>
                     <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest">Item Purchased</th>
                     <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                     <th className="pb-4 font-black text-xs text-slate-400 uppercase tracking-widest text-center">Receipt</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 text-sm">
                   {sales.slice().reverse().map((sale, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors group">
                       <td className="py-6 text-slate-500 font-medium">{new Date(sale.timestamp).toLocaleDateString()}</td>
                       <td className="py-6 font-mono text-slate-400 font-bold">{sale.orderId || 'N/A'}</td>
                       <td className="py-6 font-bold text-slate-900">{sale.name}</td>
                       <td className="py-6 font-black text-green-600 text-right">+${sale.price.toFixed(2)}</td>
                       <td className="py-6 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">Verified</span>
                       </td>
                     </tr>
                   ))}
                   {sales.length === 0 && (
                     <tr>
                      <td colSpan={5} className="py-32 text-center">
                        <div className="flex flex-col items-center gap-4 grayscale opacity-20">
                          <DollarSign size={64} />
                          <p className="italic font-bold">No sales data found in local storage.</p>
                        </div>
                      </td>
                     </tr>
                   )}
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
