import { AES, enc, lib, mode, pad } from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const AES_KEY_STORAGE_KEY = 'my_aes_key';

export async function getEncryptionKey() {
    let key = await SecureStore.getItemAsync(AES_KEY_STORAGE_KEY);
    if (!key) {
        key = lib.WordArray.random(32).toString(enc.Hex); // Generate 256-bit key
        await SecureStore.setItemAsync(AES_KEY_STORAGE_KEY, key);
    }
    return key;
}

// Encrypt data
export async function encryptData(data) {
    if (!data) {
        throw new Error('Cannot encrypt undefined or null value.');
    }

    const key = await getEncryptionKey();
    const keyWordArray = enc.Hex.parse(key);
    const initializationVector = lib.WordArray.random(16); // 128-bit IV

    const encrypted = AES.encrypt(JSON.stringify(data), keyWordArray, {
        iv: initializationVector,
        mode: mode.CBC,
        padding: pad.Pkcs7,
    });

    return JSON.stringify({
        initializationVector: initializationVector.toString(enc.Hex),
        data: encrypted.toString(),
    });
}


// Decrypt data
export async function decryptData(encryptedData) {
    try {
        if (!encryptedData) throw new Error('No encrypted data provided.');

        console.log('Decrypting data:', encryptedData);

        const key = await getEncryptionKey();
        const keyWordArray = enc.Hex.parse(key);

        const parsedData = JSON.parse(encryptedData);
        const ivWordArray = enc.Hex.parse(parsedData.initializationVector);

        const decryptedBytes = AES.decrypt(parsedData.data, keyWordArray, {
            iv: ivWordArray,
            mode: mode.CBC,
            padding: pad.Pkcs7,
        });

        const decryptedString = decryptedBytes.toString(enc.Utf8);
        console.log('Decrypted String:', decryptedString);

        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt data.');
    }
}
