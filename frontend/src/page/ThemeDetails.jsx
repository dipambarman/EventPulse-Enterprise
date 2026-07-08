import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThemeById } from '../services/themeService';
import '../styles/ThemeDetails.css';

const ThemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const data = await getThemeById(id);
        setTheme(data);
      } catch (err) {
        setError('Failed to load theme details.');
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, [id]);

  const handleBookNow = () => {
    navigate(`/booking?themeId=${id}`);
  };

  // For gallery images, using a placeholder array if theme doesn't have a gallery
  // Exclude background image from gallery images
  const backgroundImages = {
    b1: '/src/assets/standarddisplaybd.jpg',
    b2: '/src/assets/premiumdisplay.webp',
    b3: '/src/assets/exclusivedisplay.avif',
    c1: '/src/assets/corstandarddisplay.webp',
    c2: '/src/assets/corpredisplay.jpg',
    c3: '/src/assets/corexclusivedisplay.jpg',
    w1: '/src/assets/wedstanddisplay.jpeg.jpg',
    w2: '/src/assets/wedpredisplay.webp',
    w3: '/src/assets/wedexedisplay.webp',
    t1: '/src/assets/meghdisplay.jpg',
    t2: '/src/assets/arudisplay.webp',
    t3: '/src/assets/sikdisplay.webp',
    t4: '/src/assets/mandispaly.jpeg.jpg',
    t5: '/src/assets/deldisplay.webp',
    t6: '/src/assets/kashdis.webp',
  };

  const mainImageSrc = theme && backgroundImages[theme.id] ? backgroundImages[theme.id] : (theme?.image || '/default-theme-image.jpg');

  const galleryImages = theme?.gallery ? theme.gallery.filter(img => img !== mainImageSrc) : [
    theme?.image || '/default-theme-image.jpg',
    '/gallery-image-2.jpg',
    '/gallery-image-3.jpg'
  ];

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading theme details...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
    </div>
  );
  
  if (!theme) return (
    <div className="not-found-container">
      <h2>No theme found</h2>
      <p>We couldn't find the theme you're looking for.</p>
      <button onClick={() => navigate('/themes')} className="browse-button">Browse Themes</button>
    </div>
  );

  return (
    <div className="theme-details">
      <div className={`theme-header ${theme ? theme.id : ''}`}>
        {/* Remove main image for all categories to avoid overlap with background */}
        {/* Background images will be visible for all categories */}
        <div className="theme-overlay">
          <h1>{theme.name}</h1>
          <span className="theme-category">{theme.category}</span>
        </div>
      </div>
      
      <div className="theme-content">
        <div className="theme-meta">
          <div className="theme-price">
            <span className="price-label">Price:</span>
            <span className="price-value">₹{theme.price}</span>
          </div>
          
          <div className="theme-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={`star ${star <= (theme.rating || 4.5) ? 'filled' : ''}`}
              >★</span>
            ))}
            <span className="rating-count">({theme.reviews || 24} reviews)</span>
          </div>
        </div>
        
        <div className="theme-description-container">
          <h2>About This Theme</h2>
          <p className="theme-description">{theme.description || "Experience our beautifully designed theme that will transform your event into something truly special. This package includes everything you need for a memorable celebration with your loved ones."}</p>
        </div>
        
        {theme.features && theme.features.length > 0 && (
          <div className="theme-features">
            <h2>What's Included</h2>
            <ul className="features-list">
              {theme.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="theme-gallery">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className={`gallery-item ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image} alt={`${theme.name} - Image ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="testimonial">
          <p className="testimonial-text">
            "{theme.testimonial || "This theme exceeded all my expectations! The decorations were stunning and my guests couldn't stop complimenting the setup. Absolutely worth it!"}"
          </p>
          <p className="testimonial-author">— {theme.testimonialAuthor || "Happy Customer"}</p>
        </div>
        
        <div className="booking-section">
          <div className="booking-info">
            <h3>Ready to make your event special?</h3>
            <p>Book this theme now and our team will contact you within 24 hours to discuss the details.</p>
          </div>
          <button 
            onClick={handleBookNow}
            className="book-now-btn"
          >
            Book Now
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeDetails;
