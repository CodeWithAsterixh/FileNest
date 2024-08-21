/* eslint-disable no-unused-vars */
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
      // Encrypt the file data (content)
      const encryptedFile = await this.encryptData(file.blob || file, password);
      
      // Get the IndexedDB instance
      const db = await this.dbPromise;
      
      // Start a read/write transaction in the 'files' object store
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      
      // Generate a unique ID for the file if not already provided
      const fileId = file.id || this.generateId();
      
      // Prepare the data object to save, including all metadata and the encrypted Blob
      const dataToSave = {
        id: fileId,
        fileName: file.fileName,
        fileType: file.fileType,
        type: file.type,
        fileSize: file.fileSize,
        uploadDate: file.uploadDate,
        modifiedDate: file.modifiedDate,
        filePath: fileId, // Store the ID as a reference, similar to Redux state
        preview: file.preview,
        tags: file.tags || [],
        description: file.description || '',
        blob: encryptedFile, // The encrypted file data
      };
      
      console.log(dataToSave)
      // Store the data object in IndexedDB
      await store.put(dataToSave);
      
      // Complete the transaction
      await tx.done;
      
      // Return the file ID for reference
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
      console.log(decrypted);
      

      try {
        // Try to convert to UTF-8 string
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);        
        // If the conversion succeeds, assume it's text data
          return JSON.parse(decryptedText);
    } catch (e) {
        // If the conversion fails, assume it's binary data
        console.warn('Decrypted data is not valid UTF-8 text, treating as binary');
        return decrypted;
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

        // Check if fileData is binary
        if (fileData.words) {
            // Convert the decrypted WordArray to a Uint8Array
            const byteArray = new Uint8Array(fileData.sigBytes);
            for (let i = 0; i < fileData.sigBytes; i++) {
                byteArray[i] = (fileData.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            }
            return new Blob([byteArray], { type: encryptedData.fileType });
        } else {
            // If text, return it as a Blob directly
            return new Blob([fileData], { type: encryptedData.fileType });
        }
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
      console.log(encryptedData);
      
      const fileData = this.decryptData(encryptedData, password);
      return { ...encryptedData, fileData: {...fileData}, id: encryptedData.id, fileType: encryptedData.fileType };
    }));
  }

  async deleteFile(id) {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      await store.delete(id);
      await tx.done;
      return {message: 'success deleting file', return: "success", success: true}

    } catch (error) {
      return {message: 'error deleting file', return: error, success: false}
    }
  }
  async updateFile(id, update, password) {
    const deleted = await this.deleteFile(id).then(mes => mes)    
    this.saveFile(update, password)

    if(deleted.success){
      return true
    }
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
