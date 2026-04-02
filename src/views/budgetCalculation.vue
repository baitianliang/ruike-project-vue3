<template>
    <div id="budgetCalculation">
        <el-card class="searchForm" body-style="height: calc(100% - 40px); display: flex; align-items: center; justify-content: space-between;">
            <div>
                <el-button @click="toggleAll(tableData, true)">全部展开</el-button>
                <el-button @click="toggleAll(tableData, false)">全部折叠</el-button>
            </div>
            <el-button type="primary" @click="save" :disabled="disabled">保存</el-button>
        </el-card>
        <el-card class="tableCard" body-style="height: calc(100% - 40px)">
            <el-table
                ref="tableDom"
                :data="tableData"
                v-loading="loading"
                border
                style="width: 100%"
                height="100%"
                row-key="id"
                :row-class-name="tableRowClassName"
                :span-method="objectSpanMethod">
                <el-table-column
                    v-for="(item, index) in tableColumn"
                    :key="index"
                    :prop="item.prop"
                    :width="item.width"
                    :label="item.label">
                        <template v-if="item.prop === 'budget'" #default="scope">
                            <el-input-number v-if="scope.row.children" :model-value="sumChildren(scope.row)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 42" :model-value="subtractNum(scope.row, 0, 1)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 43" :model-value="percentageNum(scope.row, 2, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else-if="scope.row.id === 57" :model-value="subtractNum(scope.row, 2, 4)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 58" :model-value="percentageNum(scope.row, 5, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else-if="scope.row.id === 68" :model-value="subtractNum(scope.row, 5, 7)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 69" :model-value="percentageNum(scope.row, 8, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else-if="scope.row.id === 71" :model-value="subtractNum(scope.row, 8, 10)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 72" :model-value="percentageNum(scope.row, 11, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else-if="scope.row.id === 78" :model-value="subtractNum(scope.row, 11, 13)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 79" :model-value="percentageNum(scope.row, 14, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else-if="scope.row.id === 81" :model-value="subtractNum(scope.row, 14, 16)" controls-position="right" :precision="2" disabled />
                            <el-input-number v-else-if="scope.row.id === 82" :model-value="percentageNum(scope.row, 17, 0)" controls-position="right" :precision="2" disabled >
                                <template #suffix>
                                    <span>%</span>
                                </template>
                            </el-input-number>
                            <el-input-number v-else v-model="scope.row.budget" controls-position="right" :precision="2" :min="0" :disabled="disabled" />
                        </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import router from "@/router/index.js";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import axios from "../assets/axios/budgetCalculation.js";

const tableDom = ref(null);
const openerForm = window.opener?.formUpper?.getValues() || {}
const openerProject = window.opener?._P?.config?.context || {}
const userId = window.top._P ? window.top._P.data?.navbean?.user?.userid : window.opener?.opener?._P?.data?.navbean?.user?.userid || 1000
let disabled = ref(false);
const type = router.currentRoute.value.meta.type;

let tableData = ref([
    {id: 1,project_name: "销售单价（列）", budget: null, record_no: "一"},
    {id: 2,project_name: "变动制造成本", budget: null, record_no: "二",
        children: [
            {id: 3,project_name: "自采材料", budget: null, record_no: "1",
                children: [
                    {id: 4,project_name: "母公司自采材料", budget: null, record_no: "1.1",
                        children: [
                            {id: 5,project_name: "总装材料费", budget: null, record_no: "1.1.1"},
                            {id: 6,project_name: "车体材料费", budget: null, record_no: "1.1.2"},
                            {id: 7,project_name: "转向架材料费", budget: null, record_no: "1.1.3"},
                            {id: 8,project_name: "必换件（检修）", budget: null, record_no: "1.1.4"},
                            {id: 9,project_name: "委外修（检修）", budget: null, record_no: "1.1.5"},
                            {id: 10,project_name: "偶检件（检修）", budget: null, record_no: "1.1.6"},
                            {id: 11,project_name: "周转件（检修）", budget: null, record_no: "1.1.7"},
                            {id: 12,project_name: "现车修（检修）", budget: null, record_no: "1.1.8"},
                        ]
                    },
                    {id: 13,project_name: "子公司自采材料（成本）", budget: null, record_no: "1.2",
                        children: [
                            {id: 14,project_name: "总装材料费", budget: null, record_no: "1.2.1"},
                            {id: 15,project_name: "车体材料费", budget: null, record_no: "1.2.2"},
                            {id: 16,project_name: "转向架材料费", budget: null, record_no: "1.2.3"},
                        ]
                    },
                    {id: 17,project_name: "随车备品备件", budget: null, record_no: "1.3"},
                ]
            },
            {id: 18,project_name: "母公司外购大部件", budget: null, record_no: "2",
                children: [
                    {id: 19,project_name: "车体大部件", budget: null, record_no: "2.1"},
                    {id: 20,project_name: "转向架大部件", budget: null, record_no: "2.2"},
                ]
            },
            {id: 21,project_name: "子公司外购大部件（非母公司销售）", budget: null, record_no: "3",
                children: [
                    {id: 22,project_name: "车体大部件", budget: null, record_no: "3.1"},
                    {id: 23,project_name: "转向架大部件", budget: null, record_no: "3.2"},
                ]
            },
            {id: 24,project_name: "变动制造工费", budget: null, record_no: "4",
                children: [
                    {id: 25,project_name: "委外成本", budget: null, record_no: "4.1"},
                    {id: 26,project_name: "生产性费用", budget: null, record_no: "4.2"},
                    {id: 27,project_name: "动能成本（变动）", budget: null, record_no: "4.3"},
                ]
            },
            {id: 28,project_name: "其他费用", budget: null, record_no: "5",
                children: [
                    {id: 29,project_name: "运输费-内陆运输费", budget: null, record_no: "5.1"},
                    {id: 30,project_name: "运输费-海运费", budget: null, record_no: "5.2"},
                    {id: 31,project_name: "运输费-港杂费", budget: null, record_no: "5.3"},
                    {id: 32,project_name: "包装费", budget: null, record_no: "5.4"},
                    {id: 33,project_name: "保险费", budget: null, record_no: "5.5"},
                    {id: 34,project_name: "试验检验费", budget: null, record_no: "5.6"},
                    {id: 35,project_name: "材料运杂费", budget: null, record_no: "5.7"},
                    {id: 36,project_name: "工装模具费", budget: null, record_no: "5.8"},
                    {id: 37,project_name: "合作费", budget: null, record_no: "5.9"},
                    {id: 38,project_name: "仓储经费-仓库经费", budget: null, record_no: "5.10"},
                    {id: 39,project_name: "差旅费等人工成本（基地修）", budget: null, record_no: "5.11"},
                    {id: 40,project_name: "环形试验费", budget: null, record_no: "5.12"},
                    {id: 41,project_name: "其他费用", budget: null, record_no: "5.13"},
                ]
            },
        ]
    },
    {id: 42,project_name: "制造边际贡献", budget: null, record_no: "三"},
    {id: 43,project_name: "制造边际贡献率", budget: null, record_no: "三"},
    {id: 44,project_name: "变动专项费用", budget: null, record_no: "四",
        children: [
            {id: 45,project_name: "售后费用", budget: null, record_no: "1"},
            {id: 46,project_name: "维保费用", budget: null, record_no: "2"},
            {id: 47,project_name: "项目专项费", budget: null, record_no: "3",
                children: [
                    {id: 48,project_name: "项目管理", budget: null, record_no: "3.1",
                        children: [
                            {id: 49,project_name: "代理费", budget: null, record_no: "3.1.1"},
                        ]
                    },
                    {id: 50,project_name: "客户服务", budget: null, record_no: "3.2",
                        children: [
                            {id: 51,project_name: "销售服务费", budget: null, record_no: "3.2.1"},
                        ]
                    },
                ]
            },
            {id: 52,project_name: "其他费用", budget: null, record_no: "4",
                children: [
                    {id: 53,project_name: "银行手续费", budget: null, record_no: "4.1"},
                    {id: 54,project_name: "多余物料成本", budget: null, record_no: "4.2"},
                    {id: 55,project_name: "项目风险准备金", budget: null, record_no: "4.3"},
                    {id: 56,project_name: "其他费用", budget: null, record_no: "4.4"},
                ]
            },
        ]
    },
    {id: 57,project_name: "项目边际贡献（摊销息税前利润EBITDA）", budget: null, record_no: "五"},
    {id: 58,project_name: "项目边际贡献率（摊销息税前利润EBITDA）", budget: null, record_no: "五"},
    {id: 59,project_name: "可控固定制造成本", budget: null, record_no: "六",
        children: [
            {id: 60,project_name: "固定制造工费", budget: null, record_no: "1",
                children: [
                    {id: 61,project_name: "人工成本", budget: null, record_no: "1.1"},
                    {id: 62,project_name: "资产成本", budget: null, record_no: "1.2"},
                    {id: 63,project_name: "动能成本及其他（固定）", budget: null, record_no: "1.3"},
                ]
            },
            {id: 64,project_name: "固定制造工费（其他单位分摊）", budget: null, record_no: "2",
                children: [
                    {id: 65,project_name: "仓储经费", budget: null, record_no: "2.1"},
                    {id: 66,project_name: "运输费", budget: null, record_no: "2.2"},
                    {id: 67,project_name: "租赁费", budget: null, record_no: "2.3"},
                ]
            },
        ]
    },
    {id: 68,project_name: "项目可控收益", budget: null, record_no: "七"},
    {id: 69,project_name: "项目可控收益率", budget: null, record_no: "七"},
    {id: 70,project_name: "固定折旧费用", budget: null, record_no: "八"},
    {id: 71,project_name: "项目毛利", budget: null, record_no: "九"},
    {id: 72,project_name: "项目毛利率", budget: null, record_no: "九"},
    {id: 73,project_name: "期间费用", budget: null, record_no: "十",
        children: [
            {id: 74,project_name: "销售费用（本部门分摊）", budget: null, record_no: "1"},
            {id: 75,project_name: "管理费用（全公司分摊）", budget: null, record_no: "2"},
            {id: 76,project_name: "研发费用（基本分摊+受益项目计入）", budget: null, record_no: "3"},
            {id: 77,project_name: "税金及附加（分摊）", budget: null, record_no: "4"},
        ]
    },
    {id: 78,project_name: "项目经营利润（息税前利润EBIT）", budget: null, record_no: "十一"},
    {id: 79,project_name: "项目经营利润率", budget: null, record_no: "十一"},
    {id: 80,project_name: "所得税费用（分摊）", budget: null, record_no: "十二"},
    {id: 81,project_name: "项目净利润", budget: null, record_no: "十三"},
    {id: 82,project_name: "项目净利率", budget: null, record_no: "十三"},
]);
let loading = ref(false);
let tableColumn = [
    {prop: "record_no", label: "序号"},
    {prop: "project_name", label: "预算项目"},
    {prop: "budget", label: "预算金额"},
];
const tableRowClassName = ({row, rowIndex}) => {
    let className = "";
    if([1,2,3,4,13,17,18,21,24,28,42,43,44,45,46,47,48,50,52,57,58,59,60,64,68,69,70,71,72,73,78,79,80,81,82].includes(row.id)) className = "text-bold"
    if(['三', '五', '七', '九', '十一', '十三'].includes(row.record_no)) className = className + " background-change"
    return className;
}
const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
  if (columnIndex === 0) {
    if ([41, 56, 67, 70, 77, 80].includes(rowIndex)) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    }
    if ([42, 57, 68, 71, 78, 81].includes(rowIndex)) {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}
const sumChildren = (row) => {
    let sum = 0;
    row.children.forEach(item => {
        sum += item.budget;
    });
    if(sum !== row.budget) {
        row.budget = sum
    }
    return row.budget;
}
const subtractNum = (row, index1, index2) => {
    let sum = tableData.value[index1].budget - tableData.value[index2].budget
    if(sum !== row.budget) {
        row.budget = sum
    }
    return row.budget;
}
const percentageNum = (row, index1, index2) => {
    let sum = tableData.value[index2].budget ? tableData.value[index1].budget / tableData.value[index2].budget * 100 : 0
    if(sum !== row.budget) {
        row.budget = sum
    }
    return row.budget;
}

onMounted(() => {
    if(openerForm.k__creator_id !== userId) disabled.value = true;
    if(openerProject.rec_id > 0 && openerProject.task_id === 0) disabled.value = true;
    if(type === 'TB') {
        if(openerForm.CRRC_BOI_QQXMBH && openerForm.CRRC_PIB_BBWB && openerForm.CRRC_PASD_BBH) {
            getTbTableData();
        } else {
            window?.opener?.UAlert('请先选择关联商机项目和版本！')
            window.close();
        }
    } else {
        if(openerForm.CRRC_XM_XMBH && openerForm.CRRC_PIB_BBWB && openerForm.CRRC_PASD_BBH) {
            getSsTableData();
        } else {
            window?.opener?.UAlert('请先选择关联项目和版本！')
            window.close();
        }
    }
});

const toggleAll = (data, type) => {
    data.forEach(item => {
        // 调用 el-table 实例的方法控制展开/折叠
        if (tableDom.value) {
            tableDom.value.toggleRowExpansion(item, type)
        }
        if (item.children && item.children.length > 0) {
            toggleAll(item.children, type)
        }
    })
}

const save = () => {
    // 保存逻辑
    if(type === 'TB') {
        axios.saveTbTableData({CRRC_PASD_BBH: openerForm.CRRC_PASD_BBH, JSON_DATA: tableData.value})
        .then(res => {
            if(res.data.code === 200) {
                ElMessage.success('保存成功！')
            } else {
                ElMessage.error(res.data.msg)
            }
        })
    } else {
        axios.saveSsTableData({CRRC_PASD_BBH: openerForm.CRRC_PASD_BBH, CRRC_XM_XMBH: openerForm.CRRC_XM_XMBH, JSON_DATA: tableData.value})
        .then(res => {
            if(res.data.code === 200) {
                ElMessage.success('保存成功！')
            } else {
                ElMessage.error(res.data.msg)
            }
        })
    }
}
const getTbTableData = async () => {
    loading.value = true
    let res = await axios.getTbTableData(openerForm.CRRC_BOI_QQXMBH, openerForm.CRRC_PASD_BBH)
    if(res.data.code === 200) {
        tableData.value = JSON.parse(res.data.data.JSON_DATA)
    }
    loading.value = false
}
const getSsTableData = async () => {
    loading.value = true
    let res = await axios.getSsTableData(openerForm.CRRC_XM_XMBH, openerForm.CRRC_PASD_BBH)
    if(res.data.code === 200) {
        tableData.value = JSON.parse(res.data.data.JSON_DATA)
    }
    loading.value = false
}

</script>

<style lang="scss" scoped>
#budgetCalculation {
    margin: 20px 500px;
    height: calc(100% - 40px);
    .searchForm {
        margin-bottom: 20px;
        height: 80px;
    }
    .tableCard {
        height: calc(100% - 100px);
        .el-input-number {
            width: 100%;
        }
        :deep(.el-table .text-bold) {
            font-weight: bold;
        }
        :deep(.el-table .background-change) {
            background-color: #9BC2E6;
        }
        
    }
}
</style>