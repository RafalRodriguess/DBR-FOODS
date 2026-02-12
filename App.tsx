
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu, X, Search, Phone, Mail, MapPin, 
  Facebook, Linkedin, Instagram, Globe, ChevronDown, Lock
} from 'lucide-react';

// Public Pages
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import FAQ from './pages/FAQ.tsx';
import Contact from './pages/Contact.tsx';
import Blog from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx';
import logoImage from './Layer_1-1.png';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';

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
    hero: { badge: 'WHAT WE DO', title: 'Integrated Services', sub: 'Solutions designed to reduce risk and improve performance across the supply chain.' },
    items: [
      { title: 'Quality Assurance', desc: 'Supplier qualification, sampling strategy and quality controls before shipment.' },
      { title: 'Traceability', desc: 'Batch tracking and document visibility from farm to destination.' },
      { title: 'Logistics', desc: 'Multimodal planning with optimized lead-time and cost efficiency.' },
      { title: 'Sourcing Strategy', desc: 'Long-term supplier development with responsible procurement practices.' },
      { title: 'Compliance', desc: 'Support for certifications, specifications, and market-entry documentation.' },
      { title: 'Global Expansion', desc: 'Commercial support to enter new markets with a resilient supply model.' }
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
      hero: { badge: 'O QUE FAZEMOS', title: 'Serviços Integrados', sub: 'Soluções desenhadas para reduzir riscos e aumentar performance na cadeia de suprimentos.' },
      items: [
        { title: 'Garantia de Qualidade', desc: 'Qualificação de fornecedores, amostragem e controles antes do embarque.' },
        { title: 'Rastreabilidade', desc: 'Rastreamento por lote e visibilidade documental da fazenda ao destino.' },
        { title: 'Logística', desc: 'Planejamento multimodal com otimização de prazo e custo.' },
        { title: 'Estratégia de Sourcing', desc: 'Desenvolvimento de fornecedores com visão de longo prazo.' },
        { title: 'Conformidade', desc: 'Suporte com certificações, especificações e documentação regulatória.' },
        { title: 'Expansão Global', desc: 'Apoio comercial para entrada em novos mercados com operação resiliente.' }
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');
  const darkHeroRoutes = ['/', '/products', '/about', '/services', '/contact', '/faq'];
  const isDarkHeroRoute = darkHeroRoutes.includes(location.pathname) || location.pathname.startsWith('/blog/');
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
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`container mx-auto px-6 transition-all duration-500 ${scrolled ? 'max-w-7xl' : 'max-w-[84rem]'}`}>
        <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl pl-8 pr-12 md:pr-14 ${scrolled ? 'glass-nav py-4 shadow-xl border border-white/20' : 'bg-transparent py-3'}`}>
          <Link to="/" className="flex items-center group">
            <img
              src={logoImage}
              alt="DBR Foods"
              className={`h-8 md:h-10 w-auto transition-all ${useLightNavText ? 'brightness-0 invert drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]' : ''}`}
            />
          </Link>
          <div className="hidden lg:flex items-center space-x-7 xl:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-[10px] font-bold tracking-[0.2em] transition-all ${location.pathname === link.path ? 'text-gold hover:text-gold' : `${useLightNavText ? 'text-white/90' : 'text-gray-600'} hover:text-gold`}`}>{link.name}</Link>
            ))}
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
            <Link to="/admin/login" className={`flex items-center gap-2 text-[10px] font-black tracking-widest ${useLightNavText ? 'text-white/70' : 'text-gray-400'} hover:text-gold`}><Lock size={12} /> {t.nav.admin}</Link>
          </div>
          <button className={`lg:hidden ${useLightNavText ? 'text-white' : 'text-green-900'}`} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
      </div>
    </nav>
  );
};

const SiteFooter = () => {
  const { t } = useLang();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.faq, path: '/faq' },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <footer className="bg-green-950 text-white pt-16 md:pt-24">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-14 -top-14 w-40 h-40 md:w-56 md:h-56 bg-gold/20 blur-3xl rounded-full" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-gold font-black tracking-[0.25em] text-[10px] mb-3 block uppercase">{t.footer.newsletterBadge}</span>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
                {t.footer.join}
              </h3>
              <p className="text-white/70 font-medium text-sm md:text-base">{t.footer.newsletterCopy}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t.footer.emailPlaceholder}
                  className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-gold"
                />
                <button className="px-8 py-4 rounded-full bg-gold text-white font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all">
                  {t.footer.sub}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10">
          <div className="space-y-4">
            <img src={logoImage} alt="DBR Foods" className="h-10 w-auto brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">{t.footer.desc}</p>
          </div>

          <div>
            <h4 className="text-gold text-[10px] font-black tracking-[0.25em] uppercase mb-4">{t.footer.navTitle}</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-white/70 hover:text-gold text-sm font-medium transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-sm text-white/70">
            <h4 className="text-gold text-[10px] font-black tracking-[0.25em] uppercase mb-4">{t.footer.contactTitle}</h4>
            <p className="flex items-center gap-3"><MapPin size={16} className="text-gold" /> Rotterdam, Netherlands</p>
            <p className="flex items-center gap-3"><Mail size={16} className="text-gold" /> diego@dbr-foods.com</p>
            <p className="flex items-center gap-3"><Phone size={16} className="text-gold" /> +31 6 85008474</p>
          </div>

          <div>
            <h4 className="text-gold text-[10px] font-black tracking-[0.25em] uppercase mb-4">{t.footer.socialTitle}</h4>
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

const AuthContext = createContext<{ isAuthenticated: boolean, login: () => void, logout: () => void }>({ isAuthenticated: false, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] || translations.en }}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <Router>
          <div className="min-h-screen flex flex-col antialiased">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
              </Routes>
            </main>
            <SiteFooter />
          </div>
        </Router>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
