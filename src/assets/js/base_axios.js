import axios from 'axios'
import CryptoJS from "crypto-js";

function handleEncrypt() {
  const originalData = `PMS-PU-${Date.now()}`;
  const key = CryptoJS.enc.Utf8.parse("FdNJLjnh83L3hhuh");

  // 加密
  const encrypted = CryptoJS.AES.encrypt(originalData, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const base64Token = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encrypted)
  );
  return base64Token
}
let instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // baseURL: "/api/",
  timeout: 60 * 1000000,
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Authorization': ''
    // 'Authorization': `Bearer ${handleEncrypt()}`
  }
})
instance.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer ${handleEncrypt()}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance