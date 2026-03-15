import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link2, Zap, ListChecks, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import SourceUrlsCard from './SourceUrlsCard';
import GenerateThemesCard from './GenerateThemesCard';
import FilaAprovarCard from './FilaAprovarCard';
import InProgressCard from './InProgressCard';
import FinalizadosCard from './FinalizadosCard';
import FalhasCard from './FalhasCard';
import { getTavilyConfig, listThemes } from '../../utils/blogApi';
import { PostCreatedToastProvider, usePostCreatedToast } from '../../components/PostCreatedToast';

type TabKey = 'urls' | 'gerar' | 'fila' | 'progresso' | 'finalizados' | 'falhas';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'urls', label: 'Cadastrar URLs', icon: <Link2 size={16} /> },
  { key: 'gerar', label: 'Gerar temas', icon: <Zap size={16} /> },
  { key: 'fila', label: 'Fila / Aprovar', icon: <ListChecks size={16} /> },
  { key: 'progresso', label: 'Em progresso', icon: <Loader2 size={16} /> },
  { key: 'finalizados', label: 'Finalizados', icon: <CheckCircle2 size={16} /> },
  { key: 'falhas', label: 'Falhas', icon: <XCircle size={16} /> },
];

function isRecentlyCompleted(completedAt: string | null | undefined, withinSeconds = 120): boolean {
  if (!completedAt || String(completedAt).trim() === '') return false;
  const d = new Date(completedAt);
  if (Number.isNaN(d.getTime())) return false;
  return (Date.now() - d.getTime()) / 1000 <= withinSeconds;
}

const BlogThemesPageInner: React.FC = () => {
  const { showPostCreatedSuccess } = usePostCreatedToast();
  const [tab, setTab] = useState<TabKey>('urls');
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [refreshProgressKey, setRefreshProgressKey] = useState(0);
  const [refreshFilaKey, setRefreshFilaKey] = useState(0);
  const [refreshFinalizadosKey, setRefreshFinalizadosKey] = useState(0);
  const prevInProgressCount = useRef<number>(-1);

  React.useEffect(() => {
    getTavilyConfig()
      .then((c) => setConfigured(c.tavily_configured))
      .catch(() => setConfigured(false));
  }, []);

  /** Deteta quando n8n conclui (in_progress vai para 0) e confirma sucesso em finalizados para mostrar toast. */
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const inProgress = await listThemes('in_progress');
        const count = inProgress.length;
        const hadItems = prevInProgressCount.current > 0;
        prevInProgressCount.current = count;
        if (hadItems && count === 0) {
          const finalizados = await listThemes('finalizados');
          const latest = finalizados[0];
          if (latest?.dispatch_status === 'completed' && isRecentlyCompleted(latest.dispatch_completed_at)) {
            if (!cancelled) {
              showPostCreatedSuccess();
              setRefreshFinalizadosKey((k) => k + 1); // força refresh da aba Finalizados (doc §2.4)
            }
          }
        }
      } catch {
        /* ignore */
      }
    };
    const id = setInterval(check, 12000); // 12 s, alinhado com polling Em progresso (doc §2)
    check();
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [showPostCreatedSuccess]);

  const handleThemesCreated = useCallback(() => {
    setTab('fila');
    setRefreshFilaKey((k) => k + 1); // força refresh da Fila para mostrar os novos temas
  }, []);

  const handleSentToProgress = useCallback(() => {
    setTab('progresso');
  }, []);

  const handleSendComplete = useCallback(() => {
    setRefreshProgressKey((k) => k + 1);
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
        {tab === 'fila' && <FilaAprovarCard refreshTrigger={refreshFilaKey} onThemesChange={() => {}} onSentToProgress={handleSentToProgress} onSendComplete={handleSendComplete} />}
        {tab === 'progresso' && <InProgressCard refreshTrigger={refreshProgressKey} />}
        {tab === 'finalizados' && <FinalizadosCard refreshTrigger={refreshFinalizadosKey} />}
        {tab === 'falhas' && <FalhasCard />}
      </div>
    </section>
  );
};

const BlogThemesPage: React.FC = () => (
  <PostCreatedToastProvider>
    <BlogThemesPageInner />
  </PostCreatedToastProvider>
);

export default BlogThemesPage;
