<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style lang="scss">
.base_title {
  margin-bottom: 16px;
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: rgba(31, 41, 55);
}
.base_status {
  display: inline-block;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 12px;
  border-radius: 4px;
  background-color: rgba(16, 185, 129);
  color: white;
}
.status_ed {
  background-color: #2ecc71;
}
.status_ing {
  background-color: #f39c12;
}
.status_un {
  background-color: #bbb;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  text-align: left;
  overflow: hidden;
}
</style>