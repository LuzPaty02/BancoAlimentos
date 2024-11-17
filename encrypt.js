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
        key = await getSecureRandomBytes(32); // 256-bit key
        await SecureStore.setItemAsync(AES_KEY_STORAGE_KEY, key);
    }
    return key;
}

export async function encryptData(data) {
    if (!data) {
        throw new Error('Cannot encrypt undefined or null value.');
    }

    const key = await getEncryptionKey();
    const keyWordArray = enc.Hex.parse(key);
    const initializationVectorHex = await getSecureRandomBytes(16); // 128-bit IV
    const initializationVector = enc.Hex.parse(initializationVectorHex);

    const encrypted = AES.encrypt(JSON.stringify(data), keyWordArray, {
        iv: initializationVector,
        mode: mode.CBC,
        padding: pad.Pkcs7,
    });

    return JSON.stringify({
        initializationVector: initializationVectorHex,
        data: encrypted.toString(),
    });
}

export async function decryptData(encryptedData) {
    if (!encryptedData) {
        throw new Error('Cannot decrypt undefined or null value.');
    }

    const key = await getEncryptionKey();
    const keyWordArray = enc.Hex.parse(key);

    const encryptedDataJson = JSON.parse(encryptedData);
    const initializationVector = enc.Hex.parse(encryptedDataJson.initializationVector);

    const decrypted = AES.decrypt(encryptedDataJson.data, keyWordArray, {
        iv: initializationVector,
        mode: mode.CBC,
        padding: pad.Pkcs7,
    });

    return JSON.parse(decrypted.toString(enc.Utf8));
}