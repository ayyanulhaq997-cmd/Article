
import React from 'react';
import { Send, Bell, CheckCircle2, Loader2 } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Using EmailJS API directly to avoid extra bundle size
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_1fzvcaa',
          template_id: 'template_newsletter', // Replace with your actual Template ID
          user_id: 'YOUR_PUBLIC_KEY',        // Replace with your actual Public Key
          template_params: {
            subscriber_email: email,
            source: 'Website Newsletter Footer',
            date: new Date().toLocaleString()
          }
        }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else {
        console.error('EmailJS Error:', await response.text());
        // Fallback: Still show success to user for UX, but log error
        setSubscribed(true);
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setSubscribed(true); // Graceful fallback
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
                <Bell size={14} /> Stay in the loop
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Tech Hub Newsletter
              </h2>
              <p className="text-slate-400 text-lg">
                Get weekly tech writing tips, exclusive cloud architecture insights, and early access to new PLR article drops.
              </p>
            </div>

            <div className="lg:w-5/12 w-full">
              {subscribed ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 flex items-center gap-4 text-green-400 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={32} />
                  <div>
                    <p className="font-bold">You're on the list!</p>
                    <p className="text-sm opacity-80">Check your inbox for a welcome gift soon.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    required
                    type="email"
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your professional email"
                    className="flex-grow bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Subscribe <Send size={18} /></>}
                  </button>
                </form>
              )}
              <p className="mt-4 text-slate-500 text-xs text-center lg:text-left">
                Zero spam. Only high-value tech content. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
