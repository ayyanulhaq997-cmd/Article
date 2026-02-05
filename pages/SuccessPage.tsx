
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, PartyPopper, ShoppingBag, ArrowRight } from 'lucide-react';
import { ARTICLES, SERVICES } from '../constants';
import SEO from '../components/SEO';

const SuccessPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get('id');
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const staticArticle = ARTICLES.find(a => a.id === itemId);
    const service = SERVICES.find(s => s.id === itemId);
    const dynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
    const dynamicArticle = dynamic.find((a: any) => a.id === itemId);
    const foundItem = staticArticle || service || dynamicArticle;
    
    setItem(foundItem);

    if (foundItem) {
      // Record the sale for Admin Dashboard
      const sales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
      const alreadyRecorded = sales.some((s: any) => s.id === itemId && s.timestamp > Date.now() - 300000);
      
      if (!alreadyRecorded) {
        sales.push({
          id: itemId,
          name: foundItem.title || foundItem.name,
          price: foundItem.price,
          timestamp: Date.now()
        });
        localStorage.setItem('ayyan_sales', JSON.stringify(sales));
      }
    }
  }, [itemId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
      <SEO title="Payment Successful" description="Thank you for your purchase." />
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-slate-600 mb-8">
          Thank you for your purchase. Your content for <b>{item?.title || item?.name || 'your order'}</b> is being prepared.
        </p>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500 font-medium">Status</span>
            <span className="text-xs font-black text-green-600 uppercase">Confirmed</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <span className="text-sm font-bold text-slate-900">Amount Paid</span>
            <span className="text-lg font-black text-blue-600">${item?.price.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            to="/blog" 
            className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Continue Reading
          </Link>
          <Link 
            to="/" 
            className="block w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <PartyPopper size={16} /> Welcome to the Hub!
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
