import { useEffect, useRef } from 'react';
import { ChartCard } from './CommitTimeline';

/**
 * WordCloud — canvas-based word cloud using d3-cloud.
 * Shows most frequent words from commit messages.
 */
export default function WordCloud({ words, dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!words || words.length === 0 || !canvasRef.current) return;

    // Dynamically import d3-cloud (it's a CommonJS module)
    import('d3-cloud').then((mod) => {
      const cloud = mod.default || mod;

      const canvas = canvasRef.current;
      const width = 1200; // Ultra-wide to force words to distribute horizontally
      const height = 400;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      const maxValue = Math.max(...words.map((w) => w.value));
      const scaledWords = words.map((w) => ({
        text: w.text,
        size: 12 + (w.value / maxValue) * 40,
        value: w.value,
      }));

      const colors = dark
        ? ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#f87171', '#fca5a5', '#ef4444', '#7f1d1d', '#ffffff', '#d1d5db']
        : ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a', '#b91c1c', '#ef4444', '#dc2626', '#171717', '#4b5563'];

      cloud()
        .size([width, height])
        .words(scaledWords)
        .padding(4)
        .rotate(() => (Math.random() > 0.7 ? 90 : 0))
        .font('Inter, system-ui, sans-serif')
        .fontSize((d) => d.size)
        .on('end', (output) => {
          ctx.clearRect(0, 0, width, height);
          ctx.save();
          ctx.translate(width / 2, height / 2);

          output.forEach((word, i) => {
            ctx.save();
            ctx.translate(word.x, word.y);
            ctx.rotate((word.rotate * Math.PI) / 180);
            ctx.fillStyle = colors[i % colors.length];
            ctx.font = `${word.size}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = 0.85;
            ctx.fillText(word.text, 0, 0);
            ctx.restore();
          });

          ctx.restore();
        })
        .start();
    });
  }, [words, dark]);

  if (!words || words.length === 0) return null;

  return (
    <ChartCard title="Commit Message Word Cloud" className="flex-1 min-h-[300px]">
      <div className="flex-1 w-full relative min-h-[250px] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </ChartCard>
  );
}
