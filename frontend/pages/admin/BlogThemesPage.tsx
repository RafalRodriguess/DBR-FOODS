import React, { useState, useCallback } from 'react';
import { Link2, Zap, ListChecks, Loader2 } from 'lucide-react';
import SourceUrlsCard from './SourceUrlsCard';
import GenerateThemesCard from './GenerateThemesCard';
import FilaAprovarCard from './FilaAprovarCard';
import InProgressCard from './InProgressCard';
import { getTavilyConfig } from '../../utils/blogApi';

type TabKey = 'urls' | 'gerar' | 'fila' | 'progresso';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'urls', label: 'Cadastrar URLs', icon: <Link2 size={16} /> },
  { key: 'gerar', label: 'Gerar temas', icon: <Zap size={16} /> },
  { key: 'fila', label: 'Fila / Aprovar', icon: <ListChecks size={16} /> },
  { key: 'progresso', label: 'Em progresso', icon: <Loader2 size={16} /> },
];

const BlogThemesPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('urls');
  const [configured, setConfigured] = useState<boolean | null>(null);

  React.useEffect(() => {
    getTavilyConfig()
      .then((c) => setConfigured(c.tavily_configured))
      .catch(() => setConfigured(false));
  }, []);

  const handleThemesCreated = useCallback(() => {
    setTab('fila');
  }, []);

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">Tema</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          Cadastre as URLs de referência, depois gere temas (varredura automática) e aprove na fila para enviar à automação.
        </p>
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-100 pb-4">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                tab === key ? 'bg-green-950 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-6">
        {tab === 'urls' && <SourceUrlsCard />}
        {tab === 'gerar' && configured !== null && <GenerateThemesCard configured={configured} onThemesCreated={handleThemesCreated} />}
        {tab === 'fila' && <FilaAprovarCard onThemesChange={() => {}} />}
        {tab === 'progresso' && <InProgressCard />}
      </div>
    </section>
  );
};

export default BlogThemesPage;
