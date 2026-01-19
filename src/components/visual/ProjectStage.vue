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
            style="width: 100%; height: 100%; background-color: unset;"
            height="100%" border
            :span-method="objectSpanMethod"
            header-row-class-name="table_title-header-row"
            row-class-name="table_title-row">
            <el-table-column align="center" label="序号" type="index" width="150">
                <template #default="scope">
                    {{ stageList.indexOf(scope.row.WBSMC) + 1 }}
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
let tableDataOption = ref(["启动阶段", "策划阶段", "设计阶段", "采购阶段", "现场实施阶段", "项目收尾及总结", "联调联试及试运行", "售后服务"])

let tableColumn = [
    {prop: "WBSMC", label: "所属阶段", width: 500 * fontSize},
    {prop: "XMMC", label: "项目名称"},
    {prop: "XMJL", label: "项目经理", width: 500 * fontSize},
]
let allTableData = ref([])
let tableData = ref([])
let stageList = ref([])

onMounted(() => {
    // let str = `viewName=CRRC_JSC_XMXX`
    // axios.getFormData(str)
    let str = `viewName=XMJD`
    axios.getTableData(str)
    .then(res => {
        allTableData.value = res.data.data
        stageList.value = [...new Set(allTableData.value.map(item => item.WBSMC))]
        tableData.value = allTableData.value
    })
});

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
    console.log(rowIndex)
    if(columnIndex < 2) {
        if (rowIndex > 0 && row.WBSMC === tableData.value[rowIndex - 1].WBSMC) {
            return [0, 0]; // 当前单元格不显示（被合并）
        } else {
            // 计算相同姓名的行数
            let rowspan = 1;
            for (let i = rowIndex + 1; i < tableData.value.length; i++) {
                if (tableData.value[i].WBSMC === row.WBSMC) rowspan++;
                else break;
            }
            return [rowspan, 1]; // 合并 rowspan 行，1 列
        }
    }
}

function projectInfoSearchChange(val) {
    if(val.length)
    tableData.value = allTableData.value.filter(item => val.includes(item.WBSMC))
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
</style>