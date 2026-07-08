const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBooking(formData);
  };

  // Helper to check if a date is available
  const isDateAvailable = (date) => {
    return availableDates.includes(date);
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h1>Book Your Event</h1>

      {/* Display the main theme image dynamically */}
      {mainThemeImage && (
        <div className="theme-main-image-container">
          <img src={mainThemeImage} alt={`${theme?.name || 'Theme'} main`} className="theme-main-image" />
        </div>
      )}

      {/* Display the theme logo */}
      {(theme.name.toLowerCase().includes('corporate')) ? (
        <div className="theme-logo-container">
          {theme.name.toLowerCase().includes('standard') && <img src={standardLogo} alt="Corporate Standard logo" className="theme-logo" />}
          {theme.name.toLowerCase().includes('premium') && <img src={premiumLogo} alt="Corporate Premium logo" className="theme-logo" />}
          {theme.name.toLowerCase().includes('exclusive') && <img src={exclusiveLogo} alt="Corporate Exclusive logo" className="theme-logo" />}
        </div>
      ) : (
        logoImage && (
          <div className="theme-logo-container">
            <img src={logoImage} alt={`${theme?.name || 'Theme'} logo`} className="theme-logo" />
          </div>
        )
      )}

      {/* ... rest of the form fields ... */}

    </form>
  );
};

export default BookingForm;
