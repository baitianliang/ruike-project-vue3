<template>
    <el-select
        multiple
        collapse-tags
        class="title_search"
        v-model="projectInfoSearch"
        @change="projectInfoSearchChange">
        <el-option
            v-for="item in allTableData"
            :key="item.XMMC"
            :label="item.XMMC"
            :value="item.XMMC"
        />
    </el-select>
    <div class="table_title">年度销售收入</div>
    <div class="project_info_block">
        <el-table
            :data="tableData"
            style="width: 100%; max-height: 100%; background-color: unset;"
            border show-summary
            :summary-method="getSummaries"
            header-row-class-name="table_title-header-row"
            row-class-name="table_title-row">
            <el-table-column align="center" label="序号" type="index" width="150" />
            <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                <template #default="scope">
                    <span v-if="['NDXSSR_MBZ', 'NDXSSR_SJZ'].includes(item.prop)">{{ `${scope.row[item.prop]}万` }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
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

let projectInfoSearch = ref([])

let tableColumn = [
    {prop: "XMMC", label: "项目名称"},
    {prop: "NDXSSR_MBZ", label: "目标值"},
    {prop: "NDXSSR_SJZ", label: "实际值"},
]
let allTableData = ref([])
let tableData = ref([])
let riskList = ref([])

onMounted(() => {
    // let str = `viewName=CRRC_JSC_XMXX`
    // axios.getFormData(str)
    let str = `viewName=NDXSSR`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res.data.data.list
        tableData.value = [ ...allTableData.value ]
    })
});

function projectInfoSearchChange(val) {
    if(val.length)
    tableData.value = allTableData.value.filter(item => val.includes(item.XMMC))
    else
    tableData.value = allTableData.value
}
const getSummaries = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计';
        } else if (index > 1) {
            const values = data.map((item) => Number(item[column.property]));
            const sum = values.reduce((prev, curr) => prev + curr, 0);
            sums[index] = `${sum}万`;
        }
    });
    return sums;
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