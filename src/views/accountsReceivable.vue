<template>
    <div id="table_page">
        <div class="title">应收账款及回款滚动预算表</div>
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
    { prop: "CRRC_RBA_HDNMYSZK", label: "核对年末应收账款", width: "150" },
    {
        label: "1月预计",
        children: [
            { prop: "CRRC_RBA_XZYS1", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS1", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE1", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "2月预计",
        children: [
            { prop: "CRRC_RBA_XZYS2", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS2", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE2", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "3月预计",
        children: [
            { prop: "CRRC_RBA_XZYS3", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS3", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE3", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "4月预计",
        children: [
            { prop: "CRRC_RBA_XZYS4", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS4", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE4", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "5月预计",
        children: [
            { prop: "CRRC_RBA_XZYS5", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS5", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE5", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "6月预计",
        children: [
            { prop: "CRRC_RBA_XZYS6", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS6", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE6", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "7月预计",
        children: [
            { prop: "CRRC_RBA_XZYS7", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS7", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE7", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "8月预计",
        children: [
            { prop: "CRRC_RBA_XZYS8", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS8", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE8", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "9月预计",
        children: [
            { prop: "CRRC_RBA_XZYS9", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS9", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE9", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "10月预计",
        children: [
            { prop: "CRRC_RBA_XZYS10", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS10", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE10", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "11月预计",
        children: [
            { prop: "CRRC_RBA_XZYS11", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS11", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE11", label: "应收余额", width: "120" },
        ]
    },
    {
        label: "12月预计",
        children: [
            { prop: "CRRC_RBA_XZYS12", label: "新增应收", width: "120" },
            { prop: "CRRC_RBA_YSJS12", label: "应收减少", width: "120" },
            { prop: "CRRC_RBA_YSYE12", label: "应收余额", width: "120" },
        ]
    },
])
let tableData = ref([])

onMounted(() => {
    getTableData();
})

const getTableData = () => {
    let str = `viewName=CRRC_REPORT_YSZK`
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
        } else if (index > 3) {
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