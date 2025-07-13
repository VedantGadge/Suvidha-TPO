import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import CountUp from 'react-countup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import SecurityInfoModal from '../components/SecurityInfoModal';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      if (!isSignUp) {
        // Login - authenticate with backend
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: email, // Using email as username
            password: password 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store the JWT token
          localStorage.setItem('token', data.token);
          localStorage.setItem('loggedInEmail', email);
          toast.success('Login successful!');
          navigate('/dashboard', { state: { showLoginToast: true } });
        } else {
          const errorData = await response.json();
          
          // Handle specific security errors with detailed messages
          if (response.status === 429) {
            if (errorData.type === 'AUTH_RATE_LIMIT_EXCEEDED') {
              toast.error(`🔒 Too many login attempts! Please wait ${Math.ceil(errorData.retryAfter / 60)} minutes before trying again.`, {
                autoClose: 8000
              });
            } else {
              toast.error(`⚠️ Rate limit exceeded! Please wait ${Math.ceil(errorData.retryAfter / 60)} minutes before trying again.`, {
                autoClose: 8000
              });
            }
          } else if (response.status === 413) {
            toast.error('📁 Request too large! Please reduce the size of your data.', {
              autoClose: 6000
            });
          } else if (response.status === 401) {
            toast.error('🚫 Invalid credentials. Please check your email and password.', {
              autoClose: 5000
            });
          } else {
            toast.error(errorData.message || 'Login failed. Please check your credentials.', {
              autoClose: 5000
            });
          }
        }
      } else {
        // Sign up - register with backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: email,
            password: password,
            name: name
          }),
        });

        if (response.ok) {
          toast.success('Account created successfully! Please sign in.');
          setIsSignUp(false); // Switch to login form
          setPassword(''); // Clear password fields
          setConfirmPassword('');
          setName('');
        } else {
          const errorData = await response.json();
          
          // Handle specific security and validation errors
          if (response.status === 429) {
            toast.error(`🔒 Too many registration attempts! Please wait ${Math.ceil(errorData.retryAfter / 60)} minutes before trying again.`, {
              autoClose: 8000
            });
          } else if (response.status === 413) {
            toast.error('📁 Request too large! Please reduce the size of your data.', {
              autoClose: 6000
            });
          } else if (response.status === 400 && errorData.type === 'VALIDATION_ERROR') {
            // Handle password validation errors with specific feedback
            if (errorData.details && Array.isArray(errorData.details)) {
              const passwordErrors = errorData.details
                .filter(err => err.path === 'password')
                .map(err => err.msg)
                .join(' ');
              
              if (passwordErrors) {
                toast.error(`🔐 Password requirements not met: ${passwordErrors}`, {
                  autoClose: 8000
                });
              } else {
                toast.error(`⚠️ Validation failed: ${errorData.details.map(err => err.msg).join(', ')}`, {
                  autoClose: 8000
                });
              }
            } else {
              toast.error(`⚠️ ${errorData.message || 'Please check your input and try again.'}`, {
                autoClose: 6000
              });
            }
          } else if (response.status === 409) {
            toast.error('👤 An account with this email already exists. Please try logging in instead.', {
              autoClose: 6000
            });
          } else {
            toast.error(errorData.message || 'Registration failed. Please try again.', {
              autoClose: 5000
            });
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle network and other unexpected errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast.error('🌐 Network error! Please check your internet connection and try again.', {
          autoClose: 6000
        });
      } else if (error.name === 'AbortError') {
        toast.error('⏱️ Request timeout! Please try again.', {
          autoClose: 5000
        });
      } else {
        toast.error('❌ An unexpected error occurred. Please try again later.', {
          autoClose: 5000
        });
      }
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
                            preserveValue
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
                            preserveValue
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
                    className="form-input password-input"
                    required
                    minLength="8"
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
                
                {/* Password Strength Indicator - Only show during sign up */}
                {isSignUp && (
                  <PasswordStrengthIndicator 
                    password={password} 
                    showRules={true} 
                  />
                )}
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
                    minLength="8"
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
        
        {/* Security Info Button */}
        <button 
          className="security-info-btn"
          onClick={() => setShowSecurityModal(true)}
          title="Security Information"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          Security Info
        </button>
        
        {/* Security Info Modal */}
        <SecurityInfoModal 
          isOpen={showSecurityModal} 
          onClose={() => setShowSecurityModal(false)} 
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;