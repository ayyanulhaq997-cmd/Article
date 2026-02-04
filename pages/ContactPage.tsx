
import React from 'react';
import { Mail, Send, MessageSquare, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

// Using the Formspree ID provided by the user
const FORMSPREE_ID = "mwvqggqe"; 

const ContactPage = () => {
  const [formState, setFormState] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formState.name.trim().length < 2) newErrors.name = 'Name is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) newErrors.email = 'Valid email is required.';
    if (formState.subject.trim().length < 3) newErrors.subject = 'Subject is required.';
    if (formState.message.trim().length < 20) newErrors.message = 'Message must be at least 20 chars.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Using Formspree for reliable delivery to Gmail
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setServerError(data.error || "Something went wrong. Please check your Formspree dashboard.");
      }
    } catch (err) {
      setServerError("Network error. Please check your connection or try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="py-20">
      <SEO 
        title="Contact Ayyan u l Haq | Tech Content Specialist" 
        description="Get in touch for custom tech writing projects or collaboration inquiries."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Let's Talk <span className="gradient-text">Tech.</span></h1>
            <p className="text-lg text-slate-600 mb-12">
              Have a custom project in mind? I typically respond to all inquiries within 24 hours.
            </p>

            <div className="space-y-8">
              <a href="mailto:zolly9130@gmail.com" className="flex items-start gap-4 group hover:translate-x-1 transition-transform">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Me</h4>
                  <p className="text-slate-500">zolly9130@gmail.com</p>
                </div>
              </a>
              <a href="https://wa.me/923000000000" className="flex items-start gap-4 group hover:translate-x-1 transition-transform">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">WhatsApp</h4>
                  <p className="text-slate-500">Fast Response</p>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/ch-ayyan-jutt-a45a3b283" target="_blank" className="flex items-start gap-4 group hover:translate-x-1 transition-transform">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Linkedin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">LinkedIn</h4>
                  <p className="text-slate-500">ayyan-jutt</p>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
              {submitted ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500 mb-8">Your inquiry is in my inbox. I'll get back to you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {serverError && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3">
                      <AlertCircle size={18} /> {serverError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                      <input name="name" type="text" value={formState.name} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your name" />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input name="email" type="email" value={formState.email} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="name@company.com" />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <input name="subject" type="text" value={formState.subject} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Project Inquiry" />
                    {errors.subject && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea name="message" rows={5} value={formState.message} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tell me about your tech content needs..."></textarea>
                    {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-70">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={20} /></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
