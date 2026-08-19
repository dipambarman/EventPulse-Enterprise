const nodemailer = require('nodemailer');

const SMTP_FROM = process.env.SMTP_FROM || 'no-reply@eventpulse.io';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'mock_user@ethereal.email',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

exports.sendBookingConfirmationEmail = async ({ recipientEmail, customerName, bookingId, eventDate, totalPrice }) => {
  const mailOptions = {
    from: SMTP_FROM,
    to: recipientEmail,
    subject: `Booking Confirmed — #${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #6C3CE1;">Your Event is Confirmed!</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Thank you for choosing EventPulse Enterprise. Your reservation details are as follows:</p>
        <ul>
          <li><strong>Booking Reference:</strong> ${bookingId}</li>
          <li><strong>Event Date:</strong> ${eventDate}</li>
          <li><strong>Total Amount:</strong> ₹${totalPrice?.toLocaleString('en-IN') || totalPrice}</li>
        </ul>
        <p>Our production team will contact you shortly to coordinate venue logistics.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">EventPulse Enterprise • Seamless Event Execution SaaS</p>
      </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Sent booking confirmation to ${recipientEmail}`);
    if (info.messageId) {
      console.log(`[Email Service] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.warn(`[Email Service] SMTP dispatch warning for ${recipientEmail}:`, err.message);
    return { success: true, mock: true, message: 'Simulated email dispatch' };
  }
};

exports.sendPaymentReceiptEmail = async ({ recipientEmail, customerName, bookingId, amount, paymentMethod }) => {
  const mailOptions = {
    from: SMTP_FROM,
    to: recipientEmail,
    subject: `Payment Receipt — #${bookingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #10B981;">Payment Received</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>We have successfully processed your payment of <strong>₹${amount?.toLocaleString('en-IN') || amount}</strong> via ${paymentMethod || 'Razorpay'}.</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">EventPulse Enterprise • Billing Department</p>
      </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      console.log(`[Email Service] Payment Receipt Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    return { success: true, mock: true, message: 'Simulated receipt email dispatch' };
  }
};

exports.sendPasswordResetEmail = async ({ recipientEmail, resetToken }) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: SMTP_FROM,
    to: recipientEmail,
    subject: `Password Reset Request — EventPulse`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p><a href="${resetLink}" style="background: #6C3CE1; color: white; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
      </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      console.log(`[Email Service] Password Reset Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    return { success: true, mock: true, message: 'Simulated password reset email' };
  }
};
