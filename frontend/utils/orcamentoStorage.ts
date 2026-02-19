import type { Orcamento, ProdutoOrcamento } from '../pages/admin/mock/data';

const STORAGE_KEY = 'dbr-orcamentos';

export const seedOrcamentosIfEmpty = (initial: Orcamento[]): void => {
  if (getOrcamentos().length === 0 && initial.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }
};

export const getOrcamentos = (): Orcamento[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveOrcamento = (data: {
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
  mensagem?: string;
  produtos: ProdutoOrcamento[];
}): void => {
  const list = getOrcamentos();
  const maxId = list.length ? Math.max(...list.map((o) => o.id)) : 0;
  const hoje = new Date().toISOString().slice(0, 10);
  const novo: Orcamento = {
    id: maxId + 1,
    nome: data.nome,
    email: data.email,
    empresa: data.empresa ?? '',
    telefone: data.telefone ?? '',
    mensagem: data.mensagem ?? '',
    produtos: data.produtos,
    status: 'Novo',
    data: hoje,
  };
  list.unshift(novo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const updateOrcamentoStatus = (id: number, status: string): void => {
  const list = getOrcamentos();
  const idx = list.findIndex((o) => o.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};

export const deleteOrcamento = (id: number): void => {
  const list = getOrcamentos().filter((o) => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};
