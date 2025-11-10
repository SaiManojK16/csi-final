import React, { useState } from 'react';
import './FeatureCardFlip.css';

const FeatureCardFlip = ({ icon, title, description, features }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="feature-card-flip"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`flip-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of card */}
        <div className="flip-front">
          <div className="card-background">
            <div className="animated-circles">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animated-circle"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="card-content">
            <div className="card-header">
              <div className="card-text">
                <h3>{title}</h3>
                <p className="card-subtitle">{description}</p>
              </div>
              <div className="flip-icon-wrapper">
                <div className="flip-icon-glow" />
                <span className="flip-icon">↻</span>
              </div>
            </div>
          </div>

          <div className="card-icon">{icon}</div>
        </div>

        {/* Back of card */}
        <div className="flip-back">
          <div className="back-content">
            <div className="back-header">
              <h3>{title}</h3>
              <p className="back-description">{description}</p>
            </div>

            <div className="features-list">
              {features && features.map((feature, index) => (
                <div
                  key={feature}
                  className="feature-item"
                  style={{
                    transitionDelay: `${index * 100 + 200}ms`,
                    opacity: isFlipped ? 1 : 0,
                    transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                  }}
                >
                  <span className="feature-arrow">→</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="back-footer">
            <div className="start-button">
              <span className="start-text">Learn More</span>
              <div className="start-icon-wrapper">
                <div className="start-icon-glow" />
                <span className="start-icon">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCardFlip;

