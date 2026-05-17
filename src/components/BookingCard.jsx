import { ChevronDown, Clock, User, Scissors } from 'lucide-react';
import RiskBadge from './RiskBadge';
import RiskFactors from './RiskFactors';
import QuickActions from './QuickActions';
import { computeRisk } from '../data/riskEngine';

export default function BookingCard({ booking, onAction, actionTaken, isExpanded, onToggle }) {
  const { score, level, factors, intervention, price } = computeRisk(booking);

  return (
    <div
      className="bg-white rounded-xl border transition-all duration-200 cursor-pointer select-none"
      style={{
        borderColor: isExpanded ? '#7B69FF' : '#E9E7E5',
        boxShadow: isExpanded
          ? '0 0 0 1px #7B69FF, 0 4px 16px rgba(123,105,255,0.08)'
          : '0 1px 3px rgba(0,0,0,0.04)',
        opacity: actionTaken ? 0.62 : 1,
      }}
      onClick={onToggle}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Initials avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: '#EEF0FF', color: '#7B69FF' }}
            >
              {booking.client.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-gray-900">{booking.client}</span>
                <span className="text-xs text-gray-400">{booking.clientNote}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Scissors size={11} />
                  {booking.service}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={11} />
                  {booking.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <User size={11} />
                  {booking.stylist}
                </span>
                {price > 0 && (
                  <span className="text-xs font-semibold text-gray-700">£{price}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <RiskBadge level={level} score={score} />
            <span
              className="text-gray-300 transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'block' }}
            >
              <ChevronDown size={16} />
            </span>
          </div>
        </div>

        {isExpanded && (
          <div onClick={(e) => e.stopPropagation()}>
            <RiskFactors factors={factors} intervention={intervention} level={level} />
            <QuickActions
              booking={booking}
              riskLevel={level}
              actionTaken={actionTaken}
              onAction={onAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}
