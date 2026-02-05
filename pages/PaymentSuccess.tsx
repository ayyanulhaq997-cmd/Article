
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, PartyPopper } from "lucide-react";
import SEO from "../components/SEO";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("order");

  useEffect(() => {
    // Logic to record the sale in Admin Dashboard
    const pending = localStorage.getItem('pending_payment');
    if (pending) {
      const paymentData = JSON.parse(pending);
      const sales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
      
      // Check if this specific order was already recorded to prevent duplicates
      const exists = sales.some((s: any) => s.orderId === orderId);
      
      if (!exists && orderId) {
        sales.push({
          id: paymentData.itemId,
          orderId: orderId,
          name: paymentData.itemName,
          price: paymentData.price,
          timestamp: Date.now()
        });
        localStorage.setItem('ayyan_sales', JSON.stringify(sales));
        // Clear pending so it doesn't double-count if they refresh
        localStorage.removeItem('pending_payment');
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <SEO title="Payment Submitted" description="Your Payoneer payment request has been received." />
      <div className="bg-white max-w-md w-full p-10 rounded-[2.5rem] border shadow-2xl shadow-blue-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Payment Submitted
        </h1>

        <p className="text-slate-600 mb-6">
          Thank you! Your Payoneer payment request has been received.
        </p>

        {orderId && (
          <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Ref</p>
            <p className="text-sm font-mono font-bold text-slate-900">{orderId}</p>
          </div>
        )}

        <div className="text-sm text-slate-500 mb-8 space-y-2">
          <p>We will verify your payment within <strong>24 hours</strong>.</p>
          <p>Once confirmed, your content will be delivered via email.</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/blog"
            className="block w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Back to Articles
          </Link>
          <Link
            to="/"
            className="block w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition"
          >
            Return to Homepage
          </Link>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
          <PartyPopper size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Order Pending Review</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
