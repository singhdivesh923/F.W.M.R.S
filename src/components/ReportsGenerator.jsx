import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download 
} from 'lucide-react';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';

export default function ReportsGenerator({ records, currentFacility }) {
  const [reportType, setReportType] = useState('executive');
  const [dateRange, setDateRange] = useState('this_month');

  // Calculate filtered stats
  const totalKg = records.reduce((sum, r) => sum + parseFloat(r.quantity_kg || 0), 0);
  const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.quantity_kg || 0) * parseFloat(r.unit_cost || 0)), 0);

  // Top source
  const deptMap = {};
  records.forEach(r => {
    deptMap[r.department] = (deptMap[r.department] || 0) + (parseFloat(r.quantity_kg) * parseFloat(r.unit_cost));
  });
  const topSource = Object.keys(deptMap).sort((a, b) => deptMap[b] - deptMap[a])[0] || 'Kitchen Prep';

  const statsObj = { totalKg, totalCost, topSource };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
            <FileSpreadsheet size={12} /> Audit & Executive Report Suite
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0' }}>
            Custom Report Generator & PDF Export
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Generate print-ready PDF audit reports, CSV sheets, and sustainability compliance files.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => exportToCSV(records)} 
            className="btn btn-secondary"
          >
            <Download size={16} /> Export Raw CSV
          </button>
          <button 
            onClick={() => exportToPDF(records, statsObj, currentFacility)} 
            className="btn btn-primary"
          >
            <FileText size={16} /> Generate & Download PDF
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid-2">
        {/* Report Options Selector */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Report Parameters & Format
          </h3>

          <div className="form-group">
            <label className="form-label">Select Report Template Type</label>
            <select 
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="executive">Executive Summary & Audit Report</option>
              <option value="sources">Major Waste Sources & Loss Analysis</option>
              <option value="departmental">Departmental Performance Audit</option>
              <option value="esg">ESG & Sustainability Carbon Footprint</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Timeframe / Date Range</label>
            <select 
              className="form-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today's Logs</option>
              <option value="this_week">Last 7 Days</option>
              <option value="this_month">Current Month (September 2026)</option>
              <option value="all_time">All Recorded History</option>
            </select>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Report Inclusions:</h4>
            <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', margin: 0 }}>
              <li>Facility branding ({currentFacility})</li>
              <li>Calculated total waste volume ({totalKg.toFixed(1)} kg)</li>
              <li>Financial loss estimation (${totalCost.toFixed(2)})</li>
              <li>Verified audit sign-off section for Quality Manager</li>
            </ul>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>PDF Report Document Preview</h3>
            <span className="badge badge-emerald">Ready to Export</span>
          </div>

          {/* Simulated Paper Document */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            fontFamily: 'Helvetica, Arial, sans-serif',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '0.8125rem'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#10b981', fontSize: '1rem', fontWeight: 800 }}>EcoWaste PRO</h4>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Food Waste Audit Report</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#475569' }}>
                <div><strong>{currentFacility}</strong></div>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Summary Box */}
            <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>TOTAL VOLUME</div>
                <div style={{ fontWeight: 800 }}>{totalKg.toFixed(1)} kg</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>FINANCIAL LOSS</div>
                <div style={{ fontWeight: 800, color: '#ef4444' }}>${totalCost.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>TOP SOURCE</div>
                <div style={{ fontWeight: 800 }}>{topSource}</div>
              </div>
            </div>

            {/* Sample Table Rows */}
            <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                  <th style={{ padding: '3px 4px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '3px 4px', textAlign: 'left' }}>Dept</th>
                  <th style={{ padding: '3px 4px', textAlign: 'left' }}>Dish</th>
                  <th style={{ padding: '3px 4px', textAlign: 'right' }}>Qty</th>
                  <th style={{ padding: '3px 4px', textAlign: 'right' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 4).map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '3px 4px' }}>{r.date}</td>
                    <td style={{ padding: '3px 4px' }}>{r.department}</td>
                    <td style={{ padding: '3px 4px' }}>{r.dish_name}</td>
                    <td style={{ padding: '3px 4px', textAlign: 'right' }}>{r.quantity_kg}kg</td>
                    <td style={{ padding: '3px 4px', textAlign: 'right', color: '#ef4444' }}>${(r.quantity_kg * r.unit_cost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sign-off */}
            <div style={{ marginTop: '1rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748b' }}>
              <div>Sign: ____________________</div>
              <div>Date: ____________________</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
