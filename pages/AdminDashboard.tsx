
import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, FileText, Mail, MessageSquare, 
  Settings, LogOut, Plus, Search, Edit2, Trash2, 
  ChevronRight, Users, Eye, TrendingUp, HelpCircle, Layers
} from 'lucide-react';
import { useAuth } from '../App';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Services', icon: Layers, path: '/admin/services' },
    { name: 'Blog Posts', icon: FileText, path: '/admin/blog' },
    { name: 'Contacts', icon: MessageSquare, path: '/admin/contacts' },
    { name: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
    { name: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
  ];

  return (
    <div className="w-64 min-h-screen bg-green-950 text-white p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="mb-12">
        <h2 className="text-2xl font-black tracking-tighter">DBR<span className="text-gold">Admin</span></h2>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-xs tracking-widest uppercase ${isActive ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/10">
        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl w-full text-white/40 hover:text-red-400 transition-colors font-black text-xs tracking-widest uppercase"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const DashboardHome = () => (
  <div className="space-y-8 animate-fadeIn">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: 'Weekly Visits', val: '2,840', icon: Eye, color: 'text-blue-500' },
        { label: 'Pending Quotes', val: '12', icon: MessageSquare, color: 'text-gold' },
        { label: 'New Leads', val: '+45', icon: Users, color: 'text-green-500' },
        { label: 'Market Trend', val: '+8.4%', icon: TrendingUp, color: 'text-purple-500' },
      ].map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-black text-green-950">{s.val}</p>
          </div>
          <div className={`p-4 rounded-2xl bg-gray-50 ${s.color}`}>
            <s.icon size={24} />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-green-950 uppercase tracking-tighter mb-6">Recent Contact Requests</h3>
        <div className="space-y-4">
          {[
            { name: 'John Miller', org: 'Global Foods UK', date: '2h ago' },
            { name: 'Ana Garcia', org: 'Sourcing Spain', date: '5h ago' },
            { name: 'Robert Chen', org: 'Asia Nutrition', date: '1d ago' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">{r.name[0]}</div>
                <div>
                  <p className="text-sm font-black text-green-950">{r.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{r.org}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-green-950 uppercase tracking-tighter mb-6">Inventory Overview</h3>
        <div className="space-y-6">
          {[
            { label: 'Organic Chia Seeds', status: 'In Stock', perc: 85 },
            { label: 'White Quinoa', status: 'Running Low', perc: 15 },
            { label: 'Ashwagandha Extract', status: 'Arriving Soon', perc: 0 },
          ].map((p, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-black text-green-950 uppercase">{p.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{p.status}</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${p.perc > 20 ? 'bg-green-500' : 'bg-gold'}`} style={{ width: `${p.perc}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const EntityManagement = ({ title, data, type }: { title: string, data: any[], type: string }) => (
  <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-black text-green-950 tracking-tighter uppercase">{title}</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Manage all {type} entries</p>
      </div>
      <button className="bg-green-950 hover:bg-gold text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2">
        <Plus size={16} /> New Entry
      </button>
    </div>
    
    <div className="p-8">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
        <input type="text" placeholder={`Search ${type}...`} className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-gold transition-all text-sm font-medium" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Name / Title</th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Status / Category</th>
              <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((item, i) => (
              <tr key={i} className="group">
                <td className="py-4 px-4">
                  <p className="text-sm font-black text-green-950">{item.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{item.sub || item.email}</p>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.active ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold'}`}>
                    {item.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-green-950 transition-colors"><Edit2 size={14} /></button>
                    <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-grow pl-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] mb-2">DBR Control Center</h1>
            <h2 className="text-3xl font-black text-green-950 tracking-tighter">Welcome back, Director.</h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 relative">
              <Mail size={18} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-xs font-black text-green-950">Diego Rodrigues</p>
                <p className="text-[10px] text-gold font-bold uppercase">Super Admin</p>
              </div>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" alt="Admin" className="w-10 h-10 rounded-xl object-cover grayscale" />
            </div>
          </div>
        </header>

        <Routes>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<EntityManagement title="Product Inventory" type="product" data={[
            { name: 'Organic Chia Seeds', sub: 'Origins: Paraguay', status: 'Organic', active: true },
            { name: 'White Quinoa', sub: 'Origin: Spain', status: 'Conventional', active: false },
            { name: 'Hemp Seeds', sub: 'Origin: France', status: 'Premium', active: true },
          ]} />} />
          <Route path="blog" element={<EntityManagement title="Blog Management" type="article" data={[
            { name: 'The Evolution of Logistics', sub: 'Published: Oct 12', status: 'Analysis', active: true },
            { name: 'Blockchain in Agriculture', sub: 'Draft', status: 'Draft', active: false },
          ]} />} />
          <Route path="contacts" element={<EntityManagement title="Messages Received" type="contact" data={[
            { name: 'John Miller', email: 'john@globalfoods.com', status: 'Unread', active: false },
            { name: 'Sarah Connor', email: 'sarah@bio-nutrition.de', status: 'Replied', active: true },
          ]} />} />
          <Route path="newsletter" element={<EntityManagement title="Mailing List" type="subscriber" data={[
            { name: 'User 485', email: 'm.schmidt@gmail.com', status: 'Subscribed', active: true },
            { name: 'User 921', email: 'contact@industry.nl', status: 'Subscribed', active: true },
          ]} />} />
          <Route path="*" element={<DashboardHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
