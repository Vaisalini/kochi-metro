import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { appData } from '../../data/appData';

const Header = ({ title, showBackButton, backPath, trainStatus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const unreadNotifications = appData.notifications.filter(n => !n.read);
  // Conflict notifications (not marked as handled)
  const conflictFlags = (appData.conflicts || []).filter(c => !c.handled);
  // Track resolved conflicts for UI feedback
  const [resolvedConflicts, setResolvedConflicts] = useState([]);

  return (
    <header className="app-header">
      <div className="header-left">
        {showBackButton && (
          <button className="back-btn" onClick={handleBackClick}>
            ← Back
          </button>
        )}
        <div>
          <h1>{title}</h1>
          <div className="current-date">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <div className="header-right">
        {trainStatus && (
          <div className={`train-status-badge ${trainStatus.toLowerCase().replace(' ', '-')}`}>
            {trainStatus}
          </div>
        )}

        <div className="notifications-dropdown">
          <button className="notifications-btn" onClick={toggleNotifications}>
            🔔 Notifications
            {(unreadNotifications.length + conflictFlags.length) > 0 && (
              <span className="notification-count">{unreadNotifications.length + conflictFlags.length}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notifications-menu">
              {/* Standard notifications */}
              {appData.notifications.length === 0 && conflictFlags.length === 0 ? (
                <div className="notification-item">No notifications</div>
              ) : (
                <>
                  {appData.notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.read ? 'read' : ''}`}
                    >
                      <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                        {notification.type}
                      </div>
                      <div>{notification.message}</div>
                      <div style={{fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px'}}>
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {/* Conflict flags */}
                  {conflictFlags.map(conflict => (
                    <div key={conflict.id} className="notification-item" style={{background: 'rgba(255,84,89,0.08)', borderLeft: '4px solid #c0152f', marginBottom: 8}}>
                      <div style={{fontWeight: 'bold', color: '#c0152f', marginBottom: 4}}>
                        {conflict.trainId} - {conflict.type}
                      </div>
                      <div style={{fontWeight: 'bold', color: conflict.severity === 'Critical' ? '#c0152f' : '#b36b00', marginBottom: 4}}>
                        {conflict.severity}: {conflict.description}
                      </div>
                      <div style={{fontSize: '12px', color: '#b36b00', marginBottom: 4}}>
                        Suggestion: {conflict.suggestion}
                      </div>
                      <div style={{fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: 8}}>
                        Impact: {conflict.impact}
                      </div>
                      {resolvedConflicts.includes(conflict.id) ? (
                        <div style={{color: '#21808d', fontWeight: 'bold', marginTop: 4}}>Conflict Resolved</div>
                      ) : (
                        <div style={{display: 'flex', gap: 8, marginTop: 4}}>
                          <button
                            className="btn-primary"
                            style={{fontSize: 12, padding: '4px 10px'}}
                            onClick={() => alert('Details for conflict: ' + conflict.description)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn-success"
                            style={{fontSize: 12, padding: '4px 10px'}}
                            onClick={() => {
                              conflict.handled = true;
                              setResolvedConflicts(prev => [...prev, conflict.id]);
                              // Force re-render
                              setShowNotifications(false);
                              setTimeout(() => setShowNotifications(true), 10);
                              // TODO: Update ranked induction list here if needed
                            }}
                          >
                            Solve Conflict
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className="profile-menu">
          <button className="profile-btn" onClick={toggleProfile}>
            👤 <span id="userRole">{user?.name}</span>
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <button onClick={() => alert('Profile feature coming soon!')}>
                Profile
              </button>
              <button onClick={() => alert('Settings feature coming soon!')}>
                Settings
              </button>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;