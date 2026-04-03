import { motion } from 'framer-motion';
import { FiHome, FiFolder, FiActivity, FiCode, FiBarChart2 } from 'react-icons/fi';

export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiHome size={18} /> },
    { id: 'repositories', label: 'Repositories', icon: <FiFolder size={18} /> },
    { id: 'contributions', label: 'Contributions', icon: <FiBarChart2 size={18} /> },
    { id: 'languages', label: 'Languages', icon: <FiCode size={18} /> },
    { id: 'activity', label: 'Activity', icon: <FiActivity size={18} /> },
  ];

  return (
    <aside className="w-64 h-full hidden md:flex flex-col border-r border-white/10 bg-[#0a0a0a] z-40 shrink-0">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <span className="text-sm font-black text-white tracking-tighter pr-0.5">GL</span>
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              GitLit
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500 mt-1">
              Code Analytics
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-red-100 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-red-500/10 border border-red-500/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-red-500' : 'text-slate-500 group-hover:text-red-400'}`}>
                {tab.icon}
              </div>
              <span className={`relative z-10 text-sm font-semibold tracking-wide ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </span>

              {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:border-red-500/30 transition-all hover:bg-red-500/5">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
             <span className="text-xs font-bold text-slate-300 tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
