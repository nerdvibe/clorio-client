import {enc, AES} from 'crypto-js';

interface IEncryptData {
  data: string;
  key: string;
}

function useSecureStorage() {
  const encryptData = ({data, key}: IEncryptData) => {
    if (key && data) {
      const encrypted = AES.encrypt(data, key).toString();
      // Save the encrypted data to local storage
      localStorage.setItem('encryptedData', encrypted);
    }
  };

  const decryptData = (key: string) => {
    if (key) {
      // Retrieve the encrypted data from local storage
      const encrypted = localStorage.getItem('encryptedData');
      if (encrypted) {
        const decrypted = AES.decrypt(encrypted, key).toString(enc.Utf8);
        return decrypted;
      }
    }
  };

  const hasEncryptedData = !!localStorage.getItem('encryptedData');

  const clearData = () => {
    // Clear the data from local storage
    localStorage.removeItem('encryptedData');
  };

  return {
    encryptData,
    decryptData,
    hasEncryptedData,
    clearData,
  };
}

export default useSecureStorage;
