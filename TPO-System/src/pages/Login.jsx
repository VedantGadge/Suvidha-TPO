import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Form submitted:', { name, email, password, isSignUp });
    alert(`${isSignUp ? 'Account created' : 'Logged in'} successfully!`);
    
    // Simulate successful login - redirect to dashboard
    if (!isSignUp) {
      // You can replace this with your actual login logic
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      {/* Back to Home Button */}
      <div className="back-button">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>

      <div className="login-container">
        {/* Left Section - Organization Info */}
        <div className="left-section">
          <div className="content-wrapper">
            <div className="header-section">
              <h1 className="main-title">Suvidha Foundation</h1>
              <p className="subtitle">Suvidha Mahila Mandal</p>
              <div className="divider"></div>
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
                        <div className="stat-number">28+</div>
                        <div className="stat-label">Years</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">10K+</div>
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

        {/* Right Section - Login Form */}
        <div className="right-section">
          <div className="form-container">
            <div className="form-header">
              <div className="icon-container">
                <div className="graduation-icon">🎓</div>
              </div>
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
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
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
    </div>
  );
};

export default Login;
