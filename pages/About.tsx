
import React from 'react';
import { useLang } from '../App';

const About: React.FC = () => {
  const { t } = useLang();
  
  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-48 pb-16 md:pb-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase text-center">{t.about.hero.badge}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-green-950 tracking-tighter leading-[1.1] mb-8 md:mb-12 text-center">
            {t.about.hero.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
             <div className="relative z-10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl">
               <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80" alt="Superfood farming" className="w-full h-[400px] md:h-[600px] object-cover" />
             </div>
             <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 w-48 md:w-64 h-48 md:h-64 bg-gold rounded-full -z-10 opacity-20 blur-2xl md:blur-3xl"></div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-black text-green-950 mb-6 md:mb-8 tracking-tighter leading-tight">
              {t.about.vision.title}
            </h2>
            <div className="space-y-6 text-gray-500 leading-relaxed text-base md:text-lg font-medium">
              <p>{t.about.vision.p1}</p>
              <p>{t.about.vision.p2}</p>
              <p className="text-green-900 font-bold italic border-l-4 border-gold pl-6">
                "{t.about.vision.quote}"
              </p>
            </div>
            
            <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-gray-100">
               <div>
                 <p className="text-3xl md:text-4xl font-black text-green-950 tracking-tighter">Rotterdam</p>
                 <p className="text-[10px] font-black text-gold uppercase tracking-widest mt-1">{t.about.stats?.hub || "Strategic Hub"}</p>
               </div>
               <div>
                 <p className="text-3xl md:text-4xl font-black text-green-950 tracking-tighter">Global</p>
                 <p className="text-[10px] font-black text-gold uppercase tracking-widest mt-1">{t.about.stats?.network || "Supply Network"}</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
