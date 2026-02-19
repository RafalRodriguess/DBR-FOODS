import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createProductCategory, updateProductCategory, readProductCategory } from '../../utils/productsApi';

const CategoryForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      readProductCategory(Number(id)).then((cat) => {
        if (cat) setNome(cat.name);
      }).catch(() => {});
    }
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setLoading(true);
    try {
      if (mode === 'create') {
        await createProductCategory({ name: nome.trim() });
        navigate('/admin/products/categories');
      } else if (id) {
        await updateProductCategory(Number(id), { name: nome.trim() });
        navigate('/admin/products/categories');
      }
    } catch (err) {
      alert((err as Error).message ?? 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <Link
          to="/admin/products/categories"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">
          {mode === 'create' ? 'Nova categoria' : 'Editar categoria'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: Seeds & Grains"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            to="/admin/products/categories"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CategoryForm;
