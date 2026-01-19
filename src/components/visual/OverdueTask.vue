<template>
    <div class="title">
        超期任务提醒
        <div style="margin-left: 10px; color: red">已超期数量: {{ tableData.length }}</div>
    </div>
    <div class="overdue_task_block" v-auto-scroll>
        <el-table
            :data="tableData"
            style="width: 100%; height: 100%; background-color: unset;"
            header-row-class-name="overdue_task-header-row"
            row-class-name="overdue_task-row">
            <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "../../assets/axios/visual.js"

const props = defineProps({
    projectList: {
        type: Array,
    }
})
function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

let tableColumn = [
    {prop: "XMMC", label: "项目名称"},
    {prop: "XMJL", label: "项目经理", width: 120 * fontSize},
    {prop: "ZYMC", label: "作业名称",},
    {prop: "ZYFZR", label: "作业负责人", width: 120 * fontSize},
    {prop: "JHKSSJ", label: "计划开始时间", width: 120 * fontSize},
    {prop: "JHWCSJ", label: "计划完成时间", width: 120 * fontSize},
]
let tableData = ref([])

onMounted(() => {
    getData()
});

function getData() {
    let str = `viewName=CRRC_JSC_CQRWTX`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        tableData.value = res.data.data
        tableData.value = tableData.value.filter(item => item.ZYMC)
    })
}
defineExpose({
    getData
})

</script>

<style lang="scss" scoped>
.overdue_task_block {
    margin: 25px 10px;
    height: calc(100% - 70px);
}
:deep(.el-table__inner-wrapper:before) {
    height: 0px!important;
}
:deep(.overdue_task-header-row) {
    background-color: unset;
    color: white;
    .el-table__cell {
        background-color: unset;
        border: 0px;
        font-size: 16px;
    }
}
:deep(.overdue_task-row) {
    background-color: unset;
    color: red;
    .el-table__cell {
        background-color: unset;
        border: 0px;
        font-size: 18px;
    }
}
:deep(.overdue_task-row:hover) {
    .el-table__cell {
        background-color: unset!important;
    }
}
</style>