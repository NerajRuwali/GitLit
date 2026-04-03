import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-24 text-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-red-500/[0.05] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col items-center gap-12">
          {/* Logo Group */}
          <div className="flex items-center gap-4 group cursor-pointer hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-shadow">
              <span className="text-2xl font-black text-white tracking-tighter pr-0.5">GL</span>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                GitLit
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mt-1 pl-0.5">
                Code Analytics
              </span>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">API Keys</a>
              <a href="#" className="hover:text-white transition-colors">Open Source</a>
            </div>
            
            <p className="text-sm text-slate-600 font-medium tracking-wider pt-6">
              © {new Date().getFullYear()} GitLit Analytics. Built for elite developers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
