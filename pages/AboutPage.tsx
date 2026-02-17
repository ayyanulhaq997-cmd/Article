
import React from 'react';
import { Linkedin, Mail, ShieldCheck, Zap, Terminal, Coffee } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <div className="pb-20">
      <SEO 
        title="About Ayyan u l Haq | Tech Content Authority" 
        description="Learn about the expertise behind Ayyan.tech. Specializing in high-authority cloud and serverless content for global SaaS companies."
      />
      
      {/* Header */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Voice Behind the <span className="text-blue-500">Tech.</span></h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Ayyan u l Haq is a tech content specialist dedicated to making complex 
            cloud architectures accessible to everyone.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl border border-slate-100">
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Expertise Driven by Experience</h2>
            <p>
              In the rapidly evolving world of cloud computing, information is everywhere, but clarity is rare. 
              My mission at Ayyan.tech is to bridge that gap. With a deep focus on <strong>Serverless Architecture</strong>, 
              <strong>SaaS scalability</strong>, and <strong>Cloud-native development</strong>, I provide insights 
              that help businesses and developers build better systems.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <Terminal className="text-blue-600 mb-4" size={32} />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Technical Depth</h3>
                <p className="text-sm">I don't just write; I understand. Every piece of content is backed by technical research and hands-on understanding of cloud environments.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <ShieldCheck className="text-emerald-600 mb-4" size={32} />
                <h3 className="font-bold text-slate-900 text-xl mb-2">Editorial Quality</h3>
                <p className="text-sm">Quality is non-negotiable. My articles undergo rigorous self-editing to ensure they meet the standards of top-tier publications.</p>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-4">Why I Write</h3>
            <p>
              Technology is only as useful as our ability to understand it. I believe that by simplifying 
              complex concepts, we empower more people to innovate. Whether it's explaining the intricacies 
              of AWS Lambda pricing or strategizing a SaaS product launch, my goal is always to provide 
              <strong>high-value publisher content</strong> that lasts.
            </p>

            <blockquote className="border-l-4 border-blue-600 bg-blue-50 p-8 rounded-r-3xl italic text-slate-900 font-bold my-10">
              "My goal is to provide the bridge between high-level engineering and practical business application."
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-16 pt-10 border-t border-slate-100">
               <img src="https://picsum.photos/seed/ayyan/150" className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm" alt="Ayyan" />
               <div className="text-center sm:text-left">
                  <h4 className="text-xl font-bold text-slate-900">Ayyan u l Haq</h4>
                  <p className="text-sm text-slate-500 mb-4">Tech Publisher & Cloud Strategist</p>
                  <div className="flex justify-center sm:justify-start gap-4">
                    <a href="https://www.linkedin.com/in/ch-ayyan-jutt-a45a3b283" target="_blank" className="text-slate-400 hover:text-blue-600"><Linkedin size={20}/></a>
                    <a href="mailto:zolly9130@gmail.com" className="text-slate-400 hover:text-blue-600"><Mail size={20}/></a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Editorial Values</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Zap className="text-orange-500 mx-auto mb-6" size={40} />
            <h4 className="font-bold text-xl mb-4">Originality</h4>
            <p className="text-slate-500 text-sm">Every article is 100% original, written from scratch without the use of thin AI generation.</p>
          </div>
          <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Coffee className="text-blue-500 mx-auto mb-6" size={40} />
            <h4 className="font-bold text-xl mb-4">Persistence</h4>
            <p className="text-slate-500 text-sm">We dig deep into documentation to find the nuanced details others miss.</p>
          </div>
          <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <ShieldCheck className="text-emerald-500 mx-auto mb-6" size={40} />
            <h4 className="font-bold text-xl mb-4">Integrity</h4>
            <p className="text-slate-500 text-sm">We only recommend tools and practices that have been verified through engineering best practices.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
