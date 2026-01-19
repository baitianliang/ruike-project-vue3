// directives/autoScroll.js
const autoScrollDirective = {
  mounted(el, binding) {
    // 默认配置
    const defaultOptions = {
      speed: 1,           // 滚动速度（像素/次）
      delay: 30,          // 滚动间隔（毫秒）
      pauseOnHover: true, // 鼠标悬停暂停
      reverse: false,     // 反向滚动
      loop: true,         // 循环滚动
    }

    // 合并配置
    let options = defaultOptions
    if (binding.value) {
      if (typeof binding.value === 'number') {
        options = { ...defaultOptions, speed: binding.value }
      } else {
        options = { ...defaultOptions, ...binding.value }
      }
    }

    // 查找表格滚动容器
    const tableBody = el.querySelector('.el-scrollbar__wrap')
    const tableBodyWrapper = el.querySelector('.el-table__body')
    if (!tableBody) {
      console.warn('未找到 el-table 的滚动容器')
      return
    }

    let scrollInterval = null
    let isPaused = false

    // 开始滚动函数
    const startScroll = () => {
      if (scrollInterval) return
      
      scrollInterval = setInterval(() => {
        if (isPaused || !tableBody) return
        const maxScroll =  tableBodyWrapper.clientHeight - tableBody.clientHeight
        if (options.reverse) {
          // 反向滚动（向上）
          tableBody.scrollTop -= options.speed
          if (tableBody.scrollTop <= 0) {
            if (options.loop) {
              tableBody.scrollTop = maxScroll
            } else {
              pauseScroll()
            }
          }
        } else {
          // 正向滚动（向下）
          tableBody.scrollTop += options.speed
          if (tableBody.scrollTop >= maxScroll) {
            if (options.loop) {
              tableBody.scrollTop = 0
            } else {
              pauseScroll()
            }
          }
        }
      }, options.delay)
    }

    // 暂停滚动
    const pauseScroll = () => {
      isPaused = true
    }

    // 恢复滚动
    const resumeScroll = () => {
      isPaused = false
    }

    // 停止滚动
    const stopScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval)
        scrollInterval = null
      }
    }

    // 存储方法和状态到元素上
    el._autoScroll = {
      start: startScroll,
      pause: pauseScroll,
      resume: resumeScroll,
      stop: stopScroll,
      isPaused: () => isPaused,
      options
    }

    // 初始化样式和事件
    // tableBody.style.overflowY = 'hidden' // 隐藏滚动条
    startScroll()

    // 鼠标悬停暂停/恢复
    if (options.pauseOnHover) {
      tableBody.addEventListener('mouseenter', pauseScroll)
      tableBody.addEventListener('mouseleave', resumeScroll)
    }

    // 页面失去焦点时暂停
    window.addEventListener('blur', pauseScroll)
    window.addEventListener('focus', resumeScroll)
  },

  unmounted(el) {
    // 清理工作
    if (el._autoScroll) {
      el._autoScroll.stop()
      
      const tableBody = el.querySelector('.el-table__body-wrapper')
      if (tableBody) {
        tableBody.style.overflowY = 'auto'
        
        // 移除事件监听器
        tableBody.removeEventListener('mouseenter', el._autoScroll.pause)
        tableBody.removeEventListener('mouseleave', el._autoScroll.resume)
      }
      
      window.removeEventListener('blur', el._autoScroll.pause)
      window.removeEventListener('focus', el._autoScroll.resume)
      
      // 删除引用
      delete el._autoScroll
    }
  },

  // 可选：添加 updated 钩子以响应参数变化
  updated(el, binding) {
    if (el._autoScroll && binding.value !== binding.oldValue) {
      // 重新应用指令
      this.unmounted(el)
      this.mounted(el, binding)
    }
  }
}

export default autoScrollDirective