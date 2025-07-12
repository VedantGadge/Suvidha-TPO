import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CountUp from 'react-countup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showLogoutToast) {
      toast.info('You have been logged out.');
      // Clear the stored email on logout
      localStorage.removeItem('loggedInEmail');
      // Optionally clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    // Simulate successful login - store email and redirect to dashboard
    if (!isSignUp) {
      localStorage.setItem('loggedInEmail', email);
      navigate('/dashboard', { state: { showLoginToast: true } });
    } else {
      toast.success('Account created successfully!');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section - Organization Info */}
        <div className="left-section">
          <div className="content-wrapper">
              {/* Logo */}
              <div className="logo-container">
                <img 
                  src="/SuvidhaLogo.png" 
                  alt="Suvidha Foundation Logo" 
                  className="foundation-logo"
                />
            </div>

            <div className="tabs-section">
              <div className="tabs">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                >
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('mission')}
                  className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
                >
                  Mission
                </button>
                <button 
                  onClick={() => setActiveTab('vision')}
                  className={`tab ${activeTab === 'vision' ? 'active' : ''}`}
                >
                  Vision
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'about' && (
                  <div className="tab-panel">
                    <h3 className="content-title">Empowering Through Education</h3>
                    <p className="content-text">
                      Since 1995, we've been bridging educational gaps and empowering 
                      financially challenged communities through innovative programs, 
                      mentorship, and sustainable initiatives.
                    </p>
                    <div className="stats">
                      <div className="stat">
                        <div className="stat-number">
                          <CountUp 
                            end={28} 
                            duration={2.5}
                            suffix="+"
                            enableScrollSpy
                            scrollSpyOnce
                          />
                        </div>
                        <div className="stat-label">Years</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">
                          <CountUp 
                            start={6000}
                            end={10000} 
                            duration={2.5}
                            suffix="+"
                            separator=","
                            enableScrollSpy
                            scrollSpyOnce
                          />
                        </div>
                        <div className="stat-label">Lives Impacted</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'mission' && (
                  <div className="tab-panel">
                    <h3 className="content-title">Our Mission</h3>
                    <div className="mission-list">
                      <div className="mission-item">
                        <div className="bullet"></div>
                        <span>Quality Education Access</span>
                      </div>
                      <div className="mission-item">
                        <div className="bullet"></div>
                        <span>Community Empowerment</span>
                      </div>
                      <div className="mission-item">
                        <div className="bullet"></div>
                        <span>Sustainable Development</span>
                      </div>
                      <div className="mission-item">
                        <div className="bullet"></div>
                        <span>Healthcare Initiatives</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div className="tab-panel">
                    <h3 className="content-title">Our Vision</h3>
                    <p className="content-text">
                      Equal opportunities, quality education, and a sustainable future for all.
                    </p>
                    <div className="vision-grid">
                      <div className="vision-card">
                        <div className="vision-title">Education</div>
                        <div className="vision-desc">Scholarships & Mentorship</div>
                      </div>
                      <div className="vision-card">
                        <div className="vision-title">Environment</div>
                        <div className="vision-desc">Tree Plantation</div>
                      </div>
                      <div className="vision-card">
                        <div className="vision-title">Healthcare</div>
                        <div className="vision-desc">Accessible Care</div>
                      </div>
                      <div className="vision-card">
                        <div className="vision-title">Women</div>
                        <div className="vision-desc">Empowerment</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="footer-section">
              <p className="footer-text">Building brighter futures through education</p>
              <p className="footer-date">Established September 8, 1995</p>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">TPO MANAGEMENT PORTAL</h2>
              <p className="form-subtitle">
                {isSignUp ? 'Create your account' : 'Secure Login'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-container">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-6.06"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    required
                    minLength="6"
                  />
                </div>
              )}

              <button type="submit" className="submit-button">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="form-footer">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="toggle-button"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            <div className="mobile-info">
              <h3 className="mobile-title">Suvidha Foundation</h3>
              <p className="mobile-desc">
                Empowering education since 1995. A non-profit organization working 
                to impart education among financially challenged sections.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;