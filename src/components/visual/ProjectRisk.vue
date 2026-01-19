<template>
    <div
        ref="projectRisk"
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
    //     YZFX: 1,
    //     SJFX: 1,
    //     GYFX: 1,
    //     XMGLFX: 1,
    //     CGYGYSFX: 1,
    //     ZLGLFX: 1,
    //     CBFX: 1,
    //     RLZYFX: 1,
    //     AQHBFX: 1,
    //     FLFX: 1,
    //     ZSCQFX: 1,
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
    let str = `viewName=CRRC_JSC_XMFX`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}

const projectRisk = ref(null)
let taskStatusChart = null
const emit = defineEmits(['showTaskDetail'])

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectRisk.value);
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
                    { value: val.YZFX, name: '业主风险', itemStyle: { color: 'rgb(132, 208, 224)' } },
                    { value: val.SJFX, name: '设计风险', itemStyle: { color: 'rgb(200, 180, 34)' } },
                    { value: val.GYFX, name: '工艺风险', itemStyle: { color: 'rgb(181, 72, 54)' } },
                    { value: val.XMGLFX, name: '项目管理风险', itemStyle: { color: 'rgb(244, 130, 86)' } },
                    { value: val.CGYGYSFX, name: '采购与供应商风险', itemStyle: { color: 'rgb(149, 199, 140)' } },
                    { value: val.ZLGLFX, name: '质量管理风险', itemStyle: { color: 'rgb(228, 0, 177)' } },
                    { value: val.CBFX, name: '成本风险', itemStyle: { color: 'rgb(239, 165, 214)' } },
                    { value: val.RLZYFX, name: '人力资源风险', itemStyle: { color: 'rgb(186, 132, 82)' } },
                    { value: val.AQHBFX, name: '安全环保风险', itemStyle: { color: 'rgb(25, 194, 59)' } },
                    { value: val.FLFX, name: '法律风险', itemStyle: { color: 'rgb(251, 178, 88)' } },
                    { value: val.ZSCQFX, name: '知识产权风险', itemStyle: { color: 'rgb(131, 170, 202)' } },
                ],
                label: {
                    formatter: (val) => {
                        if(val.data.value > 0)
                            return `${val.data.name}(${val.data.value})`
                        else return ''
                    },
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                itemStyle: {
                    borderColor: "#fff",
                    fontSize: 16 * fontSize,
                }
            }
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