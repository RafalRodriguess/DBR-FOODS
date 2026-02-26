
import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, ShieldCheck, Microscope, ArrowRight, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';
import { listPublicProducts, type PublicProductDisplay } from '../utils/productsApi';
import { listPostsPublic } from '../utils/blogApi';

const FALLBACK_PRODUCTS: { name: string; img: string; slug?: string }[] = [
  { name: 'Cacao Powder', img: '/produtos/Cacao_Powder_Bowl.webp' },
  { name: 'Chia Seeds', img: '/produtos/Chia_Seeds_Bowl.webp' },
  { name: 'Pea Protein Powder', img: '/produtos/Pea_Protein_Powder_Bowl.png' },
  { name: 'Spirulina Powder', img: '/produtos/Spirulina_Powder_Bowl-copy.webp' },
  { name: 'Turmeric Powder', img: '/produtos/Turmeric_Powder_Bowl-copy.webp' },
];

const PLACEHOLDER_BLOG_IMG = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80';

const Home: React.FC = () => {
  const { t, lang } = useLang();
  const [sliderIndex, setSliderIndex] = useState(0);
  const [products, setProducts] = useState<PublicProductDisplay[]>([]);
  const [blogHighlights, setBlogHighlights] = useState<{ id: number; slug: string; title: string; excerpt: string; img: string }[]>([]);

  const loadProducts = useCallback(async () => {
    try {
      const list = await listPublicProducts({ per_page: 20 });
      setProducts(list);
    } catch {
      setProducts([]);
    }
  }, []);

  const loadBlogHighlights = useCallback(async () => {
    try {
      const { blog_posts } = await listPostsPublic({ per_page: 3 });
      setBlogHighlights(
        blog_posts.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt ?? '',
          img: p.featured_image ?? PLACEHOLDER_BLOG_IMG,
        }))
      );
    } catch {
      setBlogHighlights([]);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadBlogHighlights();
  }, [loadBlogHighlights]);

  const productsSlider = products.length > 0 ? products : FALLBACK_PRODUCTS;
  const productsStrip = products.length > 0 ? products.slice(0, 8) : FALLBACK_PRODUCTS.slice(0, 4);

  useEffect(() => {
    if (productsSlider.length === 0) return;
    const interval = setInterval(() => {
      setSliderIndex((i) => (i + 1) % productsSlider.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productsSlider.length]);

  const icons = [Leaf, ShieldCheck, Microscope, Globe];

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
      <section className="relative min-h-[62vh] flex items-center bg-hero-pattern pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16">
        <div className="container mx-auto px-6 lg:px-12 z-10">
          <div className="max-w-4xl animate-float-hero text-center md:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[9px] md:text-[10px] font-semibold tracking-[0.3em] uppercase mb-8 md:mb-10 animate-fadeIn">
              {t.home.hero.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-8 md:mb-10">
               {t.home.hero.title}
            </h1>
            <p className="text-base md:text-2xl text-gray-300 mb-10 md:mb-14 max-w-2xl font-light italic leading-relaxed mx-auto md:mx-0">
               {t.home.hero.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-start">
              <Link to="/products" className="bg-white text-green-950 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-[10px] tracking-widest hover:bg-[#DC9C01] transition-colors shadow-2xl flex items-center justify-center gap-3 group">
                <span className="group-hover:text-white text-green-950 transition-colors">{t.home.cta.products}</span>
                <ArrowRight size={16} className="group-hover:text-white text-green-950 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
              <Link to="/about" className="border border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-semibold text-[10px] tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm text-center">
                {t.home.cta.story}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract visual element - sem animação (só o bloco do hero se mexe) */}
        <div className="absolute right-[-15%] lg:right-[-10%] bottom-0 lg:bottom-10 w-[80%] lg:w-[60%] opacity-20 lg:opacity-100 pointer-events-none overflow-hidden">
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

      {/* Divisor em forma de folha - fino, encostado no hero */}
      <div className="relative w-full shrink-0" aria-hidden="true">
        <svg viewBox="0 0 1440 100" className="w-full h-4 md:h-5 block" preserveAspectRatio="none">
          <path fill="white" d="M0,0 L1440,0 L1440,50 Q720,95 0,50 Z" />
        </svg>
      </div>

      {/* Faixa de produtos - scroll infinito, sem fundo nos chips */}
      <section className="bg-white py-2 md:py-2.5 px-4 md:px-6 border-b border-gray-100 overflow-hidden -mt-2">
        <div className="flex w-max animate-marquee-products items-center gap-0">
          {[...Array(6)].flatMap(() => productsStrip).map((product, i) => (
            <Link
              key={`${product.name}-${i}`}
              to={'slug' in product && product.slug ? `/products/${product.slug}` : '/products'}
              className="group flex items-center gap-2 mx-2 md:mx-2.5 shrink-0 rounded-lg px-2 py-1.5 md:px-2.5 md:py-1.5 hover:bg-gold/10 transition-all duration-300"
            >
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-md overflow-hidden shrink-0 ring-1 ring-gray-200/80 group-hover:ring-gold/30 transition-all">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-green-950 group-hover:text-gold transition-colors whitespace-nowrap">
                {product.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      
      {/* DBR Edge - Uma seção única (split verde + conteúdo) - versão melhorada */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
            {/* Coluna verde - DBR Edge */}
            <div className="xl:col-span-5 bg-green-950 text-white p-8 md:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 md:w-56 md:h-56 opacity-15 rounded-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1543158061-68340d859817?auto=format&fit=crop&w=400&q=80" alt="" className="w-full h-full object-cover" aria-hidden />
              </div>
              <div className="relative z-10">
                <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">{t.home.edge.badge}</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-5 md:mb-6">
                  {t.home.edge.title}
                </h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">{homeLabels.edgeCopy}</p>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl md:rounded-2xl p-4 md:p-5">
                    <p className="text-2xl md:text-3xl font-bold text-gold">+24</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mt-1">{homeLabels.statMarkets}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl md:rounded-2xl p-4 md:p-5">
                    <p className="text-2xl md:text-3xl font-bold text-gold">98%</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mt-1">{homeLabels.statCompliance}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 md:p-5 bg-white rounded-xl md:rounded-2xl shadow-lg text-green-950">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
                    <Zap size={22} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg">{t.home.edge.fulfillment}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.15em]">{t.home.edge.fulfillmentSub}</p>
                  </div>
                </div>

                {/* Slider de produtos - 2 imagens por vez */}
                <div className="mt-6 md:mt-8 max-w-[320px] mx-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1].map((offset) => {
                      const p = productsSlider[(sliderIndex + offset) % productsSlider.length];
                      return (
                        <div key={`${p.name}-${offset}`} className="space-y-2">
                          <div className="relative overflow-hidden aspect-square rounded-lg">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover object-center" />
                          </div>
                          <p className="text-center text-white font-semibold text-sm">{p.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna clara - Imagem, Quality, Produtos e Features */}
            <div className="xl:col-span-7 bg-white p-6 md:p-8 lg:p-10 flex flex-col gap-6 md:gap-7">
              {/* Imagem + DBR Quality */}
              <div className="rounded-2xl overflow-hidden relative h-48 md:h-56 flex-shrink-0">
                <img src="/shutterstock_563494552.png" alt="Grãos e superalimentos" className="w-full h-full object-cover object-[center_60%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5">
                  <div className="bg-white/95 backdrop-blur rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/80 shadow-lg">
                    <p className="text-[10px] font-semibold text-gold uppercase tracking-[0.2em] mb-1">{homeLabels.qualityTitle}</p>
                    <p className="text-sm md:text-base font-bold text-green-950">{homeLabels.qualityText}</p>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div className="rounded-xl md:rounded-2xl border border-gray-100 bg-gray-50/60 p-3 md:p-4 flex-shrink-0">
                <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-3">
                  {lang === 'pt' ? 'Alguns dos nossos produtos' : lang === 'es' ? 'Algunos de nuestros productos' : 'Some of our products'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {productsStrip.slice(0, 4).map((p) => (
                    <Link key={p.name} to={'slug' in p && p.slug ? `/products/${p.slug}` : '/products'} className="group flex flex-col items-center gap-2 rounded-lg border border-gray-100 bg-white p-3 hover:border-gold/40 hover:shadow-md transition-all">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-xs font-semibold text-green-950 group-hover:text-gold transition-colors text-center">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Features 2x2 */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1 min-h-0">
                {t.home.features.map((c: any, i: number) => {
                  const Icon = icons[i];
                  return (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl p-4 md:p-5 hover:shadow-lg hover:border-gold/20 transition-all group">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white flex items-center justify-center text-green-800 mb-3 group-hover:bg-gold group-hover:text-green-950 transition-colors border border-gray-100">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-green-950 mb-1 uppercase tracking-tight">{c.title}</h3>
                      <p className="text-gray-500 text-xs font-medium leading-snug">{c.desc}</p>
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
            <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-10 md:mb-12">{t.home.impact.title}</h2>
            <Link to="/blog" className="inline-flex items-center gap-4 text-gold font-semibold tracking-widest uppercase text-[10px] border-b-2 border-gold pb-1 hover:text-white hover:border-white transition-all">
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
                  <h3 className="text-xl font-bold tracking-tight mb-3 leading-tight">{post.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-gold text-[10px] font-semibold tracking-widest uppercase hover:text-white transition-colors">
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
