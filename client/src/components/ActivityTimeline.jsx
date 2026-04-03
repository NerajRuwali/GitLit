import { FiActivity, FiGitPullRequest, FiMessageSquare, FiGitCommit } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MOCK_MESSAGES = [
  { id: '1', type: 'commit', repo: 'gitlit-analytics-engine', msg: 'Refactored Go concurrency model for parser.', time: '2 hours ago', icon: <FiGitCommit size={14} /> },
  { id: '2', type: 'pr', repo: 'core-frontend-system', msg: 'Merged Pull Request #412: Cyberpunk Dashboard UI.', time: '5 hours ago', icon: <FiGitPullRequest size={14} /> },
  { id: '3', type: 'issue', repo: 'cyber-ui-kit', msg: 'Closed issue #89: Missing focus ring on standard input.', time: '1 day ago', icon: <FiMessageSquare size={14} /> },
  { id: '4', type: 'commit', repo: 'rusty-cache', msg: 'Updated cargo.toml dependencies and fixed lifetimes.', time: '2 days ago', icon: <FiGitCommit size={14} /> },
];

export default function ActivityTimeline() {
  return (
    <div className="w-full glass-card p-8 bg-white/[0.02] border-white/10 rounded-3xl">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-xl font-black text-white tracking-tighter flex items-center gap-3">
          <FiActivity className="text-red-500" /> Recent Activity
        </h4>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
      </div>

      <div className="relative border-l border-white/10 ml-3 space-y-10">
        {MOCK_MESSAGES.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative pl-8"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[18px] top-1 p-2 rounded-full bg-[#0a0a0a] border border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              {event.icon}
            </div>

            <div className="group cursor-default">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1 block">
                {event.repo} <span className="mx-2">•</span> {event.time}
              </span>
              <p className="text-base text-slate-300 font-medium group-hover:text-white transition-colors">
                {event.msg}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-10 py-3 rounded-xl border border-white/10 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-white/5 transition-all">
        View Complete History
      </button>
    </div>
  );
}
