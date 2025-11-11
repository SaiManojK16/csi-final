import React from 'react';
import './FeatureCardFlip.css';

const FeatureCardFlip = ({ icon, title, description, features }) => {
  return (
    <div className="feature-card-static">
      <div className="feature-icon-large">{icon}</div>
      
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        
        {features && features.length > 0 && (
          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={index} className="feature-list-item">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                  className="feature-check-icon"
                >
                  <path 
                    d="M13.5 4.5L6 12L2.5 8.5" 
                    stroke="#007acc" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FeatureCardFlip;
