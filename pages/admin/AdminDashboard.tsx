import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Users,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../App';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DataTable, { ColumnDef } from './components/DataTable';
import Modal from './components/Modal';
import ManagementPage from './components/ManagementPage';
import {
  BlogItem,
  Contato,
  FaqItem,
  Lead,
  Produto,
  Servico,
  blogMock,
  contatosMock,
  faqMock,
  leadsMock,
  menuItems,
  produtosMock,
  servicosMock,
} from './mock/data';
import logoImage from '../../Layer_1-1.png';

const DashboardCards = ({
  contatos,
  leads,
  produtos,
  servicos,
  blog,
  faqs,
}: {
  contatos: Contato[];
  leads: Lead[];
  produtos: Produto[];
  servicos: Servico[];
  blog: BlogItem[];
  faqs: FaqItem[];
}) => {
  const contatosNaoLidos = contatos.filter((c) => c.status === 'Não lido').length;
  const contatosRespondidos = contatos.filter((c) => c.status === 'Respondido').length;
  const blogPublicado = blog.filter((b) => b.status === 'Publicado').length;
  const blogRascunho = blog.filter((b) => b.status === 'Rascunho').length;
  const faqPublicado = faqs.filter((f) => f.status === 'Publicado').length;
  const servicosAtivos = servicos.filter((s) => s.status === 'Ativo').length;
  const produtosAtivos = produtos.filter((p) => p.status === 'Ativo').length;
  const leadsAtivos = leads.filter((l) => l.status === 'Ativo').length;

  const cards = [
    { label: 'Contatos recebidos', val: String(contatos.length), Icon: MessageSquare },
    { label: 'Leads newsletter', val: String(leads.length), Icon: Users },
    { label: 'Taxa de resposta', val: `${contatos.length ? Math.round((contatosRespondidos / contatos.length) * 100) : 0}%`, Icon: TrendingUp },
    { label: 'Conteúdo publicado', val: String(blogPublicado + faqPublicado), Icon: Eye },
  ];

  const prioridades = [
    { id: 1, texto: `${contatosNaoLidos} contatos aguardando resposta`, tipo: contatosNaoLidos > 0 ? 'alerta' : 'ok' },
    { id: 2, texto: `${blogRascunho} artigos em rascunho para revisão`, tipo: blogRascunho > 0 ? 'aviso' : 'ok' },
    { id: 3, texto: `${leadsAtivos} leads ativos para follow-up`, tipo: 'ok' },
  ];

  const operacao = [
    { label: 'Blog publicado', current: blogPublicado, total: blog.length || 1 },
    { label: 'FAQ publicado', current: faqPublicado, total: faqs.length || 1 },
    { label: 'Serviços ativos', current: servicosAtivos, total: servicos.length || 1 },
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

  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={close} aria-label="Fechar menu" />}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-green-950 text-white p-6 md:p-7 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-8">
          <img src={logoImage} alt="DBR Foods" className="h-8 w-auto brightness-0 invert" />
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
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={close}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                  active ? 'bg-gold text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
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

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
  const [servicos, setServicos] = useState<Servico[]>(servicosMock);
  const [blog, setBlog] = useState<BlogItem[]>(blogMock);
  const [faqs, setFaqs] = useState<FaqItem[]>(faqMock);
  const [contatos, setContatos] = useState<Contato[]>(contatosMock);
  const [leads, setLeads] = useState<Lead[]>(leadsMock);

  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);

  const pageTitle = useMemo(() => {
    const found = menuItems.find((item) => item.path === location.pathname);
    return found?.name ?? 'Painel';
  }, [location.pathname]);

  const contatoColumns: ColumnDef<Contato>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'empresa', label: 'Empresa' },
    { key: 'status', label: 'Status' },
  ];

  const leadColumns: ColumnDef<Lead>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'segmento', label: 'Segmento' },
    { key: 'status', label: 'Status' },
  ];

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
            <Route path="dashboard" element={<DashboardCards contatos={contatos} leads={leads} produtos={produtos} servicos={servicos} blog={blog} faqs={faqs} />} />
            <Route
              path="products"
              element={
                <ManagementPage<Produto>
                  title="Cadastro de Produtos"
                  entityLabel="produtos"
                  rows={produtos}
                  setRows={setProdutos}
                  searchKeys={['nome', 'categoria', 'origem', 'status']}
                  columns={[
                    { key: 'nome', label: 'Produto' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'origem', label: 'Origem' },
                    { key: 'status', label: 'Status' },
                  ]}
                  fields={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'origem', label: 'Origem' },
                    { key: 'pureza', label: 'Pureza' },
                    { key: 'status', label: 'Status' },
                  ]}
                  makeEmpty={() => ({ id: 0, nome: '', categoria: '', origem: '', pureza: '', status: 'Ativo' })}
                />
              }
            />
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
            <Route
              path="blog"
              element={
                <ManagementPage<BlogItem>
                  title="Gestão de Blog"
                  entityLabel="artigos"
                  rows={blog}
                  setRows={setBlog}
                  searchKeys={['titulo', 'categoria', 'status']}
                  columns={[
                    { key: 'titulo', label: 'Título' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'status', label: 'Status' },
                  ]}
                  fields={[
                    { key: 'titulo', label: 'Título' },
                    { key: 'categoria', label: 'Categoria' },
                    { key: 'resumo', label: 'Resumo', type: 'textarea' },
                    { key: 'status', label: 'Status' },
                  ]}
                  makeEmpty={() => ({ id: 0, titulo: '', categoria: '', resumo: '', status: 'Rascunho' })}
                />
              }
            />
            <Route
              path="faq"
              element={
                <ManagementPage<FaqItem>
                  title="Gestão de FAQ"
                  entityLabel="perguntas"
                  rows={faqs}
                  setRows={setFaqs}
                  searchKeys={['pergunta', 'resposta', 'status']}
                  columns={[
                    { key: 'pergunta', label: 'Pergunta' },
                    { key: 'status', label: 'Status' },
                  ]}
                  fields={[
                    { key: 'pergunta', label: 'Pergunta', type: 'textarea' },
                    { key: 'resposta', label: 'Resposta', type: 'textarea' },
                    { key: 'status', label: 'Status' },
                  ]}
                  makeEmpty={() => ({ id: 0, pergunta: '', resposta: '', status: 'Publicado' })}
                />
              }
            />
            <Route
              path="contacts"
              element={
                <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">Visualização de Contatos</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Inbox comercial com dados mock</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <DataTable
                      columns={contatoColumns}
                      rows={contatos}
                      onView={(row) => setSelectedContato(row)}
                      onDelete={(row) => setContatos((prev) => prev.filter((c) => c.id !== row.id))}
                      onEdit={(row) =>
                        setContatos((prev) =>
                          prev.map((c) => (c.id === row.id ? { ...c, status: c.status === 'Não lido' ? 'Respondido' : 'Não lido' } : c))
                        )
                      }
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
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Lista de inscritos e status</p>
                  </div>
                  <div className="p-6 md:p-8">
                    <DataTable
                      columns={leadColumns}
                      rows={leads}
                      onDelete={(row) => setLeads((prev) => prev.filter((c) => c.id !== row.id))}
                      onEdit={(row) =>
                        setLeads((prev) =>
                          prev.map((c) => (c.id === row.id ? { ...c, status: c.status === 'Ativo' ? 'Inativo' : 'Ativo' } : c))
                        )
                      }
                    />
                  </div>
                </section>
              }
            />
            <Route path="*" element={<DashboardCards contatos={contatos} leads={leads} produtos={produtos} servicos={servicos} blog={blog} faqs={faqs} />} />
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
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Empresa: </span>{selectedContato.empresa}</p>
            <p><span className="font-black text-gray-500 uppercase text-[10px] tracking-widest">Data: </span>{selectedContato.data}</p>
            <div>
              <p className="font-black text-gray-500 uppercase text-[10px] tracking-widest mb-2">Mensagem:</p>
              <p className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-green-950 leading-relaxed">{selectedContato.mensagem}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
