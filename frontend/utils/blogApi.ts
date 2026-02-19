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
