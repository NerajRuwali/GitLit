import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartCard } from './CommitTimeline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * HourlyChart — bar chart showing commit activity by hour (0–23 UTC).
 * Uses the peakHours array from the backend analytics.
 */
export default function HourlyChart({ hours }) {
  const chartRef = useRef(null);

  if (!hours || hours.length === 0) return null;

  const labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const maxVal = Math.max(...hours);

  // Color gradient: darker at peak, lighter at low
  const barColors = hours.map((v) => {
    const intensity = maxVal > 0 ? v / maxVal : 0;
    return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
  });

  const borderColors = hours.map((v) => {
    const intensity = maxVal > 0 ? v / maxVal : 0;
    return `rgba(239, 68, 68, ${0.5 + intensity * 0.5})`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data: hours,
        backgroundColor: barColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderWidth: 1,
        callbacks: {
          title: (items) => `${items[0].label} UTC`,
          label: (item) => `${item.raw} commit${item.raw !== 1 ? 's' : ''}`,
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          maxTicksLimit: 12,
          font: { size: 10, family: 'Inter' },
        },
      },
      y: {
        border: { display: false },
        grid: { color: 'rgba(148, 163, 184, 0.07)' },
        ticks: { color: '#64748b', font: { size: 10, family: 'Inter' } },
        beginAtZero: true,
      },
    },
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hourly-activity.png';
    a.click();
  };

  return (
    <ChartCard title="Peak Activity Hours (UTC)" onExport={exportChart}>
      <div style={{ height: 280 }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
    </ChartCard>
  );
}
