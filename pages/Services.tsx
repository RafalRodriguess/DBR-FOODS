
import React from 'react';
import { ShieldCheck, Users, Truck, Globe, SearchCode, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';

const Services: React.FC = () => {
  const { t } = useLang();
  const icons = [ShieldCheck, SearchCode, Truck, Users, ClipboardCheck, Globe];

  const images = [
    'https://images.unsplash.com/photo-1543158061-68340d859817?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1532187875302-1ee624d3ef9e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80'
  ];

  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-48 pb-16 md:pb-24 bg-green-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 lg:w-1/3 h-full bg-gold/10 blur-[80px] lg:blur-[120px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.services.hero.badge}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
            {t.services.hero.title}
          </h1>
          <p className="text-gray-400 max-w-xl text-base md:text-lg font-medium">{t.services.hero.sub}</p>
        </div>
      </section>

      {/* Main Services Cards */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {t.services.items.map((service: any, idx: number) => {
              const Icon = icons[idx];
              return (
                <div key={idx} className="group bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-3 md:p-4 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100">
                  <div className="overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] h-48 md:h-64 mb-6 md:mb-8">
                    <img src={images[idx]} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="px-4 md:px-6 pb-6 text-center lg:text-left">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-green-900 mb-6 shadow-sm group-hover:bg-gold group-hover:text-white transition-colors mx-auto lg:mx-0">
                      <Icon size={20} className="md:size-[24px]" />
                    </div>
                    <h4 className="text-lg md:text-xl font-black text-green-950 mb-3 tracking-tighter uppercase">{service.title}</h4>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium mb-6 line-clamp-3">{service.desc}</p>
                    <Link to="/contact" className="text-[10px] font-black tracking-widest text-gold flex items-center justify-center lg:justify-start gap-2 hover:translate-x-1 transition-transform uppercase">
                      {t.common.learnMore} <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
