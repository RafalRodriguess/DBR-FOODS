import type { Categoria, Produto, BlogCategoria, BlogItem } from '../pages/admin/mock/data';

const CAT_KEY = 'dbr-admin-categorias';
const PROD_KEY = 'dbr-admin-produtos';
const BLOG_CAT_KEY = 'dbr-admin-blog-categorias';
const BLOG_KEY = 'dbr-admin-blog';

export const getCategorias = (): Categoria[] => {
  try {
    const raw = localStorage.getItem(CAT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveCategoria = (cat: Omit<Categoria, 'id'>): Categoria => {
  const list = getCategorias();
  const maxId = list.length ? Math.max(...list.map((c) => c.id)) : 0;
  const novo: Categoria = { ...cat, id: maxId + 1 };
  list.push(novo);
  localStorage.setItem(CAT_KEY, JSON.stringify(list));
  return novo;
};

export const updateCategoria = (cat: Categoria): void => {
  const list = getCategorias();
  const idx = list.findIndex((c) => c.id === cat.id);
  if (idx >= 0) {
    list[idx] = cat;
    localStorage.setItem(CAT_KEY, JSON.stringify(list));
  }
};

export const deleteCategoria = (id: number): void => {
  const list = getCategorias().filter((c) => c.id !== id);
  localStorage.setItem(CAT_KEY, JSON.stringify(list));
};

export const seedCategoriasIfEmpty = (initial: Categoria[]): void => {
  if (getCategorias().length === 0 && initial.length > 0) {
    localStorage.setItem(CAT_KEY, JSON.stringify(initial));
  }
};

export const getProdutos = (): Produto[] => {
  try {
    const raw = localStorage.getItem(PROD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveProduto = (p: Omit<Produto, 'id'>): Produto => {
  const list = getProdutos();
  const maxId = list.length ? Math.max(...list.map((x) => x.id)) : 0;
  const novo: Produto = { ...p, id: maxId + 1 };
  list.push(novo);
  localStorage.setItem(PROD_KEY, JSON.stringify(list));
  return novo;
};

export const updateProduto = (p: Produto): void => {
  const list = getProdutos();
  const idx = list.findIndex((x) => x.id === p.id);
  if (idx >= 0) {
    list[idx] = p;
    localStorage.setItem(PROD_KEY, JSON.stringify(list));
  }
};

export const deleteProduto = (id: number): void => {
  const list = getProdutos().filter((x) => x.id !== id);
  localStorage.setItem(PROD_KEY, JSON.stringify(list));
};

export const seedProdutosIfEmpty = (initial: Produto[]): void => {
  if (getProdutos().length === 0 && initial.length > 0) {
    localStorage.setItem(PROD_KEY, JSON.stringify(initial));
  }
};

export const getBlogCategorias = (): BlogCategoria[] => {
  try {
    const raw = localStorage.getItem(BLOG_CAT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveBlogCategoria = (cat: Omit<BlogCategoria, 'id'>): BlogCategoria => {
  const list = getBlogCategorias();
  const maxId = list.length ? Math.max(...list.map((c) => c.id)) : 0;
  const novo: BlogCategoria = { ...cat, id: maxId + 1 };
  list.push(novo);
  localStorage.setItem(BLOG_CAT_KEY, JSON.stringify(list));
  return novo;
};

export const updateBlogCategoria = (cat: BlogCategoria): void => {
  const list = getBlogCategorias();
  const idx = list.findIndex((c) => c.id === cat.id);
  if (idx >= 0) {
    list[idx] = cat;
    localStorage.setItem(BLOG_CAT_KEY, JSON.stringify(list));
  }
};

export const deleteBlogCategoria = (id: number): void => {
  const list = getBlogCategorias().filter((c) => c.id !== id);
  localStorage.setItem(BLOG_CAT_KEY, JSON.stringify(list));
};

export const seedBlogCategoriasIfEmpty = (initial: BlogCategoria[]): void => {
  if (getBlogCategorias().length === 0 && initial.length > 0) {
    localStorage.setItem(BLOG_CAT_KEY, JSON.stringify(initial));
  }
};

export const getBlog = (): BlogItem[] => {
  try {
    const raw = localStorage.getItem(BLOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveBlogArticle = (a: Omit<BlogItem, 'id'>): BlogItem => {
  const list = getBlog();
  const maxId = list.length ? Math.max(...list.map((x) => x.id)) : 0;
  const novo: BlogItem = { ...a, id: maxId + 1 };
  list.push(novo);
  localStorage.setItem(BLOG_KEY, JSON.stringify(list));
  return novo;
};

export const updateBlogArticle = (a: BlogItem): void => {
  const list = getBlog();
  const idx = list.findIndex((x) => x.id === a.id);
  if (idx >= 0) {
    list[idx] = a;
    localStorage.setItem(BLOG_KEY, JSON.stringify(list));
  }
};

export const deleteBlogArticle = (id: number): void => {
  const list = getBlog().filter((x) => x.id !== id);
  localStorage.setItem(BLOG_KEY, JSON.stringify(list));
};

export const seedBlogIfEmpty = (initial: BlogItem[]): void => {
  if (getBlog().length === 0 && initial.length > 0) {
    localStorage.setItem(BLOG_KEY, JSON.stringify(initial));
  }
};
