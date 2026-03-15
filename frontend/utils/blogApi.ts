/**
 * API do Blog — público (sem auth) e admin (com auth Sanctum).
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type BlogCategory = { id: number; name: string; slug?: string; order?: number };

export type BlogPost = {
  id: number;
  blog_category_id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author_name?: string;
  author_role?: string;
  author_bio?: string;
  author_image?: string;
  status: 'draft' | 'published';
  source?: 'admin' | 'public';
  is_featured?: boolean;
  read_time_minutes?: number;
  published_at?: string;
  category?: string;
  category_slug?: string;
};

function paginatedData<T>(payload: unknown, key: string): T[] {
  const obj = payload as Record<string, unknown>;
  const list = obj?.[key];
  if (Array.isArray(list)) return list as T[];
  const paginator = list as { data?: T[] } | undefined;
  if (paginator && Array.isArray(paginator.data)) return paginator.data;
  return [];
}

function singlePayload<T>(payload: unknown, key: string): T | null {
  const obj = payload as Record<string, unknown>;
  const item = obj?.[key] ?? (obj?.data as Record<string, unknown>)?.[key];
  if (item && typeof (item as { id?: number }).id === 'number') return item as T;
  return null;
}

async function handleRes<T>(res: Response, parser: (data: unknown) => T): Promise<T> {
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as unknown;
  if (!res.ok) {
    const msg = (raw as { message?: string })?.message ?? 'Erro na requisição';
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return parser(data);
}

const auth = () => getAuthHeaders();

// ——— Público (sem auth) ———

export async function listCategoriesPublic(): Promise<BlogCategory[]> {
  const res = await fetch(`${apiBaseUrl}/api/blog/categories/public`, {
    headers: { Accept: 'application/json' },
  });
  return handleRes(res, (d) => paginatedData(d, 'blog_categories'));
}

export async function listPostsPublic(params?: {
  blog_category_id?: number;
  category_slug?: string;
  per_page?: number;
  page?: number;
}): Promise<{ blog_posts: BlogPost[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }> {
  const url = new URL(`${apiBaseUrl}/api/blog/posts/public`);
  if (params?.blog_category_id) url.searchParams.set('blog_category_id', String(params.blog_category_id));
  if (params?.category_slug) url.searchParams.set('category_slug', params.category_slug);
  if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as Record<string, unknown>;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar posts.');
  const posts = (data?.blog_posts ?? []) as BlogPost[];
  const meta = (data?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0 }) as {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  return { blog_posts: posts, meta };
}

export async function getPostBySlugPublic(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${apiBaseUrl}/api/blog/posts/public/slug/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar post.');
  }
  const data = (raw?.data ?? raw) as Record<string, unknown>;
  const post = data?.blog_post as BlogPost | undefined;
  return post ?? null;
}

// ——— Admin (com auth) ———

export async function listCategories(): Promise<BlogCategory[]> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories?per_page=100`, { headers: auth() });
  return handleRes(res, (d) => paginatedData(d, 'blog_categories'));
}

export async function pluckCategories(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories/plucks`, { headers: auth() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const plucks = payload?.plucks as { id: number; name: string }[] | undefined;
  return Array.isArray(plucks) ? plucks : [];
}

/** Categoria mais próxima para um título/texto (doc §2.1). Não exige match exato. */
export type SuggestCategoryResult = { id: number; name: string; slug?: string; score?: number } | null;

export async function suggestCategory(params: { title?: string; text?: string }): Promise<SuggestCategoryResult> {
  const { title, text } = params;
  const query = title?.trim() || text?.trim();
  if (!query) return null;
  const url = new URL(`${apiBaseUrl}/api/blog-categories/suggest`);
  url.searchParams.set(title ? 'title' : 'text', query.slice(0, 500));
  const res = await fetch(url.toString(), { headers: auth() });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  const data = (raw?.data ?? raw) as Record<string, unknown>;
  const suggested = data?.suggested_category as { id?: number; name?: string; slug?: string; score?: number } | undefined;
  if (!suggested || typeof suggested.id !== 'number') return null;
  return {
    id: suggested.id,
    name: typeof suggested.name === 'string' ? suggested.name : '',
    slug: typeof suggested.slug === 'string' ? suggested.slug : undefined,
    score: typeof suggested.score === 'number' ? suggested.score : undefined,
  };
}

export async function createCategory(body: { name: string; slug?: string; order?: number }): Promise<BlogCategory> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories/create`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'blog_category'));
  if (!item) throw new Error('Resposta inválida ao criar categoria.');
  return item;
}

export async function readCategory(id: number): Promise<BlogCategory | null> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories/${id}`, { headers: auth() });
  return handleRes(res, (d) => singlePayload(d, 'blog_category'));
}

export async function updateCategory(id: number, body: Partial<{ name: string; slug?: string; order?: number }>): Promise<BlogCategory> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'blog_category'));
  if (!item) throw new Error('Resposta inválida ao atualizar categoria.');
  return item;
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/blog-categories/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

export async function listPosts(params?: {
  blog_category_id?: number;
  status?: string;
  source?: 'admin' | 'public';
  per_page?: number;
  page?: number;
}): Promise<{ blog_posts: BlogPost[]; meta: { current_page: number; last_page: number; per_page: number; total: number } }> {
  const url = new URL(`${apiBaseUrl}/api/blog-posts`);
  if (params?.blog_category_id) url.searchParams.set('blog_category_id', String(params.blog_category_id));
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.source) url.searchParams.set('source', params.source);
  if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await fetch(url.toString(), { headers: auth() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as Record<string, unknown>;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar posts.');
  const posts = (data?.blog_posts ?? []) as BlogPost[];
  const meta = (data?.meta ?? { current_page: 1, last_page: 1, per_page: 15, total: 0 }) as {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  return { blog_posts: posts, meta };
}

export async function readPost(id: number): Promise<BlogPost | null> {
  const res = await fetch(`${apiBaseUrl}/api/blog-posts/${id}`, { headers: auth() });
  return handleRes(res, (d) => singlePayload(d, 'blog_post'));
}

export type CreatePostBody = {
  blog_category_id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  author_name?: string;
  author_role?: string;
  author_bio?: string;
  author_image?: string;
  status: 'draft' | 'published';
  is_featured?: boolean;
  read_time_minutes?: number;
  published_at?: string;
};

export async function createPost(body: CreatePostBody): Promise<BlogPost> {
  const res = await fetch(`${apiBaseUrl}/api/blog-posts/create`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'blog_post'));
  if (!item) throw new Error('Resposta inválida ao criar post.');
  return item;
}

export async function updatePost(id: number, body: Partial<CreatePostBody>): Promise<BlogPost> {
  const res = await fetch(`${apiBaseUrl}/api/blog-posts/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'blog_post'));
  if (!item) throw new Error('Resposta inválida ao atualizar post.');
  return item;
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/blog-posts/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

/** Headers para upload (multipart): sem Content-Type para o browser definir o boundary */
function authHeadersForUpload(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const h: HeadersInit = { Accept: 'application/json' };
  if (token) (h as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return h;
}

/**
 * Upload de imagem de destaque para o blog. Salva no storage do backend e devolve a URL.
 */
export async function uploadBlogImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${apiBaseUrl}/api/blog-posts/upload-image`, {
    method: 'POST',
    headers: authHeadersForUpload(),
    body: form,
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as Record<string, unknown>;
  if (!res.ok) {
    const msg = (raw as { message?: string })?.message ?? (data?.url ? null : 'Erro no upload.');
    throw new Error(typeof msg === 'string' ? msg : 'Erro no upload.');
  }
  const url = data?.url as string | undefined;
  if (!url) throw new Error('Resposta inválida do servidor.');
  return { url };
}

/** Quota mensal de posts (doc §2.3) */
export type PostsQuota = {
  posts_used_this_month: number;
  posts_monthly_limit: number;
  posts_remaining: number;
  resets_at: string; // ex.: "2026-04-01"
};

export async function getPostsQuota(): Promise<PostsQuota> {
  const res = await fetch(`${apiBaseUrl}/api/blog/posts-quota`, { headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as Record<string, unknown> | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar quota.');
  const used = Number(data?.posts_used_this_month ?? 0);
  const limit = Number(data?.posts_monthly_limit ?? 20);
  const remaining = Number(data?.posts_remaining ?? Math.max(0, limit - used));
  return {
    posts_used_this_month: used,
    posts_monthly_limit: limit,
    posts_remaining: remaining,
    resets_at: typeof data?.resets_at === 'string' ? data.resets_at : '',
  };
}

/** Erro com status HTTP e dados da resposta (409, 422, 403, etc.) */
export class TriggerWebhookError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'TriggerWebhookError';
  }
}

/**
 * Dispara o webhook n8n de criação de post (automação).
 * Só aceita UM tema por vez. 409 = já há tema em processamento; 403 = limite mensal; 422 = já disparado ou mais de um id.
 * Requer auth e permissão manage-blog.
 */
export async function triggerCreatePostWebhook(themeIdOrIds?: number | number[]): Promise<{ success: boolean; body?: string | null }> {
  let body: { theme_id?: number; theme_ids?: number[] } | undefined;
  if (Array.isArray(themeIdOrIds) && themeIdOrIds.length > 0) {
    body = { theme_ids: themeIdOrIds };
  } else if (typeof themeIdOrIds === 'number') {
    body = { theme_id: themeIdOrIds };
  }
  const res = await fetch(`${apiBaseUrl}/api/blog/trigger-create-post-webhook`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const raw = await res.json().catch(() => ({})) as Record<string, unknown>;
  const data = (raw?.data ?? raw) as Record<string, unknown> | undefined;
  if (!res.ok) {
    const msg = (raw?.message ?? data?.errors) as string | undefined;
    const errText = typeof msg === 'string' ? msg : 'Erro ao disparar webhook.';
    const bodyText = (data?.body ?? (raw?.data as { body?: string })?.body) as string | undefined;
    const fullMsg = bodyText && String(bodyText).trim() ? `${errText}\n\nResposta do webhook:\n${bodyText.trim()}` : errText;
    throw new TriggerWebhookError(fullMsg, res.status, data as Record<string, unknown>);
  }
  const success = data?.success === true;
  return { success, body: (data?.body as string | null) ?? null };
}

/** Tema guardado para automação */
export type BlogTheme = {
  id: number;
  url: string;
  title: string | null;
  blog_category_id?: number | null;
  blog_category_ids?: number[] | null;
  category_name?: string | null;
  category_names?: string[] | null;
  content: string | null;
  topics?: string[];
  created_at: string;
  dispatched_at?: string | null;
  dispatched?: boolean;
  dispatch_status?: 'processing' | 'completed' | 'failed' | null;
  dispatch_message?: string | null;
  dispatch_payload?: Record<string, unknown> | null;
  dispatch_completed_at?: string | null;
  approved_at?: string | null;
  approved?: boolean;
  /** Callback n8n devolve no dispatch_payload; usado em Finalizados para abrir post */
  blog_post_id?: number | null;
  blog_post_title?: string | null;
  blog_post_slug?: string | null;
  blog_post_status?: string | null;
};

export type ThemeScope = 'queue' | 'in_progress' | 'finalizados' | 'falhas' | 'dispatch_done';

/** Lista temas. Use scope para filtrar no backend (queue, in_progress, finalizados, falhas). */
export async function listThemes(scope?: ThemeScope): Promise<BlogTheme[]> {
  const url = new URL(`${apiBaseUrl}/api/blog/themes`);
  if (scope) url.searchParams.set('scope', scope);
  url.searchParams.set('per_page', '200'); // evita paginação truncar lista (Fila precisa ver todos)
  const res = await fetch(url.toString(), { headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as Record<string, unknown> | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar temas.');
  const arr = data?.blog_themes;
  if (Array.isArray(arr)) return arr as BlogTheme[];
  // Laravel paginator: blog_themes.data ou data direto
  const paginated = arr as { data?: BlogTheme[] } | undefined;
  if (Array.isArray(paginated?.data)) return paginated.data;
  return [];
}

export async function createTheme(payload: { url: string; title?: string | null; blog_category_id?: number | null; blog_category_ids?: number[] | null; content?: string | null; topics?: string[] }): Promise<BlogTheme> {
  const res = await fetch(`${apiBaseUrl}/api/blog/themes`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { blog_theme?: BlogTheme } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao guardar tema.');
  if (!data?.blog_theme) throw new Error('Resposta inválida.');
  return data.blog_theme;
}

export async function deleteTheme(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/blog/themes/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao eliminar tema.');
  }
}

export async function approveTheme(id: number): Promise<BlogTheme> {
  const res = await fetch(`${apiBaseUrl}/api/blog/themes/${id}/approve`, { method: 'POST', headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { blog_theme?: BlogTheme } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao aprovar tema.');
  if (!data?.blog_theme) throw new Error('Resposta inválida.');
  return data.blog_theme;
}

export async function unapproveTheme(id: number): Promise<BlogTheme> {
  const res = await fetch(`${apiBaseUrl}/api/blog/themes/${id}/unapprove`, { method: 'POST', headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { blog_theme?: BlogTheme } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao desaprovar tema.');
  if (!data?.blog_theme) throw new Error('Resposta inválida.');
  return data.blog_theme;
}

/** URL fixa cadastrada para pesquisa de tema (só para clicar e buscar tema) */
export type ThemeSourceUrl = {
  id: number;
  url: string;
  label: string | null;
  order: number;
  created_at: string;
};

export async function listSourceUrls(): Promise<ThemeSourceUrl[]> {
  const res = await fetch(`${apiBaseUrl}/api/blog/source-urls`, { headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { theme_source_urls?: ThemeSourceUrl[] } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar URLs.');
  return Array.isArray(data?.theme_source_urls) ? data.theme_source_urls : [];
}

export async function createSourceUrl(payload: { url: string; label?: string | null }): Promise<ThemeSourceUrl> {
  const res = await fetch(`${apiBaseUrl}/api/blog/source-urls`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { theme_source_url?: ThemeSourceUrl } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao cadastrar URL.');
  if (!data?.theme_source_url) throw new Error('Resposta inválida.');
  return data.theme_source_url;
}

export async function updateSourceUrl(id: number, payload: { url?: string; label?: string | null }): Promise<ThemeSourceUrl> {
  const res = await fetch(`${apiBaseUrl}/api/blog/source-urls/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as { theme_source_url?: ThemeSourceUrl } | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao atualizar URL.');
  if (!data?.theme_source_url) throw new Error('Resposta inválida.');
  return data.theme_source_url;
}

export async function deleteSourceUrl(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/blog/source-urls/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao remover URL.');
  }
}

/** Resposta do config Tavily (automação). */
export type TavilyConfig = { tavily_configured: boolean };

/**
 * Verifica se o Tavily está configurado (sem expor a chave). Requer auth e manage-blog.
 */
export async function getTavilyConfig(): Promise<TavilyConfig> {
  const res = await fetch(`${apiBaseUrl}/api/blog/tavily/config`, { headers: getAuthHeaders() });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as TavilyConfig | undefined;
  if (!res.ok) throw new Error((raw as { message?: string })?.message ?? 'Erro ao carregar config.');
  return { tavily_configured: Boolean(data?.tavily_configured) };
}

/** Um resultado do crawl Tavily (uma página). raw_content pode ser null. */
export type TavilyCrawlResult = { url: string; raw_content?: string | null; favicon?: string | null };

/** Resposta do crawl Tavily: base_url + results[]. Nunca mais de uma URL por pedido; fila no frontend. */
export type TavilyCrawlResponse = { success: boolean; url: string; results: TavilyCrawlResult[] };

/**
 * Pesquisa de tema: envia uma única URL ao Tavily (crawl). A instrução "últimos 3 posts, url e tema" é fixa no backend.
 */
export async function tavilyCrawl(url: string): Promise<TavilyCrawlResponse> {
  const res = await fetch(`${apiBaseUrl}/api/blog/tavily/crawl`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const raw = await res.json().catch(() => ({}));
  const data = (raw?.data ?? raw) as TavilyCrawlResponse | undefined;
  if (!res.ok) {
    const msg = (raw as { message?: string })?.message ?? (raw as { errors?: string })?.errors ?? 'Erro ao pesquisar tema.';
    throw new Error(typeof msg === 'string' ? msg : 'Erro ao pesquisar tema.');
  }
  return {
    success: Boolean(data?.success),
    url: (data?.url as string) ?? url,
    results: Array.isArray(data?.results) ? data.results : [],
  };
}
