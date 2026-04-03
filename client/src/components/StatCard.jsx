import { motion } from 'framer-motion';

export default function StatCard({ 
  icon, 
  value, 
  label, 
  index = 0,
  prefix = '',
  suffix = ''
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.1 + index * 0.1, 
        cubicBezier: [0.16, 1, 0.3, 1] 
      }}
      className="glass-card flex flex-col items-center justify-center p-6 text-center min-h-[180px]"
    >
      {/* Icon Container with multi-layered glow */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.1)] text-yellow-500">
          {icon}
        </div>
      </div>

      {/* Value */}
      <h3 className="text-2xl md:text-3xl font-black mb-1 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
        {prefix}{value}{suffix}
      </h3>

      {/* Label */}
      <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>

      {/* Subtle bottom glow effect unique to each card */}
      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2/3 h-4 bg-yellow-500/5 blur-xl rounded-full opacity-0 glass-card:hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
