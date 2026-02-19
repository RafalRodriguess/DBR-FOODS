import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Loader, Plus, Edit2, Trash2 } from 'lucide-react';
import { listRoles, deleteRole, type Role } from '../../utils/usersApi';
import AlertMessage from './components/AlertMessage';

const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success ?? null;
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listRoles()
      .then(setRoles)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar perfis.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dismissSuccess = () => navigate('/admin/users/roles', { replace: true, state: {} });

  const handleDelete = async (r: Role) => {
    if (!window.confirm(`Excluir o perfil "${r.label || r.name}"? Os usuários com este perfil deixarão de tê-lo.`)) return;
    setError(null);
    setDeleting(r.id);
    try {
      await deleteRole(r.id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {successMessage && (
        <div className="mx-6 mt-6 md:mx-8 md:mt-8">
          <AlertMessage type="success" message={successMessage} onDismiss={dismissSuccess} autoDismissMs={5000} />
        </div>
      )}
      {error && (
        <div className="mx-6 mt-6 md:mx-8 md:mt-8">
          <AlertMessage type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}
      <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase flex items-center gap-2">
            <Shield size={24} className="text-gold" /> Perfis de acesso
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Crie perfis e atribua permissões. Depois atribua perfis aos usuários.
          </p>
        </div>
        <Link
          to="/admin/users/roles/new"
          className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={16} /> Novo perfil
        </Link>
      </div>
      <div className="p-6 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
            <Loader size={20} className="animate-spin" />
            <span className="font-bold uppercase tracking-widest text-sm">A carregar perfis...</span>
          </div>
        ) : roles.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Nenhum perfil encontrado.</p>
            <Link to="/admin/users/roles/new" className="text-gold font-bold mt-2 inline-block">Criar primeiro perfil</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Perfil</th>
                  <th className="text-left pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Permissões</th>
                  <th className="text-right pb-4 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-950">{r.label || r.name}</span>
                      <span className="ml-2 text-xs text-gray-400">({r.name})</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-2">
                        {(r.permissions ?? []).length === 0 ? (
                          <span className="text-gray-400 text-sm">—</span>
                        ) : (
                          (r.permissions ?? []).map((p) => (
                            <span
                              key={p.id}
                              className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold"
                            >
                              {p.label || p.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/users/roles/${r.id}/edit`}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-green-950 transition-colors flex items-center justify-center"
                          aria-label="Editar"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(r)}
                          disabled={deleting === r.id}
                          className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center disabled:opacity-50"
                          aria-label="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default RolesList;
