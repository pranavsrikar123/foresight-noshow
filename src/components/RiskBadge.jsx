import { getRiskColor } from '../data/riskEngine';

export default function RiskBadge({ level, score, size = 'md' }) {
  const colors = getRiskColor(level);
  const label = level.charAt(0).toUpperCase() + level.slice(1);

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${padding}`}
      style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      <span
        className="rounded-full"
        style={{ width: size === 'sm' ? 6 : 7, height: size === 'sm' ? 6 : 7, backgroundColor: colors.dot, flexShrink: 0 }}
      />
      {label} · {score}%
    </span>
  );
}
