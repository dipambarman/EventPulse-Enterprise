import React from 'react';
import BaseCard from './BaseCard';
import PropTypes from 'prop-types';
import '../styles/components.css';

const ThemeCard = ({ 
  id, 
  title, 
  description, 
  image, 
  price, 
  category,
  features = [],
  isLoading,
  isError
}) => {
  return (
    <BaseCard
      image={image}
      imageAlt={title}
      title={title}
      category={category}
      price={price}
      linkTo={`/themes/${id}`}
      isLoading={isLoading}
      isError={isError}
    >
      {description && <p className="theme-card-description">{description}</p>}
      
      {features.length > 0 && (
        <div className="theme-card-includes">
          <h4 className="theme-card-includes-title">Includes:</h4>
          <ul className="theme-card-feature-list">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="theme-card-feature-item">
                <svg className="theme-card-feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
            {features.length > 3 && (
              <li className="theme-card-more-features">+ {features.length - 3} more features</li>
            )}
          </ul>
        </div>
      )}
    </BaseCard>
  );
};

ThemeCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};

export default ThemeCard;
