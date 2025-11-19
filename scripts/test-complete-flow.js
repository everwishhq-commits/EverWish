// scripts/test-complete-flow.js
require('dotenv').config();
const { generateVideo } = require('../lib/videoGenerator');
const { sendWhatsApp } = require('../lib/twilio');
const { sendEmail } = require('../lib/resend');

async function testCompleteFlow(tier = 'snapwish', deliveryMethod = 'email') {
  console.log(`🚀 Testing complete flow: ${tier} via ${deliveryMethod}\n`);

  // Step 1: Generate video
  console.log('Step 1: Generating video...');
  const cardData = {
    design: 'Birthday',
    message: 'Test message - ¡Feliz cumpleaños!',
    tier: tier,
  };

  try {
    const result = await generateVideo(cardData);
    console.log('✅ Video generated:', result.videoUrl);

    // Step 2: Create unique link
    const uniqueLink = `${process.env.APP_URL}/v/${result.videoId}`;
    console.log('📎 Unique link:', uniqueLink);

    // Step 3: Send notification
    console.log(`\nStep 2: Sending via ${deliveryMethod}...`);
    
    if (deliveryMethod === 'whatsapp') {
      const whatsappResult = await sendWhatsApp(
        '+1234567890', // Replace with test number
        uniqueLink,
        { tier, message: cardData.message }
      );
      console.log('WhatsApp result:', whatsappResult);
    } else if (deliveryMethod === 'email') {
      const emailResult = await sendEmail(
        'test@example.com', // Replace with test email
        uniqueLink,
        { tier, message: cardData.message }
      );
      console.log('Email result:', emailResult);
    }

    console.log('\n✅ Complete flow test successful!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run test
const tier = process.argv[2] || 'snapwish';
const method = process.argv[3] || 'email';
testCompleteFlow(tier, method);
