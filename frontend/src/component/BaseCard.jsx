import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const BaseCard = ({
  children,
  className = '',
  image,
  imageAlt = '',
  title,
  category,
  price,
  linkTo,
  linkText = 'View Details',
  isLoading = false,
  isError = false,
  errorFallback = null
}) => {
  if (isError) {
    return errorFallback || (
      <div className="base-card-error">
        Failed to load card content
      </div>
    );
  }

  // Format price in INR
  const formattedPrice = price ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price) : null;

  return (
    <div className={`base-card ${className}`}>
      {image && (
        <div className="base-card-image-container" style={{ width: '200px', height: '200px' }}>
          {isLoading ? (
            <>
              <div className="base-card-loading-bar short" />
              <div className="base-card-loading-bar medium" />
              <div className="base-card-loading-bar long" />
            </>
          ) : (
            <>
              <img 
                src={image} 
                alt={imageAlt} 
                className="base-card-image block"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                loading="lazy"
              />
              {/* Removed category rendering as per user request */}
              {/* {category && (
                <div className="base-card-category">
                  {category}
                </div>
              )} */}
            </>
          )}
        </div>
      )}
      
      <div className="base-card-content">
        {isLoading ? (
          <>
            <div className="base-card-loading-bar short" />
            <div className="base-card-loading-bar medium" />
            <div className="base-card-loading-bar long" />
          </>
        ) : (
          <>
            {title && <h3 className="base-card-title">{title}</h3>}
            {children}
            {price && (
              <div className="base-card-price-container">
                <div className="base-card-price">
                  {formattedPrice}
                  <span className="base-card-price-subtext">starting price</span>
                </div>
                {linkTo && (
                  <Link 
                    to={linkTo}
                    className="base-card-link"
                  >
                    {linkText}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

BaseCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  price: PropTypes.number,
  linkTo: PropTypes.string,
  linkText: PropTypes.string,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  errorFallback: PropTypes.node
};

export default BaseCard;
