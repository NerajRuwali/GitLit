import { motion } from 'framer-motion';

const stats = [
  { label: 'Developers Tracked', value: '250K+' },
  { label: 'Commits Analyzed', value: '10M+' },
  { label: 'Repositories Indexed', value: '500K+' },
];

export default function Stats() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="glass-card bg-red-950/20 border border-red-500/20 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center flex-1 text-center relative z-10 w-full">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.3, type: 'spring', stiffness: 100 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              {stat.value}
            </motion.div>
            <span className="text-sm uppercase tracking-widest font-bold text-red-300/80">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
