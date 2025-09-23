import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import LoadingOverlay from '../components/common/LoadingOverlay';
import Modal from '../components/common/Modal';
import { appData } from '../data/appData';

const AIRecommendationPage = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-09-15');
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const sortedTrains = [...appData.trainsets].sort((a, b) => a.aiRank - b.aiRank);

  const generatePlan = () => {
    setIsGenerating(true);

    // Simulate AI processing time
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 3000);
  };

  const handleConflictClick = (conflict) => {
    setSelectedConflict(conflict);
    setShowConflictModal(true);
  };

  const handleProceedToConfirmation = () => {
    navigate('/confirmation');
  };

  const handleRegeneratePlan = () => {
    setPlanGenerated(false);
    generatePlan();
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'var(--color-success)';
    if (confidence >= 0.8) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getRankingReason = (train) => {
    const reasons = [];

    if (train.status === 'Revenue Service' && train.jobCards.critical === 0) {
      reasons.push('Optimal for revenue service');
    }

    if (train.fitness.rolling.valid && train.fitness.signal.valid && train.fitness.telecom.valid) {
      reasons.push('All certificates valid');
    }

    if (train.jobCards.open === 0) {
      reasons.push('No pending maintenance');
    }

    if (train.branding.slaStatus === 'Compliant') {
      reasons.push('SLA compliant');
    }

    if (reasons.length === 0) {
      if (train.status === 'IBL Maintenance') {
        reasons.push('Under maintenance - low priority');
      } else if (train.jobCards.critical > 0) {
        reasons.push('Critical maintenance required');
      } else {
        reasons.push('Requires attention before service');
      }
    }

    return reasons.join(', ');
  };

  return (
    <div className="page active">
      <Header 
        title="AI Induction Plan Generator"
        showBackButton
        backPath="/dashboard"
      />

      <main className="ai-main">
        <div className="ai-inputs">
          <div className="card">
            <div className="card__body">
              <h3>Planning Parameters</h3>

              <div className="form-group">
                <label className="form-label">Planning Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority Criteria</label>
                <select className="form-control">
                  <option>Revenue Optimization</option>
                  <option>Maintenance Priority</option>
                  <option>SLA Compliance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service Pattern</label>
                <select className="form-control">
                  <option>Peak Hours</option>
                  <option>Off-Peak</option>
                  <option>Full Day</option>
                </select>
              </div>

              <button
                className="btn btn--primary btn--full-width"
                onClick={generatePlan}
                disabled={isGenerating || planGenerated}
              >
                {isGenerating ? 'Generating Plan...' : planGenerated ? 'Plan Generated' : 'Generate AI Plan'}
              </button>
            </div>
          </div>
        </div>

        <div className="ai-results">
          <div className="card">
            <div className="card__body">
              <h3>AI Recommended Induction Plan</h3>

              {!planGenerated && !isGenerating && (
                <div style={{textAlign: 'center', padding: 'var(--space-32)', color: 'var(--color-text-secondary)'}}>
                  Click "Generate AI Plan" to see recommendations
                </div>
              )}

              {planGenerated && (
                <>
                  <div className="plan-list">
                    {sortedTrains.map((train, index) => (
                      <div key={train.id} className="plan-item">
                        <div>
                          <div className="plan-rank">#{train.aiRank}</div>
                          <div className="plan-train">{train.id}</div>
                          <div className="plan-reasoning">
                            {getRankingReason(train)}
                          </div>
                        </div>
                        <div>
                          <div 
                            className="plan-confidence"
                            style={{color: getConfidenceColor(train.confidence)}}
                          >
                            {(train.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="conflicts-section">
                    <h4>Identified Conflicts</h4>
                    {appData.conflicts.map(conflict => (
                      <div key={conflict.id} className="conflict-item">
                        <div>
                          <strong>{conflict.trainId}</strong> - {conflict.type}
                        </div>
                        <div className="conflict-severity">
                          {conflict.severity}: {conflict.description}
                        </div>
                        <div className="conflict-suggestion">
                          Suggestion: {conflict.suggestion}
                        </div>
                        <button
                          className="btn btn--sm btn--outline"
                          style={{marginTop: 'var(--space-8)'}}
                          onClick={() => handleConflictClick(conflict)}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="ai-actions">
                    <button
                      className="btn btn--primary"
                      onClick={handleProceedToConfirmation}
                    >
                      Proceed to Final Plan
                    </button>
                    <button
                      className="btn btn--secondary"
                      onClick={handleRegeneratePlan}
                    >
                      Regenerate Plan
                    </button>
                    <button
                      className="btn btn--outline"
                      onClick={() => alert('Export feature coming soon!')}
                    >
                      Export Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <LoadingOverlay 
        isVisible={isGenerating} 
        message="AI is analyzing train data and generating optimal induction plan..."
      />

      <Modal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        title="Conflict Details"
        actions={
          <button 
            className="btn btn--primary"
            onClick={() => setShowConflictModal(false)}
          >
            Close
          </button>
        }
      >
        {selectedConflict && (
          <div>
            <div style={{marginBottom: 'var(--space-12)'}}>
              <strong>Train:</strong> {selectedConflict.trainId}
            </div>
            <div style={{marginBottom: 'var(--space-12)'}}>
              <strong>Type:</strong> {selectedConflict.type}
            </div>
            <div style={{marginBottom: 'var(--space-12)'}}>
              <strong>Severity:</strong> {selectedConflict.severity}
            </div>
            <div style={{marginBottom: 'var(--space-12)'}}>
              <strong>Description:</strong> {selectedConflict.description}
            </div>
            <div style={{marginBottom: 'var(--space-12)'}}>
              <strong>Impact:</strong> {selectedConflict.impact}
            </div>
            <div>
              <strong>Suggestion:</strong> {selectedConflict.suggestion}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIRecommendationPage;