<template>
    <div style="display: flex">
        <div>
            <div style="margin-left: 10px; margin-bottom: 10px;" class="table_title">项目名称</div>
            <el-select
                multiple
                collapse-tags
                class="title_search"
                placeholder="请选择项目名称"
                v-model="searchXMMC"
                @change="projectInfoSearchChange">
                <el-option
                    v-for="item in XMMCOption"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </div>
        <div>
            <div style="margin-left: 10px; margin-bottom: 10px;" class="table_title">整改状态</div>
            <el-select
                multiple
                collapse-tags
                class="title_search"
                placeholder="请选择整改状态"
                v-model="searchZGZT"
                @change="projectInfoSearchChange">
                <el-option
                    v-for="item in ZGZTOption"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </div>
    </div>
    <div class="table_title">质量问题</div>
    <div class="project_info_block">
        <el-table
            :data="tableData"
            style="width: 100%; max-height: 100%; background-color: unset;"
            border show-summary
            :summary-method="getSummaries"
            header-row-class-name="table_title-header-row"
            row-class-name="table_title-row">
            <el-table-column align="center" label="序号" type="index" width="100">
                <template #default="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
        </el-table>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
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

let searchXMMC = ref([])
let searchZGZT = ref([])
let XMMCOption = ref([])
let ZGZTOption = ref(["已整改", "未整改"])

let tableColumn = [
    {prop: "XMMC", label: "项目名称"},
    {prop: "XMJL", label: "项目经理"},
    {prop: "ZGZT", label: "整改状态"},
    {prop: "JCRY", label: "检查人员"},
    {prop: "JCRQ", label: "检查日期"},
    {prop: "YQZGWCSJ", label: "要求整改完成日期"},
    {prop: "ZLWTMS", label: "质量问题描述", width: 450 * fontSize},
    {prop: "ZGZRDW", label: "整改责任单位"},
    {prop: "ZGZRR", label: "整改责任人"},
    {prop: "ZGWCSJ", label: "整改完成时间"},
    {prop: "ZGWCQKMS", label: "整改完成情况描述", width: 450 * fontSize},
]
let allTableData = ref([])
let tableData = ref([])

onMounted(() => {
    let str = `viewName=CRRC_JSC_DB_ZLWT`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res?.data?.data || [];
        tableData.value = allTableData.value
        XMMCOption.value = [...new Set(allTableData.value.map(item => item.XMMC))]
    })
});

const getSummaries = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计';
        } else if (index > 10) {
            sums[index] = tableData.value.length;
        }
    });
    return sums;
}

function projectInfoSearchChange() {
    tableData.value = allTableData.value
    if(searchZGZT.value.length)
    tableData.value = tableData.value.filter(item => searchZGZT.value.includes(item.ZGZT))
    if(searchXMMC.value.length)
    tableData.value = tableData.value.filter(item => searchXMMC.value.includes(item.XMMC))
}

</script>

<style lang="scss" scoped>
.table_title {
    font-size: 18px;
    // color: white;
    margin-top: 10px;
}
.project_info_block {
    margin: 10px 10px 25px;
    height: calc(100% - 102px);
}

:deep(.el-table:before), :deep(.el-table:after), :deep(.el-table__inner-wrapper:before), :deep(.el-table__inner-wrapper:after), :deep(.el-table__border-left-patch) {
    // height: 0px!important;
    background-color: rgb(59, 222, 245);
}
:deep(.table_title-header-row) {
    color: rgb(12, 31, 75);
    .el-table__cell {
        background-color: unset;
        background-color: rgb(59, 222, 245);
        // border: 0px;
        border-color: rgb(59, 222, 245)!important;
        font-size: 16px;
    }
}
// :deep(.table_title-row) {
//     background-color: unset!important;
//     color: white;
//     .el-table__cell {
//         background-color: unset!important;
//         // border: 0px;
//         border-color: rgb(59, 222, 245);
//         font-size: 18px;
//     }
// }
// :deep(.table_title-row:hover) {
//     .el-table__cell {
//         background-color: unset!important;
//     }
// }
:deep(.el-table__footer) {
    .el-table__cell {
        color: rgb(12, 31, 75);
        font-weight: bold;
        font-size: 16px;
        background-color: rgb(59, 222, 245);
        border: 0px;
    }
}
</style>