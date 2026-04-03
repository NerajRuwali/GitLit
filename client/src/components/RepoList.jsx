import { motion } from 'framer-motion';
import { FiStar, FiGitBranch, FiFolder } from 'react-icons/fi';

const MOCK_REPOS = [
  { id: 1, name: 'core-frontend-system', desc: 'The next generation React 19 micro-frontend monorepo for enterprise applications.', stars: 1423, forks: 82, lang: 'TypeScript' },
  { id: 2, name: 'gitlit-analytics-engine', desc: 'High-speed Go microservice for parsing raw git tree data at scale.', stars: 840, forks: 45, lang: 'Go' },
  { id: 3, name: 'cyber-ui-kit', desc: 'A headless UI component library built for futuristic web applications.', stars: 621, forks: 20, lang: 'TypeScript' },
  { id: 4, name: 'rusty-cache', desc: 'Blazing fast Redis proxy layer written in Rust for sub-millisecond lookups.', stars: 219, forks: 12, lang: 'Rust' },
];

export default function RepoList() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-black text-white tracking-tighter flex items-center gap-3">
          <FiFolder className="text-red-500" /> Top Repositories
        </h4>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white cursor-pointer transition-colors">View All →</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REPOS.map((repo, i) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative glass-card p-6 border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-red-500/20 rounded-2xl cursor-pointer overflow-hidden"
          >
            {/* Hover Lift Soft Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h5 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{repo.name}</h5>
                <p className="text-sm text-slate-400 font-medium leading-relaxed line-clamp-2">{repo.desc}</p>
              </div>
              
              <div className="flex items-center gap-6 mt-6">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" /> 
                  {repo.lang}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                  <FiStar className="text-yellow-500" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                  <FiGitBranch className="text-slate-400" /> {repo.forks}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
