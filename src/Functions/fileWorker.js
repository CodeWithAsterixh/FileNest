/* eslint-disable no-unused-vars */
// src/workers/fileWorker.js
import CryptoJS from 'crypto-js';
import { openDB } from 'idb';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const encryptData = async (data, password) => {
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
        const encrypted = await encryptWordArray(wordArray, password);
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
};

const encryptWordArray = async (wordArray, password) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(password, salt, { keySize: 256 / 32, iterations: 1000 });
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv });

  return {
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    salt: salt.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
  };
};

const decryptData = async (encryptedData, password) => {
    // console.log('Decrypting Data:', encryptedData); // Log the data being decrypted
  
    if (!encryptedData || !encryptedData.blob.ciphertext || !encryptedData.blob.salt || !encryptedData.blob.iv) {
      throw new Error('Invalid encrypted data');
    }
  
    const decodedCiphertext = CryptoJS.enc.Base64.parse(encryptedData.blob.ciphertext);
    const decodedSalt = CryptoJS.enc.Base64.parse(encryptedData.blob.salt);
    const decodedIv = CryptoJS.enc.Base64.parse(encryptedData.blob.iv);
    const key = CryptoJS.PBKDF2(password, decodedSalt, { keySize: 256 / 32, iterations: 1000 });
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: decodedCiphertext }, key, { iv: decodedIv });
  
    try {
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    //   console.log('Decryption successful, data:', decryptedText);
      return JSON.parse(decryptedText);
    } catch (e) {
    //   console.error('Decryption failed:', e);
      return decrypted;
    }
  };
const initDB = async () => {
  return openDB('file-store', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
    },
  });
};

const saveFile = async (file, password) => {
  const encryptedFile = await encryptData(file.blob || file, password);
  const db = await initDB();
  const tx = db.transaction('files', 'readwrite');
  const store = tx.objectStore('files');
  const fileId = file.id || uuidv4();

  const dataToSave = {
    id: fileId,
    fileName: file.fileName,
    fileType: file.fileType,
    type: file.type,
    fileSize: file.fileSize,
    uploadDate: file.uploadDate,
    modifiedDate: file.modifiedDate,
    filePath: fileId,
    preview: file.preview,
    tags: file.tags || [],
    description: file.description || '',
    blob: encryptedFile,
  };

  await store.put(dataToSave);
  await tx.done;

  return fileId;
};

const decryptFile = async (encryptedData, password) => {
    // console.log(encryptedData, password)
  const fileData = await decryptData(encryptedData, password);

  if (fileData.words) {
    const byteArray = new Uint8Array(fileData.sigBytes);
    for (let i = 0; i < fileData.sigBytes; i++) {
      byteArray[i] = fileData.words[i >> 2] >>> (24 - (i % 4) * 8) & 0xff;
    }
    return new Blob([byteArray], { type: encryptedData.fileType });
  } else {
    return fileData;
  }
};

onmessage = async (event) => {
    const { type, data } = event.data;
    try {
      if (type === 'UPLOAD_FILES') {
        const { files, password } = data;
        const ids = await Promise.all(files.map(file => saveFile(file, password)));
        postMessage({ type: 'UPLOAD_SUCCESS', ids });
      } else if (type === 'DECRYPT_FILE') {
        const { encryptedData, password } = data;
  
        // Check the encrypted data structure
        // console.log('Received encrypted data for decryption:', encryptedData);
  
        const fileBlob = await decryptFile(encryptedData, password);
        postMessage({ type: 'DECRYPT_SUCCESS', fileBlob });
      }
    } catch (error) {
      toast.error('Error occurred while uploading file, please try again later');
      postMessage({ type: type === 'UPLOAD_FILES' ? 'UPLOAD_ERROR' : 'DECRYPT_ERROR', error });
    }
};
