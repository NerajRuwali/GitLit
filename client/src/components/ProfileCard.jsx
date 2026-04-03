import { motion } from 'framer-motion';
import { FiMapPin, FiTwitter, FiLink, FiUsers } from 'react-icons/fi';

export default function ProfileCard({ data, dataType }) {
  if (!data) return null;

  const isUser = dataType === 'user';
  const avatar = isUser ? data.profile?.avatar : data.repo?.owner?.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
  const name = isUser ? (data.profile?.name || data.profile?.login) : data.repo?.name;
  const login = isUser ? data.profile?.login : data.repo?.owner?.login;
  const description = isUser ? data.profile?.bio : data.repo?.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card flex flex-col md:flex-row items-center md:items-start gap-8 p-10 bg-white/[0.02] border-white/10 hover:border-red-500/20 hover:shadow-[0_10px_40px_rgba(239,68,68,0.1)] transition-all duration-500 rounded-3xl"
    >
      <div className="relative group shrink-0">
        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={avatar}
          alt={login}
          className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl border border-white/10 object-cover"
          onError={(e) => { e.target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }}
        />
      </div>

      <div className="flex flex-col flex-1 w-full mt-2">
        <h3 className="text-4xl md:text-5xl font-black mb-1 leading-tight text-white tracking-tighter">
          {name || 'GitHub Entity'}
        </h3>
        
        <div className="flex flex-wrap items-center gap-4 mt-3 mb-6">
          <span className="text-xs font-bold text-red-400 uppercase tracking-[0.2em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
            @{login || 'anonymous'}
          </span>
          {isUser && data.profile?.location && (
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <FiMapPin className="text-red-500" /> {data.profile.location}
            </span>
          )}
          {isUser && data.profile?.twitter && (
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <FiTwitter className="text-blue-400" /> @{data.profile.twitter}
            </span>
          )}
          {!isUser && data.repo?.language && (
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-red-500" /> {data.repo.language}
            </span>
          )}
        </div>

        {description && (
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-slate-400 font-medium">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
