<template>
    <div class="project_info_block" v-auto-scroll>
        <el-table
            :data="tableData"
            style="width: 100%; height: 100%; background-color: unset;"
            height="100%"
            header-row-class-name="project-info-header-row"
            row-class-name="project-info-row">
            <el-table-column label="序号" type="index" width="70" />
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

let tableColumn = [
    {prop: "XMMC", label: "项目名称"},
    {prop: "XMJB", label: "项目级别", width: 120 * fontSize},
    {prop: "XMLX", label: "项目类型", width: 120 * fontSize},
    {prop: "KHMC", label: "客户名称"},
    {prop: "XMJL", label: "项目经理", width: 120 * fontSize},
    {prop: "HTJE", label: "合同金额", width: 150 * fontSize},
]
let tableData = ref([])

onMounted(() => {
    getData()
});

function getData() {
    let str = `viewName=CRRC_JSC_XMXX`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        tableData.value = res.data.data
        tableData.value.forEach(item => {
            item.HTJE = item.HTJE + '万'
        })
    })
}
defineExpose({
    getData
})

</script>

<style lang="scss" scoped>
.project_info_block {
    margin: 25px 10px;
    height: calc(100% - 70px);
}
:deep(.el-table__inner-wrapper:before) {
    height: 0px!important;
}
:deep(.project-info-header-row) {
    background-color: unset!important;
    color: white;
    .el-table__cell {
        background-color: unset!important;
        font-size: 16px;
    }
}
:deep(.project-info-row) {
    background-color: unset!important;
    color: white;
    .el-table__cell {
        background-color: unset!important;
        border: 0px!important;
        font-size: 18px;
    }
}
:deep(.project-info-row:hover) {
    .el-table__cell {
        background-color: unset!important;
    }
}
</style>