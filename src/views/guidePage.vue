    
<template>
  <!-- 任务总览引导页 -->
  <div id="guide">
    <el-container>
      <el-header v-if="false" style="background-color: rgb(197, 4, 34); height: 64px">
        <el-button class="header_button" type="text" @click="changePage(1)">
          项目管理系统功能引导
        </el-button>
      </el-header>
      <el-container>
        <el-aside type="half" class="left_aside">
          <left-menu :menuList="menu.menuList" @update:menuList="changePage"></left-menu>
        </el-aside>
        <el-main>
          <el-card shadow="always">
            <div class="status_name">{{ title }}</div>
            <!-- 项目总览 -->
            <div class="explanation" v-if="showContent === 1">
              <div class="explanation_title">项目信息</div>
              <div class="explanation_value">项目名称：DLS系统项目</div>
              <div class="explanation_value">状态：进行中</div>
              <div class="explanation_value">开始日期：2025-01-01</div>
              <div class="explanation_value">结束日期：2025-12-31</div>
              <div class="explanation_value">预算：5,000,000 元</div>
              <div class="explanation_value">团队规模：12 人</div>
              <div class="explanation_value">整体进度：15%</div>
            </div>
            <!-- 项目时间线 -->
            <div class="task_status" v-if="showContent === 1">
              <div class="base_title">项目时间线</div>
              <div
                ref="projectTimeline"
                style="width: 37.5rem; height: 300px; margin: 0px auto"
              ></div>
            </div>
            <!-- 任务状态分布 -->
            <div class="task_status" v-if="showContent === 1">
              <div class="base_title">任务状态分布</div>
              <div
                ref="allTask"
                style="width: 25rem; height: 400px; margin: 0px auto"
              ></div>
            </div>
            <!-- 阶段进展汇总 -->
            <div class="key_milestone" v-if="showContent === 1">
              <div class="base_title">阶段进展汇总</div>
              <el-table
                :data="page1.stageProgressList"
                border
                :header-cell-style="{
                  backgroundColor: 'rgba(229, 231, 235)',
                  color: '#303133',
                  fontSize: '16px',
                }"
                style="width: 100%"
              >
                <el-table-column prop="stage" label="阶段" width="200">
                </el-table-column>
                <el-table-column label="状态">
                  <template #default="scope">
                    <div v-if="scope.row.status === 1">已完成</div>
                    <div v-else-if="scope.row.status === 2">进行中</div>
                    <div v-else>未开始</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="percentage"
                  label="任务完成率"
                  width="200"
                >
                </el-table-column>
                <el-table-column label="对应交付物">
                  <template #default="scope">
                    {{ scope.row.accomplish }}/{{ scope.row.all }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 阶段说明 -->
            <div class="explanation" v-if="showContent !== 1">
              <div class="explanation_title">阶段说明</div>
              <div class="explanation_value">
                {{ stageDescription || "暂无说明！" }}
              </div>
              <div class="explanation_hint">
                提示：此阶段已完成，可进入下一阶段。
              </div>
              <div v-if="showContent === 2" class="explanation_time">
                时间范围：2025-01-01 至 2025-02-15
              </div>
              <!-- <div class="explanation_status">已完成</div> -->
              <div v-if="stageStatus === '已完成'" class="explanation_status status_ed">
                已完成
              </div>
              <div v-else-if="stageStatus === '进行中'" class="explanation_status status_ing">
                进行中
              </div>
              <div v-else class="explanation_status status_un">未开始</div>
            </div>
            <!-- 关键里程碑 -->
            <div class="key_milestone" v-if="showContent === 2 && false">
              <div class="base_title">关键里程碑</div>
              <div
                class="key_milestone_block"
                v-for="(item, index) in page1.milestoneList"
                :key="index"
              >
                <div class="key_milestone_text">
                  <div>{{ item.name }}</div>
                  <div>{{ item.date }}</div>
                </div>
                <div v-if="item.status === 1" class="base_status">已完成</div>
                <div
                  v-else-if="item.status === 2"
                  class="base_status status_ing"
                >
                  进行中
                </div>
                <div v-else class="base_status status_un">未完成</div>
              </div>
            </div>
            <!-- 资源分配 -->
            <div class="resource_allocation" v-if="showContent === 2 && false">
              <div class="base_title">资源分配</div>
              <div
                class="personnel"
                v-for="(item, index) in page1.personnelList"
                :key="index"
              >
                {{ item.name }}({{ item.post }})
              </div>
            </div>
            <!-- 风险概况 -->
            <div class="key_milestone" v-if="showContent === 2 && false">
              <div class="base_title">风险概况</div>
              <div class="key_milestone_block">
                <div class="race_condition">投标竞争激烈</div>
                <div class="contend_text">状态：已缓解</div>
                <div class="contend_text">缓解措施：优化投标策略</div>
              </div>
            </div>
            <!-- 任务状态 -->
            <div class="task_status" v-if="showContent === 2 && false">
              <div class="base_title">任务状态</div>
              <div
                ref="taskStatus"
                style="width: 25rem; height: 200px; margin: 0px auto"
              ></div>
            </div>
            <!-- 功能点与交付物 -->
            <div class="key_milestone" v-if="showContent === 3">
              <div class="base_title">功能点与交付物</div>
              <el-table
                :data="table.tableData"
                border
                :header-cell-style="{
                  backgroundColor: 'rgba(243, 244, 246)',
                  color: '#303133',
                  fontSize: '16px',
                }"
                style="width: 100%"
              >
                <el-table-column label="功能点">
                  <template #default="scope">
                    <div class="jump_link" @click="goLink(scope.row)">
                      <div>{{ scope.row.CRRC_PFG_GNMC }}</div>
                      <div>{{ scope.row.CRRC_PFG_GNSM }}</div>
                      <div v-if="scope.row.GNDZT === '已完成'" class="base_status status_ed">
                        已完成
                      </div>
                      <div v-else-if="scope.row.GNDZT === '进行中'" class="base_status status_ing">
                        进行中
                      </div>
                      <div v-else class="base_status status_un">未开始</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="对应交付物">
                  <template #default="scope">
                    <div>{{ scope.row.CRRC_PFG_JFW }}</div>
                    <div>{{ scope.row.CRRC_PFG_JFWSM }}</div>
                    <!-- <div
                      v-for="(item, index) in scope.row.deliverableList"
                      :key="index"
                    >
                      {{ item }}
                    </div> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
          <!-- <router-view/> -->
        </el-main>
        <el-aside type="half" class="right_aside">
          <right-chart ref="rightChartChild" :taskList="table.taskList"></right-chart>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue';
import * as echarts from "echarts";
import LeftMenu from "../components/LeftMenu.vue";
import axios from "../assets/axios/index.js";
import RightChart from "../components/RightChart.vue";

const showContent = ref(2)
const title = ref("")
const stageStatus = ref("")
const stageDescription = ref("前期阶段主要包括投标管理和投标结果处理，为项目启动奠定基础。")
const projectTimeline = ref(null)
const allTask = ref(null)
const taskStatus = ref(null)
const rightChartDom = useTemplateRef('rightChartChild')
let projectTimelineChart = null
let allTaskChart = null
let taskStatusChart = null
const menu = reactive({
  menuList: [
    {
      name: "前期阶段",
      status: "Active",
      nextList: [
        {
          name: "投标管理",
          status: "Active",
        },
        {
          name: "投标结果处理",
          status: "Active",
        },
        {
          name: "风险管理",
          status: "Active",
        },
      ],
    },
    {
      name: "启动阶段",
      status: "Active",
      nextList: [
        {
          name: "组建项目组",
          status: "Active",
        },
        {
          name: "启动会议",
          status: "Active",
        },
        {
          name: "沟通管理",
          status: "Active",
        },
      ],
    },
    {
      name: "执行阶段",
      status: "Active",
      nextList: [
        {
          name: "项目实施",
          status: "Active",
        },
        {
          name: "进度监控",
          status: "Active",
        },
        {
          name: "质量管理",
          status: "Active",
        },
      ],
    },
    {
      name: "收尾阶段",
      status: "Active",
      nextList: [
        {
          name: "项目验收",
          status: "Active",
        },
        {
          name: "项目总结",
          status: "Active",
        },
        {
          name: "后评价",
          status: "Active",
        },
      ],
    },
  ]
})
const table = reactive({
  tableData: [
    {
      name: "投标项目组成立",
      title: "组建投标项目团队，明确职责分工。",
      status: 1,
      deliverableList: ["项目组名单: 暂无描述", "职责分工表: 暂无描述"],
    },
    {
      name: "投标文件分析",
      title: "分析招标文件，确定投标策略。",
      status: 2,
      deliverableList: ["投标策略报告: 暂无描述"],
    },
    {
      name: "投标文件评审",
      title: "评审投标文件，确保质量。",
      status: 3,
      deliverableList: ["评审记录: 暂无描述"],
    },
  ],
  taskList: [
    {
      status: 1,
      value: "2",
      percentage: "25.0%",
    },
    {
      status: 2,
      value: "2",
      percentage: "37.5%",
    },
    {
      status: 3,
      value: "3",
      percentage: "37.5%",
    },
    {
      value: "8",
      percentage: "100%",
    },
  ],
})
const page1 = reactive({
  // 里程碑列表
  milestoneList: [
    {
      name: "投标文件提交",
      date: "2025-01-20",
      status: 1,
    },
    {
      name: "中标确认",
      date: "2025-02-10",
      status: 2,
    },
    {
      name: "中标确认",
      date: "2025-02-10",
      status: 3,
    },
  ],
  // 资源分配列表
  personnelList: [
    {
      name: "张伟",
      post: "项目经理",
    },
    {
      name: "李娜",
      post: "商务专员",
    },
    {
      name: "王强",
      post: "技术顾问",
    },
  ],
  stageProgressList: [
    {
      stage: "前期阶段",
      status: 1,
      percentage: "100.0%",
      accomplish: 4,
      all: 4,
    },
    {
      stage: "启动阶段",
      status: 2,
      percentage: "100.0%",
      accomplish: 5,
      all: 5,
    },
    {
      stage: "执行阶段",
      status: 3,
      percentage: "100.0%",
      accomplish: 4,
      all: 4,
    },
    {
      stage: "收尾阶段",
      status: 3,
      percentage: "100.0%",
      accomplish: 4,
      all: 4,
    },
  ],
})
onMounted(() => {
  getMenuList()
  // initTaskChart();
})
onUnmounted(() => {
  // 组件销毁时移除监听并销毁图表
  window.removeEventListener("resize", this.resizeHandler);
})
// 获取左侧菜单列表
function getMenuList() {
  axios.getMenuList()
  .then(res => {
    const menuArr = [];
    // this.menuData.data.forEach(el => {
    res.data.data.forEach((el) => {
      if (menuArr.find((_el) => _el.id === el.ID)) {
        menuArr
          .find((_el) => _el.id === el.ID)
          .nextList.push({
            id: el.ID,
            twoid: el.TWOID,
            name: el.CRRC_PFG_MKMC,
            status: el.TWOSTU,
          });
      } else {
        const obj = {
          id: el.ID,
          name: el.CRRC_PFG_JDMC,
          status: el.ONESTU,
          nextList: [
            {
              id: el.ID,
              twoid: el.TWOID,
              name: el.CRRC_PFG_MKMC,
              status: el.TWOSTU,
            },
          ],
        };
        menuArr.push(obj);
      }
    });
    menu.menuList = menuArr
    title.value = menu.menuList[0].name;
    stageStatus.value = menu.menuList[0].status
  })
}

async function getPageData(val) {
  const res = await axios.getPageData(val)
  table.tableData = [ ...res.data.data.list ]
  let statistics = res.data.data.statistics
  table.taskList[0].value = statistics.ywcsl
  table.taskList[0].percentage = statistics.ywcbfb
  table.taskList[1].value = statistics.jxzsl
  table.taskList[1].percentage = statistics.jxzbfb
  table.taskList[2].value = statistics.wkssl
  table.taskList[2].percentage = statistics.wksbfb
  table.taskList[3].value = statistics.ywcsl + statistics.jxzsl + statistics.wkssl
  table.taskList[3].percentage = table.taskList[3].value === 0 ? '0%' : '100%'
  stageDescription.value = table.tableData.length > 0 ? table.tableData[0].CRRC_PFG_JDSM || "" : ""
  nextTick(() => {
    rightChartDom.value.initChart();
  });
}

function goLink(row) {
  console.log(row, "row");
  // console.log(window.location)
  // console.log(window.parent.location.href)
  // params.get('id')
  var regex = new RegExp('[?]__uref(=([^&#]*)|&|#|$)'),
  results = regex.exec(window.parent.location.href);
  if (!results) return null;
  if (!results[2]) return '';
  const id = decodeURIComponent(results[2].replace(/\+/g, ' '))
  // const query = window.location.href;
  // console.log(query)
  // window.open(`https://dls.4dlp.com.cn:7102/bp/mod/bp/log?model=${row.CRRC_PFG_ID}&uuu_dataPickerDe=&src_model=&bulk=&logtype=bplog&consolidate=&restr_status=&datapickerDe=&configBpLogType=&__uref=${id}&admin_updates=&isPlanningSheet=0&activePlanningSheetId=0&isPortfolio=false`,
  // '_blank', `width=1200,height=800,top=${(window.innerHeight-800)/2},left=${(window.innerWidth-1200)/2}`)
  window.location.href = `https://dls.4dlp.com.cn:7102/bp/mod/bp/log?model=${row.CRRC_PFG_ID}&uuu_dataPickerDe=&src_model=&bulk=&logtype=bplog&consolidate=&restr_status=&datapickerDe=&configBpLogType=&__uref=${id}&admin_updates=&isPlanningSheet=0&activePlanningSheetId=0&isPortfolio=false`
}

function initProjectChart() {
  // 1. 初始化图表
  projectTimelineChart = echarts.init(projectTimeline.value);
  // 2. 设置配置项
  const option = {
    grid: {
      show: true,
      top: 30, // 上边距（给标题留空间）
      right: 10,
      bottom: 50,
      left: 60, // 左边距（给Y轴标签留空间）
    },
    graphic: [
      {
        type: "text",
        left: "center",
        bottom: 10,
        style: {
          text: "持续时间（天）",
          fill: "#666",
          fontSize: 12,
        },
      },
    ],
    title: {
      text: "项目阶段时间线",
      left: "center",
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {},
    xAxis: [
      {
        type: "value",
      },
    ],
    yAxis: [
      {
        type: "category",
        data: ["收尾阶段", "执行阶段", "启动阶段", "前期阶段"],
      },
    ],
    series: [
      {
        // name: "任务数量",
        type: "bar",
        data: [
          { value: 60, itemStyle: { color: "#e74c3c" } },
          { value: 213, itemStyle: { color: "#2ecc71" } },
          { value: 43, itemStyle: { color: "#f39c12" } },
          { value: 45, itemStyle: { color: "#3498db" } },
        ],
      },
    ],
  };
  // 3. 渲染图表
  projectTimelineChart.setOption(option);

  projectTimelineChart.resize()
  // 窗口变化时自适应
  window.addEventListener('resize', projectTimelineChartResize);
}
function projectTimelineChartResize() {
  nextTick()
  .then(() => {
    projectTimelineChart.resize()
  })
}

function initAllTaskChart() {
  const data = JSON.parse(JSON.stringify(table.taskList))
  const obj = data.find(el => el.status === 1)
  obj.name = '已完成'
  obj.itemStyle = { color: '#2ecc71' }
  const obj2 = data.find(el => el.status === 2)
  obj2.name = '进行中'
  obj2.itemStyle = { color: '#f39c12' }
  const obj3 = data.find(el => el.status === 3)
  obj3.name = '未开始'
  obj3.itemStyle = { color: '#bbb' }
  data.pop()
  // 2. 初始化图表
  allTaskChart = echarts.init(allTask.value);
  // 3. 设置配置项
  const option = {
    grid: {
      top: 30, // 上边距（给标题留空间）
      right: 10,
      bottom: 50,
      left: 60, // 左边距（给Y轴标签留空间）
    },
    title: {
      text: "整体任务状态",
      x: "center",
    },
    tooltip: {},
    legend: {
      orient: "horizontal",
      icon: "rect",
      x: "center",
      itemGap: 10,
      itemWidth: 42,
      bottom: "0",
      data: ["已完成", "进行中", "未开始"],
    },
    series: [
      {
        type: "pie",
        label: {
          // 必须配置
          show: false, // 确保开启显示
        },
        radius: "80%",
        center: ["50%", "50%"],
        data,
      },
    ],
  };
  // 4. 渲染图表
  allTaskChart.setOption(option);

  allTaskChart.resize()
  // 窗口变化时自适应
  window.addEventListener('resize', allTaskChartResize);
}
function allTaskChartResize() {
  nextTick()
  .then(() => {
    allTaskChart.resize()
  })
}

function initTaskChart() {
  // 1. 初始化图表
  taskStatusChart = echarts.init(taskStatus.value);
  // 2. 设置配置项
  const option = {
    grid: {
      top: 20, // 上边距（给标题留空间）
      right: 10,
      bottom: 40,
      left: 50, // 左边距（给Y轴标签留空间）
    },
    title: {
      text: "阶段任务状态",
      left: "center",
      textStyle: {
        fontSize: 14,
      },
    },
    responsive: true,
    tooltip: {},
    xAxis: [
      {
        type: "value",
        max: function (value) {
          return value.max * 1; // 比最大值多10%的空间
        },
      },
    ],
    yAxis: [
      {
        type: "category",
        data: ["未完成", "进行中", "已完成"],
      },
    ],
    series: [
      {
        name: "任务数量",
        type: "bar",
        data: [
          { value: 2, itemStyle: { color: "#bbb" } },
          { value: 55, itemStyle: { color: "#f39c12" } },
          { value: 3, itemStyle: { color: "#2ecc71" } },
        ],
      },
    ],
  };
  // 3. 渲染图表
  taskStatusChart.setOption(option);
  taskStatusChart.resize()
  // 窗口变化时自适应
  window.addEventListener('resize', taskStatusChartResize);
}
function taskStatusChartResize() {
  nextTick()
  .then(() => {
    taskStatusChart.resize()
  })
}

function changePage(val) {
  if (projectTimelineChart) {
    window.removeEventListener('resize', projectTimelineChartResize);
    projectTimelineChart.dispose();
    projectTimelineChart = null;
  }
  if (allTaskChart) {
    window.removeEventListener('resize', allTaskChartResize);
    allTaskChart.dispose();
    allTaskChart = null;
  }
  if (taskStatusChart) {
    window.removeEventListener('resize', taskStatusChartResize);
    taskStatusChart.dispose();
    taskStatusChart = null;
  }
  if (val === 1) {
    getPageData({})
    .then(() => {
      showContent.value = val;
      title.value = "项目总览";
      nextTick(() => {
        initProjectChart();
        initAllTaskChart();
      });
    })
  } else if (val.nextList) {
    getPageData(val)
    stageStatus.value = val.status
    showContent.value = 2;
    title.value = val.name;
    // nextTick(() => {
    //   initTaskChart();
    // });
  } else {
    getPageData(val)
    stageStatus.value = val.status
    showContent.value = 3;
    title.value = val.name;
  }
}
</script>

<style lang="scss">
#guide {
  height: 100%;
  overflow: hidden;
  .el-button, .el-button.is-round {
      padding: 12px 23px;
      padding-right: 14px;
      height: auto;
  }
}
.jump_link {
  cursor: pointer;
  &:hover {
    color: teal;
  }
}
.el-container {
  // height: calc(100% - 64px);
  height: 100%;
  overflow: hidden;
  .el-header {
    display: flex;
    justify-content: center;
    align-items: center;
    .header_button {
      color: white;
      font-size: 24px;
      font-weight: 700;
    }
    .header_button:focus,
    .header_button:hover {
      color: #66b1ff;
    }
  }
  .left_aside {
    // height: calc(100vh - 64px);
    height: 100vh;
    width: 320px !important;
  }
  .el-container {
    // height: calc(100% - 64px);
    height: 100vh;
  }
  .el-main {
    // background-color: #2c3e50;
    // height: calc(100vh - 64px);
    height: 100vh;
    padding: 0px;
    .el-card {
      margin: 24px;
      .el-card__body {
        padding: 24px;
        .status_name {
          font-weight: 600;
          font-size: 30px;
          line-height: 36px;
          margin-bottom: 24px;
        }
        .explanation {
          margin-bottom: 24px;
          padding: 24px;
          border-radius: 4px;
          border-left: 4px solid rgba(59, 130, 246);
          background-color: rgba(239, 246, 255);
          .explanation_title {
            font-weight: 700;
            font-size: 18px;
            line-height: 28px;
            color: rgba(55, 65, 81);
          }
          .explanation_value {
            color: rgba(75, 85, 99);
          }
          .explanation_hint {
            margin-top: 14px;
            font-style: italic;
            color: rgba(107, 114, 128);
          }
          .explanation_time {
            margin-top: 10px;
            color: rgba(75, 85, 99);
          }
          .explanation_status {
            margin-top: 14px;
            display: inline-block;
            padding: 5px 16px;
            border-radius: 4px;
            // background-color: rgba(16, 185, 129);
            color: white;
          }
        }
        .key_milestone {
          margin-bottom: 24px;
          .key_milestone_block {
            margin-bottom: 16px;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid rgba(229, 231, 235);
            .key_milestone_text {
              margin-bottom: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
        }
        .resource_allocation {
          margin-top: 24px;
          margin-bottom: 24px;
          .personnel {
            display: inline-block;
            border-radius: 4px;
            font-size: 14px;
            line-height: 20px;
            padding: 4px 12px;
            background-color: rgba(229, 231, 235);
            margin-right: 8px;
          }
        }
        .key_milestone {
          .key_milestone_block {
            .race_condition {
              font-weight: 500;
              color: rgba(55, 65, 81);
            }
            .contend_text {
              margin-top: 4px;
              font-size: 14px;
              line-height: 20px;
              color: rgba(75, 85, 99);
            }
          }
        }
      }
    }
  }
  .right_aside {
    height: calc(100vh - 64px);
    width: 640px !important;
  }
}
</style>
