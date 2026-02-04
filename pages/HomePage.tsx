
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Target, Clock, Star, ArrowRight } from 'lucide-react';
import { INTRODUCTION, ARTICLES } from '../constants';

const Feature = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-lg mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomePage = () => {
  const featured = ARTICLES.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-32 bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
              Tech Content Specialist
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Transforming Complex <span className="gradient-text">Cloud Tech</span> Into Engaging Content
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl">
              {INTRODUCTION}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/services" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                Order Articles <ChevronRight size={20} />
              </Link>
              <Link to="/portfolio" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                View Portfolio <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose My Content?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            I deliver more than just words. I provide technical accuracy combined with marketing strategy.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature icon={Zap} title="100% Original" desc="Zero fluff, zero plagiarism. Every article is written from scratch with technical depth." />
          <Feature icon={Target} title="SEO Optimized" desc="Rank higher on Google with proper keyword placement, headings, and semantic structure." />
          <Feature icon={Clock} title="Fast Delivery" desc="Get your articles within 1-3 days. Time is money, and I respect your deadlines." />
          <Feature icon={Star} title="Expert Insight" desc="Real world experience in Serverless, SaaS, and Cloud Architecture." />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Insights</h2>
            <p className="text-slate-600">Explore my latest thoughts on cloud architecture and tech trends.</p>
          </div>
          <Link to="/blog" className="hidden md:flex items-center text-blue-600 font-semibold hover:gap-2 transition-all group">
            All Articles <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((article) => (
            <Link key={article.id} to={`/blog/${article.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full uppercase">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{article.date}</span>
                  <span>{article.readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] p-12 lg:p-20 relative overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px]" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 relative">Ready to grow your blog traffic?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative">
            Let’s collaborate to create high-impact tech content that converts readers into loyal users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <Link to="/services" className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all">
              See Pricing & Services
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:bg-slate-700 transition-all">
              Message Me directly
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
