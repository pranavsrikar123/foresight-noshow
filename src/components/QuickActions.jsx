import { Bell, CreditCard, Users, CheckCircle } from 'lucide-react';

export default function QuickActions({ booking, riskLevel, actionTaken, onAction }) {
  if (riskLevel === 'low') return null;

  if (actionTaken) {
    return (
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
        <CheckCircle size={14} className="text-green-500" />
        <span className="text-xs text-green-600 font-medium">Action taken</span>
      </div>
    );
  }

  const btnBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer border';

  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
      <button
        className={btnBase}
        style={{ backgroundColor: '#7B69FF', color: '#fff', borderColor: '#7B69FF' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6556e6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#7B69FF'; }}
        onClick={() => onAction(booking.id, 'reminder', booking.client)}
      >
        <Bell size={12} /> Send Reminder
      </button>

      {riskLevel === 'high' && (
        <button
          className={btnBase}
          style={{ backgroundColor: '#fff', color: '#060911', borderColor: '#E5E7EB' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7B69FF'; e.currentTarget.style.color = '#7B69FF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#060911'; }}
          onClick={() => onAction(booking.id, 'deposit', booking.client)}
        >
          <CreditCard size={12} /> Request Deposit
        </button>
      )}

      <button
        className={btnBase}
        style={{ backgroundColor: '#fff', color: '#060911', borderColor: '#E5E7EB' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7B69FF'; e.currentTarget.style.color = '#7B69FF'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#060911'; }}
        onClick={() => onAction(booking.id, 'waitlist', booking.client)}
      >
        <Users size={12} /> Add to Waitlist
      </button>
    </div>
  );
}
