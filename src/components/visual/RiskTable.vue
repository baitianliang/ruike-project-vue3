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
                    v-for="item in riskList"
                    :key="item"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </div>
        <div>
            <div style="margin-left: 10px; margin-bottom: 10px;" class="table_title">风险类型</div>
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
        </div>
    </div>
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
                    {{ riskList.indexOf(scope.row.XMMC) + 1 }}
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
let riskList = ref([])
let projectInfoSearch = ref([])
// let tableDataOption = ref(["业主风险", "设计风险", "工艺风险", "项目管理风险", "采购与供应商风险", "质量管理风险", "成本风险", "人力资源风险", "安全环保风险", "法律风险", "知识产权风险"])
let tableDataOption = ref([])

let tableColumn = [
    {prop: "XMMC", label: "项目名称", width: 300 * fontSize},
    {prop: "XMJL", label: "项目经理", width: 150 * fontSize},
    {prop: "FXLX", label: "风险类型", width: 150 * fontSize},
    {prop: "FXFJJG", label: "风险分解结构", width: 150 * fontSize},
    {prop: "FXMS", label: "风险描述"},
    {prop: "FXFZR", label: "风险负责人", width: 150 * fontSize},
    {prop: "YQWCSJ", label: "要求完成日期", width: 150 * fontSize},
    {prop: "SJWCSJ", label: "实际完成时间", width: 150 * fontSize},
]
let allTableData = ref([])
let tableData = ref([])

onMounted(() => {
    // let str = `viewName=CRRC_JSC_XMXX`
    // axios.getFormData(str)
    let str = `viewName=CRRC_JSC_DB_XMFX`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res.data.data
        riskList.value = [...new Set(allTableData.value.map(item => item.XMMC))]
        tableDataOption.value = [...new Set(allTableData.value.map(item => item.FXLX))]
        tableData.value = allTableData.value
    })
});

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
    if(columnIndex < 2) {
        if (rowIndex > 0 && row.XMMC === tableData.value[rowIndex - 1].XMMC) {
            return [0, 0]; // 当前单元格不显示（被合并）
        } else {
            // 计算相同姓名的行数
            let rowspan = 1;
            for (let i = rowIndex + 1; i < tableData.value.length; i++) {
                if (tableData.value[i].XMMC === row.XMMC) rowspan++;
                else break;
            }
            return [rowspan, 1]; // 合并 rowspan 行，1 列
        }
    }
}

function projectInfoSearchChange(val) {
    tableData.value = [ ...allTableData.value ]
    if(searchXMMC.value.length)
    tableData.value = tableData.value.filter(item => searchXMMC.value.includes(item.XMMC))
    if(projectInfoSearch.value.length)
    tableData.value = tableData.value.filter(item => projectInfoSearch.value.includes(item.FXLX))
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