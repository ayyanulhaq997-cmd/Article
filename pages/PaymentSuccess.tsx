
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("order");

  useEffect(() => {
    // Background logic to record the sale for the Secret Admin Dashboard
    const pending = localStorage.getItem('pending_payment');
    if (pending && orderId) {
      const paymentData = JSON.parse(pending);
      const sales = JSON.parse(localStorage.getItem('ayyan_sales') || '[]');
      
      const exists = sales.some((s: any) => s.orderId === orderId);
      
      if (!exists) {
        sales.push({
          id: paymentData.itemId,
          orderId: orderId,
          name: paymentData.itemName,
          price: paymentData.price,
          timestamp: Date.now()
        });
        localStorage.setItem('ayyan_sales', JSON.stringify(sales));
        localStorage.removeItem('pending_payment');
      }
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white max-w-md w-full p-10 rounded-3xl border shadow-sm text-center">
        <CheckCircle size={60} className="text-green-600 mx-auto mb-4" />

        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Payment Submitted
        </h1>

        <p className="text-slate-600 mb-4">
          Thank you! Your Payoneer payment request has been received.
        </p>

        {orderId && (
          <p className="text-sm text-slate-500 mb-6">
            <strong>Order ID:</strong> {orderId}
          </p>
        )}

        <p className="text-sm text-slate-500 mb-6">
          We will verify your payment within <strong>24 hours</strong> and
          contact you via email.
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
