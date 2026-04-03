import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiGitBranch } from 'react-icons/fi';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import Dashboard from './components/Dashboard';
import InsightsPanel from './components/InsightsPanel';
import GitHubHeatmap from './components/charts/GitHubHeatmap';
import CommitTimeline from './components/charts/CommitTimeline';
import TopContributors from './components/charts/TopContributors';
import ContributionPie from './components/charts/ContributionPie';
import LanguagePie from './components/charts/LanguagePie';
import ContributionHeatmap from './components/charts/ContributionHeatmap';
import WordCloud from './components/charts/WordCloud';
import HourlyChart from './components/charts/HourlyChart';
import LoaderSkeleton from './components/LoaderSkeleton';
import AnalyticsDashboard from './components/AnalyticsDashboard'; // NEW SHELL
import { fetchUser, fetchRepo } from './api';

function App() {
  // ===== State =====
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [dataType, setDataType] = useState(null); // 'user' or 'repo'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const queryRef = useRef(query);
  const resultsRef = useRef(null);

  // Synchronize ref for callback stability
  const setQueryWrapped = (val) => {
    setQuery(val);
    queryRef.current = val;
  };

  // Helper to parse "owner/repo" or "username"
  function parseInput(input) {
    const trimmed = input.trim();
    if (trimmed.includes('github.com')) {
      const parts = trimmed.split('github.com/')[1].split('/');
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    }
    if (trimmed.includes('/')) {
      const [owner, repo] = trimmed.split('/');
      if (owner && repo) return { owner, repo };
    }
    return { username: trimmed };
  }

  // ===== Search Logic =====
  const doSearch = useCallback(async (overrideQuery) => {
    const q = overrideQuery || queryRef.current;
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setError(null);
    setData(null);

    try {
      const parsed = parseInput(q);
      let result;
      if (parsed.username) {
        result = await fetchUser(parsed.username);
        if (!result || !result.profile) {
          throw new Error('User profile data not found. GitHub might be having issues or the username is invalid.');
        }
        setDataType('user');
      } else {
        result = await fetchRepo(parsed.owner, parsed.repo);
        if (!result || !result.repo) {
          throw new Error('Repository data not found. Please check the URL or repository name.');
        }
        setDataType('repo');
      }

      setData(result);

      // Auto-scroll to results after short delay for animation
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      console.error('SEARCH ERROR:', err);
      
      let errorMessage = 'Unable to fetch data. Try again.';
      
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data.error === 'string') errorMessage = data.error;
        else if (data.error?.message) errorMessage = data.error.message;
        else if (typeof data.message === 'string') errorMessage = data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // RENDER 1: Dashboard Application View
  // ============================================
  if (hasSearched || loading || data) {
    return (
      <div className="dark min-h-screen w-full relative bg-[#0a0a0a] text-[#e5e7eb] font-sans selection:bg-red-500/30">
        <CursorGlow />
        
        {/* Error State Overlay */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-card p-6 border-red-500/30 bg-[#111]/90 shadow-[0_10px_40px_rgba(239,68,68,0.2)]"
            >
              <div className="flex items-center gap-4 text-red-500">
                <FiAlertCircle size={24} />
                <div>
                  <h4 className="font-bold">Analysis Interrupted</h4>
                  <p className="text-sm text-red-400 font-medium">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-4 px-4 py-1.5 rounded-full bg-red-500/10 text-xs font-bold hover:bg-red-500/20 transition-colors">Dismiss</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

         <AnalyticsDashboard 
           data={data} 
           dataType={dataType} 
           query={query} 
           setQuery={setQueryWrapped} 
           onSearch={doSearch} 
           loading={loading} 
         />
      </div>
    );
  }

  // ============================================
  // RENDER 2: Landing Page View
  // ============================================
  return (
    <div className="dark min-h-screen relative bg-[#0a0a0a] text-[#e5e7eb] font-sans selection:bg-red-500/30">
      <CursorGlow />
      
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-noise opacity-5" />

        <motion.div
          animate={{ x: [0, 150, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="blob top-[-10%] left-[-10%] opacity-40 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -150, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="blob bottom-[-10%] right-[-10%] opacity-40 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-[20%] left-1/4 w-[30vw] h-[30vh] bg-red-500/5 blur-[100px] rounded-full" />
      </div>

      <Navbar />

      <div className="relative z-10 w-full min-h-screen flex flex-col pt-16">
        <Hero 
          hasSearched={hasSearched}
          query={query}
          setQuery={setQueryWrapped}
          onSearch={doSearch}
          loading={loading}
        />
        <Features />
        <Stats />
      </div>
      
      <Footer />
    </div>
  );
}

export default App;
