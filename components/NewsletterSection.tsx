
import React from 'react';
import { Send, Bell, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// Updated with the user's actual Formspree ID
const FORMSPREE_ID = "mwvqggqe"; 

const NewsletterSection = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setError(false);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, type: "Newsletter Signup" }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Bell size={14} /> Stay Updated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Tech Hub</h2>
              <p className="text-slate-400 text-lg">Weekly insights on cloud tech and exclusive writing tips.</p>
            </div>

            <div className="lg:w-5/12 w-full">
              {subscribed ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4 text-green-400">
                  <CheckCircle2 size={32} />
                  <div>
                    <p className="font-bold text-lg">You're subscribed!</p>
                    <p className="text-sm opacity-80">Welcome to the inner circle.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input required type="email" disabled={isSubmitting} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="flex-grow bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" />
                    <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-70 transition-all">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Join <Send size={18} /></>}
                    </button>
                  </form>
                  {error && <p className="text-red-400 text-xs flex items-center gap-2"><AlertCircle size={14} /> Submission failed. Please try again.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
