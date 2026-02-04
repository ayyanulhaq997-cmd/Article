import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  CreditCard,
  ShieldCheck,
  Check,
  ShoppingBag,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { ARTICLES, SERVICES } from "../constants";
import SEO from "../components/SEO";

const CheckoutPage: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get("id");
  const isSuccess = query.get("success") === "true";

  const [paymentMethod, setPaymentMethod] = React.useState<
    "stripe" | "paypal" | "skrill"
  >("skrill");

  const article = ARTICLES.find((a) => a.id === itemId);
  const service = SERVICES.find((s) => s.id === itemId);
  const item = article || service;

  if (!item) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No item selected</h2>
        <Link to="/services" className="text-blue-600 font-bold">
          Return to Services
        </Link>
      </div>
    );
  }

  const itemName = (item as any).title || (item as any).name;

  /* ========================
     SUCCESS PAGE
  ========================= */
  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
        <SEO title="Payment Successful" />
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="w-24 h-24 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
          <p className="text-slate-600 mb-6">
            Thank you! Your order is being processed.
          </p>

          <div className="bg-slate-50 p-5 rounded-xl mb-6">
            <div className="flex justify-between">
              <span>{itemName}</span>
              <strong>${item.price.toFixed(2)}</strong>
            </div>
          </div>

          <Link
            to="/"
            className="block bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Go Home
          </Link>

          <p className="mt-4 text-slate-400 text-sm flex justify-center gap-2">
            <PartyPopper size={16} /> Happy writing
          </p>
        </div>
      </div>
    );
  }

  /* ========================
     SKRILL SAFE VALUES
  ========================= */
  const transactionId = Date.now().toString();
  const returnUrl = `${window.location.origin}/checkout?success=true&id=${itemId}`;
  const cancelUrl = `${window.location.origin}/checkout?id=${itemId}`;

  return (
    <div className="bg-slate-50 py-16">
      <SEO title="Secure Checkout" />

      <div className="max-w-5xl mx-auto px-4">
        <Link
          to="/services"
          className="inline-flex items-center text-slate-500 mb-8"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <div className="flex justify-between border-b pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                {(item as any).title ? (
                  <ShoppingBag />
                ) : (
                  <Check />
                )}
              </div>
              <div>
                <h3 className="font-bold">{itemName}</h3>
                <p className="text-sm text-slate-500">
                  {(item as any).category || (item as any).deliveryTime}
                </p>
              </div>
            </div>
            <strong>${item.price.toFixed(2)}</strong>
          </div>

          <div className="mb-8">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} /> Payment Method
            </h2>

            <button
              onClick={() => setPaymentMethod("skrill")}
              className="border-2 border-blue-600 bg-blue-50 px-6 py-4 rounded-xl font-bold"
            >
              Skrill
            </button>
          </div>

          {/* ========================
             SKRILL FORM (FIXED)
          ========================= */}
          {paymentMethod === "skrill" && (
            <div className="bg-slate-50 p-6 rounded-2xl">
              <div className="mb-4 text-sm">
                <p className="font-bold flex items-center gap-2">
                  <ShieldCheck size={16} /> Skrill Secure Checkout
                </p>
                <p className="text-slate-500">
                  Pay to: <strong>chayyanjutt81@gmail.com</strong>
                </p>
              </div>

              <form action="https://pay.skrill.com" method="post">
                <input
                  type="hidden"
                  name="pay_to_email"
                  value="chayyanjutt81@gmail.com"
                />
                <input
                  type="hidden"
                  name="transaction_id"
                  value={transactionId}
                />
                <input
                  type="hidden"
                  name="amount"
                  value={item.price.toFixed(2)}
                />
                <input type="hidden" name="currency" value="USD" />
                <input type="hidden" name="language" value="EN" />

                <input
                  type="hidden"
                  name="detail1_description"
                  value="Item"
                />
                <input
                  type="hidden"
                  name="detail1_text"
                  value={itemName.substring(0, 90)}
                />

                <input type="hidden" name="return_url" value={returnUrl} />
                <input type="hidden" name="cancel_url" value={cancelUrl} />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                >
                  Pay with Skrill <ExternalLink size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
