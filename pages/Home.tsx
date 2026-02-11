
import React from 'react';
import { Leaf, ShieldCheck, Microscope, ArrowRight, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';

const Home: React.FC = () => {
  const { t } = useLang();
  
  const icons = [Leaf, ShieldCheck, Microscope, Globe];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-hero-pattern py-20 lg:py-0">
        <div className="container mx-auto px-6 lg:px-12 z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-6 md:mb-8 animate-fadeIn">
              {t.home.hero.badge}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[1.1] md:leading-[1] tracking-tighter mb-6 md:mb-8">
               {t.home.hero.title}
            </h1>
            <p className="text-base md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-2xl font-light italic leading-relaxed">
               {t.home.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Link to="/products" className="bg-white text-green-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-[10px] tracking-widest hover:bg-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group">
                {t.home.cta.products} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-[10px] tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-center">
                {t.home.cta.story}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract visual element - Adjusted for mobile visibility */}
        <div className="absolute right-[-15%] lg:right-[-10%] bottom-0 lg:bottom-10 w-[80%] lg:w-[60%] opacity-20 lg:opacity-100 animate-float pointer-events-none overflow-hidden">
           <div className="relative transform translate-y-20 lg:translate-y-0">
              <div className="absolute inset-0 bg-gold/20 blur-[80px] lg:blur-[120px] rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1543158061-68340d859817?auto=format&fit=crop&w=1000&q=80" 
                alt="Seeds" 
                className="rounded-[2rem] lg:rounded-[4rem] rotate-6 shadow-2xl border-[6px] lg:border-[12px] border-white/5 relative z-10"
              />
           </div>
        </div>
      </section>

      {/* Trust Badges - Improved wrap for mobile */}
      <section className="bg-white py-10 md:py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
           <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12 opacity-30 grayscale overflow-hidden">
              <span className="text-base md:text-xl font-black text-gray-400 whitespace-nowrap">USA MARKET</span>
              <span className="text-base md:text-xl font-black text-gray-400 whitespace-nowrap">ROTTERDAM HUB</span>
              <span className="text-base md:text-xl font-black text-gray-400 whitespace-nowrap">BIO CERTIFIED</span>
              <span className="text-base md:text-xl font-black text-gray-400 whitespace-nowrap">GMP STANDARDS</span>
           </div>
        </div>
      </section>
      
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
            <div className="lg:col-span-1">
               <span className="text-gold font-black tracking-[0.2em] text-[10px] mb-4 block uppercase">{t.home.edge.badge}</span>
               <h2 className="text-3xl md:text-4xl font-black text-green-950 tracking-tighter leading-tight mb-8">
                 {t.home.edge.title}
               </h2>
               <div className="p-5 md:p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 max-w-sm">
                  <Zap size={24} className="text-gold shrink-0" />
                  <div>
                    <h4 className="font-black text-xs text-green-950">{t.home.edge.fulfillment}</h4>
                    <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest">{t.home.edge.fulfillmentSub}</p>
                  </div>
               </div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
               {t.home.features.map((c: any, i: number) => {
                 const Icon = icons[i];
                 return (
                  <div key={i} className="bg-white p-8 md:p-10 rounded-2xl md:rounded-3xl border border-gray-100 hover:shadow-xl transition-all group">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center text-green-800 mb-6 group-hover:bg-green-900 group-hover:text-white transition-colors">
                      <Icon size={20} className="md:size-[24px]" />
                    </div>
                    <h3 className="text-base md:text-lg font-black text-green-950 mb-2 uppercase tracking-tighter">{c.title}</h3>
                    <p className="text-gray-400 text-[11px] md:text-xs font-medium leading-relaxed">{c.desc}</p>
                  </div>
                 );
               })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - Responsive Text */}
      <section className="py-20 md:py-24 bg-green-950 text-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-10 md:mb-12">{t.home.impact.title}</h2>
           <Link to="/blog" className="inline-flex items-center gap-4 text-gold font-black tracking-widest uppercase text-[10px] border-b-2 border-gold pb-1 hover:text-white hover:border-white transition-all">
             {t.home.impact.link} <ArrowRight size={16} />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
