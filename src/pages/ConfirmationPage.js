import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import { appData } from '../data/appData';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const sortedTrains = [...appData.trainsets].sort((a, b) => a.aiRank - b.aiRank);
  const totalTrains = sortedTrains.length;
  const revenueTrains = sortedTrains.filter(t => t.status === 'Revenue Service').length;
  const maintenanceTrains = sortedTrains.filter(t => t.status === 'IBL Maintenance').length;
  const standbyTrains = sortedTrains.filter(t => t.status === 'Standby').length;

  const handleApprove = () => {
    setIsApproved(true);
    setTimeout(() => {
      alert('Plan approved successfully! Notifications sent to all stakeholders.');
      navigate('/dashboard');
    }, 2000);
  };

  const handleReject = () => {
    if (window.confirm('Are you sure you want to reject this plan?')) {
      navigate('/ai-recommendation');
    }
  };

  const handleExport = (format) => {
    alert(`Exporting plan as ${format}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page active">
      <Header 
        title="Final Plan Confirmation"
        showBackButton
        backPath="/ai-recommendation"
      />

      <main className="confirmation-main">
        <div className="plan-summary">
          <div className="card">
            <div className="card__body">
              <h3>Plan Overview</h3>

              <div className="plan-metrics">
                <div className="metric">
                  <div className="metric-label">Total Trains</div>
                  <div className="metric-value">{totalTrains}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Revenue Service</div>
                  <div className="metric-value">{revenueTrains}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Maintenance</div>
                  <div className="metric-value">{maintenanceTrains}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Standby</div>
                  <div className="metric-value">{standbyTrains}</div>
                </div>
              </div>

              <h4>Final Induction Sequence</h4>
              <div className="final-plan-list">
                {sortedTrains.map((train, index) => (
                  <div key={train.id} className="final-plan-item">
                    <div>
                      <strong>#{train.aiRank} - {train.id}</strong>
                      <div style={{fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)'}}>
                        {train.status} | Bay {train.bay} | Confidence: {(train.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className={`status-${train.status.toLowerCase().replace(' ', '-')}`}>
                      {train.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="approval-section">
          <div className="card">
            <div className="card__body">
              <h3>Plan Approval</h3>

              <div className="approval-timestamp">
                Generated: {new Date().toLocaleString('en-IN')}
              </div>

              <div className="form-group">
                <label className="form-label">Approval Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Add any notes or modifications..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Approver</label>
                <input
                  type="text"
                  className="form-control"
                  value={user?.name || ''}
                  readOnly
                />
              </div>

              {!isApproved ? (
                <div style={{display: 'flex', gap: 'var(--space-12)'}}>
                  <button 
                    className="btn btn--primary"
                    onClick={handleApprove}
                  >
                    ✓ Approve Plan
                  </button>
                  <button 
                    className="btn btn--outline"
                    onClick={handleReject}
                  >
                    ✗ Reject & Modify
                  </button>
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: 'var(--space-16)'}}>
                  <div style={{fontSize: 'var(--font-size-xl)', color: 'var(--color-success)', marginBottom: 'var(--space-8)'}}>
                    ✅ Plan Approved Successfully!
                  </div>
                  <div style={{color: 'var(--color-text-secondary)'}}>
                    Notifications sent to all stakeholders
                  </div>
                </div>
              )}

              <hr style={{margin: 'var(--space-20) 0'}} />

              <h4>Export Options</h4>
              <div className="export-options">
                <button 
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleExport('PDF')}
                >
                  📄 Export PDF
                </button>
                <button 
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleExport('Excel')}
                >
                  📊 Export Excel
                </button>
                <button 
                  className="btn btn--outline btn--sm"
                  onClick={handlePrint}
                >
                  🖨️ Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;