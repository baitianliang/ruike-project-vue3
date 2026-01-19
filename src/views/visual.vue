<template>
    <div id="visual">
        <div class="header">
            总包事业部管理驾驶舱
            <div class="header_time">{{ nowDate }}</div>
        </div>
        <div class="content">
            <!-- 各阶段项目分布 -->
            <div class="project_phase">
                <div class="title">各阶段项目分布</div>
                <project-phase ref="projectPhase" :projectList="projectInfoSearch" @showTaskDetail="showTaskDetail('所属阶段')"></project-phase>
                <button
                    @click="fullscreen('各阶段项目分布')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
            <!-- 项目数量 -->
            <div class="project_num">
                <div class="title">项目数量</div>
                <project-num ref="projectNum" :projectList="projectInfoSearch"></project-num>
                <button
                    @click="fullscreen('项目数量')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
            <!-- 项目信息 -->
            <div class="project_info">
                <div class="title">
                    项目信息
                    <el-select
                        multiple
                        collapse-tags
                        class="title_search"
                        popper-class="title_options"
                        v-model="projectInfoSearch"
                        @change="projectInfoSearchChange">
                        <el-option
                            v-for="item in projectInfoTableData"
                            :key="item.XMMC"
                            :label="item.XMMC"
                            :value="item.XMMC"
                        />
                    </el-select>
                </div>
                <project-info ref="projectInfo" :projectList="projectInfoSearch"></project-info>
                <button
                    @click="fullscreen('项目信息')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
        </div>
        <div class="content">
            <div class="left">
                <!-- 年度销售收入 -->
                <div class="income" style="position: relative;">
                    <div class="title">年度销售收入</div>
                    <income ref="income" :projectList="projectInfoSearch"></income>
                    <button
                        @click="fullscreen('年度销售收入')"
                        class="fullscreen_btn">
                        ⛶ 全屏
                    </button>
                </div>
                <!-- 应收账款总额 -->
                <div class="receivable" style="position: relative;">
                    <div class="title">应收账款总额</div>
                    <receivable ref="receivable" :projectList="projectInfoSearch"></receivable>
                    <button
                        @click="fullscreen('应收账款总额')"
                        class="fullscreen_btn">
                        ⛶ 全屏
                    </button>
                </div>
            </div>
            <!-- 统计 -->
            <div class="statistics">
                <!-- <div class="title">统计</div> -->
                <div>
                    <div class="top"></div>
                    <div>
                        <div>销售收入</div>
                        <div>{{ statisticsData.XSSR }}万元</div>
                    </div>
                </div>
                <div>
                    <div class="center"></div>
                    <div>
                        <div>利润</div>
                        <div>{{ statisticsData.LR }}万元</div>
                    </div>
                </div>
                <div>
                    <div class="bottom"></div>
                    <div>
                        <div>毛利率（%）</div>
                        <div>{{ statisticsData.MLL }}%</div>
                    </div>
                </div>
            </div>
            <!-- 项目风险 -->
            <div class="project_risk">
                <div class="title">
                    项目风险
                </div>
                <project-risk ref="projectRisk" :projectList="projectInfoSearch" @showTaskDetail="showTaskDetail('风险分解结构')"></project-risk>
                <button
                    @click="fullscreen('项目风险')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
            <!-- 质量问题 -->
            <div class="quality_problem">
                <div class="title">
                    质量问题
                </div>
                <quality-problem ref="qualityProblem" :projectList="projectInfoSearch"></quality-problem>
                <button
                    @click="fullscreen('质量问题')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
        </div>
        <div class="content">
            <!-- 进度计划 -->
            <div class="progress_plan">
                <div class="title">
                    进度计划
                </div>
                <progress-plan ref="progressPlan" :projectList="projectInfoSearch"></progress-plan>
                <button
                    @click="fullscreen('进度计划')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
            <!-- 报工情况 -->
            <!-- <div class="project_status">
                <div class="title">
                    报工情况
                </div>
                <project-status ref="projectStatus" :projectList="projectInfoSearch"></project-status>
                <button
                    @click="fullscreen('报工情况')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div> -->
            <!-- 超期任务提醒 -->
            <div class="overdue_task">
                <!-- <div class="title">
                    超期任务提醒
                </div> -->
                 <overdue-task ref="overdueTask" :projectList="projectInfoSearch"></overdue-task>
                <button
                    @click="fullscreen('超期任务提醒')"
                    class="fullscreen_btn">
                    ⛶ 全屏
                </button>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            v-if="dialogVisible"
            :before-close="handleClose"
            :title="title"
            fullscreen>
            <div style="height: 100%; width: 100%">
                <project-phase v-if="title === '各阶段项目分布'" :projectList="projectInfoSearch"></project-phase>
                <project-num v-if="title === '项目数量'" :projectList="projectInfoSearch"></project-num>
                <div v-if="title === '项目信息'" class="fullscreen_project_info">
                    <project-info :projectList="projectInfoSearch"></project-info>
                </div>
                <income v-if="title === '年度销售收入'" :projectList="projectInfoSearch"></income>
                <receivable v-if="title === '应收账款总额'" :projectList="projectInfoSearch"></receivable>
                <project-risk v-if="title === '项目风险'" :projectList="projectInfoSearch"></project-risk>
                <quality-problem v-if="title === '质量问题'" :projectList="projectInfoSearch"></quality-problem>
                <progress-plan v-if="title === '进度计划'" :projectList="projectInfoSearch"></progress-plan>
                <project-status v-if="title === '报工情况'" :projectList="projectInfoSearch"></project-status>
                <div v-if="title === '超期任务提醒'" class="fullscreen_overdue_task">
                    <overdue-task v-if="title === '超期任务提醒'" :projectList="projectInfoSearch"></overdue-task>
                </div>
                <div v-if="title === '所属阶段'">
                    <project-stage></project-stage>
                </div>
                <div v-if="title === '风险分解结构'">
                    <risk-table></risk-table>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { h, nextTick, onMounted, onUnmounted, ref, render } from 'vue'
import axios from "../assets/axios/visual.js"

import ProjectPhase from "../components/visual/ProjectPhase.vue";
import ProjectNum from "../components/visual/ProjectNum.vue";
import ProjectInfo from "../components/visual/ProjectInfo.vue";
import Income from "../components/visual/Income.vue";
import Receivable from "../components/visual/Receivable.vue";
import ProjectRisk from "../components/visual/ProjectRisk.vue";
import QualityProblem from "../components/visual/QualityProblem.vue";
import ProgressPlan from "../components/visual/ProgressPlan.vue";
import ProjectStatus from "../components/visual/ProjectStatus.vue";
import OverdueTask from "../components/visual/OverdueTask.vue";
import ProjectStage from "../components/visual/ProjectStage.vue";
import RiskTable from "../components/visual/RiskTable.vue";

let updateInterval;
const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
let nowDate = ref('');

let projectPhase = ref(null)
let projectNum = ref(null)
let projectInfo = ref(null)
let income = ref(null)
let receivable = ref(null)
let projectRisk = ref(null)
let qualityProblem = ref(null)
let progressPlan = ref(null)
let projectStatus = ref(null)
let overdueTask = ref(null)
let projectInfoSearch = ref([])
const projectInfoSearchChange = (value) => {
    nextTick(() => {
        getStatisticsData()
        projectPhase.value.getData()
        projectNum.value.getData()
        projectInfo.value.getData()
        income.value.getData()
        receivable.value.getData()
        projectRisk.value.getData()
        qualityProblem.value.getData()
        progressPlan.value.getData()
        // projectStatus.value.getData()
        overdueTask.value.getData()
    })
}

let projectInfoTableData = ref([])
onMounted(() => {
    // 首次加载立即更新显示
    updateDisplay();
    getProjectList()
    getStatisticsData()
    // 开始定时更新
    updateInterval = setInterval(updateDisplay, 1000);
})
// 组件销毁时清除定时器
onUnmounted(() => {
    clearInterval(updateInterval);
})
// 更新显示
function updateDisplay() {
    const now = new Date();
    // 获取日期各部分
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 月份从0开始
    const day = now.getDate();
    const weekday = weekdays[now.getDay()];
    // 获取时间各部分并补零
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    nowDate.value = `${year}年${month}月${day}日 ${weekday} ${hours}:${minutes}:${seconds}`;
}

function getProjectList() {
    let str = `viewName=CRRC_JSC_XMMC`
    axios.getFormData(str)
    .then(res => {
        projectInfoTableData.value = res.data.data
    })
}

let statisticsData = ref({})
function getStatisticsData() {
    let str = `viewName=CRRC_JSC_XSSRHLR`
    if(projectInfoSearch.value.length > 0) {
        str += `&projectIds=${projectInfoSearch.value.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        statisticsData.value = res.data.data[0]
    })
}

const showTaskDetail = (val) => {
    fullscreen(val)
}

let dialogVisible = ref(false)
let title = ref('')
// let fullscreenDom = ref(null)

const fullscreen = (val) => {
    dialogVisible.value = true
    nextTick(() => {
        title.value = val
    })
}
const handleClose = () => {
    dialogVisible.value = false
    title.value = ''
}
</script>


<style lang="scss">
#visual {
    height: 100%;
    width: 100%;
    background-color: rgb(7, 15, 36);
    .title_search {
        width: 450px!important;
        margin-left: 10px;
        .el-select__wrapper {
            background-color: unset;
            color: white;
        }
    }
    .header{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgb(59, 222, 245);
        font-size: 32px;
        line-height: 32px;
        letter-spacing: 10px;
        height: 70px;
        width: 100%;
        background-image: url("../assets/img/header.jpg");
        background-repeat: no-repeat;    /* 不重复 */
        background-position: center;    /* 居中 */
        background-size: 100% 100%;         /* 覆盖整个元素 */
        .header_time {
            position: absolute;
            display: flex;
            width: 50%;
            justify-content: center;
            right: -90px;
            top: 42px;
            font-size: 16px;
            color: white;
            letter-spacing: 0px;
        }
    }
    .content {
        display: flex;
        height: calc((100% - 40px) / 3);
        margin-top: -15px;
        background-image: url("../assets/img/background.jpg");
        background-size: 100% 100%;
        overflow: hidden;
        > div {
            position: relative;
            height: calc(100% - 80px);
            margin-top: 20px;
            margin-left: 70px;
            .title {
                height: 25px;
                display: flex;
                align-items: center;
                color: white;
                font-size: 20px;
                // line-height: 18px;
                font-weight: bold;
            }
            .fullscreen_btn {
                font-size: 13px;
                position: absolute;
                top: -3px;
                right: 10px;
                z-index: 100;
                background: rgba(0,0,0,0.7);
                color: white;
                border: 1px solid #666;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
            }
        }
        > div:first-child {
            margin-left: 30px;
        }
        .project_phase {
            width: 25%
        }
        .project_num {
            width: 20%
        }
        .project_info {
            width: calc(55% - 200px);
            height: calc(100% - 40px);
            background-image: url("../assets/img/blockBackground.jpg");
            background-size: 100% 95%;
            background-repeat: no-repeat;
            background-position: bottom;
        }
        .left {
            width: 31%;
            >div {
                height: 55%;
            }
        }
        .statistics {
            width: 12%;
            color: white;
            font-size: 22px;
            >div {
                height: 34%;
                margin-top: 3%;
                background-image: url("../assets/img/blockBackground2.jpg");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                display: flex;
                align-content: center;
                justify-content: space-between;
                >div:first-child {
                    height: 100%;
                    width: 40%;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center;    /* 居中 */
                }
                .top {
                    background-image: url("../assets/img/trumpet.jpg");
                }
                .center {
                    background-image: url("../assets/img/profit.jpg");
                }
                .bottom {
                    background-image: url("../assets/img/trophy.jpg");
                }
                >div:last-child {
                    width: 60%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
            }
        }
        .project_risk {
            width: 22%;
        }
        .quality_problem {
            width: 22%;
        }
        .progress_plan {
            width: 59%;
        }
        .project_status {
            width: 22%;
        }
        .overdue_task {
            width: calc(44% - 210px);
            height: calc(100% - 40px);
            background-image: url("../assets/img/blockBackground.jpg");
            background-size: 100% 95%;
            background-repeat: no-repeat;
            background-position: bottom;
        }
    }
    .content:nth-child(2) {
        margin-top: 0px;
    }
    .el-dialog {
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
            >div >div {
                height: 100%!important;
                width: 100%!important;
            }
        }
    }
}
</style>