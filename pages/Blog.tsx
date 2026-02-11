
import React, { useState } from 'react';
import { Search, Calendar, Clock, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../App';

const Blog: React.FC = () => {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState(t.blog.categories[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      id: 1,
      title: 'The Evolution of Superfood Logistics in the Port of Rotterdam',
      excerpt: 'How strategic positioning in Europe hub is transforming distribution efficiency for Latin American exporters.',
      category: 'Supply Chain',
      date: 'Oct 12, 2023',
      readTime: '6 min',
      author: 'Diego Rodrigues',
      img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      featured: true
    },
    {
      id: 2,
      title: 'Why Transparency is the New Premium in 2024',
      excerpt: 'Consumers are demanding more than just "organic". They want to see the soil and the hands that harvested it.',
      category: 'Sustainability',
      date: 'Sep 28, 2023',
      readTime: '4 min',
      author: 'Maria Silva',
      img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Black Chia vs White Chia: Understanding the Nuances',
      excerpt: 'Technical specifications and nutritional profiles compared for industrial application and retail packaging.',
      category: 'Nutrition',
      date: 'Sep 15, 2023',
      readTime: '8 min',
      author: 'Technical Team',
      img: 'https://images.unsplash.com/photo-1596711910609-0d12759e0a0d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Global Quinoa Market Report: Q4 Projections',
      excerpt: 'Analyzing the harvest yields in Spain and the Andes to predict price fluctuations in the European market.',
      category: 'Market Trends',
      date: 'Aug 30, 2023',
      readTime: '5 min',
      author: 'Analytics Dept',
      img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const filteredPosts = posts.filter(post => 
    (activeCategory === t.blog.categories[0] || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPost = posts.find(p => p.featured);

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <section className="pt-48 pb-20 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-gold font-black tracking-[0.4em] text-[10px] mb-6 block uppercase">{t.blog.hero.badge}</span>
            <h1 className="text-6xl md:text-8xl font-black text-green-950 tracking-tighter leading-none mb-12">
              {t.blog.hero.title.split(' ').slice(0, 2).join(' ')} <br /> <span className="italic font-light">{t.blog.hero.title.split(' ').slice(2).join(' ')}</span>
            </h1>
            
            {/* Search & Categories */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-3">
                {t.blog.categories.map((cat: string) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${activeCategory === cat ? 'bg-green-950 text-white shadow-xl' : 'bg-white border border-gray-200 text-gray-500 hover:border-gold hover:text-gold'}`}
                  >
                    {cat}
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

      {/* Featured Post (if not filtered) */}
      {activeCategory === t.blog.categories[0] && searchQuery === '' && featuredPost && (
        <section className="py-24 container mx-auto px-6">
          <Link to={`/blog/${featuredPost.id}`} className="group relative block rounded-[4rem] overflow-hidden bg-green-950 h-[600px] shadow-2xl">
            <img 
              src={featuredPost.img} 
              alt={featuredPost.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-12 left-12 right-12 max-w-3xl">
               <span className="px-4 py-1 bg-gold text-white text-[8px] font-black tracking-widest uppercase rounded-full mb-6 inline-block">{t.blog.featured}</span>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6 group-hover:text-gold transition-colors">
                 {featuredPost.title}
               </h2>
               <p className="text-white/70 text-lg font-medium mb-8 max-w-xl leading-relaxed italic">
                 {featuredPost.excerpt}
               </p>
               <div className="flex items-center gap-8 text-[10px] font-black tracking-widest text-white uppercase opacity-60">
                 <span className="flex items-center gap-2"><Calendar size={14} /> {featuredPost.date}</span>
                 <span className="flex items-center gap-2"><Clock size={14} /> {featuredPost.readTime} {t.blog.read}</span>
               </div>
            </div>
          </Link>
        </section>
      )}

      {/* Regular Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredPosts.filter(p => !p.featured || activeCategory !== t.blog.categories[0] || searchQuery !== '').map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[3rem] mb-8 h-80 shadow-xl transition-bezier">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[8px] font-black text-green-950 uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[9px] font-black text-gold uppercase tracking-widest">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span>{post.readTime} {t.blog.read}</span>
                  </div>
                  <h3 className="text-2xl font-black text-green-950 tracking-tighter leading-tight group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">By {post.author}</span>
                    <ArrowRight className="text-gold group-hover:translate-x-2 transition-transform" size={20} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-2xl font-black text-green-950 tracking-tighter opacity-20 italic uppercase">{t.blog.noResults}</p>
            </div>
          )}

          {/* Load More Simulado */}
          <div className="mt-24 text-center">
            <button className="bg-green-950 text-white px-12 py-5 rounded-full font-black text-[10px] tracking-widest hover:bg-gold transition-all shadow-xl uppercase">
              {t.blog.loadMore}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Widget */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
           <div className="bg-gold p-12 md:p-20 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
             <Bookmark className="absolute -top-10 -right-10 text-white/10" size={300} />
             <div className="relative z-10 max-w-xl">
               <h3 className="text-4xl md:text-5xl font-black text-green-950 tracking-tighter leading-none mb-6">
                 {t.blog.newsletter.title}
               </h3>
               <p className="text-green-950/70 font-bold text-lg italic leading-relaxed">
                 {t.blog.newsletter.sub}
               </p>
             </div>
             
             <div className="relative z-10 w-full lg:w-auto">
               <div className="flex flex-col md:flex-row gap-4">
                 <input 
                    type="email" 
                    placeholder={t.blog.newsletter.placeholder} 
                    className="px-8 py-5 rounded-full bg-white/20 border-2 border-white/30 text-green-950 placeholder:text-green-950/50 outline-none focus:bg-white transition-all text-sm font-bold min-w-[300px]"
                 />
                 <button className="bg-green-950 text-white px-10 py-5 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all shadow-2xl">
                   {t.blog.newsletter.button}
                 </button>
               </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
