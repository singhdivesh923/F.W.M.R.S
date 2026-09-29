import React from 'react';
import { 
  TrendingDown, 
  DollarSign, 
  Scale, 
  Leaf, 
  ArrowDownRight, 
  ChevronRight,
  PieChart as PieIcon,
  Flame,
  Plus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

export default function DashboardOverview({ records, onOpenLogModal, onNavigate }) {
  // Aggregate Stats Calculations
  const totalKg = records.reduce((sum, r) => sum + parseFloat(r.quantity_kg || 0), 0);
  const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.quantity_kg || 0) * parseFloat(r.unit_cost || 0)), 0);
  const avgDailyKg = records.length > 0 ? (totalKg / Math.max(1, new Set(records.map(r => r.date)).size)).toFixed(1) : 0;
  const co2PreventedKg = (totalKg * 2.5).toFixed(1);

  // 1. Waste Trend by Date
  const dateMap = {};
  records.forEach(r => {
    if (!dateMap[r.date]) dateMap[r.date] = { date: r.date.slice(5), wasteKg: 0, cost: 0 };
    dateMap[r.date].wasteKg += parseFloat(r.quantity_kg || 0);
    dateMap[r.date].cost += parseFloat(r.quantity_kg || 0) * parseFloat(r.unit_cost || 0);
  });
  const trendData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

  // 2. Category Donut Data
  const catMap = {};
  records.forEach(r => {
    catMap[r.category] = (catMap[r.category] || 0) + parseFloat(r.quantity_kg || 0);
  });
  const categoryData = Object.keys(catMap).map(cat => ({ name: cat, value: parseFloat(catMap[cat].toFixed(1)) }));

  const COLORS = ['#10b981', '#f43f5e', '#06b6d4', '#f59e0b', '#8b5cf6', '#3b82f6', '#64748b'];

  // 3. Department Leaderboard
  const deptMap = {};
  records.forEach(r => {
    if (!deptMap[r.department]) deptMap[r.department] = { dept: r.department, kg: 0, cost: 0, count: 0 };
    deptMap[r.department].kg += parseFloat(r.quantity_kg || 0);
    deptMap[r.department].cost += parseFloat(r.quantity_kg || 0) * parseFloat(r.unit_cost || 0);
    deptMap[r.department].count += 1;
  });
  const topDepartments = Object.values(deptMap).sort((a, b) => b.cost - a.cost);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.05) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem'
      }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            <Leaf size={12} /> Live Waste Audit Overview
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0' }}>
            Food Waste Deduction & Reduction Command Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Real-time monitoring, financial loss calculation, and departmental source tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('analytics')} className="btn btn-secondary">
            <Flame size={16} color="var(--accent-amber)" /> Major Sources Analysis
          </button>
          <button onClick={onOpenLogModal} className="btn btn-primary">
            <Plus size={16} /> Record Waste
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Total Waste */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Waste Recorded
            </span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Scale size={20} color="var(--accent-emerald)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalKg.toFixed(1)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.78125rem', color: '#34d399' }}>
            <ArrowDownRight size={14} /> -12.4% vs last month average
          </div>
        </div>

        {/* KPI 2: Financial Loss */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Waste Cost Loss
            </span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <DollarSign size={20} color="var(--accent-rose)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            ${totalCost.toFixed(2)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
            Calculated at current item cost / kg
          </div>
        </div>

        {/* KPI 3: Daily Avg */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Avg Daily Waste
            </span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingDown size={20} color="var(--accent-blue)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {avgDailyKg} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg / day</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.78125rem', color: 'var(--accent-emerald)' }}>
            Target threshold: &lt; 25 kg / day
          </div>
        </div>

        {/* KPI 4: Carbon Footprint */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Carbon Footprint Impact
            </span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Leaf size={20} color="var(--accent-amber)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {co2PreventedKg} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>kg CO₂e</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem', fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
            ESG footprint calculation
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid-2">
        {/* Daily Waste Trend Area Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Daily Waste Quantity & Cost Trend</h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: 0 }}>Tracking volume variations across logging dates</p>
            </div>
            <span className="badge badge-emerald">Live Trend</span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
                  formatter={(val, name) => [name === 'wasteKg' ? `${val} kg` : `$${val.toFixed(2)}`, name === 'wasteKg' ? 'Waste Volume' : 'Est Cost Loss']}
                />
                <Area type="monotone" dataKey="wasteKg" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Waste Distribution by Food Category</h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: 0 }}>Identifying high-waste ingredient classes</p>
            </div>
            <PieIcon size={18} color="var(--accent-teal)" />
          </div>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  formatter={(value) => [`${value} kg`, 'Quantity']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Department Leaderboard & Recent Logs */}
      <div className="grid-2">
        {/* Department Hotspot Leaderboard */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Departmental Waste Ranking</h3>
            <button onClick={() => onNavigate('analytics')} className="btn btn-secondary btn-sm">
              Full Breakdown <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topDepartments.map((dept, i) => (
              <div key={dept.dept} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i === 0 ? 'rgba(244, 63, 94, 0.2)' : 'var(--bg-card-hover)',
                    color: i === 0 ? 'var(--accent-rose)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8125rem'
                  }}>
                    #{i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {dept.dept}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {dept.count} recorded entries
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                    ${dept.cost.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {dept.kg.toFixed(1)} kg total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Waste Records Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Food Waste Logs</h3>
            <button onClick={() => onNavigate('records')} className="btn btn-secondary btn-sm">
              View All Ledger <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {records.slice(0, 5).map((r) => (
              <div key={r.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {r.dish_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {r.date} • {r.department} • <span style={{ color: 'var(--accent-emerald)' }}>{r.meal_type}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {r.quantity_kg} kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                    ${(r.quantity_kg * r.unit_cost).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
