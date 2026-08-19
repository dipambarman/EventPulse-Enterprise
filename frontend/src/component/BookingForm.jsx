import React, { useState, useEffect } from 'react';
import '../styles/BookingForm.css';

// Commented out image imports until images are added
// import birthdayStandardImage from '../assets/birthday-standard.jpg';
// import birthdayPremiumImage from '../assets/birthday-premium.jpg';
// import birthdayExclusiveImage from '../assets/birthday-exclusive.jpg';

// import corporateStandardImage from '../assets/corporate-standlogo.jpg';
// import corporatePremiumImage from '../assets/corporate-prelogo.jpg';
// import corporateExclusiveImage from '../assets/corporate-exclogo.jpg';

// import weddingStandardImage from '../assets/wedding-standlogowedd.jpg';
// import weddingPremiumImage from '../assets/wedding-premiumlogowedd.webp';
// import weddingExclusiveImage from '../assets/wedding-exelogowedd.avif';

import exclusiveLogo from '../assets/exclusivelogo.jpeg';
import premiumLogo from '../assets/premiumlogo.jpg';
import standardLogo from '../assets/standardlogo.jpeg';

const BookingForm = ({ theme, availableDates, onCreateBooking, error }) => {
  const [formData, setFormData] = useState({
    selectedDate: '',
    endDate: '',
    guestCount: 1,
    venueType: 'provided',
    customVenueAddress: '',
    totalPrice: theme ? theme.basePrice : 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const mainThemeImage = theme?.image || null;

  const excludedThemes = ['birthday', 'wedding', 'corporate'];

  const getLogoForTheme = () => {
    if (!theme) return null;

    const themeName = theme.name.toLowerCase();

    if (themeName.includes('corporate')) {
      if (themeName.includes('standard')) {
        return standardLogo;
      } else if (themeName.includes('premium')) {
        return premiumLogo;
      } else if (themeName.includes('exclusive')) {
        return exclusiveLogo;
      }
    }

    if (themeName.includes('exclusive')) {
      return exclusiveLogo;
    } else if (themeName.includes('premium')) {
      return premiumLogo;
    } else if (themeName.includes('standard')) {
      return standardLogo;
    }

    return null;
  };

  const logoImage = getLogoForTheme();

  useEffect(() => {
    if (!theme) return;

    const venueType = formData.venueType;
    let price = theme.basePrice;

    const travelThemes = ['meghalaya', 'arunachal', 'sikkim', 'manali', 'delhi', 'jammu and kashmir'];
    const themeName = theme.name.toLowerCase();
    let spanDays = 1;
    if (travelThemes.some(t => themeName.includes(t)) && !excludedThemes.some(e => themeName.includes(e))) {
      const fixedSpans = {
        meghalaya: 3,
        arunachal: 4,
        sikkim: 5,
        manali: 6,
        delhi: 5,
        'jammu and kashmir': 6
      };
      spanDays = Object.entries(fixedSpans).find(([key]) => themeName.includes(key))?.[1] || 1;
    }

    let endDate = '';
    if (formData.selectedDate && spanDays > 1) {
      const start = new Date(formData.selectedDate);
      start.setDate(start.getDate() + spanDays - 1);
      endDate = start.toISOString().split('T')[0];
    } else {
      endDate = '';
    }

    if (venueType === 'customer') {
      price -= theme.venueDiscountAmount || 0;
    }

    if (excludedThemes.some(e => themeName.includes(e))) {
      const guestCount = Number(formData.guestCount) || 1;
      let minGuestCount = 0;
      let extraChargePerGuest = 0;
      if (themeName.includes('birthday')) {
        minGuestCount = 20;
        extraChargePerGuest = 100;
      } else if (themeName.includes('corporate')) {
        minGuestCount = 100;
        extraChargePerGuest = 150;
      } else if (themeName.includes('wedding')) {
        minGuestCount = 1000;
        extraChargePerGuest = 250;
      }
      if (guestCount > minGuestCount) {
        const extraGuests = guestCount - minGuestCount;
        price += extraGuests * extraChargePerGuest;
      }
    } else {
      // For travel themes, guestCount fixed to 1 and no extra guest charges
      const travelThemes = ['meghalaya', 'arunachal', 'sikkim', 'manali', 'delhi', 'jammu and kashmir', 'travel'];
      if (travelThemes.some(t => themeName.includes(t))) {
        if (formData.guestCount !== 1) {
          setFormData(prev => ({ ...prev, guestCount: 1 }));
        }
      }
    }

    if (price !== formData.totalPrice || endDate !== formData.endDate) {
      setFormData(prev => ({ ...prev, totalPrice: price, endDate }));
    }
  }, [formData.guestCount, formData.venueType, formData.selectedDate, theme]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBooking(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h1>Book Your Event</h1>

      {/* Interactive Booking Stepper Indicator */}
      <div className="ep-stepper" aria-label="Booking steps progress">
        <div className={`ep-stepper-item ${formData.selectedDate ? 'completed' : 'active'}`}>
          <div className="ep-stepper-circle">{formData.selectedDate ? '✓' : '1'}</div>
          <span className="ep-stepper-label">Event Date</span>
        </div>
        <div className={`ep-stepper-item ${formData.guestCount > 0 ? (formData.selectedDate ? 'active' : '') : ''}`}>
          <div className="ep-stepper-circle">2</div>
          <span className="ep-stepper-label">Venue & Guests</span>
        </div>
        <div className={`ep-stepper-item ${formData.firstName && formData.email ? 'completed' : ''}`}>
          <div className="ep-stepper-circle">3</div>
          <span className="ep-stepper-label">Confirm</span>
        </div>
      </div>

      {mainThemeImage && (
        <div className="theme-main-image-container">
          <img src={mainThemeImage} alt={`${theme?.name || 'Theme'} main`} className="theme-main-image" />
        </div>
      )}

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

      <label>
        Select Date:
        <input
          type="date"
          name="selectedDate"
          value={formData.selectedDate}
          onChange={handleChange}
          required
          min={new Date().toISOString().split('T')[0]}
          max={availableDates.length > 0 ? availableDates[availableDates.length - 1] : undefined}
        />
        <small>Please select a date within the available range.</small>
      </label>

      {(() => {
        const travelThemes = ['meghalaya', 'arunachal', 'sikkim', 'manali', 'delhi', 'jammu and kashmir'];
        const themeName = theme.name.toLowerCase();
        const showEndDate = travelThemes.some(t => themeName.includes(t)) && !excludedThemes.some(e => themeName.includes(e));
        if (showEndDate) {
          return (
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                readOnly
              />
            </label>
          );
        }
        return null;
      })()}

      <label>
        Number of Guests:
        <input
          type="number"
          name="guestCount"
          min={1}
          value={formData.guestCount}
          onChange={handleChange}
          onBlur={(e) => {
            if (e.target.value === '' || e.target.value === '0') {
              alert('Please enter the number of guests (minimum 1).');
              setFormData(prev => ({ ...prev, guestCount: 1 }));
            }
          }}
          required
          disabled={(() => {
            const travelThemes = ['meghalaya', 'arunachal', 'sikkim', 'manali', 'delhi', 'jammu and kashmir', 'travel'];
            const themeName = theme.name.toLowerCase();
            return travelThemes.some(t => themeName.includes(t));
          })()}
        />
      </label>
      {excludedThemes.some(e => theme.name.toLowerCase().includes(e)) && (
        <div className="extra-guest-price-info">
          {theme.name.toLowerCase().includes('birthday') && <p>Extra Guest Price: ₹100 per guest above 20</p>}
          {theme.name.toLowerCase().includes('corporate') && <p>Extra Guest Price: ₹150 per guest above 100</p>}
          {theme.name.toLowerCase().includes('wedding') && <p>Extra Guest Price: ₹250 per guest above 1000</p>}
        </div>
      )}


      <label>
        Venue Type:
        <select name="venueType" value={formData.venueType} onChange={handleChange}>
          <option value="provided">Provided by us</option>
          <option value="customer">Customer's Venue</option>
        </select>
      </label>

      {formData.venueType === 'customer' && (
        <label>
          Venue Address:
          <input
            type="text"
            name="customVenueAddress"
            value={formData.customVenueAddress}
            onChange={handleChange}
            required={formData.venueType === 'customer'}
          />
        </label>
      )}

      <h2>Customer Information</h2>

      <label>
        First Name:
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </label>

      <label>
        Last Name:
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </label>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Phone:
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>

      <label>
        Special Requests:
        <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} />
      </label>

      <div>Total Price: {typeof formData.totalPrice === 'number' ? formData.totalPrice.toFixed(2) : '0.00'}</div>

      {error && <div className="error">{error}</div>}

      <button type="submit">Proceed to Payment</button>
    </form>
  );
};

export default BookingForm;
