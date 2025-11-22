import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendCardEmail({ to, from, cardLink, message, senderName, recipientName }) {
  if (!resend) {
    console.warn('⚠️ Resend not configured. Email not sent.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || 'onboarding@resend.dev', // ← Email de testing que SIEMPRE funciona
      to: to,
      subject: `${senderName} sent you a special card! 💌`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #fff5f8;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            h1 {
              color: #e91e63;
              font-size: 28px;
              margin-bottom: 10px;
            }
            .message {
              background: #f9f9f9;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              font-style: italic;
              color: #555;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #e91e63, #9c27b0);
              color: white;
              padding: 15px 40px;
              border-radius: 30px;
              text-decoration: none;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💌 You received a special card!</h1>
              <p style="color: #666;">From <strong>${senderName}</strong></p>
            </div>

            ${message ? `
            <div class="message">
              "${message}"
            </div>
            ` : ''}

            <div style="text-align: center;">
              <a href="${cardLink}" class="button">
                ✨ View Your Card
              </a>
            </div>

            <div class="footer">
              <p>This card was created with ❤️ using Everwish</p>
              <p>If you can't click the button, copy this link: ${cardLink}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully:', data.id);
    return { success: true, id: data.id };

  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}
