/**
 * Cliente da API Laravel (Sanctum).
 * Base URL via VITE_API_URL (ex: http://127.0.0.1:8000).
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (url) return url.replace(/\/$/, '');
  return 'http://127.0.0.1:8000';
};

export const apiBaseUrl = getBaseUrl();

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export type LoginResponse = {
  token: string;
  token_type: string;
  user: { id: number; name: string; email: string };
};

export type LoginError = { message: string; errors?: Record<string, string[]> };

/**
 * POST /api/login — retorna { token, user } ou lança com mensagem de erro.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${apiBaseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data?.errors?.email?.[0] ||
      data?.message ||
      'Falha ao entrar. Verifique email e senha.';
    throw new Error(msg);
  }

  if (!data.token || !data.user) {
    throw new Error('Resposta inválida do servidor.');
  }

  return data as LoginResponse;
}
