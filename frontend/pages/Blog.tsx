
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';
import { listCategoriesPublic, listPostsPublic, type BlogCategory, type BlogPost } from '../utils/blogApi';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=800&q=80';

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

const Blog: React.FC = () => {
  const { t } = useLang();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [meta, setMeta] = useState<{ current_page: number; last_page: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');

  const loadCategories = async () => {
    try {
      const list = await listCategoriesPublic();
      setCategories(list);
    } catch {
      setCategories([]);
    }
  };

  const loadPosts = async (page = 1, append = false) => {
    const isFirst = page === 1;
    if (isFirst) setLoading(true);
    else setLoadingMore(true);
    try {
      const params: { category_slug?: string; per_page?: number; page?: number } = {
        per_page: 2,
        page,
      };
      if (activeCategory && activeCategory !== 'all') {
        params.category_slug = activeCategory;
      }
      const { blog_posts, meta: m } = await listPostsPublic(params);
      if (append) {
        setPosts((prev) => [...prev, ...blog_posts]);
      } else {
        setPosts(blog_posts);
      }
      setMeta(m);
    } catch {
      if (!append) setPosts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts(1);
  }, [activeCategory]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = posts.find((p) => p.is_featured);
  const showFeatured = (!activeCategory || activeCategory === 'all') && !searchQuery && !!featuredPost;
  const regularPosts = filteredPosts.filter((p) => !p.is_featured || !showFeatured);

  const categoryOptions = [
    { slug: 'all', name: t.blog.categories[0] ?? 'All' },
    ...categories.map((c) => ({ slug: c.slug ?? String(c.id), name: c.name })),
  ];

  const handleLoadMore = () => {
    if (!meta || meta.current_page >= meta.last_page || loadingMore) return;
    loadPosts(meta.current_page + 1, true);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto pl-0 pr-6 lg:pr-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold font-semibold tracking-[0.4em] text-[10px] mb-6 block uppercase">{t.blog.hero.badge}</span>
            <h1 className="text-4xl md:text-6xl font-bold text-green-950 tracking-tight leading-tight mb-12">
              {t.blog.hero.title.split(' ').slice(0, 2).join(' ')} <br /> <span className="italic font-light">{t.blog.hero.title.split(' ').slice(2).join(' ')}</span>
            </h1>

            {/* Search & Categories */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${activeCategory === cat.slug || (cat.slug === 'all' && !activeCategory) ? 'bg-green-950 text-white shadow-xl' : 'bg-white border border-gray-200 text-gray-500 hover:border-gold hover:text-gold'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-gold transition-colors" size={16} />
                <input
                  type="text"
                  placeholder={t.common.search}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full text-[10px] font-bold outline-none focus:border-gold transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-24 container mx-auto px-6 text-center">
          <p className="text-gold font-bold uppercase tracking-widest">{t.common.search}...</p>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {(!activeCategory || activeCategory === 'all') && searchQuery === '' && featuredPost && (
            <section className="py-24 container mx-auto px-6">
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="group relative block rounded-[4rem] overflow-hidden bg-green-950 h-[600px] shadow-2xl"
              >
                <img
                  src={featuredPost.featured_image || PLACEHOLDER_IMG}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-transparent to-transparent"></div>

                <div className="absolute bottom-12 left-12 right-12 max-w-3xl">
                  <span className="px-4 py-1 bg-gold text-white text-[8px] font-black tracking-widest uppercase rounded-full mb-6 inline-block">{t.blog.featured}</span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6 group-hover:text-gold transition-colors">{featuredPost.title}</h2>
                  <p className="text-white/70 text-lg font-medium mb-8 max-w-xl leading-relaxed italic">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-white uppercase opacity-60">
                    <span className="flex items-center gap-2"><Calendar size={14} /> {formatDate(featuredPost.published_at)}</span>
                    <span className="flex items-center gap-2"><Clock size={14} /> {featuredPost.read_time_minutes ?? 5} min {t.blog.read}</span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Regular Grid */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {regularPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group cursor-pointer block">
                    <article>
                      <div className="relative overflow-hidden rounded-[3rem] mb-8 h-80 shadow-xl transition-bezier">
                        <img
                          src={post.featured_image || PLACEHOLDER_IMG}
                          alt={post.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[8px] font-black text-green-950 uppercase tracking-widest shadow-lg">
                            {post.category ?? '-'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[9px] font-black text-gold uppercase tracking-widest">
                          <span>{formatDate(post.published_at)}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span>{post.read_time_minutes ?? 5} min {t.blog.read}</span>
                        </div>
                        <h3 className="text-xl font-bold text-green-950 tracking-tight leading-tight group-hover:text-gold transition-colors">{post.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3">{post.excerpt}</p>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">By {post.author_name ?? 'DBR Foods'}</span>
                          <ArrowRight className="text-gold group-hover:translate-x-2 transition-transform" size={20} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="py-24 text-center">
                  <p className="text-2xl font-black text-green-950 tracking-tighter opacity-20 italic uppercase">{t.blog.noResults}</p>
                </div>
              )}

              {/* Load More */}
              {meta && meta.current_page < meta.last_page && (
                <div className="mt-24 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-green-950 text-white px-12 py-5 rounded-full font-black text-[10px] tracking-widest hover:bg-gold transition-all shadow-xl uppercase disabled:opacity-70"
                  >
                    {loadingMore ? '...' : t.blog.loadMore}
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter Widget */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gold p-12 md:p-20 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <Bookmark className="absolute -top-10 -right-10 text-white/10" size={300} />
            <div className="relative z-10 max-w-xl">
              <h3 className="text-3xl md:text-4xl font-bold text-green-950 tracking-tight leading-tight mb-6">{t.blog.newsletter.title}</h3>
              <p className="text-green-950/70 font-bold text-lg italic leading-relaxed">{t.blog.newsletter.sub}</p>
            </div>

            <div className="relative z-10 w-full lg:w-auto">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = newsletterEmail.trim();
                  if (!email) return;
                  setNewsletterStatus('loading');
                  setNewsletterError('');
                  try {
                    const { subscribeNewsletter } = await import('../utils/newsletterApi');
                    await subscribeNewsletter(email);
                    setNewsletterStatus('success');
                    setNewsletterEmail('');
                  } catch (err) {
                    setNewsletterStatus('error');
                    setNewsletterError(err instanceof Error ? err.message : 'Failed to subscribe.');
                  }
                }}
                className="flex flex-col md:flex-row gap-4"
              >
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.blog.newsletter.placeholder}
                  disabled={newsletterStatus === 'loading'}
                  className="px-8 py-5 rounded-full bg-white/20 border-2 border-white/30 text-green-950 placeholder:text-green-950/50 outline-none focus:bg-white transition-all text-sm font-bold min-w-[300px] disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-green-950 text-white px-10 py-5 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all shadow-2xl disabled:opacity-70"
                >
                  {newsletterStatus === 'loading' ? '...' : t.blog.newsletter.button}
                </button>
              </form>
              {newsletterStatus === 'success' && (
                <p className="mt-4 text-green-950 font-bold">Newsletter active! You&apos;ll receive news and updates soon.</p>
              )}
              {newsletterStatus === 'error' && <p className="mt-4 text-red-700 font-bold">{newsletterError}</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
