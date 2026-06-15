<template>
  <div id="quality_problem_h5" v-loading="loading">
    <van-nav-bar :title="label" fixed placeholder sticky />
    <div class="form-tabs">
      <div class="mode-tabs" role="tablist" aria-label="表单类型">
        <button
          class="mode-tab"
          :class="{ active: formMode === 'main' }"
          type="button"
          @click="formMode = 'main'"
        >
          <Document />
          <span>主表单</span>
        </button>
        <button
          class="mode-tab"
          :class="{ active: formMode === 'sub' }"
          type="button"
          v-if="!!tabsList.length"
          :disabled="!tabsList.length"
          @click="formMode = 'sub'"
        >
          <Files />
          <span>子表单</span>
        </button>
        <button
          class="mode-tab"
          :class="{ active: formMode === 'file' }"
          type="button"
          v-if="!!tabsList.length"
          :disabled="!tabsList.length"
          @click="formMode = 'file'"
        >
          <Folder />
          <span>附件列表</span>
        </button>
      </div>
    </div>

    <div v-if="formMode === 'sub' && tabsList.length" class="sub-tabs-wrapper">
      <div class="sub-tabs" role="tablist" aria-label="子表">
        <button
          v-for="(item, index) in tabsList"
          :key="item.tab_id || index"
          class="sub-tab"
          :class="{ active: childActiveIndex === index }"
          type="button"
          @click="childActiveIndex = index"
        >
          <span>{{ item.tab_name }}</span>
          <strong>{{ getTabCount(item) }}</strong>
        </button>
      </div>
    </div>

    <section v-show="formMode === 'main'" class="page-content">
      <van-empty v-if="!loading && !sectionList.length" description="未读取到字段配置" />

      <van-form v-else required="auto" ref="modelForm">
        <van-collapse class="main-collapse" v-model="activeSections">
          <template
              v-for="section in sectionList"
              :key="section.id">
            <van-collapse-item
              v-if="!section.hidden"
              :name="section.id"
              :title="getBlockTitle(section)"
            >
              <template v-for="field in fieldList.filter(item => item.block === section.id)" :key="field.name">
                <van-cell-group v-if="field.type != 'none'" class="form-field-group" inset>
                  <van-field
                    v-if="field.type === 'string' || field.type === 'display' || field.type === 'picker'"
                    v-model="formModel[field.name]"
                    :disabled="field.disabled || field.type === 'display'"
                    :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                    :name="field.name"
                    :label="field.label"
                    :placeholder="`暂无数据`"
                    :maxlength="field.maxLength"
                    show-word-limit
                    label-align="top"
                    @update:model-value="updateModelValue($event, field.name)"
                  />
                  <van-field
                    v-else-if="field.type === 'textarea'"
                    v-model="formModel[field.name]"
                    :disabled="field.disabled"
                    :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                    :name="field.name"
                    :label="field.label"
                    :placeholder="`暂无数据`"
                    type="textarea"
                    rows="3"
                    autosize
                    label-align="top"
                    @update:model-value="updateModelValue($event, field.name)"
                  />
                  <van-cell v-else-if="field.type === 'decimal'" class="form-field-cell" :title="field.label">
                    <template #label>
                      <van-stepper
                        v-model="formModel[field.name]"
                        :show-plus="false"
                        :show-minus="false"
                        min="-9999999999999.99"
                        input-width="100%"
                        :disabled="field.disabled"
                        :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                        :decimal-length="field.decimalFormat"
                        @change="updateModelValue($event, field.name)"/>
                    </template>
                  </van-cell>
                  <van-field
                    v-else-if="field.type === 'date'"
                    :model-value="formModel[field.name]"
                    :name="field.name"
                    :label="field.label"
                    placeholder="暂无数据"
                    :disabled="field.disabled"
                    :is-link="!field.disabled"
                    :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                    label-align="top"
                    @click="openDatePicker(field, formModel[field.name])"
                  />
                  <van-field
                    v-else-if="field.type === 'datetime'"
                    :model-value="formModel[field.name] && `${formModel[field.name].replaceAll('T', ' ').replaceAll('-', '/')}`"
                    :name="field.name"
                    :label="field.label"
                    placeholder="暂无数据"
                    :disabled="field.disabled"
                    :is-link="!field.disabled"
                    :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                    label-align="top"
                    @click="openPickerGroup(field, formModel[field.name])"
                  />
                  <van-field
                    v-else-if="field.type === 'select'"
                    :model-value="options[field.name]?.options?.find(item => item.value === formModel['k__' + field.name])?.label || formModel[field.name]"
                    :name="field.name"
                    :label="field.label"
                    placeholder="暂无数据"
                    readonly
                    :disabled="field.disabled"
                    :is-link="!field.disabled"
                    :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                    label-align="top"
                    @click="openSelect(field)"
                  />
                  <van-cell v-else-if="field.type === 'checkbox'" class="form-field-cell checkbox-field">
                    <van-checkbox
                      shape="square"
                      :disabled="field.disabled"
                      :rules="field.required && [{ required: field.required, message: field.label + '不能为空' }]"
                      v-model="formModel['k__' + field.name]"
                      @change="updateModelCheckboxValue($event, field.name)">
                      {{ field.label }}
                    </van-checkbox>
                  </van-cell>
                </van-cell-group>
              </template>
            </van-collapse-item>
          </template>
        </van-collapse>
      </van-form>
    </section>

    <section v-show="formMode === 'sub'" class="sub-table-content">
      <van-empty v-if="!activeTab" description="暂无子表" />
      <template v-else>
        <div class="form_card" v-for="(_item, _index) in activeTab.data || []" :key="_item.id || _index">
          <van-row :gutter="[20, 20]">
            <van-col span="12">
              <van-field
                :model-value="_item.li_num"
                name="编号"
                label="编号"
                placeholder="暂无数据"
                readonly
                :is-link="!readonly"
                label-align="top"
              />
            </van-col>
            <template v-for="(__item, __index) in activeTabLayout" :key="__index">
              <van-col span="12" v-if="_item.showMore || __index < 3">
                <van-field
                  :model-value="_item[__item.name]"
                  :name="__item.label"
                  :label="__item.label"
                  placeholder="暂无数据"
                  readonly
                  :is-link="!readonly"
                  label-align="top"
                />
              </van-col>
            </template>
          </van-row>
          <div v-if="activeTabLayout.length > 3" class="more-action">
            <el-button v-if="_item.showMore" :icon="ArrowUp" type="text" @click="() => _item.showMore = !_item.showMore">收起字段</el-button>
            <el-button v-else :icon="ArrowDown" type="text" @click="() => _item.showMore = !_item.showMore">更多字段</el-button>
          </div>
        </div>
        <van-empty v-if="!(activeTab.data || []).length" description="暂无子表数据" />
      </template>
    </section>

    <section v-show="formMode === 'file'" class="sub-table-content">
      <van-empty v-if="fileList.length < 1" description="暂无附件" />
      <template v-else>
        <div class="file-list-wrapper" v-for="(item, index) in fileList" :key="index">
            <div>
                <div class="file-name-wrapper">{{ item.FILE_NAME.split('.')[1].substring(0, 3) }}</div>
                <div style="margin-right: 10px">{{ item.FILE_NAME }}</div>
            </div>
            <el-button style="" @click="receiveFile(item)" type="primary" size="mini">浏览</el-button>
        </div>
      </template>
    </section>
    
    <div style="height: 50px"></div>
    <van-action-bar>
      <van-action-bar-button v-for="(item, index) in buttonList" :key="index" :text="item.label" @click="actionFunction(item)"/>
    </van-action-bar>
    
    <van-back-top bottom="10vh" />

    
    <van-action-sheet v-model:show="nextExecutorShow" :title="nextTitle" close-on-click-action>
      <div v-if="nextStepType === 3 && !changeUser">
        <van-empty description="流程结束" />
        <van-button style="margin-top: 20px" type="success" block @click="checkBeforeSend">确认通过</van-button>
      </div>
      <div v-else>
        <van-field
          name="下一步审批岗位"
          label="下一步审批岗位"
          :placeholder="nextForm.groups.map(item => item.name).join(', ')"
          readonly
          label-align="top"
        />
        
        <!-- <van-checkbox-group v-model="checked" label="下一步审批人">
          <van-checkbox name="a">复选框 a</van-checkbox>
          <van-checkbox name="b">复选框 b</van-checkbox>
        </van-checkbox-group> -->

        <van-checkbox-group v-if="changeUser" v-model="nextUser">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in nextForm.users"
              clickable
              :key="index"
              :title="item.name"
              @click="toggle(index)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="item"
                  :ref="el => checkboxRefs[index] = el"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
        <van-field
          v-else
          name="下一步审批人"
          label="下一步审批人"
          :placeholder="nextForm.users.map(item => item.name).join(', ')"
          readonly
          label-align="top"
        />

        <van-button style="margin-top: 20px" type="success" block @click="checkBeforeSend">确认提交</van-button>
      </div>
    </van-action-sheet>
    
    <van-popup
      v-model:show="datePicker.show"
      position="bottom"
    >
      <van-date-picker v-model="datePicker.value" @confirm="confirmDate" />
    </van-popup>

    <van-popup
      v-model:show="pickerGroup.show"
      position="bottom"
    >
      <van-picker-group
        :tabs="['选择日期', '选择时间']"
        @confirm="confirmGroupDate"
      >
        <van-date-picker v-model="pickerGroup.currentDate" />
        <van-time-picker v-model="pickerGroup.currentTime" />
      </van-picker-group>
    </van-popup>

    <van-popup
      v-if="picker.show"
      v-model:show="picker.show"
      position="bottom"
    >
      <van-picker
        v-model="picker.value"
        :columns-field-names="picker.customFieldName"
        :columns="picker.columns"
        @confirm="confirmPicker"
        @cancel="() => picker.show = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { ArrowUp, ArrowDown, Document, Files, Folder } from '@element-plus/icons-vue'
// import * as XLSX from 'xlsx'
import router from '@/router'
import axios from '../assets/axios/formH5.js'


const loading = ref(false)
const readonly = ref(true)
const routeQuery = router.currentRoute.value?.query || {}
const taskId = ref(routeQuery.taskid)
const label = ref('')
const formMode = ref('main')
const childActiveIndex = ref(0)
const sectionList = ref([])
const activeSections = ref([])
const fieldList = ref([])
const formModel = ref({})
const tabsList = ref([])
const spec = ref({})
const buttonList = ref([])
const activeTab = computed(() => tabsList.value[childActiveIndex.value] || null)
const activeTabLayout = computed(() => spec.value[`tablog${childActiveIndex.value}`]?.layout || [])

const datePicker = reactive({
  show: false,
  fieldCode: '',
  value: [],
})
const pickerGroup = reactive({
  show: false,
  currentDate: [],
  currentTime: [],
})
const picker = ref({
  show: false,
  fieldCode: '',
  value: [],
  columns: [],
  customFieldName: {
    text: 'label',
    value: 'value',
  },
})

const nextExecutorShow = ref(false)
const nextTitle = ref('')
const nextUser = ref([])
const nextForm = ref({})
const changeUser = ref(null)
const nextStepType = ref(null)
const checkboxRefs = ref([]);
const toggle = (index) => {
  checkboxRefs.value[index].toggle();
};

const getBlockTitle = (section) => {
  return Object.prototype.hasOwnProperty.call(section, 'label')
    ? section.label
    : section.name
}

const getTabCount = (tab) => {
  if (tab.total !== undefined && tab.total !== null) return tab.total
  return Array.isArray(tab.data) ? tab.data.length : 0
}

const handleSubmitSuccess = () => {
  showSuccessToast({
    message: '提交成功',
    duration: 3000,
  })
  nextExecutorShow.value = false

  window.setTimeout(() => {
    if (routeQuery.from === 'todo') {
      const query = routeQuery.username
        ? { username: routeQuery.username }
        : {}

      router.replace({
        path: '/ListH5',
        query,
      })
      return
    }

    closeWebview()
  }, 3000)
}

const closeWebview = () => {
  const userAgent = navigator.userAgent

  if (userAgent.includes('Android') || userAgent.includes('Adr')) {
    window.Android?.closeWebview?.()
    return
  }

  const isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(userAgent)
  const isHideLoading = window.location.href.includes('iOS-hideLoading://')

  if (isIOS && !isHideLoading) {
    window.webkit?.messageHandlers?.JsToOc?.postMessage({
      event: 'closeWebview',
      data: '',
    })
    return
  }

  window.close()
}

let USESSIONID = '', token = '', uref = '', context = {}, baseForm = {}, actionForm = {}, saveItemForm = {}, pushForm = {}
const options = ref({})
const fileList = ref([])
onMounted(() => {
  loading.value = true
  axios.getDate(taskId.value)
  .then(res => {
    if(res.data.code !== 200) {
      showFailToast(res.data.msg)
      return;
    }
    axios.getFileList({
      parentId: res.data.data.data.upper.id,
      model: res.data.data.data.workflow.model,
    })
    .then(res => {
      fileList.value = res.data.data || [{
        RECORD_ID: 60,
        FILE_ID: 3977,
        MODEL: "uxpc",
        FILE_NAME: "GCMS-PMS接口清单.xlsx"
      }]
    })
    label.value = res.data.data.spec.upper.label
    sectionList.value = res.data.data.spec.upper.blocks
    activeSections.value = sectionList.value.map(item => item.id)
    fieldList.value = res.data.data.spec.upper.fields
    formModel.value = res.data.data.data.upper
    tabsList.value = res.data.data.spec.form.bp_tab || []
    childActiveIndex.value = 0
    spec.value = res.data.data.spec
    buttonList.value = res.data.data.data.workflow.actions
    context = res.data.data.context
    res.data.data.config.upper.forEach(item => {
      options.value[item.name] = res.data.data.config.definitions[item.definition]
    })

    USESSIONID = res.data.data.parameter.USESSIONID
    token = res.data.data.parameter._token
    uref = res.data.data.parameter._uref
    baseForm = {
      prefix: res.data.data.context.prefix,
      // tab_id =  tab_id 值
      hidden_groupby: "[]",
      hidden_sortby: '[{"dataIndex":"li_num","order":"dsc"}]',
      rec_id: formModel.value.id,
      task_id: res.data.data.context.task_id,
      page: 1,
      size: 50,
      __token: token,
      __uref: uref
    }
    actionForm = {
      model: res.data.data.data.workflow.model,
      wfdesign: res.data.data.data.workflow.wfdesign,
      process_id: res.data.data.data.workflow.process_id,
      wftemplate_id: res.data.data.data.workflow.wftemplate_id,
      task_id: res.data.data.data.workflow.task_id,
      // link_id: res.data.data.data.workflow.actions
    }
    saveItemForm = {
      id:  res.data.data.data.upper.id,
      model: res.data.data.data.workflow.model,
      form_id: res.data.data.spec.form.id,
      winningBidExists: false,
      ojet: true,
      __token: token,
      __uref: uref
    }
    pushForm = {
      task_id: res.data.data.data.workflow.task_id,
      process_id: res.data.data.data.workflow.process_id,
      wftemplate_id: res.data.data.data.workflow.wftemplate_id,
      newTaskDates: "",
      auto_create_list: "",
    }
    tabsList.value.forEach((item, index) => {
      getLineItems(item.tab_id, index, USESSIONID)
    })
    loading.value = false
  })
})

function getLineItems(tab_id, index, USESSIONID) {
  baseForm.tab_id = tab_id
  const query = {
    url: "https://dls.4dlp.com.cn:7102/bp/mod/bp/record/lineitems",
    cookies: USESSIONID,
    inputjson: baseForm,
    type: "POST",
    format: "params"
  }
  axios.pushPu(query)
  .then(res => {
    tabsList.value[index].data = res.data.data.items
    tabsList.value[index].data.forEach(item => item.showMore = false)
    tabsList.value[index].total = res.data.data.total
  })
}
// 
const receiveFile = (item) => {
  window.location.href = `https://dls.4dlp.com.cn:7102/dls-strengthen/pufileonlineview/pukkview?fileId=${item.FILE_ID}&fileName=${item.FILE_NAME}&recordId=${item.RECORD_ID}&model=${context.prefix}&source_type=ML&kkuserId=${context.curruserid}`
}

const openDatePicker = (field, value) => {
  if(field.disabled) return;
  datePicker.value = value ? value.substr(0,10).split('-') : []
  datePicker.fieldCode = field.name
  datePicker.show = true
}
const confirmDate = (date) => {
  if (!datePicker.fieldCode) {
    datePicker.show = false
    return
  }
  formModel.value[datePicker.fieldCode] = date.selectedValues.join('-')
  upper[datePicker.fieldCode] = formModel.value[datePicker.fieldCode]
  datePicker.show = false
}

const openPickerGroup = (field, value) => {
  if(field.disabled) return;
  pickerGroup.currentDate = value ? value.substr(0,10).split('-') : []
  pickerGroup.currentTime = value ? value.substr(11,5).split(':') : []
  pickerGroup.fieldCode = field.name
  pickerGroup.show = true
}
const confirmGroupDate = (date) => {
  if (!pickerGroup.fieldCode) {
    pickerGroup.show = false
    return
  }
  const dateStr = date[0].selectedValues.join('-')
  const timeStr = date[1].selectedValues.join(':')
  formModel.value[pickerGroup.fieldCode] = `${dateStr}T${timeStr}`
  upper[pickerGroup.fieldCode] = formModel.value[pickerGroup.fieldCode]
  pickerGroup.show = false
}

const openSelect = (field, value) => {
  if(field.disabled) return;
  picker.value.value = [formModel.value['k__' + field.name]]
  picker.value.fieldCode = field.name
  picker.value.columns = options.value[field.name].options
  picker.value.show = true
}
const confirmPicker = (value) => {
  if (!picker.value.fieldCode) {
    picker.value.show = false
    return
  }
  formModel.value[picker.value.fieldCode] = value.selectedValues[0]
  formModel.value['k__' + picker.value.fieldCode] = value.selectedValues[0]
  upper[picker.value.fieldCode] = formModel.value[picker.value.fieldCode]
  picker.value.show = false
}

const updateModelValue = (field, value) => {
  if(field.disabled) return;
  upper[value] = field
}
const updateModelCheckboxValue = (field, value) => {
  upper[value] = field ? 1 : 0
  if(field.disabled) return;
}

const modelForm = ref(null)
const checkboxForm = ref([])
async function actionFunction(val) {
  try {
    await modelForm.value.validate()
  } catch (error) {
    showFailToast(error[0].message)
    formMode.value = 'main'
    nextTick(() => {
      modelForm.value.scrollToField(error[0].name)
    })
    return false
 }
  nextTitle.value = val.label
  actionForm.link_id = val.value
  const form = { ...formModel.value }
  for (const key in form) {
    const type = fieldList.value.find(item => item.name === key)?.type
    if(key.indexOf('date') > 0) {
      form[key] = form[key].padEnd(19, ':00:00')
    } else if(['checkbox', 'select'].includes(type)) {
      form[key] = form['k__' + key]
    }
  }
  const query = {
    url: "https://dls.4dlp.com.cn:7102/bp/mod/bp/record/wf/action",
    cookies: USESSIONID,
    inputjson: {
      upper: form,
      workflow: actionForm
    },
    headers: {
      'x-Unifier-token': token
    },
    type: "POST",
    format: "body"
  }
  axios.pushPu(query)
  .then(res => {
    pushForm.cc_user_list = res.data.data.workflow.cc.users.map(item => item.id).join(',')
    pushForm.cc_group_list = res.data.data.workflow.cc.groups.map(item => item.id).join(',')
    pushForm.to_group_list = res.data.data.workflow.to.groups.map(item => item.id).join(',')
    pushForm.next_step_id = res.data.data.workflow.nextStep.id
    pushForm.picked_link_id = actionForm.link_id
    nextUser.value = res.data.data.workflow.to.users
    nextForm.value = res.data.data.workflow.to
    changeUser.value = res.data.data.workflow.nextStep.adhoc
    nextStepType.value = res.data.data.workflow.nextStep.type
    nextExecutorShow.value = true
  })
}
let upper = {}

const submit = () => {
  if(nextStepType.value !== 3 || changeUser.value) {
    if(nextUser.value.length === 0) {
      showFailToast('请选择审批人')
      return
    }
  }
  loading.value = true
  const query = {
    url: "https://dls.4dlp.com.cn:7102/bp/studio/bp/process_lineitems",
    cookies: USESSIONID,
    inputjson: { ...saveItemForm },
    headers: {
      'x-Unifier-token': token
    },
    type: "POST",
    format: "body"
  }
  axios.pushPu(query)
  .then(() => {
    const to_user_list = nextUser.value.map(item => item.id).join(',')
    const query2 = {
      url: "https://dls.4dlp.com.cn:7102/bp/mod/bp/record/make",
      cookies: USESSIONID,
      inputjson: {
        context,
        notify_user_ids: "",
        notify_group_ids: "",
        update: {
          upper
        },
        create: null,
        workflowinfo: {
          newTaskDates: "",
          auto_create_list: "",
          to_user_list,
          ...pushForm,
        }
      },
      headers: {
        'x-Unifier-token': token,
        'X-Unifier-uref': uref
      },
      type: "POST",
      format: "body"
    }
    axios.pushPu(query2)
    .then(res => {
      if(res.data.data.errors.length > 0)
        showFailToast(res.data.data.errors[0])
      else {
        axios.pushTodo({
          id: res.data.data.out.create ? res.data.data.out.create.upper.id : res.data.data.out.update.upper.id,
          bpName: context.prefix
        })
        handleSubmitSuccess()
      }
      loading.value = false
    })
  })
}

const checkBeforeSend = () => {
  let pushData = false
    , obj = { ...formModel.value }
  if (context.prefix === "uxpi" && obj.k__CRRC_PI_GSJ_YS === "Y" && obj.k__CRRC_JKPD_PD == "0") {
      obj = {
          upperId: formModel.value.id || 0,
          nextStepId: pushForm.next_step_id,
          projectId: context.pid,
          bpname: context.prefix,
          taskId: context.task_id || 0,
          ...obj
      }
      obj.creator_id = obj.k__creator_id
      pushData = true
  }
  if (["uximp", "uxcm", "uxpc", "uxpr", "uxpkmn", "uxmm", "uxcmp", "uxwm", "uxmta", "uxrmp", "uxrrp", "uxpe", "uxqgi", "uxqgr", "uxram", "uxcam", "uxtr", "uxrfw", "uxpte"].includes(context.prefix) && obj.k__CRRC_JKPD_PD == "0") {
      obj = {
          upperId: formModel.value.id || 0,
          nextStepId: pushForm.next_step_id,
          projectId: context.pid,
          bpname: context.prefix,
          taskId: context.task_id || 0,
          ...obj
      }
      obj.creator_id = obj.k__creator_id
      pushData = true
  }
  const nextFun = function() {
    axios.doToDone({taskId: context.task_id || 0})
    .then(res => {
      submit()
    })
  }
  if (pushData) {
    axios.pushPms(obj)
    .then(res => {
      if (res.data.code === 201) {
        nextFun()
      } else if (res.data.code !== 200) {
        return showFailToast(res.data.msg)
      } else {
        showSuccessToast("数据推送成功！！")
        setTimeout(function() {
            nextFun()
        }, 1000)
      }
    })
  } else {
      nextFun()
  }
}
</script>

<style lang="scss" scoped>
#quality_problem_h5 {
  height: 100vh;
  color: #172033;
  background-color: #f6f8fb;
  font-size: 14px;
  overflow: auto;

  :deep(.van-nav-bar) {
    background: #fff;
    box-shadow: 0 1px 0 rgba(229, 234, 242, 0.9);
  }

  :deep(.van-nav-bar__title) {
    color: #172033;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .form-tabs {
    position: sticky;
    top: 46px;
    z-index: 1;
    padding: 0;
    background: #fff;
    box-shadow: 0 1px 0 rgba(229, 234, 242, 0.9);
  }

  .mode-tabs {
    display: flex;
    justify-content: center;
    // grid-template-columns: repeat(2, minmax(0, 1fr));
    background: #fff;
    border-bottom: 1px solid #eef2f7;
  }

  .mode-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 33%;
    height: 48px;
    gap: 6px;
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0;
    background: transparent;
    border: 0;
    cursor: pointer;

    &::after {
      position: absolute;
      right: 30%;
      bottom: 0;
      left: 30%;
      height: 2px;
      background: #2563eb;
      border-radius: 999px 999px 0 0;
      opacity: 0;
      content: '';
      transition: opacity 0.2s ease;
    }

    svg {
      width: 16px;
      height: 16px;
      color: currentColor;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      color: #2563eb;
      background: #fff;

      &::after {
        opacity: 1;
      }
    }
  }

  .sub-tabs-wrapper {
    position: sticky;
    top: 94px;
    z-index: 1;
    background: rgba(255, 255, 255, 0.94);
    border-bottom: 1px solid #eef2f7;
    box-shadow: 0 2px 8px rgba(31, 45, 68, 0.04);
    backdrop-filter: blur(10px);
  }

  .sub-tabs {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .sub-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    min-width: 0;
    height: 34px;
    gap: 6px;
    padding: 0 14px;
    color: #4b5563;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 999px;
    cursor: pointer;
    white-space: nowrap;

    strong {
      font-size: 13px;
      font-weight: 600;
    }

    &.active {
      color: #1d4ed8;
      background: #eff6ff;
      border-color: #dbeafe;
      font-weight: 600;
      box-shadow: none;
    }
  }

  .page-content {
    padding: 12px 10px 0;
    animation: content-fade 0.24s ease-out;
  }

  .main-collapse {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: transparent;

    &::after {
      display: none;
    }

    :deep(.van-collapse-item) {
      overflow: hidden;
      background: #fff;
      border: 1px solid #e8edf4;
      border-radius: 12px;
      box-shadow: 0 1px 2px rgba(31, 45, 68, 0.035);
      transition:
        box-shadow 0.2s ease,
        border-color 0.2s ease;
    }

    :deep(.van-collapse-item__title) {
      display: flex;
      align-items: center;
      min-height: 56px;
      padding: 0 16px;
      color: #172033;
      background: #fff;
      border-radius: 12px;
    }

    :deep(.van-collapse-item__title::after) {
      display: none;
    }

    :deep(.van-collapse-item__title .van-cell__title) {
      color: #172033;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: 0;
    }

    :deep(.van-collapse-item__title .van-cell__right-icon) {
      color: #8a99ad;
      font-size: 17px;
      margin-left: 12px;
      transition: transform 0.22s ease;
    }

    :deep(.van-collapse-item__content) {
      padding: 0 16px 16px;
      color: #172033;
      background: #fff;
      border-top: 1px solid #f3f5f8;
    }

    :deep(.van-collapse-item__wrapper) {
      background: #fff;
    }
  }

  .form-field-group {
    margin: 0;
    background: #fff;
    border-radius: 0;

    &::after {
      display: none;
    }

    & + .form-field-group {
      border-top: 1px solid #eef2f7;
    }

    :deep(.van-cell) {
      padding: 16px 0 15px;
      background: transparent;
    }

    // :deep(.van-field) {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: stretch;
    // }

    :deep(.van-cell::after) {
      display: none;
    }

    :deep(.van-field__label) {
    //   display: block;
    //   width: 100%;
    //   flex: none;
    //   margin: 0 0 9px;
      color: #66758a;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    // :deep(.van-field__value) {
    //   width: 100%;
    //   min-width: 0;
    //   padding-right: 0;
    // }

    :deep(.van-field__body) {
      min-height: 26px;
      align-items: flex-start;
      width: 100%;
    }

    :deep(.van-field__control) {
      // display: block;
      // width: 100%;
      color: #172033;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0;
    }

    :deep(.van-field__control:disabled) {
      color: #172033;
      opacity: 1;
      -webkit-text-fill-color: #172033;
    }

    :deep(.van-field__control::placeholder) {
      color: #a7b0bf;
      font-weight: 500;
      -webkit-text-fill-color: #a7b0bf;
    }

    :deep(.van-field__right-icon) {
      color: #8a99ad;
      font-size: 18px;
      padding-left: 8px;
    }

    :deep(.van-field__word-limit) {
      margin-top: 7px;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      text-align: right;
    }

    :deep(.van-field__error-message) {
      margin-top: 6px;
      font-size: 12px;
      line-height: 1.3;
    }
  }

  .form-field-cell {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 0 15px;

    :deep(.van-cell__title) {
      width: 100%;
      color: #66758a;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.25;
    }

    :deep(.van-cell__label) {
      margin-top: 9px;
      color: #172033;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
    }

    // :deep(.van-cell__value) {
    //   display: none;
    // }

    :deep(.van-stepper) {
      width: 100%;
    }

    :deep(.van-stepper__input) {
      width: 100% !important;
      height: 24px;
      margin: 0;
      color: #172033;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
      text-align: left;
      background: transparent;
    }

    :deep(.van-stepper__input:disabled) {
      color: #172033;
      opacity: 1;
      -webkit-text-fill-color: #172033;
    }
  }

  .checkbox-field {
    // :deep(.van-cell__value) {
    //   display: none;
    // }

    :deep(.van-checkbox__label) {
      color: #172033;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.4;
    }
  }

  .sub-table-content {
    padding: 12px 0 0;
    animation: content-fade 0.24s ease-out;
    .file-list-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: auto;
      padding: 20px;
      margin: 10px;
      background-color: rgb(243, 244, 246);
      border: 1px solid #d9d9d9;
      border-radius: 5px;
      .file-name-wrapper {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;
        background-color: #26a2a2;
        margin-right: 15px;
        border-radius: 3px;
      }
      >div {
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
  }

  .form_card {
    margin: 12px;
    border: 1px solid #eef2f7;
    padding: 14px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(31, 45, 68, 0.04);

    :deep(.van-cell) {
      padding: 8px 0;
      background: transparent;
    }

    :deep(.van-cell::after) {
      display: none;
    }

    :deep(.van-field__label) {
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
    }

    :deep(.van-field__control) {
      color: #172033;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.45;
    }
  }

  .more-action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
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

  :deep(.van-action-bar) {
    gap: 12px;
    height: auto;
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    background: #fff;
    border-top: 1px solid #e5e7eb;
    box-shadow: 0 -4px 10px rgba(31, 45, 68, 0.04);
  }

  :deep(.van-action-bar-button) {
    height: 44px;
    margin: 0;
    color: #374151;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
  }
}

@keyframes content-fade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
