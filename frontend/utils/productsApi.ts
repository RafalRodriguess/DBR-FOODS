/**
 * API de Produtos, Categorias, Benefícios e Ingredientes — CRUD com auth Sanctum.
 */
import { apiBaseUrl, getAuthHeaders } from './api';

export type ProductCategory = { id: number; name: string; slug?: string; order?: number };
export type Benefit = { id: number; name: string; slug?: string; order?: number };
export type Ingredient = { id: number; name: string; slug?: string; order?: number };

export type Product = {
  id: number;
  name: string;
  slug?: string;
  code?: string;
  product_category_id?: number | null;
  origin?: string;
  purity?: string;
  type?: string;
  ingredients_text?: string;
  applications?: string;
  sizes?: string[];
  has_free_sample?: boolean;
  stock?: number;
  status?: string;
  image_url?: string;
  description?: string;
  product_category?: ProductCategory | null;
  benefits?: Benefit[];
  ingredients?: Ingredient[];
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

// ——— Product Categories ———
export async function listProductCategories(): Promise<ProductCategory[]> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories?per_page=100`, { headers: auth() });
  return handleRes(res, (d) => paginatedData(d, 'product_categories'));
}

export async function pluckProductCategories(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories/plucks`, { headers: auth() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const plucks = payload?.plucks as { id: number; name: string }[] | undefined;
  return Array.isArray(plucks) ? plucks : [];
}

export async function createProductCategory(body: { name: string; slug?: string; order?: number }): Promise<ProductCategory> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories/create`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'product_category'));
  if (!item) throw new Error('Resposta inválida ao criar categoria.');
  return item;
}

export async function readProductCategory(id: number): Promise<ProductCategory | null> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories/${id}`, { headers: auth() });
  return handleRes(res, (d) => singlePayload(d, 'product_category'));
}

export async function updateProductCategory(id: number, body: Partial<{ name: string; slug?: string; order?: number }>): Promise<ProductCategory> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify(body),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'product_category'));
  if (!item) throw new Error('Resposta inválida ao atualizar categoria.');
  return item;
}

export async function deleteProductCategory(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/product-categories/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

// ——— Benefits ———
export async function listBenefits(): Promise<Benefit[]> {
  const res = await fetch(`${apiBaseUrl}/api/benefits?per_page=100`, { headers: auth() });
  return handleRes(res, (d) => paginatedData(d, 'benefits'));
}

export async function pluckBenefits(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${apiBaseUrl}/api/benefits/plucks`, { headers: auth() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const plucks = payload?.plucks as { id: number; name: string }[] | undefined;
  return Array.isArray(plucks) ? plucks : [];
}

export async function createBenefit(body: { name: string; slug?: string; order?: number }): Promise<Benefit> {
  const res = await fetch(`${apiBaseUrl}/api/benefits/create`, { method: 'POST', headers: auth(), body: JSON.stringify(body) });
  const item = await handleRes(res, (d) => singlePayload(d, 'benefit'));
  if (!item) throw new Error('Resposta inválida ao criar benefício.');
  return item;
}

export async function updateBenefit(id: number, body: Partial<{ name: string; slug?: string; order?: number }>): Promise<Benefit> {
  const res = await fetch(`${apiBaseUrl}/api/benefits/${id}`, { method: 'PUT', headers: auth(), body: JSON.stringify(body) });
  const item = await handleRes(res, (d) => singlePayload(d, 'benefit'));
  if (!item) throw new Error('Resposta inválida ao atualizar benefício.');
  return item;
}

export async function deleteBenefit(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/benefits/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

// ——— Ingredients ———
export async function listIngredients(): Promise<Ingredient[]> {
  const res = await fetch(`${apiBaseUrl}/api/ingredients?per_page=100`, { headers: auth() });
  return handleRes(res, (d) => paginatedData(d, 'ingredients'));
}

export async function pluckIngredients(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${apiBaseUrl}/api/ingredients/plucks`, { headers: auth() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const plucks = payload?.plucks as { id: number; name: string }[] | undefined;
  return Array.isArray(plucks) ? plucks : [];
}

export async function createIngredient(body: { name: string; slug?: string; order?: number }): Promise<Ingredient> {
  const res = await fetch(`${apiBaseUrl}/api/ingredients/create`, { method: 'POST', headers: auth(), body: JSON.stringify(body) });
  const item = await handleRes(res, (d) => singlePayload(d, 'ingredient'));
  if (!item) throw new Error('Resposta inválida ao criar ingrediente.');
  return item;
}

export async function updateIngredient(id: number, body: Partial<{ name: string; slug?: string; order?: number }>): Promise<Ingredient> {
  const res = await fetch(`${apiBaseUrl}/api/ingredients/${id}`, { method: 'PUT', headers: auth(), body: JSON.stringify(body) });
  const item = await handleRes(res, (d) => singlePayload(d, 'ingredient'));
  if (!item) throw new Error('Resposta inválida ao atualizar ingrediente.');
  return item;
}

export async function deleteIngredient(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/ingredients/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

// ——— Products ———
export async function listProducts(params?: { search?: string; product_category_id?: number; status?: string; per_page?: number }): Promise<{ data: Product[] }> {
  const url = new URL(`${apiBaseUrl}/api/products`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.product_category_id) url.searchParams.set('product_category_id', String(params.product_category_id));
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
  const res = await fetch(url.toString(), { headers: auth() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const products = payload?.products as { data?: Product[] } | Product[] | undefined;
  const list = Array.isArray(products) ? products : (products as { data?: Product[] })?.data ?? [];
  return { data: list };
}

export async function readProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${apiBaseUrl}/api/products/${id}`, { headers: auth() });
  return handleRes(res, (d) => singlePayload(d, 'product'));
}

export async function createProduct(body: Partial<Product> & { name: string; benefit_ids?: number[]; ingredient_ids?: number[] }): Promise<Product> {
  const res = await fetch(`${apiBaseUrl}/api/products/create`, {
    method: 'POST',
    headers: auth(),
    body: JSON.stringify({
      ...body,
      product_category_id: body.product_category_id ?? null,
      sizes: body.sizes ?? [],
      benefit_ids: body.benefit_ids ?? [],
      ingredient_ids: body.ingredient_ids ?? [],
    }),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'product'));
  if (!item) throw new Error('Resposta inválida ao criar produto.');
  return item;
}

export async function updateProduct(id: number, body: Partial<Product> & { benefit_ids?: number[]; ingredient_ids?: number[] }): Promise<Product> {
  const res = await fetch(`${apiBaseUrl}/api/products/${id}`, {
    method: 'PUT',
    headers: auth(),
    body: JSON.stringify({
      ...body,
      product_category_id: body.product_category_id ?? null,
      sizes: body.sizes ?? [],
      benefit_ids: body.benefit_ids,
      ingredient_ids: body.ingredient_ids,
    }),
  });
  const item = await handleRes(res, (d) => singlePayload(d, 'product'));
  if (!item) throw new Error('Resposta inválida ao atualizar produto.');
  return item;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${apiBaseUrl}/api/products/${id}`, { method: 'DELETE', headers: auth() });
  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    throw new Error((raw as { message?: string })?.message ?? 'Erro ao excluir.');
  }
}

// ——— Produtos públicos (site, sem auth) ———

export type PublicProductDisplay = {
  id: string | number;
  slug: string;
  name: string;
  code: string;
  category: string;
  benefit: string;
  type: string;
  purity: string;
  origin: string;
  img: string;
  description: string;
  ingredients: string;
  applications: string;
  sizes: string[];
  hasFreeSample: boolean;
};

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=500&q=80';

export function mapApiProductToDisplay(p: Product): PublicProductDisplay {
  let img = p.image_url ?? PLACEHOLDER_IMG;
  if (img && img.startsWith('/') && !img.startsWith('//')) {
    img = `${apiBaseUrl}${img}`;
  }
  return {
    id: p.id,
    slug: p.slug ?? `product-${p.id}`,
    name: p.name,
    code: p.code ?? '',
    category: p.product_category?.name ?? '',
    benefit: (p.benefits ?? []).map((b) => b.name).join(', ') || '-',
    type: p.type ?? '',
    purity: p.purity ?? '',
    origin: p.origin ?? '',
    img: img || PLACEHOLDER_IMG,
    description: p.description ?? '',
    ingredients: p.ingredients_text ?? '',
    applications: p.applications ?? '',
    sizes: p.sizes ?? [],
    hasFreeSample: p.has_free_sample ?? false,
  };
}

export async function listPublicProducts(params?: { search?: string; product_category_id?: number; per_page?: number }): Promise<PublicProductDisplay[]> {
  const url = new URL(`${apiBaseUrl}/api/products/public`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.product_category_id) url.searchParams.set('product_category_id', String(params.product_category_id));
  if (params?.per_page) url.searchParams.set('per_page', String(params.per_page));
  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Erro ao carregar produtos.');
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const products = payload?.products as { data?: Product[] } | Product[] | undefined;
  const list = Array.isArray(products) ? products : (products as { data?: Product[] })?.data ?? [];
  return list.map(mapApiProductToDisplay);
}

export async function getProductBySlugPublic(slug: string): Promise<PublicProductDisplay | null> {
  const res = await fetch(`${apiBaseUrl}/api/products/public/slug/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error((data as { message?: string })?.message ?? 'Erro ao carregar produto.');
  }
  const payload = (data?.data ?? data) as Record<string, unknown>;
  const p = payload?.product as Product | undefined;
  if (!p) return null;
  return mapApiProductToDisplay(p);
}
