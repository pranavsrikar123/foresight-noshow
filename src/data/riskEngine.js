import { SERVICES } from './bookings';

// Weights calibrated so realistic worst-case tops out ~80%
export const RISK_FACTORS = {
  noShowHistory:     { label: 'Prior no-show history',        points: 25, key: 'noShowHistory' },
  newClient:         { label: 'New client',                   points: 20, key: 'newClient' },
  noConfirmation:    { label: 'No confirmation response',     points: 15, key: 'noConfirmation' },
  noDeposit:         { label: 'No deposit taken',             points: 12, key: 'noDeposit' },
  bookedFarInAdvance:{ label: 'Booked >14 days ago',          points: 10, key: 'bookedFarInAdvance' },
  highRiskDay:       { label: 'High no-show day (Mon/Fri)',   points:  8, key: 'highRiskDay' },
  eveningSlot:       { label: 'Late evening slot (after 5pm)',points:  5, key: 'eveningSlot' },
};

// Raw max = 95; cap at 80 so displayed scores stay credible
const RAW_CAP = 80;

export function computeRisk(booking) {
  const factors = [];

  if (booking.hasNoShowHistory)        factors.push(RISK_FACTORS.noShowHistory);
  if (booking.clientNote === 'New client') factors.push(RISK_FACTORS.newClient);
  if (!booking.confirmationResponded)  factors.push(RISK_FACTORS.noConfirmation);
  if (!booking.hasDeposit)             factors.push(RISK_FACTORS.noDeposit);
  if (booking.daysBooked > 14)         factors.push(RISK_FACTORS.bookedFarInAdvance);
  if (booking.isHighRiskDay)           factors.push(RISK_FACTORS.highRiskDay);
  if (booking.isEveningSlot)           factors.push(RISK_FACTORS.eveningSlot);

  const rawScore = factors.reduce((sum, f) => sum + f.points, 0);
  const score = Math.min(rawScore, RAW_CAP);

  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

  const intervention =
    level === 'high'
      ? 'Send personal confirmation + require deposit'
      : level === 'medium'
      ? 'Send additional reminder 2hrs before'
      : 'No action needed';

  const serviceData = SERVICES[booking.service] || { price: 0 };

  return { score, level, factors, intervention, price: serviceData.price };
}

export function getRiskColor(level) {
  switch (level) {
    // Warm coral — urgent but not alarming
    case 'high':   return { bg: '#FEF0EF', text: '#C0392B', border: '#FAC9C6', dot: '#E85D5D' };
    // Soft amber — matches Fresha's neutral palette
    case 'medium': return { bg: '#FEF7EC', text: '#B45309', border: '#FCDFA6', dot: '#E8A838' };
    // Muted sage — professional, not loud
    default:       return { bg: '#EFF7F3', text: '#2E7D58', border: '#B8DDD0', dot: '#5BA58A' };
  }
}
