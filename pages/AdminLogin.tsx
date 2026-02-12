
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../App';

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
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern relative overflow-hidden">
      <div className="absolute inset-0 bg-green-950/80 backdrop-blur-md"></div>
      
      <div className="w-full max-w-md p-8 md:p-12 relative z-10 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-gold/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Admin Portal</h1>
            <p className="text-white/50 text-xs font-bold tracking-widest uppercase mt-2">DBR Foods Ecosystem</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-4">Access ID</label>
              <input 
                type="text" 
                defaultValue="admin@dbr-foods.com"
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold uppercase tracking-widest ml-4">Security Code</label>
              <input 
                type="password" 
                defaultValue="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-white hover:text-green-900 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 group mt-8"
            >
              {loading ? 'AUTHORIZING...' : 'ENTER SYSTEM'}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-[10px] text-white/30 uppercase font-bold tracking-widest mt-10">
            Secure Infrastructure • Rotterdam HQ
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
