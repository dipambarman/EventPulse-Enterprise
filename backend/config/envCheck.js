require('dotenv').config();

const validateEnv = () => {
  const warnings = [];
  const errors = [];

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret') {
    warnings.push('JWT_SECRET is set to default/fallback. Set a strong secret in production.');
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    warnings.push('Razorpay credentials missing. Payment gateway will operate in test fallback mode.');
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    warnings.push('SMTP email credentials missing. Email dispatches will log in console instead of sending.');
  }

  if (warnings.length > 0) {
    console.log('\n================ ENVIRONMENT AUDIT ================');
    warnings.forEach(w => console.warn(`⚠️  ${w}`));
    console.log('===================================================\n');
  }

  return { warnings, errors };
};

module.exports = validateEnv;
