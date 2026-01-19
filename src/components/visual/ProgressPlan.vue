<template>
    <div
        ref="projectPhase"
        style="width: 100%; height: 100%; margin: 0px auto;"
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
    // initTaskChart({projectList:['测试', '2'], planList:[50, 50], practicalList:[60, 60], deviationList:[1, -50]})
    getData()
});
function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

function getData() {
    let str = `viewName=CRRC_JSC_JDJH`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        const data = res.data.data
        const projectList = data.map(el => el.XMMC)
        const planList = data.map(el => el.JHWCB)
        const practicalList = data.map(el => el.SJWCB)
        const deviationList = data.map(el => el.JDPC)
        initTaskChart({ projectList, planList, practicalList, deviationList })
    })
}

const projectPhase = ref(null)
let taskStatusChart = null

function autoWrapLabel(text, maxCharsPerLine = 4) {
  const result = [];
  let currentLine = '';
  
  for (let char of text) {
    // 检查当前行字符数（中文算1个，英文算0.5个）
    const charWidth = /[^\x00-\xff]/.test(char) ? 1 : 0.5;
    
    if (currentLine.length + charWidth <= maxCharsPerLine) {
      currentLine += char;
    } else {
      result.push(currentLine);
      currentLine = char;
    }
  }
  
  if (currentLine) {
    result.push(currentLine);
  }
  
  return result.join('\n');
}

function initTaskChart(val) {
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectPhase.value);
    // 2. 设置配置项
    const option = {
        grid: {
            top: 50 * fontSize, // 上边距（给标题留空间）
            right: 60 * fontSize, // 右边距（给右侧留空间）
            bottom: 67 * fontSize, // 下边距（给图例留空间）
            left: 130 * fontSize, // 左边距（给Y轴标签留空间）
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(function(item) {
                    // 添加单位
                    result += item.seriesName + ': ' + item.value + ' %<br/>';
                });
                return result;
            },
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                },
            },
            textStyle: {
                fontSize: fontSize * 16,
            }
        },
        legend: {
            // data: ['计划完成比', '实际完成比', '进度偏差'],
            data: ['计划完成比', '实际完成比'],
            textStyle: {
                color: "#fff",
                fontSize: fontSize * 14,
            }
        },
        xAxis: [
            {
                type: 'category',
                data: val.projectList,
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    // color: "#fff",
                    color(value, index) {
                        if(val.planList[index] > val.practicalList[index] || !val.planList[index])
                        return "rgb(211, 49, 21)"
                        else
                        return "#fff"
                    },
                    fontSize: fontSize * 14,
                    formatter: function(value) {
                        return autoWrapLabel(value, 11)
                    }
                //     formatter: function(value) {
                //         // 每3个字符换行
                //         return value.replace(/(.{6})/g, '$1\n');
                //     },
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '实际完成比',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    color: "#fff",
                    formatter: '{value}.00%',
                    fontSize: fontSize * 14,
                },
                textStyle: {
                    color: "#fff",
                },
                splitLine: {
                    show: false, // 隐藏水平网格线（可选）
                },
            },
            // {
            //     type: 'value',
            //     name: '进度偏差',
            //     interval: 10,
            //     axisLabel: {
            //         color: "#fff",
            //         formatter: '{value}%',
            //         fontSize: fontSize * 14,
            //     },
            //     splitLine: {
            //         show: false, // 隐藏水平网格线（可选）
            //     },
            // }
        ],
        series: [
            {
                name: '计划完成比',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' ml';
                    }
                },
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        { offset: 0, color: 'rgba(191, 191, 191, 0.5)' },
                        { offset: 1, color: 'rgb(191, 191, 191)' }
                    ]),
                },
                // data: [
                //     53.85, 47.62, 51.85, 64.52, 80.00, 76.00, 59.00
                // ],
                data: val.planList,
                barWidth: 20,
            },
            {
                name: '实际完成比',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value + ' ml';
                    }
                },
                itemStyle: {
                    color(value) {
                        // if(val.planList[value.dataIndex] > value.value)
                        // return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        //     { offset: 0, color: 'rgba(211, 49, 21, 0.5)' },
                        //     { offset: 1, color: 'rgb(211, 49, 21)' }
                        // ])
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            { offset: 0, color: 'rgba(104, 188, 0, 0.5)' },
                            { offset: 1, color: 'rgb(104, 188, 0)' }
                        ])
                    }
                },
                // data: [
                //     52.00, 11.90, 51.85, 61.29, 80.00, 82.00, 61.00
                // ],
                data: val.practicalList,
                barWidth: 20,
            },
            // {
            //     name: '进度偏差',
            //     type: 'line',
            //     yAxisIndex: 1,
            //     tooltip: {
            //         valueFormatter: function (value) {
            //             return value + ' °C';
            //         }
            //     },
            //     itemStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //             { offset: 0, color: 'rgba(144, 205, 151, 0.5)' },
            //             { offset: 1, color: 'rgb(144, 205, 151)' }
            //         ])
            //     },
                
            //     // data: [-1.85, -35.72, 0.00, -3.23, 0.00, 6.00, 2.00]
            //     data: val.deviationList,
            // }
        ]
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