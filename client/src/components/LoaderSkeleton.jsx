import { motion } from 'framer-motion';

/**
 * LoaderSkeleton — shimmer skeleton UI for loading states.
 */
export default function LoaderSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="glass-card p-6"
          >
            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="skeleton w-24 h-8 rounded-lg mb-2" />
            <div className="skeleton w-20 h-3 rounded" />
          </motion.div>
        ))}
      </div>

      {/* Insights skeleton */}
      <div className="mb-10">
        <div className="skeleton w-32 h-5 rounded-lg mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-5">
              <div className="skeleton w-10 h-10 rounded-xl mb-3" />
              <div className="skeleton w-full h-7 rounded-lg mb-2" />
              <div className="skeleton w-16 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap skeleton */}
      <div className="glass-card p-8 mb-10 h-64 flex flex-col justify-between">
         <div className="skeleton w-48 h-5 rounded-lg mb-6" />
         <div className="skeleton w-full h-full rounded-xl" />
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
            className="glass-card p-6"
          >
            <div className="skeleton w-40 h-5 rounded-lg mb-5" />
            <div className="skeleton w-full h-52 rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
