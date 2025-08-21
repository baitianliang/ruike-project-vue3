<template>
    <div id="approvalPage">
        <el-card>
            <div class="approval-header">
                <div>{{ bpName }}</div>
                <div v-if="taskStatus === 0">
                    <el-button @click="handleNext(1)" size="large" type="primary">同意</el-button>
                    <el-button @click="handleNext(2)" size="large">办结</el-button>
                </div>
            </div>
        </el-card>
        <el-card v-for="(item, index) in formData" :key="index">
            <div class="approval-body">
                <div class="approval-body-title">
                    <div class="approval-body-title-icon"></div>
                    <div>
                        {{ index }}
                    </div>
                </div>
                <div class="approval-body-line"></div>
                <div v-for="(_item, _index) in item" :key="_index" class="approval-body-row">
                    <div v-for="(__item, __index) in _item" :key="__index" class="approval-body-row-item">
                        <div class="approval-body-row-item-label">{{ __item.zh_cn }}</div>
                        <div class="approval-body-row-item-value">
                            <el-input v-if="__item.acl === 'w'" disabled size="large" v-model="formValue[__item.bp_field_name]" type="textarea" :rows="3"></el-input>
                            <el-input v-else disabled size="large" v-model="formValue[__item.bp_field_name]"></el-input>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card v-if="fileList.length">
            <div class="approval-body">
                <div class="approval-body-title">
                    <div class="approval-body-title-icon"></div>
                    <div>附件信息</div>
                </div>
                <div class="approval-body-line"></div>
                <div class="approval-body-row approval-body-row-file" v-for="(item, index) in fileList" :key="index">
                    <div>
                        <div class="approval-body-row-file-icon">{{ item.fileName.split('.')[1].substring(0, 3) }}</div>
                        <div style="margin-right: 10px">{{ item.fileName }}</div>
                        <el-button @click="handleDownload(item.downloadUrl)" type="primary" :icon="Download" link title="下载附件" size="large"/>
                    </div>
                    <div>{{ formatFileSize(item.fileSize) }}</div>
                </div>
            </div>
        </el-card>
        <el-card v-if="tabList.length">
            <div class="approval-details">
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.designName">
                        <el-table
                            v-if="activeName == index"
                            :data="item.tableData"
                            border
                            :header-cell-style="{
                                backgroundColor: 'rgba(243, 244, 246)',
                                color: '#303133',
                                fontSize: '16px',
                            }"
                            style="width: 100%">
                            <el-table-column v-for="(_item, _index) in item.formattedData" :key="_index" :label="_item.heading" :prop="_item.field_name">
                                <!-- <template #default="scope">
                                    <div>{{ scope.row.field_name }}</div>
                                </template> -->
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="选择下一审批人"
        width="500">
        <div style="margin-bottom: 10px;">审批人</div>
        <el-select v-model="value" placeholder="请选择审批人">
            <el-option
            v-for="item in options"
            :key="item.ID"
            :label="item.NAME"
            :value="item.ID"
            />
        </el-select>
        <div style="margin: 10px 0px;">审批意见</div>
        <el-input v-model="comments" :rows="2" type="textarea" placeholder="请输入审批意见" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="agreement">确认</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog
        v-model="dialogVisible2"
        title="确认办结"
        width="500">
        <!-- <div style="margin-bottom: 10px;">确认要办结次流程吗？</div>
        <div>办结后流程将结束，无法再进行任何操作。</div> -->
        <div style="margin: 10px 0px;">办结意见</div>
        <el-input v-model="concludeComments" :rows="2" type="textarea" placeholder="请输入审批意见" />
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取消</el-button>
                <el-button type="primary" @click="conclude">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { Download } from '@element-plus/icons-vue'
import axios from "../assets/axios/approval"
import { onMounted, ref } from 'vue';
import { ElMessage } from "element-plus";
// import res from './form.json';

const bpName = ref('');
const taskStatus = ref(1);
const formData = ref({});
const fileList = ref([]);
const activeName = ref('0');
const tabList = ref([]);
const formValue = ref({});
const dialogVisible = ref(false);
const comments = ref('');
const concludeComments = ref('');
const value = ref('');
const options = ref([]);
const dialogVisible2 = ref(false);
const uuid = window.location.href.split('=')[1].split('&')[0]

onMounted(() => {
    getFormData();
});

async function getFormData() {
    const res = await axios.getFormData()
    if(res.data.code !== 200) {
        return ElMessage.error(res.data.msg);
    }
    console.log(res.data)
    bpName.value = res.data.data.formHeader
    taskStatus.value = res.data.data.taskStatus
    // res.data.data.mainForm.length && (formData.value = res.data.data.mainForm[0].formattedData);
    if (res.data.data.mainForm.length) {
        const basicForm = res.data.data.mainForm[0].formattedData
        for (const key in basicForm) {
            const arr = []
            let childArr = []
            let yList = basicForm[key].map(item => item.y)
            yList = [...new Set(yList)].sort()
            yList.forEach(el => {
                childArr = basicForm[key].filter(item => item.y === el).sort((a, b) => a.x - b.x)
                arr.push(childArr)
            });
            formData.value[key] = arr
        }
    }
    tabList.value = res.data.data.items.length && res.data.data.items || [];
    fileList.value = res.data.data.attachmentsList
    options.value = res.data.data.nextApprover
    
    tabList.value.forEach(el => {el.tableData = []})
    formValue.value = res.data.data.unifierData
    if(res.data.data.unifierData._bp_lineitems.length) {
        res.data.data.unifierData._bp_lineitems.forEach(item => {
            const obj = tabList.value.find(el => el.designName === item.uuu_tab_id)
            if(obj) obj.tableData.push(item)
        })
    }
}

function formatFileSize(bytes, decimalPlaces = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPlaces)) + ' ' + sizes[i];
}

const handleNext = (val) => {
    switch (val) {
        case 1:
        dialogVisible.value = true;
        break;
        case 2:
        dialogVisible2.value = true;
        break;
        default:
    }
}

const handleDownload = (url) => {
    window.open(url)
}

const agreement = () => {
    if(value.value === '')
    return ElMessage.info('请选择审批人');
    const query = {
        uuid,
        assigneeId: value.value,
        comments: comments.value,
    }
    axios.agreement(query)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage.success('审批成功');
            dialogVisible.value = false;
            window.close();
        } else {
            ElMessage.error(res.data.msg);
        }
    })
    .catch(err => {
        ElMessage.error(err.data.msg);
    })
}

const conclude = () => {
    const query = {
        uuid,
        concludeComments: concludeComments.value,
    }
    axios.conclude(query)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage.success('办结成功');
            dialogVisible2.value = false;
            window.close();
        } else {
            ElMessage.error(res.data.msg);
        }
    })
    .catch(err => {
        ElMessage.error(err.data.msg);
    })
}

</script>


<style lang="scss">
// #409eff
#approvalPage {
    height: 100%;
    overflow: auto;
    // margin-bottom: 20px;
    padding: 0px 20px 0px 20px;
    .el-card {
        margin: 20px 0px;
        .approval-header {
            font-size: 26px;
            font-weight: bold;
            // margin: 0px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .approval-body {
            margin-bottom: 20px;
            .approval-body-title {
                display: flex;
                font-size: 20px;
                font-weight: bold;
                .approval-body-title-icon {
                    margin-right: 5px;
                    width: 5px;
                    background-color: #26a2a2;
                    border-radius: 5px;
                }
            }
            .approval-body-line {
                height: 2px;
                background-color: #26a2a2;
                margin: 10px 0px;
            }
            .approval-body-row{
                margin-top: 20px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .approval-body-row-item:first-child {
                    margin-left: 0px;
                }
                .approval-body-row-item {
                    margin-left: 40px;
                    flex: 1;
                    .approval-body-row-item-label {
                        margin-bottom: 10px;
                        height: 20px;
                    }
                }
            }
            .approval-body-row-file {
                width: auto;
                padding: 20px;
                background-color: rgb(243, 244, 246);
                border: 1px solid #d9d9d9;
                border-radius: 5px;
                .approval-body-row-file-icon {
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 30px;
                    height: 30px;
                    background-color: #26a2a2;
                    margin-right: 15px;
                    border-radius: 3px;
                }
                >div {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .approval-details {
            .el-tabs {
                .el-tabs__nav {
                    width: 100%;
                    justify-content: space-between;
                    > div {
                        flex: 1;
                        height: 50px;
                    }
                    .is-active {
                        border-bottom: 1px solid #26a2a2;
                    }
                }
            }
        }
    }
}
</style>