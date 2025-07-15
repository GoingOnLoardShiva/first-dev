// utils/decryptUtil.js
import CryptoJS from "crypto-js";

export function decryptData(encryptedData, ivHex, passphrase) {
  try {
    const key = CryptoJS.SHA256(passphrase);
    console.log("🧠 Frontend SHA256 Key:", key.toString());

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedHex = CryptoJS.enc.Hex.parse(encryptedData);
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedHex);

    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error("Decryption failed: empty output");

    return JSON.parse(decryptedText);
  } catch (err) {
    console.error("❌ Decryption error:", err);
    throw new Error("Malformed UTF-8 data or invalid decryption key/IV");
  }
}
