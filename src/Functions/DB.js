import { openDB } from 'idb';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

class DB {
  constructor() {
    this.dbPromise = this.initDB();
  }

  async initDB() {
    return openDB('file-store', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' });
        }
      },
    });
  }

  generateId() {
    return uuidv4();
  }

  async saveFile(file, password) {
    try {
      const encryptedFile = await this.encryptData(file, password);
      const db = await this.dbPromise;
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      const fileId = file.id || this.generateId();
      const dataToSave = {
        id: fileId,
        fileType: file.type,
        blob: encryptedFile,
      };
      await store.put(dataToSave);
      await tx.done;
      return fileId;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  async saveOrUpdateFile(file, password) {
    return this.saveFile(file, password);
  }

  async encryptData(data, password) {
    if (!data || !password) {
      throw new Error('Data or password is missing');
    }

    let dataToEncrypt;
    if (data instanceof Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const arrayBuffer = reader.result;
          const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
          const encrypted = this.encryptWordArray(wordArray, password);
          resolve(encrypted);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(data);
      });
    } else {
      dataToEncrypt = typeof data === 'object' ? JSON.stringify(data) : data;
    }

    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, { iv });

    return {
      ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      salt: salt.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
    };
  }

  encryptWordArray(wordArray, password) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv });

    return {
      ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
      salt: salt.toString(CryptoJS.enc.Base64),
      iv: iv.toString(CryptoJS.enc.Base64),
    };
  }

  decryptData(encryptedData, password) {
    if (!encryptedData || !encryptedData.blob.ciphertext || !encryptedData.blob.salt || !encryptedData.blob.iv) {
      throw new Error('Invalid encrypted data');
    }

    try {
      const { ciphertext, salt, iv } = encryptedData.blob;
      const decodedCiphertext = CryptoJS.enc.Base64.parse(ciphertext);
      const decodedSalt = CryptoJS.enc.Base64.parse(salt);
      const decodedIv = CryptoJS.enc.Base64.parse(iv);
      const key = CryptoJS.PBKDF2(password, decodedSalt, { keySize: 256 / 32, iterations: 1000 });
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: decodedCiphertext }, key, { iv: decodedIv });
      const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

      try {
        return JSON.parse(decryptedData);
      } catch {
        return decryptedData;
      }
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Decryption error');
    }
  }

  async getFileBlob(id, password) {
    const db = await this.dbPromise;
    const encryptedData = await db.get('files', id);
    if (encryptedData) {
      const fileData = this.decryptData(encryptedData, password);
      return new Blob([fileData], { type: encryptedData.fileType });
    }
    return null;
  }

  async handleRetrieveFile(id, password) {
    try {
      const fileBlob = await this.getFileBlob(id, password);
      if (fileBlob) {
        const fileURL = URL.createObjectURL(fileBlob);
        return fileURL;
      } else {
        console.log('File not found');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      return null;
    }
  }

  async getAllFiles(password) {
    const db = await this.dbPromise;
    const encryptedFiles = await db.getAll('files');
    return Promise.all(encryptedFiles.map(async (encryptedData) => {
      const fileData = this.decryptData(encryptedData, password);
      return { ...fileData, id: encryptedData.id, fileType: encryptedData.fileType };
    }));
  }

  async deleteFile(id) {
    const db = await this.dbPromise;
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    await store.delete(id);
    await tx.done;
    console.log(`File with id ${id} deleted`);
  }

  async clearData() {
    const db = await this.dbPromise;
    await db.clear('files');
  }
}

export const db = new DB();

export async function uploadFilesSave(file, password) {
  return db.saveFile(file, password);
}

export async function deleteFile(id) {
  return db.deleteFile(id);
}
