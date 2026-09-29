import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import WasteRecordsTable from './components/WasteRecordsTable';
import AnalyticsModule from './components/AnalyticsModule';
import ReportsGenerator from './components/ReportsGenerator';
import DatabaseManager from './components/DatabaseManager';
import LogWasteModal from './components/LogWasteModal';
import Toast from './components/Toast';
import { INITIAL_RECORDS } from './utils/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [currentFacility, setCurrentFacility] = useState('Hotel Dining & Banquets');
  
  // Data records state with LocalStorage persistence
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('ecowaste_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // MySQL Connection Status State
  const [dbConnected, setDbConnected] = useState(false);

  // Modals & Toast state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [toast, setToast] = useState(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('ecowaste_records', JSON.stringify(records));
  }, [records]);

  // Apply Light/Dark Theme to Document Body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check Backend MySQL Health API on Mount
  const checkDbHealth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const data = await res.json();
      if (data.status === 'connected') {
        setDbConnected(true);
        // Fetch live records from server
        const recordsRes = await fetch('http://localhost:5000/api/records');
        const recordsData = await recordsRes.json();
        if (recordsData.success && recordsData.data) {
          setRecords(recordsData.data);
        }
        setToast({ message: 'Connected to Live MySQL Database!', type: 'success' });
      } else {
        setDbConnected(false);
        setToast({ message: 'Running in Local Storage Mode', type: 'success' });
      }
    } catch (err) {
      setDbConnected(false);
    }
  };

  useEffect(() => {
    checkDbHealth();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Add or Edit Record handler
  const handleSaveRecord = async (recordData) => {
    if (editingRecord) {
      // Edit existing
      const updated = records.map(r => r.id === editingRecord.id ? { ...recordData, id: editingRecord.id } : r);
      setRecords(updated);
      setToast({ message: `Updated record for "${recordData.dish_name}"`, type: 'success' });

      if (dbConnected) {
        try {
          await fetch(`http://localhost:5000/api/records/${editingRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recordData)
          });
        } catch (err) { console.error(err); }
      }
    } else {
      // Add new
      const newRecord = { ...recordData, id: Date.now() };
      setRecords([newRecord, ...records]);
      setToast({ message: `Successfully logged waste entry for "${recordData.dish_name}" (${recordData.quantity_kg} kg)`, type: 'success' });

      if (dbConnected) {
        try {
          await fetch('http://localhost:5000/api/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recordData)
          });
        } catch (err) { console.error(err); }
      }
    }

    setIsLogModalOpen(false);
    setEditingRecord(null);
  };

  // Delete Record handler
  const handleDeleteRecord = async (id) => {
    setRecords(records.filter(r => r.id !== id));
    setToast({ message: 'Record deleted successfully.', type: 'success' });

    if (dbConnected) {
      try {
        await fetch(`http://localhost:5000/api/records/${id}`, { method: 'DELETE' });
      } catch (err) { console.error(err); }
    }
  };

  // Open edit modal
  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setIsLogModalOpen(true);
  };

  // Total metrics for sidebar
  const totalWasteKg = records.reduce((sum, r) => sum + parseFloat(r.quantity_kg || 0), 0);
  const totalCostLoss = records.reduce((sum, r) => sum + (parseFloat(r.quantity_kg || 0) * parseFloat(r.unit_cost || 0)), 0);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        totalWasteKg={totalWasteKg}
        totalCostLoss={totalCostLoss}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Sticky Top Navbar */}
        <Navbar 
          currentFacility={currentFacility}
          setCurrentFacility={setCurrentFacility}
          dbConnected={dbConnected}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenLogModal={() => { setEditingRecord(null); setIsLogModalOpen(true); }}
          onSyncDb={checkDbHealth}
        />

        {/* View Switcher Container */}
        <div style={{ marginTop: '1.5rem' }}>
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              records={records} 
              onOpenLogModal={() => { setEditingRecord(null); setIsLogModalOpen(true); }}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'records' && (
            <WasteRecordsTable 
              records={records}
              onEditRecord={handleOpenEditModal}
              onDeleteRecord={handleDeleteRecord}
              onOpenLogModal={() => { setEditingRecord(null); setIsLogModalOpen(true); }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsModule records={records} />
          )}

          {activeTab === 'reports' && (
            <ReportsGenerator records={records} currentFacility={currentFacility} />
          )}

          {activeTab === 'database' && (
            <DatabaseManager dbConnected={dbConnected} onSyncDb={checkDbHealth} />
          )}
        </div>
      </main>

      {/* Log Waste Entry Form Modal */}
      <LogWasteModal 
        isOpen={isLogModalOpen}
        onClose={() => { setIsLogModalOpen(false); setEditingRecord(null); }}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      {/* Toast Notification Alert */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
