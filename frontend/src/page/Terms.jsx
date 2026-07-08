import React from 'react';
import '../styles/index.css'; 
import '../styles/Terms.css';// Make sure this includes your custom CSS

const Terms = () => {
  return (
    <div className="terms-page">
      <h1 className="terms-title">Terms and Conditions</h1>

      <section className="terms-section">
        <h2 className="terms-subtitle">1. Introduction</h2>
        <p>
          Welcome to GU Event Planner. These Terms and Conditions govern your use of our website and services.
          By accessing or using our services, you agree to comply with and be bound by these terms.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">2. Services</h2>
        <p>
          We provide event planning and management services tailored to your needs...
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">3. User Responsibilities</h2>
        <p>
          Users agree to provide accurate information and cooperate with our team...
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">4. Payment and Cancellation</h2>
        <p>
          Payment terms will be outlined in your agreement...
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">5. Limitation of Liability</h2>
        <p>
          GU Event Planner is not liable for any indirect, incidental, or consequential damages...
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">6. Changes to Terms</h2>
        <p>
          We reserve the right to update these Terms and Conditions at any time...
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">7. Contact Us</h2>
        <p>
          For any questions, please contact us at <a href="mailto:info@gueventplanner.com" className="terms-link">info@gueventplanner.com</a>.
        </p>
      </section>
    </div>
  );
};

export default Terms;
