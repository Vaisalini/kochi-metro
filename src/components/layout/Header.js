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
            {unreadNotifications.length > 0 && (
              <span className="notification-count">{unreadNotifications.length}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notifications-menu">
              {appData.notifications.length === 0 ? (
                <div className="notification-item">No notifications</div>
              ) : (
                appData.notifications.map(notification => (
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
                ))
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