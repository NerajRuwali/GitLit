import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiTrendingUp, FiZap, FiGitCommit } from 'react-icons/fi';

/**
 * InsightsPanel — Premium insight cards computed from repo analysis data.
 * Shows: Most Active Day, Peak Coding Hour, Avg Commits/Day, Longest Streak, Total Commits.
 */
export default function InsightsPanel({ analysis, totalCommits }) {
  if (!analysis) return null;

  // Derive peak coding hour from peakHours array
  const peakHourIndex = analysis.peakHours
    ? analysis.peakHours.reduce((maxI, val, i, arr) => (val > arr[maxI] ? i : maxI), 0)
    : null;

  const formatHour = (h) => {
    if (h === null || h === undefined) return '—';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const insights = [
    {
      icon: <FiCalendar size={20} />,
      label: 'Most Active Day',
      value: formatDate(analysis.mostActiveDay),
      color: '#eab308',
    },
    {
      icon: <FiClock size={20} />,
      label: 'Peak Coding Hour',
      value: formatHour(peakHourIndex),
      suffix: 'UTC',
      color: '#f59e0b',
    },
    {
      icon: <FiTrendingUp size={20} />,
      label: 'Avg Commits / Day',
      value: analysis.averageCommitsPerDay ?? '—',
      color: '#d97706',
    },
    {
      icon: <FiZap size={20} />,
      label: 'Longest Streak',
      value: analysis.streaks?.longest ?? 0,
      suffix: 'days',
      color: '#ca8a04',
    },
    {
      icon: <FiGitCommit size={20} />,
      label: 'Total Commits',
      value: typeof totalCommits === 'number' ? totalCommits.toLocaleString() : totalCommits ?? '—',
      color: '#b45309',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-16"
    >
      <h3
        className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Deep Analysis & Insights
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {insights.map((item, i) => (
            <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="glass-card p-8 cursor-default flex flex-col h-full transition-all duration-300"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/10 shadow-[0_0_15px_rgba(250,204,21,0.05)]"
              style={{
                background: `rgba(250, 204, 21, 0.1)`,
                color: 'var(--accent)',
              }}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="mt-auto">
              <p
                className="text-2xl font-black tracking-tighter leading-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.value}
                {item.suffix && (
                  <span
                    className="text-[10px] font-bold ml-1 opacity-50"
                  >
                    {item.suffix}
                  </span>
                )}
              </p>

              {/* Label */}
              <p
                className="text-[10px] font-bold mt-3 uppercase tracking-[0.2em]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
