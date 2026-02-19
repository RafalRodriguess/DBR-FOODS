
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useLang } from '../App';
import { getPostBySlugPublic, type BlogPost as BlogPostType } from '../utils/blogApi';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=1200&q=80';

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const postLabels = {
    share: lang === 'pt' ? 'Compartilhar análise' : lang === 'es' ? 'Compartir análisis' : 'Share Analysis',
    needData: lang === 'pt' ? 'Precisa de dados técnicos?' : lang === 'es' ? '¿Necesitas datos técnicos?' : 'Need technical data?',
    requestSpecs: lang === 'pt' ? 'Solicitar especificações' : lang === 'es' ? 'Solicitar especificaciones' : 'Request Specs',
  };

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const p = await getPostBySlugPublic(slug);
        setPost(p);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / (totalHeight || 1)) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gold font-bold uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-green-950">Post not found</p>
        <Link to="/blog" className="text-gold font-bold hover:underline">
          {t.common?.back || 'Back'} to Blog
        </Link>
      </div>
    );
  }

  const img = post.featured_image || PLACEHOLDER_IMG;

  const shareLinks = [
    { name: 'LinkedIn', icon: Linkedin, getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}` },
    { name: 'Facebook', icon: Facebook, getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { name: 'Twitter', icon: Twitter, getUrl: () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title ?? '')}` },
  ];

  const openShare = (getUrl: () => string) => {
    window.open(getUrl(), '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-100">
        <div className="h-full bg-gold transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Hero Header */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={img} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/40 to-transparent" />
        </div>

        <div className="container mx-auto pl-0 pr-6 lg:pr-12 relative z-10 pb-12 md:pb-20">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-[9px] font-black tracking-widest uppercase mb-8 md:mb-12">
            <ArrowLeft size={16} /> {t.common?.back || 'Back'}
          </Link>
          <div className="max-w-4xl">
            <span className="px-3 py-1 bg-gold text-white text-[9px] font-black tracking-widest uppercase rounded-full mb-6 md:mb-8 inline-block">
              {post.category ?? '-'}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 md:mb-8">
              {post.title}
            </h1>
            <p className="text-base md:text-2xl text-white/80 font-medium italic max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 -mt-8 md:-mt-10 relative z-20">
          <article className="lg:col-span-8 min-w-0 overflow-hidden bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-10 md:p-20 shadow-2xl">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-10 md:mb-16 pb-8 border-b border-gray-100 text-[9px] font-black tracking-widest text-gray-400 uppercase">
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Calendar size={14} className="text-gold" /> {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Clock size={14} className="text-gold" /> {post.read_time_minutes ?? 5} min read
              </span>
            </div>

            <div
              className="prose prose-lg md:prose-xl max-w-none min-w-0 break-words overflow-x-hidden text-gray-600 leading-relaxed font-medium 
                prose-headings:text-green-950 prose-headings:font-black prose-headings:tracking-tighter
                prose-h3:text-2xl md:prose-h3:text-3xl prose-p:mb-6 md:prose-p:mb-8 prose-h3:mt-10 md:prose-h3:mt-12 prose-h3:mb-4 md:prose-h3:mb-6
                prose-img:max-w-full prose-img:h-auto"
              dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
            />
          </article>

          {/* Sidebar / Social Share */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-10 md:space-y-12">
              <div className="space-y-6">
                <h5 className="text-[10px] font-black tracking-[0.3em] text-green-950 uppercase border-b border-gray-100 pb-4">{postLabels.share}</h5>
                <div className="flex flex-row lg:flex-col flex-wrap gap-4">
                  {shareLinks.map((social) => (
                    <button
                      key={social.name}
                      type="button"
                      onClick={() => openShare(social.getUrl)}
                      className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 text-green-950 font-black text-[10px] tracking-widest transition-all hover:bg-green-950 hover:text-white group whitespace-nowrap"
                    >
                      <social.icon size={16} className="text-gold group-hover:text-white transition-colors" />
                      <span className="hidden sm:inline">{social.name.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-10 bg-green-950 rounded-[2rem] md:rounded-[3rem] text-white shadow-xl">
                <h5 className="text-xl md:text-2xl font-bold tracking-tight mb-6">{postLabels.needData}</h5>
                <Link
                  to="/contact"
                  className="inline-block w-full text-center bg-gold text-white px-6 md:px-8 py-4 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all"
                >
                  {postLabels.requestSpecs}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
