/**
 * Constantes e tipos reutilizáveis para paginação nas listas do admin.
 */
export const DEFAULT_PER_PAGE = 15;
export const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100] as const;

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function getFromTo(meta: PaginationMeta): { from: number; to: number } {
  if (meta.total === 0) return { from: 0, to: 0 };
  const from = (meta.current_page - 1) * meta.per_page + 1;
  const to = Math.min(meta.current_page * meta.per_page, meta.total);
  return { from, to };
}
