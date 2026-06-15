<template>
  <div id="quality_problem_h5" v-loading="loading">
    <header class="page-header">
      <div class="title-block">
        <h1>{{ label }}</h1>
        <p>{{ dataList.length }} 条待办未处理</p>
      </div>
      <button
        class="icon-button"
        type="button"
        aria-label="搜索"
        title="搜索"
        @click="toggleSearch"
      >
        <Search />
      </button>
    </header>

    <div v-if="searchVisible" class="search-panel">
      <input
        ref="searchInput"
        v-model.trim="searchKeyword"
        class="search-input"
        type="search"
        placeholder="搜索待办、项目或发起人"
      >
    </div>

    <main class="todo-list">
      <article
        v-for="(item, index) in filteredList"
        :key="item.TASK_ID || index"
        class="todo-card"
        @click="goDetail(item)"
      >
        <div class="card-meta">
          <span class="status-badge">待审批</span>
          <span v-if="formatTimeBadge(item.START_DATE)" class="time-badge">
            {{ formatTimeBadge(item.START_DATE) }}
          </span>
        </div>

        <h2 class="todo-title">{{ item.NAME || '未命名待办' }}</h2>

        <section class="detail-box">
          <div class="detail-row">
            <Folder />
            <span>项目：{{ item.PROJ || '暂无数据' }}</span>
          </div>
          <div class="detail-row">
            <UserFilled />
            <span>发起人：{{ item.SENDERS || '暂无数据' }}</span>
          </div>
          <div class="detail-row">
            <Clock />
            <span>发起时间：{{ item.START_DATE || '暂无数据' }}</span>
          </div>
        </section>
      </article>

      <van-empty
        v-if="!loading && !filteredList.length"
        :description="emptyText"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, Folder, Search, UserFilled } from '@element-plus/icons-vue'
import axios from '../assets/axios/formH5.js'

const loading = ref(false)
const route = useRoute()
const router = useRouter()
const label = ref('待办事项')
const dataList = ref([])
const searchVisible = ref(false)
const searchKeyword = ref('')
const searchInput = ref(null)
const requestMessage = ref('')

const filteredList = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()

  if (!keyword) return dataList.value

  return dataList.value.filter((item) => {
    return [item.NAME, item.PROJ, item.SENDERS, item.START_DATE]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword))
  })
})

const emptyText = computed(() => {
  if (searchKeyword.value) return '没有匹配的待办'
  return requestMessage.value || '暂无待办事项'
})

onMounted(() => {
  loadList()
})

async function loadList() {
  loading.value = true

  axios.getList()
    .then((res) => {
      const responseData = res.data || {}

      dataList.value = Array.isArray(responseData.data) ? responseData.data : []
      requestMessage.value = responseData.code === 200 ? '' : responseData.msg || ''
    })
    .catch((error) => {
      requestMessage.value = error?.message || '加载失败'
      dataList.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

function toggleSearch() {
  searchVisible.value = !searchVisible.value

  if (!searchVisible.value) {
    searchKeyword.value = ''
    return
  }

  nextTick(() => searchInput.value?.focus())
}

function goDetail(item) {
  if (!item.TASK_ID) return

  const query = {
    taskid: item.TASK_ID,
    from: 'todo',
  }

  if (route.query.username) {
    query.username = route.query.username
  }

  router.push({
    path: '/FormH5',
    query,
  })
}

function formatTimeBadge(value) {
  const date = parseDate(value)
  if (!date) return ''

  const now = new Date()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return `今天 ${time}`
  }

  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${time}`
}

function parseDate(value) {
  if (!value) return null

  const normalized = String(value).replace(/\//g, '-').replace(' ', 'T')
  const date = new Date(normalized)

  return Number.isNaN(date.getTime()) ? null : date
}

function pad(value) {
  return String(value).padStart(2, '0')
}

</script>

<style lang="scss" scoped>
#quality_problem_h5 {
  height: 100vh;
  background: #f5f7fb;
  color: #172033;
  overflow: auto;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 18px rgba(35, 50, 78, 0.08);

}

.title-block {
  min-width: 0;

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    margin: 6px 0 0;
    color: #6f7f95;
    font-size: 13px;
    line-height: 1.2;
  }
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  color: #172033;
  background: #f3f6fb;
  border: 1px solid #edf1f7;
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
  }
}

.search-panel {
  padding: 12px 12px 0;
  background: #f5f7fb;
}

.search-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  color: #172033;
  font-size: 15px;
  background: #fff;
  border: 1px solid #e7edf6;
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: #7ca7d9;
    box-shadow: 0 0 0 3px rgba(25, 116, 210, 0.12);
  }
}

.todo-list {
  padding: 22px 12px 24px;
}

.todo-card {
  padding: 20px;
  margin-bottom: 14px;
  background: #fff;
  border: 1px solid #edf1f7;
  border-radius: 20px;
  box-shadow: 0 10px 26px rgba(33, 50, 81, 0.08);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:active {
    transform: scale(0.995);
  }
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  color: #0a63d8;
  font-size: 13px;
  font-weight: 600;
  background: #eef6ff;
  border: 1px solid #9fc8ff;
  border-radius: 8px;
  white-space: nowrap;
}

.time-badge {
  max-width: 48%;
  padding: 5px 9px;
  color: #8292aa;
  font-size: 13px;
  line-height: 1;
  background: #f7f9fd;
  border-radius: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-title {
  margin: 0 0 14px;
  color: #172033;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0;
}

.detail-box {
  padding: 16px;
  background: #f9fbfe;
  border: 1px solid #edf1f7;
  border-radius: 14px;
}

.detail-row {
  display: flex;
  align-items: center;
  min-width: 0;
  color: #58708f;
  font-size: 14px;
  line-height: 1.45;

  & + & {
    margin-top: 14px;
  }

  svg {
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    margin-right: 12px;
    color: #8aa0bc;
  }

  span {
    min-width: 0;
    overflow-wrap: anywhere;
  }
}

@media (min-width: 768px) {
  .page-header {
    padding: 0 18px;
  }

  .todo-list {
    padding: 22px 12px 32px;
  }

  .todo-card {
    padding: 20px;
  }
}
</style>
