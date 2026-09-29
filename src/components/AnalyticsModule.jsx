import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  Sparkles, 
  Lightbulb
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export default function AnalyticsModule({ records }) {
  const [targetReductionPct, setTargetReductionPct] = useState(20);

  // 1. Calculate Waste by Dish / Item for Major Sources Identification
  const dishMap = {};
  records.forEach(r => {
    if (!dishMap[r.dish_name]) {
      dishMap[r.dish_name] = {
        name: r.dish_name,
        category: r.category,
        department: r.department,
        totalKg: 0,
        totalCost: 0,
        reasons: {}
      };
    }
    const kg = parseFloat(r.quantity_kg || 0);
    const cost = kg * parseFloat(r.unit_cost || 0);
    dishMap[r.dish_name].totalKg += kg;
    dishMap[r.dish_name].totalCost += cost;
    dishMap[r.dish_name].reasons[r.reason] = (dishMap[r.dish_name].reasons[r.reason] || 0) + kg;
  });

  const sortedDishes = Object.values(dishMap).sort((a, b) => b.totalCost - a.totalCost);

  // Total waste cost
  const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.quantity_kg) * parseFloat(r.unit_cost)), 0);
  const totalKg = records.reduce((sum, r) => sum + parseFloat(r.quantity_kg), 0);

  // 2. Departmental Breakdown
  const deptMap = {};
  records.forEach(r => {
    const cost = parseFloat(r.quantity_kg) * parseFloat(r.unit_cost);
    deptMap[r.department] = (deptMap[r.department] || 0) + cost;
  });
  const deptChartData = Object.keys(deptMap).map(d => ({
    department: d,
    cost: parseFloat(deptMap[d].toFixed(2))
  })).sort((a, b) => b.cost - a.cost);

  // Annual Financial Savings Projection
  const annualLoss = totalCost * 12;
  const projectedSavings = (annualLoss * (targetReductionPct / 100)).toFixed(2);

  // Intelligent Reduction Suggestions Generator
  const generateSuggestions = () => {
    const suggestions = [];
    if (sortedDishes.length > 0) {
      const top1 = sortedDishes[0];
      suggestions.push({
        id: 1,
        title: `Primary Loss Source: ${top1.name}`,
        desc: `${top1.name} in ${top1.department} accounts for $${top1.totalCost.toFixed(2)} (${((top1.totalCost/totalCost)*100).toFixed(0)}% of total waste loss). Recommend reducing initial batch production by 20% during lunch service.`,
        priority: 'High Impact',
        color: 'var(--accent-rose)'
      });
    }

    const overprodRecords = records.filter(r => r.reason.includes('Overproduction'));
    if (overprodRecords.length > 0) {
      const overprodKg = overprodRecords.reduce((sum, r) => sum + parseFloat(r.quantity_kg), 0);
      suggestions.push({
        id: 2,
        title: 'Buffet & Service Line Batch Size Calibration',
        desc: `Overproduction accounts for ${overprodKg.toFixed(1)} kg of waste. Switch from 1/1 full size hotel pans to 1/3 size pans during the final hour of buffet service to minimize unserved food disposal.`,
        priority: 'Medium Impact',
        color: 'var(--accent-amber)'
      });
    }

    const expiryRecords = records.filter(r => r.reason.includes('Expiration') || r.reason.includes('Spoilage'));
    if (expiryRecords.length > 0) {
      suggestions.push({
        id: 3,
        title: 'Storage & Expiration Discount Clearance',
        desc: 'Inventory expiration waste detected. Implement a daily 50% discount happy hour bundle for bakery & prepared items 1 hour before kitchen closing, or partner with local food rescue charities for tax deduction credits.',
        priority: 'Quick Win',
        color: 'var(--accent-emerald)'
      });
    }

    return suggestions;
  };

  const suggestionsList = generateSuggestions();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(244, 63, 94, 0.06) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
            <Flame size={12} /> Root Cause & Source Identification
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0' }}>
            Major Waste Sources & Reduction ROI Calculator
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Pareto 80/20 analysis pinpointing top financial leaks and action recommendations.
          </p>
        </div>
      </div>

      {/* Top 2 Grid: Major Source Ranking & Department Cost Bar Chart */}
      <div className="grid-2">
        {/* Top Waste Items Ranking */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Top Wasted Dish / Item Leaderboard
              </h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: 0 }}>
                Ranked by financial loss impact ($)
              </p>
            </div>
            <span className="badge badge-rose">Pareto Hotspot</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedDishes.slice(0, 5).map((dish, idx) => {
              const pctOfTotal = ((dish.totalCost / totalCost) * 100).toFixed(1);
              return (
                <div key={dish.name} style={{
                  padding: '0.875rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        color: idx === 0 ? 'var(--accent-rose)' : 'var(--text-muted)'
                      }}>
                        #{idx + 1}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{dish.name}</strong>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-rose)', fontSize: '0.9375rem' }}>
                      ${dish.totalCost.toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Location: {dish.department} • {dish.category}</span>
                    <span>{dish.totalKg.toFixed(1)} kg ({pctOfTotal}% of loss)</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: '4px', background: 'var(--bg-card-hover)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, pctOfTotal * 2.5)}%`, height: '100%', background: idx === 0 ? 'var(--accent-rose)' : 'var(--accent-amber)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Departmental Waste Cost Comparison */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Departmental Loss Breakdown ($)
              </h3>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: 0 }}>
                Comparing total waste expense by operational sector
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis dataKey="department" type="category" stroke="var(--text-primary)" fontSize={12} tickLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  formatter={(value) => [`$${value.toFixed(2)}`, 'Total Cost Loss']}
                />
                <Bar dataKey="cost" radius={[0, 6, 6, 0]}>
                  {deptChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : index === 1 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interactive Financial Reduction ROI Simulator */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.25rem' }}>
              <Target size={12} /> ROI Projection Simulator
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Food Waste Reduction Financial Savings Estimator
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0 }}>
              Simulate annual cost savings by achieving target reduction percentages
            </p>
          </div>

          {/* Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Target Reduction:</span>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5" 
              value={targetReductionPct} 
              onChange={(e) => setTargetReductionPct(parseInt(e.target.value))}
              style={{ accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {targetReductionPct}%
            </span>
          </div>
        </div>

        <div className="grid-3" style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ANNUAL WASTE LOSS (RUN-RATE)</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
              ${annualLoss.toFixed(2)}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROJECTED ANNUAL COST SAVINGS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              +${projectedSavings}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ESTIMATED FOOD SAVED (KG)</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {((totalKg * 12) * (targetReductionPct / 100)).toFixed(0)} kg / year
            </div>
          </div>
        </div>
      </div>

      {/* Smart Actionable Recommendations Section */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={20} color="var(--accent-emerald)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            Smart Reduction Action Plan & Recommendations
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {suggestionsList.map((sug) => (
            <div key={sug.id} style={{
              display: 'flex',
              gap: '1rem',
              padding: '1.25rem',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              borderLeft: `4px solid ${sug.color}`,
              borderTop: '1px solid var(--border-color)',
              borderRight: '1px solid var(--border-color)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Lightbulb size={20} color={sug.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{sug.title}</h4>
                  <span className="badge badge-emerald" style={{ background: 'rgba(255,255,255,0.05)' }}>{sug.priority}</span>
                </div>
                <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {sug.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
