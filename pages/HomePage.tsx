
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Target, Clock, Star, ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { INTRODUCTION, ARTICLES } from '../constants';
import SEO from '../components/SEO';
import NewsletterSection from '../components/NewsletterSection';

const Feature = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <Icon size={28} />
    </div>
    <h3 className="font-black text-xl mb-3 text-slate-900 tracking-tight">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const HomePage = () => {
  const featured = ARTICLES.slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      <SEO 
        title="Ayyan u l Haq | High-Authority Tech Insights & Cloud Strategy" 
        description="Professional tech content publication specializing in serverless, SaaS, and cloud computing. High-value insights for modern engineering teams."
        keywords="tech writer, cloud computing authority, serverless architecture blog, SaaS growth strategy"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32 bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-400 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-black tracking-[0.2em] text-blue-600 uppercase bg-blue-50 rounded-lg border border-blue-100">
              <Globe size={14} /> Global Tech Publication
            </span>
            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
              Engineering <span className="gradient-text">Clarity</span> for the Cloud Era.
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl font-medium">
              We translate the complexities of modern software architecture into 
              <strong> strategic, actionable insights</strong>. Our content serves as the definitive resource 
              for teams navigating the serverless and SaaS landscapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/blog" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                Explore The Publication <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                About the Author
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section (Crucial for AdSense Value) */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight uppercase">High-Value Publisher Content You Can Trust.</h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Unlike generalist blogs, Ayyan.tech focuses on high-density technical analysis. We believe in providing 
                original, well-researched content that adds real value to the tech community. Our publication follows 
                rigorous editorial standards to ensure every article meets the criteria for <strong>authoritative publishing</strong>.
              </p>
              <div className="space-y-4">
                 {[
                   { label: "Technical Accuracy First", icon: Cpu },
                   { label: "Original Research & Insights", icon: Target },
                   { label: "Scalable SaaS Methodologies", icon: Zap }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-slate-900 font-bold">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                       <item.icon size={20} />
                     </div>
                     {item.label}
                   </div>
                 ))}
              </div>
           </div>
           <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-all"></div>
              <h3 className="text-2xl font-bold mb-6 italic leading-relaxed relative z-10">
                "Ayyan's ability to break down serverless architecture saved our dev team weeks of research. 
                This is easily some of the most authoritative tech content online today."
              </h3>
              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-slate-800">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">CTO</div>
                <div>
                  <p className="font-bold">Technical Director</p>
                  <p className="text-xs text-slate-400">Leading SaaS Enterprise</p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Our Core Insights</h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            We provide deep-dives into the three main pillars of modern cloud ecosystems.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature icon={ShieldCheck} title="Serverless Authority" desc="Comprehensive guides on AWS Lambda, Event-driven architecture, and zero-infrastructure scaling." />
          <Feature icon={Target} title="SaaS Growth Strategy" desc="Expert analysis on multi-tenant architecture, product-led growth, and scalable software business models." />
          <Feature icon={Clock} title="Dev Productivity" desc="High-value tips on CI/CD pipelines, remote team optimization, and technical debt management." />
          <Feature icon={Star} title="Expert Editorial" desc="Opinion pieces and strategic forecasts from a professional tech publisher with years of experience." />
        </div>
      </section>

      {/* Featured Articles */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Recent Publications</h2>
            <p className="text-slate-600 font-medium">Original technical content published this month.</p>
          </div>
          <Link to="/blog" className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all group">
            Browse All Content <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((article) => (
            <Link key={article.id} to={`/blog/${article.id}`} className="group block bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="relative h-56 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-black rounded-lg uppercase border border-slate-100 shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-[1.1]">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest pt-6 border-t border-slate-50">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime} READ</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Quote / Philosophy (SEO Boost) */}
      <section className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">The Ayyan.tech Publisher Commitment</h2>
        <p className="text-slate-600 leading-loose italic font-medium">
          "In an age of AI-generated noise, we commit to human-first technical writing. Every article on this platform 
          is written by a subject matter expert, verified through technical documentation, and designed to provide 
          lasting educational value to the engineering community."
        </p>
        <div className="mt-8 flex justify-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-600"></div>
           <div className="w-2 h-2 rounded-full bg-blue-400"></div>
           <div className="w-2 h-2 rounded-full bg-blue-200"></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
