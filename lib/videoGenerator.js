// lib/videoGenerator.js
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { uploadVideo } = require('./cloudinary');
const config = require('../config');

/**
 * Generate video from HTML template
 * @param {object} cardData - Card data (design, message, userPhoto, tier)
 * @returns {Promise<object>} Video generation result
 */
async function generateVideo(cardData) {
  const { design, message, userPhoto, tier } = cardData;
  
  // Generate unique video ID
  const videoId = `${tier}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const tempVideoPath = path.join(config.app.tempVideoPath, `${videoId}.mp4`);

  // Ensure temp directory exists
  await fs.mkdir(config.app.tempVideoPath, { recursive: true });

  let browser;
  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set viewport for mobile (9:16)
    await page.setViewport({
      width: config.video[tier.toLowerCase()].width,
      height: config.video[tier.toLowerCase()].height,
    });

    // Load HTML template
    const templatePath = path.join(__dirname, '../templates', `${tier.toLowerCase()}-template.html`);
    const htmlContent = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders
    const processedHTML = htmlContent
      .replace('{{MESSAGE}}', message || 'Feliz Día!')
      .replace('{{USER_PHOTO}}', userPhoto || '')
      .replace('{{DESIGN}}', design || 'birthday');

    await page.setContent(processedHTML);

    // Wait for animations to load
    await page.waitForTimeout(1000);

    // Record video (using puppeteer-screen-recorder or similar)
    // For now, we'll take a screenshot as placeholder
    // In production, use puppeteer-screen-recorder
    await page.screenshot({ path: tempVideoPath.replace('.mp4', '.png') });

    // Close browser
    await browser.close();

    // Upload to Cloudinary
    console.log('Uploading video to Cloudinary...');
    const uploadResult = await uploadVideo(tempVideoPath, videoId);

    if (!uploadResult.success) {
      throw new Error(`Failed to upload video: ${uploadResult.error}`);
    }

    // Clean up temp file
    try {
      await fs.unlink(tempVideoPath);
    } catch (error) {
      console.warn('Failed to delete temp file:', error);
    }

    return {
      success: true,
      videoId,
      videoUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
    };
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Video generation error:', error);
    throw error;
  }
}

module.exports = {
  generateVideo,
};
