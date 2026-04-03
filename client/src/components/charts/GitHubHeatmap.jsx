import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartCard } from './CommitTimeline';

/**
 * GitHubHeatmap — GitHub-style contribution grid using yellow color shades.
 * Renders 7 rows (days) × N weeks from commitsPerDay data.
 */
export default function GitHubHeatmap({ commitsPerDay }) {
  const [tooltip, setTooltip] = useState(null);

  if (!commitsPerDay || Object.keys(commitsPerDay).length === 0) return null;

  // Build a full grid from the earliest date to the latest
  const dates = Object.keys(commitsPerDay).sort();
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  // Align start to Sunday
  const gridStart = new Date(startDate);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  // Align end to Saturday
  const gridEnd = new Date(endDate);
  gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

  // Build array of all days
  const allDays = [];
  const d = new Date(gridStart);
  while (d <= gridEnd) {
    const key = d.toISOString().slice(0, 10);
    allDays.push({ date: key, count: commitsPerDay[key] || 0 });
    d.setDate(d.getDate() + 1);
  }

  // Group into weeks (columns)
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const maxCount = Math.max(...allDays.map((d) => d.count), 1);

  function getColor(count) {
    if (count === 0) return 'var(--heatmap-0)';
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 'var(--heatmap-1)';
    if (ratio <= 0.5) return 'var(--heatmap-2)';
    if (ratio <= 0.75) return 'var(--heatmap-3)';
    return 'var(--heatmap-4)';
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month labels for the top
  const monthLabels = [];
  let lastMonth = '';
  weeks.forEach((week, wi) => {
    const mid = week[Math.min(3, week.length - 1)];
    if (mid) {
      const m = mid.date.slice(0, 7);
      if (m !== lastMonth) {
        monthLabels.push({ index: wi, label: new Date(mid.date + 'T00:00:00').toLocaleString('en', { month: 'short' }) });
        lastMonth = m;
      }
    }
  });

  return (
    <ChartCard title="Contribution Activity" className="w-full">
      <div className="heatmap-wrapper w-full overflow-x-hidden">
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: 36 }}>
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="text-[10px] font-medium"
              style={{
                color: 'var(--text-muted)',
                position: 'relative',
                left: `${(m.index / weeks.length) * 100}%`,
                marginRight: i < monthLabels.length - 1 ? 'auto' : 0,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Grid: days (rows) × weeks (columns) */}
        <div className="flex w-full gap-[2px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] pr-2 shrink-0">
            {dayLabels.map((d, i) => (
              <div
                key={d}
                className="flex items-center justify-end"
                style={{
                  height: 16,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  opacity: i % 2 === 1 ? 1 : 0,
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px] flex-1">
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  className="heatmap-cell"
                  style={{ 
                    backgroundColor: getColor(day.count),
                    aspectRatio: 'auto',
                    minWidth: '2px',
                    width: '100%',
                    height: '16px',
                    borderRadius: '2px'
                  }}
                  onMouseEnter={() => setTooltip(day)}
                  onMouseLeave={() => setTooltip(null)}
                  whileHover={{ scale: 1.4 }}
                >
                  {tooltip?.date === day.date && (
                    <div className="heatmap-tooltip">
                      <strong>{day.count}</strong> commit{day.count !== 1 ? 's' : ''} on{' '}
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `var(--heatmap-${level})` }}
            />
          ))}
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </ChartCard>
  );
}
