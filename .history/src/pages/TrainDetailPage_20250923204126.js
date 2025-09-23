import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { appData } from '../data/appData';

const TrainDetailPage = () => {
  const { trainId } = useParams();
  const [activeTab, setActiveTab] = useState('certificates');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [formData, setFormData] = useState({});

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

  const handleEdit = (section, data = null) => {
    setEditingData(section);
    switch(section) {
      case 'certificates':
        setFormData(data ? {...data} : {});
        break;
      case 'jobcards':
        setFormData(data || { open: train.jobCards.open, closed: train.jobCards.closed, critical: train.jobCards.critical });
        break;
      case 'branding':
        setFormData(data || {...train.branding});
        break;
      case 'mileage':
        setFormData(data || {...train.mileage});
        break;
      case 'cleaning':
        setFormData(data || {...train.cleaning, bay: train.bay});
        break;
    }
  };

  const handleSave = () => {
    // In a real app, this would make an API call to save the data
    console.log('Saving data:', { section: editingData, data: formData });
    
    // Update the local data (in a real app, you'd update your state management)
    switch(editingData) {
      case 'certificates':
        // Handle certificate updates
        break;
      case 'jobcards':
        train.jobCards = { ...train.jobCards, ...formData };
        break;
      case 'branding':
        train.branding = { ...train.branding, ...formData };
        break;
      case 'mileage':
        train.mileage = { ...train.mileage, ...formData };
        break;
      case 'cleaning':
        train.cleaning = { ...train.cleaning, ...formData };
        if (formData.bay) train.bay = formData.bay;
        break;
    }
    
    setEditingData(null);
    setFormData({});
  };

  const handleCancel = () => {
    setEditingData(null);
    setFormData({});
  };

  const renderCertificatesTab = () => (
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('certificates')}>
          Add New Certificate
        </button>
      </div>
      
      {editingData === 'certificates' && (
        <div className="edit-form">
          <div className="form-group">
            <label>Certificate Type:</label>
            <select 
              value={formData.type || ''} 
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="">Select Type</option>
              <option value="locomotive">Locomotive</option>
              <option value="coach">Coach</option>
              <option value="pantograph">Pantograph</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expiry Date:</label>
            <input 
              type="date" 
              value={formData.expiry || ''} 
              onChange={(e) => setFormData({...formData, expiry: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              value={formData.valid ? 'true' : 'false'} 
              onChange={(e) => setFormData({...formData, valid: e.target.value === 'true'})}
            >
              <option value="true">Valid</option>
              <option value="false">Expired</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="certificates-grid">
        {Object.entries(train.fitness).map(([type, cert]) => (
          <div key={type} className="certificate-card">
            <button 
              className="edit-btn"
              onClick={() => handleEdit('certificates', {type, ...cert})}
            >
              ✏️
            </button>
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
    </div>
  );

  const renderJobCardsTab = () => (
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('jobcards')}>
          Update Job Cards
        </button>
      </div>

      {editingData === 'jobcards' && (
        <div className="edit-form">
          <div className="form-group">
            <label>Open Job Cards:</label>
            <input 
              type="number" 
              value={formData.open || 0} 
              onChange={(e) => setFormData({...formData, open: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Closed Job Cards:</label>
            <input 
              type="number" 
              value={formData.closed || 0} 
              onChange={(e) => setFormData({...formData, closed: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Critical Job Cards:</label>
            <input 
              type="number" 
              value={formData.critical || 0} 
              onChange={(e) => setFormData({...formData, critical: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

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
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('branding')}>
          Edit Branding Details
        </button>
      </div>

      {editingData === 'branding' && (
        <div className="edit-form">
          <div className="form-group">
            <label>Wrap ID:</label>
            <input 
              type="text" 
              value={formData.wrapId || ''} 
              onChange={(e) => setFormData({...formData, wrapId: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Advertiser:</label>
            <input 
              type="text" 
              value={formData.advertiser || ''} 
              onChange={(e) => setFormData({...formData, advertiser: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Required Hours/Day:</label>
            <input 
              type="number" 
              value={formData.requiredHours || ''} 
              onChange={(e) => setFormData({...formData, requiredHours: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Attained Hours:</label>
            <input 
              type="number" 
              value={formData.attainedHours || ''} 
              onChange={(e) => setFormData({...formData, attainedHours: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>SLA Status:</label>
            <select 
              value={formData.slaStatus || ''} 
              onChange={(e) => setFormData({...formData, slaStatus: e.target.value})}
            >
              <option value="">Select Status</option>
              <option value="Compliant">Compliant</option>
              <option value="Non-Compliant">Non-Compliant</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

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
    </div>
  );

  const renderMileageTab = () => (
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('mileage')}>
          Update Mileage Data
        </button>
      </div>

      {editingData === 'mileage' && (
        <div className="edit-form">
          <div className="form-group">
            <label>Current Mileage (km):</label>
            <input 
              type="number" 
              value={formData.current || ''} 
              onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Last Overhaul Mileage (km):</label>
            <input 
              type="number" 
              value={formData.lastOverhaul || ''} 
              onChange={(e) => setFormData({...formData, lastOverhaul: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Target Mileage (km):</label>
            <input 
              type="number" 
              value={formData.target || ''} 
              onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-group">
            <label>Variance (km):</label>
            <input 
              type="number" 
              value={formData.variance || ''} 
              onChange={(e) => setFormData({...formData, variance: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

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
    </div>
  );

  const renderCleaningStablingTab = () => (
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('cleaning')}>
          Update Cleaning & Stabling
        </button>
      </div>

      {editingData === 'cleaning' && (
        <div className="edit-form">
          <div className="form-group">
            <label>Cleaning Status:</label>
            <select 
              value={formData.status || ''} 
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="">Select Status</option>
              <option value="Clean">Clean</option>
              <option value="Dirty">Dirty</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
          <div className="form-group">
            <label>Next Scheduled:</label>
            <input 
              type="datetime-local" 
              value={formData.nextScheduled || ''} 
              onChange={(e) => setFormData({...formData, nextScheduled: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Assigned Slot:</label>
            <input 
              type="text" 
              value={formData.assignedSlot || ''} 
              onChange={(e) => setFormData({...formData, assignedSlot: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Crew:</label>
            <input 
              type="text" 
              value={formData.crew || ''} 
              onChange={(e) => setFormData({...formData, crew: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Current Bay:</label>
            <input 
              type="text" 
              value={formData.bay || ''} 
              onChange={(e) => setFormData({...formData, bay: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button className="btn-success" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

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
        <div className="admin-toggle">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={isAdminMode} 
              onChange={(e) => setIsAdminMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Admin Mode</span>
          </label>
        </div>

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