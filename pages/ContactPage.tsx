
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Linkedin, Twitter } from 'lucide-react';

const ContactPage = () => {
  const [formState, setFormState] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <div className="lg:w-1/3">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Let's Talk <span className="gradient-text">Tech.</span></h1>
            <p className="text-lg text-slate-600 mb-12">
              Have a custom project in mind? Want to discuss bulk pricing? 
              I'm always open to new collaborations.
            </p>

            <div className="space-y-8">
              <a href="mailto:zolly9130@gmail.com" className="flex items-start gap-4 group transition-transform hover:translate-x-1">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Me</h4>
                  <p className="text-slate-500">zolly9130@gmail.com</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">WhatsApp</h4>
                  <p className="text-slate-500">+92 3XX XXXXXXX</p>
                </div>
              </div>
              <a 
                href="https://www.linkedin.com/in/ch-ayyan-jutt-a45a3b283" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-4 group transition-transform hover:translate-x-1"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Linkedin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">LinkedIn</h4>
                  <p className="text-slate-500">/in/ch-ayyan-jutt-a45a3b283</p>
                </div>
              </a>
            </div>

            <div className="mt-16 pt-16 border-t border-slate-100">
               <h4 className="font-bold text-slate-900 mb-4">Newsletter Signup</h4>
               <p className="text-sm text-slate-500 mb-6">Get weekly tech writing tips and new PLR drops directly in your inbox.</p>
               <div className="flex gap-2">
                 <input type="email" placeholder="Your email" className="bg-slate-100 border-none rounded-xl px-4 py-3 flex-grow focus:ring-2 focus:ring-blue-500" />
                 <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors">
                   <Send size={20} />
                 </button>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
              {submitted ? (
                <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500">I'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Article Bulk Order Query"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea 
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-lg"
                  >
                    Send Message <Send size={20} />
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
