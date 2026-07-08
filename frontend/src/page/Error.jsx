import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Error = () => {
  return (
    <div className="error-page-container">
      <h1 className="error-title">Oops! Something Went Wrong.</h1>
      <p className="error-message">
        We couldn't find the page you were looking for. It might have been removed, or the URL might be incorrect.
      </p>
      <p className="error-suggestion">
        Please check the URL or return to the home page.
      </p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
};

export default Error;