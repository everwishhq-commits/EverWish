// scripts/test-video-snapwish.js
require('dotenv').config();
const { generateVideo } = require('../lib/videoGenerator');

async function testSnapWish() {
  console.log('🎬 Testing SnapWish video generation...\n');

  const cardData = {
    design: 'Birthday',
    message: '¡Feliz cumpleaños! Que todos tus deseos se hagan realidad.',
    tier: 'snapwish',
  };

  try {
    const result = await generateVideo(cardData);
    
    console.log('\n✅ Video generated successfully!');
    console.log('Video URL:', result.videoUrl);
    console.log('Video ID:', result.videoId);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testSnapWish();
