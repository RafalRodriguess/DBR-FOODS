import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Modal from './Modal';
import DataTable, { ColumnDef } from './DataTable';

export type FieldDef<T> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'textarea';
};

type ManagementPageProps<T extends { id: number }> = {
  title: string;
  entityLabel: string;
  columns: ColumnDef<T>[];
  fields: FieldDef<T>[];
  searchKeys: (keyof T)[];
  rows: T[];
  setRows: React.Dispatch<React.SetStateAction<T[]>>;
  makeEmpty: () => T;
};

const ManagementPage = <T extends { id: number }>({
  title,
  entityLabel,
  columns,
  fields,
  searchKeys,
  rows,
  setRows,
  makeEmpty,
}: ManagementPageProps<T>) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<T>(makeEmpty());

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const openCreate = () => {
    setEditing(null);
    setForm(makeEmpty());
    setOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setForm(row);
    setOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setRows((prev) => prev.map((r) => (r.id === editing.id ? form : r)));
    } else {
      setRows((prev) => [{ ...form, id: Date.now() } as T, ...prev]);
    }
    setOpen(false);
  };

  const handleDelete = (row: T) => {
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">{title}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestão de {entityLabel}</p>
        </div>
        <button onClick={openCreate} className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2">
          <Plus size={16} /> Novo
        </button>
      </div>

      <div className="p-6 md:p-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder={`Buscar ${entityLabel}...`}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
          />
        </div>

        <DataTable columns={columns} rows={filteredRows} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      <Modal
        open={open}
        title={editing ? `Editar ${entityLabel}` : `Novo ${entityLabel}`}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 font-bold text-xs uppercase tracking-widest">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-xs uppercase tracking-widest transition-colors">
              Salvar
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={String(field.key)} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={String(form[field.key] ?? '')}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-gold text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={String(form[field.key] ?? '')}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-gold text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
};

export default ManagementPage;
