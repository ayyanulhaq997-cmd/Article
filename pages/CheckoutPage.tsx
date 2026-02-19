
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Mail,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { ARTICLES, SERVICES } from '../constants';
import { db } from '../supabaseService';
import SEO from '../components/SEO';

const CheckoutPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get('id');
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      // 1. Check Hardcoded Articles
      const staticArticle = ARTICLES.find(a => a.id === itemId);
      if (staticArticle) {
        setItem(staticArticle);
        setLoading(false);
        return;
      }

      // 2. Check Services
      const service = SERVICES.find(s => s.id === itemId);
      if (service) {
        setItem(service);
        setLoading(false);
        return;
      }

      // 3. Check Cloud Database
      if (itemId) {
        const cloudItem = await db.getArticleById(itemId);
        if (cloudItem) {
          setItem(cloudItem);
        }
      }
      setLoading(false);
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="font-bold text-slate-500">Retrieving Item Data...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-20 text-center font-bold text-slate-700 bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Item Not Found</h2>
        <Link to="/blog" className="text-blue-600 hover:underline">Return to Library</Link>
      </div>
    );
  }

  const itemName = item.title || item.name;
  const orderId = `PAY-${Date.now()}`;

  const handleConfirmPayment = () => {
    // Store temporarily only for the "Handshake" to the success page
    localStorage.setItem(
      'pending_payment',
      JSON.stringify({
        orderId,
        itemId: item.id,
        itemName,
        price: item.price,
        date: new Date().toISOString()
      })
    );

    navigate(`/payment-success?order=${orderId}`);
  };

  return (
    <div className="bg-slate-50 py-16 min-h-screen">
      <SEO title="Secure Checkout" description={`Checkout for ${itemName}`} />

      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/services"
          className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Services
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 mb-8">
            Checkout Summary
          </h1>

          {/* ITEM */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-8 border-b border-slate-100 mb-8 gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">
                  {itemName}
                </h3>
                <p className="text-slate-500 text-sm">
                  Technical Publication Access
                </p>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              ${Number(item.price).toFixed(2)}
            </div>
          </div>

          {/* PAYONEER */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-lg font-bold">
                Pay via Payoneer (Manual Verification)
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <p>
                Please transfer the exact amount using <strong>Payoneer</strong> to:
              </p>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="font-bold text-slate-900 flex items-center gap-2 text-base">
                  <Mail size={18} className="text-blue-600" />
                  ayyanulhaq997@gmail.com
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Total Amount</p>
                  <p className="font-bold text-lg">${Number(item.price).toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Order Ref ID</p>
                  <p className="font-mono text-sm">{orderId}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-600/5 text-blue-700 rounded-xl border border-blue-100 text-xs italic">
                Note: After clicking "I Have Paid", your order will be synced to our cloud for manual verification. Access is granted within 24 hours.
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full mt-8 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              I Have Paid <CheckCircle size={22} />
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            Secure manual transaction system for high-value technical content.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
