import CryptoJS from 'crypto-js';

class EncryptedLocalStorage {
  constructor(secretKey) {
    this.secretKey = secretKey; // Key for encryption and decryption
  }

  // Derives a key from the password using PBKDF2
  deriveKey(password) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
    return { key, salt };
  }

  // Encrypts data
  encryptData(data, password) {
    const { key, salt } = this.deriveKey(password);
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    return { ciphertext, salt };
  }

  // Decrypts data
  decryptData(ciphertext, salt, password) {
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

  // Stores data in localStorage
  setItem(key, data, password) {
    const { ciphertext, salt } = this.encryptData(data, password);
    localStorage.setItem(key, JSON.stringify({ ciphertext, salt }));
  }

  // Retrieves data from localStorage
  getItem(key, password) {
    const item = localStorage.getItem(key);
    if (!item) {
      return null; // or you can return an empty object/array if preferred
    }

    try {
      const { ciphertext, salt } = JSON.parse(item);
      return this.decryptData(ciphertext, salt, password);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null; // or handle error as appropriate
    }
  }
}

export default EncryptedLocalStorage;
export const encryptLocal = new EncryptedLocalStorage();
