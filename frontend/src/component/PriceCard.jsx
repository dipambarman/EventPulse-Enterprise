import React from 'react';
import BaseCard from './BaseCard';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/components.css';

const PriceCard = ({
  id,
  title,
  price,
  period = 'month',
  features = [],
  isFeatured = false,
  isLoading,
  isError
}) => {
  return (
    <BaseCard
      className={isFeatured ? 'price-card-ring' : ''}
      title={title}
      price={price}
      linkTo={`/pricing/${id}`}
      linkText="Get Started"
      isLoading={isLoading}
      isError={isError}
    >
      <div className="price-card-text-center">
        <span className="price-card-feature-unavailable">
          per {period}
        </span>
      </div>

      <ul className="price-card-feature-list">
        {features.map((feature, index) => (
          <li key={index} className="price-card-feature-item">
            {feature.available ? (
              <FontAwesomeIcon 
                icon={faCheck} 
                className="price-card-feature-icon price-card-feature-icon-available" 
              />
            ) : (
              <FontAwesomeIcon 
                icon={faTimes} 
                className="price-card-feature-icon price-card-feature-icon-unavailable" 
              />
            )}
            <span className={feature.available ? 'price-card-feature-available' : 'price-card-feature-unavailable'}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>
    </BaseCard>
  );
};

PriceCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  period: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired
    })
  ),
  isFeatured: PropTypes.bool,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};

export default PriceCard;
