import { useState, useMemo } from 'react';
import {
  Zap, Filter, Calendar, Users, BarChart2, Settings,
  Bell, ChevronDown, LayoutDashboard,
} from 'lucide-react';
import BookingCard from './components/BookingCard';
import SummaryBar from './components/SummaryBar';
import RevenuePanel from './components/RevenuePanel';
import Toast from './components/Toast';
import { bookings, SERVICES } from './data/bookings';
import { computeRisk } from './data/riskEngine';

const FILTER_OPTIONS = ['All', 'High', 'Medium', 'Low'];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',  active: false },
  { icon: Calendar,         label: 'Bookings',   active: true  },
  { icon: Users,            label: 'Clients',    active: false },
  { icon: BarChart2,        label: 'Analytics',  active: false },
  { icon: Settings,         label: 'Settings',   active: false },
];

function Sidebar() {
  return (
    <aside
      className="w-52 flex-shrink-0 flex flex-col sticky top-0 h-screen border-r"
      style={{ backgroundColor: '#fff', borderColor: '#ECEAE8' }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-5 border-b" style={{ borderColor: '#ECEAE8' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#7B69FF' }}>
          <Zap size={14} fill="#C5FF00" stroke="none" />
        </div>
        <div>
          <div className="font-bold text-sm leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#060911' }}>
            Foresight
          </div>
          <div className="text-[10px] text-gray-400 leading-tight">No-Show Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors duration-100"
            style={{
              backgroundColor: active ? '#EEF0FF' : 'transparent',
              color: active ? '#7B69FF' : '#6B7280',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = '#F7F7FA';
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Salon info */}
      <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: '#ECEAE8' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#060911', color: '#C5FF00' }}>
            TS
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-gray-900 truncate">The Studio</div>
            <div className="text-[10px] text-gray-400 truncate">Shoreditch, London</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

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

  const handleToggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleAction = (id, type, clientName) => {
    setActionsTaken((prev) => ({ ...prev, [id]: type }));
    setToast({
      reminder: `Reminder sent to ${clientName}`,
      deposit: `Deposit request sent to ${clientName}`,
      waitlist: `${clientName} added to waitlist backfill`,
    }[type]);
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3F1EF' }}>
      <Sidebar />

      {/* Right: topbar + content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="h-14 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40 flex-shrink-0"
          style={{ borderColor: '#ECEAE8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div>
            <h1 className="text-base font-bold text-gray-900"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Today's Bookings
            </h1>
            <p className="text-xs text-gray-400">Monday, 19 May 2026 · updated 08:14</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              style={{ backgroundColor: '#F7F7F5' }}>
              <Bell size={15} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
              style={{ backgroundColor: '#F7F7F5' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: '#7B69FF', color: '#fff' }}>
                E
              </div>
              <span className="text-xs font-medium text-gray-700">Emma</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable page body */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-7" style={{ maxWidth: 1400 }}>

            {/* Summary stats */}
            <div className="mb-7">
              <SummaryBar stats={stats} />
            </div>

            {/* Booking list + Revenue panel */}
            <div className="flex gap-6 items-start">

              {/* Booking list */}
              <div className="flex-1 min-w-0">
                {/* Filter row */}
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={13} className="text-gray-400" />
                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border"
                    style={{ borderColor: '#E9E7E5' }}>
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
                            <span className="ml-1 opacity-60">({count})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-3">
                  {filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
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

              {/* Revenue side panel */}
              <div className="w-80 flex-shrink-0">
                <RevenuePanel />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-5 border-t flex items-center justify-between"
              style={{ borderColor: '#E9E7E5' }}>
              <div className="flex items-center gap-1.5">
                <Zap size={11} style={{ color: '#7B69FF' }} />
                <span className="text-xs text-gray-400">Powered by Foresight · No-Show Intelligence</span>
              </div>
              <span className="text-xs text-gray-300">Prototype built by Pranav Srikar · LBS 2026</span>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
