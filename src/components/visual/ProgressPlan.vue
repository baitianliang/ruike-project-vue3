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
let timerId = null// ===== 在组件/模块顶部 =====
let animationId = null;
let isAnimating = false;
let resizeHandler = null;
const emit = defineEmits(['changeProgressPlanTotal'])

// ===== 初始化函数 =====
function initTaskChart() {
    // 1. 停止旧动画
    stopAnimation();
    
    // 2. 计算分页数据
    let startNum = 0, endNum = 6;
    if (totalPages.value > 1) {
        startNum = (currentPage.value - 1) * 6;
        endNum = currentPage.value * 6;
    }
    
    // 3. 计算异常数量
    let num = 0;
    planList.value.forEach((el, index) => {
        if (practicalList.value[index] < el || !el) {
            num++;
        }
    });
    emit('changeProgressPlanTotal', num)
    
    // 4. 准备数据
    const planData = planList.value.slice(startNum, endNum);
    const actualData = practicalList.value.slice(startNum, endNum);
    const projectData = projectList.value.slice(startNum, endNum);
    
    // 5. 创建或更新图表实例
    if (!taskStatusChart) {
        taskStatusChart = echarts.init(projectPhase.value);
    }
    
    // 6. 配置项
    const option = {
        // title: {
        //     text: `⚠进度异常项目数量: ${num}`,
        //     textStyle: {
        //         // color: "#fff",
        //         color: "rgb(211, 49, 21)",
        //         fontSize: fontSize * 18,
        //     },
        //     right: 100 * fontSize,
        // },
        grid: {
            top: 80 * fontSize,
            right: 60 * fontSize,
            bottom: 67 * fontSize,
            left: 130 * fontSize,
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(function(item) {
                    result += item.seriesName + ': ' + item.value + ' %<br/>';
                });
                return result;
            },
            axisPointer: {
                type: 'cross',
                crossStyle: { color: '#999' },
            },
            textStyle: {
                fontSize: fontSize * 16,
            }
        },
        legend: {
            data: ['计划完成比', '实际完成比'],
            textStyle: {
                color: "#fff",
                fontSize: fontSize * 14,
            }
        },
        xAxis: [{
            type: 'category',
            data: projectData,
            axisPointer: { type: 'shadow' },
            axisLabel: {
                color: "#fff",
                fontSize: fontSize * 14,
                formatter: function(value) {
                    return autoWrapLabel(value, projectList.value.length > 7 ? 7 : 11);
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
                color: "#fff",
                formatter: '{value}.00%',
                fontSize: fontSize * 14,
            },
            splitLine: { show: false },
        }],
        series: [
            {
                name: '计划完成比',
                type: 'bar',
                itemStyle: {
                    barBorderRadius: 2,
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        { offset: 0, color: 'rgba(0, 168, 221, 0.4)' },
                        { offset: 1, color: '#0077cc' }
                    ]),
                },
                data: planData,
                barWidth: 20,
            },
            {
                name: '实际完成比',
                type: 'bar',
                itemStyle: {
                    barBorderRadius: 2,
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        { offset: 0, color: 'rgba(0, 200, 119, 0.4)' },
                        { offset: 1, color: '#00c877' }
                    ]),
                },
                data: actualData,
                barWidth: 20,
            },
        ]
    };
    
    // 7. 渲染
    taskStatusChart.setOption(option, true);
    taskStatusChart.resize();
    
    // 8. 启动警告标志动画
    const warningIndices = planData
        .map((plan, idx) => ({ plan, actual: actualData[idx], idx }))
        .filter(({ plan, actual }) => plan > 0 && actual - plan < 0 || !plan)
        .map(({ idx }) => idx);

    if (warningIndices.length > 0) {
        startWarningAnimation(planData, actualData, warningIndices);
    } else {
        // 没有警告，清除 graphic
        taskStatusChart.setOption({ graphic: [] });
    }
}

// ===== 启动警告动画 =====
function startWarningAnimation(planData, actualData, warningIndices) {
    // 停止旧动画
    stopAnimation();
    
    let phase = 0;
    isAnimating = true;
    
    function animate() {
        if (!isAnimating || !taskStatusChart) {
            return;
        }
        
        phase += 0.04;
        const breathe = Math.sin(phase * Math.PI * 2);
        const opacity = 0.6 + (breathe + 1) * 0.1;
        const scale = 1 + breathe * 0.001;
        const r = 211 - breathe * 10;
        const g = 49 + breathe * 10;
        const b = 21 - breathe * 10;
        
        const graphics = [];
        
        warningIndices.forEach((idx) => {
            const maxVal = Math.max(planData[idx] || 0, actualData[idx] || 0);
            const pos = taskStatusChart.convertToPixel('grid', [idx, maxVal * 1.08]);
            
            if (pos && typeof pos[0] === 'number' && typeof pos[1] === 'number') {
                graphics.push({
                    type: 'text',
                    left: pos[0] - 13 + 'px',
                    top: (30 * fontSize) + 'px',
                    style: {
                        text: '⚠',
                        textAlign: 'center',
                        fill: `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`,
                        fontSize: (30 * fontSize) * scale,
                        fontWeight: 'bold',
                        opacity: opacity,
                        textShadowBlur: 10 * scale,
                        textShadowColor: `rgba(211, 49, 21, ${opacity * 0.5})`,
                    },
                    z: 100,
                });
            }
        });
        
        taskStatusChart.setOption({ graphic: graphics });
        animationId = requestAnimationFrame(animate);
    }
    
    // 延迟启动，确保图表已渲染
    setTimeout(animate, 300);
}

// ===== 停止动画 =====
function stopAnimation() {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// ===== 销毁图表 =====
function disposeTaskChart() {
    stopAnimation();
    if (taskStatusChart) {
        taskStatusChart.dispose();
        taskStatusChart = null;
    }
    if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
}

// ===== resize 处理 =====
resizeHandler = function() {
    if (taskStatusChart) {
        taskStatusChart.resize();
    }
};
window.addEventListener('resize', resizeHandler);
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