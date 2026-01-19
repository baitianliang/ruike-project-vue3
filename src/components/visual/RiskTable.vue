<template>
    <el-select
        multiple
        collapse-tags
        class="title_search"
        popper-class="title_options"
        v-model="projectInfoSearch"
        @change="projectInfoSearchChange">
        <el-option
            v-for="item in tableDataOption"
            :key="item"
            :label="item"
            :value="item"
        />
    </el-select>
    <div class="table_title">项目阶段分布</div>
    <div class="project_info_block">
        <el-table
            :data="tableData"
            style="width: 100%; max-height: 100%; background-color: unset;"
            border show-summary
            :span-method="objectSpanMethod"
            header-row-class-name="table_title-header-row"
            row-class-name="table_title-row">
            <el-table-column align="center" label="序号" type="index" width="150">
                <template #default="scope">
                    {{ riskList.indexOf(scope.row.CRRC_RR_FXFJJG_PD) + 1 }}
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

let projectInfoSearch = ref([])
let tableDataOption = ref(["业主风险", "设计风险", "工艺风险", "项目管理风险", "采购与供应商风险", "质量管理风险", "成本风险", "人力资源风险", "安全环保风险", "法律风险", "知识产权风险"])

let tableColumn = [
    {prop: "CRRC_RR_FXFJJG_PD", label: "风险分解结构", width: 500 * fontSize},
    {prop: "XMMC", label: "项目名称"},
    {prop: "FXSL", label: "风险数量", width: 500 * fontSize},
]
let allTableData = ref([])
let tableData = ref([])
let riskList = ref([])

onMounted(() => {
    // let str = `viewName=CRRC_JSC_XMXX`
    // axios.getFormData(str)
    let str = `viewName=XMFX`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res.data.data.list
        riskList.value = [...new Set(allTableData.value.map(item => item.CRRC_RR_FXFJJG_PD))]
        tableData.value = allTableData.value
    })
});

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
    if(columnIndex < 2) {
        if (rowIndex > 0 && row.CRRC_RR_FXFJJG_PD === tableData.value[rowIndex - 1].CRRC_RR_FXFJJG_PD) {
            return [0, 0]; // 当前单元格不显示（被合并）
        } else {
            // 计算相同姓名的行数
            let rowspan = 1;
            for (let i = rowIndex + 1; i < tableData.value.length; i++) {
                if (tableData.value[i].CRRC_RR_FXFJJG_PD === row.CRRC_RR_FXFJJG_PD) rowspan++;
                else break;
            }
            return [rowspan, 1]; // 合并 rowspan 行，1 列
        }
    }
}

function projectInfoSearchChange(val) {
    if(val.length)
    tableData.value = allTableData.value.filter(item => val.includes(item.CRRC_RR_FXFJJG_PD))
    else
    tableData.value = allTableData.value
}

</script>

<style lang="scss" scoped>
.table_title {
    font-size: 18px;
    color: white;
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
:deep(.table_title-row) {
    background-color: unset!important;
    color: white;
    .el-table__cell {
        background-color: unset!important;
        // border: 0px;
        border-color: rgb(59, 222, 245);
        font-size: 18px;
    }
}
:deep(.table_title-row:hover) {
    .el-table__cell {
        background-color: unset!important;
    }
}
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