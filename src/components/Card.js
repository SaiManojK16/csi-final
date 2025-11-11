import React from 'react';
import './Card.css';

/**
 * Base Card Component
 * Versatile container for content with various layouts and styles
 */
export const Card = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  interactive = false,
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'card',
    variant !== 'default' && `card-${variant}`,
    size !== 'md' && `card-${size}`,
    interactive && 'card-interactive',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Body Component
 */
export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Footer Component
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`card-title ${className}`} {...props}>
    {children}
  </h3>
);

/**
 * Card Subtitle Component
 */
export const CardSubtitle = ({ children, className = '', ...props }) => (
  <div className={`card-subtitle ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Description Component
 */
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card-description ${className}`} {...props}>
    {children}
  </p>
);

/**
 * Feature Card Component
 * Displays a feature with icon, title, and description
 */
export const FeatureCard = ({ 
  icon, 
  title, 
  description,
  className = '',
  ...props 
}) => (
  <Card variant="feature" className={className} {...props}>
    <div className="card-icon">
      {icon}
    </div>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </Card>
);

/**
 * Pricing Card Component
 * Displays pricing plans with features
 */
export const PricingCard = ({ 
  plan,
  price,
  currency = '$',
  period = 'month',
  features = [],
  featured = false,
  badge,
  buttonText = 'Get Started',
  onButtonClick,
  className = '',
  ...props 
}) => (
  <Card 
    variant="pricing" 
    className={`${featured ? 'card-pricing-featured' : ''} ${className}`}
    {...props}
  >
    {badge && <div className="card-pricing-badge">{badge}</div>}
    
    <div className="card-pricing-plan">{plan}</div>
    
    <div className="card-pricing-price">
      <span className="card-pricing-price-currency">{currency}</span>
      {price}
      <span className="card-pricing-period">/{period}</span>
    </div>
    
    <ul className="card-pricing-features">
      {features.map((feature, index) => (
        <li 
          key={index} 
          className={`card-pricing-feature ${feature.disabled ? 'card-pricing-feature-disabled' : ''}`}
        >
          {feature.text || feature}
        </li>
      ))}
    </ul>
    
    <button 
      className="btn-primary" 
      onClick={onButtonClick}
      style={{ width: '100%' }}
    >
      {buttonText}
    </button>
  </Card>
);

/**
 * Testimonial Card Component
 * Displays customer testimonials with author info
 */
export const TestimonialCard = ({ 
  quote,
  author,
  role,
  avatar,
  rating = 5,
  className = '',
  ...props 
}) => (
  <Card variant="testimonial" className={className} {...props}>
    {rating && (
      <div className="card-testimonial-stars">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
    )}
    
    <div className="card-testimonial-quote">
      {quote}
    </div>
    
    <div className="card-testimonial-author">
      {avatar && (
        <img 
          src={avatar} 
          alt={author} 
          className="card-testimonial-avatar"
        />
      )}
      <div className="card-testimonial-info">
        <div className="card-testimonial-name">{author}</div>
        <div className="card-testimonial-role">{role}</div>
      </div>
    </div>
  </Card>
);

/**
 * Product Card Component
 * Displays product information with image
 */
export const ProductCard = ({ 
  image,
  imageAlt,
  category,
  name,
  price,
  rating,
  reviews,
  badge,
  onAddToCart,
  className = '',
  ...props 
}) => (
  <Card variant="product" className={className} {...props}>
    <div className="card-image-container">
      <img 
        src={image} 
        alt={imageAlt || name} 
        className="card-product-image"
      />
      {badge && <div className="card-badge">{badge}</div>}
    </div>
    
    <div className="card-product-body">
      {category && <div className="card-product-category">{category}</div>}
      <h3 className="card-product-name">{name}</h3>
      <div className="card-product-price">${price}</div>
      
      {rating && (
        <div className="card-product-rating">
          <span className="card-product-stars">
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
          </span>
          {reviews && (
            <span className="card-product-reviews">({reviews} reviews)</span>
          )}
        </div>
      )}
      
      {onAddToCart && (
        <button 
          className="btn-primary" 
          onClick={onAddToCart}
          style={{ width: '100%' }}
        >
          Add to Cart
        </button>
      )}
    </div>
  </Card>
);

/**
 * Article/Blog Card Component
 * Displays article preview with image and metadata
 */
export const ArticleCard = ({ 
  image,
  imageAlt,
  category,
  title,
  excerpt,
  author,
  authorAvatar,
  date,
  readTime,
  href,
  className = '',
  ...props 
}) => (
  <Card variant="article" className={className} {...props}>
    {image && (
      <img 
        src={image} 
        alt={imageAlt || title} 
        className="card-article-image"
      />
    )}
    
    <div className="card-article-body">
      {category && (
        <div className="card-article-category">{category}</div>
      )}
      
      <h3 className="card-article-title">
        {href ? <a href={href}>{title}</a> : title}
      </h3>
      
      {excerpt && (
        <p className="card-article-excerpt">{excerpt}</p>
      )}
      
      <div className="card-article-author">
        {authorAvatar && (
          <img 
            src={authorAvatar} 
            alt={author} 
            className="card-article-avatar"
          />
        )}
        <span className="card-article-author-name">{author}</span>
        {date && <span className="card-article-date">{date}</span>}
        {readTime && <span className="card-article-date">{readTime} min read</span>}
      </div>
    </div>
  </Card>
);

/**
 * Stats Card Component
 * Displays statistics with optional change indicator
 */
export const StatsCard = ({ 
  value,
  label,
  change,
  icon,
  className = '',
  ...props 
}) => (
  <Card variant="stat" className={className} {...props}>
    {icon && <div className="card-icon card-icon-lg">{icon}</div>}
    <div className="card-stat-value">{value}</div>
    <div className="card-stat-label">{label}</div>
    {change && (
      <div className="card-stat-change">
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
      </div>
    )}
  </Card>
);

/**
 * Card with Image Component
 * Generic card with image header
 */
export const ImageCard = ({ 
  image,
  imageAlt,
  title,
  description,
  badge,
  actions,
  className = '',
  ...props 
}) => (
  <Card variant="with-image" className={className} {...props}>
    <div className="card-image-container">
      <img 
        src={image} 
        alt={imageAlt || title} 
        className="card-image"
      />
      {badge && <div className="card-badge">{badge}</div>}
    </div>
    
    <CardBody>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
      {actions && <div className="card-actions">{actions}</div>}
    </CardBody>
  </Card>
);

/**
 * Card Grid Component
 * Container for arranging cards in a grid layout
 */
export const CardGrid = ({ 
  children, 
  columns = 'auto',
  gap = 'xl',
  className = '',
  ...props 
}) => {
  const gridClass = columns === 'auto' 
    ? 'cards-grid' 
    : `cards-grid-${columns}`;
    
  return (
    <div className={`${gridClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Export all components as default object
export default {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardSubtitle,
  CardDescription,
  FeatureCard,
  PricingCard,
  TestimonialCard,
  ProductCard,
  ArticleCard,
  StatsCard,
  ImageCard,
  CardGrid
};

