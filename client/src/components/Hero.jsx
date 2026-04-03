import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

export default function Hero({ hasSearched, query, setQuery, onSearch, loading }) {
  return (
    <motion.section
      layout
      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
      className={`px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative w-full ${!hasSearched ? 'min-h-[calc(100vh-160px)] mt-16 pt-10' : 'pt-24 md:pt-28 pb-10 border-b border-red-500/10 bg-[#0a0a0a]/80 backdrop-blur-sm shadow-[0_4px_30px_rgba(239,68,68,0.15)]'}`}
    >
      <div className={`max-w-4xl mx-auto w-full text-center transition-all duration-700 ${hasSearched ? 'scale-95 opacity-90' : 'scale-100'}`}>
        <motion.div layout>
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-8 relative shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              LIVE ANALYSIS
            </motion.div>
          )}

          <motion.h1
            layout
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, cubicBezier: [0.16, 1, 0.3, 1] }}
            className={`font-black tracking-tight transition-all duration-700 leading-tight text-white ${!hasSearched ? 'text-5xl md:text-7xl mb-6' : 'text-2xl md:text-4xl mb-6'}`}
          >
            Analyze GitHub
            <br />
            <span className="gradient-text-red">With Precision</span>
          </motion.h1>
        </motion.div>

        <AnimatePresence>
          {!hasSearched && (
            <motion.p
              key="hero-subtitle"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.6 }}
              className="text-lg md:text-xl text-slate-400 max-w-4xl w-full mx-auto leading-relaxed mb-16 font-medium px-2"
            >
              Analyze contribution patterns, commit activity, and complex metrics behind any public repository or user profile instantly.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className={`w-full mx-auto transition-all duration-700 relative z-20 ${!hasSearched ? 'mb-12 max-w-4xl' : 'mb-4 max-w-2xl'}`}
        >
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={onSearch}
            loading={loading}
            compact={hasSearched}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {!hasSearched && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-400/60">Discover Insights</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-red-500/50 to-transparent" />
        </motion.div>
      )}
    </motion.section>
  );
}
