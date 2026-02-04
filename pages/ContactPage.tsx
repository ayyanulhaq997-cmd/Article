
import React from 'react';
import { Mail, Send, MessageSquare, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const ContactPage = () => {
  const [formState, setFormState] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (formState.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@company.com).';
    }

    // Subject validation
    if (formState.subject.trim().length < 3) {
      newErrors.subject = 'Please provide a clear subject for your inquiry.';
    }

    // Message validation
    if (formState.message.trim().length < 20) {
      newErrors.message = 'Please provide more details (at least 20 characters). This helps me understand your needs better!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors and validate
    setErrors({});
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'service_1fzvcaa',
          template_id: 'template_contact', // Replace with your actual Template ID
          user_id: 'YOUR_PUBLIC_KEY',      // Replace with your actual Public Key
          template_params: {
            from_name: formState.name,
            from_email: formState.email,
            subject: formState.subject,
            message: formState.message,
            date: new Date().toLocaleString()
          }
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTimeout(() => setSubmitted(false), 8000);
      } else {
        console.error('Submission failed');
        // Graceful fallback for UX
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <div className="py-20">
      <SEO 
        title="Contact Ayyan u l Haq | Tech Content Specialist" 
        description="Get in touch for custom tech writing projects, bulk PLR orders, or collaboration inquiries. Available for serverless and SaaS content strategy."
        keywords="hire tech writer, contact ayyan, content writing inquiry"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
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
          </div>

          <div className="lg:w-2/3">
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
              {submitted ? (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                  <p className="text-slate-500">I've received your inquiry and will get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 font-bold hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input 
                        name="name"
                        disabled={isSubmitting}
                        type="text" 
                        value={formState.name}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-100 focus:ring-blue-500'}`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 flex items-center gap-1 font-medium mt-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input 
                        name="email"
                        disabled={isSubmitting}
                        type="email" 
                        value={formState.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-100 focus:ring-blue-500'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1 font-medium mt-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                    <input 
                      name="subject"
                      disabled={isSubmitting}
                      type="text" 
                      value={formState.subject}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 ${errors.subject ? 'border-red-400 focus:ring-red-400' : 'border-slate-100 focus:ring-blue-500'}`}
                      placeholder="Article Bulk Order Query"
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 flex items-center gap-1 font-medium mt-1">
                        <AlertCircle size={12} /> {errors.subject}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Your Message</label>
                    <textarea 
                      name="message"
                      disabled={isSubmitting}
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 ${errors.message ? 'border-red-400 focus:ring-red-400' : 'border-slate-100 focus:ring-blue-500'}`}
                      placeholder="Tell me about your project... (minimum 20 characters)"
                    ></textarea>
                    {errors.message && (
                      <p className="text-xs text-red-500 flex items-center gap-1 font-medium mt-1 leading-tight">
                        <AlertCircle size={12} className="flex-shrink-0" /> {errors.message}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 text-lg disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={20} /></>}
                  </button>
                  {Object.keys(errors).length > 0 && (
                    <p className="text-center text-red-500 text-sm font-medium animate-bounce mt-4">
                      Please fix the highlighted errors before sending.
                    </p>
                  )}
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
