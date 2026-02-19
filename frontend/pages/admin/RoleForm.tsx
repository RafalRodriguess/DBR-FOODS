import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { readRole, createRole, updateRole, listPermissions, type Role, type Permission } from '../../utils/usersApi';

const RoleForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState({
    name: '',
    label: '',
    permission_ids: [] as number[],
  });

  useEffect(() => {
    let cancelled = false;
    listPermissions()
      .then((list) => { if (!cancelled) setPermissions(list); })
      .catch(() => { if (!cancelled) setPermissions([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    let cancelled = false;
    setLoading(true);
    readRole(Number(id))
      .then((r) => {
        if (cancelled || !r) return;
        setForm({
          name: r.name,
          label: r.label ?? r.name,
          permission_ids: (r.permissions ?? []).map((p) => p.id),
        });
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Erro ao carregar.'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (mode === 'create') {
        await createRole({
          name: form.name.trim(),
          label: form.label.trim() || undefined,
          permission_ids: form.permission_ids.length ? form.permission_ids : undefined,
        });
        navigate('/admin/users/roles', { state: { success: 'Perfil criado com sucesso.' } });
      } else if (id) {
        await updateRole(Number(id), {
          name: form.name.trim(),
          label: form.label.trim() || undefined,
          permission_ids: form.permission_ids,
        });
        navigate('/admin/users/roles', { state: { success: 'Perfil atualizado com sucesso.' } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (permId: number) => {
    setForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permId)
        ? prev.permission_ids.filter((p) => p !== permId)
        : [...prev.permission_ids, permId],
    }));
  };

  if (loading) {
    return (
      <section className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center">
        <p className="text-gray-500 font-bold">A carregar...</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100">
        <Link to="/admin/users/roles" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
          ← Voltar aos perfis
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">
          {mode === 'create' ? 'Novo perfil' : 'Editar perfil'}
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
          Atribua permissões ao perfil para definir o que o usuário pode acessar
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nome (identificador)</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold"
            placeholder="ex: editor, suporte"
          />
          <p className="text-xs text-gray-500 mt-1">Será convertido em slug (ex: &quot;Editor&quot; → editor)</p>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Label (nome exibido)</label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold"
            placeholder="ex: Editor, Suporte"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Permissões</label>
          <div className="flex flex-wrap gap-3">
            {permissions.map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.permission_ids.includes(p.id)}
                  onChange={() => togglePermission(p.id)}
                  disabled={saving}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm font-bold text-green-950">{p.label || p.name}</span>
              </label>
            ))}
          </div>
          {permissions.length === 0 && <p className="text-sm text-gray-500">Nenhuma permissão cadastrada.</p>}
        </div>
        <div className="flex gap-3 pt-4">
          <Link to="/admin/users/roles" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm uppercase tracking-widest transition-all disabled:opacity-70"
          >
            {saving ? 'A guardar...' : mode === 'create' ? 'Criar perfil' : 'Guardar alterações'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default RoleForm;
