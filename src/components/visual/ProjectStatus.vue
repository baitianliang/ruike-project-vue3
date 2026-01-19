<template>
    <div
        ref="projectStatus"
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
    //     YCQ: 10,
    //     DWC: 10,
    //     YWC: 10,
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
    let str = `viewName=CRRC_JSC_BGQK`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}

const projectStatus = ref(null)
let taskStatusChart = null

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectStatus.value);
    // 2. 设置配置项
    const option = {
        color: ['#ef2b2d', '#FFCE34', '#65B581'],
        grid: {
            top: 40, // 上边距（给标题留空间）
            right: 20, // 右边距（给右侧留空间）
            bottom: 20,
            left: 50, // 左边距（给Y轴标签留空间）
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
                    fontSize: fontSize * 14,
                },
                splitLine: {
                    show: false, // 隐藏水平网格线（可选）
                }
            },
        ],
        yAxis: [
            {
                type: "category",
                data: ["已超期", "待完成", "已完成"],
                axisLabel: {
                    color: "#fff",
                    fontSize: fontSize * 14,
                },
            },
        ],
        series: [
            {
                type: "bar",
                data: [
                    {
                        value: val.YCQ,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(244, 78, 59, 0.5)' },
                                { offset: 1, color: 'rgb(244, 78, 59)' }
                            ])
                        }
                    },
                    {
                        value: val.DWC,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(252, 220, 0, 0.5)' },
                                { offset: 1, color: 'rgb(252, 220, 0)' }
                            ])
                        }
                    },
                    {
                        value: val.YWC,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: 'rgba(104, 188, 0, 0.5)' },
                                { offset: 1, color: 'rgb(104, 188, 0)' }
                            ])
                        }
                    },
                ],
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                barCategoryGap: 20,
                barWidth: 20,
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

<style lang="scss" >

</style>