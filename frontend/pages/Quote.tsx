import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useLang } from '../App';
import { useQuote } from '../context/QuoteContext';
import { createQuote } from '../utils/orcamentosApi';
import Modal from './admin/components/Modal';

const getFlag = (cc: string) =>
  cc.length === 2
    ? cc
        .toUpperCase()
        .split('')
        .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
        .join('')
    : '';

const EUROPEAN_DDI = [
  { code: '+351', country: 'Portugal', cc: 'PT' },
  { code: '+34', country: 'Spain', cc: 'ES' },
  { code: '+33', country: 'France', cc: 'FR' },
  { code: '+49', country: 'Germany', cc: 'DE' },
  { code: '+39', country: 'Italy', cc: 'IT' },
  { code: '+44', country: 'United Kingdom', cc: 'GB' },
  { code: '+31', country: 'Netherlands', cc: 'NL' },
  { code: '+32', country: 'Belgium', cc: 'BE' },
  { code: '+48', country: 'Poland', cc: 'PL' },
  { code: '+43', country: 'Austria', cc: 'AT' },
  { code: '+41', country: 'Switzerland', cc: 'CH' },
  { code: '+46', country: 'Sweden', cc: 'SE' },
  { code: '+47', country: 'Norway', cc: 'NO' },
  { code: '+45', country: 'Denmark', cc: 'DK' },
  { code: '+358', country: 'Finland', cc: 'FI' },
  { code: '+353', country: 'Ireland', cc: 'IE' },
  { code: '+30', country: 'Greece', cc: 'GR' },
  { code: '+420', country: 'Czech Republic', cc: 'CZ' },
  { code: '+40', country: 'Romania', cc: 'RO' },
  { code: '+36', country: 'Hungary', cc: 'HU' },
  { code: '+370', country: 'Lithuania', cc: 'LT' },
  { code: '+371', country: 'Latvia', cc: 'LV' },
  { code: '+372', country: 'Estonia', cc: 'EE' },
  { code: '+386', country: 'Slovenia', cc: 'SI' },
  { code: '+385', country: 'Croatia', cc: 'HR' },
  { code: '+421', country: 'Slovakia', cc: 'SK' },
  { code: '+359', country: 'Bulgaria', cc: 'BG' },
  { code: '+355', country: 'Albania', cc: 'AL' },
  { code: '+383', country: 'Kosovo', cc: 'XK' },
  { code: '+389', country: 'North Macedonia', cc: 'MK' },
  { code: '+381', country: 'Serbia', cc: 'RS' },
  { code: '+387', country: 'Bosnia', cc: 'BA' },
  { code: '+382', country: 'Montenegro', cc: 'ME' },
  { code: '+90', country: 'Turkey', cc: 'TR' },
].sort((a, b) => a.country.localeCompare(b.country));

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

const Quote: React.FC = () => {
  const { lang, t } = useLang();
  const { items, removeItem, clearItems } = useQuote();
  const [sending, setSending] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [phoneCountry, setPhoneCountry] = React.useState('+351');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const tQuote = {
    heroBadge: lang === 'pt' ? 'ORÇAMENTO' : lang === 'es' ? 'PRESUPUESTO' : 'QUOTE',
    heroTitle: lang === 'pt' ? 'Produtos para orçamento' : lang === 'es' ? 'Productos para presupuesto' : 'Products for quote',
    heroSub: lang === 'pt' ? 'Confira os produtos abaixo e preencha seus dados para receber nossa proposta.' : lang === 'es' ? 'Revise los productos abajo y complete sus datos para recibir nuestra propuesta.' : 'Review the products below and fill in your details to receive our proposal.',
    productsTitle: lang === 'pt' ? 'Produtos no orçamento' : lang === 'es' ? 'Productos en presupuesto' : 'Products in quote',
    addMore: lang === 'pt' ? 'Adicionar mais produtos' : lang === 'es' ? 'Añadir más productos' : 'Add more products',
    size: lang === 'pt' ? 'Tamanho' : lang === 'es' ? 'Tamaño' : 'Size',
    freeSample: lang === 'pt' ? 'Amostra grátis' : lang === 'es' ? 'Muestra gratis' : 'Free sample',
    remove: lang === 'pt' ? 'Remover' : lang === 'es' ? 'Quitar' : 'Remove',
    backToProducts: lang === 'pt' ? 'Voltar aos Produtos' : lang === 'es' ? 'Volver a Productos' : 'Back to Products',
    emptyTitle: lang === 'pt' ? 'Nenhum produto no orçamento' : lang === 'es' ? 'Ningún producto en presupuesto' : 'No products in quote',
    emptySub: lang === 'pt' ? 'Adicione produtos para solicitar um orçamento.' : lang === 'es' ? 'Añada productos para solicitar un presupuesto.' : 'Add products to request a quote.',
    yourData: lang === 'pt' ? 'Seus dados' : lang === 'es' ? 'Sus datos' : 'Your details',
    form: {
      name: t.contact.form.name,
      email: t.contact.form.email,
      phone: t.contact.form.phone,
      company: lang === 'pt' ? 'Empresa' : lang === 'es' ? 'Empresa' : 'Company',
      message: lang === 'pt' ? 'Observações (opcional)' : lang === 'es' ? 'Observaciones (opcional)' : 'Notes (optional)',
      robot: t.contact.form.robot,
      send: lang === 'pt' ? 'Enviar solicitação' : lang === 'es' ? 'Enviar solicitud' : 'Send request',
    },
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 md:pt-40 lg:pt-44 pb-12 md:pb-16 bg-green-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-950" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-left">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-white/80 hover:text-gold text-sm font-bold tracking-widest uppercase mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> {tQuote.backToProducts}
          </Link>
          <span className="text-gold font-semibold tracking-[0.3em] text-[10px] mb-4 block uppercase">
            {tQuote.heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-6 md:mb-8">
            {tQuote.heroTitle}
          </h1>
          <p className="max-w-2xl text-white/70 text-sm md:text-lg font-medium">{tQuote.heroSub}</p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Produtos */}
          <div className="mb-12">
            <h2 className="text-[10px] font-black text-gold uppercase tracking-widest mb-6">
              {tQuote.productsTitle}
            </h2>

            {items.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="text-lg font-bold text-gray-600 mb-2">{tQuote.emptyTitle}</p>
                <p className="text-sm text-gray-500 mb-6">{tQuote.emptySub}</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-green-950 text-white px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gold transition-colors"
                >
                  <Plus size={18} /> {tQuote.addMore}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover object-center shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-green-950 text-lg">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.code}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.size && (
                          <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-700">
                            {tQuote.size}: {item.size}
                          </span>
                        )}
                        {item.freeSample && (
                          <span className="px-2 py-1 rounded-lg bg-gold/20 text-xs font-bold text-gold">
                            {tQuote.freeSample}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-sm font-bold transition-colors shrink-0"
                    >
                      <Trash2 size={16} /> {tQuote.remove}
                    </button>
                  </div>
                ))}

                <Link
                  to="/products"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-gold hover:text-gold font-bold text-sm transition-colors"
                >
                  <Plus size={20} /> {tQuote.addMore}
                </Link>
              </div>
            )}
          </div>

          {/* Formulário compacto */}
          {items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-lg">
              <h2 className="text-[10px] font-black text-gold uppercase tracking-widest mb-6">
                {tQuote.yourData}
              </h2>
              <form
                className="space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (sending) return;
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const name = String(formData.get('name') ?? '');
                  const email = String(formData.get('email') ?? '');
                  const phone = phoneNumber ? `${phoneCountry} ${phoneNumber.replace(/\D/g, '')}` : '';
                  const company = String(formData.get('company') ?? '');
                  const message = String(formData.get('message') ?? '');
                  setSending(true);
                  try {
                    await createQuote({
                      name,
                      email,
                      company: company || undefined,
                      phone: phone || undefined,
                      message: message || undefined,
                      products: items.map((i) => ({
                        name: i.product.name,
                        code: i.product.code,
                        slug: i.product.slug,
                        size: i.size,
                        free_sample: i.freeSample,
                      })),
                    });
                    clearItems();
                    setPhoneNumber('');
                    setSuccessOpen(true);
                  } catch (err) {
                    alert(err instanceof Error ? err.message : (lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Please try again.'));
                  } finally {
                    setSending(false);
                  }
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest">
                      {tQuote.form.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest">
                      {tQuote.form.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest">
                      {tQuote.form.phone}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        className="w-[140px] px-3 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm font-medium"
                      >
                        {EUROPEAN_DDI.map(({ code, country, cc }) => (
                          <option key={`${code}-${country}`} value={code}>
                            {getFlag(cc)} {code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                        placeholder="123 456 789"
                        className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold uppercase tracking-widest">
                      {tQuote.form.company}
                    </label>
                    <input
                      type="text"
                      name="company"
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold uppercase tracking-widest">
                    {tQuote.form.message}
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-gold text-sm resize-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="robot" className="w-4 h-4 accent-gold rounded" />
                    <span className="text-xs font-bold text-gray-500 uppercase">{tQuote.form.robot}</span>
                  </label>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto bg-green-950 text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? (lang === 'pt' ? 'Enviando...' : lang === 'es' ? 'Enviando...' : 'Sending...') : tQuote.form.send} <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={successOpen}
        title=""
        onClose={() => setSuccessOpen(false)}
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setSuccessOpen(false)}
              className="px-5 py-2 rounded-xl bg-green-950/90 text-white font-semibold text-sm hover:bg-gold transition-colors"
            >
              OK
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-950">Request sent successfully.</p>
            <p className="text-gray-500 text-sm mt-0.5">We will contact you shortly.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quote;
