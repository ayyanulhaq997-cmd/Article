
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Check, ShoppingBag, ArrowLeft, ExternalLink } from 'lucide-react';
import { ARTICLES, SERVICES } from '../constants';

const CheckoutPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get('id');
  const [paymentMethod, setPaymentMethod] = React.useState<'stripe' | 'paypal' | 'skrill'>('skrill');
  
  const article = ARTICLES.find(a => a.id === itemId);
  const service = SERVICES.find(s => s.id === itemId) || (itemId ? null : SERVICES[0]);

  const item = article || service;

  if (!item) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">No item selected.</h2>
      <Link to="/services" className="text-blue-600 font-bold hover:underline">Return to Services</Link>
    </div>
  );

  const itemName = (item as any).title || (item as any).name;
  
  // Skrill parameters often fail if special characters are present in text fields.
  // We sanitize the item name to ensure only alphanumeric characters and spaces are sent.
  const cleanItemName = itemName.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
  
  // Construct absolute URLs as required by Skrill's payment gateway.
  // Using window.location.origin and window.location.pathname ensures the full URL is provided.
  const baseUrl = window.location.origin + window.location.pathname;
  const returnUrl = `${baseUrl}#/portfolio`;
  const cancelUrl = `${baseUrl}#/checkout?id=${itemId || ''}`;

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Order Summary */}
          <div className="lg:w-2/3">
            <Link to="/services" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium">
              <ArrowLeft size={18} className="mr-2" /> Back
            </Link>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Checkout</h1>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                      {(item as any).title ? <ShoppingBag size={24} /> : <Check size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{itemName}</h3>
                      <p className="text-sm text-slate-500">{(item as any).category || (item as any).deliveryTime}</p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-lg">${item.price}</div>
                </div>

                <div className="space-y-3 py-6">
                   <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span>${item.price}</span>
                   </div>
                   <div className="flex justify-between text-slate-600">
                      <span>Transaction Fee</span>
                      <span>$0.00</span>
                   </div>
                   <div className="flex justify-between text-xl font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total</span>
                      <span>${item.price}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" /> Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold">Stripe</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold">PayPal</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('skrill')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'skrill' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold">Skrill</span>
                </button>
              </div>

              {paymentMethod === 'skrill' ? (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                    <p className="mb-2 font-bold text-slate-900 flex items-center gap-2">
                      <ExternalLink size={16} className="text-blue-600" /> Skrill Fast Checkout
                    </p>
                    <p>Click below to complete your payment of <strong>${item.price.toFixed(2)} USD</strong> to <strong>chayyanjutt81@gmail.com</strong>.</p>
                  </div>
                  
                  {/* Fixed Skrill Payment Form: Ensured all specified parameters are correctly formatted */}
                  <form action="https://www.skrill.com/app/payment.pl" method="post" target="_blank">
                    <input type="hidden" name="pay_to_email" value="chayyanjutt81@gmail.com" />
                    <input type="hidden" name="amount" value={item.price.toFixed(2)} />
                    <input type="hidden" name="currency" value="USD" />
                    <input type="hidden" name="language" value="EN" />
                    <input type="hidden" name="detail1_description" value="Product:" />
                    <input type="hidden" name="detail1_text" value={cleanItemName} />
                    <input type="hidden" name="return_url" value={returnUrl} />
                    <input type="hidden" name="cancel_url" value={cancelUrl} />
                    
                    {/* Pass item_id correctly using merchant_fields */}
                    <input type="hidden" name="merchant_fields" value="item_id" />
                    <input type="hidden" name="item_id" value={itemId || 'custom_order'} />
                    
                    <button 
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg shadow-xl flex items-center justify-center gap-2"
                    >
                      Complete Purchase <ArrowLeft className="rotate-180" size={20} />
                    </button>
                  </form>
                  <p className="text-xs text-center text-slate-400 italic">This will open a secure Skrill payment window in a new tab.</p>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                   <p className="text-slate-400 italic text-sm mb-4">
                     {paymentMethod === 'stripe' ? "Stripe gateway is currently in maintenance." : "PayPal integration is coming soon."}
                   </p>
                   <p className="text-slate-500 font-medium">Please use <span className="text-blue-600 font-bold">Skrill</span> for instant payment.</p>
                </div>
              )}

              <p className="text-center text-slate-400 text-xs mt-8">
                Your transaction is protected by Skrill's anti-fraud system.
              </p>
            </div>
          </div>

          {/* Sidebar Guarantee */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
               <ShieldCheck size={40} className="mb-6 opacity-80" />
               <h3 className="text-xl font-bold mb-4">Quality Guarantee</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3 text-sm text-blue-100">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Plagiarism-free content with reports</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-blue-100">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>SEO keyword research included</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-blue-100">
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Full commercial & resale rights</span>
                 </li>
               </ul>
            </div>
            
            <div className="p-8 bg-white border border-slate-200 rounded-3xl">
              <h4 className="font-bold text-slate-900 mb-4">Need help?</h4>
              <p className="text-sm text-slate-500 mb-6">If you have questions about custom requirements or licenses, message me.</p>
              <Link to="/contact" className="block w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-center text-sm font-bold hover:bg-slate-50 transition-all">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
