
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLang } from '../App';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-6 border-b border-gray-100 last:border-0 pb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex items-center justify-between group transition-all"
      >
        <span className={`font-black text-xl md:text-2xl tracking-tighter transition-colors ${isOpen ? 'text-gold' : 'text-green-950 group-hover:text-gold'}`}>
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

  return (
    <div className="bg-white">
      <section className="pt-48 pb-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.faq.hero.badge}</span>
          <h1 className="text-6xl md:text-8xl font-black text-green-950 tracking-tighter leading-none mb-12">
            {t.faq.hero.title.split(' ')[0]} <br /> {t.faq.hero.title.split(' ').slice(1).join(' ')}
          </h1>
        </div>
      </section>

      <section className="py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-4">
            {t.faq.items.map((item: any, idx: number) => (
              <FAQItem key={idx} question={`${idx + 1}. ${item.q}`} answer={item.a} />
            ))}
          </div>
          
          <div className="mt-24 p-12 bg-green-950 rounded-[3rem] text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gold/5 blur-[80px]"></div>
             <div className="relative z-10">
               <HelpCircle size={48} className="mx-auto text-gold mb-6" />
               <h3 className="text-3xl font-black tracking-tighter mb-4">{t.faq.cta.title}</h3>
               <p className="text-white/60 font-medium mb-8">{t.faq.cta.sub}</p>
               <Link to="/contact" className="bg-white text-green-950 px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-gold hover:text-white transition-all uppercase">
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
