import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Package,
  ClipboardList,
  Users,
} from 'lucide-react';

export type Categoria = { id: number; nome: string };

export type Produto = {
  id: number;
  nome: string;
  codigo: string;
  categoriaId: number;
  origem: string;
  pureza: string;
  ingredientes: string;
  aplicacoes: string;
  tamanhos: string[];
  amostraGratis: boolean;
  estoque: number;
  status: string;
  img?: string;
  descricao?: string;
};
export type BlogItem = {
  id: number;
  titulo: string;
  resumo: string;
  categoriaId: number;
  categoria?: string;
  imagemDestaque: string;
  conteudo: string;
  status: string;
};
export type BlogCategoria = { id: number; nome: string };
export type FaqItem = { id: number; pergunta: string; resposta: string; status: string };
export type Contato = { id: number; nome: string; email: string; empresa: string; mensagem: string; status: string; data: string };
export type Lead = { id: number; nome: string; email: string; segmento: string; status: string; data: string };

export type ProdutoOrcamento = { nome: string; codigo: string; tamanho?: string; amostraGratis: boolean };
export type Orcamento = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  telefone: string;
  mensagem: string;
  produtos: ProdutoOrcamento[];
  status: string;
  data: string;
  produtosResumo?: string;
};

export type MenuItem = {
  name: string;
  icon: typeof Package;
  path: string;
  children?: { name: string; path: string }[];
};

export const menuItems: MenuItem[] = [
  { name: 'Painel', icon: LayoutDashboard, path: '/admin/dashboard' },
  {
    name: 'Produtos',
    icon: Package,
    path: '/admin/products',
    children: [
      { name: 'Produtos', path: '/admin/products' },
      { name: 'Categorias', path: '/admin/products/categories' },
    ],
  },
  {
    name: 'Blog',
    icon: FileText,
    path: '/admin/blog',
    children: [
      { name: 'Artigos', path: '/admin/blog' },
      { name: 'Automação', path: '/admin/blog/from-public' },
      { name: 'Categorias', path: '/admin/blog/categories' },
    ],
  },
  { name: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
  { name: 'Contatos', icon: MessageSquare, path: '/admin/contacts' },
  { name: 'Orçamentos', icon: ClipboardList, path: '/admin/quotes' },
  { name: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
  {
    name: 'Usuários',
    icon: Users,
    path: '/admin/users',
    children: [
      { name: 'Usuários', path: '/admin/users' },
      { name: 'Perfis', path: '/admin/users/roles' },
    ],
  },
];

export const categoriasMock: Categoria[] = [
  { id: 1, nome: 'Seeds & Grains' },
  { id: 2, nome: 'Algae' },
  { id: 3, nome: 'Cacao' },
  { id: 4, nome: 'Herbs & Spices' },
  { id: 5, nome: 'Fruit Powders' },
  { id: 6, nome: 'Plant Protein' },
];

export const produtosMock: Produto[] = [
  {
    id: 1,
    nome: 'Semente de Chia',
    codigo: 'dbr-chia-001',
    categoriaId: 1,
    origem: 'Paraguai',
    pureza: '>99.95%',
    ingredientes: '100% Sementes de Chia Preta Orgânica',
    aplicacoes: 'Panificação, bebidas, cereais, smoothies',
    tamanhos: ['5kg', '25kg', '250kg'],
    amostraGratis: true,
    estoque: 500,
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Quinoa Branca',
    codigo: 'dbr-quinoa-001',
    categoriaId: 1,
    origem: 'Espanha',
    pureza: '>99.90%',
    ingredientes: '100% Quinoa Branca',
    aplicacoes: 'Cereais, saladas, sopas',
    tamanhos: ['5kg', '25kg', '500kg'],
    amostraGratis: true,
    estoque: 300,
    status: 'Ativo',
  },
];

export const blogCategoriasMock: BlogCategoria[] = [
  { id: 1, nome: 'Supply Chain' },
  { id: 2, nome: 'Mercado' },
  { id: 3, nome: 'Sustentabilidade' },
];

export const blogMock: BlogItem[] = [
  {
    id: 1,
    titulo: 'Logística de Superalimentos em Rotterdam',
    categoriaId: 1,
    resumo: 'Como reduzir lead time e risco operacional.',
    imagemDestaque: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    conteudo: '<p>Artigo sobre logística e supply chain de superalimentos.</p>',
    status: 'Publicado',
  },
  {
    id: 2,
    titulo: 'Tendências de Ingredientes Naturais',
    categoriaId: 2,
    resumo: 'Categorias com maior demanda no trade.',
    imagemDestaque: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    conteudo: '<p>Análise de tendências do mercado.</p>',
    status: 'Rascunho',
  },
];

export const faqMock: FaqItem[] = [
  { id: 1, pergunta: 'Vocês fazem envio internacional?', resposta: 'Sim, com documentação completa.', status: 'Publicado' },
  { id: 2, pergunta: 'Trabalham com marca própria?', resposta: 'Avaliado conforme volume e requisitos.', status: 'Publicado' },
];

export const contatosMock: Contato[] = [
  { id: 1, nome: 'João Martins', email: 'joao@globalfoods.com', empresa: 'Global Foods', mensagem: 'Preciso cotação de chia.', status: 'Não lido', data: '2026-02-11' },
  { id: 2, nome: 'Ana Garcia', email: 'ana@sourcing.es', empresa: 'Sourcing Spain', mensagem: 'Gostaria de especificações técnicas.', status: 'Respondido', data: '2026-02-10' },
];

export const leadsMock: Lead[] = [
  { id: 1, nome: 'Carlos Silva', email: 'carlos@gmail.com', segmento: 'Distribuidor', status: 'Ativo', data: '2026-02-08' },
  { id: 2, nome: 'Marta Lopez', email: 'marta@import.es', segmento: 'Importador', status: 'Ativo', data: '2026-02-07' },
];

export const orcamentosMock: Orcamento[] = [
  {
    id: 1,
    nome: 'João Martins',
    email: 'joao@globalfoods.com',
    empresa: 'Global Foods',
    telefone: '+351 912 345 678',
    mensagem: 'Preciso de cotação para importação na UE.',
    produtos: [
      { nome: 'Black Chia Seeds', codigo: 'dbr-chia-001', tamanho: '25kg', amostraGratis: true },
      { nome: 'Organic Chlorella & Spirulina Tablets 500mg', codigo: 'dbr-algae-001', tamanho: '5kg', amostraGratis: false },
    ],
    status: 'Novo',
    data: '2026-02-14',
  },
  {
    id: 2,
    nome: 'Ana Garcia',
    email: 'ana@sourcing.es',
    empresa: 'Sourcing Spain',
    telefone: '+34 611 222 333',
    mensagem: 'Solicito especificações técnicas dos produtos.',
    produtos: [
      { nome: 'Cacao Powder', codigo: 'dbr-cacao-001', tamanho: '5kg', amostraGratis: true },
    ],
    status: 'Em atendimento',
    data: '2026-02-13',
  },
];
