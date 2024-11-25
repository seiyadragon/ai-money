import { EntryData } from "@/components/table-entry";
import { env } from "process";

export const getCryptoKey = async () => {
    const crypt = crypto.subtle;

    const key = env.CRYPTO_KEY;
    const keyBuffer = new TextEncoder().encode(key);

    return crypt.importKey("raw", keyBuffer, "AES-GCM", true, ["encrypt", "decrypt"]);
}

export const encrypt = async (data: string) => {
    const crypt = crypto.subtle;

    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const dataBuffer = new TextEncoder().encode(data);

    const encryptedData = await crypt.encrypt({ name: "AES-GCM", iv }, key, dataBuffer);

    // Combine IV and encrypted data
    const combinedData = new Uint8Array(iv.length + encryptedData.byteLength);
    combinedData.set(iv);
    combinedData.set(new Uint8Array(encryptedData), iv.length);
    
    return combinedData.buffer;
}

export const decrypt = async (data: ArrayBuffer) => {
    const crypt = crypto.subtle;

    // Extract the IV from the data
    const iv = data.slice(0, 16);
    const encryptedData = data.slice(16);

    let alert = new TextDecoder().decode(iv);
    alert = alert + "\n" + new TextDecoder().decode(encryptedData);

    console.log(alert);

    const key = await getCryptoKey();

    // Decrypt the data using the extracted IV
    const decryptedData = await crypt.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encryptedData
    );

    return decryptedData;
}

export const ArrayBufferToString = (buffer: ArrayBuffer) => {
    return new TextDecoder().decode(buffer);
}