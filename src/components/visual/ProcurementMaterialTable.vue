<template>
    <el-select
        multiple
        collapse-tags
        class="title_search"
        v-model="projectInfoSearch"
        @change="projectInfoSearchChange">
        <el-option
            v-for="item in tableDataOption"
            :key="item"
            :label="item"
            :value="item"
        />
    </el-select>
    <div class="table_title">项目风险</div>
    <div class="project_info_block">
        <el-table
            :data="tableData"
            style="width: 100%; max-height: 100%; background-color: unset;"
            border
            :span-method="objectSpanMethod"
            header-row-class-name="table_title-header-row"
            row-class-name="table_title-row">
            <el-table-column align="center" label="序号" type="index" width="150">
                <template #default="scope">
                    {{ tableDataOption.indexOf(scope.row.CRRC_XM_XMMC) + 1 }}
                </template>
            </el-table-column>
            <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                <template v-if="item.prop === 'XMCGRYL'" #default="scope">
                    {{ XMCGRYLList[tableDataOption.indexOf(scope.row.CRRC_XM_XMMC)] }}%
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
let tableDataOption = ref([])

let tableColumn = [
    {prop: "CRRC_XM_XMMC", label: "项目名称"},
    {prop: "XMCGRYL", label: "项目采购冗余率"},
    {prop: "CRRC_MCL_WLBM", label: "物料编码"},
    {prop: "CRRC_MCL_WLMS", label: "物料名称"},
    {prop: "CRRC_CGDDSL", label: "采购订单数量"},
    {prop: "CRRC_XSDDSL", label: "销售订单数量"},
    {prop: "CGRYL", label: "采购冗余率"},
]
let allTableData = ref([])
let tableData = ref([])
let XMCGRYLList = ref([])

onMounted(() => {
    let str = `viewName=CRRC_JSC_DB_WL`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res.data.data
        tableData.value = allTableData.value
        tableDataOption.value = [...new Set(allTableData.value.map(item => item.CRRC_XM_XMMC))]
        tableDataOption.value.forEach(el => {
            const CRRC_CGDDSLNum = allTableData.value.filter(item => item.CRRC_XM_XMMC === el).map(item => item.CRRC_CGDDSL).reduce((accumulator, current) => accumulator + current, 0)
            const CRRC_XSDDSLNum = allTableData.value.filter(item => item.CRRC_XM_XMMC === el).map(item => item.CRRC_XSDDSL).reduce((accumulator, current) => accumulator + current, 0)
            const XMCGRYLNum = (CRRC_CGDDSLNum == 0 ? 0 : 100 * (CRRC_CGDDSLNum - CRRC_XSDDSLNum) / CRRC_CGDDSLNum).toFixed(2)
            XMCGRYLList.value.push(XMCGRYLNum) // 计算冗余率
        })
    })
});

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
    if(columnIndex < 3) {
        if (rowIndex > 0 && row.CRRC_XM_XMMC === tableData.value[rowIndex - 1].CRRC_XM_XMMC) {
            return [0, 0]; // 当前单元格不显示（被合并）
        } else {
            // 计算相同姓名的行数
            let rowspan = 1;
            for (let i = rowIndex + 1; i < tableData.value.length; i++) {
                if (tableData.value[i].CRRC_XM_XMMC === row.CRRC_XM_XMMC) rowspan++;
                else break;
            }
            return [rowspan, 1]; // 合并 rowspan 行，1 列
        }
    }
}

function projectInfoSearchChange(val) {
    if(val.length)
    tableData.value = allTableData.value.filter(item => val.includes(item.CRRC_XM_XMMC))
    else
    tableData.value = allTableData.value
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