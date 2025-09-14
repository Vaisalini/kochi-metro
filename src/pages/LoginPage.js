import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password || !credentials.role) {
      setError('Please fill in all fields.');
      return;
    }

    const result = login(credentials.username, credentials.password, credentials.role);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please check your username, password, and role.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="page active">
      <div className="login-container">
        <div className="login-header">
          <h1>KMRL Train Induction Planning</h1>
          <h2>Intelligent Resource Allocation System</h2>
        </div>
        <div className="login-form card">
          <div className="card__body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select 
                  name="role"
                  value={credentials.role}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="Admin">Admin</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Maintenance Staff">Maintenance Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              {error && (
                <div className="error-message" style={{
                  color: 'var(--color-error)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--space-8)',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--full-width">
                Sign In
              </button>

              <a href="#" className="forgot-password">
                Forgot your password?
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;