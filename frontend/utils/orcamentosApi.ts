/**
 * API de Orçamentos — criar (público) e CRUD (admin com auth).
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type ProdutoOrcamento = {
  name: string;
  code?: string;
  slug?: string;
  size?: string;
  free_sample?: boolean;
};

export type Orcamento = {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  status: string;
  data: string;
  created_at?: string;
  products: { nome: string; codigo?: string; tamanho?: string; amostraGratis: boolean }[];
};

/** Formato para compatibilidade com o admin (nome em pt) */
export type OrcamentoAdmin = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  telefone: string;
  mensagem: string;
  status: string;
  data: string;
  produtos: { nome: string; codigo?: string; tamanho?: string; amostraGratis: boolean }[];
  produtosResumo?: string;
};

function toAdminFormat(q: Orcamento): OrcamentoAdmin {
  return {
    id: q.id,
    nome: q.name,
    email: q.email,
    empresa: q.company ?? '',
    telefone: q.phone ?? '',
    mensagem: q.message ?? '',
    status: q.status,
    data: q.data,
    produtos: q.products ?? [],
    produtosResumo: q.products ? `${q.products.length} produto(s)` : '0 produto(s)',
  };
}

/**
 * POST /api/quote-request — criar orçamento (rota pública, sem auth).
 */
export async function createQuote(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
  products: ProdutoOrcamento[];
}): Promise<{ quote: Orcamento }> {
  const res = await fetch(`${apiBaseUrl}/api/quote-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    const msg = payload?.errors ?? raw?.message ?? 'Falha ao enviar orçamento.';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const quote = payload?.quote;
  if (!quote?.id) throw new Error('Resposta inválida do servidor.');
  return { quote };
}

export type QuotesListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

/**
 * GET /api/quotes — listar orçamentos (admin).
 */
export async function listQuotes(params?: {
  per_page?: number;
  page?: number;
}): Promise<{ quotes: OrcamentoAdmin[]; meta: QuotesListMeta }> {
  const search = new URLSearchParams();
  if (params?.per_page) search.set('per_page', String(params.per_page));
  if (params?.page) search.set('page', String(params.page));
  const qs = search.toString() ? `?${search.toString()}` : '';
  const res = await fetch(`${apiBaseUrl}/api/quotes${qs}`, {
    headers: getAuthHeaders(),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    throw new Error(payload?.errors ?? raw?.message ?? 'Falha ao carregar orçamentos.');
  }

  const list = payload?.quotes ?? payload?.data ?? [];
  const meta = (payload?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0 }) as QuotesListMeta;
  return {
    quotes: Array.isArray(list) ? list.map((q: Orcamento) => toAdminFormat(q)) : [],
    meta,
  };
}

/**
 * GET /api/quotes/{id} — ler orçamento (admin).
 */
export async function getQuote(id: number): Promise<OrcamentoAdmin> {
  const res = await fetch(`${apiBaseUrl}/api/quotes/${id}`, {
    headers: getAuthHeaders(),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    throw new Error(payload?.errors ?? raw?.message ?? 'Falha ao carregar orçamento.');
  }

  const quote = payload?.quote;
  if (!quote) throw new Error('Orçamento não encontrado.');
  return toAdminFormat(quote);
}

/**
 * PUT /api/quotes/{id} — atualizar status (admin).
 */
export async function updateQuoteStatus(id: number, status: string): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/quotes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(raw?.message ?? 'Falha ao atualizar status.');
  }
}

/**
 * DELETE /api/quotes/{id} — excluir orçamento (admin).
 */
export async function deleteQuote(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/quotes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(raw?.message ?? 'Falha ao excluir orçamento.');
  }
}
