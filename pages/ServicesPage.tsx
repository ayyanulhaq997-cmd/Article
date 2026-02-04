
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, ShieldCheck, Zap, ArrowRight, Star, Target } from 'lucide-react';
import { SERVICES } from '../constants';
import SEO from '../components/SEO';

const ServicesPage = () => {
  return (
    <div className="py-20 bg-slate-50">
      <SEO 
        title="Premium Tech Writing Services | Ayyan's Tech Hub" 
        description="High-quality, SEO-optimized tech content services. Custom articles, PLR bundles, and keyword research for tech blogs and SaaS companies."
        keywords="hire tech writer, tech content services, PLR tech articles, SaaS writing, cloud architecture blogging"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Professional <span className="gradient-text">Writing Services</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            High-quality, SEO-optimized tech content designed for results. Whether you need a single 
            deep-dive piece or a full batch of PLR articles, I've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className={`bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col hover:border-blue-400 transition-all duration-300 relative group ${service.id === 'custom-article' ? 'shadow-xl shadow-blue-100 ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-50' : ''}`}>
              {service.id === 'custom-article' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Star size={12} /> Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-slate-500 text-sm h-12 line-clamp-2">{service.description}</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">${service.price}</span>
                  <span className="text-slate-400 ml-1 text-sm">/ article</span>
                </div>
              </div>
              <div className="space-y-4 mb-10 flex-grow">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Check size={12} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-slate-50 mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={14} /> Est. Delivery: {service.deliveryTime}
                </div>
              </div>
              <Link to={`/checkout?id=${service.id}`} className={`w-full py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 ${
                service.id === 'custom-article'
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}>
                Order Now <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        {/* Extras / Add-ons */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">Service Extras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Express Delivery</h4>
                <p className="text-sm text-slate-500">Get it in 24 hours (+$50)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Target size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Meta Title & Desc</h4>
                <p className="text-sm text-slate-500">Optimized snippets (+$15)</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Full PLR License</h4>
                <p className="text-sm text-slate-500">Resell and redistribute (+$30)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
