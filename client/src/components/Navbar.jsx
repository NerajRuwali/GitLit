import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';

/**
 * Navbar — premium minimal bar with GitLit text and GitHub link.
 */
export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-[#0a0a0a]/80 transition-all duration-300"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-transform group-hover:scale-110">
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

        {/* Right side */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/your-username/gitlit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <FiGithub size={16} />
            <span>Git-Hub</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
