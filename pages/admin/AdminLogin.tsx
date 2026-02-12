import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../App';

const AdminLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      login();
      navigate('/admin/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-green-950 relative overflow-hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.20),_transparent_50%)]" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <img src="/Layer_1-1.png" alt="DBR Foods" className="h-8 w-auto mx-auto mb-4" />
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Usuário</label>
              <input
                type="text"
                defaultValue="admin@dbr-foods.com"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-green-950 outline-none focus:border-gold transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 text-green-950 outline-none focus:border-gold transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-950 hover:bg-gold text-white px-8 py-4 rounded-xl font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 group mt-7"
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
