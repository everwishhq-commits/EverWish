// lib/twilio.js
const twilio = require('twilio');
const config = require('../config');

const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
);

/**
 * Send WhatsApp message with video link
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} videoLink - URL to the video
 * @param {object} options - Additional options (tier, message, senderName)
 * @returns {Promise<object>} Send result
 */
async function sendWhatsApp(to, videoLink, options = {}) {
  try {
    const { tier = 'SnapWish', message, senderName } = options;

    let body = `🎉 ¡Tienes una ${tier} especial!`;
    
    if (senderName) {
      body += `\n\nDe: ${senderName}`;
    }
    
    if (message) {
      body += `\n\n"${message}"`;
    }
    
    body += `\n\n👉 Ver tu tarjeta: ${videoLink}`;

    const result = await client.messages.create({
      from: config.twilio.whatsappNumber,
      to: `whatsapp:${to}`,
      body: body,
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send SMS with video link
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} videoLink - URL to the video
 * @param {object} options - Additional options
 * @returns {Promise<object>} Send result
 */
async function sendSMS(to, videoLink, options = {}) {
  try {
    const { tier = 'SnapWish' } = options;

    const body = `Tienes una ${tier}: ${videoLink}`;

    const result = await client.messages.create({
      from: config.twilio.phoneNumber,
      to: to,
      body: body,
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  sendWhatsApp,
  sendSMS,
};
