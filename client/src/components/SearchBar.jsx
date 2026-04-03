import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';

const EXAMPLE_REPOS = [
  { label: 'facebook/react', value: 'facebook/react' },
  { label: 'torvalds', value: 'torvalds' },
  { label: 'vuejs/vue', value: 'vuejs/vue' },
];

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
  compact = false,
}) {
  const [recent, setRecent] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gitlit-recent');
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        setRecent([]);
      }
    }
  }, []);

  const saveToRecent = (val) => {
    if (!val || val.trim() === '') return;
    const newRecent = [val, ...recent.filter((r) => r !== val)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem('gitlit-recent', JSON.stringify(newRecent));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveToRecent(query);
    onSearch();
  };

  const handleRecentClick = (val) => {
    setQuery(val);
    onSearch(val);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative z-10 w-full mb-12 mt-6">
        <div className={`flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch md:items-center w-full transition-all duration-500`}>
          <div className="relative flex-1 group">
            <FiSearch
              size={compact ? 24 : 28}
              className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-400 text-slate-500`}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username or repo..."
              className={`search-input w-full !pl-20 !pr-20 transition-all duration-500 !bg-white/5 backdrop-blur-md !border-white/10 focus:!border-red-500/50 focus:!bg-white/10 rounded-full ${compact ? '!py-4 text-lg' : '!py-6 md:!py-8 text-xl md:text-2xl'} shadow-2xl`}
              style={{ color: 'var(--text-primary)' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-500 hover:text-white"
              >
                <FiX size={compact ? 24 : 28} />
              </button>
            )}
          </div>
          
          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn-primary shadow-[0_4px_20px_rgba(239,68,68,0.25)] transition-all duration-500 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold tracking-widest uppercase border border-white/10 ${compact ? 'min-w-[160px] !py-4 text-base' : 'min-w-[240px] !py-6 text-xl'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className={`border-2 border-white/20 border-t-white rounded-full animate-spin ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                {compact ? '' : 'Analyzing…'}
              </span>
            ) : (
              compact ? 'Search' : 'Analyze Now'
            )}
          </motion.button>
        </div>

        {/* Popular & Recent */}
        {!loading && !compact && (
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {recent.length > 0 && (
               <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">History</span>
                  {recent.slice(0, 2).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRecentClick(r)}
                      className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                    >
                      {r}
                    </button>
                  ))}
               </div>
            )}
            <div className="flex items-center gap-4 border-l border-white/5 pl-8 ml-2">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Explore</span>
               {EXAMPLE_REPOS.map((repo) => (
                 <button
                   key={repo.value}
                   type="button"
                   onClick={() => handleRecentClick(repo.value)}
                   className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                 >
                   {repo.label}
                 </button>
               ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
