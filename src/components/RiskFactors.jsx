import { AlertCircle, CheckCircle } from 'lucide-react';

export default function RiskFactors({ factors, intervention, level }) {
  const interventionColor =
    level === 'high' ? '#DC2626' : level === 'medium' ? '#D97706' : '#16A34A';
  const interventionBg =
    level === 'high' ? '#FEF2F2' : level === 'medium' ? '#FFFBEB' : '#F0FDF4';

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Risk Factors
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {factors.length === 0 ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" /> No risk factors detected
          </span>
        ) : (
          factors.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#F3F1EF', color: '#374151', border: '1px solid #E5E7EB' }}
            >
              <span className="text-gray-400">+{f.points}</span>
              {f.label}
            </span>
          ))
        )}
      </div>

      {intervention !== 'No action needed' && (
        <div
          className="flex items-start gap-2 rounded-lg p-2.5"
          style={{ backgroundColor: interventionBg }}
        >
          <AlertCircle size={14} style={{ color: interventionColor, marginTop: 1, flexShrink: 0 }} />
          <p className="text-xs font-medium" style={{ color: interventionColor }}>
            Recommend: {intervention}
          </p>
        </div>
      )}
    </div>
  );
}
