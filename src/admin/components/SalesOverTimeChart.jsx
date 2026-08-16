import { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const WIDTH = 640;
const HEIGHT = 220;
const PADDING_LEFT = 56;
const PADDING_RIGHT = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SalesOverTimeChart({ data = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (data.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No sales yet"
        description="Revenue over the last 30 days will appear here once orders are paid."
        className="min-h-[220px] py-6"
      />
    );
  }

  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1) * 1.15;

  const barSlot = plotWidth / data.length;
  const barWidth = Math.min(28, barSlot * 0.6);

  const gridValues = [0, 0.5, 1].map((f) => Math.round(maxRevenue * f));
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Revenue over the last 30 days">
        {gridValues.map((value) => {
          const y = PADDING_TOP + plotHeight - (value / maxRevenue) * plotHeight;
          return (
            <g key={value}>
              <line
                x1={PADDING_LEFT}
                x2={WIDTH - PADDING_RIGHT}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-slate-100"
                strokeWidth="1"
              />
              <text x={PADDING_LEFT - 8} y={y + 3} textAnchor="end" className="fill-slate-400 text-[9px]">
                {value >= 1000 ? `${Math.round(value / 1000)}k` : value}
              </text>
            </g>
          );
        })}

        {data.map((point, index) => {
          const x = PADDING_LEFT + index * barSlot + (barSlot - barWidth) / 2;
          const barHeight = (point.revenue / maxRevenue) * plotHeight;
          const y = PADDING_TOP + plotHeight - barHeight;
          const isHovered = hoverIndex === index;

          return (
            <g key={point._id}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 1)}
                rx={3}
                style={{ transformBox: 'fill-box', transformOrigin: 'bottom', transitionDelay: `${index * 10}ms` }}
                className={cn(
                  'transition-all duration-500 ease-out',
                  isHovered ? 'fill-brand-700' : 'fill-brand-500',
                  isMounted ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                )}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              {index % labelEvery === 0 && (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px]"
                >
                  {formatShortDate(point._id)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && (
        <div
          className="pointer-events-none absolute rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
          style={{
            left: `${((PADDING_LEFT + hoverIndex * (plotWidth / data.length) + plotWidth / data.length / 2) / WIDTH) * 100}%`,
            top: 0,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="font-medium text-slate-900">{formatCurrency(data[hoverIndex].revenue)}</p>
          <p className="text-slate-500">{formatShortDate(data[hoverIndex]._id)}</p>
        </div>
      )}
    </div>
  );
}
