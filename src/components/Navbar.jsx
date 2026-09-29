import React from 'react';
import { 
  Leaf, 
  Database, 
  PlusCircle, 
  Sun, 
  Moon, 
  Building2, 
  RefreshCw
} from 'lucide-react';
import { FACILITY_TYPES } from '../utils/mockData';

export default function Navbar({ 
  currentFacility, 
  setCurrentFacility, 
  dbConnected, 
  theme, 
  toggleTheme, 
  onOpenLogModal,
  onSyncDb 
}) {
  return (
    <header style={{
      height: '70px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Left Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}>
          <Leaf size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              EcoWaste <span style={{ color: 'var(--accent-emerald)' }}>PRO</span>
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.6875rem', padding: '0.15rem 0.4rem' }}>
              v2.4 Enterprise
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Food Waste Deduction & Reduction Intelligence
          </p>
        </div>
      </div>

      {/* Middle Facility Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.35rem 0.75rem'
        }}>
          <Building2 size={16} color="var(--accent-emerald)" />
          <select 
            value={currentFacility} 
            onChange={(e) => setCurrentFacility(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {FACILITY_TYPES.map((fac) => (
              <option key={fac} value={fac} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        {/* Database Sync Status Badge */}
        <button 
          onClick={onSyncDb}
          title="Click to check MySQL backend status"
          className={dbConnected ? "badge badge-emerald" : "badge badge-amber"} 
          style={{ 
            cursor: 'pointer',
            padding: '0.4rem 0.75rem',
            border: dbConnected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
            fontSize: '0.78125rem'
          }}
        >
          <Database size={13} />
          {dbConnected ? 'MySQL Connected' : 'Local Storage Mode'}
          <RefreshCw size={11} style={{ marginLeft: '4px' }} />
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm"
          title="Toggle Light/Dark Theme"
          style={{ padding: '0.5rem' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <button onClick={onOpenLogModal} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Record Food Waste</span>
        </button>
      </div>
    </header>
  );
}
