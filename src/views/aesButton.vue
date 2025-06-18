<template>
  <div>
    <!-- <el-button @click="handleEncrypt">AES加密</el-button> -->
  </div>
</template>

<script setup>
import CryptoJS from "crypto-js";
import { onMounted } from 'vue';
onMounted(() => {
  handleEncrypt()
})
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
  window.location.href = `https://dls.4dlp.com.cn:7102/bim/#/?token=${base64Token}`
}
</script>

<style>
</style>