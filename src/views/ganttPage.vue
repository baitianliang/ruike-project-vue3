<template>
<!-- <div style="height: 100%;"> -->
<div v-loading="loading" style="height: 100%;">
    <div style="height: 40px; margin: 0px 20px; display: flex; justify-content: space-between; align-items: center">
        <div>
            <el-button title="撤销" @click="undo"><el-icon><RefreshLeft /></el-icon></el-button>
            <el-button title="恢复" @click="redo"><el-icon><RefreshRight /></el-icon></el-button>
            <el-button title="折叠" @click="close"><el-icon><Folder /></el-icon></el-button>
            <el-button title="展开" @click="open"><el-icon><FolderOpened /></el-icon></el-button>
            <el-button title="关键路径" @click="updateCriticalPath"><el-icon><Key /></el-icon></el-button>
            <el-select v-model="zoomValue" @change="changeZoom" style="width: 70px; margin-left: 12px">
                <el-option
                    v-for="(item, index) in zoomConfig.levels"
                    :key="index"
                    :label="item.label"
                    :value="item.name"
                />
            </el-select>
            <el-button :disabled="readonly" style="margin-left: 12px" @click="showCalendar">项目日历</el-button>
            <el-button title="甘特图" @click="toggleChart"><el-icon><CreditCard /></el-icon></el-button>
            <!-- <el-button @click="zoomIn">减小范围</el-button>
            <el-button @click="zoomOut">增大范围</el-button>
            <el-button @click="updateCriticalPath">{{ criticalPathText }}</el-button> -->
            <el-dropdown style="margin: 0px 12px" @command="exportTo">
                <el-button>
                    导出<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="PDF">导出到PDF</el-dropdown-item>
                    <el-dropdown-item command="Excel">导出到Excel</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
            <!-- <el-button @click="exportToPDF">导出到PDF</el-button>
            <el-button @click="exportToExcel">导出到Excel</el-button> -->
            <input :disabled="readonly" type="file" id="file-upload" accept=".xls,.mpp,.xlsx,.xml,.xer,text/xml,application/xml,application/xer" />
            <!-- <el-button @click="importFrom">渲染文件</el-button> -->
            <el-dropdown :disabled="readonly" style="margin: 0px 12px" @command="importFrom">
                <el-button>
                    导入数据<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="Project">导入Project</el-dropdown-item>
                    <el-dropdown-item command="P6">导入P6</el-dropdown-item>
                    <el-dropdown-item command="Excel">导入EXCEL</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-button :disabled="readonly" type="primary" @click="saveTask">保存数据</el-button>
    </div>
    <div style="height: calc(100% - 60px); margin: 20px; margin-top: 0px" ref="gantt"></div>
    <!-- <div style="height: calc(100% - 160px); margin: 20px; margin-bottom: 0px" ref="gantt"></div>
    <el-card shadow="never" style="height: 100px; margin: 20px;">
        <div style="height: 60px; display: flex; justify-content: space-between; align-items: center">
            <div>
                <el-button @click="undo">撤销</el-button>
                <el-button @click="redo">恢复撤销</el-button>
                <el-button @click="zoomIn">减小范围</el-button>
                <el-button @click="zoomOut">增大范围</el-button>
                <el-button @click="updateCriticalPath">{{ criticalPathText }}</el-button>
                <el-button @click="exportToPDF">导出到PDF</el-button>
                <el-button @click="exportToPNG">导出到PNG</el-button>
            </div>
            <el-button type="primary" @click="saveTask">保存数据</el-button>
        </div>
    </el-card> -->
    <el-dialog
        v-model="dialogVisible"
        title="日历管理"
        width="1500"
        :close-on-click-modal="false">
        <el-card shadow="never">
            <div class="gantt-calendar">
                <div class="gantt-calendar-left">
                    <div class="gantt-calendar-left-header">
                        <el-icon><Calendar /></el-icon>
                        <div>日历管理</div>
                        <el-button @click="showAddCalendar">添加项目日历</el-button>
                    </div>
                    <div class="gantt-calendar-left-body" v-for="(item, name, index) of calendarData" :key="index">
                        <div class="gantt-calendar-left-body-title" v-if="name === 'allCalendar'"><el-icon><Tools /></el-icon>全局日历</div>
                        <div class="gantt-calendar-left-body-title" v-if="name === 'projectCalendar' && item.length"><el-icon><Folder /></el-icon>项目日历</div>
                        <div @click="showCalendarDetail(_item)" class="gantt-calendar-left-body-item" :class="_item.id === calendarDetail.id ? 'active' : ''" v-for="(_item, index) in item" :key="index">
                            <div class="gantt-calendar-left-body-item-top">
                                <div>{{ _item.name }}</div>
                                <div v-if="_item.id === calendarId" class="gantt-calendar-left-body-item-top-buttons selected">
                                    <div v-if="name === 'allCalendar'"><el-icon><Tools /></el-icon>使用中</div>
                                    <div v-if="name === 'projectCalendar'"><el-icon><Folder /></el-icon>使用中</div>
                                </div>
                                <div v-else class="gantt-calendar-left-body-item-top-buttons" :class="name === 'projectCalendar' ? 'projectCalendar-buttons' : ''">
                                    <div v-if="name === 'allCalendar'"><el-icon><Tools /></el-icon>全局</div>
                                    <div v-if="name === 'projectCalendar'"><el-icon><Folder /></el-icon>项目</div>
                                    <el-button @click="selectCalendar(_item)">使用</el-button>
                                    <el-button @click.stop="deleteCalendar(_item)" v-if="name === 'projectCalendar'" type="danger" :icon="Delete" link></el-button>
                                </div>
                            </div>
                            <div class="gantt-calendar-left-body-item-bottom">
                                <el-tag :type="_item.workWeek === 'seven' ? 'success' : 'info'">日</el-tag>
                                <el-tag type="success">一</el-tag>
                                <el-tag type="success">二</el-tag>
                                <el-tag type="success">三</el-tag>
                                <el-tag type="success">四</el-tag>
                                <el-tag type="success">五</el-tag>
                                <el-tag :type="_item.workWeek === 'seven' ? 'success' : 'info'">六</el-tag>
                            </div>
                            <div class="gantt-calendar-left-body-item-special" v-if="name === 'projectCalendar' && _item.calendarList.length">特殊日期：{{ _item.calendarList.length }}个</div>
                        </div>
                    </div>
                </div>
                <div class="gantt-calendar-right">
                    <div class="gantt-calendar-right-header">
                        <div>
                            <el-icon v-if="calendarDetail.calendarList"><Folder /></el-icon>
                            <el-icon v-else><Tools /></el-icon>
                            <div>
                                <div>{{ calendarDetail.name }}</div>
                                <div v-if="calendarDetail.calendarList">项目日历（可编辑）</div>
                                <div v-else>全局日历（不可编辑）</div>
                            </div>
                        </div>
                        <div>
                            <el-button @click="selectCalendar(calendarDetail)">设为项目日历</el-button>
                            <el-button v-if="calendarDetail.calendarList" type="primary" @click="editCalendar"><el-icon><FolderChecked /></el-icon>保存</el-button>
                        </div>
                    </div>
                    <el-calendar
                        ref="calendar">
                        <template #header="{ date }">
                            <el-button link @click="selectDate('prev-month')"><el-icon><ArrowLeft /></el-icon></el-button>
                            <span>{{ date }}</span>
                            <el-button link @click="selectDate('next-month')"><el-icon><ArrowRight /></el-icon></el-button>
                        </template>
                        <template #date-cell="{ data }">
                            <div @click="chooseDate(calendarDetail, data.day)" :class="['calendar-day', isWeekend(calendarDetail, data.day) ? 'weekend' : '']">
                                {{ Number(data.day.split('-').slice(2).join('-')) }}
                            </div>
                        </template>
                    </el-calendar>
                    <div class="gantt-calendar-right-footer">
                        <div class="gantt-calendar-right-footer-title">图例说明:</div>
                        <div class="gantt-calendar-right-footer-item">
                            <el-tag type="success"></el-tag>
                            <div>工作日</div>
                            <el-tag type="info"></el-tag>
                            <div>休息日</div>
                        </div>
                        <div>点击日期在 工作日→休息日→常规状态 之间切换</div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-dialog
            v-model="innerVisible"
            width="500"
            title="添加项目日历"
            :close-on-click-modal="false"
            append-to-body
            top="40vh">
            <div style="width: 300px; margin: 30px auto;">
                <el-form ref="form" label-position="left" :model="calendarForm" label-width="100px">
                    <el-form-item label="日历名称">
                        <el-input v-model="calendarForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="工作制">
                        <el-select v-model="calendarForm.workWeek">
                            <el-option label="7天工作制" value="seven"></el-option>
                            <el-option label="5天工作制" value="five"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="clearCalendarForm">取消</el-button>
                    <el-button type="primary" @click="addCalendar">添加</el-button>
                </div>
            </template>
        </el-dialog>
    </el-dialog>
</div>
</template>

<script setup>
import { Folder, FolderOpened, RefreshLeft, RefreshRight, Key, CreditCard, ArrowDown, ArrowLeft, ArrowRight, Tools, FolderChecked, Calendar, Delete } from '@element-plus/icons-vue'
import Gantt from "../utils/gantt/dhtmlxgantt.js";
import { fileDragAndDrop } from "../utils/gantt/snippets/dhx_file_dnd.js";
import { h, nextTick, onMounted, onUnmounted, reactive, ref, render, useTemplateRef } from 'vue';
import { ElSelect, ElOption, ElMessage, ElMessageBox } from "element-plus";
import axios from "../assets/axios/GanttPage.js"
import router from '@/router/index.js';
const ganttDom = useTemplateRef('gantt')
const loading = ref(false)
let projectId = ""
let userName = window.top._P ? window.top._P.data?.navbean?.user?.userid : window.opener?.opener?._P?.data?.navbean?.user?.userid || '测试'
// 甘特图数据和线的数据和基线数据
const tasks = reactive({
    data: [
        {id: 1, text: "Office itinerancy", open: true, type: "project", wbsCode: ".1", taskCode: "", taskType: "WBS", taskMilestoneType: "", constraint_type: "", constraint_date: "", taskStatus: "", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "", targetDrtnHrCnt: "", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时1", totalFloatHrCnt: "总浮时1", taskComplete: "20", progress: '0.2'},
        {id: 2, text: "Office facing", start_date: "", wbsCode: ".1", taskCode: "1000", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-22", targetDrtnHrCnt: "20", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时2", totalFloatHrCnt: "总浮时2", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 18, text: "Mediate milestone", wbsCode: ".1", start_date: "29-08-2025 00:00", duration: 0, type: "milestone", parent: "1", progress: 0, open: true, duration: 0},
        {id: 19, text: "Final milestone", wbsCode: ".1", start_date: "29-08-2025 00:00", duration: 0, type: "milestone", parent: "1", progress: 0, open: true, duration: 0}
    ],
    links: [
        {id: "1", source: "3", target: "4", type: "0"},
    ],
    baselines: [
        { id: 1, task_id: 1, start_date: "20-07-2025 00:00:00", duration: 3 },
    ],
})
let zoomValue = ref('day')
// 时间范围配置
const zoomConfig = {
    levels: [
        {
            name:"day",
            label: "日",
            scale_height: 27,
            min_column_width:80,
            scales:[
                {unit: "day", step: 1, format: "%d %M", css: checkHighlight}
            ]
        },
        {
            name:"week",
            label: "周",
            scale_height: 50,
            min_column_width:50,
            scales:[
                {unit: "week", step: 1, format: function (date) {
                    var dateToStr = Gantt.date.date_to_str("%d %M");
                    var endDate = Gantt.date.add(date, 7 - date.getDay(), "day");
                    var weekNum = Gantt.date.date_to_str("%W")(date);
                    return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                }},
                {unit: "day", step: 1, format: "%j %D", css: checkHighlight}
            ]
        },
        {
            name:"month",
            label: "月",
            scale_height: 50,
            min_column_width:120,
            scales:[
                {unit: "month", format: "%F, %Y"},
                {unit: "week", format: "Week #%W"}
            ]
        },
        {
            name:"quarter",
            label: "季",
            height: 50,
            min_column_width:90,
            scales:[
                {unit: "month", step: 1, format: "%M"},
                {
                    unit: "quarter", step: 1, format: function (date) {
                        var dateToStr = Gantt.date.date_to_str("%M");
                        var endDate = Gantt.date.add(date, 2 - date.getMonth() % 3, "month");
                        return dateToStr(date) + " - " + dateToStr(endDate);
                    }
                }
            ]
        },
        {
            name:"year",
            label: "年",
            scale_height: 50,
            min_column_width: 30,
            scales:[
                {unit: "year", step: 1, format: "%Y"}
            ]
        }
    ],
    useKey: "ctrlKey",
    trigger: "wheel",
    element: function () {
        return Gantt.$root.querySelector(".gantt_task");
    }
};
let modal;
let editLinkId;
let readonly = ref(false)

onMounted(() => {
    readonly.value = router.currentRoute.value.path === "/GanttShow"
    projectId = window.top.getCurrentProjectId ? window.top.getCurrentProjectId() : window.opener?.opener?.getCurrentProjectId() || '110'
    getGanttData()
})
onUnmounted(() => {
    // 销毁甘特图
    if (Gantt.$destroy) {
        Gantt.$destroy();
    }
})

async function getGanttData() {
    const option1 = await axios.getOptionsList({projectId, type: 'taskPhase'})
    const option2 = await axios.getOptionsList({projectId, type: 'taskPosition'})
    taskPhaseOptions = [ {key: '', label: ''}, ...option1.data.data ]
    taskPhaseOptions.forEach(el => {
        el.label = el.key
    })
    taskOwnerOptions.value = [ {key: '', CRRC_USER_QM: ''}, ...option2.data.data ]
    taskOwnerOptions.value.forEach(el => {
        el.label = el.CRRC_USER_QM
    })
    const res = await axios.getGanttData(projectId)
    tasks.data = res.data.data.data
    tasks.baselines = res.data.data.baselines
    tasks.links = res.data.data.links
    // tasks.data = []
    // tasks.baselines = []
    // tasks.links = []
    if(tasks.data.length < 1) {
        const nowDate = new Date()
        // const endDate = new Date(nowDate.setDate(nowDate.getDate() + 5));
        tasks.data = [{
            id: 1,
            text: projectName || "新项目",
            pmsWbsCode: projectCode,
            open: true,
            type: "task",
            wbsCode: "",
            taskCode: "0010",
            taskType: "",
            taskMilestoneType: "",
            constraint_type: "",
            constraint_date: "",
            taskStatus: "",
            taskPhase: "",
            taskPosition: "",
            taskOwner: "",
            targetStartDate: `${nowDate.getFullYear()}-${(nowDate.getMonth()+1).toString().padStart(2, '0')}-${nowDate.getDate().toString().padStart(2, '0')}`,
            targetDrtnHrCnt: 5,
            // targetEndDate: endDate,
            actStartDate: "",
            actWorkQty: "",
            remainDrtnHrCnt: "",
            actEndDate: "",
            freeFloatHrCnt: "0",
            totalFloatHrCnt: "0",
            progress: 0,
            taskConstraintDate: null,
            taskConstraintType: null,
        }]
    }
    // projectId = window.location.href.split("=")[1]
    tasks.data.forEach(el => {
        el.open = true
        el.targetStartDate = el.targetStartDate && el.targetStartDate.substring(0, 10) || ""
        // el.targetEndDate = el.targetEndDate.substring(0, 10)
        el.targetEndDate = el.targetStartDate && el.targetDrtnHrCnt && Gantt.calculateEndDate({start_date: new Date(el.targetStartDate), duration: el.targetDrtnHrCnt}) || ""
        // el.start_date = el.targetStartDate && `${el.targetStartDate.substring(8, 10)}-${el.targetStartDate.substring(5, 7)}-${el.targetStartDate.substring(0, 4)} 09:00:00` || el.start_date
        el.start_date = el.targetStartDate && `${el.targetStartDate} 00:00:00` || el.start_date
        el.duration = el.targetDrtnHrCnt || el.duration
        if(el.parent < 1) {
            el.text = projectName
            el.pmsWbsCode = projectCode
        }
    })
    _initGanttEvents()
    setCalendarConfig(res.data.data.calendars[0])
}

function _initGanttEvents() {
    Gantt.plugins({
		quick_info: true,
        critical_path: true,
		auto_scheduling: true,
		undo: true,
        click_drag: true,
        tooltip: true,
        export_api: true
	});
    Gantt.config.auto_scheduling = true;
    // Gantt.config.scale_unit = "day";
    // Gantt.config.date_scale = "%Y年%m月%d日";
    // 动态配置表头
    _inConfigColumnsShow()
    // 初始化自定义提示
    _inCustomTooltips()
    // 初始化基线
    _inBaselines()
    // 修改外观
    // _inClassic()
    Gantt.templates.timeline_cell_class = function (task, date) {
        return checkHighlight(date, task)
    };
    // 初始化导出
    _inExport()
    // 初始化双击线
    _inLinkConfig()
    // 动态数据
    dynamicData()
    // 样式风格
    Gantt.setSkin("material");

    Gantt.config.layout = {
        css: "gantt_container",
        cols: [{
            width: 700,
            min_width: 300,
            rows: [
                { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
                { view: "scrollbar", id: "gridScroll", group: "horizontalScrolls" }
            ]
        },
        { resizer: true, width: 1 },
        {
            rows: [
                { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                { view: "scrollbar", id: "scrollHor", group: "horizontalScrolls" }
            ]
        },
        { view: "scrollbar", id: "scrollVer" }]
    };
    // 鼠标拖动时间轴
    Gantt.config.open_split_tasks = true;
    // Gantt.config.drag_move = false;
    Gantt.locale.labels.section_priority = "Priority";
    Gantt.config.multiselect = true;

	Gantt.attachEvent("onParse", function () {
		Gantt.eachTask(function (task) {
			if (Gantt.hasChild(task.id)) {
				task.type = Gantt.config.types.project;
				Gantt.updateTask(task.id);
			} else if (task.duration === 0) {
				task.type = Gantt.config.types.milestone;
				Gantt.updateTask(task.id);
			}
		});
	});
    // 鼠标拖动新增数据
    // Gantt.config.click_drag = {
    //     callback: onDragEnd,
    //     singleRow: true
    // }
    // Gantt.sort((a,b) => {
    //     if(a.type === "project" && b.type !== "project") {
    //         return -1
    //     } else {
    //         return 0
    //     }
    // })
    if(readonly.value) Gantt.config.readonly = true;
    Gantt.config.order_branch = true;
    // Gantt.config.work_time = false
    // Gantt.config.validate_task = function(task){
    //     // 允许空/无效日期
    //     if(task.start_date === "" || task.end_date === "") return true;
    //     // 其他验证逻辑...
    //     return Gantt.config.validate_task_default(task);
    // };
    // Gantt.editors.date = {
    //     ...Gantt.editors.date,
    //     set_value: function(value, node){
    //         node.querySelector("input").value = value ? 
    //             Gantt.templates.date_grid(value) : "";
    //     },
    //     get_value: function(node){
    //         var value = node.querySelector("input").value;
    //         return value ? Gantt.date.str_to_date(Gantt.config.date_grid)(value) : null;
    //     }
    // };
    Gantt.config.grid_elastic_columns = true;
    // Gantt.locale.labels["complete_button"] = "Complete";
    // 清除删除按钮
    Gantt.attachEvent("onGanttReady", function(){
        Gantt.config.buttons_left = [];
    });
    // 工作日
    Gantt.config.work_time = true;
	Gantt.config.details_on_create = false
    // 动态时间轴
	Gantt.ext.zoom.init(zoomConfig);
	Gantt.ext.zoom.setLevel("day");
    // 配置表格列
    _inConfigColumns()
    Gantt.i18n.setLocale("cn");

	Gantt.message("Upload <b>XER</b> or <b>XML</b> Project file using 'Choose File' button or simply drag-and-drop it into the page");
	if (!window.FormData) {
		Gantt.message({type:"error", text: "Your browsers does not support Ajax File upload, please open this demo in modern browser"});
	}
	Gantt.config.static_background = true;
	Gantt.config.xml_date = "%Y-%m-%d %H:%i";
    // 初始化dom
    Gantt.init(ganttDom.value);
    // 填入数据
    Gantt.parse(tasks)
    // Gantt.sort("type", true)
    Gantt.sort("firstItem", true)
    Gantt.sort("wbsCode", false)

    fileDnD.fileTypeMessage = "Only XER and XML files are supported!";
    fileDnD.dndFileTypeMessage = "Please try XER and XML project file.";
    fileDnD.dndHint = "Drop XER file into Gantt";
    fileDnD.mode = "primaveraP6";
    fileDnD.init(Gantt.$container)
    
    // Gantt.batchUpdate(function () {
    //     Gantt.eachTask(function (task) {
    //         if (Gantt.hasChild(task.id)) {
    //             calculatePlannedDates(task.id)
    //         }
    //     })
    // })
	// fileDnD.onDrop(sendFile);
    loading.value = false
    // nextTick(() => {
        // 删除表头添加按钮
        // document.querySelector(".gantt_grid_head_add").style.display = "none";
    // })
}

function calculatePlannedDates(parentId) {
    const parent = Gantt.getTask(parentId); 
    // parent.targetStartDate = null;
    // parent.targetEndDate = null;
    if(parent) {
        Gantt.eachTask(function (child) {
            // iterate only direct children
            if (child.parent != parentId) {
                return
            }
            parent.targetStartDate = parent.targetStartDate || child.targetStartDate;
            parent.targetEndDate = parent.targetEndDate || child.targetEndDate;
    
            parent.targetStartDate = new Date(parent.targetStartDate).getTime() > new Date(child.targetStartDate).getTime() ? child.targetStartDate : parent.targetStartDate
            parent.targetEndDate = new Date(parent.targetEndDate).getTime() < new Date(child.targetEndDate).getTime() ? child.targetEndDate : parent.targetEndDate

            // parent.targetStartDate = Math.min(parent.targetStartDate, child.targetStartDate)
            // parent.targetEndDate = Math.max(parent.targetEndDate, child.targetEndDate)
        }, parentId);
        parent.targetDrtnHrCnt = (new Date(parent.targetEndDate).getTime() - new Date(parent.targetStartDate).getTime()) / (24 * 60 * 60 * 1000)
        Gantt.updateTask(parentId)
    }
}
// 动态配置表头
function _inConfigColumnsShow() {
	let contextMenu = new dhx.ContextMenu(null, { css: "dhx_widget--bg_gray" });
	Gantt.attachEvent("onContextMenu", function (taskId, linkId, event) {
		const target = (event.target || event.srcElement);
		const columnName = target.getAttribute("data-column-id");
		contextMenu.data.removeAll()
		contextMenu.data.parse(generateMenuItems(columnName));
		contextMenu.showAt(event.target, "bottom");
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
		return false;
	});
	contextMenu.events.on("click", function (id, e) {
		const menuItem = contextMenu.data.getItem(id);
		const column = Gantt.getGridColumn(menuItem.name);
        if(column) {
            column.hide = !column.hide;
            menuItem.icon = detectIconType(column.hide)
            contextMenu.paint()
            Gantt.render();
        }
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
	});
	contextMenu.events.on("beforeHide", function (id, event) {
		return id === "main" || event.type === "mouseleave";
	});
}
function generateMenuItems(columnName) {
    const menuItems = [];
    if (columnName) {
        const column = Gantt.getGridColumn(columnName);
        menuItems.push(
            { type: "menuItem", id: "main", name: column.name, value: "隐藏：" + getColumnLabel(column) },
            { type: "separator" }
        );
    }
    const columnItems = [];
    Gantt.config.columns.forEach(function (column) {
        columnItems.push({ type: "menuItem", id: column.name, name: column.name, value: getColumnLabel(column), icon: detectIconType(column.hide) })
    })
    menuItems.push({
        id: "show_columns",
        type: "menuItem",
        value: "展开表头:",
        items: columnItems
    })
    return menuItems;
}
function getColumnLabel(column) {
    return column.label || Gantt.locale.labels["column_" + column.name] || column.name;
}
function detectIconType(value) {
    if (value) {
        return "dxi dxi-checkbox-blank-outline";
    } else {
        return "dxi dxi-checkbox-marked";
    }
};

// 初始化自定义提示
function _inCustomTooltips() {
    Gantt.attachEvent("onGanttReady", function () {
        var tooltips = Gantt.ext.tooltips;
        Gantt.templates.tooltip_text = function (start, end, task) {
            var store = Gantt.getDatastore("resource");
            var assignments = task[Gantt.config.resource_property] || [];
            var owners = [];
            assignments.forEach(function (assignment) {
                var owner = store.getItem(assignment.resource_id)
                owners.push(owner.text);
            });
            return "<b>Task:</b> " + task.text + "<br/>" +
                "<b>Owner:</b>" + owners.join(",") + "<br/>" +
                "<b>Start date:</b> " +
                Gantt.templates.tooltip_date_format(start) +
                "<br/><b>End date:</b> " + Gantt.templates.tooltip_date_format(end);
        };
        tooltips.tooltipFor({
            selector: ".gantt_task_link",
            html: function (event, node) {
                var linkId = node.getAttribute(Gantt.config.link_attribute);
                if (linkId) {
                    var link = Gantt.getLink(linkId);
                    var from = Gantt.getTask(link.source);
                    var to = Gantt.getTask(link.target);
                    return [
                        "<b>类型:</b> " + linkTypeToString(link.type),
                        "<b>从: </b> " + from.text,
                        "<b>到: </b> " + to.text
                    ].join("<br>");
                }
            }
        });
        tooltips.tooltipFor({
            selector: ".gantt_row[resource_id]",
            html: function (event, node) {
                var resourceId = node.getAttribute("resource_id");
                var store = Gantt.getDatastore(Gantt.config.resource_store);
                var resource = store.getItem(resourceId);
                var assignments = getResourceAssignments(resource, store)
                var totalDuration = 0;
                for (var i = 0; i < assignments.length; i++) {
                    var task = Gantt.getTask(assignments[i].task_id);
                    totalDuration += task.duration * assignments[i].value;
                }
                return [
                    "<b>Resource:</b> " + resource.text,
                    "<b>Tasks assigned:</b> " + assignments.length,
                    "<b>Total load: </b>" + (totalDuration || 0) + "h"
                ].join("<br>");

            }
        });


        tooltips.tooltipFor({
            selector: ".gantt_scale_cell",
            html: function (event, node) {
                var relativePosition = Gantt.utils.dom.getRelativeEventPosition(event, Gantt.$task_scale);
                return Gantt.templates.tooltip_date_format(Gantt.dateFromPos(relativePosition.x));
            }
        });

        tooltips.tooltipFor({
            selector: ".gantt_resource_marker",
            html: function (event, node) {
                var dataElement = node.querySelector("[data-recource-tasks]");
                var ids = JSON.parse(dataElement.getAttribute("data-recource-tasks"));

                var date = Gantt.templates.parse_date(dataElement.getAttribute("data-cell-date"));
                var resourceId = dataElement.getAttribute("data-resource-id");

                var relativePosition = Gantt.utils.dom.getRelativeEventPosition(event, Gantt.$task_scale);

                var store = Gantt.getDatastore("resource");

                var html = [
                    "<b>" + store.getItem(resourceId).text + "</b>" + ", " + Gantt.templates.tooltip_date_format(date),
                    "",
                    ids.map(function (id, index) {
                        var task = Gantt.getTask(id);
                        var assignenment = Gantt.getResourceAssignments(resourceId, task.id);
                        var amount = "";
                        var taskIndex = (index + 1);
                        if (assignenment[0]) {
                            amount = " (" + assignenment[0].value + "h) ";
                        }
                        return "Task #" + taskIndex + ": " + amount + task.text;
                    }).join("<br>")
                ].join("<br>");

                return html;
            }
        });
    });
}
function linkTypeToString(linkType) {
    switch (linkType) {
        case Gantt.config.links.start_to_start:
            return "开始到开始";
        case Gantt.config.links.start_to_finish:
            return "开始到结束";
        case Gantt.config.links.finish_to_start:
            return "完成到开始";
        case Gantt.config.links.finish_to_finish:
            return "完成到完成";
        default:
            return ""
    }
}

// 作业类型
const taskTypeOptions = [
    // {key: "project", label: "WBS"},
    {key: "", label: ""},
    {key: "task", label: "任务相关"},
    {key: "milestone", label: "项目里程碑"},
    // {key: "开始里程碑", label: "开始里程碑"},
    // {key: "完成里程碑", label: "完成里程碑"}
]
// 里程碑类型
const taskMilestoneTypeOptions = [
    {key: "", label: ""},
    {key: "项目里程碑", label: "项目里程碑"},
    {key: "关键节点", label: "关键节点"},
    {key: "合同节点", label: "合同节点"}
]
// 作业状态
const taskStatusOptions = [
    // {key: "", label: ""},
    {key: "未开始", label: "未开始"},
    {key: "进行中", label: "进行中"},
    {key: "已完成", label: "已完成"}
]
// 作业阶段
let taskPhaseOptions = []
// 作业负责人
let taskOwnerOptions = ref([])
// 约束类型
const constraint_type_option = [
    { key: "", label: "" },
    { key: "asap", label: "尽早开始", text: Gantt.locale.labels.asap },
    { key: "alap", label: "尽晚完成", text: Gantt.locale.labels.alap },
    { key: "snet", label: "开始时间不早于", text: Gantt.locale.labels.snet },
    { key: "snlt", label: "开始时间不晚于", text: Gantt.locale.labels.snlt },
    { key: "fnet", label: "完成时间不早于", text: Gantt.locale.labels.fnet },
    { key: "fnlt", label: "完成时间不晚于", text: Gantt.locale.labels.fnlt },
    { key: "mso", label: "指定开始时间", text: Gantt.locale.labels.mso },
    { key: "mfo", label: "指定完成时间", text: Gantt.locale.labels.mfo }
]

// 初始化基线
function _inBaselines() {
	Gantt.config.lightbox.milestone_sections = Gantt.config.lightbox.sections = [
		{ name: "名称", height: 38, map_to: "text", type: "textarea", focus: true },
        // { name: "作业类型", height: 22, map_to: "taskType", type: "select", options: taskTypeOptions },
		// { name: "时间段", type: "duration", map_to: "auto" },
		{ name: "基线数据", height: 100, type: "baselines", map_to: "baselines" },
	];
    // Gantt.config.lightbox.project_sections = []
    Gantt.config.lightbox.project_sections = Gantt.config.lightbox.project_sections.filter(el => el.name !== "type")
	Gantt.config.resize_rows = true;
	Gantt.config.row_height = 30;
	Gantt.config.min_task_grid_row_height = 10;
	Gantt.config.baselines.render_mode = "separateRow";
    
	Gantt.templates.task_class = function (start, end, task) {
		if (task.planned_end) {
			var classes = ['has-baseline'];
			if (end.getTime() > task.planned_end.getTime()) {
				classes.push('overdue');
			}
			return classes.join(' ');
		}
	};

	Gantt.templates.rightside_text = function (start, end, task) {
		if (task.planned_end) {
			if (end.getTime() > task.planned_end.getTime()) {
				var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
				var text = "<b>Overdue: " + overdue + " days</b>";
				return text;
			}
		}
	};
}

// 修改外观
function _inClassic() {
	Gantt.config.scale_height = 50;
	Gantt.config.link_line_width = 1;
	Gantt.config.row_height = 22;
	Gantt.config.bar_height = 12;
	Gantt.config.grid_resize = true;
	Gantt.config.drag_links = false;
	Gantt.config.drag_progress = false;
	Gantt.config.type_renderers[Gantt.config.types.project] = function (task) {
		var main_el = document.createElement("div");
		main_el.setAttribute(Gantt.config.task_attribute, task.id);
		var size = Gantt.getTaskPosition(task);
		main_el.innerHTML = [
			"<div class='project-left'></div>",
			"<div class='project-right'></div>"
		].join('');
		main_el.className = "custom-project";
		main_el.style.left = size.left + "px";
		main_el.style.top = size.top + 7 + "px";
		main_el.style.width = size.width + "px";
		return main_el;
	};

	Gantt.templates.grid_row_class = function (start, end, task) {
		if (task.type == Gantt.config.types.project) {
			return "project-line";
		}
	};
	Gantt.templates.timeline_cell_class = function (item, date) {
		if (date.getDay() == 0 || date.getDay() == 6) {
			return "weekend";
		}
	};
	Gantt.templates.task_text = function () {
		return "";
	};
}

// 初始化导出
function _inExport() {
	Gantt.config.grid_width = 440;
	Gantt.templates.task_text = function (s, e, task) {
		return task.text;
	}
	Gantt.config.columns[0].template = function (obj) {
		return obj.text + " - <b>" + obj.progress*100 + "%</b>";
	}
}

// 初始化双击线
function _inLinkConfig() {
    Gantt.attachEvent("onLinkDblClick", function(id,e){
        editLinkId = id;
        let link = Gantt.getLink(id);
        let linkTitle = Gantt.getTask(link.source).text + " -> " + Gantt.getTask(link.target).text;
        modal = Gantt.modalbox({
            title: linkTitle,
            text: "<div>" +
                    "<label>Lag <input type='number' class='lag-input' /></label>" +
                "</div>",
            buttons: [
                {label:"保存", value:"save"},
                {label:"取消", value:"cancel"},
                {label:"删除", value:"delete"}
            ],
            width: "500px",
            callback: function(result){
                switch(result){
                    case "save":
                        saveLink();
                        break;
                    case "cancel":
                        cancelEditLink();
                        break;
 
                    case "delete":
                        deleteLink();
                        break;
                }
            }
        });
        modal.querySelector(".lag-input").value = link.lag || 0;
        return false;
    });
}
function saveLink(){
    var link = Gantt.getLink(editLinkId);
    var lagValue = modal.querySelector(".lag-input").value;
    if(!isNaN(parseInt(lagValue, 10))){
        link.lag = parseInt(lagValue, 10);
    }
    Gantt.updateLink(link.id);
    if(Gantt.autoSchedule){
        Gantt.autoSchedule(link.source);
    }
    endPopup();
}
function endPopup(){
    modal = null;
    editLinkId = null;
}
function cancelEditLink(){
    endPopup();
}
function deleteLink(){
    Gantt.deleteLink(editLinkId);
    endPopup();
}

// 监听方法
function dynamicData() {
    // 添加新任务
    // Gantt.attachEvent("onTaskCreated", function(task){
    //     if(task.parent < 1) {
    //         return false
    //     }
    //     const taskList = Gantt.serialize().data
    //     let taskCodeList = taskList.map(el => Number(el.taskCode) + 10 || 0)
    //     // task.projectId = projectId.value
    //     task.taskType = "WBS"
    //     task.taskMilestoneType = "项目里程碑"
    //     task.taskStatus = "未开始"
    //     task.taskPhase = ""
    //     task.taskPosition = ""
    //     task.taskOwner = ""
    //     task.targetDrtnHrCnt = '1'
    //     if(task.parent > 0){
    //         let changeParentData = false
    //         const dataForm = Gantt.getTask(task.parent)
    //         let wbsCode = dataForm.wbsCode
    //         if(dataForm.parent > 0) {
    //             const parentDataForm = Gantt.getTask(dataForm.parent)
    //             if(parentDataForm && dataForm.wbsCode === parentDataForm.wbsCode) {
    //                 const dataList = taskList.filter(el => el.parent === dataForm.parent && el.wbsCode !== parentDataForm.wbsCode)
    //                 let num = 1
    //                 if(dataList.length) {
    //                     const numList = dataList[dataList.length - 1].wbsCode.split(".")
    //                     num = Number(numList[numList.length - 1]) + 1
    //                 }
    //                 wbsCode = `${parentDataForm.wbsCode}.${num}`
    //                 dataForm.wbsCode = wbsCode
    //                 changeParentData = true
    //             }
    //         }
    //         if(dataForm.taskCode) {
    //             taskCodeList = [Number(dataForm.taskCode)]
    //             dataForm.parentTaskCode = dataForm.taskCode
    //             dataForm.taskCode = ""
    //             dataForm.taskType = ""
    //             dataForm.taskMilestoneType = ""
    //             dataForm.taskStatus = ""
    //             dataForm.taskPhase = ""
    //             dataForm.taskPosition = ""
    //             dataForm.taskOwner = ""
    //             dataForm.constraint_type = ""
    //             dataForm.constraint_date = ""
    //             changeParentData = true
    //         }
    //         if(changeParentData) {
    //             Gantt.updateTask(task.parent)
    //             const row = Gantt.getTaskNode(task.parent);
    //             if (row) {
    //                 const lastCell = row.lastElementChild;
    //                 if (task.readonly) {
    //                     lastCell.style.pointerEvents = "none";
    //                     lastCell.style.opacity = "0.5";
    //                     // 隐藏操作按钮
    //                     var addBtn = lastCell.querySelector(".gantt_add");
    //                     if (addBtn) addBtn.style.display = "none";
    //                 } else {
    //                     lastCell.style.pointerEvents = "";
    //                     lastCell.style.opacity = "";
    //                 }
    //             }
    //         }
    //         task.wbsCode = wbsCode
    //         task.targetStartDate = dataForm.start_date
    //         task.targetEndDate = new Date(new Date(task.targetStartDate).getTime() + (task.targetDrtnHrCnt * 24 * 60 * 60 * 1000))
    //     }
    //     task.taskCode = `${Math.max(...taskCodeList)}`
    //     nextTick(() => {
    //         // 删除表头添加按钮
    //         document.querySelector(".gantt_grid_head_add").style.display = "none";
    //     })
    //     return true
    // });
    Gantt.attachEvent("onAfterTaskAdd", function(id,task){
        // 拦截表头添加数据
        if(task.parent < 1) {
            nextTick(() => {
                Gantt.deleteTask(id)
            })
            return ;
        }
        const taskList = Gantt.serialize().data
        if(task.type === "project") {
            task.text = "新项目"
            task.open = true
            if(task.parent) {
                const dataForm = Gantt.getTask(task.parent)
                const dataList = taskList.filter(el => el.parent === task.parent && el.wbsCode && el.wbsCode !== dataForm.wbsCode)
                let num = 1
                if(dataList.length) {
                    const wbsCodeList = dataList.map(el => Number(el.wbsCode.split(".")[el.wbsCode.split(".").length - 1]))
                    num = Math.max(...wbsCodeList) + 1
                }
                task.wbsCode = `${dataForm.wbsCode}.${num}`
            }
        } else {
            let taskCodeList = taskList.map(el => Number(el.taskCode) + 10 || 0)
            // task.projectId = projectId.value
            task.text = "新任务"
            // task.taskType = "任务相关"
            task.type = "task"
            // task.taskMilestoneType = "项目里程碑"
            task.taskMilestoneType = ""
            task.taskStatus = "未开始"
            task.taskPhase = ""
            task.taskPosition = ""
            task.taskOwner = ""
            if(task.parent > 0){
                let changeParentData = false
                const dataForm = Gantt.getTask(task.parent)
                let wbsCode = dataForm.wbsCode
                if(dataForm.parent > 0) {
                    const parentDataForm = Gantt.getTask(dataForm.parent)
                    if(parentDataForm && dataForm.wbsCode === parentDataForm.wbsCode) {
                        const dataList = taskList.filter(el => el.parent === dataForm.parent && el.wbsCode !== parentDataForm.wbsCode)
                        let num = 1
                        if(dataList.length) {
                            const wbsCodeList = dataList.map(el => Number(el.wbsCode.split(".")[el.wbsCode.split(".").length - 1]))
                            num = Math.max(...wbsCodeList) + 1
                        }
                        wbsCode = `${parentDataForm.wbsCode}.${num}`
                        dataForm.wbsCode = wbsCode
                        changeParentData = true
                    }
                }
                if(dataForm.taskCode) {
                    taskCodeList = [Number(dataForm.taskCode)]
                    dataForm.parentTaskCode = dataForm.taskCode
                    dataForm.text = dataForm.text === "新任务" ? '新项目' : dataForm.text
                    dataForm.taskCode = ""
                    // dataForm.taskType = "WBS"
                    dataForm.taskMilestoneType = ""
                    dataForm.taskStatus = ""
                    dataForm.taskPhase = ""
                    dataForm.taskPosition = ""
                    dataForm.taskOwner = ""
                    dataForm.constraint_type = ""
                    dataForm.constraint_date = ""
                    dataForm.type = "project"
                    changeParentData = true
                }
                if(changeParentData) {
                    Gantt.updateTask(task.parent)
                    const row = Gantt.getTaskNode(task.parent);
                    if (row) {
                        const lastCell = row.lastElementChild;
                        if (task.readonly) {
                            lastCell.style.pointerEvents = "none";
                            lastCell.style.opacity = "0.5";
                            // 隐藏操作按钮
                            var addBtn = lastCell.querySelector(".gantt_add");
                            if (addBtn) addBtn.style.display = "none";
                        } else {
                            lastCell.style.pointerEvents = "";
                            lastCell.style.opacity = "";
                        }
                    }
                }
                task.wbsCode = wbsCode
                const startDate = task.start_date
                task.targetDrtnHrCnt = 5
                task.duration = 5
                task.targetStartDate = `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`
                task.targetEndDate = Gantt.calculateEndDate({start_date: new Date(task.targetStartDate), duration: task.duration})
                task.end_date = Gantt.calculateEndDate({start_date: startDate, duration: task.targetDrtnHrCnt})
                const childData = taskList.filter(el => el.parent === task.parent)[0]
                if(taskList.filter(el => el.parent == childData.id).length < 1) {
                    Gantt.getTask(childData.id).wbsCode = wbsCode
                    Gantt.updateTask(childData.id)
                }
                // const endDate = task.targetEndDate
                // task.end_date = `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`
            }
            task.taskCode = `${Math.max(...taskCodeList)}`.padStart(4, '0')
            // nextTick(() => {
            //     // 删除表头添加按钮
            //     document.querySelector(".gantt_grid_head_add").style.display = "none";
            // })
        }
        // Gantt.sort("type", true)
        Gantt.sort("taskCode", false)
        Gantt.sort("wbsCode", false)
        //在这里放置任何自定义逻辑
    });
    // 删除数据后
    Gantt.attachEvent("onAfterTaskDelete", function(id, item){
        const obj = Gantt.serialize().data.find(el => el.parent === item.parent);
        if(item.parent > 0) {
            if(!obj) {
                const dataForm = Gantt.getTask(item.parent)
                // if(dataForm.parent > 0) {
                    dataForm.wbsCode = (dataForm.parent > 0) && Gantt.getTask(dataForm.parent).wbsCode || ""
                    dataForm.taskCode = item.taskCode || item.parentTaskCode
                    // dataForm.taskType = "任务相关"
                    dataForm.type = "task"
                    // dataForm.taskMilestoneType = "项目里程碑"
                    dataForm.taskMilestoneType = ""
                    dataForm.taskStatus = "未开始"
                    dataForm.taskPhase = ""
                    dataForm.taskPosition = ""
                    dataForm.taskOwner = ""
                    dataForm.targetStartDate = dataForm.start_date
                    dataForm.targetDrtnHrCnt = dataForm.duration = 5
                    dataForm.targetEndDate = Gantt.calculateEndDate({start_date: new Date(dataForm.targetStartDate), duration: dataForm.duration})
                    dataForm.end_date = Gantt.calculateEndDate({start_date: dataForm.start_date, duration: dataForm.targetDrtnHrCnt})
                    // dataForm.targetEndDate = dataForm.end_date
                    // dataForm.type = ""
                    dataForm.constraint_type = "asap"
                    Gantt.updateTask(item.parent)
                // }
            }
            Gantt.batchUpdate(function () {
                calculatePlannedDates(item.parent)
            })
        }
        Gantt.sort("taskCode", false)
        Gantt.sort("wbsCode", false)
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
    });

    // 自定义删除按钮
    Gantt.attachEvent("onLightbox", function(id){
        // if (typeof id === "string" && Gantt.getTask(id).type !== "project") {
        if (typeof id === "string") {
            const btnSet = document.querySelector(".gantt_cal_lcontrols_push_right");
            const haveBtn = document.querySelector(".custom-delete-btn");
            if (btnSet && !haveBtn) {
                const deleteBtn = document.createElement("div");
                deleteBtn.className = "custom-delete-btn";
                deleteBtn.innerHTML = "删除";
                deleteBtn.onclick = () => {
                    ElMessageBox.confirm('确认删除？', '提示',{
                        distinguishCancelAndClose: true,
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                    })
                    .then(() => {
                        Gantt.deleteTask(id);
                        Gantt.hideLightbox();
                    })
                    .catch((action) => {
                    })
                };
                btnSet.prepend(deleteBtn);
            }
        }
        return true;
    });
    // 拖拽行修改行高
    Gantt.attachEvent("onBeforeRowResizeEnd", function(id, parent, tindex){
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
        return true;
    });
    // 拖拽列
    Gantt.attachEvent("onColumnResizeEnd", function(index, column, new_width){
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
        return true;
    });
    // 拖拽表格
    Gantt.attachEvent("onGridResizeEnd", function(old_width, new_width){
        // nextTick(() => {
        //     // 删除表头添加按钮
        //     document.querySelector(".gantt_grid_head_add").style.display = "none";
        // })
        return true;  
    });
}

const gridDateToStr = Gantt.date.date_to_str("%Y-%m-%d");
// 配置表格列
function _inConfigColumns() {
	Gantt.serverList("priority", [
		{key: "1", label: "Low"},
		{key: "2", label: "Normal"},
		{key: "3", label: "High"}
	]);
	Gantt.serverList("taskTypeOptions", taskTypeOptions);
	Gantt.serverList("taskMilestoneTypeOptions", taskMilestoneTypeOptions);
	Gantt.serverList("taskStatusOptions", taskStatusOptions);
	Gantt.serverList("taskPhaseOptions", taskPhaseOptions);
	Gantt.serverList("taskOwnerOptions", taskOwnerOptions.value);
	Gantt.serverList("constraint_type_option", constraint_type_option);
    // 修改数据后
    Gantt.attachEvent("onAfterTaskUpdate", function(id, task) {
        const startDate = task.start_date
        const endDate = task.end_date
        task.targetDrtnHrCnt = task.duration
        task.targetStartDate = startDate && `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}` || ""
        task.targetEndDate = endDate && `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}` || ""
        task.start_date = new Date(`${task.targetStartDate} 00:00:00`)
        task.end_date = task.targetEndDate && new Date(`${task.targetEndDate} 00:00:00`) || ""
        Gantt.batchUpdate(function () {
            if (task.parent > 0) {
                calculatePlannedDates(task.parent)
            }
        })
    });

    // 拖拽甘特图完成情况
    Gantt.attachEvent("onTaskDrag", function (id) {
        refreshSummaryProgress(Gantt.getParent(id), false);
    });
    Gantt.config.columns = [
        { name: "add", label: "", min_width: 40 },
        // { name: "projectId", label: "项目ID", tree: true },
        // editor: {type: "text", map_to: "wbsCode"}   表格编辑框
        { name: "firstItem", label: "编码", align: "left", min_width: 200, template: firstItemLabel, tree: true, resize: true },
        { name: "wbsCode", label: "WBS编码", align: "center", min_width: 150, template: wbsCodeLabel, resize: true },
        { name: "pmsWbsCode", label: "PMS_WBS编码", align: "center", min_width: 150, editor: {type: "text", map_to: "pmsWbsCode"}, resize: true },
        // { name: "taskCode", label: "作业编码", align: "center", template: taskCodeLabel, resize: true },
        // { name: "wbs", label: "WBS", template: Gantt.getWBSCode }, // 插件自带WBS编码
        { name: "text", label: "作业名称", min_width: 250, editor: {type: "text", map_to: "text"}, resize: true },
        // { name: "taskType", label: "作业类型", align: "center", editor: {type: "taskTypeSelect", map_to: "taskType", options:Gantt.serverList("taskTypeOptions")}, resize: true },
        // { name: "type", label: "作业类型", align: "center", resize: true },
        { name: "type", label: "作业类型", align: "center", min_width: 100, editor: {type: "typeSelect", map_to: "type", options:Gantt.serverList("taskTypeOptions")}, template: typeLabel, resize: true },
        { name: "taskStatus", label: "作业状态", align: "center", min_width: 100, editor: {type: "select", map_to: "taskStatus", options:Gantt.serverList("taskStatusOptions")}, resize: true },
        { name: "start_date", label: "开始时间", align: "center", min_width: 140, resize: true },
        { name: "duration", label: "持续时间", align: "center", min_width: 90, resize: true },
        { name: "end_date", label: "完成时间", align: "center", min_width: 140, resize: true },
        { name: "taskOwner", label: "作业负责人", align: "center", min_width: 120, editor: {type: "taskOwnerSelect", map_to: "taskOwner", options:Gantt.serverList("taskOwnerOptions")}, template: taskOwnerLabel, resize: true },
        { name: "taskPosition", label: "作业负责岗位", align: "center", min_width: 140, resize: true },
        { name: "taskMilestoneType", label: "里程碑类型", align: "center", min_width: 100, editor: {type: "select", map_to: "taskMilestoneType", options:Gantt.serverList("taskMilestoneTypeOptions")}, resize: true },
        { name: "constraint_type", label: "作业约束类型", align: "center", min_width: 120, editor: {type: "select", map_to: "constraint_type", options:Gantt.serverList("constraint_type_option")}, template: constraint_type_label, resize: true },
        { name: "constraint_date", label: "作业约束日期", align: "center", min_width: 140, editor: {type: "date", map_to: "constraint_date", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, min_width: 100, resize: true },
        { name: "taskPhase", label: "作业阶段", align: "center", min_width: 100, editor: {type: "select", map_to: "taskPhase", options:Gantt.serverList("taskPhaseOptions")}, resize: true },
        { name: "targetStartDate", label: "计划开始", align: "center", min_width: 140, editor: {type: "targetStartDate", map_to: "targetStartDate", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, min_width: 100, resize: true },
        { name: "targetDrtnHrCnt", label: "计划工期", align: "center", min_width: 90, editor: {type: "targetDrtnHrCnt", map_to: "targetDrtnHrCnt"}, resize: true },
        { name: "targetEndDate", label: "计划完成", align: "center", min_width: 140, editor: {type: "targetEndDate", map_to: "targetEndDate", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, template: targetEndDateLabel, min_width: 100, resize: true },
        { name: "actStartDate", label: "实际开始", align: "center", min_width: 140, editor: {type: "date", map_to: "actStartDate", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, template: actStartDateLabel, min_width: 100, resize: true },
        { name: "progress", label: "完成百分比", align: "center", min_width: 90, template: function(task) {
            return Math.round(task.progress * 100) + "%";
        }, editor: {type: "number", map_to: "progress", min:0, max: 100}},
        { name: "actWorkQty", label: "实际工期", align: "center", min_width: 90, editor: {type: "number", map_to: "actWorkQty"}, template: actWorkQtyLabel, resize: true },
        { name: "remainDrtnHrCnt", label: "尚需工期", align: "center", min_width: 90, editor: {type: "number", map_to: "remainDrtnHrCnt"}, resize: true },
        { name: "actEndDate", label: "实际完成", align: "center", min_width: 140, min_width: 100, resize: true },
        { name: "freeFloatHrCnt", label: "自由浮时", align: "center", min_width: 90, resize: true, template: freeFloatHrCntLabel },
        { name: "totalFloatHrCnt", label: "总浮时", align: "center", min_width: 90, resize: true, template: totalFloatHrCntLabel },
        // taskComplete
        // { name: "add", label: "", hide: true }
    ];
    Gantt.templates.task_end_date = function (date) {
        return Gantt.templates.task_date(new Date(date.valueOf() - 24 * 60 * 60 * 1000));
    };
    Gantt.templates.grid_date_format = function (date, column) {
        if (column === "end_date") {
            return gridDateToStr(new Date(date.valueOf() - 24 * 60 * 60 * 1000));
        } else {
            return gridDateToStr(date);
        }
    }
    Gantt.ext.inlineEditors.attachEvent("onEditStart", function (state) {
        if (state.columnName == "progress") {
            const node = Gantt.ext.inlineEditors._placeholder.firstChild.firstChild
            node.value = parseInt(node.value * 100);
        }
    });

    Gantt.ext.inlineEditors.attachEvent("onBeforeSave", function (state) {
        if (state.columnName == "progress") {
            state.newValue /= 100;
        }
        return true;
    });
    Gantt.templates.grid_row_class = ( start, end, task ) => {
        if (task.type === "milestone") {
            return "nested_task"
        }
        return "";
    };
    const date_show = Gantt.config.editor_types.date.show
    const select_show = Gantt.config.editor_types.select.show
    const number_show = Gantt.config.editor_types.number.show
    const text_show = Gantt.config.editor_types.text.show
    // wbs数据禁止输入日期
    Gantt.config.editor_types.date.show = (o,s,l,c) => {
        let task = Gantt.getTask(o);
        if(task.type !== "project") {
            date_show(o,s,l,c)
        }
    }
    Gantt.config.editor_types.date.set_value = (o,s,l,c) => {
        if(c.querySelector("input")) {
            c.querySelector("input") && (c.querySelector("input").value = o)
        }
    }
    Gantt.config.editor_types.date.get_value = (o,s,l) => {
        if(l.querySelector("input")) {
            // let task = Gantt.getTask(o);
            return l.querySelector("input").value
        }
    }
    // wbs数据禁止选择下拉框
    Gantt.config.editor_types.select.show = (i,a,r,o) => {
        let task = Gantt.getTask(i);
        if(task.type !== "project") {
            select_show(i,a,r,o)
        }
    }
    Gantt.config.editor_types.select.set_value = (e,i,a,r) => {
        if(r.querySelector("select")) {
            r.querySelector("select") && (r.querySelector("select").value = e)
        }
    }
    Gantt.config.editor_types.select.get_value = (e,i,a) => {
        if(a.querySelector("select")) {
            // let task = Gantt.getTask(e);
            return a.querySelector("select").value
        }
    }
    // wbs数据禁止输入数字
    Gantt.config.editor_types.number.show = (i,a,r,o) => {
        let task = Gantt.getTask(i);
        if(task.type !== "project") {
            number_show(i,a,r,o)
        }
    }
    Gantt.config.editor_types.number.set_value = (e,i,a,r) => {
        if(r.querySelector("input")) {
            r.querySelector("input") && (r.querySelector("input").value = e)
        }
    }
    Gantt.config.editor_types.number.get_value = (e,i,a) => {
        if(a.querySelector("input")) {
            // let task = Gantt.getTask(e);
            return a.querySelector("input").value
        }
    }
    // 项目数据禁止输入
    Gantt.config.editor_types.text.show = (i,a,r,o) => {
        let task = Gantt.getTask(i);
        if(task.parent > 0) {
            text_show(i,a,r,o)
        }
    }
    Gantt.config.editor_types.text.get_input = (e) => {
        let obj = e.attributes['data-column-name'].value === "text" ? {value: projectName} : {value: projectCode}
        return e.querySelector("input") || obj
    }
    // Gantt.config.editor_types.date.get_value = (value, id, column, node) => {
    //     var currentValue = this.get_value(id, column, node);
    //     currentValue = "WBS" ? currentValue = "project" : ''
    //     return value !== currentValue;
    // }
    // Gantt.config.editor_types.date.show = function(id, column, config, placeholder) {
    //     console.log(id, column, config, placeholder)
    //     let max = config.max
    //     let min = config.min
    //     var html = "<div style='width:140px' role='cell'><input type='date' min='" + min + 
    //                 "' max='" + max + "' name='" + column.name + "'></div>";
    //     placeholder.innerHTML = html;
    // }
    Gantt.config.editor_types.date.is_valid = function(value, id, column, node) {
        return true
    }
    // 未使用
    Gantt.config.editor_types.taskTypeSelect = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            if(!task.type) {
                let node = document.createElement("div");
                node.className = "gantt-task-type-editor";
                // 创建select元素
                let select = document.createElement("select");
                select.className = "gantt-task-type-select";
                select.name = column.name
                // 添加任务类型选项
                let options = config.options || [
                    {key: "task", label: "任务"},
                    {key: "milestone", label: "里程碑"},
                    {key: "project", label: "项目"}
                ];
                options.forEach(function(opt) {
                    let option = document.createElement("option");
                    option.value = opt.key;
                    option.textContent = opt.label;
                    option.selected = (task[column.name] === opt.key);
                    select.appendChild(option);
                });
                node.appendChild(select);
                // 保存引用以便后续使用
                this._node = node;
                this._select = select;
                placeholder.appendChild(node)
            }
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("select") && (node.querySelector("select").value = value)
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return node.querySelector("select") && node.querySelector("select").value || task.taskType
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("select");
            if (!input) { return; }
            if (input.focus) { input.focus(); }
            if (input.select) { input.select(); }
        }
    }
    let taskOwnerSelect = null
    Gantt.config.editor_types.taskOwnerSelect = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            if(task.type !== "project") {
                let node = document.createElement("div");
                node.className = "gantt-task-type-editor";
                taskOwnerSelect = Number(task.taskOwner)
                // 创建select元素
                const select = h(ElSelect, {
                    modelValue: taskOwnerSelect,
                    'onUpdate:modelValue': (val) => { this.set_value(val) },
                    // 'onUpdate:modelValue': (val) => { this.set_value(val); task.taskOwner = val; Gantt.updateTask(task.id) },
                    filterable: true,
                    placeholder: '请选择'
                }, taskOwnerOptions.value.map(item => h(ElOption, {
                    key: item.key,
                    label: item.label,
                    value: item.key
                })));
                select.name = column.name
                render(select, node)
                placeholder.appendChild(node)
            }
        },
        // hide: function () {},
        set_value: function (value, id, column, node) {
            taskOwnerSelect = value
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return taskOwnerSelect || task.taskType
        },
        is_changed: function (value, id, column, node) {
            let task = Gantt.getTask(id);
            // var currentValue = this.get_value(id, column, node);
            return task.type !== "project"
            return value !== taskOwnerSelect;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
        }
    }
    Gantt.config.editor_types.typeSelect = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            if(task.type !== "project") {
                let node = document.createElement("div");
                node.className = "gantt-task-type-editor";
                // 创建select元素
                let select = document.createElement("select");
                select.className = "gantt-task-type-select";
                select.name = column.name
                // 添加任务类型选项
                let options = config.options || [
                    {key: "task", label: "任务"},
                    {key: "milestone", label: "里程碑"},
                    {key: "project", label: "项目"}
                ];
                options.forEach(function(opt) {
                    let option = document.createElement("option");
                    option.value = opt.key;
                    option.textContent = opt.label;
                    option.selected = (task[column.name] === opt.key);
                    select.appendChild(option);
                });
                node.appendChild(select);
                // 保存引用以便后续使用
                this._node = node;
                this._select = select;
                placeholder.appendChild(node)
            }
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("select") && (node.querySelector("select").value = value)
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return node.querySelector("select") && node.querySelector("select").value || task.taskType
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            currentValue = "WBS" ? currentValue = "project" : ''
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("select");
            if (!input) { return; }
            if (input.focus) { input.focus(); }
            if (input.select) { input.select(); }
        }
    }
    Gantt.config.editor_types.targetStartDate = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            if(task.type !== "project") {
                let max = config.max
                let min = config.min
                var html = "<div style='width:140px' role='cell'><input type='date' min='" + min + 
                            "' max='" + max + "' name='" + column.name + "'></div>";
                placeholder.innerHTML = html;
            }
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("input") && (node.querySelector("input").value = value)
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return node.querySelector("input") && (node.querySelector("input").value || 0) || task.targetStartDate;
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            const dataForm = Gantt.getTask(id)
            dataForm.start_date = new Date(`${currentValue} 00:00:00`)
            // `${currentValue.substring(8, 10)}-${currentValue.substring(5, 7)}-${currentValue.substring(0, 4)}`
            if(dataForm.targetDrtnHrCnt) {
                dataForm.duration = dataForm.targetDrtnHrCnt
                dataForm.targetEndDate = Gantt.calculateEndDate({start_date: new Date(dataForm.targetStartDate), duration: dataForm.duration})
                dataForm.end_date = dataForm.targetEndDate
            }
            Gantt.updateTask(id)
            Gantt.autoSchedule(id)
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("input");
            if (!input) { return; }
            if (input.focus) { input.focus(); }
            if (input.select) { input.select(); }
        }
    }
    Gantt.config.editor_types.targetDrtnHrCnt = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            if(task.type !== "project") {
                let max = config.max
                let min = config.min
                var html = "<div style='width:140px' role='cell'><input type='number' min='" + min + 
                            "' max='" + max + "' name='" + column.name + "'></div>";
                placeholder.innerHTML = html;
            }
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("input") && (node.querySelector("input").value = value)
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return node.querySelector("input") && (node.querySelector("input").value || 0) || task.targetDrtnHrCnt
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            const dataForm = Gantt.getTask(id)
            dataForm.duration = currentValue
            dataForm.targetEndDate = Gantt.calculateEndDate({start_date: new Date(dataForm.targetStartDate), duration: dataForm.duration})
            // dataForm.targetEndDate = new Date(new Date(`${dataForm.targetStartDate}`).getTime() + (currentValue * 24 * 60 * 60 * 1000))
            dataForm.end_date = dataForm.targetEndDate
            Gantt.updateTask(id)
            Gantt.autoSchedule(id)
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("input");
            if (!input) { return; }
            if (input.focus) { input.focus(); }
            if (input.select) { input.select(); }
        }
    }
    Gantt.config.editor_types.targetEndDate = {
        show: function (id, column, config, placeholder) {
            let task = Gantt.getTask(id);
            task[column.name] = gridDateToStr(new Date(new Date(task.end_date).valueOf() - 24 * 60 * 60 * 1000))
            if(task.type !== "project") {
                let max = config.max
                let min = config.min
                var html = "<div style='width:140px' role='cell'><input type='date' min='" + min + 
                            "' max='" + max + "' name='" + column.name + "'></div>";
                placeholder.innerHTML = html;
            }
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("input") && (node.querySelector("input").value = value)
        },
        get_value: function (id, column, node) {
            let task = Gantt.getTask(id);
            return node.querySelector("input") && (node.querySelector("input").value && gridDateToStr(new Date(new Date(node.querySelector("input").value).valueOf() + 24 * 60 * 60 * 1000)) || 0) || gridDateToStr(new Date(new Date(task.targetEndDate).valueOf() + 24 * 60 * 60 * 1000));
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            const dataForm = Gantt.getTask(id)
            dataForm.end_date = new Date(`${currentValue} 00:00:00`)
            if(dataForm.targetEndDate) {
                dataForm.duration = dataForm.targetDrtnHrCnt = Gantt.calculateDuration({start_date: dataForm.start_date, end_date: new Date(dataForm.end_date)})
            }
            Gantt.updateTask(id)
            Gantt.autoSchedule(id)
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("input");
            if (!input) { return; }
            if (input.focus) { input.focus(); }
            if (input.select) { input.select(); }
        }
    }
}

function updateParent(id) {
    nextTick(() => {
        Gantt.updateTask(id)
    })
    const parentData = Gantt.getTask(id)
    if(parentData.parent > 0) updateParent(parentData.parent)
}

function refreshSummaryProgress(id, submit) {
    if (!Gantt.isTaskExists(id))
    return;
    var task = Gantt.getTask(id);
    var newProgress = calculateSummaryProgress(task);
    if (newProgress !== task.progress) {
        task.progress = newProgress;
        if (!submit) {
            Gantt.refreshTask(id);
        } else {
            Gantt.updateTask(id);
        }
    }
    if (!submit && Gantt.getParent(id) !== Gantt.config.root_id) {
        refreshSummaryProgress(Gantt.getParent(id), submit);
    }
}

function calculateSummaryProgress(task) {
    if (task.type != Gantt.config.types.project)
        return task.progress;
    var totalToDo = 0;
    var totalDone = 0;
    Gantt.eachTask(function (child) {
        if (child.type != Gantt.config.types.project) {
            totalToDo += child.duration;
            totalDone += (child.progress || 0) * child.duration;
        }
    }, task.id);
    if (!totalToDo) return 0;
    else return totalDone / totalToDo;
}
const projectCode = window.top._P ? window.top._P?.data?.recentLocations[0]?.number : window.opener?.opener?._P?.data?.recentLocations[0]?.number || "A-DLS-1-01"
const projectName = window.top.getCurrentShellName ? window.top.getCurrentShellName() : window.opener?.opener?.getCurrentShellName() || "测试项目"
// 表格框修改数据
function firstItemLabel(task) {
    task.wbsCode = task.wbsCode || ""
    task.taskCode = task.type === "project" ? "" : task.taskCode
    return `${task.taskCode && `A${task.taskCode.padStart(4, '0')}` || projectCode + (task.wbsCode && task.wbsCode || "") }`
}
function wbsCodeLabel(task) {
    return projectCode + task.wbsCode
}
function taskCodeLabel(task) {
    return task.taskCode && `A${task.taskCode.padStart(4, '0')}`
}
function constraint_type_label(task) {
    return task.constraint_type && Gantt.serverList("constraint_type_option").find(el => el.key == task.constraint_type).label
}
function targetEndDateLabel(task) {
    return task.targetEndDate && gridDateToStr(new Date(new Date(task.targetEndDate).valueOf() - 24 * 60 * 60 * 1000))
}
function taskPhaseLabel(task) {
    return task.taskPhase && Gantt.serverList("taskPhaseOptions").find(el => el.key == task.taskPhase).label
}
function typeLabel(task) {
    if(task.type) {
        const findItem = Gantt.serverList("taskTypeOptions").find(el => el.key == task.type)
        if(findItem) {
            return findItem.label
        } else {
            return "WBS"
        }
    } else {
        return ""
    }
}
function taskOwnerLabel(task) {
    task.taskPosition = task.taskOwner && Gantt.serverList("taskOwnerOptions").find(el => el.key == task.taskOwner).CRRC_USER_GW
    return task.taskOwner && Gantt.serverList("taskOwnerOptions").find(el => el.key == task.taskOwner).CRRC_USER_QM
}
function actStartDateLabel(task) {
    if(task.actStartDate && task.actWorkQty) {
        task.actEndDate = new Date(new Date(task.actStartDate).getTime() + ((Number(task.actWorkQty)) * 24 * 60 * 60 * 1000))
    }
    return task.actStartDate
}
function actWorkQtyLabel(task) {
    if(task.actStartDate && task.actWorkQty) {
        task.actEndDate = new Date(new Date(task.actStartDate).getTime() + ((Number(task.actWorkQty)) * 24 * 60 * 60 * 1000))
    }
    return task.actWorkQty
}
function freeFloatHrCntLabel(task) {
    return Gantt.getFreeSlack(task)
}
function totalFloatHrCntLabel(task) {
    return Gantt.getTotalSlack(task)
}
// function priorityLabel(task){
//     const value = task.priority;
//     const list = Gantt.serverList("priority");
//     for(let i = 0; i < list.length; i++){
//         if(list[i].key == value){
//             return list[i].label;
//         }
//     }
//     return "";
// }

// 关键路径
const criticalPathText = ref("显示关键路径")
function updateCriticalPath() {
    if (criticalPathText.value === "显示关键路径") {
        criticalPathText.value = "隐藏关键路径";
        Gantt.config.highlight_critical_path = true;
    } else {
        criticalPathText.value = "显示关键路径";
        Gantt.config.highlight_critical_path = false;
    }
    Gantt.render();
}

// 鼠标拖动时间轴
function onDragEnd(startPoint, endPoint, startDate, endDate, tasksBetweenDates, tasksInRow) {
    if (tasksInRow.length === 1) {
        let currentTask = tasksInRow[0];
        if (currentTask.type === "project") {
            currentTask.render = "split";
            Gantt.addTask({
                text: "Subtask of " + currentTask.text,
                start_date: Gantt.roundDate(startDate),
                end_date: Gantt.roundDate(endDate)
            }, currentTask.id);
        } else {
            let projectNameText = "new Project " + currentTask.text;
            let newProject = Gantt.addTask({
                text: projectNameText,
                render: "split",
                type: "project",
            }, currentTask.parent);
            Gantt.moveTask(newProject, Gantt.getTaskIndex(currentTask.id), Gantt.getParent(currentTask.id));
            Gantt.moveTask(currentTask.id, 0, newProject);
            Gantt.calculateTaskLevel(currentTask)

            let newTask = Gantt.addTask({
                text: "Subtask of " + projectNameText,
                start_date: Gantt.roundDate(startDate),
                end_date: Gantt.roundDate(endDate)
            }, newProject);
            Gantt.calculateTaskLevel(newTask);
        }
    } else if (tasksInRow.length === 0) {
        Gantt.createTask({
            text: "New task",
            start_date: Gantt.roundDate(startDate),
            end_date: Gantt.roundDate(endDate)
        });
    }
}

const showChart = ref(true)
const onlyGrid = {
    css: "gantt_container",
    cols: [{
        rows: [
            { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
            { view: "scrollbar", id: "gridScroll", group: "horizontalScrolls" }
        ]
    },
    { resizer: true, width: 1 }]
};

const gridAndChart = {
    css: "gantt_container",
    cols: [{
        width: 700,
        min_width: 300,
        rows: [
            { view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer" },
            { view: "scrollbar", id: "gridScroll", group: "horizontalScrolls" }
        ]
    },
    { resizer: true, width: 1 },
    {
        rows: [
            { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
            { view: "scrollbar", id: "scrollHor", group: "horizontalScrolls" }
        ]
    },
    { view: "scrollbar", id: "scrollVer" }]
};
// 显示图表
function toggleChart() {
    showChart.value = !showChart.value;
    if (showChart.value) {
        Gantt.config.layout = gridAndChart;
    } else {
        Gantt.config.layout = onlyGrid;
    }
    Gantt.init(ganttDom.value);
}
// 撤销
function undo() {
    Gantt.undo()
}
// 恢复撤销
function redo() {
    Gantt.redo()
}
// 展开父节点
function open() {
    Gantt.batchUpdate(function (task) {
        Gantt.eachTask(function (task) {
            task.$open = true;
        })
    })
}
// 关闭父节点
function close() {
    Gantt.batchUpdate(function (task) {
        Gantt.eachTask(function (task) {
            task.$open = false;
        })
    })
}
// 时间范围
function changeZoom(val) {
	Gantt.ext.zoom.setLevel(val);
}

const dialogVisible = ref(false)
const calendar = ref(null)
// 日历详情
let calendarDetail = ref({})
// 日历配置数据
const calendarData = ref({
    allCalendar: [
        {
            id: 1,
            name: "7天工作制",
            workWeek: "seven",
        },
        {
            id: 2,
            name: "5天工作制",
            workWeek: "five",
        }
    ],
    projectCalendar: [
        {
            id: 3,
            name: "项目日历",
            workWeek: "five",
            calendarList: []
        },
    ],
})
let calendarId = ref(3)
// 显示日历管理器
function showCalendar() {
    axios.getCalendarList(projectId)
    .then(res => {
        if(res.data.code === 200) {
            calendarData.value.allCalendar = res.data.data.filter(el => el.calType === "all")
            calendarData.value.projectCalendar = res.data.data.filter(el => el.calType === "project")
            calendarData.value.projectCalendar.forEach(el => {
                el.calendarList = JSON.parse(el.calendarList)
            })
            calendarDetail.value = res.data.data.find(el => el.isUse === 1)
            dialogVisible.value = true
        } else {
            ElMessage.error(res.msg)
        }
    })
}
// 判断是否为非工作日
const isWeekend = (calendarDetail, dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    if(calendarDetail.workWeek === "five")
    return day === 0 || day === 6 || (calendarDetail.calendarList && calendarDetail.calendarList.includes(dateStr));
    if(calendarDetail.workWeek === "seven")
    return calendarDetail.calendarList && calendarDetail.calendarList.includes(dateStr)
};

// 项目日历弹窗表单
const calendarForm = ref({})
// 打开添加项目日历弹窗
const showAddCalendar = () => {
    calendarForm.value = {
        calType: "project",
        projectId: projectId,
        name: "项目日历",
        workWeek: "seven",
        calendarList: [],
        isUse: 0,
    }
    innerVisible.value = true
}
const innerVisible = ref(false)
// 添加项目日历
const addCalendar = () => {
    const form = JSON.parse(JSON.stringify(calendarForm.value))
    form.calendarList = JSON.stringify(form.calendarList)
    axios.saveCalendar(form)
    .then(res => {
        if(res.data.code === 200) {
            showCalendar()
            clearCalendarForm()
        } else {
            ElMessage.error(res.data.msg)
        }
    })
    // calendarData.value.projectCalendar.push(calendarForm.value)
    // clearCalendarForm()
}
// 修改项目日历
const editCalendar = () => {
    const form = JSON.parse(JSON.stringify(calendarDetail.value))
    form.calendarList = JSON.stringify(form.calendarList)
    axios.saveCalendar(form)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage.success('保存成功')
        }
    })
}
// 关闭项目日历弹窗
const clearCalendarForm = () => {
    innerVisible.value = false
}

// 选中日期
const chooseDate = (calendarDetail, dateStr) => {
    if(!calendarDetail.calendarList) return;
    const date = new Date(dateStr);
    const day = date.getDay();
    if(calendarDetail.workWeek === "five" && (day === 0 || day === 6)) return;
    if(calendarDetail.calendarList.includes(dateStr))
    calendarDetail.calendarList.splice(calendarDetail.calendarList.indexOf(dateStr), 1)
    else calendarDetail.calendarList.push(dateStr)
}
// 设置为项目日历
const selectCalendar = (item) => {
    const form = JSON.parse(JSON.stringify(item))
    form.calendarList = JSON.stringify(form.calendarList)
    form.isUse = 1
    axios.useCalendar(form)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage.success('设置成功')
            setCalendarConfig(form)
        } else {
            ElMessage.error(res.data.msg)
        }
    })
}
// 设置日历配置
function setCalendarConfig(item) {
    const taskData = Gantt.serialize()
    Gantt.getCalendar("global")._worktime.dates = [ true, true, true, true, true, true, true ]
    if(!item.id) return ElMessage({
        message: '请先保存日历设置！',
        type: 'warning',
    });
    let changeCalendar = false
    if(item.workWeek === "five") {
        Gantt.setWorkTime({ day: 6, hours: false })
        Gantt.setWorkTime({ day: 0, hours: false })
        changeCalendar = true
    }
    if(item.workWeek === "seven") {
        Gantt.setWorkTime({ day: 6, hours: true })
        Gantt.setWorkTime({ day: 0, hours: true })
        changeCalendar = true
    }
    item.calendarList = JSON.parse(item.calendarList)
    if(item.calendarList && item.calendarList.length > 0) {
        item.calendarList.forEach(el => {
            Gantt.getCalendar().setWorkTime({
                date: new Date(el),
                hours: false
            })
        })
        changeCalendar = true
    }
    if(changeCalendar) {
        taskData.data.forEach(el => {
            el.end_date = ""
            el.targetEndDate = Gantt.calculateEndDate({start_date: new Date(el.targetStartDate), duration: el.duration})
        })
        Gantt.parse(taskData)
    }
    calendarId.value = item.id
}
// 删除日历
const deleteCalendar = (item) => {
    ElMessageBox.confirm('确认删除？', '提示',{
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    })
    .then(() => {
        axios.deleteCalendar(item.id)
        .then(res => {
            if(res.data.code === 200) {
                ElMessage.success('删除成功')
                showCalendar()
            }
        })
        // calendarData.value.projectCalendar = calendarData.value.projectCalendar.filter(el => el.id!== item.id)
    })
    .catch((action) => {
    })
}
// 查看项目日历配置
const showCalendarDetail = (val) => {
    calendarDetail.value = val
}
// 切换月份
const selectDate = (val) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
// 甘特图非工作日颜色
function checkHighlight(date, task) {
    if (!Gantt.isWorkTime({ date, task, unit: Gantt.getScale().unit })) {
        return "weekend";
    }
}

function zoomIn(){
    Gantt.ext.zoom.zoomIn();
    // nextTick(() => {
    //     // 删除表头添加按钮
    //     document.querySelector(".gantt_grid_head_add").style.display = "none";
    // })
}
function zoomOut(){
    Gantt.ext.zoom.zoomOut()
    // nextTick(() => {
    //     // 删除表头添加按钮
    //     document.querySelector(".gantt_grid_head_add").style.display = "none";
    // })
}

const exportTo = (command) => {
    switch(command) {
        case "PDF":
            exportToPDF()
            break;
        case "Excel":
            exportToExcel()
            break;
    }
}
// gantt.exportToPNG({ skin:"dark" })broadway skyblue material
// 导出文件
function exportToPDF() {
    Gantt.exportToPDF({server: "https://dls.4dlp.com.cn:7102/export/gantt"})
}
function exportToExcel() {
    Gantt.exportToExcel({server: "https://dls.4dlp.com.cn:7102/export/gantt"})
}


const importFrom = (command) => {
    switch(command) {
        case "Project":
            importProject()
            break;
        case "P6":
            importP6()
            break;
        case "Excel":
            importExcel()
            break;
    }
}
const fileDnD = fileDragAndDrop()
// 导入project文件
function importProject() {
    // Gantt.importFromExcel({
    //     server:"https://https://dls.4dlp.com.cn:7102/import/",
    //     data: file,
    //     callback: function(project){
    //         console.log(project)
    //     }
    // });
    var fileInput = document.getElementById("file-upload");
    if (fileInput.files[0]) {
        loading.value = true
        fileDnD.showUpload();
        uploadProject(fileInput.files[0], function () {})
    }
    else ElMessage({
        message: '请先选择文件！',
        type: 'warning',
    });
}
function uploadProject(file, callback) {
    Gantt.importFromMSProject({
        server:"https://dls.4dlp.com.cn:7102/import/",
        data: file,
        taskProperties: [
            "ID",
            "WBS",
            "ActivityID",
            "Type",
        ],
        callback: function (project) {
            console.log(project)
            if (project) {
                Gantt.clearAll();
                // if (project.config.duration_unit) {
                //     Gantt.config.duration_unit = project.config.duration_unit;
                // }
                project.data.data.forEach(el => {
                    if(el.parent < 1) el.text = projectName
                    el.taskCode = el.$custom_data.ID && (el.$custom_data.ID + 0)
                    el.wbsCode = el.$custom_data.WBS && el.$custom_data.WBS.split('').splice(1).join('')
                    el.targetDrtnHrCnt = el.duration
                    el.targetStartDate = el.start_date = el.start_date && el.start_date.substring(0, 10) || ""
                    if(el.targetDrtnHrCnt > 0) {
                        el.targetEndDate = Gantt.calculateEndDate({start_date: new Date(el.start_date), duration: el.duration})
                        el.type = "task"
                    } else {
                        el.type = "milestone"
                    }
                    if(el.$custom_data.Type === "FIXED_UNITS") {
                        let wbsCodeList = el.wbsCode.split('.')
                        wbsCodeList.pop()
                        el.wbsCode = wbsCodeList.join('.')
                        el.taskStatus = "未开始"
                    }
                })
                Gantt.parse(project.data);
                Gantt.sort("firstItem", true)
                fileDnD.hideOverlay();
                loading.value = false
            } else {
                ElMessage({
                    message: '导入文件格式错误，请尝试其他导入！',
                    type: 'warning',
                });
                fileDnD.hideOverlay();
                loading.value = false
            }
        }
    });
}
// 导入P6文件
function importP6() {
    // Gantt.importFromExcel({
    //     server:"https://https://dls.4dlp.com.cn:7102/import/",
    //     data: file,
    //     callback: function(project){
    //         console.log(project)
    //     }
    // });
    var fileInput = document.getElementById("file-upload");
    if (fileInput.files[0]) {
        loading.value = true
        fileDnD.showUpload();
        uploadP6(fileInput.files[0], function () {})
    }
    else ElMessage({
        message: '请先选择文件！',
        type: 'warning',
    });
}
function uploadP6(file, callback) {
    Gantt.importFromPrimaveraP6({
        server:"https://dls.4dlp.com.cn:7102/import/",
        data: file,
        taskProperties: [
            "ID",
            "WBS",
            "ActivityStatus",
            "ActivityID",
            "Summary",
            "Milestone",
        ],
        callback: function (project) {
            console.log(project)
            if (project) {
                const ActivityStatusList = {
                    NOT_STARTED: "未开始",
                    IN_PROGRESS: "进行中",
                    COMPLETED: "已完成"
                }
                Gantt.clearAll();
                // if (project.config.duration_unit) {
                //     Gantt.config.duration_unit = project.config.duration_unit;
                // }
                project.data.data.forEach(el => {
                    if(el.parent < 1) el.text = projectName
                    el.taskStatus = el.$custom_data.ActivityStatus && ActivityStatusList[el.$custom_data.ActivityStatus]
                    el.taskCode = el.$custom_data.ActivityID && el.$custom_data.ActivityID.split('').splice(1).join('')
                    el.wbsCode = el.$custom_data.WBS && el.$custom_data.WBS.split('.').splice(1).join('.') && `.${el.$custom_data.WBS.split('.').splice(1).join('.')}`
                    el.targetDrtnHrCnt = el.duration
                    el.targetStartDate = el.start_date = el.start_date && el.start_date.substring(0, 10) || ""
                    if(el.targetDrtnHrCnt > 0) {
                        el.targetEndDate = Gantt.calculateEndDate({start_date: new Date(el.start_date), duration: el.duration})
                        el.type = "task"
                    } else {
                        el.type = "milestone"
                    }
                })
                Gantt.parse(project.data);
                Gantt.sort("firstItem", true)
                fileDnD.hideOverlay();
                loading.value = false
            } else {
                ElMessage({
                    message: '导入文件格式错误，请尝试其他导入！',
                    type: 'warning',
                });
                fileDnD.hideOverlay();
                loading.value = false
            }
        }
    });
}
// 导入Excel文件
function importExcel() {
    var fileInput = document.getElementById("file-upload");
    if (fileInput.files[0]) {
        loading.value = true
        fileDnD.showUpload();
        uploadExcel(fileInput.files[0], function () {})
    }
    else ElMessage({
        message: '请先选择文件！',
        type: 'warning',
    });
}
function uploadExcel(file, callback) {
    Gantt.importFromExcel({
        server:"https://dls.4dlp.com.cn:7102/export/gantt",
        data: file,
        callback: function (project) {
            console.log(project)
            debugger;
            if (project) {
                Gantt.clearAll();
                const date = new Date()
                const nowDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate() + " 00:00:00"
                const parentList = {}
                project.forEach(el => {
                    el.id = Gantt.uid()
                    if(parentList[el['WBS编号']]) {
                        el.parent = parentList[el['WBS编号']]
                    } else if(parentList[el['WBS编号'].split('.').slice(0, -1).join('.')]) {
                        el.parent = parentList[el['WBS编号'].split('.').slice(0, -1).join('.')]
                        parentList[el['WBS编号']] = el.id
                    } else {
                        el.parent = 0
                        parentList[el['WBS编号']] = el.id
                    }
                    el.text = el['作业名称']
                    if(el['作业负责人']) {
                        const obj = taskOwnerOptions.value.find(_el => _el.label === el['作业负责人'])
                        if(obj) {
                            el.taskOwner = obj.key
                        }
                    }
                    if(el.parent < 1) el.text = projectName
                    // el.taskCode = el.$custom_data.ID && (el.$custom_data.ID + 0)
                    el.wbsCode = el['WBS编号'] && el['WBS编号'].split('.').splice(1).join('.') && `.${el['WBS编号'].split('.').splice(1).map(el => Number(el)).join('.')}`
                    if(el['里程碑类型']) el.taskMilestoneType = el['里程碑类型']
                    el.duration = el.targetDrtnHrCnt = el['计划工期']
                    el.start_date = el['计划开始'] || nowDate
                    el.targetStartDate = el.start_date && el.start_date.substring(0, 10) || ""
                    if(el.targetDrtnHrCnt > 0) {
                        el.targetEndDate = Gantt.calculateEndDate({start_date: new Date(el.start_date), duration: el.duration})
                        el.type = "task"
                    } else {
                        el.type = "milestone"
                    }
                })
                Gantt.parse({data: project});
                Gantt.sort("firstItem", true)
                fileDnD.hideOverlay();
                open()
                loading.value = false
            } else {
                ElMessage({
                    message: '导入文件格式错误，请尝试其他导入！',
                    type: 'warning',
                });
                fileDnD.hideOverlay();
                loading.value = false
            }
        }
    });
}

// Excel数据转换
function transformExcelData(excelData) {
    console.log(excelData)
}

function saveTask() {
    const dataForm = Gantt.serialize()
    dataForm.projectId = projectId
    dataForm.userName = userName
    dataForm.data.forEach((el, index) => {
        el.serialNumber = index + 1
        // el.targetStartDate = `${el.start_date.substring(6, 10)}-${el.start_date.substring(3, 5)}-${el.start_date.substring(0, 2)}`
        el.targetStartDate = `${el.start_date.substring(0, 10)}`
        el.targetDrtnHrCnt = el.duration
        el.targetEndDate = new Date(el.end_date)
        let task = Gantt.getTask(el.id)
        el.drivingPathFlag = Gantt.isCriticalTask(task) && "Y" || "N"
        el.freeFloatHrCnt = Gantt.getFreeSlack(task)
        el.totalFloatHrCnt = Gantt.getTotalSlack(task)
    });
    axios.saveGanttData(dataForm)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage({
                message: '保存成功！',
                type: 'success',
            })
        }else {
            ElMessage.error(res.data.msg)
        }
    })
}
</script>

<style lang="scss">
@import "../utils/gantt/dhtmlxgantt.css";
@import "../utils/gantt/snippets/dhx_file_dnd.css";

.custom-delete-btn {
    padding: 6px 20px;
    background: #ff5252;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}
.custom-delete-btn:hover {
    background: #ff1744;
}

.gantt_task_cell.week_end, .gantt_task_cell.no_work_hour {
    background-color: var(--dhx-gantt-base-colors-background-alt);
}

.gantt_task_row.gantt_selected .gantt_task_cell.week_end {
    background-color: var(--dhx-gantt-base-colors-select);
}
.nested_task .gantt_add {
    display: none !important;
}
.no-editor-row .gantt_editor {
    pointer-events: none !important;
    background-color: #f5f5f5 !important;
}

.dhx_menu {
    max-height: 400px;
    overflow: auto;
}

.gantt_grid_head_add {
    cursor: default;
}
.gantt_grid_head_add::before {
    display: none;
}

.gantt-calendar {
    width: 100%;
    height: 853px;
    display: flex;
    .gantt-calendar-left {
        overflow: auto;
        height: 100%;
        width: 400px;
        padding: 30px 0px;
        margin: -20px 0px;
        border-right: 1px solid #cecece;
        .gantt-calendar-left-header {
            font-size: 28px;
            line-height: 28px;
            font-weight: bold;
            border-bottom: 1px solid #cecece;
            padding: 0px 15px;
            padding-bottom: 40px;
            margin-left: -20px;
            display: flex;
            align-items: center;
            justify-content: center;
            > div {
                margin: 0px 30px;
            }
        }
        .gantt-calendar-left-body {
            padding: 20px;
            margin-left: -20px;
            .gantt-calendar-left-body-title {
                display: flex;
                align-items: center;
                font-size: 20px;
                line-height: 20px;
                margin-bottom: 20px;
                > i {
                    margin-right: 5px;
                }
            }
            .gantt-calendar-left-body-item {
                border: 1px solid #cecece;
                border-radius: 10px;
                margin-bottom: 10px;
                padding: 15px;
                cursor: pointer;
                .gantt-calendar-left-body-item-top {
                    // font-size: 16px;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    >div:first-child {
                        font-size: 20px;
                        line-height: 20px;
                    }
                    .gantt-calendar-left-body-item-top-buttons {
                        display: flex;
                        align-items: center;
                        > div {
                            // cursor: default;
                            background-color: rgb(243.9, 244.2, 244.8);
                            border-radius: 5px;
                            padding: 5px 10px;
                            margin-right: 10px;
                            display: flex;
                            align-items: center;
                            i {
                                margin-right: 5px;
                            }
                        }
                    }
                    .projectCalendar-buttons {
                        > div {
                            color: #67c23a;
                            background-color: rgb(239.8, 248.9, 235.3);
                            border: 1px solid rgb(224.6, 242.8, 215.6);
                        }
                    }
                    .selected {
                        > div {
                            color: #409eff;
                            background-color: rgb(236, 245, 255);
                            margin-right: 0px;
                        }
                    }
                }
                .gantt-calendar-left-body-item-bottom {
                    > span {
                        margin-right: 5px
                    }
                }
                .gantt-calendar-left-body-item-special {
                    margin-top: 10px;
                }
            }
            .gantt-calendar-left-body-item:hover {
                border-color: #73cfcf;
                background-color: #c0f2f2;
                // opacity: 0.5;
            }
            .active {
                border-color: #73cfcf;
                background-color: #c0f2f2;
            }
        }
    }
    .gantt-calendar-right {
        overflow-x: hidden;
        height: 100%;
        width: 950px;
        margin: auto;
        .gantt-calendar-right-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 0px 57px 12px 50px;
            border-bottom: 1px solid #cecece;
            margin: 0px -38px;
            margin-right: -57px;
            >div:first-child {
                display: flex;
                align-items: center;
                font-size: 28px;
                line-height: 28px;
                font-weight: bold;
                > i {
                    margin-right: 10px;
                }
                > div {
                    >div:last-child {
                        font-size: 16px;
                        font-weight: 400;
                    }
                    >div:first-child {
                        font-size: 28px;
                        font-weight: bold;
                    }
                }
            }
            >div:last-child {
                i {
                    margin-right: 5px;
                }
            }
        }
        .el-calendar {
            margin-top: 20px;
            border-bottom: 1px solid #cecece;
            .el-calendar__header {
                border-bottom: 0px;
                font-size: 20px;
                font-weight: bold;
            }
            .el-calendar-table >thead th {
                text-align: center;
            }
            .el-calendar-table td {
                border: 0px;
            }
            .el-calendar-table td.is-selected {
                background-color: white;
            }
            .el-calendar-day {
                border-radius: 20px;
                padding: 0px;
                margin: 5px; 
                background-color: rgb(239.8, 248.9, 235.3);
                .calendar-day {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .weekend {
                    border-radius: 20px;
                    background-color: rgb(243.9, 244.2, 244.8);
                }
            }
        }
        .gantt-calendar-right-footer {
            margin-top: 30px;
            margin-bottom: 20px;
            .gantt-calendar-right-footer-title {
                font-size: 20px;
                line-height: 20px;
                margin-right: 20px;
            }
            .gantt-calendar-right-footer-item {
                margin-top: 20px;
                margin-bottom: 10px;
                display: flex;
                font-size: 20px;
                line-height: 20px;
                display: flex;
                align-items: center;
                >div {
                    margin-left: 10px;
                    width: 400px;
                }
            }
        }   
    }
}
// html, body {
//     --dhx-gantt-task-border-radius:0;
//     --dhx-gantt-task-background: blue;
//     --dhx-gantt-link-background: blue;
// }

// .custom-project {
//     position: absolute;
//     height: 6px;
//     color: #ffffff;
//     background-color: #444444;
// }

// .custom-project div {
//     position: absolute;
// }

// .project-left, .project-right {
//     top: 6px;
//     background-color: transparent;
//     border-style: solid;
//     width: 0px;
//     height: 0px;
// }

// .project-left {
//     left: 0px;
//     border-width: 0px 0px 8px 7px;
//     border-top-color: transparent;
//     border-right-color: transparent !important;
//     border-bottom-color: transparent !important;
//     border-left-color: #444444 !important;
// }

// .project-right {
//     right: 0px;
//     border-width: 0px 7px 8px 0px;
//     border-top-color: transparent;
//     border-right-color: #444444;
//     border-bottom-color: transparent !important;
//     border-left-color: transparent;
// }

// .project-line {
//     font-weight: bold;
// }


// .gantt_grid_data .gantt_cell {
//     border-right: 1px solid #ECECEC;
// }

// .gantt_grid_data .gantt_cell.gantt_last_cell {
//     border-right: none;
// }

// .gantt_tree_icon.gantt_folder_open,
// .gantt_tree_icon.gantt_file,
// .gantt_tree_icon.gantt_folder_closed {
//     display: none;
// }

// .gantt_task .gantt_task_scale .gantt_scale_cell, .gantt_grid_scale .gantt_grid_head_cell {
//     color: #5C5C5C;
// }

// .gantt_row, .gantt_cell {
//     border-color: #cecece;
// }

// .gantt_grid_scale .gantt_grid_head_cell {
//     border-right: 1px solid #cecece !important;
// }

// .gantt_grid_scale .gantt_grid_head_cell.gantt_last_cell {
//     border-right: none !important;
// }

// .gantt_task_row, .gantt_task_cell {
//     border: none;
// }

.weekend {
    background-color: rgb(239.8, 248.9, 235.3);
}
</style>