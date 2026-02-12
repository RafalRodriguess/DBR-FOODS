
import React from 'react';
import { ShieldCheck, Leaf, Microscope } from 'lucide-react';
import { useLang } from '../App';

const About: React.FC = () => {
  const { t, lang } = useLang();
  const aboutLabels = {
    intro:
      lang === 'pt'
        ? 'Estrutura internacional, foco em qualidade e relacionamento de longo prazo com produtores e compradores.'
        : lang === 'es'
          ? 'Estructura internacional, enfoque en calidad y relaciones de largo plazo con productores y compradores.'
          : 'International structure, quality focus and long-term relationships with producers and buyers.',
    globalWord: lang === 'pt' ? 'Global' : lang === 'es' ? 'Global' : 'Global',
    whyTitle: lang === 'pt' ? 'Por que trabalhar conosco' : lang === 'es' ? 'Por qué trabajar con nosotros' : 'Why work with us',
    whyHeadline:
      lang === 'pt'
        ? 'Qualidade técnica com visão comercial.'
        : lang === 'es'
          ? 'Calidad técnica con visión comercial.'
          : 'Technical quality with commercial vision.',
    cards:
      lang === 'pt'
        ? [
            { title: 'Orgânico e Sustentável', desc: 'Base de fornecimento responsável e seleção criteriosa de parceiros.', Icon: Leaf },
            { title: 'Testes Rigorosos', desc: 'Controles e documentação para manter consistência por lote.', Icon: Microscope },
            { title: 'Parceiro Confiável', desc: 'Processo transparente para reduzir risco e aumentar previsibilidade.', Icon: ShieldCheck },
          ]
        : lang === 'es'
          ? [
              { title: 'Orgánico y Sostenible', desc: 'Base de suministro responsable y selección cuidadosa de socios.', Icon: Leaf },
              { title: 'Pruebas Rigurosas', desc: 'Controles y documentación para mantener consistencia por lote.', Icon: Microscope },
              { title: 'Socio Confiable', desc: 'Proceso transparente para reducir riesgo y aumentar previsibilidad.', Icon: ShieldCheck },
            ]
          : [
              { title: 'Organic & Sustainable', desc: 'Responsible supply base and careful partner selection.', Icon: Leaf },
              { title: 'Rigorous Quality Testing', desc: 'Controls and documentation to keep batch consistency.', Icon: Microscope },
              { title: 'Trusted Trade Partner', desc: 'Transparent process to reduce risk and increase predictability.', Icon: ShieldCheck },
            ],
  };
  
  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-48 pb-20 md:pb-28 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase text-center">{t.about.hero.badge}</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 md:mb-12 text-center">
            {t.about.hero.title}
          </h1>
          <p className="max-w-3xl mx-auto text-center text-white/70 text-sm md:text-lg font-medium">{aboutLabels.intro}</p>
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
                 <p className="text-3xl md:text-4xl font-black text-green-950 tracking-tighter">{aboutLabels.globalWord}</p>
                 <p className="text-[10px] font-black text-gold uppercase tracking-widest mt-1">{t.about.stats?.network || "Supply Network"}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-10 md:mb-14">
            <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{aboutLabels.whyTitle}</span>
            <h3 className="text-3xl md:text-5xl font-black text-green-950 tracking-tighter leading-tight">
              {aboutLabels.whyHeadline}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {aboutLabels.cards.map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-900 flex items-center justify-center mb-6">
                  <item.Icon size={22} />
                </div>
                <h4 className="text-lg font-black tracking-tighter text-green-950 mb-3">{item.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
