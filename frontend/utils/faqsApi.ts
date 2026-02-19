/**
 * API de FAQs — CRUD com auth Sanctum + lista pública para o site.
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type Faq = {
  id: number;
  question: string;
  answer: string;
  order: number;
  created_at?: string;
  updated_at?: string;
};

function parseListResponse(data: unknown): Faq[] {
  if (Array.isArray(data)) return data as Faq[];
  const obj = data as Record<string, unknown>;
  const list = obj?.list as Record<string, unknown> | undefined;
  const faqs = list?.faqs ?? obj?.faqs;
  if (Array.isArray(faqs)) return faqs as Faq[];
  // Laravel paginator: { data: Faq[], current_page, ... }
  if (faqs && typeof faqs === 'object' && 'data' in faqs && Array.isArray((faqs as { data: unknown }).data)) {
    return (faqs as { data: Faq[] }).data;
  }
  const paginated = obj?.data as { data?: Faq[] } | undefined;
  if (Array.isArray(paginated?.data)) return paginated.data;
  return [];
}

function parseFaqResponse(data: unknown): Faq | null {
  const obj = data as Record<string, unknown>;
  const faq = (obj?.faq ?? obj?.create?.faq ?? obj?.update?.faq ?? obj?.read?.faq ?? obj?.data) as Faq | undefined;
  if (faq && typeof faq.id === 'number') return faq;
  return null;
}

async function handleRes(res: Response, parse: (data: unknown) => Faq[] | Faq | null) {
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as unknown;
  if (!res.ok) {
    const msg = (raw as { message?: string })?.message ?? (raw as { errors?: unknown })?.errors ?? 'Erro na requisição';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return parse(data);
}

/** Lista pública (página do site) — sem autenticação. */
export async function listPublicFaqs(): Promise<Faq[]> {
  const res = await fetch(`${apiBaseUrl}/api/faqs/public`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const parsed = await handleRes(res, (d) => parseListResponse(d));
  return Array.isArray(parsed) ? parsed : [];
}

export async function listFaqs(): Promise<Faq[]> {
  const res = await fetch(`${apiBaseUrl}/api/faqs`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const parsed = await handleRes(res, (d) => parseListResponse(d));
  return Array.isArray(parsed) ? parsed : [];
}

export async function createFaq(body: { question: string; answer: string; order: number }): Promise<Faq> {
  const res = await fetch(`${apiBaseUrl}/api/faqs/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const faq = await handleRes(res, (d) => parseFaqResponse(d));
  if (!faq) throw new Error('Resposta inválida ao criar FAQ.');
  return faq;
}

export async function readFaq(id: number): Promise<Faq | null> {
  const res = await fetch(`${apiBaseUrl}/api/faqs/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleRes(res, (d) => parseFaqResponse(d));
}

export async function updateFaq(id: number, body: Partial<{ question: string; answer: string; order: number }>): Promise<Faq> {
  const res = await fetch(`${apiBaseUrl}/api/faqs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const faq = await handleRes(res, (d) => parseFaqResponse(d));
  if (!faq) throw new Error('Resposta inválida ao atualizar FAQ.');
  return faq;
}

export async function deleteFaq(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/faqs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}
