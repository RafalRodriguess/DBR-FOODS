import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Trash2 } from 'lucide-react';
import type { BlogPost } from '../../utils/blogApi';
import { deletePost } from '../../utils/blogApi';
import AlertMessage from './components/AlertMessage';

type Props = {
  articles: BlogPost[];
  onRefresh: () => void;
  loading?: boolean;
  loadError?: string | null;
  onDismissError?: () => void;
  title?: string;
  subtitle?: string;
  showNewButton?: boolean;
};

const BlogArticleList: React.FC<Props> = ({
  articles,
  onRefresh,
  loading = false,
  loadError = null,
  onDismissError,
  title = 'Artigos do Blog',
  subtitle = 'Gestão de artigos',
  showNewButton = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const successMessage = (location.state as { success?: string } | null)?.success ?? null;

  const dismissSuccess = () => navigate(location.pathname, { replace: true, state: {} });
  const dismissError = () => setError(null);
  const displayError = error ?? loadError;
  const dismissLoadError = () => { setError(null); onDismissError?.(); };

  const filtered = articles.filter(
    (a) =>
      (a.title ?? '').toLowerCase().includes(query.trim().toLowerCase()) ||
      (a.excerpt ?? '').toLowerCase().includes(query.trim().toLowerCase()) ||
      (a.category ?? '').toLowerCase().includes(query.trim().toLowerCase()) ||
      (a.status ?? '').toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleDelete = async (a: BlogPost) => {
    if (!window.confirm(`Excluir o artigo "${a.title}"?`)) return;
    setError(null);
    setDeleting(a.id);
    try {
      await deletePost(a.id);
      onRefresh();
    } catch (err) {
      setDeleting(null);
      setError(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
  };

  const statusLabel = (s: string) => (s === 'published' ? 'Publicado' : 'Rascunho');

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {successMessage && (
        <div className="mx-6 mt-6 md:mx-8 md:mt-8">
          <AlertMessage type="success" message={successMessage} onDismiss={dismissSuccess} autoDismissMs={5000} />
        </div>
      )}
      {displayError && (
        <div className="mx-6 mt-6 md:mx-8 md:mt-8">
          <AlertMessage type="error" message={displayError} onDismiss={loadError ? dismissLoadError : dismissError} />
        </div>
      )}
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">{title}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
        {showNewButton && (
          <Link
            to="/admin/blog/new"
            className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
          >
            <Plus size={16} /> Novo artigo
          </Link>
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Buscar artigos..."
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
            disabled={loading}
          />
        </div>

        {loading ? (
          <div className="border border-gray-100 rounded-2xl py-16 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">A carregar artigos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhum artigo encontrado.</p>
            <Link to="/admin/blog/new" className="text-gold font-bold mt-2 inline-block">Criar primeiro artigo</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Artigo</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="text-right pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        {a.featured_image ? (
                          <img src={a.featured_image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">—</div>
                        )}
                        <div>
                          <p className="font-medium text-green-950">{a.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{a.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{a.category ?? '-'}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {statusLabel(a.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/blog/${a.id}`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Visualizar"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/blog/${a.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(a)}
                          disabled={deleting === a.id}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center disabled:opacity-50"
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

export default BlogArticleList;
