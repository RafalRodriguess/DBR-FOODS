import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import 'quill/dist/quill.snow.css';
import {
  pluckCategories,
  createPost,
  updatePost,
  readPost,
  uploadBlogImage,
  type CreatePostBody,
} from '../../utils/blogApi';
import { apiBaseUrl } from '../../utils/api';
import AlertMessage from './components/AlertMessage';

const BlogEditor: React.FC<{
  value: string;
  onChange: (v: string) => void;
  modules: Record<string, unknown>;
  formats: string[];
  placeholder?: string;
}> = (props) => {
  const [Editor, setEditor] = useState<React.ComponentType<any> | null>(null);
  useEffect(() => {
    import('react-quill-new').then((m) => setEditor(() => m.default));
  }, []);
  if (!Editor) return <div className="min-h-[280px] rounded-xl bg-gray-50 border border-gray-200 animate-pulse flex items-center justify-center text-gray-400 text-sm">Carregando editor...</div>;
  return <Editor theme="snow" {...props} />;
};

const BlogArticleForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(mode === 'edit' && !!id);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [form, setForm] = useState<CreatePostBody & { slug?: string }>({
    blog_category_id: 0,
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author_name: '',
    author_role: '',
    author_bio: '',
    author_image: '',
    status: 'draft',
    is_featured: false,
    read_time_minutes: 5,
    published_at: '',
  });

  useEffect(() => {
    pluckCategories()
      .then((list) => {
        setCategories(list);
        if (mode === 'create' && list.length > 0) {
          setForm((p) => (p.blog_category_id === 0 ? { ...p, blog_category_id: list[0].id } : p));
        }
      })
      .catch(() => setCategories([]));
  }, [mode]);

  useEffect(() => {
    if (mode === 'edit' && id) {
      setError('');
      setLoadingPost(true);
      readPost(Number(id))
        .then((p) => {
          if (p) {
            setForm({
              blog_category_id: p.blog_category_id,
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt ?? '',
              content: p.content ?? '',
              featured_image: p.featured_image ?? '',
              author_name: p.author_name ?? '',
              author_role: p.author_role ?? '',
              author_bio: p.author_bio ?? '',
              author_image: p.author_image ?? '',
              status: p.status,
              is_featured: p.is_featured ?? false,
              read_time_minutes: p.read_time_minutes ?? 5,
              published_at: p.published_at ? String(p.published_at).slice(0, 16) : '',
            });
          } else {
            setError('Artigo não encontrado.');
          }
        })
        .catch(() => setError('Erro ao carregar artigo.'))
        .finally(() => setLoadingPost(false));
    }
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (categories.length === 0) {
      alert('Cadastre pelo menos uma categoria do blog antes de criar artigos.');
      return;
    }
    if (!form.blog_category_id) {
      setForm((p) => ({ ...p, blog_category_id: categories[0].id }));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: CreatePostBody = {
        blog_category_id: form.blog_category_id,
        title: form.title.trim(),
        slug: form.slug?.trim() || undefined,
        excerpt: form.excerpt?.trim() || undefined,
        content: form.content || undefined,
        featured_image: form.featured_image?.trim() || undefined,
        author_name: form.author_name?.trim() || undefined,
        author_role: form.author_role?.trim() || undefined,
        author_bio: form.author_bio?.trim() || undefined,
        author_image: form.author_image?.trim() || undefined,
        status: form.status,
        is_featured: form.is_featured,
        read_time_minutes: form.read_time_minutes,
        published_at: form.published_at?.trim() || undefined,
      };
      if (mode === 'create') {
        await createPost(payload);
        navigate('/admin/blog', { state: { success: 'Artigo criado com sucesso.' } });
      } else if (id) {
        await updatePost(Number(id), payload);
        navigate('/admin/blog', { state: { success: 'Artigo atualizado com sucesso.' } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'align',
    'link', 'image',
    'blockquote', 'code-block',
  ];

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <Link to="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">
          {mode === 'create' ? 'Novo artigo' : 'Editar artigo'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl space-y-8">
        <div className="space-y-8">
        {error && (
          <AlertMessage type="error" message={error} onDismiss={() => setError('')} />
        )}
        {loadingPost && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 py-8 text-center text-gray-500 text-sm font-medium">
            A carregar artigo...
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Título *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-lg font-bold"
                placeholder="Título do artigo"
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Resumo</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
                placeholder="Breve descrição ou resumo do artigo"
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Conteúdo do artigo</label>
              <div className="rounded-xl overflow-hidden border border-gray-200 [&_.ql-toolbar]:bg-gray-50 [&_.ql-container]:min-h-[280px] [&_.ql-editor]:min-h-[260px]">
                <BlogEditor
                  value={form.content}
                  onChange={(v) => setForm((p) => ({ ...p, content: v }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Escreva o conteúdo do artigo..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Imagem de destaque</label>
              <p className="text-xs text-gray-500 mb-2">Envie uma imagem (JPEG, PNG, GIF ou WebP, até 5 MB). Será guardada no servidor.</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                disabled={loading || uploadingImage}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-950 file:text-white file:font-bold file:text-xs"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (!file) return;
                  setImageError('');
                  setUploadingImage(true);
                  try {
                    const { url } = await uploadBlogImage(file);
                    setForm((p) => ({ ...p, featured_image: url }));
                  } catch (err) {
                    setImageError(err instanceof Error ? err.message : 'Erro ao enviar imagem.');
                  } finally {
                    setUploadingImage(false);
                  }
                }}
              />
              {uploadingImage && <p className="mt-1 text-xs text-gray-500">A enviar imagem...</p>}
              {imageError && <p className="mt-1 text-xs text-red-600 font-medium">{imageError}</p>}
              {form.featured_image && (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                  <img
                    src={form.featured_image.startsWith('http') ? form.featured_image : `${apiBaseUrl}${form.featured_image}`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, featured_image: '' }))}
                    disabled={loading || uploadingImage}
                    className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Categoria *</label>
              <select
                value={form.blog_category_id}
                onChange={(e) => setForm((p) => ({ ...p, blog_category_id: Number(e.target.value) }))}
                disabled={loading}
                required
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              >
                <option value={0}>Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))}
                  disabled={loading}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-bold text-green-950">Destaque (featured)</span>
              </label>
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tempo de leitura (min)</label>
              <input
                type="number"
                min={1}
                max={999}
                value={form.read_time_minutes}
                onChange={(e) => setForm((p) => ({ ...p, read_time_minutes: Number(e.target.value) || 5 }))}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Data de publicação</label>
              <input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Autor (nome)</label>
              <input
                type="text"
                value={form.author_name}
                onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
                placeholder="Ex: Maria Silva"
              />
            </div>

            <div>
              <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Autor (cargo)</label>
              <input
                type="text"
                value={form.author_role}
                onChange={(e) => setForm((p) => ({ ...p, author_role: e.target.value }))}
                disabled={loading}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
                placeholder="Ex: Head of Operations"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link to="/admin/blog" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading || loadingPost || form.blog_category_id === 0}
            className="px-8 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm uppercase tracking-widest transition-colors disabled:opacity-70"
          >
            {loading ? 'Salvando...' : form.status === 'published' ? 'Publicar' : 'Salvar'} artigo
          </button>
        </div>
        </div>
      </form>
    </section>
  );
};

export default BlogArticleForm;
