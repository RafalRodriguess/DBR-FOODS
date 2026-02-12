import React from 'react';
import { Edit2, Eye, Trash2 } from 'lucide-react';

export type ColumnDef<T> = {
  key: keyof T;
  label: string;
};

type DataTableProps<T extends { id: number }> = {
  columns: ColumnDef<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  emptyText?: string;
};

const DataTable = <T extends { id: number }>({
  columns,
  rows,
  onEdit,
  onDelete,
  onView,
  emptyText = 'Nenhum registro encontrado.',
}: DataTableProps<T>) => {
  if (rows.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {col.label}
              </th>
            ))}
            <th className="text-right pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={String(col.key)} className="py-4 px-4 text-sm font-medium text-green-950">
                  {String(row[col.key] ?? '-')}
                </td>
              ))}
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  {onView && (
                    <button onClick={() => onView(row)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors" aria-label="Visualizar">
                      <Eye size={14} className="mx-auto" />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors" aria-label="Editar">
                      <Edit2 size={14} className="mx-auto" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 transition-colors" aria-label="Excluir">
                      <Trash2 size={14} className="mx-auto" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
