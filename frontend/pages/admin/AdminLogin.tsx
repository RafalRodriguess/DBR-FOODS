import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../App';
const logoImage = '/Layer_1-1.png';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.20),_transparent_50%)]" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <img src={logoImage} alt="DBR Foods" className="h-10 w-auto mx-auto mb-6 block" />
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dbr-foods.com"
                required
                autoComplete="email"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-green-950 outline-none focus:border-gold transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-green-950 outline-none focus:border-gold transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-950 hover:bg-gold text-white px-8 py-4 rounded-xl font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 group mt-7 disabled:opacity-70"
            >
              {loading ? 'AUTORIZANDO...' : 'ENTRAR NO SISTEMA'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
