import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../../../utils/pagination';
import { DEFAULT_PER_PAGE, PER_PAGE_OPTIONS, getFromTo } from '../../../utils/pagination';

type ListPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  loading?: boolean;
  /** 'top' = só o seletor "Mostrar X por página" (acima da tabela). 'bottom' = só a navegação de páginas (abaixo da tabela). */
  position: 'top' | 'bottom';
};

const ListPagination: React.FC<ListPaginationProps> = ({
  meta,
  onPageChange,
  onPerPageChange,
  loading = false,
  position,
}) => {
  const { from, to } = getFromTo(meta);
  const hasPrev = meta.current_page > 1;
  const hasNext = meta.current_page < meta.last_page;

  if (position === 'top') {
    return (
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Mostrar
        </span>
        <select
          value={meta.per_page}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          disabled={loading}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-green-950 outline-none focus:ring-2 focus:ring-gold disabled:opacity-70"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          por página
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
      <p className="text-sm font-medium text-gray-600">
        {meta.total === 0 ? (
          'Nenhum registro'
        ) : (
          <>
            <span className="font-bold text-green-950">{from}</span>
            {' – '}
            <span className="font-bold text-green-950">{to}</span>
            {' de '}
            <span className="font-bold text-green-950">{meta.total}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(meta.current_page - 1)}
          disabled={!hasPrev || loading}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-green-950 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-[4rem] text-center text-sm font-bold text-green-950 px-2">
          {meta.current_page} / {meta.last_page || 1}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(meta.current_page + 1)}
          disabled={!hasNext || loading}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-green-950 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center transition-colors"
          aria-label="Próxima página"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ListPagination;
