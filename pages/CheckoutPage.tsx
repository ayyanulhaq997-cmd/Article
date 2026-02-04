
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, Check, ShoppingBag, ArrowLeft, ExternalLink, CheckCircle2, PartyPopper } from 'lucide-react';
import { ARTICLES, SERVICES } from '../constants';
import SEO from '../components/SEO';

const CheckoutPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const itemId = query.get('id');
  const isSuccess = query.get('success') === 'true';
  const [paymentMethod, setPaymentMethod] = React.useState<'stripe' | 'paypal' | 'skrill'>('skrill');
  
  const article = ARTICLES.find(a => a.id === itemId);
  const service = SERVICES.find(s => s.id === itemId) || (itemId ? null : SERVICES[0]);

  const item = article || service;

  // Handle successful payment state
  if (isSuccess && item) {
    const itemName = (item as any).title || (item as any).name;
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-16 px-4">
        <SEO 
          title="Payment Successful | Ayyan's Tech Hub" 
          description="Your payment has been successfully processed. Thank you for your purchase!"
        />
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Payment Successful!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for your trust, Ayyan u l Haq is now preparing your order. A confirmation email will be sent to you shortly.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left border border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Summary</h2>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600 font-medium">{itemName}</span>
              <span className="font-bold text-slate-900">${item.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-sm font-bold text-slate-900">Total Paid</span>
              <span className="text-lg font-black text-blue-600">${item.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link 
              to="/portfolio" 
              className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              View Writing Portfolio
            </Link>
            <Link 
              to="/" 
              className="block w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Return Home
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <PartyPopper size={16} /> Happy writing!
          </div>
        </div>
      </div>
    );
  }

  if (!item) return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">No item selected.</h2>
      <Link to="/services" className="text-blue-600 font-bold hover:underline">Return to Services</Link>
    </div>
  );

  const itemName = (item as any).title || (item as any).name;
  
  // Strictly alphanumeric for Skrill to avoid "Bad Request" on special characters
  const cleanItemName = itemName.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
  
  /**
   * Constructs an absolute URL for Skrill return and cancel redirects.
   * Skrill requires absolute URLs. For HashRouter apps, we combine the current origin,
   * the base pathname (including index.html if present), and the hash path.
   */
  const getAbsoluteUrl = (hashPath: string) => {
    // 1. Get origin + path without hash (e.g., https://ayyan.tech/ or https://ayyan.tech/index.html)
    const baseUrlWithoutHash = window.location.origin + window.location.pathname.split('#')[0];
    
    // 2. Normalize by removing any trailing slash
    const normalizedBase = baseUrlWithoutHash.replace(/\/$/, "");
    
    // 3. Ensure the hash path starts with a slash
    const formattedHashPath = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
    
    // 4. Combine into final absolute URL: [Origin/Path]/#[HashPath]
    return `${normalizedBase}/#${formattedHashPath}`;
  };

  // Point back to checkout with success=true to show the success message
  const returnUrl = getAbsoluteUrl(`/checkout?success=true&id=${itemId || ''}`);
  const cancelUrl = getAbsoluteUrl(`/checkout?id=${itemId || ''}`);

  return (
    <div className="bg-slate-50 py-16">
      <SEO 
        title="Secure Checkout | Ayyan's Tech Hub" 
        description={`Complete your purchase for ${itemName} securely via Skrill.`}
        keywords="secure checkout, buy tech articles, skrill payment"
      />
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
                      <ExternalLink size={16} className="text-blue-600" /> Skrill Payment Confirmation
                    </p>
                    <p className="mb-3">
                      Payment will be sent securely to: <span className="font-bold text-slate-900">chayyanjutt81@gmail.com</span>
                    </p>
                    <p>Total amount: <strong>${item.price.toFixed(2)} USD</strong></p>
                  </div>
                  
                  {/* Skrill Quick Checkout Form with Correct Parameters */}
                  <form action="https://www.skrill.com/app/payment.pl" method="post">
                    {/* Merchant Identification */}
                    <input type="hidden" name="pay_to_email" value="chayyanjutt81@gmail.com" />
                    
                    {/* Transaction Details */}
                    <input type="hidden" name="amount" value={item.price.toFixed(2)} />
                    <input type="hidden" name="currency" value="USD" />
                    <input type="hidden" name="language" value="EN" />
                    
                    {/* Description Fields */}
                    <input type="hidden" name="detail1_description" value="Product:" />
                    <input type="hidden" name="detail1_text" value={cleanItemName} />
                    
                    {/* Return and Cancel Hooks (Absolute URLs required by Skrill) */}
                    <input type="hidden" name="return_url" value={returnUrl} />
                    <input type="hidden" name="cancel_url" value={cancelUrl} />
                    
                    {/* Custom Merchant Tracking Fields */}
                    <input type="hidden" name="merchant_fields" value="item_id" />
                    <input type="hidden" name="item_id" value={itemId || 'custom_order'} />
                    
                    <button 
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg shadow-xl flex items-center justify-center gap-2"
                    >
                      Pay with Skrill <ArrowLeft className="rotate-180" size={20} />
                    </button>
                  </form>
                  <p className="text-xs text-center text-slate-400 italic">You will be redirected to the secure Skrill gateway to complete the transaction.</p>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                   <p className="text-slate-400 italic text-sm mb-4">
                     {paymentMethod === 'stripe' ? "Stripe gateway is currently in maintenance." : "PayPal integration is coming soon."}
                   </p>
                   <p className="text-slate-500 font-medium">Please select <span className="text-blue-600 font-bold">Skrill</span> to complete your purchase.</p>
                </div>
              )}

              <p className="text-center text-slate-400 text-xs mt-8">
                All transactions are encrypted and processed through official Skrill API protocols.
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
              <h4 className="font-bold text-slate-900 mb-4">Support</h4>
              <p className="text-sm text-slate-500 mb-6">Need assistance or have specific delivery requirements? Let's discuss your project.</p>
              <Link to="/contact" className="block w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-center text-sm font-bold hover:bg-slate-50 transition-all">
                Message Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
