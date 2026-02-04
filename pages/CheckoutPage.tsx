import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  Check,
  ShoppingBag,
  ArrowLeft,
  PartyPopper,
  ExternalLink,
} from "lucide-react";
import SEO from "../components/SEO";
import { ARTICLES, SERVICES } from "../constants";

const CheckoutPage: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get("id");
  const success = query.get("success") === "true";

  const article = ARTICLES.find(a => a.id === itemId);
  const service = SERVICES.find(s => s.id === itemId);
  const item = article || service;

  if (!item) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No item selected</h2>
        <Link to="/services" className="text-blue-600 font-bold">
          Back to services
        </Link>
      </div>
    );
  }

  const itemName = (item as any).title || (item as any).name;

  /* ---------------- SUCCESS PAGE ---------------- */
  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <SEO title="Payment Received" />
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl">
          <PartyPopper className="mx-auto text-green-600 mb-6" size={48} />
          <h1 className="text-2xl font-extrabold mb-3">Payment Submitted</h1>
          <p className="text-slate-600 mb-6">
            Thanks! Once your Payoneer payment is confirmed, I’ll start working immediately.
          </p>

          <div className="bg-slate-50 p-5 rounded-xl text-left mb-6">
            <p className="font-semibold">{itemName}</p>
            <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
          </div>

          <Link
            to="/"
            className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- CHECKOUT PAGE ---------------- */
  return (
    <div className="bg-slate-50 py-16">
      <SEO title="Checkout | Payoneer Payment" />

      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/services"
          className="inline-flex items-center mb-6 text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h1 className="text-2xl font-extrabold mb-8">Checkout Summary</h1>

          {/* Item */}
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold">{itemName}</p>
                <p className="text-sm text-slate-500">Digital Service</p>
              </div>
            </div>
            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          </div>

          {/* Total */}
          <div className="flex justify-between font-extrabold text-xl mb-8">
            <span>Total</span>
            <span>${item.price.toFixed(2)}</span>
          </div>

          {/* Payoneer Instructions */}
          <div className="bg-slate-50 border rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="text-blue-600" />
              <h3 className="font-bold">Pay via Payoneer</h3>
            </div>

            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex gap-2">
                <Check size={16} className="text-green-600 mt-1" />
                Login to your Payoneer account
              </li>
              <li className="flex gap-2">
                <Check size={16} className="text-green-600 mt-1" />
                Send <b>${item.price.toFixed(2)}</b> to my Payoneer email
              </li>
              <li className="flex gap-2">
                <Check size={16} className="text-green-600 mt-1" />
                Use item name as payment note
              </li>
            </ul>

            <p className="mt-4 text-sm">
              <b>Payoneer Email:</b>{" "}
              <span className="text-blue-600 font-semibold">
                ayyanulhaq997@gmail.com
              </span>
            </p>
          </div>

          {/* Confirmation */}
          <Link
            to={`/checkout?success=true&id=${itemId}`}
            className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-center hover:bg-blue-700"
          >
            I Have Paid (Confirm)
          </Link>

          <p className="text-xs text-center text-slate-400 mt-4">
            Payments are manually verified for security
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
