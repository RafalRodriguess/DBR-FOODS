import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { readPost } from '../../utils/blogApi';
import type { BlogPost } from '../../utils/blogApi';

const BlogArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    readPost(Number(id))
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Carregando...</p>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Artigo não encontrado.</p>
        <Link to="/admin/blog" className="text-gold font-bold mt-4 inline-block">
          Voltar
        </Link>
      </section>
    );
  }

  const statusLabel = article.status === 'published' ? 'Publicado' : 'Rascunho';

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
            <ArrowLeft size={16} /> Voltar
          </Link>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">{article.title}</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            {article.category ?? '-'} • {statusLabel}
          </p>
        </div>
        <Link
          to={`/admin/blog/${article.id}/edit`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm transition-colors w-fit"
        >
          <Edit2 size={16} /> Editar
        </Link>
      </div>

      <div className="p-6 md:p-8 max-w-4xl">
        {article.featured_image && (
          <div className="mb-8 rounded-2xl overflow-hidden aspect-video">
            <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {article.excerpt && (
          <div className="mb-8 p-5 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] font-black text-gold uppercase tracking-widest mb-2">Resumo</p>
            <p className="text-gray-700 font-medium leading-relaxed">{article.excerpt}</p>
          </div>
        )}

        <div>
          <p className="text-[10px] font-black text-gold uppercase tracking-widest mb-4">Conteúdo</p>
          <div
            className="blog-content text-gray-700 leading-relaxed [&_p]:mb-4 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_img]:rounded-xl [&_img]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic"
            dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-gray-400 italic">Sem conteúdo.</p>' }}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogArticleView;
