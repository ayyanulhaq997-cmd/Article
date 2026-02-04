
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
  
  // Skrill is extremely picky. Strictly alphanumeric, no punctuation.
  const skrillItemDescription = itemName.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 30).trim();
  const skrillTransactionId = `TRX-${Date.now()}`;
  
  /**
   * Skrill requires absolute URLs. HashRouter apps are tricky.
   * We ensure the URL is clean and absolute.
   */
  const getAbsoluteUrl = (hashPath: string) => {
    const origin = window.location.origin;
    const pathname = window.location.pathname.split('#')[0];
    const baseUrl = `${origin}${pathname}`.replace(/\/$/, "");
    const formattedHashPath = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
    return `${baseUrl}/#${formattedHashPath}`;
  };

  const returnUrl = getAbsoluteUrl(`checkout?success=true&id=${itemId || ''}`);
  const cancelUrl = getAbsoluteUrl(`checkout?id=${itemId || ''}`);

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
            <Link to="/services" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
              <ArrowLeft size={18} className="mr-2" /> Back to Services
            </Link>
            <div className="bg-white rounded-3xl p-8 border border-slate-200 mb-8 shadow-sm">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Checkout Summary</h1>
              
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
                   <div className="flex justify-between text-slate-600 text-sm">
                      <span>Subtotal</span>
                      <span>${item.price.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-slate-600 text-sm">
                      <span>Gateway Fee</span>
                      <span className="text-green-600 font-medium">Free</span>
                   </div>
                   <div className="flex justify-between text-xl font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total Amount</span>
                      <span>${item.price.toFixed(2)}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" /> Choose Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold uppercase tracking-widest">Stripe</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold uppercase tracking-widest">PayPal</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('skrill')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'skrill' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}
                >
                  <span className="text-sm font-bold uppercase tracking-widest">Skrill</span>
                </button>
              </div>

              {paymentMethod === 'skrill' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-600">
                    <p className="mb-2 font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-blue-600" /> Skrill Secure Payment
                    </p>
                    <p className="mb-4">
                      Recipient: <span className="font-bold text-slate-900">chayyanjutt81@gmail.com</span>
                    </p>
                    <div className="flex justify-between items-center text-xs opacity-75">
                      <span>Transaction ID:</span>
                      <span className="font-mono uppercase">{skrillTransactionId}</span>
                    </div>
                  </div>
                  
                  {/* Skrill Payment Form */}
                  <form action="https://www.skrill.com/app/payment.pl" method="post">
                    {/* Identification */}
                    <input type="hidden" name="pay_to_email" value="chayyanjutt81@gmail.com" />
                    <input type="hidden" name="transaction_id" value={skrillTransactionId} />
                    
                    {/* Amount & Currency */}
                    <input type="hidden" name="amount" value={item.price.toFixed(2)} />
                    <input type="hidden" name="currency" value="USD" />
                    <input type="hidden" name="language" value="EN" />
                    
                    {/* Descriptions */}
                    <input type="hidden" name="detail1_description" value="Service:" />
                    <input type="hidden" name="detail1_text" value={skrillItemDescription} />
                    
                    {/* Redirects */}
                    <input type="hidden" name="return_url" value={returnUrl} />
                    <input type="hidden" name="return_url_text" value="Return to Ayyan Tech" />
                    <input type="hidden" name="cancel_url" value={cancelUrl} />
                    
                    {/* Notification (Optional but helps reliability) */}
                    <input type="hidden" name="status_url" value="mailto:chayyanjutt81@gmail.com" />
                    
                    <button 
                      type="submit"
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
                    >
                      Proceed to Skrill <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest italic">Secure Redirect to Skrill Gateway</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl animate-in fade-in duration-300">
                   <p className="text-slate-500 font-medium mb-4">
                     {paymentMethod === 'stripe' ? "Stripe gateway is currently in maintenance." : "PayPal integration is coming soon."}
                   </p>
                   <p className="text-slate-600">Please use <span className="text-blue-600 font-bold underline cursor-pointer" onClick={() => setPaymentMethod('skrill')}>Skrill</span> for immediate processing.</p>
                </div>
              )}

              <div className="flex items-center justify-center gap-6 mt-10 pt-8 border-t border-slate-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Skrill_logo.svg" alt="Skrill" className="h-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 grayscale opacity-20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 grayscale opacity-20" />
              </div>
            </div>
          </div>

          {/* Sidebar Guarantee */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
               <ShieldCheck size={40} className="mb-6 text-blue-500" />
               <h3 className="text-xl font-bold mb-4">Order Protection</h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3 text-sm text-slate-400">
                    <Check size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>Instant delivery for PLR/Existing articles</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-400">
                    <Check size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>24/7 priority support for all orders</span>
                 </li>
                 <li className="flex items-start gap-3 text-sm text-slate-400">
                    <Check size={16} className="mt-0.5 text-blue-500 flex-shrink-0" />
                    <span>Satisfaction guarantee on custom work</span>
                 </li>
               </ul>
            </div>
            
            <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4">Support Inquiries</h4>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Need a custom quote or faster delivery? Get in touch with me directly before placing your order.</p>
              <Link to="/contact" className="block w-full py-3 bg-slate-50 text-slate-700 rounded-xl text-center text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200">
                Contact Ayyan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
