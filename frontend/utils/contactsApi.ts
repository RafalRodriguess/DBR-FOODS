/**
 * API de Contatos — criar (público) e CRUD (admin com auth).
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type Contact = {
  id: number;
  name: string;
  nome: string;
  email: string;
  phone?: string;
  telefone: string;
  subject?: string;
  empresa: string;
  message?: string;
  mensagem: string;
  status: string;
  data: string;
};

/** Formato para compatibilidade com o admin (Contato) */
export type ContatoAdmin = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  mensagem: string;
  status: string;
  data: string;
};

function toAdminFormat(c: Contact): ContatoAdmin {
  return {
    id: c.id,
    nome: c.name,
    email: c.email,
    empresa: c.subject ?? c.empresa ?? '',
    mensagem: c.message ?? c.mensagem ?? '',
    status: c.status,
    data: c.data,
  };
}

/**
 * POST /api/contact-request — criar contato (rota pública, sem auth).
 */
export async function createContact(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
}): Promise<{ contact: Contact }> {
  const res = await fetch(`${apiBaseUrl}/api/contact-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    const msg = payload?.errors ?? raw?.message ?? 'Failed to send message.';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }

  const contact = payload?.contact;
  if (!contact?.id) throw new Error('Invalid server response.');
  return { contact };
}

export type ContactsListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

/**
 * GET /api/contacts — listar contatos (admin).
 */
export async function listContacts(params?: {
  per_page?: number;
  page?: number;
}): Promise<{ contacts: ContatoAdmin[]; meta: ContactsListMeta }> {
  const search = new URLSearchParams();
  if (params?.per_page) search.set('per_page', String(params.per_page));
  if (params?.page) search.set('page', String(params.page));
  const qs = search.toString() ? `?${search.toString()}` : '';
  const res = await fetch(`${apiBaseUrl}/api/contacts${qs}`, {
    headers: getAuthHeaders(),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    throw new Error(payload?.errors ?? raw?.message ?? 'Failed to load contacts.');
  }

  const list = payload?.contacts ?? payload?.data ?? [];
  const meta = (payload?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0 }) as ContactsListMeta;
  return {
    contacts: Array.isArray(list) ? list.map((c: Contact) => toAdminFormat(c)) : [],
    meta,
  };
}

/**
 * GET /api/contacts/{id} — ler contato (admin).
 */
export async function getContact(id: number): Promise<Contact> {
  const res = await fetch(`${apiBaseUrl}/api/contacts/${id}`, {
    headers: getAuthHeaders(),
  });

  const raw = await res.json().catch(() => ({}));
  const payload = raw?.data ?? raw;

  if (!res.ok) {
    throw new Error(payload?.errors ?? raw?.message ?? 'Failed to load contact.');
  }

  const contact = payload?.contact;
  if (!contact) throw new Error('Contact not found.');
  return contact;
}

/**
 * PUT /api/contacts/{id} — atualizar status (admin).
 */
export async function updateContactStatus(id: number, status: string): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/contacts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(raw?.message ?? 'Failed to update status.');
  }
}

/**
 * DELETE /api/contacts/{id} — excluir contato (admin).
 */
export async function deleteContact(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/contacts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error(raw?.message ?? 'Failed to delete contact.');
  }
}
