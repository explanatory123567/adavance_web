import React from 'react';
import './Toast.css';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';
export default function Toast() {
  const {
    toasts,
    removeToast
  } = useApp();
  if (toasts.length === 0) return null;
  return <div className="toast-container inline-toast-0">
      {toasts.map(toast => {
      let borderColor = 'rgba(0, 240, 255, 0.4)';
      let glowColor = 'rgba(0, 240, 255, 0.2)';
      let IconComponent = Info;
      let iconColor = 'var(--neon-cyan)';
      if (toast.type === 'success') {
        borderColor = 'rgba(16, 185, 129, 0.5)';
        glowColor = 'rgba(16, 185, 129, 0.25)';
        IconComponent = CheckCircle2;
        iconColor = '#34d399';
      } else if (toast.type === 'warning') {
        borderColor = 'rgba(245, 158, 11, 0.5)';
        glowColor = 'rgba(245, 158, 11, 0.25)';
        IconComponent = AlertCircle;
        iconColor = '#fbbf24';
      } else if (toast.type === 'danger') {
        borderColor = 'rgba(239, 68, 68, 0.5)';
        glowColor = 'rgba(239, 68, 68, 0.25)';
        IconComponent = AlertCircle;
        iconColor = '#f87171';
      }
      return <div key={toast.id} style={{
        background: '#0d1326',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.6), 0 0 20px ${glowColor}`,
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        pointerEvents: 'auto',
        animation: 'scaleUp 0.2s ease-out',
        backdropFilter: 'blur(10px)'
      }}>
            <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor
        }}>
              <IconComponent size={18} />
            </div>

            <div className="inline-toast-1">
              <div className="inline-toast-2">
                {toast.title}
                <Zap size={11} color="var(--neon-cyan)" />
              </div>
              <div className="inline-toast-3">
                {toast.message}
              </div>
            </div>

            <button onClick={() => removeToast(toast.id)} className="inline-toast-4">
              <X size={15} />
            </button>
          </div>;
    })}
    </div>;
}
