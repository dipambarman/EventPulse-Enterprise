const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using environment configuration
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

const FROM_EMAIL = process.env.EMAIL_FROM || '"EventPulse" <noreply@eventpulse.io>';

/**
 * Send Password Reset Email
 */
exports.sendPasswordResetEmail = async (email, resetLink) => {
  const transporter = getTransporter();

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #6c5ce7;">
        <h1 style="color: #6c5ce7; margin: 0; font-size: 26px;">⚡ EventPulse</h1>
        <p style="color: #636e72; font-size: 14px; margin-top: 5px;">Security & Account Management</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #2d3436; font-size: 20px; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">
          We received a request to reset the password associated with your account (<strong>${email}</strong>).
        </p>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">
          Click the button below to establish a new password. This link is valid for <strong>15 minutes</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" target="_blank" style="background: linear-gradient(135deg, #6c5ce7, #a8e6cf); color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);">
            Reset My Password
          </a>
        </div>

        <p style="color: #636e72; font-size: 13px; line-height: 1.5;">
          If the button above does not work, copy and paste the following link into your browser:<br />
          <a href="${resetLink}" style="color: #6c5ce7; word-break: break-all;">${resetLink}</a>
        </p>

        <div style="background-color: #fff9db; border-left: 4px solid #fcc419; padding: 12px; margin-top: 25px; border-radius: 4px;">
          <p style="color: #856404; font-size: 13px; margin: 0;">
            🔒 <strong>Security Tip:</strong> If you did not request a password reset, please ignore this email or contact support. Your password will remain unchanged.
          </p>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #b2bec3; font-size: 12px;">
        <p>© ${new Date().getFullYear()} EventPulse. All rights reserved.</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EMAIL DEV LOG] SMTP not configured. Password Reset Email to ${email}:\nLink: ${resetLink}`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: '🔑 EventPulse - Reset Your Password',
      html: htmlContent
    });
    console.log(`[EMAIL SUCCESS] Password reset email dispatched to ${email}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed sending password reset email to ${email}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Booking Confirmation Email
 */
exports.sendBookingConfirmationEmail = async (booking) => {
  const transporter = getTransporter();
  const recipient = booking.customer_email;

  if (!recipient) return { success: false, error: 'No recipient email provided' };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #00b894;">
        <h1 style="color: #00b894; margin: 0; font-size: 26px;">🎉 EventPulse Confirmation</h1>
        <p style="color: #636e72; font-size: 14px; margin-top: 5px;">Your Event Booking has been Received!</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #2d3436; font-size: 20px; margin-top: 0;">Hello ${booking.customer_name || 'Valued Customer'},</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">
          Thank you for choosing EventPulse! We are thrilled to confirm your event reservation.
        </p>

        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2d3436; font-size: 16px; border-bottom: 1px solid #dee2e6; padding-bottom: 8px;">Booking Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Booking ID:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Event Dates:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.start_date} to ${booking.end_date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Guest Count:</td>
              <td style="padding: 8px 0; text-align: right;">${booking.guest_count || 'N/A'} Guests</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Total Amount:</td>
              <td style="padding: 8px 0; text-align: right; color: #00b894; font-weight: 700;">₹${Number(booking.total_price).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Status:</td>
              <td style="padding: 8px 0; text-align: right; color: #00b894; text-transform: uppercase; font-weight: 600;">${booking.status || 'Confirmed'}</td>
            </tr>
          </table>
        </div>

        <p style="color: #4a4a4a; font-size: 14px;">
          Our event coordinator will reach out to you shortly to discuss specific theme customization details.
        </p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #b2bec3; font-size: 12px;">
        <p>© ${new Date().getFullYear()} EventPulse. All rights reserved.</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EMAIL DEV LOG] SMTP not configured. Booking Confirmation Email to ${recipient} (Booking ID: ${booking.id})`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: recipient,
      subject: `🎉 Booking Confirmation - EventPulse (${booking.id})`,
      html: htmlContent
    });
    console.log(`[EMAIL SUCCESS] Booking confirmation email dispatched to ${recipient}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed sending booking email to ${recipient}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Payment Receipt Email
 */
exports.sendPaymentReceiptEmail = async (paymentData) => {
  const transporter = getTransporter();
  const recipient = paymentData.email;

  if (!recipient) return { success: false, error: 'No recipient email provided' };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #0984e3;">
        <h1 style="color: #0984e3; margin: 0; font-size: 26px;">🧾 Payment Receipt</h1>
        <p style="color: #636e72; font-size: 14px; margin-top: 5px;">EventPulse Payment Confirmation</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: #2d3436; font-size: 20px; margin-top: 0;">Payment Successful</h2>
        <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">
          We have successfully received your payment for Booking <strong>${paymentData.booking_id}</strong>.
        </p>

        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4a4a4a;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Payment ID:</td>
              <td style="padding: 8px 0; text-align: right;">${paymentData.gateway_payment_id || paymentData.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Order ID:</td>
              <td style="padding: 8px 0; text-align: right;">${paymentData.gateway_order_id || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Amount Paid:</td>
              <td style="padding: 8px 0; text-align: right; color: #0984e3; font-weight: 700;">₹${Number(paymentData.amount).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600;">Payment Method:</td>
              <td style="padding: 8px 0; text-align: right; text-transform: uppercase;">${paymentData.payment_method || 'Razorpay Online'}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #b2bec3; font-size: 12px;">
        <p>© ${new Date().getFullYear()} EventPulse. All rights reserved.</p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`[EMAIL DEV LOG] SMTP not configured. Payment Receipt Email to ${recipient} (Amount: ₹${paymentData.amount})`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: recipient,
      subject: `🧾 Payment Receipt - EventPulse (Booking #${paymentData.booking_id})`,
      html: htmlContent
    });
    console.log(`[EMAIL SUCCESS] Payment receipt dispatched to ${recipient}. MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed sending payment receipt to ${recipient}:`, error);
    return { success: false, error: error.message };
  }
};
