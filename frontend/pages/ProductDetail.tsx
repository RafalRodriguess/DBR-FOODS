import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Package, CheckCircle } from 'lucide-react';
import { useLang } from '../App';
import { useQuote } from '../context/QuoteContext';
import { getProductBySlugPublic, listPublicProducts, type PublicProductDisplay } from '../utils/productsApi';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { lang } = useLang();
  const { addItem } = useQuote();
  const [product, setProduct] = useState<PublicProductDisplay | null | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<PublicProductDisplay[]>([]);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setRelatedProducts([]);
      return;
    }
    getProductBySlugPublic(slug)
      .then((p) => {
        setProduct(p);
        if (p?.category) {
          listPublicProducts({ per_page: 100 }).then((list) => {
            const related = list.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3);
            setRelatedProducts(related);
          }).catch(() => setRelatedProducts([]));
        } else {
          setRelatedProducts([]);
        }
      })
      .catch(() => setProduct(null));
  }, [slug]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [includeFreeSample, setIncludeFreeSample] = useState(false);

  const tProduct = {
    productCode: lang === 'pt' ? 'Código' : lang === 'es' ? 'Código' : 'Product Code',
    tradeNote: lang === 'pt' ? 'Clientes trade: Para solicitar amostra grátis, selecione a opção e clique em "Adicionar ao Orçamento".' : lang === 'es' ? 'Clientes trade: Para solicitar muestra gratuita, seleccione la opción y haga clic en "Añadir a Presupuesto".' : 'Trade customers: To request a free sample, select the free sample option and click "Add to Quote".',
    ingredients: lang === 'pt' ? 'Ingredientes' : lang === 'es' ? 'Ingredientes' : 'Ingredients',
    applications: lang === 'pt' ? 'Aplicações' : lang === 'es' ? 'Aplicaciones' : 'Applications',
    size: lang === 'pt' ? 'Tamanho' : lang === 'es' ? 'Tamaño' : 'Size',
    freeSample: lang === 'pt' ? 'Amostra Grátis' : lang === 'es' ? 'Muestra Gratis' : 'Free Sample',
    quantity: lang === 'pt' ? 'Quantidade' : lang === 'es' ? 'Cantidad' : 'Quantity',
    addToQuote: lang === 'pt' ? 'Adicionar ao Orçamento' : lang === 'es' ? 'Añadir a Presupuesto' : 'Add to Quote',
    relatedTitle: lang === 'pt' ? 'Você também pode gostar' : lang === 'es' ? 'También te puede gustar' : 'You May Also Like',
    requestSpec: lang === 'pt' ? 'Solicitar especificação técnica' : lang === 'es' ? 'Solicitar especificación técnica' : 'Request product specification',
    contactUs: lang === 'pt' ? 'Entre em contato' : lang === 'es' ? 'Contáctenos' : 'Contact Us',
    backToProducts: lang === 'pt' ? 'Voltar aos Produtos' : lang === 'es' ? 'Volver a Productos' : 'Back to Products',
  };

  const handleAddToQuote = () => {
    if (product) {
      addItem(product, selectedSize || undefined, includeFreeSample);
      navigate('/quote');
    }
  };

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-6">Carregando...</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-6">
          {lang === 'pt' ? 'Produto não encontrado.' : lang === 'es' ? 'Producto no encontrado.' : 'Product not found.'}
        </p>
        <Link to="/products" className="text-gold font-bold hover:underline">
          {tProduct.backToProducts}
        </Link>
      </div>
    );
  }

  const desc = product.description;
  const ingredients = product.ingredients;
  const applications = product.applications;

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm font-bold tracking-widest uppercase mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> {tProduct.backToProducts}
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="w-full lg:w-1/2">
              <div className="aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover object-center" />
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-black tracking-widest uppercase">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                {tProduct.productCode}: {product.code}
              </p>
              <p className="text-white/85 text-base md:text-lg leading-relaxed">{desc}</p>
              <div className="flex flex-wrap gap-3 pt-4">
                {product.type && <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold">{product.type}</span>}
                {product.purity && <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold">{product.purity}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-green-950 font-black text-sm uppercase tracking-widest mb-4">
                  <FileText size={18} className="text-gold" /> {tProduct.ingredients}
                </h3>
                <p className="text-gray-700 font-medium">{ingredients}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-green-950 font-black text-sm uppercase tracking-widest mb-4">
                  <Package size={18} className="text-gold" /> {tProduct.applications}
                </h3>
                <p className="text-gray-700 font-medium">{applications}</p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xl sticky top-28">
                <p className="text-gray-500 text-xs font-medium mb-6">{tProduct.tradeNote}</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gold uppercase tracking-widest mb-3">
                      {tProduct.size}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold uppercase border transition-all ${
                            selectedSize === size
                              ? 'bg-green-950 text-white border-green-950'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gold hover:text-gold'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {product.hasFreeSample && (
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includeFreeSample}
                        onChange={(e) => setIncludeFreeSample(e.target.checked)}
                        className="w-5 h-5 accent-gold rounded border-gray-200 cursor-pointer"
                      />
                      <span className="text-sm font-bold text-gray-700 group-hover:text-gold transition-colors flex items-center gap-2">
                        <CheckCircle size={16} className="text-gold" /> {tProduct.freeSample}
                      </span>
                    </label>
                  )}

                  <button
                    onClick={handleAddToQuote}
                    className="w-full bg-green-950 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {tProduct.addToQuote}
                  </button>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <Link
                      to="/contact"
                      className="block text-center text-sm font-bold text-gold hover:underline"
                    >
                      {tProduct.contactUs}
                    </Link>
                    <a
                      href="#"
                      className="block text-center text-sm font-bold text-gray-500 hover:text-gold transition-colors"
                    >
                      {tProduct.requestSpec}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">
              {tProduct.relatedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {relatedProducts.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  className="group flex flex-col min-w-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex flex-col flex-1 min-w-0">
                    <h3 className="font-bold text-green-950 text-base md:text-lg leading-tight group-hover:text-gold transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                      {p.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
