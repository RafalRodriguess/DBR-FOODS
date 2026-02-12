import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  Layers,
  Mail,
  MessageSquare,
  Package,
} from 'lucide-react';

export type Produto = { id: number; nome: string; categoria: string; origem: string; pureza: string; status: string };
export type Servico = { id: number; nome: string; categoria: string; descricao: string; status: string };
export type BlogItem = { id: number; titulo: string; categoria: string; resumo: string; status: string };
export type FaqItem = { id: number; pergunta: string; resposta: string; status: string };
export type Contato = { id: number; nome: string; email: string; empresa: string; mensagem: string; status: string; data: string };
export type Lead = { id: number; nome: string; email: string; segmento: string; status: string; data: string };

export const menuItems = [
  { name: 'Painel', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Produtos', icon: Package, path: '/admin/products' },
  { name: 'Serviços', icon: Layers, path: '/admin/services' },
  { name: 'Blog', icon: FileText, path: '/admin/blog' },
  { name: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
  { name: 'Contatos', icon: MessageSquare, path: '/admin/contacts' },
  { name: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
];

export const produtosMock: Produto[] = [
  { id: 1, nome: 'Semente de Chia', categoria: 'Seeds & Grains', origem: 'Paraguai', pureza: '>99.95%', status: 'Ativo' },
  { id: 2, nome: 'Quinoa Branca', categoria: 'Seeds & Grains', origem: 'Espanha', pureza: '>99.90%', status: 'Ativo' },
];

export const servicosMock: Servico[] = [
  { id: 1, nome: 'Garantia de Qualidade', categoria: 'Qualidade', descricao: 'Controle técnico por lote', status: 'Ativo' },
  { id: 2, nome: 'Logística Internacional', categoria: 'Logística', descricao: 'Suporte de origem até destino', status: 'Ativo' },
];

export const blogMock: BlogItem[] = [
  { id: 1, titulo: 'Logística de Superalimentos em Rotterdam', categoria: 'Supply Chain', resumo: 'Como reduzir lead time e risco operacional.', status: 'Publicado' },
  { id: 2, titulo: 'Tendências de Ingredientes Naturais', categoria: 'Mercado', resumo: 'Categorias com maior demanda no trade.', status: 'Rascunho' },
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
