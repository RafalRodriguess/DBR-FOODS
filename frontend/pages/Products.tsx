import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight, Sparkles, ShieldCheck, Truck, SlidersHorizontal } from 'lucide-react';
import { useLang } from '../App';
import { listPublicProducts, type PublicProductDisplay } from '../utils/productsApi';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBenefit, setActiveBenefit] = useState('all');
  const [products, setProducts] = useState<PublicProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const catalogSectionRef = useRef<HTMLElement>(null);
  const isInitialMount = useRef(true);
  const { t, lang } = useLang();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listPublicProducts({ per_page: 200 });
      setProducts(list);
    } catch (e) {
      setError((e as Error).message ?? 'Erro ao carregar produtos.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Ao mudar categoria ou benefício, manter scroll no topo do catálogo (evita "descer lá pra baixo")
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeCategory, activeBenefit]);

  const labels = {
    all: lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All',
    catalogTitle: lang === 'pt' ? 'Catalogo completo para trade e atacado' : lang === 'es' ? 'Catalogo completo para comercio mayorista' : 'Complete catalog for trade and wholesale',
    catalogSub: lang === 'pt' ? 'Filtre por categoria, beneficio e nome do ingrediente para encontrar rapidamente o que voce precisa.' : lang === 'es' ? 'Filtra por categoria, beneficio y nombre del ingrediente para encontrar rapidamente lo que necesitas.' : 'Filter by category, benefit and ingredient name to quickly find what you need.',
    category: lang === 'pt' ? 'Categoria' : lang === 'es' ? 'Categoria' : 'Category',
    benefit: lang === 'pt' ? 'Beneficio' : lang === 'es' ? 'Beneficio' : 'Benefit',
    purity: lang === 'pt' ? 'Pureza' : lang === 'es' ? 'Pureza' : 'Purity',
    result: lang === 'pt' ? 'resultados encontrados' : lang === 'es' ? 'resultados encontrados' : 'results found',
    requestQuote: lang === 'pt' ? 'Solicitar cotacao' : lang === 'es' ? 'Solicitar cotizacion' : 'Request quote',
    clearFilters: lang === 'pt' ? 'Limpar filtros' : lang === 'es' ? 'Limpiar filtros' : 'Clear filters',
    portfolio: lang === 'pt' ? 'Portfólio premium de superalimentos' : lang === 'es' ? 'Portafolio premium de superalimentos' : 'Premium superfood portfolio',
    quality: lang === 'pt' ? 'Sourcing orientado por qualidade' : lang === 'es' ? 'Abastecimiento orientado por calidad' : 'Quality-driven sourcing',
    logistics: lang === 'pt' ? 'Pronto para logística global' : lang === 'es' ? 'Listo para logística global' : 'Ready for global logistics',
    tradeSelection: lang === 'pt' ? 'Seleção para trade' : lang === 'es' ? 'Selección para trade' : 'Trade Selection',
    filtersTitle: lang === 'pt' ? 'Filtros' : lang === 'es' ? 'Filtros' : 'Filters',
    tradeBadge: 'Trade & Wholesale',
    tradeTitle: lang === 'pt' ? 'Pronto para comprar com confiança?' : lang === 'es' ? '¿Listo para comprar con confianza?' : 'Ready to source with confidence?',
    tradeText:
      lang === 'pt'
        ? 'Fale com nosso time para disponibilidade, especificações técnicas e condições comerciais por volume.'
        : lang === 'es'
          ? 'Habla con nuestro equipo para disponibilidad, especificaciones técnicas y condiciones comerciales por volumen.'
          : 'Talk to our team for availability, technical specs and volume-based commercial terms.',
    noResults: lang === 'pt' ? 'Nenhum produto encontrado para esse filtro.' : lang === 'es' ? 'No se encontraron productos para este filtro.' : 'No products found for this filter.',
    highlights: lang === 'pt' ? ['Origem rastreável', 'Padrão premium', 'Entrega global'] : lang === 'es' ? ['Origen trazable', 'Estándar premium', 'Entrega global'] : ['Traceable origin', 'Premium standard', 'Global delivery']
  };

  const categories = useMemo(() => [labels.all, ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))], [products, labels.all]);
  const benefits = useMemo(() => [labels.all, ...Array.from(new Set(products.map((p) => p.benefit).filter(Boolean)))], [products, labels.all]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.benefit ?? '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesBenefit = activeBenefit === 'all' || p.benefit === activeBenefit;
      return matchesSearch && matchesCategory && matchesBenefit;
    });
  }, [products, searchTerm, activeCategory, activeBenefit]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === labels.all ? 'all' : category);
  };
  const handleBenefitClick = (benefit: string) => {
    setActiveBenefit(benefit === labels.all ? 'all' : benefit);
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveBenefit('all');
    setSearchTerm('');
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto pl-0 pr-6 lg:pr-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="max-w-2xl">
              <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.products.hero.badge}</span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">{t.products.hero.title}</h1>
              <p className="text-white/75 font-medium max-w-xl text-sm md:text-base">{labels.catalogSub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {labels.highlights.map((highlight) => (
                  <span key={highlight} className="px-4 py-2 rounded-full border border-white/20 text-[10px] font-black tracking-widest uppercase text-white/80">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-auto">
               <div className="relative group w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder={t.products.searchPlaceholder || "Search..."} 
                    value={searchTerm}
                    className="pl-12 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl w-full outline-none focus:border-gold focus:bg-white/15 transition-all text-sm text-white placeholder:text-white/50"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <Sparkles size={18} className="text-gold" />
              <p className="text-[11px] font-black tracking-wider uppercase text-green-950">{labels.portfolio}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <ShieldCheck size={18} className="text-gold" />
              <p className="text-[11px] font-black tracking-wider uppercase text-green-950">{labels.quality}</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <Truck size={18} className="text-gold" />
              <p className="text-[11px] font-black tracking-wider uppercase text-green-950">{labels.logistics}</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={catalogSectionRef} className="py-14 md:py-16 bg-white scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-gold font-semibold tracking-[0.25em] text-[10px] uppercase mb-2 block">{labels.tradeSelection}</span>
              <h2 className="text-2xl md:text-4xl font-bold text-green-950 tracking-tight">{labels.catalogTitle}</h2>
            </div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
              {loading ? '...' : `${filteredProducts.length} ${labels.result}`}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28 bg-gray-50 border border-gray-100 rounded-[2rem] p-6 md:p-7">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-2 text-green-950 font-black text-sm uppercase tracking-widest">
                    <SlidersHorizontal size={16} className="text-gold" />
                    {labels.filtersTitle}
                  </h3>
                  <button onClick={resetFilters} className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-gold transition-colors">
                    {labels.clearFilters}
                  </button>
                </div>

                <div className="mb-7">
                  <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">{labels.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isActive = (category === labels.all && activeCategory === 'all') || category === activeCategory;
                      return (
                        <button
                          key={category}
                          onClick={() => handleCategoryClick(category)}
                          className={`px-3 py-2 rounded-full text-[10px] font-black tracking-wide uppercase border transition-all ${
                            isActive ? 'bg-green-950 text-white border-green-950' : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-gold'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">{labels.benefit}</p>
                  <div className="flex flex-wrap gap-2">
                    {benefits.map((benefit) => {
                      const isActive = (benefit === labels.all && activeBenefit === 'all') || benefit === activeBenefit;
                      return (
                        <button
                          key={benefit}
                          onClick={() => handleBenefitClick(benefit)}
                          className={`px-3 py-2 rounded-full text-[10px] font-black tracking-wide uppercase border transition-all ${
                            isActive ? 'bg-gold text-white border-gold' : 'bg-white text-gray-500 border-gray-200 hover:border-gold hover:text-gold'
                          }`}
                        >
                          {benefit}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9">
              {loading ? (
                <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-400 font-black tracking-wider uppercase text-sm">Carregando produtos...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                {filteredProducts.map((p) => (
                  <Link key={p.id} to={`/products/${p.slug}`} className="block">
                    <article className="bg-white border border-gray-100 rounded-[1.75rem] p-5 md:p-6 hover:shadow-xl transition-all group h-full">
                      <div className="relative h-56 md:h-72 lg:h-80 rounded-2xl overflow-hidden mb-5 flex items-center justify-center bg-gray-50/40">
                        <img src={p.img} alt={p.name} className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[8px] font-black tracking-widest uppercase text-green-950 shadow-sm">
                          {p.category}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-lg font-bold text-green-950 tracking-tight leading-snug">{p.name}</h3>
                        <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gold transition-colors shrink-0 mt-1" />
                      </div>

                      {p.purity && (
                        <div className="mb-4">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{labels.purity}</p>
                            <p className="text-xs font-bold text-green-950">{p.purity}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {p.benefit ? (
                          <div>
                          <p className="text-[9px] font-black tracking-widest uppercase text-gray-400 mb-1">{labels.benefit}</p>
                          <p className="text-xs font-bold text-gold uppercase">{p.benefit}</p>
                          </div>
                        ) : null}
                        <span className="text-[10px] font-black tracking-widest uppercase text-green-950 group-hover:text-gold transition-colors">
                          {labels.requestQuote}
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
                      <p className="text-gray-400 font-black tracking-wider uppercase text-sm">{labels.noResults}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-green-950 text-white rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-14 lg:p-16 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-44 h-44 md:w-64 md:h-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative z-10 max-w-3xl">
              <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{labels.tradeBadge}</span>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight mb-4 md:mb-6">
                {labels.tradeTitle}
              </h3>
              <p className="text-white/70 font-medium text-sm md:text-base mb-8">{labels.tradeText}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="inline-block bg-white text-green-950 px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-[10px] md:text-xs tracking-widest hover:bg-gold hover:text-white transition-all shadow-xl uppercase text-center">
                  {t.products.cta}
                </Link>
                <Link to="/services" className="inline-block border border-white/30 text-white px-10 md:px-12 py-4 md:py-5 rounded-full font-semibold text-[10px] md:text-xs tracking-widest hover:bg-white/10 transition-all uppercase text-center">
                  {t.common.learnMore}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
