import React, { useEffect, useState } from "react";
import { getAllThemes } from "../services/themeService";
import ThemeCard from "../component/ThemeCard";
import "../styles/index.css";
import "../styles/Home.css";



const Home = () => {
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const allThemes = await getAllThemes();
        setThemes(allThemes);
      } catch (err) {
        setError('Failed to load themes. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  if (loading) {
    return <div className="loading-container"><div className="loader"></div><p>Loading themes...</p></div>;
  }

  if (error) {
    return <div className="error-container"><p className="error-message">{error}</p><button className="retry-button" onClick={() => window.location.reload()}>Try Again</button></div>;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span>Welcome to</span>
            <span className="gradient-text">GU Event Planner</span>
          </h1>
          <p className="hero-subtitle">
            Your one-stop solution for planning and managing remarkable events.
          </p>
          <div className="hero-buttons">
            <a href="/themes" className="primary-button">Explore Themes</a>
            <a href="/contact" className="secondary-button">Contact Us</a>
          </div>
        </div>
        
        <div className="wave-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,181.3C672,203,768,213,864,202.7C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Themes Section */}
      <div className="themes-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Themes</h2>
            <p>Browse our collection of carefully curated themes to make your next event stand out.</p>
          </div>

          <div className="themes-grid">
            {themes.map((theme) => (
              <div key={theme.id} className="theme-card-wrapper">
                <ThemeCard theme={theme} />
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <a href="/themes" className="view-all-button">
              View All Themes
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Curved section divider */}
      <div className="curve-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#f3f4f6" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>GU Event Planner</h3>
              <p>Making your events memorable since 2023</p>
            </div>
          <div className="footer-links">
            <a href="/about-us">About</a>
            <a href="/contact">Contact</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </div>
          </div>
          <div className="footer-bottom">
            <p>© 2023 GU Event Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;