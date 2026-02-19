import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createCategory, updateCategory, readCategory } from '../../utils/blogApi';

const BlogCategoryForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      readCategory(Number(id))
        .then((cat) => {
          if (cat) setNome(cat.name);
        })
        .catch(() => setError('Erro ao carregar categoria.'));
    }
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (mode === 'create') {
        await createCategory({ name: nome.trim() });
      } else if (id) {
        await updateCategory(Number(id), { name: nome.trim() });
      }
      navigate('/admin/blog/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <Link
          to="/admin/blog/categories"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">
          {mode === 'create' ? 'Nova categoria do blog' : 'Editar categoria do blog'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-xl">
        {error && <p className="mb-4 text-red-600 text-sm font-bold">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: Supply Chain"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            to="/admin/blog/categories"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm uppercase tracking-widest transition-colors disabled:opacity-70"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default BlogCategoryForm;
