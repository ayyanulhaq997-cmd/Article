
import React from 'react';
import { ExternalLink, FileText, Download, Quote } from 'lucide-react';
import { PORTFOLIO } from '../constants';
import SEO from '../components/SEO';

const PortfolioPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO 
        title="Writing Portfolio | Ayyan u l Haq" 
        description="Showcase of professional tech articles and tutorials published across top platforms. Specialized in serverless, SaaS, and cloud architecture."
        keywords="writing samples, tech portfolio, content writer samples, Ayyan portfolio"
      />
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Writing Portfolio</h1>
        <p className="text-slate-600 max-w-2xl">
          A collection of my published works across various tech platforms. 
          Specialized in long-form technical tutorials and strategic SaaS content.
        </p>
      </div>

      <div className="space-y-12">
        {PORTFOLIO.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all duration-500">
            <div className="md:w-1/3">
              <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center p-8">
                <FileText size={64} className="text-blue-100" />
              </div>
            </div>
            <div className="md:w-2/3 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.topic}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{item.wordCount} Words</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h2>
              <div className="flex items-center gap-3 mb-6 text-slate-500 italic">
                <Quote size={16} className="text-slate-300" />
                <span>Published on {item.client}</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-8">
                {item.snippet}
              </p>
              <div className="mt-auto flex flex-wrap gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                  View Full Article <ExternalLink size={16} />
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all">
                  Download Sample PDF <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Articles Written', val: '500+' },
          { label: 'Happy Clients', val: '120+' },
          { label: 'Words Crafted', val: '650k+' },
          { label: 'Avg. Rating', val: '4.9/5' }
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
            <div className="text-3xl font-extrabold text-blue-600 mb-2">{stat.val}</div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
