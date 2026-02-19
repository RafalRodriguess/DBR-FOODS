import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { readProduct } from '../../utils/productsApi';
import type { Product } from '../../utils/productsApi';

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setProduto(null);
      return;
    }
    readProduct(Number(id))
      .then(setProduto)
      .catch(() => setProduto(null));
  }, [id]);

  if (produto === undefined) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Carregando...</p>
      </section>
    );
  }
  if (!produto) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Produto não encontrado.</p>
        <Link to="/admin/products" className="text-gold font-bold mt-4 inline-block">Voltar</Link>
      </section>
    );
  }

  const statusLabel = produto.status === 'active' ? 'Ativo' : 'Inativo';

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">{produto.name}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {produto.code ?? '-'} • {produto.product_category?.name ?? '-'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-black uppercase ${
              produto.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {statusLabel}
          </span>
          <Link
            to={`/admin/products/${produto.id}/edit`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm transition-colors"
          >
            <Edit2 size={16} /> Editar
          </Link>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Código</p>
            <p className="text-lg font-bold text-green-950">{produto.code ?? '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Categoria</p>
            <p className="text-lg font-bold text-green-950">{produto.product_category?.name ?? '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Origem</p>
            <p className="text-lg font-bold text-green-950">{produto.origin || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Pureza</p>
            <p className="text-lg font-bold text-green-950">{produto.purity || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Estoque</p>
            <p className="text-lg font-bold text-green-950">{produto.stock ?? 0}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Amostra grátis</p>
            <p className="flex items-center gap-2">
              {produto.has_free_sample ? (
                <><CheckCircle size={18} className="text-green-600" /> Liberado</>
              ) : (
                <><XCircle size={18} className="text-gray-400" /> Não liberado</>
              )}
            </p>
          </div>
        </div>

        {(produto.benefits?.length ?? 0) > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Benefícios</p>
            <div className="flex flex-wrap gap-2">
              {produto.benefits!.map((b) => (
                <span key={b.id} className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium text-green-950">
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {(produto.ingredients?.length ?? 0) > 0 && (
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Ingredientes (tags)</p>
            <div className="flex flex-wrap gap-2">
              {produto.ingredients!.map((i) => (
                <span key={i.id} className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium text-green-950">
                  {i.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Ingredientes (texto)</p>
          <p className="bg-gray-50 rounded-xl p-4 text-green-950 leading-relaxed">
            {produto.ingredients_text || '-'}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Aplicações</p>
          <p className="bg-gray-50 rounded-xl p-4 text-green-950 leading-relaxed">
            {produto.applications || '-'}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tamanhos (kg para compra)</p>
          <div className="flex flex-wrap gap-2">
            {(produto.sizes?.length ?? 0) > 0 ? (
              produto.sizes!.map((t, i) => (
                <span key={i} className="px-4 py-2 rounded-xl bg-gray-100 text-sm font-bold text-green-950">
                  {t}
                </span>
              ))
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductView;
