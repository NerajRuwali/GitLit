import { motion } from 'framer-motion';
import { FiTrendingUp, FiClock, FiCode } from 'react-icons/fi';

const features = [
  {
    icon: <FiTrendingUp size={24} className="text-red-400" />,
    title: 'Deep Analytics',
    description: 'Uncover hidden patterns in commit history and pinpoint exactly when and where your best code is written.',
  },
  {
    icon: <FiClock size={24} className="text-red-500" />,
    title: 'Timeline Tracking',
    description: 'Visualize project velocity over time with interactive heatmaps, hourly contribution breakdowns, and activity timelines.',
  },
  {
    icon: <FiCode size={24} className="text-red-600" />,
    title: 'Language Profiling',
    description: 'Understand technology stacks instantly with beautiful visualizations mapping out exact language usage across repositories.',
  },
];

export default function Features() {
  return (
    <section className="w-full max-w-full lg:px-24 md:px-12 px-6 py-24 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
        {features.map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.04] hover:border-red-500/40 hover:shadow-[0_4px_30px_rgba(239,68,68,0.15)] transition-all duration-500 overflow-hidden"
          >
            {/* Hover Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-red-500/15 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
