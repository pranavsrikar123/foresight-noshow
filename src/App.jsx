import { useState, useMemo } from 'react';
import { Zap, Filter } from 'lucide-react';
import BookingCard from './components/BookingCard';
import SummaryBar from './components/SummaryBar';
import RevenuePanel from './components/RevenuePanel';
import Toast from './components/Toast';
import { bookings, SERVICES } from './data/bookings';
import { computeRisk } from './data/riskEngine';

const FILTER_OPTIONS = ['All', 'High', 'Medium', 'Low'];

export default function App() {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [actionsTaken, setActionsTaken] = useState({});
  const [toast, setToast] = useState(null);

  const enriched = useMemo(() =>
    bookings.map((b) => ({ ...b, risk: computeRisk(b) })),
    []
  );

  const filtered = useMemo(() => {
    if (filter === 'All') return enriched;
    return enriched.filter((b) => b.risk.level === filter.toLowerCase());
  }, [filter, enriched]);

  const stats = useMemo(() => {
    const atRisk = enriched.filter((b) => b.risk.level !== 'low').length;
    const revenueAtRisk = enriched
      .filter((b) => b.risk.level !== 'low')
      .reduce((s, b) => s + (SERVICES[b.service]?.price || 0), 0);
    const depositCount = enriched.filter((b) => b.hasDeposit).length;
    return { totalBookings: enriched.length, atRisk, revenueAtRisk, saveRate: 65, depositCount };
  }, [enriched]);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAction = (id, type, clientName) => {
    setActionsTaken((prev) => ({ ...prev, [id]: type }));
    const messages = {
      reminder: `Reminder sent to ${clientName}`,
      deposit: `Deposit request sent to ${clientName}`,
      waitlist: `${clientName} added to waitlist backfill`,
    };
    setToast(messages[type]);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F3F1EF' }}>
      {/* Sticky nav */}
      <header
        className="bg-white border-b border-gray-100 sticky top-0 z-40"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#7B69FF' }}
              >
                <Zap size={14} fill="#C5FF00" stroke="none" />
              </div>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#060911' }}
              >
                Foresight
              </span>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: '#EEF0FF', color: '#7B69FF' }}
            >
              No-Show Intelligence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">The Studio · Shoreditch</span>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: '#060911', color: '#C5FF00' }}
            >
              TS
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Monday, 19 May 2026</h1>
          <p className="text-sm text-gray-400 mt-1">
            Risk intelligence for today's bookings · updated 08:14
          </p>
        </div>

        {/* Summary stats */}
        <div className="mb-6">
          <SummaryBar stats={stats} />
        </div>

        {/* Main layout */}
        <div className="flex gap-5 items-start">
          {/* Booking list */}
          <div className="flex-1 min-w-0">
            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-4">
              <Filter size={14} className="text-gray-400" />
              <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-gray-100">
                {FILTER_OPTIONS.map((opt) => {
                  const count = opt === 'All'
                    ? enriched.length
                    : enriched.filter((b) => b.risk.level === opt.toLowerCase()).length;
                  return (
                    <button
                      key={opt}
                      onClick={() => { setFilter(opt); setExpandedId(null); }}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
                      style={{
                        backgroundColor: filter === opt ? '#7B69FF' : 'transparent',
                        color: filter === opt ? '#fff' : '#6B7280',
                      }}
                    >
                      {opt}
                      {opt !== 'All' && (
                        <span className="ml-1 opacity-70">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No bookings match this filter.
                </div>
              ) : (
                filtered.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onAction={handleAction}
                    actionTaken={!!actionsTaken[booking.id]}
                    isExpanded={expandedId === booking.id}
                    onToggle={() => handleToggle(booking.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="w-72 flex-shrink-0">
            <RevenuePanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-6 mt-10 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap size={12} style={{ color: '#7B69FF' }} />
            <span className="text-xs text-gray-400">Powered by Foresight · No-Show Intelligence</span>
          </div>
          <span className="text-xs text-gray-300">
            Prototype built by Pranav Srikar · LBS 2026
          </span>
        </div>
      </footer>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
