import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1.25rem',
      background: 'var(--bg-card)',
      border: type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      color: 'var(--text-primary)',
      fontSize: '0.875rem',
      fontWeight: 600,
      animation: 'fadeIn 0.25s ease-out'
    }}>
      {type === 'success' ? (
        <CheckCircle2 size={20} color="var(--accent-emerald)" />
      ) : (
        <AlertCircle size={20} color="var(--accent-rose)" />
      )}
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '0.5rem'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
