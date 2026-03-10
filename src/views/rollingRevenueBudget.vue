<template>
    <div id="table_page">
        <div class="title">项目收入滚动预算表</div>
        <el-card class="searchForm" body-style="height: calc(100% - 2.5rem)">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="项目编号:">
                    <el-input v-model="searchForm.crrcXmXmbh" placeholder="请输入项目编号" />
                </el-form-item>
                <el-form-item label="项目名称:">
                    <el-input v-model="searchForm.crrcXmXmmc" placeholder="请输入项目名称" />
                </el-form-item>
                <el-form-item label="所属年份:">
                    <el-input v-model="searchForm.crrcRbtSsnf" placeholder="请输入所属年份" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="tableCard" body-style="height: calc(100% - 40px)">
            <el-table
                :data="tableData"
                scrollbar-always-on
                show-summary
                :summary-method="getSummaries"
                height="100%">
                <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" >
                    <template v-if="item.children">
                        <el-table-column align="center" v-for="(_item, _index) in item.children" :key="_index" :prop="_item.prop" :label="_item.label" :min-width="_item.width" >
                        </el-table-column>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import { onMounted, ref } from "vue";
import { ElMessage } from 'element-plus'
import axios from "../assets/axios/RollingRevenueBudget.js"

let searchForm = ref({
    crrcXmXmbh: "",
    crrcXmXmmc: "",
    crrcRbtSsnf: "",
})
let tableColumn = ref([
    { prop: "CRRC_XM_XMBH", label: "项目编号", width: "150" },
    { prop: "CRRC_XM_XMMC", label: "项目名称", width: "300" },
    { prop: "CRRC_RBT_SSNF", label: "所属年份", width: "120" },
    {
        label: "年度预算",
        children: [
            { prop: "CRRC_RBT_XSSL", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "年度实际完成",
        children: [
            { prop: "CRRC_RBT_XSSL_SJ", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_SJ", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "1月",
        children: [
            { prop: "CRRC_RBT_XSSL_1", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_1", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "2月",
        children: [
            { prop: "CRRC_RBT_XSSL_2", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_2", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "3月",
        children: [
            { prop: "CRRC_RBT_XSSL_3", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_3", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "4月",
        children: [
            { prop: "CRRC_RBT_XSSL_4", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_4", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "5月",
        children: [
            { prop: "CRRC_RBT_XSSL_5", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_5", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "6月",
        children: [
            { prop: "CRRC_RBT_XSSL_6", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_6", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "7月",
        children: [
            { prop: "CRRC_RBT_XSSL_7", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_7", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "8月",
        children: [
            { prop: "CRRC_RBT_XSSL_8", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_8", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "9月",
        children: [
            { prop: "CRRC_RBT_XSSL_9", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_9", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "10月",
        children: [
            { prop: "CRRC_RBT_XSSL_10", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_10", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "11月",
        children: [
            { prop: "CRRC_RBT_XSSL_11", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_11", label: "营业收入", width: "120" },
        ]
    },
    {
        label: "12月",
        children: [
            { prop: "CRRC_RBT_XSSL_12", label: "销售数量", width: "120" },
            { prop: "CRRC_RBT_YYSR_12", label: "营业收入", width: "120" },
        ]
    },
])
let tableData = ref([])

onMounted(() => {
    getTableData();
})

const getTableData = () => {
    let str = `viewName=CRRC_REPORT_SRGDYS`
    axios.getFormData(str, query)
    .then(res => {
        tableData.value = res.data.data || []
    })
}
let query = searchForm.value

const onSubmit = () => {
    query = searchForm.value
    getTableData();
}

const getSummaries = (param) => {
    const { columns, data } = param;
    const sums = [];
    columns.forEach((column, index) => {
        if (index === 0) {
            sums[index] = '总计';
        } else if (index > 2) {
            const values = data.map((item) => Number(item[column.property]));
            const sum = values.reduce((prev, curr) => prev + curr, 0);
            sums[index] = `${sum}`;
        }
    });
    return sums;
}
</script>

<style lang="scss" scoped>
#table_page{
    margin: 0 50px 40px;
    height: calc(100% - 50px);
    .title {
        display: flex;
        align-items: center;
        height: 70px;
        font-size: 24px;
        font-weight: bold;
    }
    .searchForm {
        margin-bottom: 20px;
        height: 80px;
        .el-form {
            height: 100%;
            display: flex;
            align-items: center;
            .el-form-item {
                margin-bottom: 0px;
            }
        }
    }
    .tableCard {
        height: calc(100% - 170px);
    }
}
</style>