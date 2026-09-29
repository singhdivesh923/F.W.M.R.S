import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, AlertCircle, PlusCircle, Check } from 'lucide-react';
import { CATEGORIES, DEPARTMENTS, WASTE_REASONS, MEAL_TYPES, FACILITY_TYPES } from '../utils/mockData';

export default function LogWasteModal({ isOpen, onClose, onSave, editingRecord }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meal_type: 'Lunch',
    department: 'Buffet Line',
    category: 'Prepared / Cooked Dishes',
    dish_name: '',
    quantity_kg: '',
    unit_cost: '6.50',
    reason: 'Overproduction / Excess Cooking',
    action_prevention: '',
    recorded_by: 'Head Chef Marco',
    facility_type: 'Hotel Dining & Banquets'
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        date: editingRecord.date,
        meal_type: editingRecord.meal_type || 'Lunch',
        department: editingRecord.department || 'Buffet Line',
        category: editingRecord.category || 'Prepared / Cooked Dishes',
        dish_name: editingRecord.dish_name || '',
        quantity_kg: editingRecord.quantity_kg || '',
        unit_cost: editingRecord.unit_cost || '6.50',
        reason: editingRecord.reason || 'Overproduction / Excess Cooking',
        action_prevention: editingRecord.action_prevention || '',
        recorded_by: editingRecord.recorded_by || 'Admin',
        facility_type: editingRecord.facility_type || 'Hotel Dining & Banquets'
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        meal_type: 'Lunch',
        department: 'Buffet Line',
        category: 'Prepared / Cooked Dishes',
        dish_name: '',
        quantity_kg: '',
        unit_cost: '6.50',
        reason: 'Overproduction / Excess Cooking',
        action_prevention: '',
        recorded_by: 'Head Chef Marco',
        facility_type: 'Hotel Dining & Banquets'
      });
    }
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const totalCost = (parseFloat(formData.quantity_kg || 0) * parseFloat(formData.unit_cost || 0)).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.dish_name || !formData.quantity_kg || parseFloat(formData.quantity_kg) <= 0) {
      alert('Please enter a valid dish name and waste quantity in kg.');
      return;
    }
    onSave({
      ...formData,
      quantity_kg: parseFloat(formData.quantity_kg),
      unit_cost: parseFloat(formData.unit_cost),
      total_cost: parseFloat(totalCost)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.25rem' }}>
              {editingRecord ? 'Edit Waste Entry' : 'New Waste Record'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {editingRecord ? 'Update Food Waste Record' : 'Record Food Waste Audit Entry'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Row 1: Date & Meal Type & Department */}
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Date of Entry</label>
              <input 
                type="date" 
                className="form-input" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meal Service</label>
              <select 
                className="form-select"
                value={formData.meal_type}
                onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
              >
                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department / Station</label>
              <select 
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Category & Dish Name */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Food Waste Category</label>
              <select 
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dish / Specific Food Item</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Grilled Chicken Breast, Rice, Caesar Salad"
                value={formData.dish_name}
                onChange={(e) => setFormData({ ...formData, dish_name: e.target.value })}
                required 
              />
            </div>
          </div>

          {/* Row 3: Quantity (kg), Unit Cost ($/kg) & Auto Total Cost */}
          <div className="grid-3" style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Waste Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1" 
                className="form-input" 
                placeholder="0.0"
                value={formData.quantity_kg}
                onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Estimated Cost ($/kg)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                className="form-input" 
                placeholder="6.50"
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                CALCULATED LOSS
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                ${totalCost}
              </div>
            </div>
          </div>

          {/* Row 4: Primary Reason for Waste */}
          <div className="form-group">
            <label className="form-label">Root Cause / Waste Reason</label>
            <select 
              className="form-select"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            >
              {WASTE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Row 5: Prevention & Action Note */}
          <div className="form-group">
            <label className="form-label">Action / Prevention Plan Notes</label>
            <textarea 
              className="form-textarea"
              rows="2"
              placeholder="e.g. Reduce batch prep on Tuesdays by 15%, train kitchen staff on trimming knife skills..."
              value={formData.action_prevention}
              onChange={(e) => setFormData({ ...formData, action_prevention: e.target.value })}
            />
          </div>

          {/* Row 6: Recorded By & Facility Type */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Auditor / Staff Name</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.recorded_by}
                onChange={(e) => setFormData({ ...formData, recorded_by: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facility Type</label>
              <select 
                className="form-select"
                value={formData.facility_type}
                onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })}
              >
                {FACILITY_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
