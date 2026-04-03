import { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartCard } from './CommitTimeline';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * LanguagePie — doughnut chart showing language distribution
 * by bytes of code in a repository.
 */
export default function LanguagePie({ languages }) {
  const chartRef = useRef(null);

  if (!languages || Object.keys(languages).length === 0) return null;

  const sorted = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const totalBytes = sorted.reduce((s, [, v]) => s + v, 0);

  const labels = sorted.map(([lang]) => lang);
  const values = sorted.map(([, bytes]) => bytes);
  const percentages = values.map((v) => ((v / totalBytes) * 100).toFixed(1));

  const colors = [
    'rgba(99, 102, 241, 0.85)',   // indigo
    'rgba(245, 158, 11, 0.85)',   // amber
    'rgba(16, 185, 129, 0.85)',   // emerald
    'rgba(236, 72, 153, 0.85)',   // pink
    'rgba(139, 92, 246, 0.85)',   // violet
    'rgba(6, 182, 212, 0.85)',    // cyan
    'rgba(251, 146, 60, 0.85)',   // orange
    'rgba(34, 211, 238, 0.85)',   // sky
    'rgba(250, 204, 21, 0.85)',   // yellow
    'rgba(168, 85, 247, 0.85)',   // purple
    'rgba(52, 211, 153, 0.85)',   // teal
    'rgba(244, 63, 94, 0.85)',    // rose
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-secondary)',
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12 },
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label} (${percentages[i]}%)`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: 'transparent',
              pointStyle: 'circle',
              index: i,
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const bytes = ctx.raw;
            const pct = percentages[ctx.dataIndex];
            const kb = (bytes / 1024).toFixed(1);
            return `${ctx.label}: ${kb} KB (${pct}%)`;
          },
        },
      },
    },
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'language-distribution.png';
    a.click();
  };

  return (
    <ChartCard title="Language Distribution" onExport={exportChart} className="flex-1 min-h-[300px]">
      <div className="flex-1 w-full relative min-h-[250px]">
        <Doughnut ref={chartRef} data={chartData} options={options} />
      </div>
    </ChartCard>
  );
}
