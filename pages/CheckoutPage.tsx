import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Mail,
  CheckCircle
} from 'lucide-react';
import { ARTICLES, SERVICES } from '../constants';
import SEO from '../components/SEO';

const CheckoutPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get('id');
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    const staticArticle = ARTICLES.find(a => a.id === itemId);
    const service = SERVICES.find(s => s.id === itemId);
    const dynamic = JSON.parse(localStorage.getItem('ayyan_articles') || '[]');
    const dynamicArticle = dynamic.find((a: any) => a.id === itemId);

    setItem(staticArticle || service || dynamicArticle);
  }, [itemId]);

  if (!item) {
    return (
      <div className="py-20 text-center font-bold text-slate-700">
        Item not found.
      </div>
    );
  }

  const itemName = item.title || item.name;
  const orderId = `PAY-${Date.now()}`;

  const handleConfirmPayment = () => {
    localStorage.setItem(
      'pending_payment',
      JSON.stringify({
        orderId,
        itemId,
        itemName,
        price: item.price,
        date: new Date().toISOString()
      })
    );

    navigate(`/payment-success?order=${orderId}`);
  };

  return (
    <div className="bg-slate-50 py-16">
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
          <div className="flex justify-between items-center py-8 border-b border-slate-100 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {itemName}
                </h3>
                <p className="text-slate-500">
                  Professional Tech Service
                </p>
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              ${item.price.toFixed(2)}
            </div>
          </div>

          {/* PAYONEER */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-blue-600" size={24} />
              <h2 className="text-lg font-bold">
                Pay via Payoneer (Manual)
              </h2>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <p>
                Please send the payment using <strong>Payoneer</strong> to:
              </p>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                  <Mail size={16} />
                  ayyanulhaq997@gmail.com
                </p>
              </div>

              <p>
                <strong>Amount:</strong> ${item.price.toFixed(2)}
              </p>
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>

              <p className="text-slate-500">
                After completing the payment, click the button below.
                Your order will be reviewed and processed shortly.
              </p>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full mt-8 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
            >
              I Have Paid <CheckCircle size={22} />
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 font-medium">
            Payments are manually verified to ensure security & accuracy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
