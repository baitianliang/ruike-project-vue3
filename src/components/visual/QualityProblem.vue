<template>
    <div
        ref="qualityProblem"
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
    //     YZGSL: 1,
    //     WZGSL: 1,
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
    let str = `viewName=CRRC_JSC_ZLWT`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}

const qualityProblem = ref(null)
let taskStatusChart = null

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(qualityProblem.value);
    // 2. 设置配置项
    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: 'pie',
                center: ['50%', '50%'],
                radius : ['65%', '90%'],
                data: [
                    { value: val.YZGSL, name: '已整改数量', itemStyle: {color: 'rgb(254, 146, 0)'}},
                    { value: val.WZGSL, name: '未整改数量', itemStyle: {color: 'rgb(229, 229, 229)'}},
                ],
                label: {
                    // show: false,
                    formatter: (val) => {
                        if(val.data.value > 0 && val.data.name === '已整改数量')
                            return `${val.data.name}
${val.data.value}
${val.percent}%`
                        else return ''
                    },
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                itemStyle: {
                    borderColor: "#fff",
                    fontSize: 24 * fontSize,
                },
            }
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