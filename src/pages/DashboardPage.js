import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import TrainCard from '../components/train/TrainCard';
import { appData } from '../data/appData';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bayFilter, setBayFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planningDate, setPlanningDate] = useState('2025-09-14');

  const filteredTrains = useMemo(() => {
    return appData.trainsets.filter(train => {
      const matchesSearch = train.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBay = !bayFilter || train.bay.startsWith(bayFilter);
      const matchesStatus = !statusFilter || train.status === statusFilter;

      return matchesSearch && matchesBay && matchesStatus;
    });
  }, [searchTerm, bayFilter, statusFilter]);

  const handleGeneratePlan = () => {
    if (user && (user.role === 'Admin' || user.role === 'Supervisor')) {
      navigate('/ai-recommendation');
    } else {
      alert('Access denied. Supervisor or Admin role required.');
    }
  };

  const handleViewHistory = () => {
    alert('History feature coming soon!');
  };

  const handleExportReport = () => {
    alert('Export report feature coming soon!');
  };

  const getUniqueValues = (key) => {
    const values = appData.trainsets.map(train => {
      if (key === 'bay') return train.bay.charAt(0);
      return train[key];
    });
    return [...new Set(values)];
  };

  return (
    <div className="page active">
      <Header 
        title="Train Induction Planning Dashboard" 
        showBackButton={false}
      />

      <main className="dashboard-main">
        <div className="dashboard-actions">
          <div className="search-filters">
            <input
              type="text"
              className="form-control"
              placeholder="Search trains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="form-control"
              value={bayFilter}
              onChange={(e) => setBayFilter(e.target.value)}
            >
              <option value="">All Bays</option>
              {getUniqueValues('bay').map(bay => (
                <option key={bay} value={bay}>Bay {bay}</option>
              ))}
            </select>

            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              {getUniqueValues('status').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <input
              type="date"
              className="form-control"
              value={planningDate}
              onChange={(e) => setPlanningDate(e.target.value)}
            />
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn--primary"
              onClick={handleGeneratePlan}
            >
              Generate AI Plan
            </button>
            <button 
              className="btn btn--secondary"
              onClick={handleViewHistory}
            >
              View History
            </button>
            <button 
              className="btn btn--outline"
              onClick={handleExportReport}
            >
              Export Report
            </button>
          </div>
        </div>

        <div className="trains-grid">
          {filteredTrains.map(train => (
            <TrainCard key={train.id} train={train} />
          ))}
        </div>

        {filteredTrains.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-32)',
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            No trains found matching the current filters.
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;