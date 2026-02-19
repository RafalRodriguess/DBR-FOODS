import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import type { Product } from '../../utils/productsApi';
import { deleteProduct } from '../../utils/productsApi';
import { apiBaseUrl } from '../../utils/api';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=200&q=80';

function productImageUrl(p: Product): string {
  const url = p.image_url;
  if (!url) return PLACEHOLDER_IMG;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

type Props = { produtos: Product[]; onRefresh: () => void; loading?: boolean };

const ProductList: React.FC<Props> = ({ produtos, onRefresh, loading }) => {
  const [query, setQuery] = useState('');

  const filtered = produtos.filter(
    (p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      (p.code ?? '').toLowerCase().includes(query.trim().toLowerCase()) ||
      (p.product_category?.name ?? '').toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Excluir produto "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id);
      onRefresh();
    } catch (e) {
      alert((e as Error).message ?? 'Erro ao excluir.');
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">Produtos</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Cadastro de produtos</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <div className="p-6 md:p-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Carregando...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Código</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-right pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={productImageUrl(p)}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover bg-gray-100 shrink-0"
                        />
                        <span className="text-sm font-medium text-green-950">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{p.code ?? '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{p.product_category?.name ?? '-'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{p.stock ?? 0}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {p.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Visualizar"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
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

export default ProductList;
