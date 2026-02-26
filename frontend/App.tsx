
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu, X, Search, Phone, Mail, MapPin, 
  Facebook, Linkedin, Instagram, Globe, ChevronDown
} from 'lucide-react';

// Public Pages
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import FAQ from './pages/FAQ.tsx';
import Contact from './pages/Contact.tsx';
import Quote from './pages/Quote.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Blog from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx';
const logoImage = '/Layer_1-1.png';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import { QuoteProvider } from './context/QuoteContext.tsx';

const baseTranslation = {
  nav: { home: 'HOME', products: 'PRODUCTS', about: 'ABOUT', services: 'SERVICES', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACT', quote: 'GET A QUOTE', admin: 'ADMIN' },
  footer: {
    desc: 'Global leaders in superfood supply chain excellence.',
    navTitle: 'Navigation',
    join: 'Join the Vision',
    sub: 'Subscribe',
    newsletterBadge: 'Newsletter',
    newsletterCopy: 'Get market, logistics and superfood updates in your inbox.',
    emailPlaceholder: 'your@email.com',
    newsletterSuccess: "Newsletter active! You'll receive news and updates soon.",
    newsletterError: 'Failed to subscribe. Please try again.',
    contactTitle: 'Contact',
    socialTitle: 'Social',
    devBy: 'Developed by TecWeb Digital',
  },
  common: { learnMore: 'Learn More', readMore: 'Read More', contactUs: 'Contact Us', back: 'Back', search: 'Search articles...', send: 'Send Message' },
  home: {
    hero: { badge: 'EST. 2023 • SUPERFOOD SPECIALISTS', title: 'Empowering A Healthier World With Superfoods', sub: 'Architecting transparent supply chains for the next generation of nutrition.' },
    cta: { products: 'EXPLORE PRODUCTS', story: 'OUR STORY' },
    edge: { badge: 'THE DBR EDGE', title: "We don't just trade, we engineer quality.", fulfillment: 'Fast Fulfillment', fulfillmentSub: 'Stock ready at Rotterdam.' },
    features: [
      { title: 'Sourcing', desc: 'Ethical partnerships with growers.' },
      { title: 'Purity', desc: 'Selected ingredients for potency.' },
      { title: 'Labs', desc: 'Tested in EU labs before shipment.' },
      { title: 'Global', desc: 'Seamless logistics to major ports.' }
    ],
    impact: { title: 'Transforming the nutrition supply world.', link: 'Read our latest analysis' }
  },
  products: {
    hero: { badge: 'OUR CATALOG', title: 'Premium Superfoods', sub: 'Traceable ingredients with strict quality standards for global markets.' },
    searchPlaceholder: 'Search products...',
    cta: 'REQUEST A QUOTE'
  },
  about: {
    hero: { badge: 'WHO WE ARE', title: 'Built for Global Nutrition Supply' },
    vision: {
      title: 'Our Vision',
      p1: 'We connect producers and buyers through transparent, efficient, and responsible operations.',
      p2: 'From origin to destination, we optimize every step to protect quality and consistency.',
      quote: 'Quality is not inspected at the end. It is designed from the beginning.'
    },
    stats: { hub: 'Strategic Hub', network: 'Supply Network' }
  },
  services: {
    hero: { badge: 'WHAT WE DO', title: 'Integrated Services', sub: 'We are your partner in Superfoods sourcing.' },
    highlights: ['Qualified Raw Material', 'Experienced Team', 'Logistics', 'Connections'],
    items: [
      { title: 'High-Quality Raw Material Supply', desc: 'Qualified raw material from trusted growers with strict quality standards.' },
      { title: 'End-to-End Supply Chain Control', desc: 'Full visibility and control from farm to destination with traceability.' },
      { title: 'International Logistic Support', desc: 'Seamless logistics from Rotterdam to key global markets.' },
      { title: 'Factory Audits in Latin America', desc: 'On-site audits and supplier qualification in origin regions.' },
      { title: 'Quality Control for Every Shipment', desc: 'Testing and documentation to ensure consistency and compliance.' }
    ]
  },
  faq: {
    hero: { badge: 'FREQUENT QUESTIONS', title: 'Frequently Asked Questions' },
    items: [
      { q: 'Do you ship internationally?', a: 'Yes. We support international shipments with full documentation and tracking.' },
      { q: 'Can I request product specifications?', a: 'Absolutely. We provide technical sheets, certifications, and quality data on request.' },
      { q: 'Do you work with private label?', a: 'Depending on volume and requirements, we can evaluate private label projects.' },
      { q: 'What are your payment terms?', a: 'Terms vary by profile and order size. Contact us and we will tailor a proposal.' }
    ],
    cta: { title: 'Still have questions?', sub: 'Our team can guide you with technical and commercial details.' }
  },
  contact: {
    hero: { badge: 'CONTACT', title: 'Let us build your next supply operation' },
    info: {
      location: 'Location',
      email: 'Email',
      phone: 'Phone',
      logistics: 'Logistics Support',
      logisticsSub: 'From Rotterdam to key global destinations with controlled lead times and full visibility.'
    },
    form: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      options: ['General inquiry', 'Request a quote', 'Technical specifications', 'Logistics'],
      message: 'Message',
      robot: 'I am not a robot',
      send: 'Send Message'
    }
  },
  blog: {
    hero: { badge: 'INSIGHTS', title: 'Market Intelligence & Analysis' },
    filterBy: 'Filter by',
    categories: ['All', 'Supply Chain', 'Sustainability', 'Nutrition', 'Market Trends'],
    featured: 'Featured',
    read: 'read',
    noResults: 'No articles found',
    loadMore: 'Load More',
    newsletter: {
      title: 'Get strategic updates',
      sub: 'Receive market insights, logistics trends and superfood intelligence.',
      placeholder: 'Enter your email',
      button: 'Subscribe'
    }
  }
};

const deepMerge = (base: any, override: any): any => {
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  if (typeof base !== 'object' || base === null) return override ?? base;
  const output: any = { ...base };
  for (const key of Object.keys(override || {})) {
    output[key] = deepMerge(base[key], override[key]);
  }
  return output;
};

const translations = {
  en: baseTranslation,
  pt: deepMerge(baseTranslation, {
    nav: { home: 'INÍCIO', products: 'PRODUTOS', about: 'SOBRE', services: 'SERVIÇOS', blog: 'BLOG', faq: 'DÚVIDAS', contact: 'CONTATO', quote: 'ORÇAMENTO', admin: 'ADMIN' },
    footer: {
      desc: 'Líderes globais em excelência na cadeia de suprimentos de superalimentos.',
      navTitle: 'Navegação',
      join: 'Junte-se à Visão',
      sub: 'Inscrever-se',
      newsletterBadge: 'Newsletter',
      newsletterCopy: 'Receba novidades sobre mercado, logística e superalimentos direto no seu e-mail.',
      emailPlaceholder: 'seu@email.com',
      contactTitle: 'Contato',
      socialTitle: 'Social',
      devBy: 'Desenvolvido por TecWeb Digital',
    },
    common: { learnMore: 'Saiba Mais', readMore: 'Ler Mais', contactUs: 'Contate-nos', back: 'Voltar', search: 'Buscar artigos...', send: 'Enviar Mensagem' },
    home: {
      hero: { badge: 'EST. 2023 • ESPECIALISTAS EM SUPERALIMENTOS', title: 'Empoderando um Mundo mais Saudável', sub: 'Arquitetando cadeias de suprimentos transparentes para a próxima geração da nutrição.' },
      cta: { products: 'VER PRODUTOS', story: 'NOSSA HISTÓRIA' },
      edge: { badge: 'DIFERENCIAL DBR', title: 'Nós não apenas comercializamos, nós projetamos qualidade.', fulfillment: 'Entrega Rápida', fulfillmentSub: 'Estoque pronto em Rotterdam.' },
      features: [
        { title: 'Sourcing', desc: 'Parcerias éticas com produtores.' },
        { title: 'Pureza', desc: 'Ingredientes selecionados para máxima potência.' },
        { title: 'Laboratórios', desc: 'Testados na UE antes do envio.' },
        { title: 'Global', desc: 'Logística contínua para os principais portos.' }
      ],
      impact: { title: 'Transformando o mundo dos suprimentos nutricionais.', link: 'Leia nossa última análise' }
    },
    products: {
      hero: { badge: 'NOSSO CATÁLOGO', title: 'Superalimentos Premium', sub: 'Ingredientes rastreáveis com padrões rigorosos de qualidade para mercados globais.' },
      searchPlaceholder: 'Buscar produtos...',
      cta: 'SOLICITAR ORÇAMENTO'
    },
    about: {
      hero: { badge: 'QUEM SOMOS', title: 'Estrutura Global para Nutrição' },
      vision: {
        title: 'Nossa Visão',
        p1: 'Conectamos produtores e compradores por meio de operações transparentes, eficientes e responsáveis.',
        p2: 'Da origem ao destino, otimizamos cada etapa para preservar qualidade e consistência.',
        quote: 'Qualidade não se inspeciona no fim. Ela é projetada desde o início.'
      },
      stats: { hub: 'Hub Estratégico', network: 'Rede de Suprimentos' }
    },
    services: {
      hero: { badge: 'O QUE FAZEMOS', title: 'Serviços Integrados', sub: 'Somos seu parceiro em sourcing de superalimentos.' },
      highlights: ['Matéria-Prima Qualificada', 'Equipe Experiente', 'Logística', 'Conexões'],
      items: [
        { title: 'Fornecimento de Matéria-Prima de Alta Qualidade', desc: 'Matéria-prima qualificada de produtores confiáveis com padrões rigorosos.' },
        { title: 'Controle de Cadeia de Suprimentos Ponta a Ponta', desc: 'Visibilidade e controle da fazenda ao destino com rastreabilidade.' },
        { title: 'Suporte Logístico Internacional', desc: 'Logística impecável de Rotterdam para os principais mercados globais.' },
        { title: 'Auditorias de Fábricas na América Latina', desc: 'Auditorias in loco e qualificação de fornecedores nas regiões de origem.' },
        { title: 'Controle de Qualidade para Cada Embarque', desc: 'Testes e documentação para garantir consistência e conformidade.' }
      ]
    },
    faq: {
      hero: { badge: 'PERGUNTAS FREQUENTES', title: 'Dúvidas Frequentes' },
      items: [
        { q: 'Vocês enviam internacionalmente?', a: 'Sim. Atendemos embarques internacionais com documentação completa e rastreabilidade.' },
        { q: 'Posso solicitar especificações técnicas?', a: 'Claro. Enviamos ficha técnica, certificações e dados de qualidade sob demanda.' },
        { q: 'Vocês trabalham com marca própria?', a: 'Dependendo do volume e dos requisitos, avaliamos projetos de private label.' },
        { q: 'Quais são as condições de pagamento?', a: 'As condições variam conforme o perfil e volume. Fale com nosso time para uma proposta.' }
      ],
      cta: { title: 'Ainda tem dúvidas?', sub: 'Nosso time pode te orientar com detalhes técnicos e comerciais.' }
    },
    contact: {
      hero: { badge: 'CONTATO', title: 'Vamos construir sua próxima operação de suprimentos' },
      info: { location: 'Localização', email: 'E-mail', phone: 'Telefone', logistics: 'Suporte Logístico', logisticsSub: 'De Rotterdam para destinos globais com prazos controlados e visibilidade total.' },
      form: {
        name: 'Nome',
        email: 'E-mail',
        phone: 'Telefone',
        subject: 'Assunto',
        options: ['Contato geral', 'Solicitar orçamento', 'Especificações técnicas', 'Logística'],
        message: 'Mensagem',
        robot: 'Não sou um robô',
        send: 'Enviar Mensagem'
      }
    },
    blog: {
      hero: { badge: 'INSIGHTS', title: 'Inteligência e Análises de Mercado' },
      filterBy: 'Filtrar por',
      categories: ['Todos', 'Supply Chain', 'Sustainability', 'Nutrition', 'Market Trends'],
      featured: 'Destaque',
      read: 'de leitura',
      noResults: 'Nenhum artigo encontrado',
      loadMore: 'Carregar Mais',
      newsletter: {
        title: 'Receba atualizações estratégicas',
        sub: 'Insights de mercado, tendências logísticas e inteligência em superalimentos.',
        placeholder: 'Digite seu e-mail',
        button: 'Inscrever-se'
      }
    }
  }),
  es: deepMerge(baseTranslation, {
    nav: { home: 'INICIO', products: 'PRODUCTOS', about: 'NOSOTROS', services: 'SERVICIOS', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACTO', quote: 'PRESUPUESTO', admin: 'ADMIN' },
    footer: {
      desc: 'Líderes mundiales en la cadena de suministro de superalimentos.',
      navTitle: 'Navegación',
      join: 'Únete',
      sub: 'Suscribirse',
      newsletterBadge: 'Newsletter',
      newsletterCopy: 'Recibe novedades de mercado, logística y superalimentos en tu correo.',
      emailPlaceholder: 'tu@email.com',
      contactTitle: 'Contacto',
      socialTitle: 'Social',
      devBy: 'Desarrollado por TecWeb Digital',
    },
    common: { learnMore: 'Saber Más', readMore: 'Leer Más', contactUs: 'Contacto', back: 'Volver', search: 'Buscar...', send: 'Enviar' },
    home: {
      hero: { badge: 'EST. 2023 • ESPECIALISTAS', title: 'Empoderando un Mundo más Saludable', sub: 'Cadenas de suministro transparentes para la nutrición.' },
      cta: { products: 'PRODUCTOS', story: 'HISTORIA' },
      edge: { badge: 'DIFERENCIAL', title: 'Ingeniería de calidad.', fulfillment: 'Entrega Rápida', fulfillmentSub: 'Stock en Rotterdam.' },
      features: [
        { title: 'Sourcing', desc: 'Alianzas éticas.' },
        { title: 'Pureza', desc: 'Máxima potencia.' },
        { title: 'Labs', desc: 'Probados en la UE.' },
        { title: 'Global', desc: 'Logística continua.' }
      ],
      impact: { title: 'Transformando suministros.', link: 'Última análisis' }
    }
  })
};

type Language = 'en' | 'pt' | 'es';
const LanguageContext = createContext<{ lang: Language, setLang: (l: Language) => void, t: any }>({ lang: 'en', setLang: () => {}, t: translations.en });

export const useLang = () => useContext(LanguageContext);

/** Faz scroll para o topo sempre que a rota muda (ex.: clicar num produto). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');
  const darkHeroRoutes = ['/', '/about', '/services', '/contact', '/faq', '/quote'];
  const isDarkHeroRoute = darkHeroRoutes.includes(location.pathname) || location.pathname.startsWith('/blog/') || location.pathname.startsWith('/products');
  const useLightNavText = !scrolled && isDarkHeroRoute;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) return null;

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.faq, path: '/faq' },
    { name: t.nav.contact, path: '/contact' },
    { name: t.nav.quote, path: '/quote' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`container mx-auto pl-0 pr-6 lg:pr-12 transition-all duration-500 ${scrolled ? 'max-w-7xl' : ''}`}>
        <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl ${scrolled ? 'glass-nav py-4 px-6 lg:px-8 shadow-xl border border-white/20' : 'bg-transparent py-3 pl-0 pr-8 md:pr-10 lg:pr-12'}`}>
          <Link to="/" className="flex items-center group">
            <img
              src={logoImage}
              alt="DBR Foods"
              className={`h-8 md:h-10 w-auto transition-all ${useLightNavText ? 'brightness-0 invert drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]' : ''}`}
            />
          </Link>
          <div className="hidden lg:flex items-center gap-x-8 xl:gap-x-10">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-[10px] font-bold tracking-[0.2em] transition-all ${location.pathname === link.path ? 'text-gold hover:text-gold' : `${useLightNavText ? 'text-white/90' : 'text-gray-600'} hover:text-gold`}`}>{link.name}</Link>
            ))}
            {/* Tradutor / seletor de idioma — comentado por pedido
            <div className="relative">
              <button onClick={() => setShowLang(!showLang)} className={`flex items-center gap-1 text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg border border-current hover:bg-gold hover:text-white ${useLightNavText ? 'text-white' : 'text-green-900'}`}>
                <Globe size={12} /> {lang.toUpperCase()} <ChevronDown size={10} />
              </button>
              {showLang && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-xl min-w-[100px] border border-gray-100 overflow-hidden">
                  {['en', 'pt', 'es'].map(l => (
                    <button key={l} onClick={() => { setLang(l as Language); setShowLang(false); }} className={`w-full text-left px-4 py-3 text-[10px] font-bold tracking-widest hover:bg-gold/10 hover:text-gold ${lang === l ? 'text-gold' : 'text-gray-600'}`}>{l.toUpperCase()}</button>
                  ))}
                </div>
              )}
            </div>
            */}
          </div>
          <button className={`lg:hidden ${useLightNavText ? 'text-white' : 'text-green-900'}`} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
      </div>

      {/* Menu mobile: abre da direita para a esquerda */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} aria-hidden="true" />
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <img src={logoImage} alt="DBR Foods" className="h-8 w-auto" />
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-950" aria-label="Fechar menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col flex-1 overflow-y-auto p-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`py-4 text-sm font-bold tracking-widest uppercase border-b border-gray-50 last:border-0 ${location.pathname === link.path ? 'text-gold' : 'text-green-950 hover:text-gold'}`}
              >
                {link.name}
              </Link>
            ))}
            {/* Tradutor no menu mobile — comentado por pedido
            <div className="pt-6 mt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Idioma</p>
              <div className="flex gap-2">
                {['en', 'pt', 'es'].map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l as Language); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest ${lang === l ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gold/20 hover:text-gold'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            */}
          </nav>
        </div>
      </div>
    </nav>
  );
};

const SiteFooter = () => {
  const { t } = useLang();
  const location = useLocation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  if (location.pathname.startsWith('/admin')) return null;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;
    setNewsletterStatus('loading');
    setNewsletterError('');
    try {
      const { subscribeNewsletter } = await import('./utils/newsletterApi');
      await subscribeNewsletter(email);
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus('error');
      setNewsletterError(err instanceof Error ? err.message : t.footer.newsletterError);
    }
  };

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.faq, path: '/faq' },
    { name: t.nav.contact, path: '/contact' },
    { name: t.nav.quote, path: '/quote' },
  ];

  return (
    <footer className="bg-green-950 text-white pt-16 md:pt-24">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-14 -top-14 w-40 h-40 md:w-56 md:h-56 bg-gold/20 blur-3xl rounded-full" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-gold font-semibold tracking-[0.25em] text-[10px] mb-3 block uppercase">{t.footer.newsletterBadge}</span>
              <h3 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight mb-4">
                {t.footer.join}
              </h3>
              <p className="text-white/70 font-medium text-sm md:text-base">{t.footer.newsletterCopy}</p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  disabled={newsletterStatus === 'loading'}
                  className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-gold disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="px-8 py-4 rounded-full bg-gold text-white font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all disabled:opacity-70"
                >
                  {newsletterStatus === 'loading' ? '...' : t.footer.sub}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <p className="mt-3 text-gold text-sm font-medium">{t.footer.newsletterSuccess}</p>
              )}
              {newsletterStatus === 'error' && (
                <p className="mt-3 text-red-300 text-sm font-medium">{newsletterError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10">
          <div className="space-y-4">
            <img src={logoImage} alt="DBR Foods" className="h-10 w-auto brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">{t.footer.desc}</p>
          </div>

          <div>
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4">{t.footer.navTitle}</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-white/70 hover:text-gold text-sm font-medium transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4">{t.footer.contactTitle}</h4>
            <p className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> Rotterdam, Netherlands</p>
            <p className="flex items-center gap-3"><Mail size={16} className="text-gold" /> diego@dbr-foods.com</p>
            <p className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +31 6 85008474</p>
          </div>

          <div>
            <h4 className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4">{t.footer.socialTitle}</h4>
            <div className="flex items-center gap-3">
              {[Facebook, Linkedin, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-gold hover:text-gold transition-all"
                  aria-label="social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="py-6 text-center text-xs text-white/40 tracking-wide space-y-2">
          <p>© {new Date().getFullYear()} DBR Foods. All rights reserved.</p>
          <a
            href="https://tecwebdigital.com.br"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors"
          >
            <Globe size={12} />
            <span>{t.footer.devBy}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

type AuthUser = { id: number; name: string; email: string };

const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});
export const useAuth = () => useContext(AuthContext);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<AuthUser | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY) ? readStoredUser() : null
  );
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    const { login: apiLogin } = await import('./utils/api');
    const { token, user: u } = await apiLogin(email, password);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations.en }}>
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        <QuoteProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col antialiased">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
              </Routes>
            </main>
            <SiteFooter />
          </div>
        </Router>
        </QuoteProvider>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
