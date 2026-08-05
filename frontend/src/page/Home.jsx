import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllThemes } from "../services/themeService";
import ThemeCard from "../component/ThemeCard";
import "../styles/Home.css";

// Animated counter hook
const useCountUp = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
};

const Home = () => {
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const stat1 = useCountUp(500, 2000);
  const stat2 = useCountUp(120, 2000);
  const stat3 = useCountUp(98, 2000);
  const stat4 = useCountUp(15, 2000);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const allThemes = await getAllThemes();
        setThemes(allThemes);
      } catch (err) {
        setError("Failed to load themes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  const categories = ["All", "Birthday", "Corporate", "Wedding", "Travel"];
  const filteredThemes = activeCategory === "All"
    ? themes.slice(0, 6)
    : themes.filter(t => t.category === activeCategory).slice(0, 6);

  const testimonials = [
    { name: "Priya Sharma", role: "Wedding Planner", text: "EventPulse transformed how we manage large-scale weddings. The cost estimator alone saved us 20+ hours per event.", rating: 5 },
    { name: "Rahul Mehta", role: "Corporate Events Manager", text: "Our team switched from spreadsheets to EventPulse. The admin dashboard gives us real-time visibility into every booking.", rating: 5 },
    { name: "Anjali Das", role: "Birthday Party Organizer", text: "Clients love the interactive calculator. They can customize their event and see pricing instantly — bookings went up 40%.", rating: 5 },
  ];

  if (loading) {
    return (
      <div className="ep-loader">
        <div className="ep-loader-spinner"></div>
        <p className="ep-loader-text">Loading EventPulse...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ep-home-error">
        <div className="ep-home-error-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ep-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>{error}</p>
          <button className="ep-btn ep-btn-primary" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-home" id="home-page">

      {/* ====== HERO SECTION ====== */}
      <section className="ep-hero" id="hero-section">
        <div className="ep-hero-bg">
          <div className="ep-hero-orb ep-hero-orb-1"></div>
          <div className="ep-hero-orb ep-hero-orb-2"></div>
          <div className="ep-hero-orb ep-hero-orb-3"></div>
          <div className="ep-hero-grid"></div>
        </div>

        <div className="ep-hero-content ep-container">
          <div className="ep-hero-badge ep-animate-fade-in">
            <span className="ep-hero-badge-dot"></span>
            #1 Event Management Platform in India
          </div>

          <h1 className="ep-hero-title ep-animate-fade-in-up">
            Craft Unforgettable
            <span className="ep-hero-title-gradient"> Events </span>
            That Leave a Lasting Impression
          </h1>

          <p className="ep-hero-subtitle ep-animate-fade-in-up ep-delay-200">
            From intimate celebrations to grand galas — plan, customize, and book stunning events
            with our enterprise-grade platform trusted by 500+ businesses.
          </p>

          <div className="ep-hero-actions ep-animate-fade-in-up ep-delay-300">
            <Link to="/calculator" className="ep-btn ep-btn-accent ep-btn-lg" id="hero-cta-calculator">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
              Estimate Your Event Cost
            </Link>
            <Link to="/themes" className="ep-btn ep-btn-outline ep-btn-lg ep-hero-btn-outline" id="hero-cta-themes">
              Explore Themes
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="ep-hero-trust ep-animate-fade-in ep-delay-500">
            <div className="ep-trust-avatars">
              <div className="ep-trust-avatar" style={{ background: 'linear-gradient(135deg, #6C3CE1, #F97316)' }}>P</div>
              <div className="ep-trust-avatar" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)' }}>R</div>
              <div className="ep-trust-avatar" style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>A</div>
              <div className="ep-trust-avatar" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>M</div>
            </div>
            <span className="ep-trust-text">Join <strong>500+</strong> businesses already using EventPulse</span>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="ep-hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z"/>
          </svg>
        </div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="ep-stats" id="stats-section">
        <div className="ep-container">
          <div className="ep-stats-grid">
            <div className="ep-stat-card" ref={stat1.ref}>
              <div className="ep-stat-number">{stat1.count}+</div>
              <div className="ep-stat-label">Events Delivered</div>
            </div>
            <div className="ep-stat-card" ref={stat2.ref}>
              <div className="ep-stat-number">{stat2.count}+</div>
              <div className="ep-stat-label">Business Partners</div>
            </div>
            <div className="ep-stat-card" ref={stat3.ref}>
              <div className="ep-stat-number">{stat3.count}%</div>
              <div className="ep-stat-label">Client Satisfaction</div>
            </div>
            <div className="ep-stat-card" ref={stat4.ref}>
              <div className="ep-stat-number">{stat4.count}+</div>
              <div className="ep-stat-label">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CATEGORY FILTER + THEMES SECTION ====== */}
      <section className="ep-themes-showcase" id="themes-showcase">
        <div className="ep-container">
          <div className="ep-section-header">
            <span className="ep-badge ep-badge-primary">Our Collection</span>
            <h2 className="ep-section-title">Premium Event Packages</h2>
            <p className="ep-section-subtitle">
              Carefully curated themes designed by top event professionals for every occasion.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="ep-category-tabs" id="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`ep-category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Theme Cards Grid */}
          <div className="ep-themes-grid">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => (
                <div key={theme.id} className="ep-theme-card-wrapper">
                  <ThemeCard theme={theme} />
                </div>
              ))
            ) : (
              <p className="ep-no-themes">No themes available in this category yet.</p>
            )}
          </div>

          <div className="ep-view-all-cta">
            <Link to="/themes" className="ep-btn ep-btn-primary ep-btn-lg" id="view-all-themes">
              View All Packages
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ====== WHY CHOOSE US SECTION ====== */}
      <section className="ep-why-us" id="why-us-section">
        <div className="ep-container">
          <div className="ep-section-header">
            <span className="ep-badge ep-badge-accent">Why EventPulse</span>
            <h2 className="ep-section-title">Built for Event Professionals</h2>
            <p className="ep-section-subtitle">
              Everything you need to plan, manage, and grow your event business.
            </p>
          </div>

          <div className="ep-features-grid">
            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8" y2="10.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="16" y1="10" x2="16" y2="10.01"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="12" y1="18" x2="12" y2="18.01"/></svg>
              </div>
              <h3>Smart Cost Estimator</h3>
              <p>Let clients build their dream event interactively. Guest count, catering, decor, photography — calculated instantly.</p>
            </div>

            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3>Visual Booking Calendar</h3>
              <p>Manage all bookings with an interactive calendar. See availability, blockouts, and team assignments at a glance.</p>
            </div>

            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Secure Payments</h3>
              <p>Razorpay integration with multi-stage deposits. Collect advances, manage balances, and generate GST invoices.</p>
            </div>

            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3>Client Portal</h3>
              <p>Give clients their own dashboard with event countdowns, milestone tracking, invoice viewing, and planner contact.</p>
            </div>

            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #EC4899, #F472B6)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Revenue Analytics</h3>
              <p>Executive dashboard with revenue charts, conversion funnels, category performance, and booking pipeline insights.</p>
            </div>

            <div className="ep-feature-card">
              <div className="ep-feature-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <h3>Fully Customizable</h3>
              <p>White-label ready. Custom branding, dynamic pricing tiers, add-on services, and flexible package configurations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS SECTION ====== */}
      <section className="ep-testimonials" id="testimonials-section">
        <div className="ep-container">
          <div className="ep-section-header">
            <span className="ep-badge ep-badge-success">Client Stories</span>
            <h2 className="ep-section-title">Trusted by Event Professionals</h2>
          </div>

          <div className="ep-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="ep-testimonial-card">
                <div className="ep-testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p className="ep-testimonial-text">"{t.text}"</p>
                <div className="ep-testimonial-author">
                  <div className="ep-testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="ep-testimonial-name">{t.name}</div>
                    <div className="ep-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="ep-cta" id="cta-section">
        <div className="ep-cta-bg">
          <div className="ep-cta-orb ep-cta-orb-1"></div>
          <div className="ep-cta-orb ep-cta-orb-2"></div>
        </div>
        <div className="ep-container ep-cta-content">
          <h2 className="ep-cta-title">Ready to Transform Your Event Business?</h2>
          <p className="ep-cta-subtitle">
            Start planning your next event with our interactive cost estimator — no signup required.
          </p>
          <div className="ep-cta-actions">
            <Link to="/calculator" className="ep-btn ep-btn-accent ep-btn-lg" id="cta-calculator">
              Try the Cost Estimator
            </Link>
            <Link to="/contact" className="ep-btn ep-btn-outline ep-btn-lg ep-cta-btn-outline" id="cta-contact">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;