import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300"
      style={{
        backgroundColor: '#060911',
        color: '#fff',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        minWidth: 260,
        maxWidth: 360,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      <CheckCircle size={16} style={{ color: '#C5FF00', flexShrink: 0 }} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
