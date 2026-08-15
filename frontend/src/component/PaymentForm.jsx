import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const PaymentForm = ({ bookingDetails, totalAmount, onPaymentSuccess }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      setErrors({ payment: 'Failed to load Razorpay SDK. Please try again later.' });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order on backend
      const response = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          bookingId: bookingDetails.id || bookingDetails.bookingId
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        setErrors({ payment: orderData.error || 'Failed to create order. Please try again.' });
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ORMoqQwaGSJZXh', // Use Vite env variable for Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Event Booking',
        description: 'Payment for booking',
        order_id: orderData.id,
      handler: async function (response) {
          // On successful payment, verify payment signature with backend
          try {
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: bookingDetails.id || bookingDetails.bookingId
              })
            });
            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.status === 'success') {
              onPaymentSuccess(response.razorpay_payment_id);
            } else {
              setErrors({ payment: verifyData.message || verifyData.error || 'Payment verification failed.' });
            }
          } catch (error) {
            setErrors({ payment: 'Payment verification error. Please try again.' });
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: bookingDetails.name || '',
          email: bookingDetails.email || '',
          contact: bookingDetails.phone || ''
        },
        theme: {
          color: '#5e72e4'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Patch to fix SVG width/height="auto" issue injected by Razorpay script
      rzp.on('ready', () => {
        // One-time fix
        setTimeout(() => {
          const svgs = document.querySelectorAll('svg[width="auto"], svg[height="auto"]');
          svgs.forEach(svg => {
            if (svg.getAttribute('width') === 'auto') {
              svg.removeAttribute('width');
            }
            if (svg.getAttribute('height') === 'auto') {
              svg.removeAttribute('height');
            }
          });
        }, 2000); // Increased delay to allow Razorpay DOM to render fully

        // MutationObserver to continuously fix SVG attributes dynamically
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Element node
                if (node.tagName === 'svg') {
                  if (node.getAttribute('width') === 'auto') {
                    node.removeAttribute('width');
                  }
                  if (node.getAttribute('height') === 'auto') {
                    node.removeAttribute('height');
                  }
                }
                // Also check descendants
                const svgs = node.querySelectorAll && node.querySelectorAll('svg[width="auto"], svg[height="auto"]');
                svgs && svgs.forEach(svg => {
                  if (svg.getAttribute('width') === 'auto') {
                    svg.removeAttribute('width');
                  }
                  if (svg.getAttribute('height') === 'auto') {
                    svg.removeAttribute('height');
                  }
                });
              }
            });
          });
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });

    } catch (error) {
      setErrors({ payment: 'Payment failed. Please try again later.' });
      console.error('Razorpay payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRazorpayPayment();
  };

  return (
    <div className="payment-form-container">
      <h2>Complete Your Payment</h2>
      <p className="payment-amount">Total Amount: {(typeof totalAmount !== 'number' || isNaN(totalAmount)) ? '0.00' : totalAmount.toFixed(2)}</p>

      {errors.payment && (
        <div className="error-message payment-error">
          {errors.payment}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="payment-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isProcessing}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>
      </form>

      <div className="payment-security-info">
        <p>
          <i className="lock-icon"></i>
          Your payment is secure and processed by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentForm;
