<template>
<div v-loading="loading" style="height: 100%;">
    <div style="height: 40px; display: flex; justify-content: center; align-items: center">
        <el-button @click="undo">撤销</el-button>
        <el-button @click="redo">恢复撤销</el-button>
        <el-button @click="zoomIn">减小范围</el-button>
        <el-button @click="zoomOut">增大范围</el-button>
        <el-button @click="updateCriticalPath">{{ criticalPathText }}</el-button>
        <el-button @click="exportToPDF">导出到PDF</el-button>
        <el-button @click="exportToPNG">导出到PNG</el-button>
        <el-button @click="saveTask">保存数据</el-button>
    </div>
    <div style="height: calc(100% - 60px); margin: 20px; margin-top: 0px" ref="gantt"></div>
</div>
</template>

<script setup>
// import Gantt from "dhtmlx-gantt";
import Gantt from "../utils/gantt/dhtmlxgantt.js";
import { nextTick, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "../assets/axios/GanttPage.js"
const ganttDom = useTemplateRef('gantt')
const loading = ref(true)
let projectId = ""
let userName = window.parent._P ? window.parent._P.userId || '测试' : '测试'
// 甘特图数据和线的数据和基线数据
const tasks = reactive({
    data: [
        {id: 1, text: "Office itinerancy", open: true, type: "project", wbsCode: ".1", taskCode: "", taskType: "", taskMilestoneType: "", constraint_type: "", constraint_date: "", taskStatus: "", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "", targetDrtnHrCnt: "", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时1", totalFloatHrCnt: "总浮时1", taskComplete: "20", progress: '0.2'},
        {id: 2, text: "Office facing", start_date: "", wbsCode: ".1", taskCode: "1000", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-22", targetDrtnHrCnt: "20", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时2", totalFloatHrCnt: "总浮时2", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 3, text: "Furniture installation", start_date: "", wbsCode: ".1", taskCode: "1010", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-22", targetDrtnHrCnt: "5", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时3", totalFloatHrCnt: "总浮时3", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 4, text: "The employee relocation", start_date: "", wbsCode: ".1", taskCode: "1020", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-29", targetDrtnHrCnt: "15", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时4", totalFloatHrCnt: "总浮时4", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 5, text: "Interior office", start_date: "", wbsCode: ".1", taskCode: "1030", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-29", targetDrtnHrCnt: "15", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时5", totalFloatHrCnt: "总浮时5", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 6, text: "Air conditioners installation", start_date: "", wbsCode: ".1", taskCode: "1040", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-08-19", targetDrtnHrCnt: "2", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时6", totalFloatHrCnt: "总浮时6", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 7, text: "Workplaces preparation", start_date: "", wbsCode: ".1", taskCode: "1050", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-08-21", targetDrtnHrCnt: "2", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时7", totalFloatHrCnt: "总浮时7", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 8, text: "Preparing workplaces for us", start_date: "", wbsCode: ".1", taskCode: "1060", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-07-22", targetDrtnHrCnt: "10", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时8", totalFloatHrCnt: "总浮时8", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 9, text: "Workplaces importation", start_date: "", wbsCode: ".1", taskCode: "1070", taskType: "WBS", taskMilestoneType: "项目里程碑", constraint_type: "", constraint_date: "", taskStatus: "未开始", taskPhase: "", taskPosition: "", taskOwner: "", targetStartDate: "2025-08-23", targetDrtnHrCnt: "1", targetEndDate: "", actStartDate: "", actWorkQty: "", remainDrtnHrCnt: "", actEndDate: "", freeFloatHrCnt: "自由浮时9", totalFloatHrCnt: "总浮时9", taskComplete: "20", duration: "", parent: "1", progress: '0.2'},
        {id: 18, text: "Mediate milestone", wbsCode: ".1", start_date: "29-08-2025 00:00", duration: 0, type: "milestone", parent: "1", progress: 0, open: true, duration: 0},
        {id: 19, text: "Final milestone", wbsCode: ".1", start_date: "29-08-2025 00:00", duration: 0, type: "milestone", parent: "1", progress: 0, open: true, duration: 0}
    ],
    links: [
        {id: "1", source: "3", target: "4", type: "0"},
        {id: "2", source: "3", target: "5", type: "0"},
        {id: "3", source: "2", target: "6", type: "0"},
        {id: "4", source: "4", target: "6", type: "0"},
        {id: "5", source: "5", target: "6", type: "0"},
        {id: "6", source: "6", target: "7", type: "0"},
        {id: "7", source: "7", target: "9", type: "0"},
        {id: "8", source: "8", target: "9", type: "0"},
        {id: "9", source: "9", target: "10", type: "0"},
        {id: "10", source: "9", target: "11", type: "0"},
        {id: "11", source: "9", target: "12", type: "0"},
        {id: "12", source: "11", target: "13", type: "0"},
        {id: "13", source: "12", target: "13", type: "0"},
        {id: "14", source: "13", target: "14", type: "0"},
        {id: "15", source: "13", target: "15", type: "0"},
        {id: "16", source: "15", target: "17", type: "0"},
        {id: "17", source: "16", target: "17", type: "0"}
    ],
    baselines: [
        { id: 1, task_id: 1, start_date: "20-07-2025 00:00:00", duration: 3 },
        { id: 2, task_id: 2, start_date: "25-07-2025 00:00:00", duration: 2 },
    ],
})
// 时间范围配置
const zoomConfig = {
    levels: [
        {
            name:"day",
            scale_height: 27,
            min_column_width:80,
            scales:[
                {unit: "day", step: 1, format: "%d %M"}
            ]
        },
        {
            name:"week",
            scale_height: 50,
            min_column_width:50,
            scales:[
                {unit: "week", step: 1, format: function (date) {
                    var dateToStr = Gantt.date.date_to_str("%d %M");
                    var endDate = Gantt.date.add(date, 7 - date.getDay(), "day");
                    var weekNum = Gantt.date.date_to_str("%W")(date);
                    return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
                }},
                {unit: "day", step: 1, format: "%j %D"}
            ]
        },
        {
            name:"month",
            scale_height: 50,
            min_column_width:120,
            scales:[
                {unit: "month", format: "%F, %Y"},
                {unit: "week", format: "Week #%W"}
            ]
        },
        {
            name:"quarter",
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
            scale_height: 50,
            min_column_width: 30,
            scales:[
                {unit: "year", step: 1, format: "%Y"}
            ]
        }
    ]
};
let modal;
let editLinkId;

onMounted(() => {
    projectId = window.parent._P ? window.parent._P.projectId || '1010' : '1010'
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
    taskPhaseOptions = option1.data.data
    taskPhaseOptions.forEach(el => {
        el.label = el.key
    })
    taskOwnerOptions = option2.data.data
    taskOwnerOptions.forEach(el => {
        el.label = el.CRRC_USER_QM
    })
    const res = await axios.getGanttData(projectId)
    tasks.data = res.data.data.data
    tasks.baselines = res.data.data.baselines
    tasks.links = res.data.data.links
    if(tasks.data.length < 1) {
        tasks.data.push({
            id: 1,
            text: "新项目",
            open: true,
            type: "project",
            wbsCode: ".1",
            taskCode: "",
            taskType: "",
            taskMilestoneType: "",
            constraint_type: "",
            constraint_date: "",
            taskStatus: "",
            taskPhase: "",
            taskPosition: "",
            taskOwner: "",
            targetStartDate: "",
            targetDrtnHrCnt: "",
            targetEndDate: "",
            actStartDate: "",
            actWorkQty: "",
            remainDrtnHrCnt: "",
            actEndDate: "",
            freeFloatHrCnt: "自由浮时1",
            totalFloatHrCnt: "总浮时1",
            taskComplete: "20",
            progress: '0.2'
        })
    }
    // projectId = window.location.href.split("=")[1]
    tasks.data.forEach(el => {
        el.open = true
        el.targetStartDate = el.targetStartDate && el.targetStartDate.substring(0, 10) || ""
        // el.targetEndDate = el.targetEndDate.substring(0, 10)
        el.targetEndDate = el.targetStartDate && el.targetDrtnHrCnt && new Date(new Date(el.targetStartDate).getTime() + (el.targetDrtnHrCnt * 24 * 60 * 60 * 1000)) || ""
        el.start_date = el.targetStartDate && `${el.targetStartDate.substring(8, 10)}-${el.targetStartDate.substring(5, 7)}-${el.targetStartDate.substring(0, 4)}` || el.start_date
        el.duration = el.targetDrtnHrCnt || el.duration
    })
    _initGanttEvents()
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
    // 初始化导出
    _inExport()
    // 初始化双击线
    _inLinkConfig()
    // 动态数据
    dynamicData()
    // 样式风格
    Gantt.setSkin("material");

    // 鼠标拖动时间轴
    Gantt.config.open_split_tasks = true;
    // Gantt.config.drag_move = false;
    Gantt.locale.labels.section_priority = "Priority";
    Gantt.config.multiselect = true;
    Gantt.config.click_drag = {
        callback: onDragEnd,
        singleRow: true
    }
    // Gantt.locale.labels["complete_button"] = "Complete";
    // 清除删除按钮
    Gantt.attachEvent("onGanttReady", function(){
        Gantt.config.buttons_left = [];
    });
    Gantt.config.work_time = true;
	Gantt.config.details_on_create = false
    // 动态时间轴
	Gantt.ext.zoom.init(zoomConfig);
	Gantt.ext.zoom.setLevel("day");
    // 配置表格列
    _inConfigColumns()
    Gantt.i18n.setLocale("cn");
    // 初始化dom
    Gantt.init(ganttDom.value);
    // 填入数据
    Gantt.parse(tasks)
    loading.value = false
    nextTick(() => {
        // 删除表头添加按钮
        document.querySelector(".gantt_grid_head_add").style.display = "none";
    })
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
    }
    else {
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
    {key: "WBS", label: "WBS"},
    {key: "任务相关", label: "任务相关"},
    {key: "开始里程碑", label: "开始里程碑"},
    {key: "完成里程碑", label: "完成里程碑"}
]
// 里程碑类型
const taskMilestoneTypeOptions = [
    {key: "项目里程碑", label: "项目里程碑"},
    {key: "关键节点", label: "关键节点"},
    {key: "合同节点", label: "合同节点"}
]
// 作业状态
const taskStatusOptions = [
    {key: "未开始", label: "未开始"},
    {key: "进行中", label: "进行中"},
    {key: "已完成", label: "已完成"}
]
// 作业阶段
let taskPhaseOptions = [
    {key: "0", label: "作业阶段"},
    {key: "1", label: "作业阶段1"},
    {key: "2", label: "作业阶段2"},
]
// 作业负责人
let taskOwnerOptions = [
    {key: "0", label: "负责人1"},
    {key: "1", label: "负责人2"},
    {key: "2", label: "负责人3"},
]
// 约束类型
const constraint_type_option = [
    // { key: "", label: "" },
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
		return "Export " + task.text;
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

function dynamicData() {
    // 添加新任务
    // Gantt.attachEvent("onTaskCreated", function(task){
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
            task.taskType = "WBS"
            task.taskMilestoneType = "项目里程碑"
            task.taskStatus = "未开始"
            task.taskPhase = ""
            task.taskPosition = ""
            task.taskOwner = ""
            task.targetDrtnHrCnt = '1'
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
                    dataForm.taskCode = ""
                    dataForm.taskType = ""
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
                const childData = taskList.filter(el => el.parent === task.parent)[0]
                Gantt.getTask(childData.id).wbsCode = wbsCode
                Gantt.updateTask(childData.id)
                task.wbsCode = wbsCode
                task.targetStartDate = dataForm.start_date
                task.targetEndDate = new Date(new Date(task.targetStartDate).getTime() + (task.targetDrtnHrCnt * 24 * 60 * 60 * 1000))
            }
            task.taskCode = `${Math.max(...taskCodeList)}`
            nextTick(() => {
                // 删除表头添加按钮
                document.querySelector(".gantt_grid_head_add").style.display = "none";
            })
        }
        //在这里放置任何自定义逻辑
    });
    // 删除数据后
    Gantt.attachEvent("onAfterTaskDelete", function(id, item){
        const obj = Gantt.serialize().data.find(el => el.parent === item.parent);
        if(!obj) {
            const dataForm = Gantt.getTask(item.parent)
            if(dataForm.parent > 0) {
                dataForm.wbsCode = Gantt.getTask(dataForm.parent).wbsCode
                dataForm.taskCode = item.taskCode || item.parentTaskCode
                dataForm.taskType = "WBS"
                dataForm.taskMilestoneType = "项目里程碑"
                dataForm.taskStatus = "未开始"
                dataForm.taskPhase = ""
                dataForm.taskPosition = ""
                dataForm.taskOwner = ""
                dataForm.targetStartDate = dataForm.start_date
                dataForm.targetDrtnHrCnt = dataForm.duration
                dataForm.targetEndDate = dataForm.end_date
                dataForm.type = ""
                dataForm.constraint_type = "asap"
                Gantt.updateTask(item.parent)
            }
        }
        nextTick(() => {
            // 删除表头添加按钮
            document.querySelector(".gantt_grid_head_add").style.display = "none";
        })
    });
    // // 取消新增
    // Gantt.attachEvent("onLightboxCancel", function(id, type){
    //     const dataForm = Gantt.getTask(id)
    //     if(type && !Gantt.serialize().data.find(el => el.parent == id) && dataForm.parent && !Gantt.serialize().data.find(el => el.parent == dataForm.parent && el.id !== id)){
    //         const parentDataForm = Gantt.getTask(dataForm.parent)
    //         parentDataForm.taskCode = dataForm.taskCode
    //         parentDataForm.wbsCode = Gantt.getTask(parentDataForm.parent).wbsCode
    //         Gantt.updateTask(dataForm.parent)
    //     }
    // })

    // 自定义删除按钮
    Gantt.attachEvent("onLightbox", function(id){
        if (typeof id === "string" && !Gantt.getTask(id).type) {
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
        nextTick(() => {
            // 删除表头添加按钮
            document.querySelector(".gantt_grid_head_add").style.display = "none";
        })
        return true;
    });
    // 拖拽列
    Gantt.attachEvent("onColumnResizeEnd", function(index, column, new_width){
        nextTick(() => {
            // 删除表头添加按钮
            document.querySelector(".gantt_grid_head_add").style.display = "none";
        })
        return true;
    });
    // 拖拽表格
    Gantt.attachEvent("onGridResizeEnd", function(old_width, new_width){
        nextTick(() => {
            // 删除表头添加按钮
            document.querySelector(".gantt_grid_head_add").style.display = "none";
        })
        return true;  
    });
}

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
	Gantt.serverList("taskOwnerOptions", taskOwnerOptions);
	Gantt.serverList("constraint_type_option", constraint_type_option);
    Gantt.attachEvent("onAfterTaskUpdate", function(id, task){
        const startDate = task.start_date
        const endDate = task.end_date
        task.targetStartDate = `${startDate.getFullYear()}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`
        task.targetDrtnHrCnt = task.duration != task.targetDrtnHrCnt ? task.duration : task.targetDrtnHrCnt
        task.targetEndDate = `${endDate.getFullYear()}-${(endDate.getMonth()+1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`
        // task.targetStartDate = task.start_date != new Date(task.targetStartDate) ? task.start_date : task.targetStartDate
        // task.targetEndDate = task.end_date != new Date(task.targetEndDate) ? task.end_date : task.targetEndDate
        // Gantt.updateTask(id)
        Gantt.refreshTask(id);
        return true;
    });
    Gantt.config.columns = [
        // { name: "projectId", label: "项目ID", tree: true },
        // editor: {type: "text", map_to: "wbsCode"}   表格编辑框
        { name: "wbsCode", label: "WBS编码", align: "center", template: wbsCodeLabel, tree: true, resize: true },
        // { name: "wbs", label: "WBS", template: Gantt.getWBSCode }, // 插件自带WBS编码
        { name: "text", label: "作业名称", editor: {type: "text", map_to: "text"}, resize: true },
        { name: "start_date", label: "开始时间", align: "center", hide: true, resize: true },
        { name: "duration", label: "持续时间", align: "center", hide: true, resize: true },
        { name: "taskCode", label: "作业编码", align: "center", template: taskCodeLabel, resize: true },
        // { name: "taskName", label: "作业名称", align: "center", editor: {type: "text", map_to: "taskName"}, resize: true },
        { name: "taskType", label: "作业类型", align: "center", editor: {type: "select", map_to: "taskType", options:Gantt.serverList("taskTypeOptions")}, resize: true },
        { name: "taskMilestoneType", label: "里程碑类型", align: "center", editor: {type: "select", map_to: "taskMilestoneType", options:Gantt.serverList("taskMilestoneTypeOptions")}, resize: true },
        { name: "constraint_type", label: "作业约束类型", align: "center", editor: {type: "select", map_to: "constraint_type", options:Gantt.serverList("constraint_type_option")}, template: constraint_type_label, resize: true },
        { name: "constraint_date", label: "作业约束日期", align: "center", editor: {type: "date", map_to: "constraint_date", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, resize: true },
        { name: "taskStatus", label: "作业状态", align: "center", editor: {type: "select", map_to: "taskStatus", options:Gantt.serverList("taskStatusOptions")}, resize: true },
        { name: "taskPhase", label: "作业阶段", align: "center", editor: {type: "select", map_to: "taskPhase", options:Gantt.serverList("taskPhaseOptions")}, resize: true },
        { name: "taskOwner", label: "作业负责人", align: "center", editor: {type: "select", map_to: "taskOwner", options:Gantt.serverList("taskOwnerOptions")}, template: taskOwnerLabel, resize: true },
        { name: "taskPosition", label: "作业负责岗位", align: "center", resize: true },
        { name: "targetStartDate", label: "计划开始", align: "center", editor: {type: "targetStartDate", map_to: "targetStartDate", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, resize: true },
        { name: "targetDrtnHrCnt", label: "计划工期", align: "center", editor: {type: "targetDrtnHrCnt", map_to: "targetDrtnHrCnt"}, resize: true },
        { name: "targetEndDate", label: "计划完成", align: "center", resize: true },
        { name: "actStartDate", label: "实际开始", align: "center", editor: {type: "date", map_to: "actStartDate", min: new Date(2025, 1, 1), max: new Date(2026, 1, 1)}, template: actStartDateLabel, resize: true },
        { name: "actWorkQty", label: "实际工期", align: "center", editor: {type: "number", map_to: "actWorkQty"}, template: actWorkQtyLabel, resize: true },
        { name: "remainDrtnHrCnt", label: "尚需工期", align: "center", editor: {type: "number", map_to: "remainDrtnHrCnt"}, resize: true },
        { name: "actEndDate", label: "实际完成", align: "center", resize: true },
        { name: "freeFloatHrCnt", label: "自由浮时", align: "center", hide: true, resize: true, template: freeFloatHrCntLabel },
        { name: "totalFloatHrCnt", label: "总浮时", align: "center", hide: true, resize: true, template: totalFloatHrCntLabel },
        // taskComplete
        { name: "progress", label: "完成百分比", align: "center", template: function(obj) {
            return obj.progress;
        }, editor: {type: "number", map_to: "progress", min:0, max: 1}},
        { name: "add", label: "" }
        // { name: "add", label: "", hide: true }
    ];
    Gantt.templates.grid_row_class = ( start, end, task ) => {
        if ( task.type === "milestone" ) {
            return "nested_task"
        }
        return "";
    };
    Gantt.config.editor_types.targetStartDate = {
        show: function (id, column, config, placeholder) {
            let max = config.max
            let min = config.min
            var html = "<div style='width:140px' role='cell'><input type='date' min='" + min + 
                        "' max='" + max + "' name='" + column.name + "'></div>";
            placeholder.innerHTML = html;
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("input").value = value;
        },
        get_value: function (id, column, node) {
            return node.querySelector("input").value || 0;
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            const dataForm = Gantt.getTask(id)
            dataForm.start_date = new Date(`${currentValue} 00:00:00`)
            // `${currentValue.substring(8, 10)}-${currentValue.substring(5, 7)}-${currentValue.substring(0, 4)}`
            if(dataForm.targetDrtnHrCnt) {
                dataForm.duration = dataForm.targetDrtnHrCnt
                dataForm.targetEndDate = new Date(new Date(dataForm.start_date).getTime() + (dataForm.targetDrtnHrCnt * 24 * 60 * 60 * 1000))
                dataForm.end_date = dataForm.targetEndDate
            }
            Gantt.updateTask(id)
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("input");
            if (!input) {
                return;
            }
            if (input.focus) {
                input.focus();
            }
    
            if (input.select) {
            input.select();
            }
        }
    }
    Gantt.config.editor_types.targetDrtnHrCnt = {
        show: function (id, column, config, placeholder) {
            let max = config.max
            let min = config.min
            var html = "<div style='width:140px' role='cell'><input type='number' min='" + min + 
                        "' max='" + max + "' name='" + column.name + "'></div>";
            placeholder.innerHTML = html;
        },
        hide: function () {},
        set_value: function (value, id, column, node) {
            node.querySelector("input").value = value;
        },
        get_value: function (id, column, node) {
            return node.querySelector("input").value || 0;
        },
        is_changed: function (value, id, column, node) {
            var currentValue = this.get_value(id, column, node);
            const dataForm = Gantt.getTask(id)
            dataForm.duration = currentValue
            dataForm.targetEndDate = new Date(new Date(`${dataForm.targetStartDate} 00:00:00`).getTime() + (currentValue * 24 * 60 * 60 * 1000))
            dataForm.end_date = dataForm.targetEndDate
            Gantt.updateTask(id)
            return value !== currentValue;
        },
        is_valid: function (value, id, column, node) {
            return true
        },
        focus: function (node) {
            var input = node.querySelector("input");
            if (!input) {
                return;
            }
            if (input.focus) {
                input.focus();
            }
    
            if (input.select) {
            input.select();
            }
        }
    }
}

const projectCode = window.parent._P && window.parent._P.shell_info && window.parent._P.shell_info.shellnumber || "A-DLS-1-01"
// 表格框修改数据
function wbsCodeLabel(task) {
    return projectCode + task.wbsCode
}
function taskCodeLabel(task) {
    return task.taskCode && `A${task.taskCode}`
}
function constraint_type_label(task) {
    return task.constraint_type && Gantt.serverList("constraint_type_option").find(el => el.key == task.constraint_type).label
}
function taskPhaseLabel(task) {
    return task.taskPhase && Gantt.serverList("taskPhaseOptions").find(el => el.key == task.taskPhase).label
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
        var currentTask = tasksInRow[0];
        if (currentTask.type === "project") {
            currentTask.render = "split";
            Gantt.addTask({
                text: "Subtask of " + currentTask.text,
                start_date: Gantt.roundDate(startDate),
                end_date: Gantt.roundDate(endDate)
            }, currentTask.id);
        } else {
            var projectName = "new Project " + currentTask.text;
            var newProject = Gantt.addTask({
                text: projectName,
                render: "split",
                type: "project",
            }, currentTask.parent);
            Gantt.moveTask(newProject, Gantt.getTaskIndex(currentTask.id), Gantt.getParent(currentTask.id));
            Gantt.moveTask(currentTask.id, 0, newProject);
            Gantt.calculateTaskLevel(currentTask)

            var newTask = Gantt.addTask({
                text: "Subtask of " + projectName,
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

// 撤销
function undo() {
    Gantt.undo()
}
// 恢复撤销
function redo() {
    Gantt.redo()
}

function zoomIn(){
    Gantt.ext.zoom.zoomIn();
    nextTick(() => {
        // 删除表头添加按钮
        document.querySelector(".gantt_grid_head_add").style.display = "none";
    })
}
function zoomOut(){
    Gantt.ext.zoom.zoomOut()
    nextTick(() => {
        // 删除表头添加按钮
        document.querySelector(".gantt_grid_head_add").style.display = "none";
    })
}

// gantt.exportToPNG({ skin:"dark" })broadway skyblue material
// 导出文件
function exportToPDF() {
    Gantt.exportToPDF()
}
function exportToPNG() {
    Gantt.exportToPNG()
}

function saveTask() {
    const dataForm = Gantt.serialize()
    dataForm.projectId = projectId
    dataForm.userName = userName
    dataForm.data.forEach(el => {
        el.targetStartDate = `${el.start_date.substring(6, 10)}-${el.start_date.substring(3, 5)}-${el.start_date.substring(0, 2)}`
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

// .weekend {
//     background: var(--dhx-gantt-base-colors-background-alt);
// }
</style>