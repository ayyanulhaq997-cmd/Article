
import React from 'react';
import SEO from '../components/SEO';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-20 bg-slate-50">
    <SEO title={`${title} | Ayyan.tech`} description={`Legal information for Ayyan.tech: ${title}`} />
    <div className="max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-[2rem] p-10 md:p-16 border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900 mb-10 border-b border-slate-100 pb-6">{title}</h1>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
          {children}
        </div>
        <div className="mt-16 pt-8 border-t border-slate-100 text-sm text-slate-400 italic">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy">
    <p>At Ayyan.tech, we value your privacy. This policy explains how we collect and use your data when you visit our publication.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">1. Information We Collect</h3>
    <p>We collect basic information such as your IP address, browser type, and pages visited for analytical purposes through third-party services like Google Analytics and AdSense.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">2. Cookies and Tracking</h3>
    <p>We use cookies to personalize content and ads. Google, as a third-party vendor, uses cookies to serve ads on our site based on your visits to our site and other sites on the Internet.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">3. AdSense and DoubleClick Cookie</h3>
    <p>Google's use of advertising cookies enables it and its partners to serve ads to our users. Users may opt out of personalized advertising by visiting Ads Settings.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">4. Email Data</h3>
    <p>If you subscribe to our newsletter via Formspree, we only use your email to send tech insights. We never sell your data.</p>
  </LegalLayout>
);

export const TermsOfService = () => (
  <LegalLayout title="Terms of Service">
    <p>Welcome to Ayyan.tech. By accessing this website, you agree to comply with the following terms.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">1. Content Ownership</h3>
    <p>All tech articles, code snippets, and original research are the intellectual property of Ayyan u l Haq unless otherwise stated. Redistribution without credit is prohibited.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">2. Professional Disclaimer</h3>
    <p>The technical information provided is for educational purposes. We are not liable for any issues arising from applying technical advice in production environments.</p>
    
    <h3 className="text-slate-900 font-bold mt-8 mb-4">3. External Links</h3>
    <p>We may link to external tools or cloud providers. We do not control their content and are not responsible for their individual privacy practices.</p>
  </LegalLayout>
);
