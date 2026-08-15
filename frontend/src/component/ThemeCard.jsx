import React from 'react';
import BaseCard from './BaseCard';
import PropTypes from 'prop-types';

const ThemeCard = ({ theme }) => {
  if (!theme) return null;

  const { id, name, description, price, category, features = [], gallery = [] } = theme;

  // Placeholder image fallback
  const displayImage = gallery[0] || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224px%22%20fill%3D%22%23aaa%22%3EEventPulse%20Theme%3C%2Ftext%3E%3C%2Fsvg%3E';

  return (
    <BaseCard
      image={displayImage}
      imageAlt={name}
      title={name}
      category={category}
      price={Number(price)}
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
