<template>
  <div class="dashboard-container">
    <!-- 顶部行 -->
    <el-row :gutter="16" class="row-top">
      <el-col :span="6" class="block-1">
        <el-card class="card" shadow="never">
          <div class="header-wrapper">
            <div class="user-info">
              <div class="user-text">
                <h3>{{ baseForm.XMJL }}</h3>
                <p>项目经理</p>
              </div>
            </div>
            <div class="change-badge">
              <span class="change-num">{{ baseForm.ZS }}次</span>
              <span class="change-label">计划变更次数</span>
            </div>
          </div>
          <div class="status-bar">
            <div class="status-item">
              <span class="status-dot dot-blue"></span>
              <div class="status-text-group">
                <span class="status-num">{{ baseForm.WKS }}</span>
                <span class="status-label">未开始</span>
              </div>
            </div>
            <div class="status-item">
              <span class="status-dot dot-orange"></span>
              <div class="status-text-group">
                <span class="status-num">{{ baseForm.JXZ }}</span>
                <span class="status-label">进行中</span>
              </div>
            </div>
            <div class="status-item">
              <span class="status-dot dot-green"></span>
              <div class="status-text-group">
                <span class="status-num">{{ baseForm.YWC }}</span>
                <span class="status-label">已完成</span>
              </div>
            </div>
          </div>
          <div class="meta-container">
            <div class="date-row">
              <span class="date-icon">📅</span>
              <span>{{ baseForm.XMJHZQ }}</span>
            </div>
            <div class="sub-label">计划周期</div>
          </div>
          <div class="meta-container" style="margin-bottom: 0;">
            <div class="progress-section">
              <span class="date-icon">⌛</span>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" :style="'width: ' + baseForm.XMJD + '%'"></div>
              </div>
              <span>{{ baseForm.XMJD }}%</span>
            </div>
            <div class="sub-label">计划进度</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="5" class="block-2">
        <el-card class="card" shadow="never" body-style="height: 100%;">
          <div class="section-title" style="margin-bottom: 4px;">财务数据</div>
          <div class="content-list" @click="showFinancialDetail">
            <div class="highlight-text">开票：<span>￥{{ (financialData.KPJE || 0).toLocaleString() }}</span></div>
            <div class="highlight-text">成本：<span>￥{{ (financialData.CBJE || 0).toLocaleString() }}</span></div>
            <div class="highlight-text">库存：<span>￥{{ (financialData.KCJE || 0).toLocaleString() }}</span></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="13" class="block-3">
        <el-card class="card" shadow="never" body-style="height: 100%;">
          <div class="section-title">
            近期任务
            <div style="flex: 1; text-align: end">
              <el-button
                type="success"
                link
                size="large"
                @click="downloadFile"
              >阶段报告下载</el-button>
            </div>
          </div>
          <div class="matrix-chevron-stream" id="dependency-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间行 -->
    <el-row :gutter="16" class="row-middle">
      <el-col :span="6" class="block-left">
        <el-card class="card" shadow="never" style="height: 100%;" body-style="overflow-x: hidden">
          <div class="section-title" style="margin-bottom: 4px;">问题项：<span style="color: #475569;">{{ problemList.length }} 项</span></div>
          <div class="problem-list">
            <div class="problem-item" v-for="(item, index) in problemList" :key="index">{{ item.WTXH }}: {{ item.WTGJC }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" class="block-right">
        <el-card class="card table-wrapper-card" shadow="never" style="height: 100%;" body-style="height: calc(100% - 40px)">
          <div class="section-title">任务报工情况</div>
          <div class="table-container">
            <el-table :data="taskData" border stripe style="width: 100%;" height="100%">
              <el-table-column prop="ZYMC" label="任务名称" min-width="180" />
              <el-table-column prop="ZYFZR" label="任务负责人" min-width="80" />
              <el-table-column prop="JHWC" label="计划完成时间" min-width="80" />
              <el-table-column prop="SJWC" label="实际完成时间" min-width="80" />
              <el-table-column label="作业状态" min-width="80">
                <template #default="{ row }">
                  <el-tag :type="row.ZYZT === '已完成' ? 'success' : 'info'" size="small">
                    {{ row.ZYZT }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="里程碑类型" min-width="80">
                <template #default="{ row }">
                  <el-tag v-if="row.LCBLX" type="primary" size="small">{{ row.LCBLX }}</el-tag>
                  <span v-else style="color: #a6b0bc;">{{ row.LCBLX }}</span>
                </template>
              </el-table-column>
              <el-table-column label="超期天数" min-width="80">
                <template #default="{ row }">
                  <span v-if="row.CQTS > 0" class="text-red">{{ row.CQTS }} 天</span>
                  <span v-else>{{ row.CQTS }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部行 -->
    <el-row :gutter="16" class="row-bottom">
      <el-col :span="24">
        <el-card class="card" shadow="never">
          <div class="section-title">里程碑</div>
          <div class="milestone-container">
            <div class="milestone-track" id="milestone-track-container"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
        v-model="dialogVisible"
        class="visual_dialog"
        v-if="dialogVisible"
        title="库存数据"
        fullscreen>
        <div style="height: 100%; width: 100%">
            <el-input v-model="inputValue" placeholder="请输入物料描述" style="width: 400px; margin-bottom: 20px"></el-input>
            <div class="project_info_block">
                <el-table
                    :data="inputValue ? tableData.filter(item => item.CGWLMS.includes(inputValue)) : tableData"
                    style="width: 100%; max-height: 100%; background-color: unset;"
                    border
                    header-row-class-name="table_title-header-row">
                    <el-table-column align="center" label="序号" type="index" width="100" />
                    <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                        <!-- <template #default="scope">
                            <span v-if="['NDXSSR_MBZ', 'NDXSSR_SJZ'].includes(item.prop)">{{ `${scope.row[item.prop]}万` }}</span>
                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template> -->
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from "../assets/axios/visual.js"
import { ElMessage } from 'element-plus'

// 任务数据
const taskData = ref([])

const problemList = ref([])

const rawMilestones = []

const today = new Date()

// 渲染近期任务（尖角流）
const renderDependency = async () => {
    const container = document.getElementById('dependency-container')
    if (!container) return

    const res = await axios.getTableData(`viewName=CRRC_XMJSC_SZGZRW_ZQ`)
    const dataList = res.data.data.filter(item => item.XMID == projectId) || []

    let html = ''
    dataList.forEach(task => {
        let statusText = ''
        let nodeClass = ''

        if (task.ZYZT === '已完成') {
            statusText = '已完成'
            nodeClass = 'mat-done'
        } else {
            statusText = `剩 ${task.SYTS} 天`
            nodeClass = task.MI === 1 ? 'mat-run' : 'mat-over'
            // nodeClass = task.identity === 'second' ? 'mat-run' : 'mat-over'
            // statusText = `逾期 ${Math.abs(diffDays)} 天`
            // nodeClass = 'mat-delay'
        }

        html += `
            <div class="matrix-node ${nodeClass}">
            <div class="matrix-title">${task.ZYMC}</div>
            <div class="matrix-meta">
                <span class="matrix-dot"></span>
                <span>${task.ZYFZR}</span>
                <span style="font-family: Arial; font-weight: bold; margin-left: auto;">${task.JHWC} · ${statusText}</span>
            </div>
            </div>
        `
    })
    container.innerHTML = html
}

// 渲染里程碑
const renderMilestones = async () => {
    const container = document.getElementById('milestone-track-container')
    if (!container) return

    const res = await axios.getTableData(`viewName=CRRC_XMJSC_LCB`)
    const rawMilestones = res.data.data.filter(item => item.XMID == projectId) || []

    const sorted = [...rawMilestones].sort((a, b) => new Date(a.JHWC) - new Date(b.JHWC))
    const upcomingIndex = sorted.findIndex(ms => new Date(ms.JHWC) > today)

    const mapped = sorted.map((ms, idx) => {
        const isComp = ms.ZYZT == '已完成'
        let statusClass = isComp ? 'completed' : 'uncompleted'
        let statusText = isComp ? '已完成' : '未完成'
        if (idx === upcomingIndex) {
            statusClass += ' upcoming'
            statusText = '进行中'
        }
        if(idx < upcomingIndex && !isComp) {
            statusClass = "delayed"
        }
        return { ...ms, statusClass, statusText }
    })

    let viewStart = Math.max(0, upcomingIndex - 2)
    if(viewStart + 7 > sorted.length) viewStart = sorted.length - 7
    const showMilestones = mapped.slice(viewStart, viewStart + 7)

    // 计算连线高亮
    const total = showMilestones.length
    const relUpcoming = showMilestones.findIndex(ms => ms.statusClass.includes('upcoming'))
    let trackStyle = '#e5e6eb'
    if (relUpcoming !== -1) {
        const seg = 100 / (total - 1)
        const endPct = (relUpcoming === 0) ? (relUpcoming * seg) + 7.5 : (relUpcoming * seg) + ( (3 - relUpcoming) * 2.5)
        trackStyle = `linear-gradient(to right, #52c41a 0%, #52c41a ${endPct}%, #e5e6eb ${endPct}%, #e5e6eb 100%)`
    }

    // 注入样式
    const styleSheet = document.styleSheets[0]
    const ruleIndex = styleSheet.cssRules.length
    styleSheet.insertRule(`.milestone-track::before { background: ${trackStyle} !important; }`, ruleIndex)

    container.innerHTML = showMilestones.map(ms => `
    <div class="ms-item ${ms.statusClass}">
        <div class="ms-title">${ms.ZYMC}</div>
        <div class="ms-dot"></div>
        <div class="ms-status">${ms.statusText}</div>
        <div class="ms-date">${ms.JHWC.replace(/-/g, '/')}</div>
    </div>
    `).join('')
}

const projectId = window.parent._P ? window.parent._P.projectId || '1085' : '1085'
const baseForm = ref({})
const financialData = ref({})
onMounted(() => {
    axios.getTableData(`viewName=CRRC_XMJSC_XMGL`)
    .then(res => {
        baseForm.value = res.data.data.find(item => item.XMID == projectId) || {}
    })
    axios.getTableData(`viewName=CRRC_XMJSC_CWSJ`)
    .then(res => {
        financialData.value = res.data.data.find(item => item.XMID == projectId) || {}
    })
    axios.getTableData(`viewName=CRRC_XMJSC_WTX`)
    .then(res => {
        problemList.value = res.data.data.filter(item => item.XMID == projectId) || []
    })
    axios.getTableData(`viewName=CRRC_XMJSC_RWBGQK`)
    .then(res => {
        taskData.value = res.data.data.filter(item => item.XMID == projectId) || []
    })
    axios.getTableData(`viewName=CRRC_XMJSC_KCJE_ZQ`)
    .then(res => {
        tableData.value = res.data.data.filter(item => item.XMBH == projectId) || []
    })
    renderDependency()
    renderMilestones()
})

const dialogVisible = ref(false)
const tableColumn = [
    {prop: "CGWLBM", label: "物料编码"},
    {prop: "CGWLMS", label: "物料描述"},
    {prop: "CGWLSL", label: "采购物料数量"},
    {prop: "CGDDJEBHS", label: "采购订单金额不含税"},
    {prop: "XSWLSL", label: "销售物料数量"},
    {prop: "XSDDJEBHS", label: "销售订单金额不含税"},
    {prop: "KCSL", label: "库存数量"},
    {prop: "KCJE", label: "库存金额"},
]
const tableData = ref([])
const inputValue = ref('')
							
const showFinancialDetail = () => {
    dialogVisible.value = true
}

const downloadFile = () => {
    let str = `projectId=${projectId}`
    axios.downloadFile(str)
    .then(res => {
        if (res.data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                // 将 Blob 读出的字符串转回 ResultBean 对象
                const result = JSON.parse(reader.result);
                // 使用您 UI 框架的消息提示（例如 Element UI 的 $message）
                ElMessage.error(result.msg || '文件读取失败');
            };
            reader.readAsText(res.data);
            return; // 报错了就直接返回，不执行后面的下载逻辑
        }

        const blob = new Blob([res.data]);

        let fileName = '项目阶段报告.docx';
        
        // const contentDisposition = res.headers['content-disposition'];
        // if (contentDisposition) {
        //     const match = contentDisposition.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"/);
        //     if (match) {
        //         // 优先使用 UTF-8 编码的文件名
        //         fileName = decodeURIComponent(match[1] || match[2]);
        //     } else {
        //         // 如果没有匹配到，尝试直接获取 filename
        //         const simpleMatch = contentDisposition.match(/filename=([^;]+)/);
        //         if (simpleMatch) {
        //             fileName = simpleMatch[1].replace(/^"|"$/g, '');
        //         }
        //     }
        // }
        
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // 释放内存
        }
        ElMessage.success('开始下载...');
    })
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  margin: 0 auto;
  padding: 16px;
  background: #f4f6f9;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}
.row-top {
  flex: 1;
}
.row-middle {
    flex: 3;
    overflow: hidden;
    >div {
        height: 100%;
    }
}
.row-bottom {
  flex: 1;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(230, 235, 241, 0.8);
  box-shadow: 0 4px 16px rgba(142, 153, 175, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.block-1 .card { justify-content: space-between; }
.block-2 .card { justify-content: flex-start; }
.table-wrapper-card .card { padding: 16px; }

/* 顶部卡片内部 */
.header-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.user-text h3 { font-size: 24px; font-weight: 600; color: #1f2d3d; line-height: 1.2; margin: 0; }
.user-text p { color: #7f8c8d; font-size: 18px; margin: 2px 0 0 0; }
.change-badge { display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2; }
.change-num { font-size: 24px; color: #2c3e50; font-family: Arial; font-weight: bold; }
.change-label { font-size: 14px; color: #a6b0bc; }

.status-bar {
  display: flex;
  justify-content: space-between;
  background: #fafbfc;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #f0f2f5;
  margin-bottom: 4px;
}
.status-item { display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-blue { background: #1890ff; }
.dot-orange { background: #fa8c16; }
.dot-green { background: #52c41a; }
.status-text-group { display: flex; flex-direction: column; align-items: center; line-height: 1.1; }
.status-num { font-size: 20px; font-family: Arial; color: #1d2129; font-weight: 600; }
.status-label { font-size: 14px; color: #86909c; }

.meta-container { margin-bottom: 2px; }
.date-row { display: flex; align-items: center; color: #1d2129; font-size: 18px; }
.date-icon { width: 28px; font-size: 20px; text-align: left; display: inline-block; }
.sub-label { font-size: 14px; color: #a6b0bc; padding-left: 24px; }
.progress-section { display: flex; align-items: center; color: #1d2129; font-size: 16px; }
.progress-bar-bg { flex: 1; height: 6px; background: #f2f3f5; border-radius: 6px; margin: 0 6px 0 0; overflow: hidden; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, #1890ff, #36cfc9); }

.content-list { height: calc(100% - 40px); display: flex; flex-direction: column; justify-content: space-evenly; flex: 1; cursor: pointer; }
.highlight-text { display: block; color: #4e5969; font-size: 18px; }
.highlight-text span { font-size: 24px; color: #2c3e50; font-family: Arial; margin-left: 4px; font-weight: bold; }
.highlight-text::before { content: "▪ "; color: #1890ff; margin-right: 4px; }

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.section-title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 12px;
  background: #1890ff;
  border-radius: 2px;
  margin-right: 6px;
}

/* 近期任务尖角流 */
.matrix-chevron-stream {
  display: flex;
  width: 100%;
  height: calc(100% - 24px);
  margin-top: 8px;
  align-items: center;
  background: transparent;
  position: relative;
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.06));
}
:deep(.matrix-node) {
  flex: 1;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 36px;
  padding-right: 24px;
  position: relative;
  clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%, 16px 50%);
  filter: drop-shadow(3px 0px 2px rgba(100, 116, 139, 0.15));
  margin-left: -13px;
  z-index: 2;
}
:deep(.matrix-node:first-child) {
  clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  padding-left: 20px;
  margin-left: 0;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  z-index: 4;
}
:deep(.matrix-node:nth-child(2)) { z-index: 3; }
:deep(.matrix-node:last-child) {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 16px 50%);
  padding-right: 20px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  filter: none;
  z-index: 1;
}
:deep(.matrix-title) { font-size: 18px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:deep(.matrix-meta) { font-size: 16px; margin-top: 6px; display: flex; align-items: center; gap: 6px; color: #64748b; }
:deep(.matrix-dot) { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

:deep(.mat-done) { background: linear-gradient(135deg, #ffffff 0%, #f6ffed 100%); }
:deep(.mat-done .matrix-dot) { background: #52c41a; }
:deep(.mat-done .matrix-title) { color: #135200; }

:deep(.mat-run) { background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%); border: 1px solid #91d5ff; border-right: 0px; border-left: 0px }
:deep(.mat-run .matrix-dot) { background: #1890ff; }
:deep(.mat-run .matrix-title) { color: #0050b3; font-weight: 700; }

:deep(.mat-over) { background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%); }
:deep(.mat-over .matrix-dot) { background: #8c8c8c; }
:deep(.mat-over .matrix-title) { color: #595959; }

:deep(.mat-delay) { background: linear-gradient(135deg, #ffffff 0%, #fff1f0 100%); }
:deep(.mat-delay .matrix-dot) { background: #ff4d4f; }
:deep(.mat-delay .matrix-title) { color: #a8071a; font-weight: 700; }

/* 问题列表 */
.problem-list { border: none; padding: 0; margin-top: 6px; overflow-y: auto; flex: 1; }
.problem-item {
  background-color: #f4f6f9;
  border-left: 4px solid #64748b;
  padding: 8px 10px;
  margin-bottom: 6px;
  font-size: 16px;
  color: #475569;
  border-radius: 4px;
}

/* 表格容器 */
.table-container {
  width: 100%;
  height: calc(100% - 32px);
  flex: 1;
  overflow: hidden;
  margin-top: 6px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
}
:deep(.el-table) { font-size: 18px; }
:deep(.el-table th) { background: #fafbfc; color: #86909c; font-weight: 500; }
:deep(.el-table td) { color: #4e5969; }
.text-red { color: #ff4d4f; font-weight: bold; font-family: Arial; }

/* 里程碑 */
.milestone-container { width: 100%; overflow: hidden; margin-top: auto; margin-bottom: auto; padding-top: 42px; }
.milestone-track {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 10px;
  width: 100%;
}
.milestone-track::before {
  content: '';
  position: absolute;
  top: 38px;
  left: 0%;
  right: 0%;
  height: 2px;
  background: #e5e6eb;
  z-index: 0;
}
:deep(.ms-item) {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
:deep(.ms-item .ms-title) {
  font-size: 16px;
  white-space: nowrap;
  border-radius: 14px;
  height: 26px;
  line-height: 25px;
  padding: 0 10px;
  margin-bottom: 8px;
  background: #fff;
}
:deep(.ms-item .ms-dot) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 6px;
  border: 2px solid #fff;
  position: relative;
  z-index: 2;
}
:deep(.ms-item.completed .ms-title) { border: 1px solid #52c41a; color: #52c41a; background: #f6ffed; }
:deep(.ms-item.completed .ms-dot) { background: #52c41a; box-shadow: 0 0 0 2px #f6ffed; }
:deep(.ms-item.uncompleted .ms-title) { border: 1px solid #c9cdd4; color: #86909c; }
:deep(.ms-item.uncompleted .ms-dot) { background: #c9cdd4; box-shadow: 0 0 0 2px #f2f3f5; }
:deep(.ms-item.delayed .ms-title) { border: 1px solid rgb(254, 240, 240); color: #f56c6c; background: rgb(254, 240, 240); }
:deep(.ms-item.delayed .ms-dot) { background: #f56c6c; box-shadow: 0 0 0 2px #f2f3f5; }


:deep(.ms-item.upcoming .ms-title) { border: 1px solid #1890ff !important; color: #1890ff !important; font-weight: 600 !important; background: #e6f7ff !important; }
:deep(.ms-item.upcoming .ms-dot) { background: #1890ff !important; box-shadow: 0 0 0 3px #e6f7ff !important; }
:deep(.ms-status) { font-size: 16px; color: #645e78; margin-bottom: 2px; }
:deep(.ms-item.completed .ms-status) { color: #52c41a; font-weight: 500; }
:deep(.ms-item.upcoming .ms-status) { color: #1890ff; font-weight: 600; }
:deep(.ms-item.delayed .ms-status) { color: #f56c6c; font-weight: 600; }
:deep(.ms-date) { font-size: 16px; color: #5c626e; font-family: Arial; white-space: nowrap; }


.visual_dialog {
    overflow: hidden;
    background-color: rgb(7, 15, 36);
    .el-dialog__header {
        .el-dialog__title {
            color: white;
        }
    }
    .el-dialog__body {
        height: calc(100% - 36px);
        .fullscreen_project_info, .fullscreen_overdue_task {
            background-image: url("../assets/img/blockBackground.jpg");
            background-size: 100% 98%;
            background-repeat: no-repeat;
            background-position: top;
            z-index: 100;
        }
        // >div >div {
        //     height: 100%!important;
        //     width: 100%!important;
        // }
    }
}
:deep(.table_title-header-row) {
    .el-table__cell {
        color: rgb(12, 31, 75);
        background-color: unset;
        background-color: rgb(59, 222, 245);
        // border: 0px;
        border-color: rgb(59, 222, 245)!important;
        font-size: 16px;
    }
}
</style>