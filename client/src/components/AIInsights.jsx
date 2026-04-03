import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCpu, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function AIInsights({ data, dataType }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!data || dataType !== 'repo') return;
    
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        commits: data.totalCommits || 0,
        languages: data.analysis?.languages || {},
        contributors: data.totalContributors || 0,
        stars: data.repo?.stars || 0,
        forks: data.repo?.forks || 0,
        streak: data.analysis?.streaks || {},
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/ai-insights`, payload);
      
      setInsights(response.data.insights || []);
    } catch (err) {
      console.error('Failed to fetch AI insights', err);
      const msg = err.response?.data?.error || 'Unable to analyze repository data. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.repo?.fullName]);

  if (dataType !== 'repo') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 w-full relative overflow-hidden group mb-8"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <FiCpu size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg tracking-tight text-slate-100 flex items-center gap-2">
              AI Insights
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">BETA</span>
            </h3>
            <p className="text-xs text-slate-400">Powered by OpenAI GPT-4</p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>

      <div className="relative z-10 w-full">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-4 h-4 rounded-full bg-white/5 shrink-0 skeleton" />
                <div className="h-4 rounded bg-white/5 w-full max-w-md skeleton" style={{ width: `${Math.random() * 40 + 40}%` }} />
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 animate-pulse">
              <FiCpu className="text-red-400" /> Analyzing repository metrics...
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
            <FiAlertTriangle className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 text-sm text-slate-300"
              >
                <FiCheckCircle className="text-red-500 shrink-0 mt-1" />
                <span className="leading-relaxed">{insight}</span>
              </motion.div>
            ))}
            
            {insights.length === 0 && (
              <div className="text-sm text-slate-400 italic">No insights available for this repository.</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
