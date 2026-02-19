import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import {
  pluckProductCategories,
  pluckBenefits,
  pluckIngredients,
  readProduct,
  createProduct,
  updateProduct,
} from '../../utils/productsApi';

const ProductForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [benefits, setBenefits] = useState<{ id: number; name: string }[]>([]);
  const [ingredients, setIngredients] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(mode === 'edit' && !!id);

  const [form, setForm] = useState({
    name: '',
    code: '',
    product_category_id: null as number | null,
    origin: '',
    purity: '',
    ingredients_text: '',
    applications: '',
    sizes: [] as string[],
    tamanhoInput: '',
    has_free_sample: true,
    stock: 0,
    status: 'active' as string,
    benefit_ids: [] as number[],
    ingredient_ids: [] as number[],
  });

  useEffect(() => {
    Promise.all([pluckProductCategories(), pluckBenefits(), pluckIngredients()]).then(([cat, ben, ing]) => {
      setCategories(cat);
      setBenefits(ben);
      setIngredients(ing);
      if (form.product_category_id === null && cat[0]) {
        setForm((f) => ({ ...f, product_category_id: cat[0].id }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (mode === 'edit' && id) {
      setFormLoading(true);
      readProduct(Number(id))
        .then((p) => {
          if (p) {
            setForm({
              name: p.name,
              code: p.code ?? '',
              product_category_id: p.product_category_id ?? null,
              origin: p.origin ?? '',
              purity: p.purity ?? '',
              ingredients_text: p.ingredients_text ?? '',
              applications: p.applications ?? '',
              sizes: p.sizes ?? [],
              tamanhoInput: '',
              has_free_sample: p.has_free_sample ?? true,
              stock: p.stock ?? 0,
              status: p.status ?? 'active',
              benefit_ids: (p.benefits ?? []).map((b) => b.id),
              ingredient_ids: (p.ingredients ?? []).map((i) => i.id),
            });
          }
        })
        .catch(() => {})
        .finally(() => setFormLoading(false));
    }
  }, [mode, id]);

  const addTamanho = () => {
    const t = form.tamanhoInput.trim();
    if (t && !form.sizes.includes(t)) {
      setForm((prev) => ({ ...prev, sizes: [...prev.sizes, t], tamanhoInput: '' }));
    }
  };

  const removeTamanho = (idx: number) => {
    setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) }));
  };

  const toggleBenefit = (benefitId: number) => {
    setForm((prev) =>
      prev.benefit_ids.includes(benefitId)
        ? { ...prev, benefit_ids: prev.benefit_ids.filter((id) => id !== benefitId) }
        : { ...prev, benefit_ids: [...prev.benefit_ids, benefitId] }
    );
  };

  const toggleIngredient = (ingredientId: number) => {
    setForm((prev) =>
      prev.ingredient_ids.includes(ingredientId)
        ? { ...prev, ingredient_ids: prev.ingredient_ids.filter((id) => id !== ingredientId) }
        : { ...prev, ingredient_ids: [...prev.ingredient_ids, ingredientId] }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    if (categories.length === 0) {
      alert('Cadastre pelo menos uma categoria antes de criar produtos.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        product_category_id: form.product_category_id || undefined,
        origin: form.origin.trim() || undefined,
        purity: form.purity.trim() || undefined,
        type: undefined,
        ingredients_text: form.ingredients_text.trim() || undefined,
        applications: form.applications.trim() || undefined,
        sizes: form.sizes,
        has_free_sample: form.has_free_sample,
        stock: form.stock,
        status: form.status,
        benefit_ids: form.benefit_ids,
        ingredient_ids: form.ingredient_ids,
      };
      if (mode === 'create') {
        await createProduct(payload);
        navigate('/admin/products');
      } else if (id) {
        await updateProduct(Number(id), payload);
        navigate('/admin/products');
      }
    } catch (err) {
      alert((err as Error).message ?? 'Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  const hasCategorias = categories.length > 0;

  if (formLoading) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-8">
        <p className="text-gray-500">Carregando...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">
          {mode === 'create' ? 'Novo produto' : 'Editar produto'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Código *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: dbr-chia-001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Categoria</label>
            <select
              value={form.product_category_id ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, product_category_id: e.target.value ? Number(e.target.value) : null }))}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              disabled={!hasCategorias}
            >
              {hasCategorias ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))
              ) : (
                <option value="">Cadastre categorias primeiro</option>
              )}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Origem</label>
            <input
              type="text"
              value={form.origin}
              onChange={(e) => setForm((p) => ({ ...p, origin: e.target.value }))}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: Paraguai"
            />
          </div>
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Pureza</label>
            <input
              type="text"
              value={form.purity}
              onChange={(e) => setForm((p) => ({ ...p, purity: e.target.value }))}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: >99.95%"
            />
          </div>
        </div>

        {benefits.length > 0 && (
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Benefícios</label>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b) => (
                <label key={b.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-gold/50">
                  <input
                    type="checkbox"
                    checked={form.benefit_ids.includes(b.id)}
                    onChange={() => toggleBenefit(b.id)}
                    className="w-4 h-4 accent-gold rounded"
                  />
                  <span className="text-sm font-medium text-green-950">{b.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {ingredients.length > 0 && (
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ingredientes (tags para filtro)</label>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((i) => (
                <label key={i.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-gold/50">
                  <input
                    type="checkbox"
                    checked={form.ingredient_ids.includes(i.id)}
                    onChange={() => toggleIngredient(i.id)}
                    className="w-4 h-4 accent-gold rounded"
                  />
                  <span className="text-sm font-medium text-green-950">{i.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ingredientes (texto livre)</label>
          <textarea
            value={form.ingredients_text}
            onChange={(e) => setForm((p) => ({ ...p, ingredients_text: e.target.value }))}
            rows={3}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
            placeholder="Ex: 100% Sementes de Chia Preta Orgânica"
          />
        </div>

        <div>
          <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Aplicações</label>
          <textarea
            value={form.applications}
            onChange={(e) => setForm((p) => ({ ...p, applications: e.target.value }))}
            rows={3}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
            placeholder="Ex: Panificação, bebidas, cereais, smoothies"
          />
        </div>

        <div>
          <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tamanhos (kg para compra)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={form.tamanhoInput}
              onChange={(e) => setForm((p) => ({ ...p, tamanhoInput: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTamanho())}
              className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
              placeholder="Ex: 5kg, 25kg"
            />
            <button type="button" onClick={addTamanho} className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gold/20 text-green-950 flex items-center gap-1">
              <Plus size={16} /> Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.sizes.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-sm">
                {t}
                <button type="button" onClick={() => removeTamanho(i)} className="text-gray-500 hover:text-red-500">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Estoque</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) || 0 }))}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold text-sm"
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.has_free_sample}
                onChange={(e) => setForm((p) => ({ ...p, has_free_sample: e.target.checked }))}
                className="w-5 h-5 accent-gold rounded"
              />
              <span className="text-sm font-bold text-green-950">Liberado para amostra grátis</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Link to="/admin/products" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm">
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

export default ProductForm;
