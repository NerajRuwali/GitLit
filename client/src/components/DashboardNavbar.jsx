import { FiSearch, FiGithub, FiBell } from 'react-icons/fi';
import SearchBar from './SearchBar';

export default function DashboardNavbar({ query, setQuery, onSearch, loading, profileData }) {
  const defaultAvatar = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  const avatarUrl = profileData?.profile?.avatar || defaultAvatar;

  return (
    <header className="sticky top-0 z-30 w-full h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        {/* We reuse the SearchBar but pass `compact` explicitly */}
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={onSearch}
          loading={loading}
          compact={true}
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <FiBell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-[#0a0a0a]" />
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all shadow-[0_0_15px_rgba(239,68,68,0)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-red-500/30"
        >
          <FiGithub size={20} />
        </a>

        <div className="w-[1px] h-8 bg-white/10" />

        <button className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt="User profile"
            className="w-10 h-10 rounded-full border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] object-cover"
          />
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-sm font-bold text-white tracking-wide">
              {profileData?.profile?.login || 'Explorer'}
            </span>
            <span className="text-xs font-semibold text-slate-500 mt-1">Guest Session</span>
          </div>
        </button>
      </div>
    </header>
  );
}
