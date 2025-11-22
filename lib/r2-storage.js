// lib/r2-storage.js
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export const r2Storage = {
  /**
   * Guarda una tarjeta en R2
   */
  async saveCard(cardInfo) {
    try {
      const key = `cards/${cardInfo.id}.json`;
      
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(cardInfo, null, 2),
        ContentType: 'application/json',
      });

      await r2Client.send(command);
      
      console.log('✅ Card saved to R2:', cardInfo.id);
      return { success: true, key };
    } catch (error) {
      console.error('❌ Error saving card to R2:', error);
      throw error;
    }
  },

  /**
   * Obtiene una tarjeta de R2
   */
  async getCard(cardId) {
    try {
      const key = `cards/${cardId}.json`;
      
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await r2Client.send(command);
      const body = await response.Body.transformToString();
      
      return JSON.parse(body);
    } catch (error) {
      console.error('❌ Error getting card from R2:', error);
      return null;
    }
  },

  /**
   * Guarda un usuario en R2
   */
  async saveUser(userInfo) {
    try {
      const key = `users/${userInfo.email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(userInfo, null, 2),
        ContentType: 'application/json',
      });

      await r2Client.send(command);
      
      console.log('✅ User saved to R2:', userInfo.email);
      return { success: true, key };
    } catch (error) {
      console.error('❌ Error saving user to R2:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por email
   */
  async getUserByEmail(email) {
    try {
      const key = `users/${email.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
      
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await r2Client.send(command);
      const body = await response.Body.transformToString();
      
      return JSON.parse(body);
    } catch (error) {
      // Si no existe el usuario, retornar null (no es un error)
      if (error.name === 'NoSuchKey') {
        return null;
      }
      console.error('❌ Error getting user from R2:', error);
      return null;
    }
  },

  /**
   * Guarda un video en R2
   */
  async saveVideo(videoBuffer, videoId) {
    try {
      const key = `videos/${videoId}.mp4`;
      
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: videoBuffer,
        ContentType: 'video/mp4',
      });

      await r2Client.send(command);
      
      // URL pública del video
      const videoUrl = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET_NAME}/${key}`;
      
      console.log('✅ Video saved to R2:', videoId);
      return { success: true, url: videoUrl, key };
    } catch (error) {
      console.error('❌ Error saving video to R2:', error);
      throw error;
    }
  },
};
