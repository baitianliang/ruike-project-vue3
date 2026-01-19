<template>
    <div
        ref="income"
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
    //     NDXSSR_SJZ: 4,
    //     NDXSSR_MBZ: 4,
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
    let str = `viewName=CRRC_JSC_NDSRYS`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}

const income = ref(null)
let taskStatusChart = null

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(income.value);
    // 2. 设置配置项
    const option = {
        grid: {
            top: 20 * fontSize, // 上边距（给标题留空间）
            right: 60 * fontSize, // 右边距（给右侧留空间）
            bottom: 60 * fontSize, // 下边距（给图例留空间）
            left: 130 * fontSize, // 左边距（给Y轴标签留空间）
        },
        tooltip: {
            formatter: (val) => {
                if(val.data.value > 0)
                    return `${val.name}: ${val.data.value}万`
                else return ''
            },
        },
        legend: {
            data: ["目标值", "实际值"],
            right: 20,
        },
        xAxis: [
            {
                type: "value",
                axisLabel: {
                    color: "#fff",
                    formatter: '{value}万',
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
                data: ["实际值", "目标值"],
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
                    { value: val.NDXSSR_SJZ, itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: 'rgba(13, 218, 44, 0.5)' },
                            { offset: 1, color: 'rgb(13, 218, 44)' }
                        ])
                    }},
                    { value: val.NDXSSR_MBZ, itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: 'rgba(255, 130, 176, 0.5)' },
                            { offset: 1, color: 'rgb(255, 130, 176)' }
                        ])
                    }},
                ],
                label: {
                    show: true,
                    formatter: (val) => {
                        if(val.data.value > 0)
                            return `${val.data.value}万`
                        else return ''
                    },
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                
                barCategoryGap: 20 * fontSize,
                barWidth: 20 * fontSize,
            },
        ],
    };
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