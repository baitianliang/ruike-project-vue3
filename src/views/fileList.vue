<template>
    <div id="file_List">
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column align="center" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :width="item.width" />
            <el-table-column align="center" label="操作" type="index" width="150">
                <template #default="scope">
                    <el-button type="primary" :icon="Download" @click="downloadFile(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import { onMounted, ref } from "vue";
import { ElMessage } from 'element-plus'
import axios from "../assets/axios/FileList.js"

let tableColumn = ref([
    { prop: "NAME", label: "记录编号"},
    { prop: "DESCRIPTION", label: "标题"},
    { prop: "START_DATE", label: "上传时间"},
    { prop: "FILE_NAME", label: "文件名"},
])
let tableData = ref([{}])

onMounted(() => {
    axios.getTableData()
    .then(res => {
        tableData.value = res.data.data
    })
})

const downloadFile = (row) => {
    let str = `repoPath=${row.REPO_PATH.replace(/\\/g, '/')}&downloadName=${row.FILE_NAME}&repoName=${row.REPO_NAME}`
    axios.downloadFile(str)
    .then(res => {
        if (res.data.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                // 将 Blob 读出的字符串转回 ResultBean 对象
                const result = JSON.parse(reader.result);
                // 使用您 UI 框架的消息提示（例如 Element UI 的 $message）
                ElMessage.error(result.msg || '文件读取失败');
            };
            reader.readAsText(res.data);
            return; // 报错了就直接返回，不执行后面的下载逻辑
        }

        const blob = new Blob([res.data]);
        const fileName = row.FILE_NAME || '未知文件';
        
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // 释放内存
        }
        ElMessage.success('开始下载...');
    })
}

</script>

<style lang="scss" scoped>
#file_List{
    margin: 50px;
    height: calc(100% - 100px);
}
</style>