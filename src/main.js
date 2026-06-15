import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css'
import ElementPlus from 'element-plus'
import Vant from 'vant'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './element-variables.scss'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import autoScrollDirective from './api/autoScroll'

const app = createApp(App)
const pinia = createPinia()

// if(window === window.parent && window === window.top && window.opener === null && process.env.VUE_APP_MODE === "production") {
//   alert('请不要单独打开此页面，请在中车平台打开！')
//   window.location.href = `https://dls.4dlp.com.cn:7102/unifier`
// }

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(Vant)
app.use(router)
app.use(pinia)
app.directive('auto-scroll', autoScrollDirective)
app.mount('#app')


function setRem() {
  if(window.location.href.indexOf('/FormH5') > -1) return;
  if(window.location.href.indexOf('/ListH5') > -1) return;
  const baseSize = 16 // 基准大小
  let designWidth = 2560 // 设计稿宽度
  if(window.location.href.indexOf('/visual') > -1) {
    designWidth = 2560 // 设计稿宽度
  } else {
    designWidth = 1920 // 设计稿宽度
  }
  const currentWidth = Math.min(document.documentElement.clientWidth, designWidth)
  const rem = (currentWidth / designWidth) * baseSize
  document.documentElement.style.fontSize = rem + 'px'
}
window.addEventListener('resize', setRem) // 监听窗口变化
setRem() // 初始化
