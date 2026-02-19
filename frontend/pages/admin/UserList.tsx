import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import DataTable, { ColumnDef } from './components/DataTable';
import ListPagination from './components/ListPagination';
import AlertMessage from './components/AlertMessage';
import { useAuth } from '../../App';
import type { User } from '../../utils/usersApi';
import { listUsers, deleteUser } from '../../utils/usersApi';
import { DEFAULT_PER_PAGE } from '../../utils/pagination';
import type { PaginationMeta } from '../../utils/pagination';

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success ?? null;
  const [users, setUsers] = React.useState<User[]>([]);
  const [meta, setMeta] = React.useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(DEFAULT_PER_PAGE);
  const [search, setSearch] = React.useState('');
  const [deleting, setDeleting] = React.useState<number | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { users: list, meta: m } = await listUsers({ page, per_page: perPage, search: search || undefined });
      setUsers(list);
      setMeta(m);
    } catch (e) {
      setUsers([]);
      setError(e instanceof Error ? e.message : 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (u: User) => {
    if (currentUser && u.id === currentUser.id) {
      setError('Você não pode excluir a si mesmo.');
      return;
    }
    if (!window.confirm(`Excluir o usuário "${u.name}"?`)) return;
    setError(null);
    setDeleting(u.id);
    try {
      await deleteUser(u.id);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir.');
    } finally {
      setDeleting(null);
    }
  };

  const handlePerPage = (n: number) => {
    setPerPage(n);
    setPage(1);
  };

  const rows = users.map((u) => ({
    ...u,
    perfis: (u.roles ?? []).map((r) => r.label || r.name).join(', ') || '—',
  }));

  const columns: ColumnDef<typeof rows[0]>[] = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'perfis', label: 'Perfis' },
  ];

  const dismissSuccess = () => navigate('/admin/users', { replace: true, state: {} });

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
          <h3 className="text-xl md:text-2xl font-black text-green-950 tracking-tight uppercase">Usuários</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestão de usuários e acesso</p>
        </div>
        <Link
          to="/admin/users/new"
          className="bg-green-950 hover:bg-gold text-white px-5 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={16} /> Novo usuário
        </Link>
      </div>
      <div className="p-6 md:p-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium"
            disabled={loading}
          />
        </div>
        <ListPagination
          meta={meta}
          onPageChange={setPage}
          onPerPageChange={handlePerPage}
          loading={loading}
          position="top"
        />
        {loading ? (
          <div className="border border-gray-100 rounded-2xl py-16 text-center">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">A carregar...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            onEdit={(row) => navigate(`/admin/users/${row.id}/edit`)}
            onDelete={(row) => handleDelete(row)}
            canDelete={(row) => row.id !== currentUser?.id}
            emptyText="Nenhum usuário encontrado."
          />
        )}
        {!loading && (
          <ListPagination
            meta={meta}
            onPageChange={setPage}
            onPerPageChange={handlePerPage}
            loading={loading}
            position="bottom"
          />
        )}
      </div>
    </section>
  );
};

export default UserList;
