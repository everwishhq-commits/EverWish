// config/index.js
require('dotenv').config();

const config = {
  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: 'everwish-videos',
  },

  // Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  // Resend
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
  },

  // App
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
    tempVideoPath: process.env.VIDEO_TEMP_PATH || './public/temp-videos',
  },

  // Video settings
  video: {
    snapwish: {
      duration: parseInt(process.env.VIDEO_DURATION_SNAPWISH) || 10000,
      scene1Duration: 5000,
      scene2Duration: 5000,
      width: 1080,
      height: 1920,
      fps: 30,
    },
    wonderwish: {
      duration: parseInt(process.env.VIDEO_DURATION_WONDERWISH) || 10000,
      scene1Duration: 5000,
      scene2Duration: 5000,
      width: 1080,
      height: 1920,
      fps: 30,
    },
  },
};

// Validate required config
const validateConfig = () => {
  const required = {
    cloudinary: ['cloudName', 'apiKey', 'apiSecret'],
    twilio: ['accountSid', 'authToken'],
    resend: ['apiKey'],
  };

  const missing = [];

  Object.entries(required).forEach(([service, keys]) => {
    keys.forEach(key => {
      if (!config[service][key]) {
        missing.push(`${service.toUpperCase()}_${key.toUpperCase()}`);
      }
    });
  });

  if (missing.length > 0) {
    console.warn(`⚠️  Missing config: ${missing.join(', ')}`);
    console.warn('Some features may not work properly.');
  }
};

validateConfig();

module.exports = config;
