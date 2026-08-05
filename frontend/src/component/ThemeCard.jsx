import React from 'react';
import BaseCard from './BaseCard';
import PropTypes from 'prop-types';

const ThemeCard = ({ theme }) => {
  if (!theme) return null;

  const { id, name, description, price, category, features = [], gallery = [] } = theme;

  // Placeholder image fallback
  const displayImage = gallery[0] || 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80';

  return (
    <BaseCard
      image={displayImage}
      imageAlt={name}
      title={name}
      category={category}
      price={price}
      linkTo={`/themes/${id}`}
      linkText="View Package"
    >
      {description && <p className="base-card-description">{description}</p>}
      
      {features && features.length > 0 && (
        <ul className="base-card-features">
          {features.slice(0, 3).map((f, i) => (
            <li key={i}>✓ {f}</li>
          ))}
        </ul>
      )}
    </BaseCard>
  );
};

ThemeCard.propTypes = {
  theme: PropTypes.object
};

export default ThemeCard;
