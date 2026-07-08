import React from 'react';
import '../styles/index.css';
import '../styles/privacy.css'; // Use the same stylesheet as Terms

const PrivacyPolicy = () => {
  return (
    <div className="terms-page">
      <h1 className="terms-title">Privacy Policy</h1>

      <section className="terms-section">
        <h2 className="terms-subtitle">1. Introduction</h2>
        <p>
          At GU Event Planner, we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">2. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, phone number, event preferences, and payment details when you interact with our website or book a service.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">3. Use of Information</h2>
        <p>
          The information we collect is used to process bookings, personalize your experience, improve our services, and communicate with you regarding your events or inquiries.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">4. Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share data with trusted partners who assist in operating our services, provided they agree to keep this information confidential.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, misuse, or disclosure.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">6. Cookies and Tracking</h2>
        <p>
          Our website may use cookies to enhance user experience and gather analytics. You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">7. Your Rights</h2>
        <p>
          You have the right to access, correct, or request deletion of your personal data. For requests or questions, please contact us using the information below.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-subtitle">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@gueventplanner.com" className="terms-link">info@gueventplanner.com</a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
