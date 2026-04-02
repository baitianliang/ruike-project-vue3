<template>
  <div id="quality_problem_h5" v-loading="loading">
    <van-nav-bar title="质量问题报表表单" fixed placeholder />
    <div class="page-content">
      <van-notice-bar left-icon="info-o" :scrollable="false">
        字段来源：质量问题.xlsx，按块动态渲染。
      </van-notice-bar>

      <van-empty v-if="!loading && !sectionList.length" description="未读取到字段配置" />

      <van-form v-else @submit="onSubmit">
        <van-collapse v-model="activeSections">
          <van-collapse-item
            v-for="section in sectionList"
            :key="section.name"
            :name="section.name"
            :title="section.name"
          >
            <van-cell-group inset>
              <template v-for="field in section.fields" :key="field.code">
                <van-field
                  v-if="field.component === 'text'"
                  v-model="formModel[field.code]"
                  :name="field.code"
                  :label="field.label"
                  :placeholder="`请输入${field.label}`"
                  label-align="top"
                />
                <van-field
                  v-else-if="field.component === 'textarea'"
                  v-model="formModel[field.code]"
                  :name="field.code"
                  :label="field.label"
                  :placeholder="`请输入${field.label}`"
                  type="textarea"
                  rows="3"
                  autosize
                  label-align="top"
                />
                <van-field
                  v-else-if="field.component === 'date'"
                  :model-value="formModel[field.code]"
                  :name="field.code"
                  :label="field.label"
                  placeholder="请选择日期"
                  readonly
                  is-link
                  label-align="top"
                  @click="openCalendar(field.code)"
                />
                <div v-else-if="field.component === 'image'" class="upload-item">
                  <div class="upload-label">{{ field.label }}</div>
                  <van-uploader
                    v-model="formModel[field.code]"
                    :max-count="6"
                    :after-read="() => {}"
                  />
                </div>
                <van-field
                  v-else
                  v-model="formModel[field.code]"
                  :name="field.code"
                  :label="field.label"
                  :placeholder="`请输入${field.label}`"
                  label-align="top"
                />
              </template>
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>

        <div class="submit-wrap">
          <van-button block type="primary" native-type="submit">
            提交表单
          </van-button>
        </div>
      </van-form>
    </div>

    <van-calendar v-model:show="calendar.show" @confirm="confirmDate" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import * as XLSX from 'xlsx'
import router from '@/router'
import axios from '../assets/axios/formH5.js'
import Cookies from 'js-cookie';

const loading = ref(false)
const sectionList = ref([])
const activeSections = ref([])
const formModel = reactive({})
const calendar = reactive({
  show: false,
  fieldCode: '',
})

onMounted(() => {
  loadFieldConfig()
  Cookies.set('USESSIONID', '5e89d5a12a72a2aeab4637d4b96cdf95', { expires: 7 })
  // console.log(Cookies.get('USESSIONID'));
  
  console.log('所有cookies:', Cookies.get());
  console.log('document.cookie:', document.cookie);

  // 2. 检查USESSIONID是否存在
  console.log('USESSIONID值:', Cookies.get('USESSIONID'));

  // Cookies.remove('USESSIONID');
  axios.pushData()
  // router.go(-1)
})

async function loadFieldConfig() {
  loading.value = true
  try {
    const workbook = await readWorkbook()
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
    const fieldList = parseFieldList(rows)
    sectionList.value = buildSectionList(fieldList)
    activeSections.value = sectionList.value.map(item => item.name)
    initFormModel(fieldList)
  } catch (error) {
    showFailToast('读取Excel字段失败')
  } finally {
    loading.value = false
  }
}

async function readWorkbook() {
  const baseUrl = process.env.BASE_URL || '/'
  const response = await fetch(`${baseUrl}质量问题.xlsx`)
  if (!response.ok) {
    throw new Error('Excel not found')
  }
  const arrayBuffer = await response.arrayBuffer()
  return XLSX.read(arrayBuffer, { type: 'array' })
}

function parseFieldList(rows) {
  const headerRow = rows.find(row => row.includes('要素标签') && row.includes('要素名称'))
  if (!headerRow) {
    return []
  }
  const labelIndex = headerRow.findIndex(item => item === '要素标签')
  const codeIndex = headerRow.findIndex(item => item === '要素名称')
  const defineIndex = headerRow.findIndex(item => item === '数据定义')
  const sectionIndex = headerRow.findIndex(item => item === '块')
  const headerRowIndex = rows.findIndex(row => row === headerRow)
  const fieldRows = rows.slice(headerRowIndex + 1)

  return fieldRows
    .filter(row => row[codeIndex])
    .map(row => {
      const label = row[labelIndex]
      const code = row[codeIndex]
      const define = row[defineIndex]
      const section = row[sectionIndex] || '未分类'
      return {
        label,
        code,
        define,
        section,
        component: resolveComponent(define),
      }
    })
}

function resolveComponent(define) {
  if (!define) {
    return 'text'
  }
  const defineText = String(define)
  if (defineText.includes('Long Description')) {
    return 'textarea'
  }
  if (defineText.includes('Date')) {
    return 'date'
  }
  if (defineText.includes('Image Picker')) {
    return 'image'
  }
  return 'text'
}

function buildSectionList(fieldList) {
  const sectionMap = {}
  fieldList.forEach(item => {
    if (!sectionMap[item.section]) {
      sectionMap[item.section] = []
    }
    sectionMap[item.section].push(item)
  })
  return Object.keys(sectionMap).map(name => ({
    name,
    fields: sectionMap[name],
  }))
}

function initFormModel(fieldList) {
  fieldList.forEach(item => {
    if (item.component === 'image') {
      formModel[item.code] = []
    } else {
      formModel[item.code] = ''
    }
  })
}

function openCalendar(fieldCode) {
  calendar.fieldCode = fieldCode
  calendar.show = true
}

function confirmDate(date) {
  if (!calendar.fieldCode) {
    calendar.show = false
    return
  }
  formModel[calendar.fieldCode] = formatDate(date)
  calendar.show = false
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function onSubmit() {
  showSuccessToast('表单提交成功')
}
</script>

<style lang="scss" scoped>
#quality_problem_h5 {
  height: 100%;
  background-color: #f7f8fa;
  overflow: auto;

  .page-content {
    padding: 12px;
  }

  .upload-item {
    padding: 12px 16px;
    text-align: left;
    background-color: #fff;

    .upload-label {
      margin-bottom: 10px;
      color: #323233;
      font-size: 14px;
    }
  }

  .submit-wrap {
    margin: 16px 4px 24px;
  }
}
</style>
