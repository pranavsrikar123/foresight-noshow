import { monthlyStats } from '../data/bookings';
import { TrendingDown, TrendingUp } from 'lucide-react';

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

function Sparkline({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 220;
  const H = 72;
  const padX = 4;
  const padY = 8;
  const step = (W - padX * 2) / (data.length - 1);

  const pts = data.map((v, i) => ({
    x: padX + i * step,
    y: padY + ((max - v) / range) * (H - padY * 2),
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = [
    `M ${pts[0].x} ${H}`,
    ...pts.map((p) => `L ${p.x} ${p.y}`),
    `L ${pts[pts.length - 1].x} ${H}`,
    'Z',
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* Horizontal guide lines */}
      {[0, 0.5, 1].map((t) => {
        const y = padY + t * (H - padY * 2);
        return (
          <line key={t} x1={padX} y1={y} x2={W - padX} y2={y}
            stroke="#F3F1EF" strokeWidth="1" />
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill="rgba(123,105,255,0.07)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#7B69FF" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots — highlight first and last */}
      {pts.map((p, i) => {
        const isFirst = i === 0;
        const isLast = i === pts.length - 1;
        if (!isFirst && !isLast && i % 2 !== 0) return null;
        return (
          <circle key={i} cx={p.x} cy={p.y} r={isFirst || isLast ? 3.5 : 2.5}
            fill="#7B69FF" opacity={isFirst || isLast ? 1 : 0.55} />
        );
      })}
      {/* Y-axis labels */}
      {[max, min].map((v, i) => (
        <text key={i} x={padX} y={i === 0 ? padY + 4 : H - 2}
          fontSize="8" fill="#C4C0BC" textAnchor="start">{v}</text>
      ))}
    </svg>
  );
}

export default function RevenuePanel() {
  const { totalNoShows, revenueLost, revenueSaved, weeklyTrend } = monthlyStats;
  const recoveryRate = Math.round((revenueSaved / revenueLost) * 100);

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Revenue Impact</h3>
          <p className="text-xs text-gray-400 mt-0.5">This month · The Studio</p>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: '#EEF0FF', color: '#7B69FF' }}
        >
          May 2026
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg p-3" style={{ backgroundColor: '#FEF0EF' }}>
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown size={12} style={{ color: '#E85D5D' }} />
            <span className="text-xs font-medium" style={{ color: '#C0392B' }}>No-shows</span>
          </div>
          <div className="text-xl font-bold" style={{ color: '#C0392B' }}>{totalNoShows}</div>
          <div className="text-xs" style={{ color: '#E8A0A0' }}>£{revenueLost.toLocaleString()} lost</div>
        </div>

        <div className="rounded-lg p-3" style={{ backgroundColor: '#EFF7F3' }}>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp size={12} style={{ color: '#5BA58A' }} />
            <span className="text-xs font-medium" style={{ color: '#2E7D58' }}>Recovered</span>
          </div>
          <div className="text-xl font-bold" style={{ color: '#2E7D58' }}>£{revenueSaved}</div>
          <div className="text-xs" style={{ color: '#8ABFAD' }}>via interventions</div>
        </div>
      </div>

      {/* Recovery rate bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Net recovery rate</span>
          <span className="text-xs font-bold text-gray-900">{recoveryRate}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${recoveryRate}%`, backgroundColor: '#7B69FF', transition: 'width 0.7s ease' }}
          />
        </div>
      </div>

      {/* Sparkline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 font-medium">No-show trend · 8 weeks</p>
          <span className="text-[10px] text-gray-400">↓ trending down</span>
        </div>
        <Sparkline data={weeklyTrend} />
        <div className="flex justify-between mt-1.5">
          {WEEKS.map((w) => (
            <span key={w} className="text-[10px] text-gray-300">{w}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
