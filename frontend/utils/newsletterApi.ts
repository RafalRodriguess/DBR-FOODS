/**
 * API de Newsletter — inscrever (público) e listar/atualizar status (admin).
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type NewsletterSubscriber = {
  id: number;
  email: string;
  status: 'active' | 'inactive';
  data: string;
};

/**
 * POST /api/newsletter/subscribe — inscrever na newsletter (público).
 */
export async function subscribeNewsletter(email: string): Promise<{ message: string }> {
  const res = await fetch(`${apiBaseUrl}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email }),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    const msg = payload?.errors ?? raw?.message ?? 'Failed to subscribe.';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  return { message: payload?.message ?? 'Subscribed successfully' };
}

/**
 * GET /api/newsletter — listar inscritos (admin).
 */
export async function listNewsletter(params?: { per_page?: number; page?: number }): Promise<{
  subscribers: NewsletterSubscriber[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}> {
  const search = new URLSearchParams();
  if (params?.per_page) search.set('per_page', String(params.per_page));
  if (params?.page) search.set('page', String(params.page));
  const qs = search.toString() ? `?${search.toString()}` : '';
  const res = await fetch(`${apiBaseUrl}/api/newsletter${qs}`, {
    headers: getAuthHeaders(),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    throw new Error(payload?.errors ?? raw?.message ?? 'Failed to load subscribers.');
  }

  const list = payload?.subscribers ?? payload?.data ?? [];
  const meta = payload?.meta ?? { current_page: 1, last_page: 1, per_page: 50, total: 0 };

  return {
    subscribers: Array.isArray(list) ? list : [],
    meta,
  };
}

/**
 * PUT /api/newsletter/{id}/status — atualizar status (admin).
 */
export async function updateNewsletterStatus(id: number, status: 'active' | 'inactive'): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/newsletter/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(raw?.message ?? 'Failed to update status.');
  }
}
