import { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartCard } from './CommitTimeline';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * ContributionPie — doughnut chart for contribution distribution.
 */
export default function ContributionPie({ contributors }) {
  const chartRef = useRef(null);

  if (!contributors || contributors.length === 0) return null;

  // Take top 8 and group the rest as "Others"
  const top = contributors.slice(0, 8);
  const rest = contributors.slice(8);
  const othersTotal = rest.reduce((s, c) => s + c.contributions, 0);

  const labels = top.map((c) => c.login);
  const values = top.map((c) => c.contributions);
  if (othersTotal > 0) {
    labels.push('Others');
    values.push(othersTotal);
  }

  const colors = [
    'rgba(234, 179, 8, 0.9)',
    'rgba(245, 158, 11, 0.9)',
    'rgba(217, 119, 6, 0.9)',
    'rgba(180, 83, 9, 0.9)',
    'rgba(251, 191, 36, 0.9)',
    'rgba(252, 211, 77, 0.9)',
    'rgba(253, 230, 138, 0.8)',
    'rgba(234, 179, 8, 0.7)',
    'rgba(217, 119, 6, 0.6)',
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
        position: 'right',
        labels: {
          color: 'var(--text-secondary)',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const exportChart = () => {
    const chart = chartRef.current;
    if (!chart) return;
    const url = chart.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contribution-distribution.png';
    a.click();
  };

  return (
    <ChartCard title="Contribution Distribution" onExport={exportChart}>
      <div style={{ height: 300 }}>
        <Doughnut ref={chartRef} data={chartData} options={options} />
      </div>
    </ChartCard>
  );
}
