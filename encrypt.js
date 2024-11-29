import { AES, enc, lib, mode, pad } from 'crypto-js';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

const AES_KEY_STORAGE_KEY = 'my_aes_key';

async function getSecureRandomBytes(byteCount) {
    const randomBytes = await Crypto.getRandomBytesAsync(byteCount);
    return lib.WordArray.create(randomBytes).toString(enc.Hex);
}

export async function getEncryptionKey() {
    let key = await SecureStore.getItemAsync(AES_KEY_STORAGE_KEY);
    if (!key) {
        key = await getSecureRandomBytes(16); // 16 bytes = 128-bit key
        await SecureStore.setItemAsync(AES_KEY_STORAGE_KEY, key);
    }
    return key;
}

export async function encryptData(data) {
    if (typeof data !== 'string' && typeof data !== 'object') {
        throw new Error('Invalid data for encryption. Must be a string or an object.');
    }

    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);

    const key = await getEncryptionKey();
    const keyWordArray = enc.Hex.parse(key);
    const initializationVectorHex = await getSecureRandomBytes(16);
    const initializationVector = enc.Hex.parse(initializationVectorHex);

    const encrypted = AES.encrypt(stringifiedData, keyWordArray, {
        iv: initializationVector,
        mode: mode.CBC,
        padding: pad.Pkcs7,
    });

    const encryptedData = JSON.stringify({
        initializationVector: initializationVectorHex,
        data: encrypted.toString(),
    });

    console.log('Encrypted Data:', encryptedData);
    return encryptedData;
}

export async function decryptData(encryptedData) {
    if (!encryptedData || typeof encryptedData !== 'string') {
        throw new Error('Invalid input: encrypted data must be a non-empty string.');
    }

    try {
        const key = await getEncryptionKey();
        const keyWordArray = enc.Hex.parse(key);

        const encryptedDataJson = JSON.parse(encryptedData);
        if (!encryptedDataJson.initializationVector || !encryptedDataJson.data) {
            throw new Error('Invalid encrypted data format.');
        }

        const initializationVector = enc.Hex.parse(encryptedDataJson.initializationVector);
        const decrypted = AES.decrypt(encryptedDataJson.data, keyWordArray, {
            iv: initializationVector,
            mode: mode.CBC,
            padding: pad.Pkcs7,
        });

        const decryptedString = decrypted.toString(enc.Utf8);
        console.log('Decrypted String:', decryptedString);

        // Try to parse as JSON, fallback to plain string if JSON parsing fails
        try {
            return JSON.parse(decryptedString);
        } catch (jsonError) {
            console.warn('Decrypted data is not JSON, returning plain string:', decryptedString);
            return decryptedString;
        }
    } catch (error) {
        // console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data.');
    }
}
