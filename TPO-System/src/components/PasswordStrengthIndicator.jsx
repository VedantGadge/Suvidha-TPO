import React from 'react';
import './PasswordStrengthIndicator.css';

const PasswordStrengthIndicator = ({ password, showRules = true }) => {
  // Password validation rules
  const rules = [
    {
      id: 'length',
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter (a-z)',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter (A-Z)',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      id: 'number',
      label: 'One number (0-9)',
      test: (pwd) => /\d/.test(pwd)
    },
    {
      id: 'special',
      label: 'One special character (@$!%*?&)',
      test: (pwd) => /[@$!%*?&]/.test(pwd)
    }
  ];

  // Calculate password strength
  const passedRules = rules.filter(rule => rule.test(password));
  const strengthPercentage = (passedRules.length / rules.length) * 100;
  
  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return '#ff4757'; // Red
    if (strengthPercentage <= 40) return '#ff6b35'; // Orange-Red
    if (strengthPercentage <= 60) return '#ffa726'; // Orange
    if (strengthPercentage <= 80) return '#66bb6a'; // Light Green
    return '#4caf50'; // Green
  };

  const getStrengthText = () => {
    if (strengthPercentage === 0) return 'Enter Password';
    if (strengthPercentage <= 20) return 'Very Weak';
    if (strengthPercentage <= 40) return 'Weak';
    if (strengthPercentage <= 60) return 'Fair';
    if (strengthPercentage <= 80) return 'Good';
    return 'Strong';
  };

  if (!showRules || !password) return null;

  return (
    <div className="password-strength-container">
      {/* Strength Bar */}
      <div className="strength-bar-container">
        <div className="strength-bar-label">
          <span>Password Strength: </span>
          <span 
            className="strength-text" 
            style={{ color: getStrengthColor() }}
          >
            {getStrengthText()}
          </span>
        </div>
        <div className="strength-bar-track">
          <div 
            className="strength-bar-fill"
            style={{ 
              width: `${strengthPercentage}%`,
              backgroundColor: getStrengthColor()
            }}
          />
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="password-rules">
        <h4 className="rules-title">Password Requirements:</h4>
        {strengthPercentage === 100 && (
          <div className="success-message">
            <span className="success-icon">🎉</span>
            <span>Perfect! Your password meets all requirements.</span>
          </div>
        )}
        <ul className="rules-list">
          {rules.map((rule) => {
            const isPassed = rule.test(password);
            return (
              <li 
                key={rule.id} 
                className={`rule-item ${isPassed ? 'rule-passed' : 'rule-failed'}`}
              >
                <span className="rule-icon">
                  {isPassed ? (
                    // Check mark icon
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                  ) : (
                    // X mark icon
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </span>
                <span className="rule-text">{rule.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
