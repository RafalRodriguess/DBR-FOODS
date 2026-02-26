import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLang } from '../App';
import type { Faq } from '../utils/faqsApi';
import { listPublicFaqs } from '../utils/faqsApi';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-6 border-b border-gray-100 last:border-0 pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex items-center justify-between group transition-all"
      >
        <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors ${isOpen ? 'text-gold' : 'text-green-950 group-hover:text-gold'}`}>
          {question}
        </span>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-gold text-white rotate-180' : 'bg-gray-100 text-green-900'}`}>
           <ChevronDown size={20} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-500 text-lg leading-relaxed font-medium max-w-3xl">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const { t } = useLang();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicFaqs()
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  const items = faqs.length > 0
    ? faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))
    : (t.faq.items as { q: string; a: string }[]).map((item) => ({ question: item.q, answer: item.a }));

  return (
    <div className="bg-white">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto px-6 lg:px-12 text-left relative z-10">
          <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.faq.hero.badge}</span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-8 md:mb-12">
            {t.faq.hero.title.split(' ')[0]} <br /> {t.faq.hero.title.split(' ').slice(1).join(' ')}
          </h1>
          <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 opacity-90">
            {['Organic Focus', 'Global Sourcing', 'Quality First'].map((badge) => (
              <span key={badge} className="px-4 py-2 rounded-full border border-white/20 text-[10px] font-black tracking-widest uppercase text-white/80">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] shadow-xl p-6 md:p-10">
          {loading ? (
            <p className="text-center text-gray-500 font-medium py-8">{t.common.loading ?? 'Carregando...'}</p>
          ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <FAQItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </div>
          )}
          </div>
          
          <div className="mt-24 p-12 bg-green-950 rounded-[3rem] text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gold/5 blur-[80px]"></div>
             <div className="relative z-10">
               <HelpCircle size={48} className="mx-auto text-gold mb-6" />
               <h3 className="text-2xl font-bold tracking-tight mb-4">{t.faq.cta.title}</h3>
               <p className="text-white/60 font-medium mb-8">{t.faq.cta.sub}</p>
               <Link to="/contact" className="bg-white text-green-950 px-10 py-4 rounded-full font-bold text-xs tracking-widest hover:bg-gold hover:text-white transition-all uppercase">
                 {t.common.contactUs}
               </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
