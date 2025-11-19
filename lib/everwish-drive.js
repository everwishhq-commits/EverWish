import { google } from 'googleapis';

class EverwishDrive {
  constructor() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('⚠️ Google Drive credentials not configured');
      this.drive = null;
      return;
    }

    try {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/drive']
      );

      this.drive = google.drive({ version: 'v3', auth });
      this.folderId = process.env.EVERWISH_DRIVE_FOLDER_ID;
    } catch (error) {
      console.error('Error initializing Google Drive:', error);
      this.drive = null;
    }
  }

  async ensureFolderExists(folderName, parentId = null) {
    if (!this.drive) throw new Error('Drive not initialized');

    const parent = parentId || this.folderId;

    // Buscar si existe
    const res = await this.drive.files.list({
      q: `name='${folderName}' and '${parent}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (res.data.files.length > 0) {
      return res.data.files[0].id;
    }

    // Crear carpeta
    const folder = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parent],
      },
      fields: 'id',
    });

    return folder.data.id;
  }

  async saveUser(userData) {
    if (!this.drive) return null;

    try {
      const usersFolderId = await this.ensureFolderExists('users');
      const fileName = `user-${userData.email.replace(/[^a-z0-9]/gi, '_')}.json`;

      // Buscar si ya existe
      const existing = await this.drive.files.list({
        q: `name='${fileName}' and '${usersFolderId}' in parents and trashed=false`,
        fields: 'files(id)',
      });

      const fileContent = JSON.stringify(userData, null, 2);
      const media = {
        mimeType: 'application/json',
        body: fileContent,
      };

      if (existing.data.files.length > 0) {
        // Actualizar
        await this.drive.files.update({
          fileId: existing.data.files[0].id,
          media: media,
        });
        return existing.data.files[0].id;
      } else {
        // Crear nuevo
        const file = await this.drive.files.create({
          requestBody: {
            name: fileName,
            mimeType: 'application/json',
            parents: [usersFolderId],
          },
          media: media,
          fields: 'id',
        });
        return file.data.id;
      }
    } catch (error) {
      console.error('Error saving user:', error);
      return null;
    }
  }

  async getUserByEmail(email) {
    if (!this.drive) return null;

    try {
      const usersFolderId = await this.ensureFolderExists('users');
      const fileName = `user-${email.replace(/[^a-z0-9]/gi, '_')}.json`;

      const res = await this.drive.files.list({
        q: `name='${fileName}' and '${usersFolderId}' in parents and trashed=false`,
        fields: 'files(id)',
      });

      if (res.data.files.length === 0) {
        return null;
      }

      const content = await this.drive.files.get({
        fileId: res.data.files[0].id,
        alt: 'media',
      });

      return content.data;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async saveCard(cardData) {
    if (!this.drive) return null;

    try {
      const cardsFolderId = await this.ensureFolderExists('cards');
      const fileName = `card-${cardData.id}.json`;

      const file = await this.drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: 'application/json',
          parents: [cardsFolderId],
        },
        media: {
          mimeType: 'application/json',
          body: JSON.stringify(cardData, null, 2),
        },
        fields: 'id, webViewLink',
      });

      return {
        fileId: file.data.id,
        link: file.data.webViewLink,
      };
    } catch (error) {
      console.error('Error saving card:', error);
      return null;
    }
  }

  async getCardsByEmail(email) {
    if (!this.drive) return [];

    try {
      const user = await this.getUserByEmail(email);
      if (!user || !user.cards || user.cards.length === 0) {
        return [];
      }

      const cardsFolderId = await this.ensureFolderExists('cards');
      const cards = [];

      for (const cardId of user.cards) {
        try {
          const res = await this.drive.files.list({
            q: `name='card-${cardId}.json' and '${cardsFolderId}' in parents and trashed=false`,
            fields: 'files(id)',
          });

          if (res.data.files.length > 0) {
            const content = await this.drive.files.get({
              fileId: res.data.files[0].id,
              alt: 'media',
            });
            cards.push(content.data);
          }
        } catch (error) {
          console.error(`Error loading card ${cardId}:`, error);
        }
      }

      return cards;
    } catch (error) {
      console.error('Error getting cards by email:', error);
      return [];
    }
  }
}

export const everwishDrive = new EverwishDrive();
