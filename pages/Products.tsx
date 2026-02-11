
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpRight } from 'lucide-react';
import { useLang } from '../App';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLang();

  const products = [
    { name: 'Black Chia Seeds', type: 'Organic / Conv.', purity: '>99.95%', origin: 'Paraguay', img: 'https://images.unsplash.com/photo-1596711910609-0d12759e0a0d?auto=format&fit=crop&w=600&q=80' },
    { name: 'White Quinoa', type: 'Conventional', purity: '>99.90%', origin: 'Spain', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Psyllium Husk', type: 'Organic / Conv.', purity: '95% to 99%', origin: 'India', img: 'https://images.unsplash.com/photo-1596167447475-474070776569?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ashwagandha Root', type: 'Organic / Conv.', purity: '100% Extract', origin: 'India', img: 'https://images.unsplash.com/photo-1563823251941-b9989d1e8d97?auto=format&fit=crop&w=600&q=80' },
    { name: 'Sesame Seeds', type: 'Conventional', purity: '99%', origin: 'Paraguay', img: 'https://images.unsplash.com/photo-1596167447475-474070776569?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hemp Seeds', type: 'Dehulled / Protein', purity: 'Various', origin: 'France & China', img: 'https://images.unsplash.com/photo-1597405230245-8f553926955a?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 md:pt-48 pb-16 md:pb-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="max-w-2xl">
              <span className="text-gold font-black tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.products.hero.badge}</span>
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-green-950 tracking-tighter leading-none mb-6">{t.products.hero.title}</h1>
              <p className="text-gray-500 font-medium max-w-md text-sm md:text-base">{t.products.hero.sub}</p>
            </div>
            
            <div className="w-full lg:w-auto">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder={t.products.searchPlaceholder || "Search..."} 
                    className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl w-full md:w-80 outline-none focus:border-gold transition-all shadow-sm text-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
            {products
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((p, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] mb-6 md:mb-10 shadow-xl md:shadow-2xl transition-bezier h-[350px] md:h-[450px]">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-all"></div>
                  
                  <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 right-8 md:right-12 text-white">
                    <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] text-gold uppercase mb-2 block">{p.type}</span>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-tight mb-4 md:mb-6">{p.name}</h3>
                    <div className="pt-4 md:pt-6 border-t border-white/10 flex justify-between items-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0">
                       <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                         <p className="text-white/60">Purity</p>
                         <p className="text-white">{p.purity}</p>
                       </div>
                       <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-right">
                         <p className="text-white/60">Origin</p>
                         <p className="text-white">{p.origin}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -rotate-45 group-hover:rotate-0">
                    <ArrowUpRight size={20} className="md:size-[24px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
           <Link to="/contact" className="inline-block bg-green-950 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs tracking-widest hover:bg-gold transition-all shadow-xl uppercase">
             {t.products.cta}
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Products;
