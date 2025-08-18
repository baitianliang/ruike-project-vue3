<template>
  <div id="home" class="home-container">
    <div class="background-animation">
      <div class="particle" v-for="(particle, index) in particles" :key="'p'+index" :style="particleStyle(particle)"></div>
    </div>
    
    <div class="content-wrapper">
      <div class="header">
        <h1 class="app-name">
          <span class="gradient-text">控制面板</span>
          <div class="welcome-text">欢迎!</div>
        </h1>
        <div class="weather-widget" v-if="showWeather">
          <span class="weather-icon">☀️</span>
          <span class="weather-temp">24°C</span>
        </div>
      </div>
      
      <div class="time-date">
        <div class="current-time">{{ currentTime }}</div>
        <div class="current-date">{{ currentDate }}</div>
      </div>
      
      <div class="nav-content">
        <div class="category" v-for="(category, catIndex) in categorizedLinks" :key="catIndex">
          <h2 class="category-title">{{ category.name }}</h2>
          <div class="nav-buttons">
            <div
              v-for="(link, index) in category.links"
              :key="index"
              @click="routerOpen(link)"
              class="nav-button"
              :style="{ '--hue': catIndex * 60 }"
            >
              <span class="button-icon">{{ linkIcon(link) }}</span>
              <span class="button-text">{{ link.name }}</span>
              <span class="button-badge" v-if="link.meta?.badge">{{ link.meta.badge }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <button class="quick-action" v-for="action in quickActions" :key="action.id">
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-text">{{ action.text }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import router from "@/router";

// 数据
const currentTime = ref('')
const currentDate = ref('')
const showWeather = ref(true)
const particles = ref(Array(20).fill().map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 3,
  speed: Math.random() * 0.2 + 0.1
})))

const quickActions = [
  { id: 1, icon: '⚡', text: '快速任务' },
  { id: 2, icon: '📝', text: '新笔记' },
  { id: 3, icon: '📊', text: '解析' },
  { id: 4, icon: '⚙️', text: '设置' }
]

// 计算属性
const categorizedLinks = computed(() => {
  const routes = router.getRoutes()
    .filter(route => route.name && !route.meta?.hidden)
  
  const categories = {}
  
  routes.forEach(route => {
    const category = route.meta?.category || '通用'
    if (!categories[category]) {
      categories[category] = {
        name: category,
        links: []
      }
    }
    categories[category].links.push(route)
  })
  
  return Object.values(categories)
})

// 方法
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  console.log(currentDate.value)
}

const particleStyle = (particle) => ({
  left: `${particle.x}%`,
  top: `${particle.y}%`,
  width: `${particle.size}px`,
  height: `${particle.size}px`,
  animationDuration: `${5/particle.speed}s`
})

const linkIcon = (link) => {
  const icons = {
    'Home': '🏠',
    'About': 'ℹ️',
    'Settings': '⚙️',
    'Profile': '👤',
    'Messages': '✉️',
    'Projects': '📁',
    'Calendar': '📅',
    'Tasks': '✅',
    'Team': '👥'
  }
  return icons[link.name] || '🔗'
}

const animateParticles = () => {
  particles.value = particles.value.map(p => ({
    ...p,
    y: (p.y + p.speed) % 100
  }))
  requestAnimationFrame(animateParticles)
}

// 生命周期
onMounted(() => {
  updateTime()
  const timer = setInterval(updateTime, 1000)
  animateParticles()
  
  onBeforeUnmount(() => {
    clearInterval(timer)
  })
})

const routerOpen = (link) => {
  // window.open('http://192.168.2.162:8080/#' + link.path + `?uuid=55BD60A1B0EF4F4991C0F761BD143058&taskId=2&bpDataId=86&bpName=uxmm&startTime=1755238559000`, '_blank')
  router.push(link.path)
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  
  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    
    .particle {
      position: absolute;
      background: rgba(100, 149, 237, 0.3);
      border-radius: 50%;
      animation: float linear infinite;
      
      @keyframes float {
        0% { transform: translateY(0); }
        100% { transform: translateY(-100vh); }
      }
    }
  }
  
  .content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
    .app-name {
      font-size: 3rem;
      margin: 0;
      font-weight: 700;
      
      .gradient-text {
        background: linear-gradient(90deg, #4361ee, #3a0ca3);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      
      .welcome-text {
        font-size: 1.2rem;
        color: #6c757d;
        font-weight: 400;
        margin-top: 0.5rem;
      }
    }
    
    .weather-widget {
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      
      .weather-icon {
        font-size: 1.2rem;
      }
      
      .weather-temp {
        font-weight: 600;
      }
    }
  }
  
  .time-date {
    text-align: center;
    margin-bottom: 2rem;
    
    .current-time {
      font-size: 3.5rem;
      font-weight: 300;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .current-date {
      font-size: 1.2rem;
      color: #6c757d;
    }
  }
  
  .nav-content {
    .category {
      margin-bottom: 2rem;
      
      .category-title {
        color: #495057;
        font-weight: 500;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #dee2e6;
      }
    }
  }
  
  .nav-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .nav-button {
    --hue: 220;
    padding: 1rem;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    background: hsl(var(--hue), 80%, 60%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.8rem;
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, 
        hsla(var(--hue), 80%, 60%, 0.9), 
        hsla(var(--hue), 80%, 50%, 0.9));
      z-index: -1;
      transition: opacity 0.3s ease;
      opacity: 1;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      
      &::before {
        opacity: 0.8;
      }
    }
    
    .button-icon {
      font-size: 1.2rem;
    }
    
    .button-text {
      flex-grow: 1;
      text-align: left;
    }
    
    .button-badge {
      background: white;
      color: hsl(var(--hue), 80%, 50%);
      border-radius: 10px;
      padding: 0.1rem 0.5rem;
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
  
  .quick-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    
    .quick-action {
      background: white;
      border: none;
      border-radius: 10px;
      padding: 0.8rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        background: #f8f9fa;
      }
      
      .action-icon {
        font-size: 1.2rem;
      }
      
      .action-text {
        font-size: 0.9rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
    
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .time-date {
      .current-time {
        font-size: 2.5rem;
      }
    }
    
    .nav-buttons {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    
    .quick-actions {
      flex-wrap: wrap;
    }
  }
}
</style>