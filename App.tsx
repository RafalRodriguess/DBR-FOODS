
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu, X, Search, Phone, Mail, MapPin, 
  Facebook, Linkedin, Instagram, Globe, ChevronDown, Lock
} from 'lucide-react';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Comprehensive Translation Dictionary
const translations = {
  en: {
    nav: { home: 'HOME', products: 'PRODUCTS', about: 'ABOUT', services: 'SERVICES', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACT', quote: 'GET A QUOTE', admin: 'ADMIN' },
    footer: { desc: 'Global leaders in superfood supply chain excellence.', navTitle: 'Navigation', join: 'Join the Vision', sub: 'Subscribe' },
    common: { learnMore: 'Learn More', readMore: 'Read More', contactUs: 'Contact Us', back: 'Back', search: 'Search articles...', send: 'Send Message' },
    // ... (rest of translation object remains same as before)
    home: {
      hero: { badge: "EST. 2023 • SUPERFOOD SPECIALISTS", title: "Empowering A Healthier World With Superfoods", sub: "Architecting transparent supply chains for the next generation of nutrition." },
      cta: { products: "EXPLORE PRODUCTS", story: "OUR STORY" },
      edge: { badge: "THE DBR EDGE", title: "We don't just trade, we engineer quality.", fulfillment: "Fast Fulfillment", fulfillmentSub: "Stock ready at Rotterdam." },
      features: [
        { title: "Sourcing", desc: "Ethical partnerships with growers." },
        { title: "Purity", desc: "Selected ingredients for potency." },
        { title: "Labs", desc: "Tested in EU labs before shipment." },
        { title: "Global", desc: "Seamless logistics to major ports." }
      ],
      impact: { title: "Transforming the nutrition supply world.", link: "Read our latest analysis" }
    },
    about: {
      hero: { badge: "THE DBR JOURNEY", title: "Nourishing The Future." },
      vision: { title: "A Shared Vision for a Healthier World.", p1: "Our journey began with a shared vision among a group of seasoned professionals...", p2: "At DBR Foods, we have dedicated ourselves to elevating the standards...", quote: "Together, let’s cultivate a healthier future with DBR Foods." },
      stats: { hub: "Strategic Hub", network: "Supply Network" }
    },
    products: {
      hero: { badge: "OUR CATALOG", title: "High Purity Inventory.", sub: "Every product is backed by full traceability and EU lab analysis." },
      cta: "REQUEST DATA SHEETS",
      searchPlaceholder: "Search products..."
    },
    services: {
      hero: { badge: "EXPERTISE", title: "Operational Excellence.", sub: "We architect the bridge between sustainable farms and global distribution." },
      items: [
        { title: 'Raw Material Supply', desc: 'Access to the highest quality organic and conventional superfoods directly from origin.' },
        { title: 'Supply Chain Control', desc: 'End-to-end management ensuring transparency from the seed to your warehouse.' },
        { title: 'International Logistics', desc: 'Specialized support for global transit, customs clearance, and strategic storage.' },
        { title: 'Factory Audits', desc: 'On-site inspections and quality audits in Latin America and India for peace of mind.' },
        { title: 'Quality Verification', desc: 'Rigorous analysis for every shipment in accredited European laboratories.' },
        { title: 'Strategic Expansion', desc: 'Connecting your brand to new regions with sustainable and ethical ingredients.' }
      ]
    },
    faq: {
      hero: { badge: "KNOWLEDGE HUB", title: "Common Inquiries." },
      cta: { title: "Still have questions?", sub: "Our specialist team is ready to assist with technical specifications." },
      items: [
        { q: "How do you ensure product quality?", a: "We prioritize quality control at every stage. We work with trusted suppliers, conduct rigorous testing, and adhere to EU quality standards with third-party lab verification for every processing lot." },
        { q: "How reliable is your supply chain?", a: "Our Rotterdam headquarters ensures efficient logistics and buffer stocks. We maintain a robust global network of suppliers to guarantee consistent availability despite seasonal shifts." },
        { q: "Do you offer private label packaging?", a: "Yes, we provide flexible solutions including bulk supply and customized packaging to meet your specific branding and retail requirements." },
        { q: "Can you provide lab analysis results?", a: "Absolutely. Every shipment is accompanied by detailed certificates of analysis (COA) from accredited labs, ensuring complete transparency for your peace of mind." },
        { q: "What are your ethical sourcing practices?", a: "Sustainability is at our core. We audit our farms for fair labor practices and encourage eco-friendly farming techniques among our supply partners in Latin America and India." }
      ]
    },
    contact: {
      hero: { badge: "GET IN TOUCH", title: "Let's Start a Conversation." },
      info: { location: "Location", email: "Email", phone: "Direct Line", logistics: "Strategic Logistics", logisticsSub: "Based in Rotterdam Port, we offer optimized shipping to any destination worldwide." },
      form: { name: "Full Name", email: "Industry Email", phone: "Phone Number", subject: "Subject", message: "Message", send: "Send Message", robot: "I'm not a robot", options: ["Inquiry Selection", "Product Quote", "Logistics Inquiry", "Partnership"] }
    },
    blog: {
      hero: { badge: "INSIGHTS & ANALYSIS", title: "The Superfood Journal." },
      categories: ['All', 'Supply Chain', 'Nutrition', 'Sustainability', 'Market Trends'],
      featured: "Featured Analysis",
      read: "read",
      noResults: "No articles found in this selection.",
      loadMore: "Load Older Analysis",
      newsletter: { title: "Stay informed on the global supply market.", sub: "Receive technical reports and market projections directly in your inbox every month.", placeholder: "Enter industry email", button: "Join List" }
    }
  },
  pt: {
    nav: { home: 'INÍCIO', products: 'PRODUTOS', about: 'SOBRE', services: 'SERVIÇOS', blog: 'BLOG', faq: 'DÚVIDAS', contact: 'CONTATO', quote: 'ORÇAMENTO', admin: 'ADMIN' },
    footer: { desc: 'Líderes globais em excelência na cadeia de suprimentos de superalimentos.', navTitle: 'Navegação', join: 'Junte-se à Visão', sub: 'Inscrever-se' },
    common: { learnMore: 'Saiba Mais', readMore: 'Ler Mais', contactUs: 'Contate-nos', back: 'Voltar', search: 'Buscar artigos...', send: 'Enviar Mensagem' },
    home: {
      hero: { badge: "EST. 2023 • ESPECIALISTAS EM SUPERALIMENTOS", title: "Empoderando um Mundo mais Saudável", sub: "Arquitetando cadeias de suprimentos transparentes para a próxima geração da nutrição." },
      cta: { products: "VER PRODUTOS", story: "NOSSA HISTÓRIA" },
      edge: { badge: "DIFERENCIAL DBR", title: "Nós não apenas comercializamos, nós projetamos qualidade.", fulfillment: "Entrega Rápida", fulfillmentSub: "Estoque pronto em Rotterdam." },
      features: [
        { title: "Sourcing", desc: "Parcerias éticas com produtores." },
        { title: "Pureza", desc: "Ingredientes selecionados para máxima potência." },
        { title: "Laboratórios", desc: "Testados na UE antes do envio." },
        { title: "Global", desc: "Logística contínua para os principais portos." }
      ],
      impact: { title: "Transformando o mundo dos suprimentos nutricionais.", link: "Leia nossa última análise" }
    },
    about: {
      hero: { badge: "A JORNADA DBR", title: "Nutrindo o Futuro." },
      vision: { title: "Uma Visão Compartilhada para um Mundo Saudável.", p1: "Nossa jornada começou com uma visão compartilhada entre profissionais experientes...", p2: "Na DBR Foods, nos dedicamos a elevar os padrões de fornecimento...", quote: "Juntos, vamos cultivar um futuro mais saudável com a DBR Foods." },
      stats: { hub: "Centro Estratégico", network: "Rede de Suprimentos" }
    },
    products: {
      hero: { badge: "NOSSO CATÁLOGO", title: "Inventário de Alta Pureza.", sub: "Cada produto é apoiado por rastreabilidade total e análise laboratorial da UE." },
      cta: "SOLICITAR ESPECIFICAÇÕES",
      searchPlaceholder: "Buscar produtos..."
    },
    services: {
      hero: { badge: "EXPERTISE", title: "Excelência Operacional.", sub: "Arquitetamos a ponte entre fazendas sustentáveis e distribuição global." },
      items: [
        { title: 'Fornecimento de Matéria-Prima', desc: 'Acesso a superalimentos orgânicos e convencionais de alta qualidade direto da origem.' },
        { title: 'Controle da Cadeia de Suprimentos', desc: 'Gestão de ponta a ponta garantindo transparência da semente ao seu armazém.' },
        { title: 'Logística Internacional', desc: 'Suporte especializado para trânsito global, desembaraço aduaneiro e armazenamento.' },
        { title: 'Auditorias em Fábricas', desc: 'Inspeções locais e auditorias de qualidade na América Latina e Índia para sua tranquilidade.' },
        { title: 'Verificação de Qualidade', desc: 'Análise rigorosa para cada remessa em laboratórios europeus credenciados.' },
        { title: 'Expansão Estratégica', desc: 'Conectando sua marca a novas regiões com ingredientes sustentáveis e éticos.' }
      ]
    },
    faq: {
      hero: { badge: "CENTRAL DE CONHECIMENTO", title: "Dúvidas Comuns." },
      cta: { title: "Ainda tem dúvidas?", sub: "Nossa equipe de especialistas está pronta para ajudar com especificações técnicas." },
      items: [
        { q: "Como vocês garantem a qualidade do produto?", a: "Priorizamos o controle de qualidade em todas as etapas. Trabalhamos com fornecedores confiáveis e realizamos testes rigorosos em laboratórios da UE." },
        { q: "Quão confiável é a sua cadeia de suprimentos?", a: "Nossa sede em Rotterdam garante logística eficiente e estoques reguladores para garantir disponibilidade constante." },
        { q: "Vocês oferecem embalagem para marca própria?", a: "Sim, oferecemos soluções flexíveis, incluindo fornecimento a granel e embalagens personalizadas." },
        { q: "Vocês podem fornecer resultados de análise laboratorial?", a: "Com certeza. Cada remessa é acompanhada de certificados de análise (COA) detalhados de laboratórios credenciados." },
        { q: "Quais são as suas práticas de fornecimento ético?", a: "A sustentabilidade está no nosso cerne. Auditamos nossas fazendas para práticas de trabalho justo e técnicas ecológicas." }
      ]
    },
    contact: {
      hero: { badge: "ENTRE EM CONTATO", title: "Vamos Iniciar uma Conversa." },
      info: { location: "Localização", email: "E-mail", phone: "Linha Direta", logistics: "Logística Estratégica", logisticsSub: "Sediados no Porto de Rotterdam, oferecemos transporte otimizado para qualquer destino no mundo." },
      form: { name: "Nome Completo", email: "E-mail Corporativo", phone: "Telefone", subject: "Assunto", message: "Mensagem", send: "Enviar Mensagem", robot: "Não sou um robô", options: ["Seleção de Assunto", "Cotação de Produto", "Dúvida Logística", "Parceria"] }
    },
    blog: {
      hero: { badge: "INSIGHTS E ANÁLISES", title: "O Jornal dos Superalimentos." },
      categories: ['Tudo', 'Logística', 'Nutrição', 'Sustentabilidade', 'Tendências'],
      featured: "Análise em Destaque",
      read: "de leitura",
      noResults: "Nenhum artigo encontrado nesta seleção.",
      loadMore: "Carregar Análises Antigas",
      newsletter: { title: "Fique informado sobre o mercado global.", sub: "Receba relatórios técnicos e projeções de mercado diretamente no seu e-mail.", placeholder: "E-mail corporativo", button: "Inscrever-se" }
    }
  },
  es: {
    nav: { home: 'INICIO', products: 'PRODUCTOS', about: 'NOSOTROS', services: 'SERVICIOS', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACTO', quote: 'PRESUPUESTO', admin: 'ADMIN' },
    footer: { desc: 'Líderes mundiales en la excelencia de la cadena de suministro de superalimentos.', navTitle: 'Navegación', join: 'Únete a la Visión', sub: 'Suscribirse' },
    common: { learnMore: 'Saber Más', readMore: 'Leer Más', contactUs: 'Contáctenos', back: 'Volver', search: 'Buscar artículos...', send: 'Enviar Mensaje' },
    home: {
      hero: { badge: "EST. 2023 • ESPECIALISTAS EN SUPERALIMENTOS", title: "Empoderando un Mundo más Saludable", sub: "Arquitectando cadenas de suministro transparentes para la próxima generación de nutrición." },
      cta: { products: "VER PRODUCTOS", story: "NUESTRA HISTORIA" },
      edge: { badge: "EL DIFERENCIAL DBR", title: "No solo comercializamos, diseñamos calidad.", fulfillment: "Entrega Rápida", fulfillmentSub: "Stock listo en Rotterdam." },
      features: [
        { title: "Sourcing", desc: "Alianzas éticas con productores." },
        { title: "Pureza", desc: "Ingredientes seleccionados para máxima potencia." },
        { title: "Labs", desc: "Probados en la UE antes del envío." },
        { title: "Global", desc: "Logística continua a los principales puertos." }
      ],
      impact: { title: "Transformando el mundo de los suministros nutricionales.", link: "Lea nuestro último análisis" }
    },
    about: {
      hero: { badge: "LA JORNADA DBR", title: "Nutriendo el Futuro." },
      vision: { title: "Una Visión Compartida para un Mundo Saludable.", p1: "Nuestro viaje comenzó con una visión compartida entre profesionales experimentados...", p2: "En DBR Foods, nos dedicamos a elevar los estándares de suministro...", quote: "Juntos, cultivemos un futuro más saludable con DBR Foods." },
      stats: { hub: "Centro Estratégico", network: "Red de Suministro" }
    },
    products: {
      hero: { badge: "NUESTRO CATÁLOGO", title: "Inventario de Alta Pureza.", sub: "Cada producto cuenta con trazabilidad total y análisis de laboratorio de la UE." },
      cta: "SOLICITAR FICHAS TÉCNICAS",
      searchPlaceholder: "Buscar productos..."
    },
    services: {
      hero: { badge: "EXPERTISE", title: "Excelencia Operativa.", sub: "Arquitectamos el puente entre granjas sostenibles y distribución global." },
      items: [
        { title: 'Suministro de Materia Prima', desc: 'Acceso a superalimentos orgánicos y convencionales de alta calidad directo del origen.' },
        { title: 'Control de la Cadena', desc: 'Gestión integral que garantiza la transparencia desde la semilla hasta su almacén.' },
        { title: 'Logística Internacional', desc: 'Soporte especializado para el tránsito global, despacho de aduanas y almacenamiento.' },
        { title: 'Auditorías de Fábrica', desc: 'Inspecciones locales y auditorías de calidad en América Latina e India.' },
        { title: 'Verificación de Calidad', desc: 'Análisis rigoroso para cada envío en laboratorios europeos acreditados.' },
        { title: 'Expansión Estratégica', desc: 'Conectando su marca con nuevas regiones con ingredientes sostenibles y éticos.' }
      ]
    },
    faq: {
      hero: { badge: "CENTRO DE CONOCIMIENTO", title: "Preguntas Frecuentes." },
      cta: { title: "¿Aún tienes preguntas?", sub: "Nuestro equipo de especialistas está listo para ayudar con especificaciones técnicas." },
      items: [
        { q: "¿Cómo garantizan la calidad del producto?", a: "Priorizamos el control de calidad en cada etapa. Trabajamos con proveedores de confianza y realizamos pruebas en laboratorios de la UE." },
        { q: "¿Qué tan confiable es su cadena de suministro?", a: "Nuestra sede en Rotterdam garantiza una logística eficiente y existencias de reserva para una disponibilidad constante." },
        { q: "¿Ofrecen embalaje de marca privada?", a: "Sí, ofrecemos soluciones flexibles que incluyen suministro a granel y embalaje personalizado." },
        { q: "¿Pueden proporcionar resultados de análisis de laboratorio?", a: "Absolutamente. Cada envío va acompañado de certificados de análisis (COA) detallados de laboratorios acreditados." },
        { q: "¿Cuáles son sus prácticas de abastecimiento ético?", a: "La sostenibilidad es nuestro núcleo. Auditamos nuestras granjas para prácticas laborales justas y técnicas ecológicas." }
      ]
    },
    contact: {
      hero: { badge: "PONTE EN CONTACTO", title: "Iniciemos una Conversación." },
      info: { location: "Ubicación", email: "Correo", phone: "Línea Directa", logistics: "Logística Estratégica", logisticsSub: "Con sede en el Puerto de Rotterdam, ofrecemos envíos optimizados a cualquier destino del mundo." },
      form: { name: "Nombre Completo", email: "Correo Industrial", phone: "Teléfono", subject: "Asunto", message: "Mensaje", send: "Enviar Mensaje", robot: "No soy un robot", options: ["Selección de Assunto", "Presupuesto", "Duda Logística", "Alianza"] }
    },
    blog: {
      hero: { badge: "INSIGHTS Y ANÁLISIS", title: "El Diario de los Superalimentos." },
      categories: ['Todo', 'Suministro', 'Nutrición', 'Sostenibilidad', 'Tendências'],
      featured: "Análisis Destacado",
      read: "de lectura",
      noResults: "No se encontraron artículos en esta selección.",
      loadMore: "Cargar Análisis Anteriores",
      newsletter: { title: "Manténgase informado sobre o mercado global.", sub: "Reciba informes técnicos y proyecciones directamente en su buzón de correo.", placeholder: "Correo corporativo", button: "Unirse" }
    }
  }
};

type Language = 'en' | 'pt' | 'es';
const LanguageContext = createContext<{ lang: Language, setLang: (l: Language) => void, t: any }>({ lang: 'en', setLang: () => {}, t: {} });

export const useLang = () => useContext(LanguageContext);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) return null; // Admin has its own sidebar

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.products, path: '/products' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.faq, path: '/faq' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
    { code: 'es', label: 'ES' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`container mx-auto px-6 transition-all duration-500 ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
        <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl px-8 ${scrolled ? 'glass-nav py-3 shadow-xl border border-white/20' : 'bg-transparent py-2'}`}>
          
          <Link to="/" className="flex items-center space-x-2 group">
            <div className={`w-10 h-10 rounded-lg bg-green-800 flex items-center justify-center text-white font-black text-xl transition-all group-hover:bg-gold ${scrolled ? 'scale-90' : 'scale-100'}`}>
              D
            </div>
            <span className={`text-2xl font-black tracking-tighter ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-white'}`}>
              DBR<span className="font-light opacity-80">Foods</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[10px] font-bold tracking-[0.2em] transition-all hover:text-gold ${
                  location.pathname === link.path 
                    ? 'text-gold' 
                    : (scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-gray-600' : 'text-white/90')
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowLang(!showLang)}
                className={`flex items-center gap-1 text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg border border-current transition-all hover:bg-gold hover:border-gold hover:text-white ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-white'}`}
              >
                <Globe size={12} /> {lang.toUpperCase()} <ChevronDown size={10} />
              </button>
              {showLang && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-xl overflow-hidden min-w-[100px] border border-gray-100 animate-fadeIn">
                  {languages.map(l => (
                    <button 
                      key={l.code}
                      onClick={() => { setLang(l.code as Language); setShowLang(false); }}
                      className={`w-full text-left px-4 py-3 text-[10px] font-bold tracking-widest hover:bg-gray-50 transition-colors ${lang === l.code ? 'text-gold' : 'text-gray-600'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link to="/contact" className={`px-6 py-2.5 rounded-full font-bold text-[10px] tracking-widest transition-all ${
              scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) 
                ? 'bg-green-900 text-white hover:bg-gold' 
                : 'bg-white text-green-900 hover:bg-gold hover:text-white'
            }`}>
              {t.nav.quote}
            </Link>

            <Link to="/admin/login" className={`flex items-center gap-2 text-[10px] font-black tracking-widest ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-gray-400' : 'text-white/40'} hover:text-gold transition-colors`}>
              <Lock size={12} /> {t.nav.admin}
            </Link>
          </div>

          <button className={`lg:hidden ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-white'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-green-950 flex flex-col items-center justify-center space-y-6 z-[-1]">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-2xl font-black text-white" onClick={() => setIsOpen(false)}>{link.name}</Link>
          ))}
          <Link to="/admin/login" className="text-white/40 font-bold uppercase tracking-widest flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Lock size={16} /> ADMIN
          </Link>
          <div className="flex gap-4 pt-4">
             {languages.map(l => (
               <button key={l.code} onClick={() => { setLang(l.code as Language); setIsOpen(false); }} className={`px-4 py-2 rounded-lg border border-white/20 text-white font-bold ${lang === l.code ? 'bg-gold border-gold' : ''}`}>
                 {l.label}
               </button>
             ))}
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/50 pt-8"><X size={32} /></button>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const { t } = useLang();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  
  if (isAdminPath) return null;

  return (
    <footer className="bg-[#001a0a] text-white pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-4xl font-black tracking-tighter">DBR<span className="font-light text-gold">Foods</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{t.footer.desc}</p>
            <div className="flex space-x-4">
              {[Facebook, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-gold transition-all"><Icon size={18} /></a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-gold uppercase">{t.footer.navTitle}</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><Link to="/" className="hover:text-white transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">{t.nav.products}</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">{t.nav.blog}</Link></li>
            </ul>
          </div>
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-gold uppercase">Contact</h3>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-start gap-4"><MapPin className="text-gold shrink-0" size={16} /> <span>Shannonweg 81-83, Rotterdam</span></div>
              <div className="flex items-center gap-4"><Mail className="text-gold" size={16} /> <span>diego@dbr-foods.com</span></div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-gold uppercase">{t.footer.join}</h3>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl outline-none text-sm w-full" />
              <button className="bg-white text-green-950 px-4 py-3 rounded-xl font-black text-[10px] uppercase">{t.footer.sub}</button>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-white/5 text-[8px] tracking-[0.3em] text-gray-500 uppercase font-black text-center md:text-left">
          © 2024 DBRFOODS. ARCHITECTING HEALTHIER SYSTEMS.
        </div>
      </div>
    </footer>
  );
};

// Simple Mock Auth
const AuthContext = createContext<{ isAuthenticated: boolean, login: () => void, logout: () => void }>({ isAuthenticated: false, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
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
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin/*" 
                  element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
