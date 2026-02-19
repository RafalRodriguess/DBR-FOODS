/**
 * API de Usuários, Perfis (roles) e Permissões — admin (manage-users).
 */
import { apiBaseUrl, getAuthHeaders } from './api';
import type { PaginationMeta } from './pagination';

const auth = () => getAuthHeaders();

export type Role = { id: number; name: string; label?: string; permissions?: Permission[] };
export type Permission = { id: number; name: string; label?: string };

export type User = {
  id: number;
  name: string;
  email: string;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
};

function getPayload(res: Response, raw: unknown): Record<string, unknown> {
  const data = (raw as { data?: unknown })?.data ?? raw;
  return (data as Record<string, unknown>) ?? {};
}

async function handleRes<T>(res: Response, parser: (data: Record<string, unknown>) => T): Promise<T> {
  const raw = await res.json().catch(() => ({}));
  const payload = getPayload(res, raw);
  if (!res.ok) {
    const msg = (raw as { message?: string })?.message ?? 'Erro na requisição';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return parser(payload);
}

/** Listar usuários (paginado) */
export async function listUsers(params?: {
  per_page?: number;
  page?: number;
  search?: string;
}): Promise<{ users: User[]; meta: PaginationMeta }> {
  const search = new URLSearchParams();
  if (params?.per_page) search.set('per_page', String(params.per_page));
  if (params?.page) search.set('page', String(params.page));
  if (params?.search) search.set('search', params.search);
  const qs = search.toString() ? `?${search.toString()}` : '';
  const res = await fetch(`${apiBaseUrl}/api/users${qs}`, { headers: auth() });
  const raw = await res.json().catch(() => ({}));
  const payload = getPayload(res, raw);
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar usuários.');

  const usersPayload = payload.users as
    | { data?: User[]; current_page?: number; last_page?: number; per_page?: number; total?: number }
    | undefined;
  const list = Array.isArray(usersPayload?.data) ? usersPayload.data : Array.isArray(payload.users) ? payload.users : [];
  const meta: PaginationMeta = usersPayload
    ? {
        current_page: usersPayload.current_page ?? 1,
        last_page: usersPayload.last_page ?? 1,
        per_page: usersPayload.per_page ?? 15,
        total: usersPayload.total ?? 0,
      }
    : { current_page: 1, last_page: 1, per_page: 15, total: list.length };

  return {
    users: list.map((u: User & { roles?: { id: number; name: string; label?: string }[] }) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roles: u.roles,
      created_at: u.created_at,
      updated_at: u.updated_at,
    })),
    meta,
  };
}

/** Ler um usuário */
export async function readUser(id: number): Promise<User | null> {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, { headers: auth() });
  return handleRes(res, (d) => (d.user as User) ?? null);
}

/** Criar usuário */
export async function createUser(body: {
  name: string;
  email: string;
  password: string;
  role_ids?: number[];
}): Promise<User> {
  const res = await fetch(`${apiBaseUrl}/api/users/create`, {
    method: 'POST',
    headers: { ...auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes(res, (d) => {
    const u = d.user as User;
    if (!u?.id) throw new Error('Resposta inválida ao criar usuário.');
    return u;
  });
}

/** Atualizar usuário */
export async function updateUser(
  id: number,
  body: { name?: string; email?: string; password?: string; role_ids?: number[] }
): Promise<User> {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, {
    method: 'PUT',
    headers: { ...auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes(res, (d) => {
    const u = d.user as User;
    if (!u?.id) throw new Error('Resposta inválida ao atualizar usuário.');
    return u;
  });
}

/** Excluir usuário */
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/users/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

/** Listar perfis (roles) com permissões */
export async function listRoles(): Promise<Role[]> {
  const res = await fetch(`${apiBaseUrl}/api/roles`, { headers: auth() });
  return handleRes(res, (d) => (d.roles as Role[]) ?? []);
}

/** Ler um perfil */
export async function readRole(id: number): Promise<Role | null> {
  const res = await fetch(`${apiBaseUrl}/api/roles/${id}`, { headers: auth() });
  return handleRes(res, (d) => (d.role as Role) ?? null);
}

/** Criar perfil */
export async function createRole(body: { name: string; label?: string; permission_ids?: number[] }): Promise<Role> {
  const res = await fetch(`${apiBaseUrl}/api/roles/create`, {
    method: 'POST',
    headers: { ...auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes(res, (d) => {
    const r = d.role as Role;
    if (!r?.id) throw new Error('Resposta inválida ao criar perfil.');
    return r;
  });
}

/** Atualizar perfil */
export async function updateRole(
  id: number,
  body: { name?: string; label?: string; permission_ids?: number[] }
): Promise<Role> {
  const res = await fetch(`${apiBaseUrl}/api/roles/${id}`, {
    method: 'PUT',
    headers: { ...auth(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleRes(res, (d) => {
    const r = d.role as Role;
    if (!r?.id) throw new Error('Resposta inválida ao atualizar perfil.');
    return r;
  });
}

/** Excluir perfil */
export async function deleteRole(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/roles/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir perfil.');
  }
}

/** Listar permissões */
export async function listPermissions(): Promise<Permission[]> {
  const res = await fetch(`${apiBaseUrl}/api/permissions`, { headers: auth() });
  return handleRes(res, (d) => (d.permissions as Permission[]) ?? []);
}
