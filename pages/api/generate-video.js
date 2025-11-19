// pages/api/generate-video.js
import { generateVideo } from '../../lib/videoGenerator';
import { sendWhatsApp } from '../../lib/twilio';
import { sendEmail } from '../../lib/resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cardData, delivery } = req.body;

  if (!cardData || !delivery) {
    return res.status(400).json({
      error: 'Missing required fields: cardData and delivery',
    });
  }

  try {
    console.log('🎬 Generating video...');
    
    // Step 1: Generate video
    const { videoUrl, videoId } = await generateVideo(cardData);
    
    // Step 2: Create unique link
    const uniqueLink = `${process.env.APP_URL}/v/${videoId}`;

    console.log('📨 Sending notifications...');
    
    // Step 3: Send via requested method(s)
    const deliveryResults = {};

    if (delivery.method === 'whatsapp' || delivery.method === 'all') {
      deliveryResults.whatsapp = await sendWhatsApp(
        delivery.recipient,
        uniqueLink,
        {
          tier: cardData.tier,
          message: cardData.message,
          senderName: delivery.senderName,
        }
      );
    }

    if (delivery.method === 'email' || delivery.method === 'all') {
      deliveryResults.email = await sendEmail(
        delivery.recipient,
        uniqueLink,
        {
          tier: cardData.tier,
          message: cardData.message,
          senderName: delivery.senderName,
        }
      );
    }

    console.log('✅ Complete!');

    res.status(200).json({
      success: true,
      videoUrl,
      uniqueLink,
      videoId,
      delivery: deliveryResults,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
