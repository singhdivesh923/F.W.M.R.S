import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  FileSpreadsheet, 
  Database, 
  TrendingDown 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, totalWasteKg, totalCostLoss }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'records', label: 'Waste Ledger Records', icon: ClipboardList },
    { id: 'analytics', label: 'Major Waste Sources', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet },
    { id: 'database', label: 'MySQL DB Manager', icon: Database }
  ];

  return (
    <aside className="sidebar">
      {/* Navigation Header */}
      <div style={{ padding: '1.25rem 1rem 0.5rem 1rem' }}>
        <p style={{ 
          fontSize: '0.6875rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          color: 'var(--text-muted)',
          letterSpacing: '0.05em'
        }}>
          Main Navigation
        </p>
      </div>

      {/* Nav Items List */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-emerald)' : '3px solid transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-emerald)' : 'var(--text-secondary)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Quick Stats Widget */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingDown size={16} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
              Monthly Target
            </span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            -18.4% Waste
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Saved approx <strong style={{ color: 'var(--accent-emerald)' }}>${(totalCostLoss * 0.184).toFixed(0)}</strong> this cycle.
          </p>
          <div style={{ 
            height: '6px', 
            background: 'var(--bg-input)', 
            borderRadius: '3px', 
            marginTop: '0.75rem',
            overflow: 'hidden'
          }}>
            <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #10b981, #14b8a6)', borderRadius: '3px' }} />
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div style={{ 
        padding: '1rem', 
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--bg-card-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: 'var(--accent-emerald)'
        }}>
          AD
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Admin Operations
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Quality & Sustainability
          </div>
        </div>
      </div>
    </aside>
  );
}
