import React, { useEffect, useState } from 'react';
import {
  getSiteSettingsAdmin,
  updateSiteSettingsAdmin,
  type SiteSettings,
} from '../../utils/siteSettingsApi';

const SiteDataPage: React.FC = () => {
  const [form, setForm] = useState<SiteSettings>({
    contact_location: '',
    contact_email: '',
    contact_phone: '',
    contact_map_embed_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getSiteSettingsAdmin();
        setForm(data);
      } catch (err) {
        setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao carregar dados.' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setField = (key: keyof SiteSettings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const saved = await updateSiteSettingsAdmin(form);
      setForm(saved);
      setMessage({ type: 'success', text: 'Dados de contato salvos com sucesso.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro ao salvar dados.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">Dados</h3>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
          Informações de contato exibidas no site (Contato e Rodapé)
        </p>
      </div>
      <div className="p-6 md:p-8">
        {loading ? (
          <p className="text-sm text-gray-500">Carregando dados...</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Localização</label>
              <input
                type="text"
                value={form.contact_location}
                onChange={(e) => setField('contact_location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
                placeholder="Shannonweg 81-83, 3197, Rotterdam - Netherlands"
                disabled={saving}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={(e) => setField('contact_email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
                  placeholder="diego@dbr-foods.com"
                  disabled={saving}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Telefone</label>
                <input
                  type="text"
                  value={form.contact_phone}
                  onChange={(e) => setField('contact_phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold"
                  placeholder="+31 6 85008474"
                  disabled={saving}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">URL do mapa (embed)</label>
              <textarea
                value={form.contact_map_embed_url}
                onChange={(e) => setField('contact_map_embed_url', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-gold min-h-28"
                placeholder="https://www.google.com/maps/embed?..."
                disabled={saving}
              />
            </div>
            {message && (
              <p className={`text-[10px] font-bold uppercase ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-green-950 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all"
            >
              {saving ? 'Salvando...' : 'Salvar dados'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default SiteDataPage;
