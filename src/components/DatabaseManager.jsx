import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Download, 
  Play
} from 'lucide-react';

export default function DatabaseManager({ dbConnected, onSyncDb }) {
  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'food_waste_db'
  });

  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const sqlSchemaCode = `-- EcoWaste Pro MySQL DDL Schema
CREATE DATABASE IF NOT EXISTS \`food_waste_db\`;
USE \`food_waste_db\`;

CREATE TABLE IF NOT EXISTS \`waste_records\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`date\` DATE NOT NULL,
  \`meal_type\` ENUM('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'All Day Prep') NOT NULL,
  \`department\` VARCHAR(100) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`dish_name\` VARCHAR(150) NOT NULL,
  \`quantity_kg\` DECIMAL(10,2) NOT NULL,
  \`unit_cost\` DECIMAL(10,2) NOT NULL,
  \`total_cost\` DECIMAL(10,2) GENERATED ALWAYS AS (\`quantity_kg\` * \`unit_cost\`) STORED,
  \`reason\` VARCHAR(150) NOT NULL,
  \`action_prevention\` TEXT DEFAULT NULL,
  \`recorded_by\` VARCHAR(100) NOT NULL DEFAULT 'Admin Staff',
  \`facility_type\` VARCHAR(50) DEFAULT 'Restaurant',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_date\` (\`date\`),
  INDEX \`idx_department\` (\`department\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/db/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbConfig)
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.message });
      }
    } catch (err) {
      setTestResult({ 
        success: false, 
        message: 'Could not connect to Express server at http://localhost:5000. Express server may be running in offline mode.' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDownloadSQL = () => {
    const blob = new Blob([sqlSchemaCode], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'food_waste_db.sql';
    link.click();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            <Database size={12} /> Database Architecture
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.25rem 0' }}>
            MySQL Database Connection & Schema Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Configure MySQL credentials, initialize database tables, or download DDL migration scripts.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onSyncDb} className="btn btn-secondary">
            <RefreshCw size={16} /> Check Live API Sync
          </button>
        </div>
      </div>

      {/* Main Connection Panel */}
      <div className="grid-2">
        {/* Credentials Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              MySQL Connection Settings
            </h3>
            <span className={dbConnected ? "badge badge-emerald" : "badge badge-amber"}>
              {dbConnected ? 'Active MySQL' : 'Local Storage Mode'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">MySQL Server Host</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Port</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({ ...dbConfig, port: e.target.value })}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Database Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={dbConfig.database}
                  onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">MySQL Username</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={dbConfig.user}
                  onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">MySQL Password</label>
              <input 
                type="password" 
                className="form-input"
                placeholder="Enter MySQL password (blank if root default)"
                value={dbConfig.password}
                onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
              />
            </div>

            {/* Test Connection Button */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                onClick={handleTestConnection} 
                disabled={isTesting}
                className="btn btn-primary"
              >
                {isTesting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                Test Connection
              </button>
            </div>

            {/* Test Result Message */}
            {testResult && (
              <div style={{
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: testResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                color: testResult.success ? '#34d399' : '#f87171',
                fontSize: '0.85rem'
              }}>
                <strong>{testResult.success ? '✓ Connection Verified' : '✕ Connection Error'}:</strong> {testResult.message}
              </div>
            )}
          </div>
        </div>

        {/* DDL Schema Preview & Download */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
              MySQL DDL Schema Script
            </h3>
            <button onClick={handleDownloadSQL} className="btn btn-secondary btn-sm">
              <Download size={14} /> Download food_waste_db.sql
            </button>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            The application automatically creates tables when connected to MySQL, or you can run this script directly in phpMyAdmin or MySQL Workbench:
          </p>

          <pre style={{
            flex: 1,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: 'var(--accent-emerald)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78125rem',
            overflowX: 'auto',
            maxHeight: '260px'
          }}>
            {sqlSchemaCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
