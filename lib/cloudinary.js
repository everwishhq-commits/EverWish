// lib/cloudinary.js
const cloudinary = require('cloudinary').v2;
const config = require('../config');

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Local path to video file
 * @param {string} publicId - Optional public ID for the video
 * @returns {Promise<object>} Upload result
 */
async function uploadVideo(filePath, publicId = null) {
  try {
    const options = {
      resource_type: 'video',
      folder: config.cloudinary.folder,
      format: 'mp4',
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(filePath, options);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Public ID of the video
 * @returns {Promise<object>} Delete result
 */
async function deleteVideo(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    });

    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  uploadVideo,
  deleteVideo,
  cloudinary,
};
