import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/EventCalculator.css';

const EventCalculator = () => {
  const navigate = useNavigate();

  // Wizard state
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState('Wedding');
  const [guestCount, setGuestCount] = useState(100);
  const [selectedTheme, setSelectedTheme] = useState('premium');
  const [selectedAddons, setSelectedAddons] = useState(['catering', 'photography']);
  const [durationDays, setDurationDays] = useState(1);

  // Pricing constants (in INR)
  const basePrices = {
    Wedding: { standard: 150000, premium: 350000, exclusive: 750000 },
    Corporate: { standard: 50000, premium: 120000, exclusive: 300000 },
    Birthday: { standard: 15000, premium: 45000, exclusive: 100000 },
    Concert: { standard: 250000, premium: 600000, exclusive: 1200000 },
    Travel: { standard: 20000, premium: 50000, exclusive: 120000 }
  };

  const perGuestRates = {
    Wedding: 800,
    Corporate: 500,
    Birthday: 300,
    Concert: 400,
    Travel: 1000
  };

  const addonPrices = {
    catering: { name: 'Gourmet Catering & Drinks', pricePerGuest: 650, icon: '🍷' },
    photography: { name: '4K Cinematic Video & Photo', priceFlat: 45000, icon: '📸' },
    lighting: { name: 'Intelligent Stage & Laser Lighting', priceFlat: 30000, icon: '💡' },
    dj: { name: 'Live DJ & Sound System (10,000W)', priceFlat: 25000, icon: '🎧' },
    floral: { name: 'Exotic Floral Stage Entrance', priceFlat: 50000, icon: '🌸' },
    security: { name: 'Professional Event Bouncers', priceFlat: 15000, icon: '🛡️' }
  };

  // Calculation logic
  const basePrice = basePrices[eventType]?.[selectedTheme] || 100000;
  const guestCost = guestCount * (perGuestRates[eventType] || 500);
  
  let addonsCost = 0;
  selectedAddons.forEach((addonKey) => {
    const addon = addonPrices[addonKey];
    if (addon) {
      if (addon.pricePerGuest) {
        addonsCost += addon.pricePerGuest * guestCount;
      }
      if (addon.priceFlat) {
        addonsCost += addon.priceFlat;
      }
    }
  });

  const subtotal = (basePrice + guestCost + addonsCost) * durationDays;
  const gstTax = Math.round(subtotal * 0.18); // 18% GST
  const estimatedTotal = subtotal + gstTax;
  const advanceDeposit = Math.round(estimatedTotal * 0.25); // 25% Deposit

  const toggleAddon = (key) => {
    if (selectedAddons.includes(key)) {
      setSelectedAddons(selectedAddons.filter((k) => k !== key));
    } else {
      setSelectedAddons([...selectedAddons, key]);
    }
  };

  const handleProceedToBooking = () => {
    navigate('/booking', {
      state: {
        eventType,
        guestCount,
        selectedTheme,
        selectedAddons,
        estimatedTotal,
        advanceDeposit
      }
    });
  };

  return (
    <div className="ep-calc-page" id="event-calculator-page">
      <div className="ep-calc-hero">
        <div className="ep-container">
          <span className="ep-badge ep-badge-accent">Interactive Tool</span>
          <h1 className="ep-calc-title">Instant Event Cost Estimator</h1>
          <p className="ep-calc-subtitle">
            Customize every detail of your upcoming event and get a transparent line-item price breakdown in seconds.
          </p>
        </div>
      </div>

      <div className="ep-container ep-calc-container">
        {/* Step Progress Bar */}
        <div className="ep-calc-steps-bar">
          <div className={`ep-calc-step-item ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
            <div className="ep-step-num">1</div>
            <span>Event Type</span>
          </div>
          <div className="ep-step-line"></div>
          <div className={`ep-calc-step-item ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
            <div className="ep-step-num">2</div>
            <span>Package Tier</span>
          </div>
          <div className="ep-step-line"></div>
          <div className={`ep-calc-step-item ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
            <div className="ep-step-num">3</div>
            <span>Add-On Services</span>
          </div>
          <div className="ep-step-line"></div>
          <div className={`ep-calc-step-item ${step >= 4 ? 'active' : ''}`} onClick={() => setStep(4)}>
            <div className="ep-step-num">4</div>
            <span>Quote Breakdown</span>
          </div>
        </div>

        <div className="ep-calc-layout">
          {/* Main Controls Panel */}
          <div className="ep-calc-main-panel ep-card">
            
            {/* Step 1: Event Type & Guests */}
            {step === 1 && (
              <div className="ep-calc-step-content ep-animate-fade-in">
                <h2>Select Event Category & Capacity</h2>
                <p className="ep-step-desc">Choose what type of occasion you're hosting and estimated attendance.</p>
                
                <div className="ep-event-types-grid">
                  {[
                    { id: 'Wedding', name: 'Wedding & Sangeet', icon: '💍', desc: 'Grand setups, floral mandap, luxury seating' },
                    { id: 'Corporate', name: 'Corporate Summit', icon: '🏢', desc: 'AV presentation, stage, lighting, catering' },
                    { id: 'Birthday', name: 'Birthday & Anniversary', icon: '🎂', desc: 'Theme decor, balloon arch, entertainer stage' },
                    { id: 'Concert', name: 'Concert & Gala', icon: '🎸', desc: 'Heavy truss, 10kW sound, LED wall display' },
                    { id: 'Travel', name: 'Destination Retreat', icon: '✈️', desc: 'Travel logistics, resort booking, group excursions' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      className={`ep-event-type-card ${eventType === item.id ? 'selected' : ''}`}
                      onClick={() => setEventType(item.id)}
                    >
                      <div className="ep-event-type-icon">{item.icon}</div>
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="ep-guest-slider-group">
                  <div className="ep-guest-header">
                    <label>Estimated Guest Count</label>
                    <span className="ep-guest-count-badge">{guestCount} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="ep-range-input"
                  />
                  <div className="ep-slider-ticks">
                    <span>10 Intimate</span>
                    <span>250 Medium</span>
                    <span>500 Large</span>
                    <span>1000+ Grand</span>
                  </div>
                </div>

                <div className="ep-duration-group">
                  <label>Event Duration (Days)</label>
                  <div className="ep-duration-buttons">
                    {[1, 2, 3, 5].map((d) => (
                      <button
                        key={d}
                        className={`ep-duration-btn ${durationDays === d ? 'active' : ''}`}
                        onClick={() => setDurationDays(d)}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ep-step-actions">
                  <button className="ep-btn ep-btn-primary ep-btn-lg" onClick={() => setStep(2)}>
                    Next: Choose Tier →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Package Tier */}
            {step === 2 && (
              <div className="ep-calc-step-content ep-animate-fade-in">
                <h2>Select Package Experience Tier</h2>
                <p className="ep-step-desc">Pick the scale of decor, seating, stage size, and production value.</p>

                <div className="ep-tier-grid">
                  <div
                    className={`ep-tier-card ${selectedTheme === 'standard' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('standard')}
                  >
                    <div className="ep-tier-badge">Essential</div>
                    <h3>Standard Tier</h3>
                    <div className="ep-tier-price">
                      ₹{(basePrices[eventType]?.standard || 50000).toLocaleString('en-IN')}
                    </div>
                    <ul className="ep-tier-list">
                      <li>✓ Standard Stage & Backdrop Decor</li>
                      <li>✓ Premium Ambient LED Lighting</li>
                      <li>✓ Basic Sound System & Mic Setup</li>
                      <li>✓ Round Tables & Banquet Chairs</li>
                      <li>✓ On-site Event Supervisor</li>
                    </ul>
                  </div>

                  <div
                    className={`ep-tier-card ep-tier-popular ${selectedTheme === 'premium' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('premium')}
                  >
                    <div className="ep-tier-badge ep-badge-accent">Most Popular</div>
                    <h3>Premium Tier</h3>
                    <div className="ep-tier-price">
                      ₹{(basePrices[eventType]?.premium || 120000).toLocaleString('en-IN')}
                    </div>
                    <ul className="ep-tier-list">
                      <li>✓ Custom Theme Design & Floral Entrance</li>
                      <li>✓ Intelligent Moving Light Show</li>
                      <li>✓ Pro JBL/RCF Sound Rig (5000W)</li>
                      <li>✓ Velvet Lounge Seating & VIP Table Setup</li>
                      <li>✓ Dedicated Event Director + 2 Staff</li>
                    </ul>
                  </div>

                  <div
                    className={`ep-tier-card ${selectedTheme === 'exclusive' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('exclusive')}
                  >
                    <div className="ep-tier-badge ep-badge-primary">Luxury</div>
                    <h3>Exclusive VIP</h3>
                    <div className="ep-tier-price">
                      ₹{(basePrices[eventType]?.exclusive || 300000).toLocaleString('en-IN')}
                    </div>
                    <ul className="ep-tier-list">
                      <li>✓ 4K P2.5 Indoor/Outdoor LED Screen Wall</li>
                      <li>✓ Signature Designer Floral Installation</li>
                      <li>✓ Concert-Grade Sound Rig & Cold Pyro</li>
                      <li>✓ Custom Red Carpet Entrance & Photo Ops</li>
                      <li>✓ Full Production Crew & Executive Director</li>
                    </ul>
                  </div>
                </div>

                <div className="ep-step-actions">
                  <button className="ep-btn ep-btn-ghost" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="ep-btn ep-btn-primary ep-btn-lg" onClick={() => setStep(3)}>
                    Next: Add-On Services →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Add-Ons */}
            {step === 3 && (
              <div className="ep-calc-step-content ep-animate-fade-in">
                <h2>Customize Add-On Services</h2>
                <p className="ep-step-desc">Enhance your event experience with specialized high-value services.</p>

                <div className="ep-addons-grid">
                  {Object.entries(addonPrices).map(([key, item]) => {
                    const isSelected = selectedAddons.includes(key);
                    return (
                      <div
                        key={key}
                        className={`ep-addon-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleAddon(key)}
                      >
                        <div className="ep-addon-header">
                          <span className="ep-addon-icon">{item.icon}</span>
                          <input type="checkbox" checked={isSelected} readOnly />
                        </div>
                        <h3>{item.name}</h3>
                        <div className="ep-addon-price-tag">
                          {item.pricePerGuest
                            ? `₹${item.pricePerGuest}/guest (₹${(item.pricePerGuest * guestCount).toLocaleString('en-IN')})`
                            : `₹${item.priceFlat.toLocaleString('en-IN')} flat rate`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="ep-step-actions">
                  <button className="ep-btn ep-btn-ghost" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button className="ep-btn ep-btn-primary ep-btn-lg" onClick={() => setStep(4)}>
                    View Detailed Breakdown →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Quote */}
            {step === 4 && (
              <div className="ep-calc-step-content ep-animate-fade-in">
                <h2>Itemized Estimate & Booking Options</h2>
                <p className="ep-step-desc">Review your formal quote summary below. You can lock in your date with a 25% deposit.</p>

                <div className="ep-quote-summary-box">
                  <div className="ep-quote-line">
                    <span>Base Tier ({eventType} - {selectedTheme.toUpperCase()})</span>
                    <strong>₹{basePrice.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="ep-quote-line">
                    <span>Guest Allowance & Service ({guestCount} guests @ {durationDays} day(s))</span>
                    <strong>₹{(guestCost * durationDays).toLocaleString('en-IN')}</strong>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div className="ep-quote-line">
                      <span>Selected Add-On Services ({selectedAddons.length} item(s))</span>
                      <strong>₹{(addonsCost * durationDays).toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                  <div className="ep-quote-divider"></div>
                  <div className="ep-quote-line">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="ep-quote-line">
                    <span>GST Tax (18%)</span>
                    <span>₹{gstTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="ep-quote-divider"></div>
                  <div className="ep-quote-line ep-quote-total">
                    <span>Estimated Total Cost</span>
                    <strong className="ep-total-price">₹{estimatedTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="ep-quote-deposit-callout">
                    <span>Required Deposit to Lock Date (25%):</span>
                    <strong>₹{advanceDeposit.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="ep-step-actions ep-quote-actions">
                  <button className="ep-btn ep-btn-ghost" onClick={() => setStep(3)}>
                    ← Adjust Items
                  </button>
                  <button className="ep-btn ep-btn-accent ep-btn-lg" onClick={handleProceedToBooking}>
                    Reserve Date with Deposit →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Floating Live Estimate Summary Card */}
          <div className="ep-calc-sidebar">
            <div className="ep-calc-sidebar-card ep-card">
              <h3 className="ep-sidebar-title">Live Price Summary</h3>
              
              <div className="ep-sidebar-detail-list">
                <div className="ep-sidebar-row">
                  <span className="label">Event Type</span>
                  <span className="val">{eventType}</span>
                </div>
                <div className="ep-sidebar-row">
                  <span className="label">Guest Count</span>
                  <span className="val">{guestCount} People</span>
                </div>
                <div className="ep-sidebar-row">
                  <span className="label">Package Tier</span>
                  <span className="val capital">{selectedTheme}</span>
                </div>
                <div className="ep-sidebar-row">
                  <span className="label">Add-ons</span>
                  <span className="val">{selectedAddons.length} Selected</span>
                </div>
                <div className="ep-sidebar-row">
                  <span className="label">Duration</span>
                  <span className="val">{durationDays} Day(s)</span>
                </div>
              </div>

              <div className="ep-sidebar-divider"></div>

              <div className="ep-sidebar-price-block">
                <div className="ep-price-label">Estimated Total</div>
                <div className="ep-price-amount">₹{estimatedTotal.toLocaleString('en-IN')}</div>
                <div className="ep-price-note">Includes 18% GST</div>
              </div>

              <div className="ep-sidebar-deposit">
                <span>Lock Date Deposit (25%):</span>
                <strong>₹{advanceDeposit.toLocaleString('en-IN')}</strong>
              </div>

              <button
                className="ep-btn ep-btn-primary ep-btn-block"
                onClick={handleProceedToBooking}
              >
                Book This Estimate
              </button>

              <div className="ep-guarantee-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ep-success)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                100% Price Lock Guarantee & Instant Confirmation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalculator;
