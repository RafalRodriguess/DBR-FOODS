
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
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

// Admin Pages
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

const translations = {
  en: {
    nav: { home: 'HOME', products: 'PRODUCTS', about: 'ABOUT', services: 'SERVICES', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACT', quote: 'GET A QUOTE', admin: 'ADMIN' },
    footer: { desc: 'Global leaders in superfood supply chain excellence.', navTitle: 'Navigation', join: 'Join the Vision', sub: 'Subscribe' },
    common: { learnMore: 'Learn More', readMore: 'Read More', contactUs: 'Contact Us', back: 'Back', search: 'Search articles...', send: 'Send Message' },
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
    }
  },
  es: {
    nav: { home: 'INICIO', products: 'PRODUCTOS', about: 'NOSOTROS', services: 'SERVICIOS', blog: 'BLOG', faq: 'FAQ', contact: 'CONTACTO', quote: 'PRESUPUESTO', admin: 'ADMIN' },
    footer: { desc: 'Líderes mundiales en la cadena de suministro de superalimentos.', navTitle: 'Navegación', join: 'Únete', sub: 'Suscribirse' },
    common: { learnMore: 'Saber Más', readMore: 'Leer Más', contactUs: 'Contacto', back: 'Volver', search: 'Buscar...', send: 'Enviar' },
    home: {
      hero: { badge: "EST. 2023 • ESPECIALISTAS", title: "Empoderando un Mundo más Saludable", sub: "Cadenas de suministro transparentes para la nutrición." },
      cta: { products: "PRODUCTOS", story: "HISTORIA" },
      edge: { badge: "DIFERENCIAL", title: "Ingeniería de calidad.", fulfillment: "Entrega Rápida", fulfillmentSub: "Stock en Rotterdam." },
      features: [
        { title: "Sourcing", desc: "Alianzas éticas." },
        { title: "Pureza", desc: "Máxima potencia." },
        { title: "Labs", desc: "Probados en la UE." },
        { title: "Global", desc: "Logística continua." }
      ],
      impact: { title: "Transformando suministros.", link: "Última análisis" }
    }
  }
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

  const isAdminPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

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
      <div className={`container mx-auto px-6 transition-all duration-500 ${scrolled ? 'max-w-6xl' : 'max-w-7xl'}`}>
        <div className={`flex items-center justify-between transition-all duration-500 rounded-2xl px-8 ${scrolled ? 'glass-nav py-3 shadow-xl border border-white/20' : 'bg-transparent py-2'}`}>
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-green-800 flex items-center justify-center text-white font-black text-xl transition-all group-hover:bg-gold">D</div>
            <span className={`text-2xl font-black tracking-tighter ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-green-950'}`}>DBR Foods</span>
          </Link>
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-[10px] font-bold tracking-[0.2em] transition-all hover:text-gold ${location.pathname === link.path ? 'text-gold' : (scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-gray-600' : 'text-green-900/90')}`}>{link.name}</Link>
            ))}
            <div className="relative">
              <button onClick={() => setShowLang(!showLang)} className={`flex items-center gap-1 text-[10px] font-bold tracking-widest px-3 py-1 rounded-lg border border-current hover:bg-gold hover:text-white ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-green-900'}`}>
                <Globe size={12} /> {lang.toUpperCase()} <ChevronDown size={10} />
              </button>
              {showLang && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-xl min-w-[100px] border border-gray-100 overflow-hidden">
                  {['en', 'pt', 'es'].map(l => (
                    <button key={l} onClick={() => { setLang(l as Language); setShowLang(false); }} className={`w-full text-left px-4 py-3 text-[10px] font-bold tracking-widest hover:bg-gray-50 ${lang === l ? 'text-gold' : 'text-gray-600'}`}>{l.toUpperCase()}</button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/admin/login" className={`flex items-center gap-2 text-[10px] font-black tracking-widest ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-gray-400' : 'text-green-900/40'} hover:text-gold`}><Lock size={12} /> {t.nav.admin}</Link>
          </div>
          <button className={`lg:hidden ${scrolled || (location.pathname !== '/' && !location.pathname.startsWith('/blog/')) ? 'text-green-900' : 'text-green-900'}`} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
      </div>
    </nav>
  );
};

const AuthContext = createContext<{ isAuthenticated: boolean, login: () => void, logout: () => void }>({ isAuthenticated: false, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('pt');
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
          </div>
        </Router>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;
