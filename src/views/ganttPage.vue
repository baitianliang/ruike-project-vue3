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
    Gantt.i18n.setLocale("cn");
    Gantt.config.scale_unit = "day";
    Gantt.config.date_scale = "%Y年%m月%d日";
    Gantt.init(ganttDom.value);
    Gantt.parse(tasks)
    _initGanttEvents()
})
onUnmounted(() => {
    // 销毁甘特图
    if (Gantt.$destroy) {
        Gantt.$destroy();
    }
})

function _initGanttEvents() {
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