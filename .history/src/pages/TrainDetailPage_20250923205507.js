import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Modal from '../components/common/Modal';
import { appData } from '../data/appData';

const TrainDetailPage = () => {
  const { trainId } = useParams();
  const [activeTab, setActiveTab] = useState('certificates');
  const [editingData, setEditingData] = useState(null);
  const [formData, setFormData] = useState({});
  const [jobCardsList, setJobCardsList] = useState([]);

  // Load train data using useMemo
  const train = useMemo(() => {
    const t = appData.trainsets.find(t => t.id === trainId);
    if (t && t.jobCards.details) {
      setJobCardsList(t.jobCards.details);
    } else if (t) {
      setJobCardsList([]);
    }
    return t;
  }, [trainId]);

  if (!train) {
    return (
      <div className="page active">
        <Header title="Train Not Found" showBackButton backPath="/dashboard" />
        <main style={{ padding: 'var(--space-24)', textAlign: 'center' }}>
          <h2>Train {trainId} not found</h2>
          <p>Please check the train ID and try again.</p>
        </main>
      </div>
    );
  }

  const canEdit = true; // replace with role-based check in real app

  // Certificate Tab (simplified)
  const renderCertificatesTab = () => (
    <div>
      <div className="admin-controls">
        <button className="btn-primary" onClick={() => handleEdit('certificates')}>
          Add New Certificate
        </button>
      </div>
      {/* Certificate editing UI omitted for brevity */}
      <div>Certificates UI here</div>
    </div>
  );

  // Job Cards Tab with detailed CRUD UI
  const openJobCardModal = (jobCard = null) => {
    setEditingData('jobcard-form');
    setFormData(
      jobCard || { 
        title: '', description: '', priority: 'Medium', assignedTo: '', status: 'Open', id: null 
      }
    );
  };

  const handleJobCardSave = () => {
    if (!formData.title || !formData.assignedTo) {
      alert('Please fill title and assigned technician');
      return;
    }
    if (formData.id) {
      setJobCardsList(prev => prev.map(card => (card.id === formData.id ? { ...formData } : card)));
    } else {
      const newCard = { ...formData, id: `JC${Date.now()}`, createdDate: new Date().toISOString().split('T')[0] };
      setJobCardsList(prev => [...prev, newCard]);
    }
    setEditingData(null);
    setFormData({});
  };

  const handleJobCardDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job card?')) {
      setJobCardsList(prev => prev.filter(card => card.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingData(null);
    setFormData({});
  };

  const renderJobCardsTab = () => (
    <div>
      {canEdit && (
        <div className="admin-controls">
          <button className="btn-primary" onClick={() => openJobCardModal()}>
            + Add New Job Card
          </button>
        </div>
      )}
      {jobCardsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-success)' }}>
          <h3>✅ No job cards</h3>
          <p>All maintenance tasks are completed.</p>
        </div>
      ) : (
        <div className="job-cards-list">
          {jobCardsList.map(card => (
            <div key={card.id} className={`job-card-item ${card.priority.toLowerCase()}`}>
              <div className="job-info">
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  Assigned to: {card.assignedTo} | Status: {card.status} | Created: {card.createdDate}
                </div>
              </div>
              {canEdit && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button className="btn btn--sm btn--outline" onClick={() => openJobCardModal(card)}>
                    Edit
                  </button>
                  <button className="btn btn--sm btn--danger" onClick={() => handleJobCardDelete(card.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={editingData === 'jobcard-form'}
        onClose={handleCancel}
        title={formData.id ? 'Edit Job Card' : 'Add New Job Card'}
        actions={
          <div>
            <button className="btn btn--outline" onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={handleJobCardSave} style={{ marginLeft: '8px' }}>
              Save
            </button>
          </div>
        }
      >
        <div>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Assigned To *</label>
            <input
              type="text"
              value={formData.assignedTo || ''}
              onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority || 'Medium'}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
              className="form-control"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status || 'Open'}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="form-control"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );

  // Placeholder functions for other tabs (implement similarly as needed)
  const renderBrandingTab = () => <div>Branding tab content here</div>;
  const renderMileageTab = () => <div>Mileage tab content here</div>;
  const renderCleaningStablingTab = () => <div>Cleaning & Stabling tab content here</div>;

  const tabs = [
    { id: 'certificates', label: 'Certificates', content: renderCertificatesTab },
    { id: 'jobcards', label: 'Job Cards', content: renderJobCardsTab },
    { id: 'branding', label: 'Branding', content: renderBrandingTab },
    { id: 'mileage', label: 'Mileage', content: renderMileageTab },
    { id: 'cleaning', label: 'Cleaning & Stabling', content: renderCleaningStablingTab }
  ];

  return (
    <div className="page active">
      <Header title={`Train ${train.id} - Detail View`} showBackButton backPath="/dashboard" trainStatus={train.status} />
      <main className="train-detail-main">
        <div className="train-tabs">
          {tabs.map(tab => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tabs.map(tab => (
            <div key={tab.id} className={`tab-pane ${activeTab === tab.id ? 'active' : ''}`}>
              {activeTab === tab.id && tab.content()}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TrainDetailPage;
