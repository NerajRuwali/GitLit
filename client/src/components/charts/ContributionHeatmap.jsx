import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartCard } from './CommitTimeline';

/**
 * ContributionHeatmap — Day × Hour heatmap using yellow/amber theme.
 * Features: tooltips on hover, rounded cells, stagger animation, legend.
 */
export default function ContributionHeatmap({ heatmap }) {
  const [tooltip, setTooltip] = useState(null);

  if (!heatmap || !heatmap.grid) return null;

  const { grid, days } = heatmap;
  const maxVal = Math.max(1, ...grid.flat());

  function getColor(value) {
    if (value === 0) return 'var(--heatmap-0)';
    const ratio = value / maxVal;
    if (ratio <= 0.25) return 'var(--heatmap-1)';
    if (ratio <= 0.5) return 'var(--heatmap-2)';
    if (ratio <= 0.75) return 'var(--heatmap-3)';
    return 'var(--heatmap-4)';
  }

  const formatHour = (h) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12} ${ampm}`;
  };

  return (
    <ChartCard title="Activity Heatmap (Day × Hour UTC)">
      <div className="overflow-x-auto pb-2">
        <div className="heatmap-grid" style={{ minWidth: 500, gridTemplateColumns: '40px repeat(24, 1fr)' }}>
          {/* Header row — hours */}
          <div /> {/* empty corner */}
          {Array.from({ length: 24 }, (_, h) => (
            <div key={`h-${h}`} className="heatmap-label justify-center text-center">
              {h % 3 === 0 ? `${h}` : ''}
            </div>
          ))}

          {/* Data rows */}
          {days.map((dayName, dayIdx) => (
            <div key={`row-${dayIdx}`} className="contents">
              <div className="heatmap-label">{dayName}</div>
              {grid[dayIdx].map((val, hourIdx) => (
                <motion.div
                  key={`${dayIdx}-${hourIdx}`}
                  className="heatmap-cell rounded-[4px]"
                  style={{ backgroundColor: getColor(val) }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: dayIdx * 0.04 + hourIdx * 0.008 }}
                  onMouseEnter={() => setTooltip({ dayIdx, hourIdx, val, dayName })}
                  onMouseLeave={() => setTooltip(null)}
                  whileHover={{ scale: 1.5 }}
                >
                  {tooltip?.dayIdx === dayIdx && tooltip?.hourIdx === hourIdx && (
                    <div className="heatmap-tooltip">
                      <strong>{val}</strong> commit{val !== 1 ? 's' : ''} — {dayName} {formatHour(hourIdx)} UTC
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3.5 h-3.5 rounded-[3px]"
              style={{ backgroundColor: `var(--heatmap-${level})` }}
            />
          ))}
          <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </ChartCard>
  );
}
