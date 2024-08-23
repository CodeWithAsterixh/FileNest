/* eslint-disable no-unused-vars */
import { openDB } from 'idb';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

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
      
      // Store the data object in IndexedDB
      await store.put(dataToSave);
      
      // Complete the transaction
      await tx.done;
      
      // Return the file ID for reference
      return fileId;
    } catch (error) {
      console.error('Error saving file:', error);
      // throw error;
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
        reader.onloadend = async () => {
          const arrayBuffer = reader.result;
          const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
          const encrypted = await this.encryptWordArray(wordArray, password);
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

  async encryptWordArray(wordArray, password) {
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

  async decryptData(encryptedData, password) {
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

        try {
            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);        
            return JSON.parse(decryptedText);
        } catch (e) {
            // console.warn('Decrypted data is not valid UTF-8 text, treating as binary');
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
        const fileData = await this.decryptData(encryptedData, password);

        // Check if fileData is binary (has words)
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
      
      const fileData = await this.decryptData(encryptedData, password);
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
  async findFile(id, password){
    const fileComplete = await this.getAllFiles(password)
    if(fileComplete.find(file => file.id == id)){
      return fileComplete.find(file => file.id == id)
    }else{
      return null
    }
  }
  async updateFile(id, update, password) {
    // Fetch the original file
    const file = await this.findFile(id, password);
    
    if (!file) {
        return { success: false, message: "File not found." };
    }

    // Update fileName while preserving other properties
    const { fileName } = update;
    const updatedFile = {
        ...file,
        fileName,          // Update the name
        modifiedDate: new Date().toISOString(), // Update the modified date
    };

    // Save the updated file with the same ID
    // await this.saveFile(updatedFile, password);

    

    // Optionally, you can remove the old file record by its ID here if needed

    return { success: true, file: updatedFile, type: 'warn' };
}


  async clearData() {
    const db = await this.dbPromise;
    await db.clear('files');
  }


  async changePassword(oldPassword, newPassword) {
    try {
        const db = await this.dbPromise;
        const tx = db.transaction('files', 'readwrite');
        const store = tx.objectStore('files');
        const files = await store.getAll();
        for (const file of files) {
            // Decrypt the file with the old password
            const decryptedData = await this.decryptData(file, oldPassword);

            // Re-encrypt the file with the new password
            const reEncryptedData = await this.encryptData(decryptedData, newPassword);

            // Prepare the updated file object
            const updatedFile = {
                ...file,
                blob: reEncryptedData,                 // Update the encrypted data
                modifiedDate: new Date().toISOString() // Optionally update the modified date
            };

            // Save the updated file back to IndexedDB
            // This will overwrite the existing record with the same id
            await store.put(updatedFile);
        }

        await tx.done;
        return { success: true, message: 'Password changed and files re-encrypted successfully.' };
    } catch (error) {
        console.error('Error during password change:', error);
        return { success: false, message: 'Failed to change password and re-encrypt files.' };
    }
}

}

export const db = new DB();

export async function uploadFilesSave(file, password) {
  return db.saveFile(file, password);
}

export async function deleteFile(id) {
  return db.deleteFile(id);
}
export async function handlePasswordChange(oldPassword, newPassword) {
  const result = await db.changePassword(oldPassword, newPassword);
  if (result.success) {
    toast.success(result.message);
    return result

  } else {
    toast.error(result.message);
    return result
  }
}
