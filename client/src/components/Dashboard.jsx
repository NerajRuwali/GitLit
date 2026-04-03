import { FiStar, FiGitCommit, FiUsers, FiGitBranch, FiZap, FiActivity, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import StatCard from './StatCard';

/**
 * Dashboard — stat cards with proper 4-column grid and generous spacing.
 */
export default function Dashboard({ data, type }) {
  if (!data) return null;

  const cards = type === 'user' ? getUserCards(data) : getRepoCards(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          value={card.value}
          label={card.label}
          index={i}
        />
      ))}
    </div>
  );
}

function getUserCards(data) {
  return [
    { icon: <FiUsers size={18} />, value: data.profile?.publicRepos || 0, label: 'Public Repos' },
    { icon: <FiStar size={18} />, value: data.stats?.totalStars || 0, label: 'Total Stars' },
    { icon: <FiGitBranch size={18} />, value: data.stats?.totalForks || 0, label: 'Total Forks' },
    { icon: <FiUsers size={18} />, value: data.profile?.followers || 0, label: 'Followers' },
    { icon: <FiActivity size={18} />, value: data.profile?.following || 0, label: 'Following' },
    { icon: <FiZap size={18} />, value: data.stats?.languages?.length || 0, label: 'Languages' },
  ];
}

function getRepoCards(data) {
  return [
    { icon: <FiGitCommit size={18} />, value: data.totalCommits || 0, label: 'Total Commits' },
    { icon: <FiUsers size={18} />, value: data.totalContributors || 0, label: 'Contributors' },
    { icon: <FiStar size={18} />, value: data.repo?.stars || 0, label: 'Stars' },
    { icon: <FiGitBranch size={18} />, value: data.repo?.forks || 0, label: 'Forks' },
    { icon: <FiZap size={18} />, value: data.analysis?.streaks?.longest || 0, label: 'Longest Streak' },
    { icon: <FiActivity size={18} />, value: data.analysis?.streaks?.current || 0, label: 'Current Streak' },
    { icon: <FiCalendar size={18} />, value: data.analysis?.mostActiveDay || '—', label: 'Most Active Day' },
    { icon: <FiTrendingUp size={18} />, value: data.analysis?.averageCommitsPerDay || 0, label: 'Avg Commits/Day' },
  ];
}
