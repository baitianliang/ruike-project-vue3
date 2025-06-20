<template>
    <div style="height: calc(100% - 40px); margin: 20px" ref="gantt"></div>
</template>

<script setup>
import Gantt from "dhtmlx-gantt";
import { onMounted, onUnmounted, reactive, useTemplateRef } from 'vue';
const ganttDom = useTemplateRef('gantt')
const tasks = reactive({
    data: [{
        id: "10",
        text: "Project #1",
        start_date: "01-04-2025",
        duration: 3,
        order: 10,
        progress: 0.4,
        open: true,
    },
    {
        id: "1",
        text: "Task #1",
        start_date: "01-04-2025",
        duration: 1,
        order: 10,
        progress: 0.6,
        parent: "10",
    },
    {
        id: "2",
        text: "Task #2",
        start_date: "02-04-2025",
        duration: 2,
        order: 20,
        progress: 0.6,
        parent: "10",
    }],
    links: [{ id: 1, source: 1, target: 2, type: "0" }],
})

onMounted(() => {
    _initGanttEvents()
})
onUnmounted(() => {
    // 销毁甘特图
    if (Gantt.$destroy) {
        Gantt.$destroy();
    }
})

function _initGanttEvents() {
    Gantt.i18n.setLocale("cn");
    Gantt.config.scale_unit = "day";
    Gantt.config.date_scale = "%Y年%m月%d日";
    // 配置表格列
    Gantt.config.columns = [
        { name: "projectId", label: "项目ID", tree: true },
        { name: "start_date", label: "开始时间", align: "center" },
        { name: "duration", label: "持续时间", align: "center" },
        { name: "wbsCode", label: "WBS编码", align: "center" },
        { name: "taskCode", label: "作业编码", align: "center" },
        { name: "taskName", label: "作业名称", align: "center" },
        { name: "taskType", label: "作业类型", align: "center" },
        { name: "taskMilestoneType", label: "里程碑类型", align: "center" },
        { name: "taskConstraintType", label: "作业约束类型", align: "center" },
        { name: "taskConstraintDate", label: "作业约束日期", align: "center" },
        { name: "taskStatus", label: "作业状态", align: "center" },
        { name: "taskPhase", label: "作业阶段", align: "center" },
        { name: "taskPosition", label: "作业负责岗位", align: "center" },
        { name: "taskOwner", label: "作业负责人", align: "center" },
        { name: "targetStartDate", label: "计划开始", align: "center" },
        { name: "targetDrtnHrCnt", label: "计划工期", align: "center" },
        { name: "targetEndDate", label: "计划完成", align: "center" },
        { name: "actStartDate", label: "实际开始", align: "center" },
        { name: "actWorkQty", label: "实际工期", align: "center" },
        { name: "remainDrtnHrCnt", label: "尚需工期", align: "center" },
        { name: "actEndDate", label: "实际完成", align: "center" },
        { name: "freeFloatHrCnt", label: "自由浮时", align: "center" },
        { name: "totalFloatHrCnt", label: "总浮时", align: "center" },

        { name: "taskComplete", label: "完成百分比", align: "center", template: function(obj) {
            return Math.round(obj.progress * 100) + "%";
        }},
        { name: "add", label: "" }
    ];
    Gantt.init(ganttDom.value);
    Gantt.parse(tasks)
    // if (gantt.$_eventsInitialized) return;
    // gantt.attachEvent("onTaskSelected", (id) => {
    //     let task = gantt.getTask(id);
    //     this.$emit("task-selected", task);
    // });
    // gantt.attachEvent("onAfterTaskAdd", (id, task) => {
    //     this.$emit("task-updated", id, "inserted", task);
    //     task.progress = task.progress || 0;
    //     if (gantt.getSelectedId() == id) {
    //         this.$emit("task-selected", task);
    //     }
    // });
    // gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
    //     this.$emit("task-updated", id, "updated", task);
    // });
    // gantt.attachEvent("onAfterTaskDelete", (id) => {
    //     this.$emit("task-updated", id, "deleted");
    //     if (!gantt.getSelectedId()) {
    //         this.$emit("task-selected", null);
    //     }
    // });
    // gantt.attachEvent("onAfterLinkAdd", (id, link) => {
    //     this.$emit("link-updated", id, "inserted", link);
    // });
    // gantt.attachEvent("onAfterLinkUpdate", (id, link) => {
    //     this.$emit("link-updated", id, "updated", link);
    // });
    // gantt.attachEvent("onAfterLinkDelete", (id, link) => {
    //     this.$emit("link-updated", id, "deleted");
    // });
    // gantt.$_eventsInitialized = true;
}
</script>

<style lang="scss">
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
</style>