import { Calendar, AlertTriangle, PoundSterling, TrendingUp, Shield } from 'lucide-react';

export default function SummaryBar({ stats }) {
  const { totalBookings, atRisk, revenueAtRisk, saveRate, depositCount } = stats;
  const depositPct = Math.round((depositCount / totalBookings) * 100);

  const items = [
    {
      icon: <Calendar size={17} style={{ color: '#7B69FF' }} />,
      label: "Today's Bookings",
      value: totalBookings,
      sub: 'appointments',
      accent: '#7B69FF',
      bg: '#EEF0FF',
    },
    {
      icon: <AlertTriangle size={17} style={{ color: '#B45309' }} />,
      label: 'At-Risk Bookings',
      value: atRisk,
      sub: 'need attention',
      accent: '#B45309',
      bg: '#FEF7EC',
    },
    {
      icon: <PoundSterling size={17} style={{ color: '#C0392B' }} />,
      label: 'Revenue at Risk',
      value: `£${revenueAtRisk}`,
      sub: 'potential loss today',
      accent: '#C0392B',
      bg: '#FEF0EF',
    },
    {
      icon: <TrendingUp size={17} style={{ color: '#2E7D58' }} />,
      label: 'Recoverable',
      value: `~${saveRate}%`,
      sub: 'with interventions',
      accent: '#2E7D58',
      bg: '#EFF7F3',
    },
    {
      icon: <Shield size={17} style={{ color: '#7B69FF' }} />,
      label: 'Deposit Coverage',
      value: `${depositCount}/${totalBookings}`,
      sub: `${depositPct}% of bookings secured`,
      accent: depositPct >= 50 ? '#2E7D58' : '#B45309',
      bg: depositPct >= 50 ? '#EFF7F3' : '#FEF7EC',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-5 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl p-4 border border-gray-100"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
            style={{ backgroundColor: item.bg }}
          >
            {item.icon}
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: item.accent, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {item.value}
          </div>
          <div className="text-xs font-semibold text-gray-900 mt-0.5">{item.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
