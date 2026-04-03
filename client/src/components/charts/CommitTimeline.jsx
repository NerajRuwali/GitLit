import { useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * CommitTimeline — bar chart with Daily / Monthly toggle.
 */
export default function CommitTimeline({ dailyData, monthlyData, data, label = 'Commits', dark = true }) {
  const chartRef = useRef(null);
  const [view, setView] = useState('daily');

  // Support both new props (dailyData/monthlyData) and legacy (data)
  const daily = dailyData || (view === 'daily' ? data : null);
  const monthly = monthlyData || (view === 'monthly' ? data : null);
  const activeData = view === 'daily' ? daily : monthly;

  if (!activeData || Object.keys(activeData).length === 0) return null;

  const labels = Object.keys(activeData);
  const values = Object.values(activeData);

  const chartData = {
    labels,
    datasets: [
      {
        label: view === 'daily' ? 'Commits / Day' : 'Commits / Month',
        data: values,
        backgroundColor: '#ef4444',
        borderRadius: 4,
        barThickness: 'flex',
        maxBarThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: dark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: dark ? '#f1f5f9' : '#1c1917',
        bodyColor: dark ? '#cbd5e1' : '#57534e',
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        borderColor: dark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.4)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: dark ? '#64748b' : '#78716c',
          maxRotation: 45,
          maxTicksLimit: 12,
          font: { size: 10, family: 'Inter' },
        },
      },
      y: {
        border: { display: false },
        grid: { color: dark ? 'rgba(148, 163, 184, 0.07)' : 'rgba(120, 113, 108, 0.1)' },
        ticks: { color: dark ? '#64748b' : '#78716c', font: { size: 10, family: 'Inter' } },
        beginAtZero: true,
      },
    },
    interaction: { intersect: false, mode: 'index' },
    animation: {
      duration: 600,
      easing: 'easeInOutQuart',
    },
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `commit-timeline-${view}.png`;
    a.click();
  };

  const showToggle = dailyData && monthlyData;

  return (
    <ChartCard
      title="Commit Frequency"
      onExport={exportChart}
      toggle={showToggle ? { view, setView } : null}
      className="flex-1 min-h-[300px]"
    >
      <div className="flex-1 w-full relative min-h-[250px]">
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </ChartCard>
  );
}

/** Reusable glass chart card wrapper with framer-motion + optional toggle */
export function ChartCard({ title, onExport, toggle, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-6 flex flex-col w-full h-full ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {toggle && (
            <div
              className="flex rounded-lg overflow-hidden text-xs"
              style={{ border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => toggle.setView('daily')}
                className="px-3 py-1 font-medium cursor-pointer transition-colors"
                style={{
                  background: toggle.view === 'daily' ? 'var(--accent)' : 'transparent',
                  color: toggle.view === 'daily' ? '#fff' : 'var(--text-muted)',
                }}
              >
                Daily
              </button>
              <button
                onClick={() => toggle.setView('monthly')}
                className="px-3 py-1 font-medium cursor-pointer transition-colors"
                style={{
                  background: toggle.view === 'monthly' ? 'var(--accent)' : 'transparent',
                  color: toggle.view === 'monthly' ? '#fff' : 'var(--text-muted)',
                }}
              >
                Monthly
              </button>
            </div>
          )}
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="export-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            <FiDownload size={11} /> PNG
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}
