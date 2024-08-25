/* eslint-disable no-unused-vars */
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { processing } from './processReturn';

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

  async saveFile(file, password) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./fileWorker.js', import.meta.url), { type: 'module' });
      worker.postMessage({ type: 'UPLOAD_FILES', data: { files: [file], password } });

      worker.onmessage = (event) => {
        const { type, ids, error } = event.data;
        if (type === 'UPLOAD_SUCCESS') {
          resolve(ids[0]);
        } else if (type === 'UPLOAD_ERROR') {
          reject(error);
        }
      };
    });
  }

  async getFileBlob(id, password) {
    const db = await this.dbPromise;
    const encryptedData = await db.get('files', id);
    if (!encryptedData) return null;

    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./fileWorker.js', import.meta.url), { type: 'module' });
      worker.postMessage({ type: 'DECRYPT_FILE', data: { encryptedData, password } });

      worker.onmessage = (event) => {
        const { type, fileBlob, error } = event.data;
        if (type === 'DECRYPT_SUCCESS') {
          resolve(fileBlob);
        } else if (type === 'DECRYPT_ERROR') {
          reject(error);
        }
      };
    });
  }

  async deleteFile(id) {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      await store.delete(id);
      await tx.done;
      return { message: 'success deleting file', return: "success", success: true };
    } catch (error) {
      return { message: 'error deleting file', return: error, success: false };
    }
  }

  async getAllFiles(password) {
    const db = await this.dbPromise;
    const encryptedFiles = await db.getAll('files');

    return Promise.all(
      encryptedFiles.map(async (encryptedData) => {
        const fileData = await this.getFileBlob(encryptedData.id, password);
        return { ...encryptedData, fileBlob: fileData, id: encryptedData.id, fileType: encryptedData.fileType };
      })
    );
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

    // Encrypt the updated metadata (without re-encrypting the Blob)
    const db = await this.dbPromise;
    const tx = db.transaction('files', 'readwrite');
    const store = tx.objectStore('files');
    
    // Save the updated file data back to IndexedDB
    await store.put(updatedFile);

    await tx.done;

    return { success: true, file: updatedFile, type: 'info' };
}

  async clearData() {
    const db = await this.dbPromise;
    await db.clear('files');
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const allFiles = await this.getAllFiles(oldPassword);

      await Promise.all(
        allFiles.map(async (file) => {
          return await this.saveFile(file, newPassword);
        })
      );

      return { success: true, message: 'Password changed and files re-encrypted successfully.' };
    } catch (error) {
      processing.error('Error during password change:', 'passwordChange');
      return { success: false, message: 'Failed to change password and re-encrypt files.' };
    }
  }
  async handleRetrieveFile(fileId, password) {
    const db = await this.dbPromise;
    const encryptedFile = await db.get('files', fileId);
  
    if (!encryptedFile) {
      throw new Error('File not found');
    }
  
    const fileBlob = await this.getFileBlob(fileId, password);
  
    if (!fileBlob) {
      throw new Error('Failed to decrypt file');
    }
    return URL.createObjectURL(fileBlob);
  }
  createShareableLink = async (fileId, password) => {
    try {
      const blobUrl = await this.handleRetrieveFile(fileId, password);
  
      // Create a temporary input element to copy the URL to the clipboard
      const tempInput = document.createElement('input');
      tempInput.value = blobUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      
      document.body.removeChild(tempInput);
  
      // Provide the link for sharing
      return blobUrl;
    } catch (error) {
      toast.error('Error creating shareable link:');
      throw error;
    }
  };
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
    return result;
  } else {
    toast.error(result.message);
    return result;
  }
}
