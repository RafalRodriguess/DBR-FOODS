
import React from 'react';
import { Leaf, ShieldCheck, Microscope, ArrowRight, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';

const Home: React.FC = () => {
  const { t, lang } = useLang();
  
  const icons = [Leaf, ShieldCheck, Microscope, Globe];
  const blogHighlights =
    lang === 'pt'
      ? [
          {
            id: 1,
            title: 'Logística de superalimentos na Europa',
            excerpt: 'Como otimizar custos e prazos com base em Rotterdam para distribuição global.',
            img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80',
          },
          {
            id: 2,
            title: 'Qualidade e rastreabilidade por lote',
            excerpt: 'Padrões técnicos para garantir consistência de produto em mercados exigentes.',
            img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=900&q=80',
          },
          {
            id: 3,
            title: 'Tendências de ingredientes naturais 2026',
            excerpt: 'Categorias com maior demanda para indústria de alimentos e suplementos.',
            img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
          },
        ]
      : lang === 'es'
        ? [
            {
              id: 1,
              title: 'Logística de superalimentos en Europa',
              excerpt: 'Cómo optimizar costos y plazos con base en Rotterdam para distribución global.',
              img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80',
            },
            {
              id: 2,
              title: 'Calidad y trazabilidad por lote',
              excerpt: 'Estándares técnicos para garantizar consistencia en mercados exigentes.',
              img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=900&q=80',
            },
            {
              id: 3,
              title: 'Tendencias de ingredientes naturales 2026',
              excerpt: 'Categorías con mayor demanda para alimentos y suplementos.',
              img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
            },
          ]
        : [
            {
              id: 1,
              title: 'Superfood logistics in Europe',
              excerpt: 'How to optimize costs and lead times from a Rotterdam-based operation.',
              img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80',
            },
            {
              id: 2,
              title: 'Quality and batch traceability',
              excerpt: 'Technical standards to ensure product consistency in demanding markets.',
              img: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=900&q=80',
            },
            {
              id: 3,
              title: 'Natural ingredients trends 2026',
              excerpt: 'Top-demand categories for food and supplement industries.',
              img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
            },
          ];

  const homeLabels = {
    trustBadges:
      lang === 'pt'
        ? ['MERCADO EUA', 'HUB ROTTERDAM', 'CERTIFICADO BIO', 'PADRÃO GMP']
        : lang === 'es'
          ? ['MERCADO USA', 'HUB ROTTERDAM', 'CERTIFICADO BIO', 'ESTÁNDAR GMP']
          : ['USA MARKET', 'ROTTERDAM HUB', 'BIO CERTIFIED', 'GMP STANDARDS'],
    edgeCopy:
      lang === 'pt'
        ? 'Operação técnica, rastreabilidade e logística inteligente para escalar sua cadeia de suprimentos com confiança.'
        : lang === 'es'
          ? 'Operación técnica, trazabilidad y logística inteligente para escalar tu cadena de suministro con confianza.'
          : 'Technical operations, traceability and smart logistics to scale your supply chain with confidence.',
    statMarkets: lang === 'pt' ? 'Mercados atendidos' : lang === 'es' ? 'Mercados atendidos' : 'Served markets',
    statCompliance: lang === 'pt' ? 'Conformidade em lotes' : lang === 'es' ? 'Conformidad por lotes' : 'Batch compliance',
    qualityTitle: 'DBR Quality System',
    qualityText:
      lang === 'pt'
        ? 'Padronização técnica do sourcing ao destino final.'
        : lang === 'es'
          ? 'Estandarización técnica desde el sourcing hasta el destino final.'
          : 'Technical standardization from sourcing to final destination.',
  };

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
              {homeLabels.trustBadges.map((badge) => (
                <span key={badge} className="text-base md:text-xl font-black text-gray-400 whitespace-nowrap">{badge}</span>
              ))}
           </div>
        </div>
      </section>
      
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10">
            <div className="xl:col-span-5 bg-green-950 text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-gold/20 rounded-full blur-3xl" />
              <div className="absolute -top-8 -right-8 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl shadow-gold/30">
                <img
                  src="https://images.unsplash.com/photo-1543158061-68340d859817?auto=format&fit=crop&w=500&q=80"
                  alt="Superfood texture"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1596167447475-474070776569?auto=format&fit=crop&w=500&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-[#DC9C01]/35" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/40">
                    <Leaf size={30} className="text-green-950" />
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.home.edge.badge}</span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-6">
                  {t.home.edge.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base font-medium mb-8">{homeLabels.edgeCopy}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="text-2xl font-black text-gold mb-1">+24</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">{homeLabels.statMarkets}</p>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                    <p className="text-2xl font-black text-gold mb-1">98%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">{homeLabels.statCompliance}</p>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <Zap size={24} className="text-gold shrink-0" />
                  <div>
                    <h4 className="font-black text-base text-green-950">{t.home.edge.fulfillment}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">{t.home.edge.fulfillmentSub}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7">
              <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-6 md:mb-8 relative h-60 md:h-72">
                <img
                  src="https://images.unsplash.com/photo-1543158061-68340d859817?auto=format&fit=crop&w=1400&q=80"
                  alt="Grãos e superalimentos"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1597405230245-8f553926955a?auto=format&fit=crop&w=1400&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur rounded-2xl p-4 border border-white/60">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">{homeLabels.qualityTitle}</p>
                  <p className="text-sm font-bold text-green-950">{homeLabels.qualityText}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                {t.home.features.map((c: any, i: number) => {
                  const Icon = icons[i];
                  return (
                    <div key={i} className="bg-white p-6 md:p-7 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-green-800 mb-4 group-hover:bg-green-900 group-hover:text-white transition-colors">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-base md:text-lg font-black text-green-950 mb-2 uppercase tracking-tight">{c.title}</h3>
                      <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section - Responsive Text */}
      <section className="py-20 md:py-24 bg-green-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-14 md:mb-16">
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-10 md:mb-12">{t.home.impact.title}</h2>
            <Link to="/blog" className="inline-flex items-center gap-4 text-gold font-black tracking-widest uppercase text-[10px] border-b-2 border-gold pb-1 hover:text-white hover:border-white transition-all">
              {t.home.impact.link} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {blogHighlights.map((post) => (
              <article key={post.id} className="group rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                <div className="h-44 overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black tracking-tight mb-3 leading-tight">{post.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-gold text-[10px] font-black tracking-widest uppercase hover:text-white transition-colors">
                    {t.common.readMore} <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
