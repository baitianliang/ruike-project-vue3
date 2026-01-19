<template>
    <div id="Project">
        <el-card class="searchForm" body-style="height: calc(100% - 40px); display: flex; justify-content: space-between;">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="物料名称:">
                    <el-input v-model="searchForm.crrcMclWlms" placeholder="请输入物料名称" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="saveProjectList">保存</el-button>
        </el-card>
        <el-card class="tableCard" body-style="height: calc(100% - 40px)">
            <el-table
                :data="tableData"
                v-loading="loading"
                show-overflow-tooltip
                border
                style="width: 100%"
                height="calc(100% - 50px)"
                row-key="id"
                lazy>
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                    <el-empty description="暂无数据！" />
                    </div>
                </template>
                <el-table-column
                    v-for="(item, index) in tableColumn"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label">
                </el-table-column>
                <!-- <el-table-column
                    prop="CRRC_PO_RKSL_FINAL"
                    label="入库数量"
                    width="180">
                        <template #default="scope">
                            <el-input-number :precision="0" @change="pushUpdateData(scope.row, 1)" v-model="scope.row.CRRC_PO_RKSL_FINAL" controls-position="right" :min="scope.row.CRRC_OR_CKSL_FINAL" />
                        </template>
                </el-table-column>
                <el-table-column
                    prop="CRRC_OR_CKSL_FINAL"
                    label="出库数量"
                    width="180">
                        <template #default="scope">
                            <el-input-number :precision="0" @change="pushUpdateData(scope.row, 1)" v-model="scope.row.CRRC_OR_CKSL_FINAL" controls-position="right" :max="scope.row.CRRC_PO_RKSL_FINAL" :min="0" />
                        </template>
                </el-table-column>
                <el-table-column
                    prop="CRRC_KPJE_FINAL"
                    label="开票金额"
                    width="180">
                        <template #default="scope">
                            <el-input-number :precision="2" @change="pushUpdateData(scope.row)" v-model="scope.row.CRRC_KPJE_FINAL" controls-position="right" />
                        </template>
                </el-table-column>
                <el-table-column
                    prop="CRRC_SPJE_FINAL"
                    label="收票金额"
                    width="180">
                        <template #default="scope">
                            <el-input-number :precision="2" @change="pushUpdateData(scope.row)" v-model="scope.row.CRRC_SPJE_FINAL" controls-position="right" />
                        </template>
                </el-table-column> -->
                <el-table-column
                    prop="REMARKS"
                    label="备注">
                        <template #default="scope">
                            <el-input @change="pushUpdateData(scope.row)" v-model="scope.row.REMARKS" />
                        </template>
                </el-table-column>
                
            </el-table>
            <div class="table-pagination">
                <el-pagination
                    v-model:current-page="searchForm.pageNum"
                    v-model:page-size="searchForm.pageSize"
                    :page-sizes="[20, 50, 100]"
                    background
                    layout="sizes, prev, pager, next"
                    :total="searchForm.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "../assets/axios/ProjectPage.js";
import { ElMessage } from 'element-plus'

let searchForm = ref({
    pageNum: 1,
    pageSize: 20,
    total: 0,
    crrcMclWlms: ''
});
let tableData = ref([]);
let loading = ref(false);
let tableColumn = [
    // {prop: "SHELLNUMBER", label: "项目编号"},
    // {prop: "SHELLNAME", label: "项目名称"},
    {prop: "CRRC_MCL_WLBM", label: "物料编号"},
    {prop: "CRRC_MCL_WLMS", label: "物料名称"},
    {prop: "CRRC_PO_DDSL_01", label: "采购数量"},
    {prop: "CRRC_XSDDSL", label: "销售数量"},
    {prop: "CRRC_ERP_BBJE", label: "销售金额"},
    {prop: "CRRC_XSDJ", label: "销售单价"},
    {prop: "CRRC_CGDJ", label: "采购单价"},
    {prop: "CRRC_PO_DDJE", label: "采购金额"},
    {prop: "CRRC_KCSL", label: "库存数量"},
    {prop: "CRRC_PO_RKSL", label: "入库数量"},
    {prop: "CRRC_OR_CKSL", label: "出库数量"},
    {prop: "CRRC_KPJE", label: "开票金额"},
    {prop: "CRRC_SPJE", label: "收票金额"},
];
onMounted(() => {
    getTableData();
});

const onSubmit = () => {
    searchForm.value.pageNum = 1
    query = searchForm.value
    getTableData();
}
let query = searchForm.value
const getTableData = async () => {
    loading.value = true
    let res = await axios.getTableData(query)
    tableData.value = res.data.data.list
    // tableData.value.forEach(el => {
    //     el.START_DATE = `${el.START_DATE.substr(0, 10)} ${el.START_DATE.substr(11, 8)}`
    //     el.END_DATE = `${el.END_DATE.substr(0, 10)} ${el.END_DATE.substr(11, 8)}`
    // })
    searchForm.value.total = res.data.data.total
    loading.value = false
}
const handleSizeChange = (val) => {
    query.pageSize = val
    getTableData()
}
const handleCurrentChange = (val) => {
    query.pageNum = val
    getTableData()
}
let updateDataList = []
const pushUpdateData = (row, prop) => {
    // if(prop)
    //     row.CRRC_KCSL = row.CRRC_PO_RKSL_FINAL - row.CRRC_OR_CKSL_FINAL
    if(updateDataList.findIndex(el => el.CRRC_MCL_WLBM === row.CRRC_MCL_WLBM) === -1)
        updateDataList.push(row)
    else
        updateDataList[updateDataList.findIndex(el => el.CRRC_MCL_WLBM === row.CRRC_MCL_WLBM)] = row
}
const saveProjectList = () => {
    axios.updateProject(updateDataList)
    .then(res => {
        updateDataList = []
        onSubmit()
        return ElMessage({
            message: '保存成功!',
            type: 'success',
        });
    })
}

</script>

<style lang="scss" scoped>
#Project {
    margin: 20px;
    height: calc(100% - 40px);
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
        height: calc(100% - 100px);
        .table-pagination {
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
        }
    }
}
</style>