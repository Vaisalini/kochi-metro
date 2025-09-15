import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { appData } from '../data/appData';

const TrainDetailPage = () => {
  const { trainId } = useParams();
  const [activeTab, setActiveTab] = useState('certificates');

  const train = useMemo(() => {
    return appData.trainsets.find(t => t.id === trainId);
  }, [trainId]);

  if (!train) {
    return (
      <div className="page active">
        <Header title="Train Not Found" showBackButton backPath="/dashboard" />
        <main style={{padding: 'var(--space-24)', textAlign: 'center'}}>
          <h2>Train {trainId} not found</h2>
          <p>Please check the train ID and try again.</p>
        </main>
      </div>
    );
  }

  const renderCertificatesTab = () => (
    <div className="certificates-grid">
      {Object.entries(train.fitness).map(([type, cert]) => (
        <div key={type} className="certificate-card">
          <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Stock</h3>
          <div className={`cert-status ${cert.valid ? 'valid' : 'expired'}`}>
            {cert.valid ? 'Valid' : 'Expired'}
          </div>
          <div className="cert-expiry">Expiry: {cert.expiry}</div>
          <div className={`cert-days ${cert.daysLeft <= 3 ? 'critical' : cert.daysLeft <= 7 ? 'warning' : ''}`}>
            {cert.daysLeft < 0 ? `Expired ${Math.abs(cert.daysLeft)} days ago` :
             cert.daysLeft === 0 ? 'Expires today' :
             `${cert.daysLeft} days left`}
          </div>
        </div>
      ))}
    </div>
  );

  const renderJobCardsTab = () => (
    <div>
      <div className="job-cards-summary">
        <div className="job-count open-jobs">
          <div>Open Job Cards</div>
          <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>
            {train.jobCards.open}
          </div>
        </div>
        <div className="job-count closed-jobs">
          <div>Closed Job Cards</div>
          <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>
            {train.jobCards.closed}
          </div>
        </div>
        <div className="job-count critical-jobs">
          <div>Critical Job Cards</div>
          <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>
            {train.jobCards.critical}
          </div>
        </div>
      </div>

      <div className="job-cards-list">
        {train.jobCards.open === 0 && train.jobCards.critical === 0 ? (
          <div style={{textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-success)'}}>
            <h3>✅ No open job cards</h3>
            <p>All maintenance tasks are completed.</p>
          </div>
        ) : (
          <>
            {Array.from({length: train.jobCards.critical}).map((_, i) => (
              <div key={`critical-${i}`} className="job-card-item critical">
                <div className="job-info">
                  <h4>Critical Maintenance - Brake System</h4>
                  <p>Requires immediate attention - Safety critical</p>
                </div>
                <div className="job-priority">CRITICAL</div>
              </div>
            ))}
            {Array.from({length: train.jobCards.open - train.jobCards.critical}).map((_, i) => (
              <div key={`open-${i}`} className="job-card-item">
                <div className="job-info">
                  <h4>Routine Inspection - Air Conditioning</h4>
                  <p>Scheduled maintenance check</p>
                </div>
                <div className="job-priority">MEDIUM</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  const renderBrandingTab = () => (
    <div className="branding-info">
      <div className="branding-details">
        <h3>Branding Details</h3>
        <div style={{marginBottom: 'var(--space-12)'}}>
          <strong>Wrap ID:</strong> {train.branding.wrapId}
        </div>
        <div style={{marginBottom: 'var(--space-12)'}}>
          <strong>Advertiser:</strong> {train.branding.advertiser}
        </div>
        <div>
          <strong>Required Hours/Day:</strong> {train.branding.requiredHours}
        </div>
      </div>

      <div className="exposure-progress">
        <h3>Exposure Progress</h3>
        <div>Attained: {train.branding.attainedHours}h / Required: {train.branding.requiredHours}h</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{
              width: `${Math.min(100, (train.branding.attainedHours / train.branding.requiredHours) * 100)}%`
            }}
          ></div>
        </div>
      </div>

      <div className="sla-status">
        <h3>SLA Status</h3>
        <div className={`status-${train.branding.slaStatus.toLowerCase().replace(' ', '-').replace('non-compliant', 'non-compliant')}`}>
          {train.branding.slaStatus}
        </div>
      </div>
    </div>
  );

  const renderMileageTab = () => (
    <div className="mileage-info">
      <div className="mileage-current">
        <h3>Current Mileage</h3>
        <div className="mileage-value">{train.mileage.current.toLocaleString()}</div>
        <div>Kilometers</div>
      </div>

      <div className="mileage-overhaul">
        <h3>Since Last Overhaul</h3>
        <div className="mileage-value">{train.mileage.lastOverhaul.toLocaleString()}</div>
        <div>Kilometers</div>
      </div>

      <div className="mileage-target">
        <h3>Target vs Current</h3>
        <div>Target: {train.mileage.target.toLocaleString()} km</div>
        <div className={`variance ${train.mileage.variance >= 0 ? 'positive' : 'negative'}`}>
          Variance: {train.mileage.variance >= 0 ? '+' : ''}{train.mileage.variance} km
        </div>
      </div>
    </div>
  );

  const renderCleaningStablingTab = () => (
    <div className="cleaning-info">
      <div className="cleaning-status">
        <h3>Cleaning Status</h3>
        <div className={`status-${train.cleaning.status.toLowerCase()}`}>
          {train.cleaning.status}
        </div>
      </div>

      <div className="cleaning-schedule">
        <h3>Next Scheduled</h3>
        <div className="mileage-value" style={{fontSize: 'var(--font-size-xl)'}}>
          {train.cleaning.nextScheduled}
        </div>
        <div>{train.cleaning.assignedSlot} - {train.cleaning.crew}</div>
      </div>

      <div className="current-bay">
        <h3>Current Location</h3>
        <div className="bay-location">{train.bay}</div>
        <div>Stabling Bay</div>
      </div>

      <div className="shunting-cost">
        <h3>Shunting Details</h3>
        <div>Cost: ₹500 | Time: 15 min</div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'certificates', label: 'Certificates', content: renderCertificatesTab },
    { id: 'jobcards', label: 'Job Cards', content: renderJobCardsTab },
    { id: 'branding', label: 'Branding', content: renderBrandingTab },
    { id: 'mileage', label: 'Mileage', content: renderMileageTab },
    { id: 'cleaning', label: 'Cleaning & Stabling', content: renderCleaningStablingTab }
  ];

  return (
    <div className="page active">
      <Header 
        title={`Train ${train.id} - Detail View`}
        showBackButton
        backPath="/dashboard"
        trainStatus={train.status}
      />

      <main className="train-detail-main">
        <div className="train-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}
            >
              {activeTab === tab.id && tab.content()}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrainDetailPage;