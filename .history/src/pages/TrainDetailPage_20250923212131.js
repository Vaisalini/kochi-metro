import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { appData } from '../data/appData';

const TrainDetailPage = () => {
  const { trainId } = useParams();
  const [activeTab, setActiveTab] = useState('certificates');
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

  const handleEdit = (section, data = null, index = null) => {
    setEditingData(section === 'jobcards' ? { section, index } : section);
    switch(section) {
      case 'certificates':
        setFormData(data ? {...data} : {});
        break;
      case 'jobcards':
        setFormData(data || { title: '', description: '', priority: 'MEDIUM', status: 'Open' });
        break;
      case 'branding': {
        // Remove slaStatus from formData, will be computed
        const brandingData = data || {...train.branding};
        delete brandingData.slaStatus;
        setFormData(brandingData);
        break;
      }
      case 'mileage':
        setFormData(data || {...train.mileage});
        break;
      case 'cleaning':
        setFormData(data || {...train.cleaning, bay: train.bay});
        break;
    }
    setEditingData(null);
    setFormData({});
  };

  const handleCancel = () => {
  const handleSave = () => {
    // In a real app, this would make an API call to save the data
    console.log('Saving data:', { section: editingData, data: formData });
    // Update the local data (in a real app, you'd update your state management)
    if (editingData && typeof editingData === 'object' && editingData.section === 'jobcards') {
      // Editing or adding a job card
      if (!Array.isArray(train.jobCards.list)) train.jobCards.list = [];
      if (editingData.index !== null && editingData.index !== undefined) {
        // Edit existing
        train.jobCards.list[editingData.index] = { ...formData };
      } else {
        // Add new
        train.jobCards.list.push({ ...formData });
      }
    } else {
      switch(editingData) {
        case 'certificates':
          // Handle certificate updates
          break;
        case 'branding': {
          // Compute SLA status
          const { attainedHours = 0, requiredHours = 0, ...rest } = formData;
          let slaStatus = 'Non-Compliant';
          if (Number(attainedHours) >= Number(requiredHours)) {
            slaStatus = 'Compliant';
          } else if (Number(attainedHours) >= 0.8 * Number(requiredHours)) {
            slaStatus = 'At Risk';
          }
          train.branding = { ...train.branding, ...rest, attainedHours, requiredHours, slaStatus };
          break;
        }
        case 'mileage': {
          // Compute variance automatically
          const { current = 0, target = 0, lastOverhaul = 0, ...rest } = formData;
          const variance = Number(current) - Number(target);
          train.mileage = { ...train.mileage, ...rest, current, target, lastOverhaul, variance };
          break;
        }
        case 'cleaning':
          train.cleaning = { ...train.cleaning, ...formData };
          if (formData.bay) train.bay = formData.bay;
          break;
      }
    }
    setEditingData(null);
    setFormData({});
  };
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

  const renderJobCardsTab = () => {
    // Ensure jobCards.list exists
    if (!Array.isArray(train.jobCards.list)) train.jobCards.list = [];
    // If list is empty, populate with static/sample job cards based on counts
    if (train.jobCards.list.length === 0 && (train.jobCards.open > 0 || train.jobCards.critical > 0)) {
      // Add critical job cards
      for (let i = 0; i < (train.jobCards.critical || 0); i++) {
        train.jobCards.list.push({
          title: 'Critical Maintenance - Brake System',
          description: 'Requires immediate attention - Safety critical',
          priority: 'CRITICAL',
          status: 'Open',
        });
      }
      // Add open job cards (excluding criticals)
      for (let i = 0; i < ((train.jobCards.open || 0) - (train.jobCards.critical || 0)); i++) {
        train.jobCards.list.push({
          title: 'Routine Inspection - Air Conditioning',
          description: 'Scheduled maintenance check',
          priority: 'MEDIUM',
          status: 'Open',
        });
      }
      // Add closed job cards (if any)
      for (let i = 0; i < (train.jobCards.closed || 0); i++) {
        train.jobCards.list.push({
          title: 'Completed Maintenance',
          description: 'Closed job card',
          priority: 'LOW',
          status: 'Closed',
        });
      }
    }
    // Helper to mark job card as complete
    const markAsComplete = (index) => {
      if (!train.jobCards.list[index]) return;
      train.jobCards.list[index].status = 'Closed';
      setEditingData(null);
      setFormData({});
    };
    // Calculate counts dynamically
    const openCount = train.jobCards.list.filter(j => j.status !== 'Closed').length;
    const closedCount = train.jobCards.list.filter(j => j.status === 'Closed').length;
    const criticalCount = train.jobCards.list.filter(j => j.priority === 'CRITICAL' && j.status !== 'Closed').length;
    return (
      <div>
        <div className="job-cards-summary">
          <div className="job-count open-jobs">
            <div>Open Job Cards</div>
            <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>{openCount}</div>
          </div>
          <div className="job-count closed-jobs">
            <div>Closed Job Cards</div>
            <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>{closedCount}</div>
          </div>
          <div className="job-count critical-jobs">
            <div>Critical Job Cards</div>
            <div style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginTop: '8px'}}>{criticalCount}</div>
          </div>
        </div>

        <hr style={{margin: '32px 0'}} />
        <h3>Manage Job Card Details</h3>
        <div className="admin-controls">
          <button className="btn-primary" onClick={() => handleEdit('jobcards')}>
            Add New Job Card
          </button>
        </div>

        {editingData && typeof editingData === 'object' && editingData.section === 'jobcards' && (
          <div className="edit-form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                value={formData.status || 'Open'}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn-success" onClick={handleSave}>Save</button>
              <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}

        <div className="job-cards-list">
          {train.jobCards.list.length === 0 ? (
            <div style={{textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-success)'}}>
              <h4>✅ No job cards</h4>
              <p>Add job card details below.</p>
            </div>
          ) : (
            train.jobCards.list.map((job, i) => (
              <div key={i} className={`job-card-item ${job.priority === 'CRITICAL' ? 'critical' : job.priority === 'MEDIUM' ? 'medium' : 'low'} ${job.status === 'Closed' ? 'closed' : ''}`}>
                <div className="job-info">
                  <h4>{job.title}</h4>
                  <p>{job.description}</p>
                </div>
                <div className="job-priority">{job.priority}</div>
                <div className="job-status">{job.status}</div>
                <button className="edit-btn" onClick={() => handleEdit('jobcards', job, i)}>✏️</button>
                <button className="delete-btn" onClick={() => {
                  train.jobCards.list.splice(i, 1);
                  setEditingData(null);
                  setFormData({});
                }}>🗑️</button>
                {job.status !== 'Closed' && (
                  <button className="complete-btn" onClick={() => markAsComplete(i)}>
                    Mark as Complete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };


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
            <input 
              type="text" 
              value={(() => {
                const attained = Number(formData.attainedHours) || 0;
                const required = Number(formData.requiredHours) || 0;
                if (attained >= required) return 'Compliant';
                if (attained >= 0.8 * required) return 'At Risk';
                return 'Non-Compliant';
              })()}
              readOnly
              style={{ background: '#f5f5f5', color: '#333', fontWeight: 'bold' }}
            />
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

        {/* Depot visualization placeholder */}
        <div className="depot-visualization" style={{margin: '32px 0', padding: '16px', border: '1px dashed #aaa', borderRadius: '8px', background: '#fafbfc'}}>
          <h3>Depot Visualization</h3>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            {/* Example: 5 bays, highlight current */}
            {[1,2,3,4,5].map(bayNum => (
              <div key={bayNum} style={{
                width: 60, height: 60, borderRadius: 8, border: '2px solid #888',
                background: train.bay === `Bay ${bayNum}` ? '#4caf50' : '#e0e0e0',
                color: train.bay === `Bay ${bayNum}` ? '#fff' : '#333',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18
              }}>
                {`Bay ${bayNum}`}
                {train.bay === `Bay ${bayNum}` && <span style={{marginLeft: 4}}>🚆</span>}
              </div>
            ))}
          </div>
          <div style={{marginTop: 12, fontSize: 14, color: '#666'}}>Current train highlighted in green.</div>
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