
<template>
    <div
        ref="qualityProblem"
        style="width: 100%; height: 100%; margin: 0px auto"
    ></div>
    <!-- <div class="ProcurementMaterialInformation">
        <svg style="cursor: pointer" width="320" height="250" viewBox="0 0 150 150" @click="showDetail">
            <path d="M10,90 A65,65 0 0,1 140,90" stroke="#e0e0e0" stroke-width="22" fill="transparent" />
            <path
                d="M10,90 A65,65 0 0,1 140,90"
                stroke="#28a745"
                stroke-width="22"
                fill="transparent"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
            />
        </svg>
        <div class="progress-text">
            <div>{{ completePercent }}%</div>
            <div>采购冗余率</div>
        </div>
    </div> -->
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
    let str = `viewName=CRRC_JSC_WL`
    axios.getFormData(str)
    .then(res => {
        initTaskChart(res.data.data[0].CGRYL.replace(/%/, ''))
    })
}

const qualityProblem = ref(null)
let taskStatusChart = null
const emit = defineEmits(['showTaskDetail'])

function initTaskChart(val) {
    console.log(100 - val)
    // 1. 初始化图表
    taskStatusChart = echarts.init(qualityProblem.value);
    // 2. 设置配置项
    const option = {
        tooltip: {
            formatter: (val) => {
                if(val.name === '采购冗余率')
                    return `${val.name}: ${val.data.value}%`
                else return ''
            },
        },
        graphic: [{
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                text: `${val}%`,  // 显示数值
                fill: 'white',
                fontSize: 32 * fontSize,
                fontWeight: 'bold'
            },
            z: 100
        }, {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
                text: '采购冗余率',  // 显示标题（可选）
                fill: 'white',
                fontSize: 32 * fontSize,
                fontWeight: 'normal'
            },
            z: 100,
            styleRich: {
                rich: {
                    // 可以单独控制样式
                }
            },
            // 将第二个文字向下偏移
            top: '55%'
        }],
        series: [
            {
                type: 'pie',
                center: ['50%', '50%'],
                radius : ['65%', '90%'],
                data: [
                    { value: val, name: '采购冗余率', itemStyle: {color: '#28a745'}},
                    { value: (10000 - val * 100) / 100, name: '', itemStyle: {color: 'rgb(229, 229, 229)'}},
                ],
                label: {
                    show: false,
                    formatter: (val) => {
                        if(val.data.value > 0 && val.data.name === '采购冗余率')
                            return `${val.data.name}
${val.data.value}%`
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
// import { ref, computed, onMounted } from 'vue';
// import axios from "../../assets/axios/visual.js"

// onMounted(() => {
//     getData()
// });

// const emit = defineEmits(['showTaskDetail'])
// const showDetail = () => {
//     emit('showTaskDetail')
// }
// function getData() {
//     let str = `viewName=CRRC_JSC_WL`
//     axios.getFormData(str)
//     .then(res => {
//         completePercent.value = res.data.data[0].CGRYL.replace(/%/, ''); // Update the completion percentage
//     })
// }

// const completePercent = ref(0); // Completion percentage
// const circumference = 204.1; // Circumference of the circle
// const progressOffset = computed(() => {
//   return circumference - (Number(completePercent.value) / 100) * circumference
// })

</script>

<style lang="scss" scoped>
// .ProcurementMaterialInformation {
//     position: relative;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     .progress-text {
//         position: absolute;
//         font-size: 24px;
//         color: white;
//         top: 50%;
//         text-align: center;
//         font-weight: bold;
//     }
// }
</style>
