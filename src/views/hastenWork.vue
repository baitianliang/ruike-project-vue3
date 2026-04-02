<template>
    <div id="hasten_work">
        <div class="header">
            <div>任务详情</div>
            <el-button size="large" @click="audit">已阅</el-button>
            <el-button size="large" @click="reminder" :disabled="disabled">催办</el-button>
        </div>
        <el-divider />

        <el-descriptions
            class="margin-top"
            :column="1"
            size="large"
            border>
            <el-descriptions-item label-width="200" label="来源:">GCMS总包业务管理系统</el-descriptions-item>
            <el-descriptions-item label-width="200" label="项目经理:">{{ formData.XMJLXM }}</el-descriptions-item>
            <el-descriptions-item label-width="200" label="任务负责人:">{{ formData.TASKLEADERNAME }}</el-descriptions-item>
        </el-descriptions>
        <div class="title"><span style="font-weight: bold;">提醒信息：</span>{{ formData.TITLE }}</div>
        <!-- <iframe src="https://dls.4dlp.com.cn:7102/vueapp/#/FormH5" frameborder="0"></iframe> -->
    </div>
</template>

<script setup>
import axios from "../assets/axios/HastenWork.js";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "@/router/index.js";

const formData = ref({});
const disabled = ref(false);
const type = router.currentRoute.value.meta.type;
onMounted(() => {
    axios.getFormData(type)
    .then(res => {
        if(res.data.code === 200)
        formData.value = res.data.data;
        else
        ElMessage.error(res.data.msg);
    })
})
const audit = () => {
    axios.audit(formData.value.PARTICIPANTID)
    .then(res => {
        if(res.data.code === 200) {
            ElMessageBox.alert('当前任务已转为已阅！1s后关闭弹窗。', '提示', {
                confirmButtonText: '确定',
                callback: (action) => {},
            })
            setTimeout(() => {
                if (window.opener) {
                    window.close();
                } else {
                    ElMessage.info("此页面不能自动关闭，请手动关闭。");
                }
            }, 2000);
        }
        else
        ElMessage.error(res.data.msg);
    })
}
const reminder = () => {
    axios.reminder(type)
    .then(res => {
        if(res.data.code === 200) {
            axios.audit(formData.value.PARTICIPANTID)
            .then(_res => {
                if(_res.data.code === 200) {
                    disabled.value = true;
                    ElMessageBox.alert('当前任务已催办！1s后关闭弹窗。', '提示', {
                        confirmButtonText: '确定',
                        callback: (action) => {},
                    })
                    setTimeout(() => {
                        if (window.opener) {
                            window.close();
                        } else {
                            ElMessage.info("此页面不能自动关闭，请手动关闭。");
                        }
                    }, 2000);
                }
                else
                ElMessage.error(_res.data.msg);
            })
        } else {
            axios.audit(formData.value.PARTICIPANTID)
            .then(_res => {
                if(_res.data.code === 200) {
                    disabled.value = true;
                    ElMessageBox.alert(res.data.msg, '提示', {
                        confirmButtonText: '确定',
                        callback: (action) => {},
                    })
                    setTimeout(() => {
                        if (window.opener) {
                            window.close();
                        } else {
                            ElMessage.info("此页面不能自动关闭，请手动关闭。");
                        }
                    }, 2000);
                }
                else
                ElMessage.error(_res.data.msg);
            })
        }
    })
}
</script>

<style lang="scss" scoped>
#hasten_work {
    margin: 20px;
    .header {
        display: flex;
        align-items: center;
        font-size: 22px;
        font-weight: bold;
        > div {
            margin-right: 20px;
        }
        .el-button {
            background-color: #8B0000;
            border: 1px solid #8B0000;
            color: white;
        }
    }
    .title {
        margin-top: 20px;
        font-size: 24px;
        width: 100%;
        justify-content: left;
        padding: 10px 10px;
        background-color: #fff3cd;
        border: 1px solid #ffeeba;
        color: #856404;
    }
}
</style>