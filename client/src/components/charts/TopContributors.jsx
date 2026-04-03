import { useRef } from 'react';
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
import { ChartCard } from './CommitTimeline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * TopContributors — horizontal bar chart showing top contributors.
 */
export default function TopContributors({ contributors }) {
  const chartRef = useRef(null);

  if (!contributors || contributors.length === 0) return null;

  const chartData = {
    labels: contributors.map((c) => c.login),
    datasets: [
      {
        label: 'Contributions',
        data: contributors.map((c) => c.contributions),
        backgroundColor: [
          'rgba(234, 179, 8, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(217, 119, 6, 0.9)',
          'rgba(180, 83, 9, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(252, 211, 77, 0.9)',
          'rgba(253, 230, 138, 0.8)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(217, 119, 6, 0.5)',
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: 'var(--text-muted)', font: { size: 11 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { size: 11 } },
      },
    },
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-contributors.png';
    a.click();
  };

  return (
    <ChartCard title="Top Contributors" onExport={exportChart}>
      <div style={{ height: Math.max(200, contributors.length * 36) }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </ChartCard>
  );
}
