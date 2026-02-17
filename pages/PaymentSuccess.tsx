
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { db } from "../supabaseService";

const PaymentSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const orderId = query.get("order");
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const recordCloudSale = async () => {
      const pending = localStorage.getItem('pending_payment');
      if (pending && orderId) {
        const paymentData = JSON.parse(pending);
        
        // Record to Cloud
        const success = await db.recordSale(paymentData);
        
        if (success) {
          localStorage.removeItem('pending_payment');
        }
      }
      setIsSyncing(false);
    };

    recordCloudSale();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white max-w-md w-full p-10 rounded-3xl border shadow-sm text-center">
        {isSyncing ? (
          <div className="py-10">
            <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold">Syncing with Cloud...</h2>
          </div>
        ) : (
          <>
            <CheckCircle size={60} className="text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Order Registered
            </h1>
            <p className="text-slate-600 mb-4">
              Thank you! Your Payoneer payment has been logged in our cloud system.
            </p>
            {orderId && (
              <p className="text-sm text-slate-500 mb-6">
                <strong>Order ID:</strong> {orderId}
              </p>
            )}
            <p className="text-sm text-slate-500 mb-6 italic">
              Verification usually takes under 24 hours.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
