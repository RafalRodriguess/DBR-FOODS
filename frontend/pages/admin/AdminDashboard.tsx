import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Users,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../App';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DataTable, { ColumnDef } from './components/DataTable';
import ListPagination from './components/ListPagination';
import Modal from './components/Modal';
import { DEFAULT_PER_PAGE } from '../../utils/pagination';
import type { PaginationMeta } from '../../utils/pagination';
import ManagementPage from './components/ManagementPage';
import {
  Orcamento,
  Produto,
  categoriasMock,
  menuItems,
  produtosMock,
} from './mock/data';
import type { Faq } from '../../utils/faqsApi';

type Servico = { id: number; nome: string; categoria: string; descricao: string; status: string };
import type { BlogCategory, BlogPost } from '../../utils/blogApi';
import * as faqsApi from '../../utils/faqsApi';
import * as orcamentosApi from '../../utils/orcamentosApi';
import * as newsletterApi from '../../utils/newsletterApi';
import * as contactsApi from '../../utils/contactsApi';
import * as blogApi from '../../utils/blogApi';
import { getProdutos, getCategorias } from '../../utils/adminStorage';
import * as productsApi from '../../utils/productsApi';
import BlogArticleList from './BlogArticleList';
import BlogArticleForm from './BlogArticleForm';
import BlogArticleView from './BlogArticleView';
import BlogCategoryList from './BlogCategoryList';
import BlogCategoryForm from './BlogCategoryForm';
import BlogCategoryView from './BlogCategoryView';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';
import CategoryView from './CategoryView';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import ProductView from './ProductView';
import UserList from './UserList';
import UserForm from './UserForm';
import RolesList from './RolesList';
import RoleForm from './RoleForm';
const logoImage = '/Layer_1-1.png';

const DashboardCards = ({
  contatos,
  newsletter,
  orcamentos,
  produtos,
  blog,
  faqs,
}: {
  contatos: contactsApi.ContatoAdmin[];
  newsletter: newsletterApi.NewsletterSubscriber[];
  orcamentos: Orcamento[];
  produtos: productsApi.Product[] | Produto[];
  blog: BlogPost[];
  faqs: Faq[];
}) => {
  const contatosNaoLidos = contatos.filter((c) => c.status === 'Não lido').length;
  const orcamentosNovos = orcamentos.filter((o) => o.status === 'Novo').length;
  const blogPublicado = blog.filter((b) => (b as { status?: string }).status === 'Publicado' || (b as { status?: string }).status === 'published').length;
  const blogRascunho = blog.filter((b) => (b as { status?: string }).status === 'Rascunho' || (b as { status?: string }).status === 'draft').length;
  const faqPublicado = faqs.length;
  const produtosAtivos = produtos.filter((p) => (p as { status?: string }).status === 'Ativo' || (p as { status?: string }).status === 'active').length;
  const newsletterAtivos = newsletter.filter((n) => n.status === 'active').length;

  const cards = [
    { label: 'Contatos recebidos', val: String(contatos.length), Icon: MessageSquare },
    { label: 'Orçamentos', val: String(orcamentos.length), Icon: ClipboardList },
    { label: 'Newsletter inscritos', val: String(newsletter.length), Icon: Users },
    { label: 'Conteúdo publicado', val: String(blogPublicado + faqPublicado), Icon: Eye },
  ];

  const prioridades = [
    { id: 1, texto: `${contatosNaoLidos} contatos aguardando resposta`, tipo: contatosNaoLidos > 0 ? 'alerta' : 'ok' },
    { id: 2, texto: `${orcamentosNovos} orçamentos novos para atender`, tipo: orcamentosNovos > 0 ? 'alerta' : 'ok' },
    { id: 3, texto: `${blogRascunho} artigos em rascunho para revisão`, tipo: blogRascunho > 0 ? 'aviso' : 'ok' },
    { id: 4, texto: `${newsletterAtivos} inscritos ativos para campanhas`, tipo: 'ok' },
  ];

  const operacao = [
    { label: 'Blog publicado', current: blogPublicado, total: blog.length || 1 },
    { label: 'FAQ publicado', current: faqPublicado, total: faqs.length || 1 },
    { label: 'Produtos ativos', current: produtosAtivos, total: produtos.length || 1 },
  ];

  const contatosRecentes = [...contatos].slice(0, 5);

  const getIcon = (tipo: string) => {
    if (tipo === 'alerta') return <AlertTriangle size={16} className="text-red-500" />;
    if (tipo === 'aviso') return <Clock3 size={16} className="text-gold" />;
    return <CheckCircle2 size={16} className="text-green-500" />;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
              <p className="text-2xl font-black text-green-950">{c.val}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-50 text-gold flex items-center justify-center">
              <c.Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm xl:col-span-1">
          <h3 className="text-sm font-black text-green-950 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-gold" />
            Prioridades do dia
          </h3>
          <div className="space-y-3">
            {prioridades.map((p) => (
              <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                {getIcon(p.tipo)}
                <p className="text-sm font-medium text-green-950">{p.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm xl:col-span-2">
          <h3 className="text-sm font-black text-green-950 uppercase tracking-widest mb-4">Status operacional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {operacao.map((item) => {
              const percentage = Math.round((item.current / item.total) * 100);
              return (
                <div key={item.label} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
                    <p className="text-xs font-black text-green-950">{percentage}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#27864D] to-[#DC9C01]" style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium mt-2">
                    {item.current} de {item.total}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-green-950 uppercase tracking-widest mb-4">Últimos contatos</h3>
        <div className="space-y-3">
          {contatosRecentes.map((contato) => (
            <div key={contato.id} className="p-4 rounded-xl bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-green-950">{contato.nome}</p>
                <p className="text-xs text-gray-500">{contato.empresa} • {contato.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${contato.status === 'Respondido' ? 'bg-green-100 text-green-700' : 'bg-gold/15 text-gold'}`}>
                  {contato.status}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{contato.data}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Sidebar = ({ open, close }: { open: boolean; close: () => void }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const path = location.pathname;
    const out: Record<string, boolean> = {};
    if (path.startsWith('/admin/products')) out['/admin/products'] = true;
    if (path.startsWith('/admin/blog')) out['/admin/blog'] = true;
    if (path.startsWith('/admin/users')) out['/admin/users'] = true;
    return out;
  });

  useEffect(() => {
    const path = location.pathname;
    setExpanded((prev) => ({
      ...prev,
      '/admin/products': path.startsWith('/admin/products') ? true : prev['/admin/products'],
      '/admin/blog': path.startsWith('/admin/blog') ? true : prev['/admin/blog'],
      '/admin/users': path.startsWith('/admin/users') ? true : prev['/admin/users'],
    }));
  }, [location.pathname]);

  const toggleExpand = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={close} aria-label="Fechar menu" />}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-green-950 text-white p-6 md:p-7 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin/dashboard" onClick={close} className="shrink-0">
            <img src={logoImage} alt="DBR Foods" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={close} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gold font-black uppercase tracking-[0.2em] mb-1">Área administrativa</p>
          <p className="text-sm font-bold text-white/80">DBR Foods</p>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            const hasChildren = 'children' in item && item.children?.length;
            const isParent = item.path === '/admin/products' || item.path === '/admin/blog' || item.path === '/admin/users';
            const isExpanded = hasChildren && expanded[item.path];
            const active = location.pathname === item.path || (isParent && location.pathname.startsWith(item.path));
            return (
              <div key={item.path}>
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.path)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                        active ? 'bg-gold text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={16} />
                        {item.name}
                      </span>
                      <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 pl-4 border-l border-white/20 space-y-1">
                        {item.children!.map((child) => {
                          const isChildActive = location.pathname === child.path || (child.path !== item.path && location.pathname.startsWith(child.path + '/'));
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={close}
                              className={`block py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${
                                isChildActive ? 'text-gold' : 'text-white/50 hover:text-white'
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={close}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                      active ? 'bg-gold text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="mt-6 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white/70 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-3"
        >
          <LogOut size={16} />
          Sair
        </button>
      </aside>
    </>
  );
};

const AdminRedirectToDashboard: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('dashboard', { replace: true });
  }, [navigate]);
  return null;
};

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [categorias, setCategorias] = useState<productsApi.ProductCategory[]>([]);
  const [produtos, setProdutos] = useState<productsApi.Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const loadProductsAndCategories = useCallback(async () => {
    setProductsLoading(true);
    try {
      const [catList, prodRes] = await Promise.all([
        productsApi.listProductCategories(),
        productsApi.listProducts({ per_page: 500 }),
      ]);
      setCategorias(catList);
      setProdutos(prodRes.data);
    } catch {
      setCategorias([]);
      setProdutos([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadProductsAndCategories();
  }, [loadProductsAndCategories]);
  const [blogCategorias, setBlogCategorias] = useState<BlogCategory[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const loadBlogCategories = useCallback(async () => {
    try {
      const list = await blogApi.listCategories();
      setBlogCategorias(list);
    } catch {
      setBlogCategorias([]);
    }
  }, []);
  const loadBlogPosts = useCallback(async () => {
    setBlogLoading(true);
    setBlogError(null);
    try {
      const { blog_posts } = await blogApi.listPosts({ per_page: 500 });
      setBlog(Array.isArray(blog_posts) ? blog_posts : []);
    } catch (err) {
      setBlog([]);
      setBlogError(err instanceof Error ? err.message : 'Erro ao carregar artigos.');
    } finally {
      setBlogLoading(false);
    }
  }, []);
  const [blogFromPublic, setBlogFromPublic] = useState<BlogPost[]>([]);
  const [blogFromPublicLoading, setBlogFromPublicLoading] = useState(false);
  const [blogFromPublicError, setBlogFromPublicError] = useState<string | null>(null);
  const loadBlogPostsFromPublic = useCallback(async () => {
    setBlogFromPublicLoading(true);
    setBlogFromPublicError(null);
    try {
      const { blog_posts } = await blogApi.listPosts({ per_page: 500, source: 'public' });
      setBlogFromPublic(Array.isArray(blog_posts) ? blog_posts : []);
    } catch (err) {
      setBlogFromPublic([]);
      setBlogFromPublicError(err instanceof Error ? err.message : 'Erro ao carregar posts enviados.');
    } finally {
      setBlogFromPublicLoading(false);
    }
  }, []);
  useEffect(() => {
    loadBlogCategories();
  }, [loadBlogCategories]);
  useEffect(() => {
    loadBlogPosts();
  }, [loadBlogPosts]);
  useEffect(() => {
    loadBlogPostsFromPublic();
  }, [loadBlogPostsFromPublic]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const loadFaqs = useCallback(async () => {
    try {
      const list = await faqsApi.listFaqs();
      setFaqs(list);
    } catch {
      setFaqs([]);
    }
  }, []);
  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);
  const [contatos, setContatos] = useState<contactsApi.ContatoAdmin[]>([]);
  const [contatosLoading, setContatosLoading] = useState(false);
  const [contatosPage, setContatosPage] = useState(1);
  const [contatosPerPage, setContatosPerPage] = useState(DEFAULT_PER_PAGE);
  const [contatosMeta, setContatosMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: DEFAULT_PER_PAGE, total: 0 });
  const [newsletter, setNewsletter] = useState<newsletterApi.NewsletterSubscriber[]>([]);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterPage, setNewsletterPage] = useState(1);
  const [newsletterPerPage, setNewsletterPerPage] = useState(DEFAULT_PER_PAGE);
  const [newsletterMeta, setNewsletterMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: DEFAULT_PER_PAGE, total: 0 });
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [orcamentosLoading, setOrcamentosLoading] = useState(false);
  const [orcamentosPage, setOrcamentosPage] = useState(1);
  const [orcamentosPerPage, setOrcamentosPerPage] = useState(DEFAULT_PER_PAGE);
  const [orcamentosMeta, setOrcamentosMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: DEFAULT_PER_PAGE, total: 0 });
  const [servicos, setServicos] = useState<Servico[]>([]);

  const [selectedContato, setSelectedContato] = useState<contactsApi.ContatoAdmin | null>(null);
  const [selectedOrcamento, setSelectedOrcamento] = useState<Orcamento | null>(null);

  const refreshOrcamentos = useCallback(async () => {
    setOrcamentosLoading(true);
    try {
      const { quotes, meta } = await orcamentosApi.listQuotes({ per_page: orcamentosPerPage, page: orcamentosPage });
      setOrcamentos(quotes);
      setOrcamentosMeta(meta);
    } catch {
      setOrcamentos([]);
    } finally {
      setOrcamentosLoading(false);
    }
  }, [orcamentosPerPage, orcamentosPage]);
  useEffect(() => {
    refreshOrcamentos();
  }, [refreshOrcamentos]);

  const refreshNewsletter = useCallback(async () => {
    setNewsletterLoading(true);
    try {
      const { subscribers, meta } = await newsletterApi.listNewsletter({ per_page: newsletterPerPage, page: newsletterPage });
      setNewsletter(subscribers);
      setNewsletterMeta(meta);
    } catch {
      setNewsletter([]);
    } finally {
      setNewsletterLoading(false);
    }
  }, [newsletterPerPage, newsletterPage]);
  useEffect(() => {
    refreshNewsletter();
  }, [refreshNewsletter]);

  const refreshContatos = useCallback(async () => {
    setContatosLoading(true);
    try {
      const { contacts, meta } = await contactsApi.listContacts({ per_page: contatosPerPage, page: contatosPage });
      setContatos(contacts);
      setContatosMeta(meta);
    } catch {
      setContatos([]);
    } finally {
      setContatosLoading(false);
    }
  }, [contatosPerPage, contatosPage]);
  useEffect(() => {
    refreshContatos();
  }, [refreshContatos]);

  const refreshCategorias = () => loadProductsAndCategories();
  const refreshProdutos = () => loadProductsAndCategories();
  const refreshBlogCategorias = () => loadBlogCategories();
  const refreshBlog = () => loadBlogPosts();
  const refreshBlogFromPublic = () => {
    loadBlogPostsFromPublic();
    loadBlogPosts();
  };

  const handleContatosPage = (page: number) => { setContatosPage(page); };
  const handleContatosPerPage = (perPage: number) => { setContatosPerPage(perPage); setContatosPage(1); };
  const handleNewsletterPage = (page: number) => { setNewsletterPage(page); };
  const handleNewsletterPerPage = (perPage: number) => { setNewsletterPerPage(perPage); setNewsletterPage(1); };
  const handleOrcamentosPage = (page: number) => { setOrcamentosPage(page); };
  const handleOrcamentosPerPage = (perPage: number) => { setOrcamentosPerPage(perPage); setOrcamentosPage(1); };

  const pageTitle = useMemo(() => {
    for (const item of menuItems) {
      if (item.path === location.pathname) return item.name;
      if ('children' in item && item.children) {
        const child = item.children.find((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'));
        if (child) return child.name;
      }
    }
    if (location.pathname.includes('/new')) return 'Novo';
    if (location.pathname.match(/\/\d+\/edit/)) return 'Editar';
    if (location.pathname.match(/\/\d+$/)) return 'Visualizar';
    return 'Painel';
  }, [location.pathname]);

  const contatoColumns: ColumnDef<contactsApi.ContatoAdmin>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'status', label: 'Status' },
  ];

  const newsletterColumns: ColumnDef<newsletterApi.NewsletterSubscriber>[] = [
    { key: 'email', label: 'E-mail' },
    { key: 'status', label: 'Status' },
    { key: 'data', label: 'Data' },
  ];

  const orcamentoColumns: ColumnDef<Orcamento>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'produtosResumo', label: 'Produtos' },
    { key: 'status', label: 'Status' },
    { key: 'data', label: 'Data' },
  ];

  const orcamentosComResumo = orcamentos.map((o) => ({
    ...o,
    produtosResumo: `${o.produtos.length} produto(s)`,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-gray-50/90 backdrop-blur border-b border-gray-100 px-4 sm:px-6 lg:px-10 py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <button className="lg:hidden w-10 h-10 rounded-xl bg-white border border-gray-200 text-green-950 flex items-center justify-center" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.25em] mb-1">Painel Administrativo</p>
                <h2 className="text-xl md:text-3xl font-black text-green-950 tracking-tighter">{pageTitle}</h2>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-xs font-black text-green-950">Diego Rodrigues</p>
                <p className="text-[10px] text-gold font-bold uppercase">Administrador</p>
              </div>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" alt="Admin" className="w-10 h-10 rounded-xl object-cover grayscale" />
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-10 py-6 md:py-8 space-y-6">
          <Routes>
            <Route index element={<AdminRedirectToDashboard />} />
            <Route path="dashboard" element={<DashboardCards contatos={contatos} newsletter={newsletter} orcamentos={orcamentos} produtos={produtos} blog={blog} faqs={faqs} />} />
            <Route path="products" element={<ProductList produtos={produtos} onRefresh={refreshProdutos} loading={productsLoading} />} />
            <Route path="products/new" element={<ProductForm mode="create" />} />
            <Route path="products/categories" element={<CategoryList categorias={categorias} onRefresh={refreshCategorias} loading={productsLoading} />} />
            <Route path="products/categories/new" element={<CategoryForm mode="create" />} />
            <Route path="products/categories/:id" element={<CategoryView />} />
            <Route path="products/categories/:id/edit" element={<CategoryForm mode="edit" />} />
            <Route path="products/:id" element={<ProductView />} />
            <Route path="products/:id/edit" element={<ProductForm mode="edit" />} />
            <Route
              path="services"
              element={
                <ManagementPage<Servico>
                  title="Gestão de Serviços"
                  entityLabel="serviços"
                  rows={servicos}
                  setRows={setServicos}
                  searchKeys={['nome', 'categoria', 'status']}
                  columns={[
                    { key: 'nome', label: 'Serviço' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'status', label: 'Status' },
                  ]}
                  fields={[
                    { key: 'nome', label: 'Nome do serviço' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'descricao', label: 'Descrição', type: 'textarea' },
                    { key: 'status', label: 'Status' },
                  ]}
                  makeEmpty={() => ({ id: 0, nome: '', categoria: '', descricao: '', status: 'Ativo' })}
                />
              }
            />
            <Route path="blog" element={<BlogArticleList articles={blog} onRefresh={refreshBlog} loading={blogLoading} loadError={blogError} onDismissError={() => setBlogError(null)} />} />
            <Route path="blog/from-public" element={<BlogArticleList articles={blogFromPublic} onRefresh={refreshBlogFromPublic} loading={blogFromPublicLoading} loadError={blogFromPublicError} onDismissError={() => setBlogFromPublicError(null)} title="Posts enviados (público)" subtitle="Rascunhos recebidos pela API/automação — edite e publique para aprovar" showNewButton={false} />} />
            <Route path="blog/categories" element={<BlogCategoryList categorias={blogCategorias} onRefresh={refreshBlogCategorias} />} />
            <Route path="blog/categories/new" element={<BlogCategoryForm mode="create" />} />
            <Route path="blog/categories/:id" element={<BlogCategoryView />} />
            <Route path="blog/categories/:id/edit" element={<BlogCategoryForm mode="edit" />} />
            <Route path="blog/new" element={<BlogArticleForm mode="create" />} />
            <Route path="blog/:id/edit" element={<BlogArticleForm mode="edit" />} />
            <Route path="blog/:id" element={<BlogArticleView />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserForm mode="create" />} />
            <Route path="users/:id/edit" element={<UserForm mode="edit" />} />
            <Route path="users/roles" element={<RolesList />} />
            <Route path="users/roles/new" element={<RoleForm mode="create" />} />
            <Route path="users/roles/:id/edit" element={<RoleForm mode="edit" />} />
            <Route
              path="faq"
              element={
                <ManagementPage<Faq>
                  title="Gestão de FAQ"
                  entityLabel="perguntas"
                  rows={faqs}
                  setRows={setFaqs}
                  searchKeys={['question', 'answer']}
                  columns={[
                    { key: 'question', label: 'Pergunta' },
                    { key: 'order', label: 'Ordem' },
                  ]}
                  fields={[
                    { key: 'question', label: 'Pergunta', type: 'textarea' },
                    { key: 'answer', label: 'Resposta', type: 'textarea' },
                    { key: 'order', label: 'Ordem', type: 'number' },
                  ]}
                  makeEmpty={() => ({ id: 0, question: '', answer: '', order: 0 })}
                  onSave={async (editing, form) => {
                    const id = editing?.id != null ? Number(editing.id) : 0;
                    if (id) {
                      await faqsApi.updateFaq(id, {
                        question: String(form.question ?? ''),
                        answer: String(form.answer ?? ''),
                        order: Number(form.order) || 0,
                      });
                    } else {
                      await faqsApi.createFaq({
                        question: String(form.question ?? ''),
                        answer: String(form.answer ?? ''),
                        order: Number(form.order) || 0,
                      });
                    }
                    await loadFaqs();
                  }}
                  onDelete={async (row) => {
                    const id = Number(row.id);
                    if (Number.isNaN(id) || id < 1) return;
                    await faqsApi.deleteFaq(id);
                    await loadFaqs();
                  }}
                />
              }
            />
            <Route
              path="contacts"
              element={
                <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">Contatos</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Mensagens recebidas pela página de contato</p>
                    </div>
                    <button onClick={refreshContatos} className="text-sm font-bold text-gold hover:text-green-950 transition-colors">
                      Atualizar lista
                    </button>
                  </div>
                  <div className="p-6 md:p-8">
                    <ListPagination
                      meta={contatosMeta}
                      onPageChange={handleContatosPage}
                      onPerPageChange={handleContatosPerPage}
                      loading={contatosLoading}
                      position="top"
                    />
                    <DataTable
                      columns={contatoColumns}
                      rows={contatos}
                      onView={(row) => setSelectedContato(row)}
                      onDelete={async (row) => {
                        try {
                          await contactsApi.deleteContact(row.id);
                          refreshContatos();
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Erro ao excluir.');
                        }
                      }}
                      onEdit={async (row) => {
                        const next = row.status === 'Não lido' ? 'Respondido' : 'Não lido';
                        try {
                          await contactsApi.updateContactStatus(row.id, next);
                          refreshContatos();
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Erro ao atualizar.');
                        }
                      }}
                      emptyText="Nenhum contato recebido."
                    />
                    <ListPagination
                      meta={contatosMeta}
                      onPageChange={handleContatosPage}
                      onPerPageChange={handleContatosPerPage}
                      loading={contatosLoading}
                      position="bottom"
                    />
                  </div>
                </section>
              }
            />
            <Route
              path="quotes"
              element={
                <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">Orçamentos</h3>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Solicitações de cotação com produtos</p>
                    </div>
                    <button
                      onClick={refreshOrcamentos}
                      className="text-sm font-bold text-gold hover:text-green-950 transition-colors"
                    >
                      Atualizar lista
                    </button>
                  </div>
                  <div className="p-6 md:p-8">
                    <ListPagination
                      meta={orcamentosMeta}
                      onPageChange={handleOrcamentosPage}
                      onPerPageChange={handleOrcamentosPerPage}
                      loading={orcamentosLoading}
                      position="top"
                    />
                    <DataTable
                      columns={orcamentoColumns}
                      rows={orcamentosComResumo}
                      onView={(row) => setSelectedOrcamento(orcamentos.find((o) => o.id === row.id) ?? null)}
                      onDelete={async (row) => {
                        try {
                          await orcamentosApi.deleteQuote(row.id);
                          refreshOrcamentos();
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Erro ao excluir.');
                        }
                      }}
                      onEdit={async (row) => {
                        const next = row.status === 'Novo' ? 'Em atendimento' : row.status === 'Em atendimento' ? 'Respondido' : 'Novo';
                        try {
                          await orcamentosApi.updateQuoteStatus(row.id, next);
                          refreshOrcamentos();
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Erro ao atualizar.');
                        }
                      }}
                      emptyText="Nenhum orçamento recebido."
                    />
                    <ListPagination
                      meta={orcamentosMeta}
                      onPageChange={handleOrcamentosPage}
                      onPerPageChange={handleOrcamentosPerPage}
                      loading={orcamentosLoading}
                      position="bottom"
                    />
                  </div>
                </section>
              }
            />
            <Route
              path="newsletter"
              element={
                <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">Gestão de Newsletter</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Lista de inscritos e status (active/inactive para campanhas)</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <ListPagination
                      meta={newsletterMeta}
                      onPageChange={handleNewsletterPage}
                      onPerPageChange={handleNewsletterPerPage}
                      loading={newsletterLoading}
                      position="top"
                    />
                    <DataTable
                      columns={newsletterColumns}
                      rows={newsletter}
                      onEdit={async (row) => {
                        const next = row.status === 'active' ? 'inactive' : 'active';
                        try {
                          await newsletterApi.updateNewsletterStatus(row.id, next);
                          refreshNewsletter();
                        } catch (e) {
                          alert(e instanceof Error ? e.message : 'Erro ao atualizar.');
                        }
                      }}
                      emptyText="Nenhum inscrito na newsletter."
                    />
                    <ListPagination
                      meta={newsletterMeta}
                      onPageChange={handleNewsletterPage}
                      onPerPageChange={handleNewsletterPerPage}
                      loading={newsletterLoading}
                      position="bottom"
                    />
                  </div>
                </section>
              }
            />
            <Route path="*" element={<DashboardCards contatos={contatos} newsletter={newsletter} orcamentos={orcamentos} produtos={produtos} blog={blog} faqs={faqs} />} />
          </Routes>
        </main>
      </div>

      <Modal
        open={!!selectedContato}
        title="Detalhes do contato"
        onClose={() => setSelectedContato(null)}
        footer={
          <div className="flex justify-end">
            <button onClick={() => setSelectedContato(null)} className="px-4 py-2 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-xs uppercase tracking-widest transition-colors">
              Fechar
            </button>
          </div>
        }
      >
        {selectedContato && (
          <div className="space-y-3 text-sm">
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Nome: </span>{selectedContato.nome}</p>
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">E-mail: </span>{selectedContato.email}</p>
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Assunto: </span>{selectedContato.empresa || '—'}</p>
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Data: </span>{selectedContato.data}</p>
            <div>
              <p className="font-black text-gray-500 uppercase text-[10px] tracking-widest mb-2">Mensagem:</p>
              <p className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-green-950 leading-relaxed whitespace-pre-wrap">{selectedContato.mensagem || '—'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!selectedOrcamento}
        title="Detalhes do orçamento"
        onClose={() => setSelectedOrcamento(null)}
        footer={
          <div className="flex justify-end">
            <button onClick={() => setSelectedOrcamento(null)} className="px-4 py-2 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-xs uppercase tracking-widest transition-colors">
              Fechar
            </button>
          </div>
        }
      >
        {selectedOrcamento && (
          <div className="space-y-6 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Nome: </span>{selectedOrcamento.nome}</p>
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">E-mail: </span>{selectedOrcamento.email}</p>
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Empresa: </span>{selectedOrcamento.empresa}</p>
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Telefone: </span>{selectedOrcamento.telefone || '-'}</p>
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Data: </span>{selectedOrcamento.data}</p>
              <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Status: </span>{selectedOrcamento.status}</p>
            </div>
            {selectedOrcamento.mensagem && (
              <div>
                <p className="font-black text-gray-500 uppercase text-[10px] tracking-widest mb-2">Observações:</p>
                <p className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-green-950 leading-relaxed">{selectedOrcamento.mensagem}</p>
              </div>
            )}
            <div>
              <p className="font-black text-gray-500 uppercase text-[10px] tracking-widest mb-3">Produtos solicitados:</p>
              <div className="space-y-3">
                {selectedOrcamento.produtos.map((prod, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-green-950">{prod.nome}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Código: {prod.codigo}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prod.tamanho && (
                        <span className="px-2 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700">
                          Tamanho: {prod.tamanho}
                        </span>
                      )}
                      {prod.amostraGratis && (
                        <span className="px-2 py-1 rounded-lg bg-gold/20 text-xs font-bold text-gold">
                          Amostra grátis
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
