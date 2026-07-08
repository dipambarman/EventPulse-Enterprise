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
  const [formData, setFormData] = React.useState({
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

  // Use theme.image as fallback for main image
  const mainThemeImage = theme?.image || null;

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
