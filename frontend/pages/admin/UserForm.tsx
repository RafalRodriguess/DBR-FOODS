import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { readUser, createUser, updateUser, listRoles, type User, type Role } from '../../utils/usersApi';

const UserForm: React.FC<{ mode: 'create' | 'edit' }> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role_ids: [] as number[],
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listRoles();
        if (!cancelled) setRoles(list);
      } catch {
        if (!cancelled) setRoles([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    let cancelled = false;
    setLoading(true);
    readUser(Number(id))
      .then((u) => {
        if (cancelled || !u) return;
        setForm({
          name: u.name,
          email: u.email,
          password: '',
          role_ids: (u.roles ?? []).map((r) => r.id),
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
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role_ids: form.role_ids.length ? form.role_ids : undefined,
        });
        navigate('/admin/users', { state: { success: 'Usuário criado com sucesso.' } });
      } else if (id) {
        await updateUser(Number(id), {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password || undefined,
          role_ids: form.role_ids,
        });
        navigate('/admin/users', { state: { success: 'Usuário atualizado com sucesso.' } });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((r) => r !== roleId)
        : [...prev.role_ids, roleId],
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
        <Link to="/admin/users" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold text-sm font-bold mb-4">
          ← Voltar aos usuários
        </Link>
        <h3 className="text-xl md:text-2xl font-black text-green-950 uppercase tracking-tight">
          {mode === 'create' ? 'Novo usuário' : 'Editar usuário'}
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold"
            placeholder="Nome completo"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold"
            placeholder="email@exemplo.com"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
            Senha {mode === 'edit' && '(deixe em branco para não alterar)'}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required={mode === 'create'}
            disabled={saving}
            className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-gold"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Perfis de acesso</label>
          <div className="flex flex-wrap gap-3">
            {roles.map((r) => (
              <label key={r.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.role_ids.includes(r.id)}
                  onChange={() => toggleRole(r.id)}
                  disabled={saving}
                  className="rounded border-gray-300 text-gold focus:ring-gold"
                />
                <span className="text-sm font-bold text-green-950">{r.label || r.name}</span>
              </label>
            ))}
          </div>
          {roles.length === 0 && <p className="text-sm text-gray-500">Nenhum perfil cadastrado.</p>}
        </div>
        <div className="flex gap-3 pt-4">
          <Link to="/admin/users" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-green-950 hover:bg-gold text-white font-black text-sm uppercase tracking-widest transition-all disabled:opacity-70"
          >
            {saving ? 'A guardar...' : mode === 'create' ? 'Criar usuário' : 'Guardar alterações'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UserForm;
