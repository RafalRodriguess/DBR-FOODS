
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Linkedin, Twitter, MessageSquare, Quote } from 'lucide-react';
import { useLang } from '../App';

const BlogPost: React.FC = () => {
  const { id } = useParams();
  const { t } = useLang();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / (totalHeight || 1)) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock post data (in real app, this would come from an API or i18n file based on ID)
  const post = {
    id: 1,
    title: 'The Evolution of Superfood Logistics in the Port of Rotterdam',
    subtitle: 'Exploring how strategic positioning in Europe’s premier trading hub is transforming distribution efficiency for global exporters.',
    category: 'Supply Chain',
    date: 'Oct 12, 2023',
    readTime: '6 min',
    author: {
      name: 'Diego Rodrigues',
      role: 'Head of Operations at DBR Foods',
      bio: 'With over 15 years in international trade, Diego specializes in bridging the gap between Latin American producers and European consumer markets.',
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Strategically headquartered in the Port of Rotterdam—Europe’s vibrant trading hub—DBR Foods access a diverse range of global markets. But why Rotterdam? The answer lies in the intersection of tradition and digital innovation.</p>
      
      <h3>The Gateway to Europe</h3>
      <p>Rotterdam is not just a port; it's a massive neural network of logistics. For superfood exporters in Paraguay or India, reaching this destination means their products are now less than 24 hours away from millions of consumers across Germany, France, and the Nordics.</p>
      
      <div class="my-10 p-6 md:p-10 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border-l-8 border-gold italic text-lg md:text-xl font-medium text-green-950 relative">
        "Efficiency in superfood trading is no longer about moving mass; it's about moving information and ensuring purity at every checkpoint."
      </div>

      <h3>Blockchain and Traceability</h3>
      <p>At DBR Foods, we leverage the digital infrastructure of Rotterdam to offer our clients unprecedented transparency. From the moment a container of Black Chia seeds leaves the Paraguayan farm, every movement is recorded, analyzed, and verified against EU health standards.</p>
      
      <h3>Sustainability in Transit</h3>
      <p>The future of logistics is green. By utilizing river barges from the port directly into the European hinterland, we reduce the carbon footprint of our distribution by up to 35% compared to traditional road transport.</p>
    `
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-100">
        <div 
          className="h-full bg-gold transition-all duration-150" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Header - Responsive Height */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pb-12 md:pb-20">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-[9px] font-black tracking-widest uppercase mb-8 md:mb-12">
            <ArrowLeft size={16} /> {t.common?.back || "Back"}
          </Link>
          <div className="max-w-4xl">
            <span className="px-3 py-1 bg-gold text-white text-[9px] font-black tracking-widest uppercase rounded-full mb-6 md:mb-8 inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6 md:mb-8">
              {post.title}
            </h1>
            <p className="text-base md:text-2xl text-white/80 font-medium italic max-w-2xl leading-relaxed">
              {post.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Article Body - Grid that stacks early */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 -mt-8 md:-mt-10 relative z-20">
          
          {/* Main Content */}
          <article className="lg:col-span-8 bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-10 md:p-20 shadow-2xl">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-10 md:mb-16 pb-8 border-b border-gray-100 text-[9px] font-black tracking-widest text-gray-400 uppercase">
              <div className="flex items-center gap-3">
                 <img src={post.author.img} alt={post.author.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full grayscale" />
                 <span className="text-green-950">By {post.author.name}</span>
              </div>
              <span className="flex items-center gap-2 whitespace-nowrap"><Calendar size={14} className="text-gold" /> {post.date}</span>
              <span className="flex items-center gap-2 whitespace-nowrap"><Clock size={14} className="text-gold" /> {post.readTime} read</span>
            </div>

            <div 
              className="prose prose-lg md:prose-xl max-w-none text-gray-600 leading-relaxed font-medium 
                prose-headings:text-green-950 prose-headings:font-black prose-headings:tracking-tighter
                prose-h3:text-2xl md:prose-h3:text-3xl prose-p:mb-6 md:prose-p:mb-8 prose-h3:mt-10 md:prose-h3:mt-12 prose-h3:mb-4 md:prose-h3:mb-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Footer Card */}
            <div className="mt-16 md:mt-24 p-8 md:p-12 bg-gray-50 rounded-[2rem] md:rounded-[3rem] flex flex-col sm:flex-row items-center gap-6 md:gap-10">
               <img src={post.author.img} alt={post.author.name} className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl object-cover grayscale" />
               <div className="text-center sm:text-left">
                  <h4 className="text-xl md:text-2xl font-black text-green-950 tracking-tighter mb-1">{post.author.name}</h4>
                  <p className="text-gold font-bold text-[10px] uppercase tracking-widest mb-3 md:mb-4">{post.author.role}</p>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed italic">{post.author.bio}</p>
               </div>
            </div>
          </article>

          {/* Sidebar / Social Share */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-10 md:space-y-12">
               <div className="space-y-6">
                 <h5 className="text-[10px] font-black tracking-[0.3em] text-green-950 uppercase border-b border-gray-100 pb-4">Share Analysis</h5>
                 <div className="flex flex-row lg:flex-col flex-wrap gap-4">
                   {[
                     { name: 'LinkedIn', icon: Linkedin, color: 'hover:bg-[#0077b5]' },
                     { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#1877f2]' },
                     { name: 'Twitter', icon: Twitter, color: 'hover:bg-[#1da1f2]' }
                   ].map((social) => (
                     <button key={social.name} className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gray-50 text-green-950 font-black text-[10px] tracking-widest transition-all ${social.color} hover:text-white group whitespace-nowrap`}>
                       <social.icon size={16} className="text-gold group-hover:text-white transition-colors" />
                       <span className="hidden sm:inline">{social.name.toUpperCase()}</span>
                     </button>
                   ))}
                 </div>
               </div>

               <div className="p-8 md:p-10 bg-green-950 rounded-[2rem] md:rounded-[3rem] text-white shadow-xl">
                  <h5 className="text-xl md:text-2xl font-black tracking-tighter mb-6">Need technical data?</h5>
                  <Link to="/contact" className="inline-block w-full text-center bg-gold text-white px-6 md:px-8 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-white hover:text-green-950 transition-all">
                    Request Specs
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
