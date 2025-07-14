import React, { useState } from 'react';
import './SecurityInfoModal.css';

const SecurityInfoModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('limits');

  if (!isOpen) return null;

  return (
    <div className="security-modal-overlay" onClick={onClose}>
      <div className="security-modal" onClick={(e) => e.stopPropagation()}>
        <div className="security-modal-header">
          <h2>🔒 Security Information</h2>
          <button className="security-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="security-modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'limits' ? 'active' : ''}`}
            onClick={() => setActiveTab('limits')}
          >
            Rate Limits
          </button>
          <button 
            className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            Security Tips
          </button>
        </div>

        <div className="security-modal-content">
          {activeTab === 'limits' && (
            <div className="tab-content">
              <h3>📊 Rate Limits & Restrictions</h3>
              
              <div className="security-card">
                <h4>🔐 Login Attempts</h4>
                <p><strong>Limit:</strong> 100 attempts per 1 minute</p>
                <p><strong>Purpose:</strong> Prevents brute force password attacks while allowing flexible access</p>
              </div>

              <div className="security-card">
                <h4>🌐 General API Requests</h4>
                <p><strong>Limit:</strong> 1000 requests per 15 minutes</p>
                <p><strong>Purpose:</strong> Prevents API abuse and ensures fair usage</p>
              </div>

              <div className="security-card">
                <h4>⏱️ Session Duration</h4>
                <p><strong>Duration:</strong> 20 minutes of inactivity</p>
                <p><strong>Purpose:</strong> Automatic logout for security</p>
              </div>

              <div className="security-card">
                <h4>📁 File Upload Limits</h4>
                <p><strong>Limit:</strong> 10MB maximum per request</p>
                <p><strong>Purpose:</strong> Prevents server overload</p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tab-content">
              <h3>💡 Security Best Practices</h3>
              
              <div className="tip-card">
                <h4>🔐 Strong Passwords</h4>
                <ul>
                  <li>Use at least 8 characters</li>
                  <li>Include uppercase, lowercase, numbers, and symbols</li>
                  <li>Avoid common words or personal information</li>
                  <li>Use the password strength indicator as a guide</li>
                </ul>
              </div>

              <div className="tip-card">
                <h4>🛡️ Account Security</h4>
                <ul>
                  <li>Log out when finished, especially on shared computers</li>
                  <li>Don't share your login credentials</li>
                  <li>Keep your browser updated</li>
                  <li>Be aware of automatic logout after 20 minutes</li>
                </ul>
              </div>

              <div className="tip-card">
                <h4>🌐 Safe Browsing</h4>
                <ul>
                  <li>Always access the application through the official URL</li>
                  <li>Look for the secure lock icon in your browser</li>
                  <li>Report any suspicious activity immediately</li>
                  <li>Keep your operating system and browser updated</li>
                </ul>
              </div>

              <div className="tip-card">
                <h4>📱 If You Experience Issues</h4>
                <ul>
                  <li>Rate limited? Wait just 1 minute before retrying (very quick reset)</li>
                  <li>Session expired? Simply log in again</li>
                  <li>Network error? Check your internet connection</li>
                  <li>File too large? Compress or split your files</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="security-modal-footer">
          <button className="security-close-btn" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfoModal;
