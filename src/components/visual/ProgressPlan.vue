<template>
    <div style="width: 100%; height: 100%; margin: 0px auto;" @mouseenter="isActive = false" @mouseleave="isActive = true">
        <div
            ref="projectPhase"
            style="width: 100%; height: 90%; margin: 0px auto;"
        ></div>
        <!-- 底部综合区域 -->
        <div class="footer-container">
            <div class="pagination-row">
                <button class="page-arrow" @click="changePage(-1)">◀</button>
                <span>第</span>
                <input v-model="currentPage" type="number" class="page-input" min="1">
                <span>/ <span>{{ totalPages }}</span> 页</span>
                <button class="page-arrow" @click="changePage(1)">▶</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";
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
onUnmounted(() => {
    clearTimeout(timerId)
})

function getRemSize() {
  const html = document.documentElement;
  const clientWidth = html.clientWidth;
  return clientWidth / 2560;
}
const fontSize = getRemSize()

const data = ref([]), projectList = ref([]), planList = ref([]), practicalList = ref([]), deviationList = ref([])
function getData() {
    let str = `viewName=CRRC_JSC_JDJH`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        data.value = res.data.data
        totalPages.value = Math.ceil(data.value.length / 6)
        projectList.value = data.value.map(el => el.XMMC)
        planList.value = data.value.map(el => el.JHWCB)
        practicalList.value = data.value.map(el => el.SJWCB)
        // deviationList.value = data.value.map(el => el.JDPC)
        initTaskChart()
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

let currentPage = ref(1);
let totalPages = ref(1);

let isActive = ref(true)
let timerId = null
function initTaskChart() {
    let startNum = 0, endNum = 6
    if(totalPages.value > 1) {
        startNum = (currentPage.value - 1) * 6
        endNum = currentPage.value * 6
        timerId = setTimeout(() => {
            if(isActive.value) {
                nextPage()
            }
            initTaskChart();
        }, 5000)
    }
    let num = 0
    planList.value.forEach((el, index) => {
        if(practicalList.value[index] < el || !el) {
            num++
        }
    })
    // 1. 初始化图表
    taskStatusChart = echarts.init(projectPhase.value);
    // 2. 设置配置项
    const option = {
        title: {
            text: `进度异常项目数量: ${num}`,
            textStyle: {
                color: "red",
                fontSize: fontSize * 18,
            },
            right: 100 * fontSize, // 右侧留空间
            // textAlign: 'right',
        },
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
                data: projectList.value.slice(startNum, endNum),
                axisPointer: {
                    type: 'shadow'
                },
                axisLabel: {
                    // color: "#fff",
                    color(value, index) {
                        if(planList.value.slice(startNum, endNum)[index] > practicalList.value.slice(startNum, endNum)[index] || !planList.value.slice(startNum, endNum)[index])
                        return "rgb(211, 49, 21)"
                        else
                        return "#fff"
                    },
                    fontSize: fontSize * 14,
                    formatter: function(value) {
                        return autoWrapLabel(value, projectList.value.length > 7 ? 7 : 11)
                    }
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
                data: planList.value.slice(startNum, endNum),
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
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            { offset: 0, color: 'rgba(104, 188, 0, 0.5)' },
                            { offset: 1, color: 'rgb(104, 188, 0)' }
                        ])
                    }
                },
                data: practicalList.value.slice(startNum, endNum),
                barWidth: 20,
            },
        ]
    };
    // 3. 渲染图表
    taskStatusChart.setOption(option);
    taskStatusChart.resize()
    // 窗口变化时自适应
    window.addEventListener('resize', taskStatusChartResize);
}
function nextPage()  {
    currentPage.value = currentPage.value < totalPages.value ? currentPage.value + 1 : 1;
}

function changePage(direction) {
    let newPage = currentPage.value + direction;
    if (newPage < 1) newPage = totalPages.value; // 循环到最后
    if (newPage > totalPages.value) newPage = 1; // 循环到第一
    currentPage.value = newPage;
    clearTimeout(timerId)
    initTaskChart()
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
.footer-container {
    width: 100%;
    // margin-top: -10px;
    height: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .pagination-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        color: #fff;
        /* 翻页箭头按钮样式 */
        .page-arrow {
            background: transparent;
            border: 1px solid #555;
            color: #fff;
            width: 30px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            padding: 0;
        }
        .page-arrow:hover {
            border-color: #52c41a;
            color: #52c41a;
        }
        /* 输入框样式 */
        .page-input {
            background: transparent;
            border: 1px solid #555;
            color: #fff;
            padding: 2px 8px;
            width: 30px;
            text-align: center;
            border-radius: 4px;
            font-size: 16px;
        }
        .page-input:focus {
            outline: none;
            border-color: #52c41a;
        }

        /* 隐藏 input type="number" 自带的上下小箭头 */
        .page-input::-webkit-outer-spin-button,
        .page-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .page-input[type=number] {
            -moz-appearance: textfield;
        }
    }
}
</style>