<template>
    <div
        ref="projectPhase"
        style="width: 100%; height: 100%; margin: 0px auto"
    ></div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import * as echarts from "echarts";
import axios from "../../assets/axios/visual.js"

const props = defineProps({
    projectList: {
        type: Array,
    }
})
onMounted(() => {
    // initTaskChart({
    //     SHFW: 4,
    //     LTLSJSYX: 4,
    //     XMSWJZJ: 4,
    //     XCSSJD: 4,
    //     CGJD: 4,
    //     SJJD: 4,
    //     CHJD: 4,
    //     QDJD: 4,
    // })
    getData()
});
function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

function getData() {
    let str = `viewName=CRRC_JSC_XMJD`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}


const projectPhase = ref(null)
let taskStatusChart = null
const emit = defineEmits(['showTaskDetail'])

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectPhase.value);
    // 2. 设置配置项
    const option = {
        grid: {
            top: 10, // 上边距（给标题留空间）
            right: 10 * fontSize, // 右边距（给右侧留空间）
            bottom: 30 * fontSize, // 下边距（给图例留空间）
            left: 130 * fontSize, // 左边距（给Y轴标签留空间）
        },
        responsive: true,
        tooltip: {},
        xAxis: [
            {
                type: "value",
                max: function (value) {
                    return value.max * 1; // 比最大值多10%的空间
                },
                axisLabel: {
                    color: "#fff",
                    fontSize: 14 * fontSize,
                },
                splitLine: {
                    show: false, // 隐藏水平网格线（可选）
                },
            },
        ],
        yAxis: [
            {
                type: "category",
                data: ["售后服务", "联调联试及试运行", "项目收尾及总结", "现场实施阶段", "采购阶段", "设计阶段", "策划阶段", "启动阶段"],
                axisLabel: {
                    color: "#fff",
                    fontSize: 14 * fontSize,
                },
            },
        ],
        series: [
            {
                type: "bar",
                data: [
                    { value: val.SHFW, },
                    { value: val.LTLSJSYX, },
                    { value: val.XMSWJZJ, },
                    { value: val.XCSSJD, },
                    { value: val.CGJD, },
                    { value: val.SJJD, },
                    { value: val.CHJD, },
                    { value: val.QDJD, },
                ],
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: 'rgba(58, 255, 252, 0.3)' },
                        { offset: 0.5, color: 'rgb(59, 222, 245)' },
                        { offset: 1, color: 'rgb(58, 255, 252)' }
                    ])
                },
            },
        ],
    };
    taskStatusChart.on('click', function(params) {
        emit('showTaskDetail')
    });
    // 3. 渲染图表
    taskStatusChart.setOption(option);
    taskStatusChart.resize()
    // 窗口变化时自适应
    window.addEventListener('resize', taskStatusChartResize);
}
function taskStatusChartResize() {
    // nextTick(() => {
        taskStatusChart.resize()
    // })
}
defineExpose({
    getData
})

</script>

<style lang="scss">

</style>