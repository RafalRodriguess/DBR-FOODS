
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';

const serviceImages = [
  '/servicos/High-quality.png',
  '/servicos/endtoend.png',
  '/servicos/international%20.jpg',
  '/servicos/factory.png',
  '/servicos/quality%20control.png',
];

const Services: React.FC = () => {
  const { t } = useLang();

  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-services-hero text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 lg:w-1/3 h-full bg-gold/10 blur-[80px] lg:blur-[120px]"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-left">
          <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.services.hero.badge}</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-8">
            {t.services.hero.title}
          </h1>
          <p className="text-white/80 max-w-xl text-base md:text-lg font-medium mb-8">{t.services.hero.sub}</p>
          {t.services.highlights && (
            <div className="flex flex-wrap gap-3 justify-start">
              {t.services.highlights.map((h: string) => (
                <span key={h} className="px-4 py-2 rounded-full border border-white/25 bg-white/5 text-white text-[10px] font-bold tracking-widest uppercase">
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5 serviços full-width com imagem e texto alternados */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 space-y-6 md:space-y-8">
          {t.services.items.map((service: any, idx: number) => {
            const imageLeft = idx % 2 === 0;
            return (
              <article
                key={idx}
                className="group bg-green-50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gold/40 hover:bg-green-100/80 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  <div className={`relative h-56 md:h-72 overflow-hidden lg:col-span-2 ${!imageLeft ? 'lg:order-2' : ''}`}>
                    <img src={serviceImages[idx]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute inset-0 ${imageLeft ? 'bg-gradient-to-r from-transparent via-transparent to-green-50/90' : 'bg-gradient-to-l from-transparent via-transparent to-green-50/90'}`} />
                  </div>
                  <div className={`p-6 md:p-8 flex flex-col justify-center lg:col-span-3 ${!imageLeft ? 'lg:order-1' : ''}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-green-950 mb-3 tracking-tight uppercase border-b-2 border-transparent group-hover:border-gold transition-colors w-fit pb-1">{service.title}</h3>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}

          <div className="mt-14 md:mt-20 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-green-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-[10px] md:text-xs tracking-widest hover:bg-gold hover:text-green-950 transition-all uppercase"
            >
              {t.common.contactUs} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
