import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { readProductCategory } from '../../utils/productsApi';
import type { ProductCategory } from '../../utils/productsApi';

const CategoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cat, setCat] = useState<ProductCategory | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setCat(null);
      return;
    }
    readProductCategory(Number(id))
      .then(setCat)
      .catch(() => setCat(null));
  }, [id]);

  if (cat === undefined) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Carregando...</p>
      </section>
    );
  }
  if (!cat) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Categoria não encontrada.</p>
        <Link to="/admin/products/categories" className="text-gold font-bold mt-4 inline-block">Voltar</Link>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/products/categories"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">{cat.name}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Categoria #{cat.id}</p>
        </div>
        <Link
          to={`/admin/products/categories/${cat.id}/edit`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm transition-colors w-fit"
        >
          <Edit2 size={16} /> Editar
        </Link>
      </div>

      <div className="p-6 md:p-8">
        <div className="space-y-4 max-w-md">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nome</p>
            <p className="text-lg font-bold text-green-950">{cat.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryView;
