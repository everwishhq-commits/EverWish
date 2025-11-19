// lib/resend.js
const { Resend } = require('resend');
const config = require('../config');

const resend = new Resend(config.resend.apiKey);

/**
 * Send email with video link
 * @param {string} to - Recipient email
 * @param {string} videoLink - URL to the video
 * @param {object} options - Additional options (tier, message, senderName)
 * @returns {Promise<object>} Send result
 */
async function sendEmail(to, videoLink, options = {}) {
  try {
    const { tier = 'SnapWish', message, senderName } = options;

    const subject = `Tu ${tier} está lista 🎉`;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Tienes una ${tier} especial!</h1>
          </div>
          <div class="content">
    `;

    if (senderName) {
      html += `<p><strong>De:</strong> ${senderName}</p>`;
    }

    if (message) {
      html += `<p><em>"${message}"</em></p>`;
    }

    html += `
            <p>Haz click en el botón para ver tu tarjeta animada:</p>
            <center>
              <a href="${videoLink}" class="button">Ver mi ${tier}</a>
            </center>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">
              O copia este link: ${videoLink}
            </p>
          </div>
          <div class="footer">
            <p>EverWish - Tarjetas digitales que emocionan</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: config.resend.fromEmail,
      to: to,
      subject: subject,
      html: html,
    });

    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  sendEmail,
};
