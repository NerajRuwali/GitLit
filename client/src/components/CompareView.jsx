import { motion } from 'framer-motion';
import { FiGitCommit, FiUsers, FiStar, FiGitBranch, FiZap, FiTrendingUp } from 'react-icons/fi';
import CommitTimeline from './charts/CommitTimeline';
import TopContributors from './charts/TopContributors';
import ContributionPie from './charts/ContributionPie';

/**
 * CompareView — Premium side-by-side comparison of two repositories.
 * Features: stat highlighting with winner badges, glass cards, Framer Motion.
 */
export default function CompareView({ data }) {
  if (!data || !data.repo1 || !data.repo2) return null;

  const r1 = data.repo1;
  const r2 = data.repo2;

  const statRows = [
    { label: 'Commits', icon: <FiGitCommit size={16} />, v1: r1.totalCommits, v2: r2.totalCommits },
    { label: 'Contributors', icon: <FiUsers size={16} />, v1: r1.totalContributors, v2: r2.totalContributors },
    { label: 'Stars', icon: <FiStar size={16} />, v1: r1.repo.stars, v2: r2.repo.stars },
    { label: 'Forks', icon: <FiGitBranch size={16} />, v1: r1.repo.forks, v2: r2.repo.forks },
    { label: 'Streak', icon: <FiZap size={16} />, v1: r1.analysis?.streaks?.longest || 0, v2: r2.analysis?.streaks?.longest || 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-8 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        {r1.repo.fullName}{' '}
        <span className="gradient-text-yellow">vs</span>{' '}
        {r2.repo.fullName}
      </motion.h2>

      {/* Stat Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
          📊 Head-to-Head
        </h3>

        <div className="space-y-3">
          {statRows.map((row, i) => {
            const winner = row.v1 > row.v2 ? 1 : row.v2 > row.v1 ? 2 : 0;
            return (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="grid grid-cols-3 items-center gap-4 py-3 px-4 rounded-xl"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                {/* Repo 1 value */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-bold"
                    style={{ color: winner === 1 ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {(row.v1 ?? 0).toLocaleString()}
                  </span>
                  {winner === 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                      ⬆
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="flex items-center justify-center gap-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>{row.icon}</span>
                  {row.label}
                </div>

                {/* Repo 2 value */}
                <div className="flex items-center justify-end gap-2">
                  {winner === 2 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
                      ⬆
                    </span>
                  )}
                  <span
                    className="text-lg font-bold"
                    style={{ color: winner === 2 ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {(row.v2 ?? 0).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Repo labels */}
        <div className="grid grid-cols-3 mt-4 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          <span>{r1.repo.fullName}</span>
          <span className="text-center" />
          <span className="text-right">{r2.repo.fullName}</span>
        </div>
      </motion.div>

      {/* Side-by-side Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass-card p-4 mb-4">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{r1.repo.fullName}</h4>
            {r1.repo.description && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r1.repo.description}</p>}
          </div>
          <div className="space-y-6">
            <CommitTimeline data={r1.analysis.commitsPerMonth} label="Commits / Month" />
            <TopContributors contributors={r1.analysis.topContributors} />
            {r1.analysis.topContributors && <ContributionPie contributors={r1.analysis.topContributors} />}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass-card p-4 mb-4">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{r2.repo.fullName}</h4>
            {r2.repo.description && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r2.repo.description}</p>}
          </div>
          <div className="space-y-6">
            <CommitTimeline data={r2.analysis.commitsPerMonth} label="Commits / Month" />
            <TopContributors contributors={r2.analysis.topContributors} />
            {r2.analysis.topContributors && <ContributionPie contributors={r2.analysis.topContributors} />}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
