import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import type { ProductCategory } from '../../utils/productsApi';
import { deleteProductCategory } from '../../utils/productsApi';

type Props = { categorias: ProductCategory[]; onRefresh: () => void; loading?: boolean };

const CategoryList: React.FC<Props> = ({ categorias, onRefresh, loading }) => {
  const [query, setQuery] = useState('');

  const filtered = categorias.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDelete = async (c: ProductCategory) => {
    if (!window.confirm(`Excluir categoria "${c.name}"?`)) return;
    try {
      await deleteProductCategory(c.id);
      onRefresh();
    } catch (e) {
      alert((e as Error).message ?? 'Erro ao excluir.');
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">Categorias</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Cadastro de categorias</p>
        </div>
        <Link
          to="/admin/products/categories/new"
          className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={16} /> Nova categoria
        </Link>
      </div>

      <div className="p-6 md:p-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Buscar categorias..."
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhuma categoria encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome</th>
                  <th className="text-right pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="py-4 px-4 text-sm font-medium text-green-950">{c.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/categories/${c.id}`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Visualizar"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/products/categories/${c.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(c)}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                          aria-label="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;
