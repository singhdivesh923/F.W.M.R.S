import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  PlusCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { CATEGORIES, DEPARTMENTS, WASTE_REASONS } from '../utils/mockData';
import { exportToCSV } from '../utils/exportUtils';

export default function WasteRecordsTable({ 
  records, 
  onEditRecord, 
  onDeleteRecord, 
  onOpenLogModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedReason, setSelectedReason] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // View Detail Modal State
  const [viewRecord, setViewRecord] = useState(null);

  // Filter & Search Logic
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        (r.dish_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.recorded_by || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.department || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'ALL' || r.department === selectedDept;
      const matchesCat = selectedCat === 'ALL' || r.category === selectedCat;
      const matchesReason = selectedReason === 'ALL' || r.reason === selectedReason;

      return matchesSearch && matchesDept && matchesCat && matchesReason;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'cost') {
        valA = parseFloat(a.quantity_kg) * parseFloat(a.unit_cost);
        valB = parseFloat(b.quantity_kg) * parseFloat(b.unit_cost);
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, searchTerm, selectedDept, selectedCat, selectedReason, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Action Header */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Food Waste Audit Records Ledger
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Showing {filteredRecords.length} filtered entries of {records.length} total logs
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => exportToCSV(filteredRecords)} 
              className="btn btn-secondary"
            >
              <Download size={16} /> Export CSV
            </button>
            <button onClick={onOpenLogModal} className="btn btn-primary">
              <PlusCircle size={16} /> Record Waste Entry
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search dish or staff..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ paddingLeft: '2rem' }}
            />
          </div>

          {/* Dept Filter */}
          <select 
            className="form-select"
            value={selectedDept}
            onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Category Filter */}
          <select 
            className="form-select"
            value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Reason Filter */}
          <select 
            className="form-select"
            value={selectedReason}
            onChange={(e) => { setSelectedReason(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Waste Reasons</option>
            {WASTE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer' }}>
                  Date <ArrowUpDown size={12} />
                </th>
                <th>Department</th>
                <th>Meal Service</th>
                <th>Category</th>
                <th onClick={() => toggleSort('dish_name')} style={{ cursor: 'pointer' }}>
                  Dish / Food Item <ArrowUpDown size={12} />
                </th>
                <th onClick={() => toggleSort('quantity_kg')} style={{ cursor: 'pointer' }}>
                  Qty (kg) <ArrowUpDown size={12} />
                </th>
                <th onClick={() => toggleSort('cost')} style={{ cursor: 'pointer' }}>
                  Loss ($) <ArrowUpDown size={12} />
                </th>
                <th>Primary Waste Reason</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => {
                  const itemCost = (parseFloat(r.quantity_kg) * parseFloat(r.unit_cost)).toFixed(2);
                  return (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{r.date}</td>
                      <td>
                        <span className="badge badge-blue">{r.department}</span>
                      </td>
                      <td>{r.meal_type || 'Lunch'}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{r.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.dish_name}</td>
                      <td style={{ fontWeight: 700 }}>{r.quantity_kg} kg</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-rose)' }}>${itemCost}</td>
                      <td>
                        <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                          {r.reason}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => setViewRecord(r)} 
                            className="btn btn-secondary btn-sm"
                            title="View Record Details"
                            style={{ padding: '0.3rem 0.5rem' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => onEditRecord(r)} 
                            className="btn btn-secondary btn-sm"
                            title="Edit Record"
                            style={{ padding: '0.3rem 0.5rem' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Delete waste record "${r.dish_name}"?`)) {
                                onDeleteRecord(r.id);
                              }
                            }} 
                            className="btn btn-danger btn-sm"
                            title="Delete Record"
                            style={{ padding: '0.3rem 0.5rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    <FileSpreadsheet size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No food waste records matched your search filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)'
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewRecord && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="badge badge-emerald">Audit Log Record #{viewRecord.id}</span>
              <button onClick={() => setViewRecord(null)} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem' }}>
                <X size={16} />
              </button>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              {viewRecord.dish_name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date & Service:</span>
                <strong>{viewRecord.date} ({viewRecord.meal_type})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department & Category:</span>
                <strong>{viewRecord.department} • {viewRecord.category}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Waste Weight & Cost:</span>
                <strong style={{ color: 'var(--accent-rose)' }}>{viewRecord.quantity_kg} kg (${(viewRecord.quantity_kg * viewRecord.unit_cost).toFixed(2)})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Root Cause Reason:</span>
                <strong>{viewRecord.reason}</strong>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTION / PREVENTION PLAN:</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                  {viewRecord.action_prevention || 'No specific prevention note recorded for this entry.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setViewRecord(null)} className="btn btn-primary">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
