<template>
    <div class="right_chart">
        <el-card shadow="always">
            <div>
                <div class='title'>任务完成情况</div>
                <div ref="taskCompletionStatus" style="width: 25rem; height: 400px; margin: 0px auto;"></div>
                <el-table
                    :data="props.taskList"
                    :header-cell-style="{backgroundColor: 'rgba(229, 231, 235)', color: '#303133', fontSize: '16px'}"
                    style="width: 100%">
                    <el-table-column
                        label="状态">
                        <template #default="scope">
                            <div v-if="scope.row.status === 1">已完成</div>
                            <div v-else-if="scope.row.status === 2">进行中</div>
                            <div v-else-if="scope.row.status === 3">未开始</div>
                            <div v-else>总计</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label="任务数量">
                    </el-table-column>
                    <el-table-column
                        prop="percentage"
                        label="百分比">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref } from 'vue';
const props = defineProps({
    taskList: {
        type: Array,
        requied: true
    },
    titleText: {
        type: String,
        default: '启动阶段'
    }
})
const taskCompletionStatus = ref(null)
let myChart = null
onMounted(() => {
    initChart()
})
onUnmounted(() => {
    // 组件销毁时移除监听并销毁图表
    window.removeEventListener('resize', () => myChart.resize());
    if (myChart) myChart.dispose();
})
function initChart() {
    const data = JSON.parse(JSON.stringify(props.taskList))
    const obj = data.find(el => el.status === 1)
    obj.name = '已完成'
    obj.itemStyle = { color: '#2ecc71' }
    const obj2 = data.find(el => el.status === 2)
    obj2.name = '进行中'
    obj2.itemStyle = { color: '#f39c12' }
    const obj3 = data.find(el => el.status === 3)
    obj3.name = '未开始'
    obj3.itemStyle = { color: '#bbb' }
    data.pop()
    // 1. 初始化图表
    myChart = echarts.init(taskCompletionStatus.value);
    // 2. 设置配置项
    const option = {
        title: {
            text: `${props.titleText} 任务状态`,  // 主标题文本
            left: 'center',        // 水平居中（可选：'left' | 'right' | 'center' | 像素值）
            top: 10,               // 距离顶部距离（像素或百分比）
            textStyle: {           // 标题样式
                color: '#666',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        graphic: {
            type: 'text',          // 类型：文本
            left: 'center',        // 水平居中
            top: 'center',         // 垂直居中
            style: {
                text: `${props.taskList[props.taskList.length - 1].value}\n总任务`, // 支持换行符 \n
                fill: '#333',        // 文字颜色
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',  // 文字对齐
                textVerticalAlign: 'middle'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            icon: 'rect',
            x: 'center',
            itemGap: 10,
            itemWidth: 42,
            bottom: '5',
            data: ['已完成','进行中','未开始']
        },
        calculable : true,
        series : [
            {
                name:'访问来源',
                type:'pie',
                radius : ['55%', '80%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                },
                data
            }
        ]
    };
    // 3. 渲染图表
    myChart.setOption(option);
    // 窗口变化时自适应
    window.addEventListener('resize', () => myChart.resize());
}
defineExpose({initChart})
</script>

<style lang="scss">
.right_chart {
    .el-card {
        margin: 24px;
        .el-card__body {
            padding: 32px;
            div {
                .title {
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 28px;
                    margin-bottom: 24px;
                }
                .el-table {
                    margin-top: 24px;
                    tbody {
                        .el-table__row:last-child {
                            font-weight: 700;
                        }
                    }
                }
            }
        }
    }
}
</style>