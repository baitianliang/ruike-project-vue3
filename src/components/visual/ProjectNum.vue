<template>
    <div
        ref="projectNum"
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
    //     GSJGNXM: 2,
    //     GSJGWXM: 4,
    //     BMJGNXM: 0,
    //     BMJGWXM: 0,
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
    let str = `viewName=CRRC_JSC_XMSL`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0])
    })
}


const projectNum = ref(null)
let taskStatusChart = null
const emit = defineEmits(['changeProjectNumTotal'])

function initTaskChart(val) {
    
    const num = val.GSJGNXM + val.GSJGWXM + val.BMJGNXM + val.BMJGWXM + val.TCZGSXM
    emit('changeProjectNumTotal', num)
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectNum.value);
    // 2. 设置配置项
    const option = {
        // grid: {
        //     top: 0, // 上边距（给标题留空间）
        //     right: 10, // 右边距（给右侧留空间）
        //     bottom: 20,
        //     left: 130, // 左边距（给Y轴标签留空间）
        // },
        // title: {
        //     text: `项目总数: ${num}`,
        //     textStyle: {
        //         color: "white",
        //         fontSize: fontSize * 22,
        //     },
        //     right: 10 * fontSize, // 右侧留空间
        //     top: 20 * fontSize, // 上侧留空间
        //     // textAlign: 'right',
        // },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            height: '80%',
            orient: 'vertical',
            // type: 'scroll',
            // left: 'right',
            itemWidth: 16 * fontSize,
            itemHeight: 16 * fontSize,
            right: 0,
            bottom: 'center',
            textStyle: {
                color: '#ffffff',
                fontSize: 16 * fontSize,
            }
        },
        series: [
            {
                type: 'pie',
                center: ['40%', '50%'],
                radius: '80%',
                data: [
                    { value: val.GSJGNXM, name: '公司级-国内', itemStyle: { color: '#f5a623' }},
                    { value: val.BMJGNXM, name: '部门级-国内', itemStyle: { color: '#d94f4f' }},
                    { value: val.GSJGWXM, name: '公司级-国外', itemStyle: { color: '#55b8e8' }},
                    { value: val.BMJGWXM, name: '部门级-国外', itemStyle: { color: '#00c877' } },
                    { value: val.TCZGSXM, name: '统筹子公司项目', itemStyle: { color: '#a569bd' } },
                ],
                label: {
                    formatter: (val) => {
                        if(val.data.value > 0)
                            return `${val.data.value}`
                            // return `${val.data.name}(${val.data.value})`
                        else return ''
                    },
                    position: 'inside',
                    textStyle: {
                        fontSize: 16 * fontSize,
                    }
                },
                itemStyle: {
                    // borderColor: "#fff",
                    borderColor: '#0F2449',
                    borderWidth: 3,
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