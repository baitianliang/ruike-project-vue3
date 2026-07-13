<template>
    <!-- <div
        ref="qualityProblem"
        style="width: 100%; height: 100%; margin: 0px auto"
    ></div> -->
    <div class="chart-wrapper">
        <svg :viewBox="props.viewBox ? '-100 0 720 360' : '0 0 520 360'" id="pieChart" @click="emit('showTaskDetail')">
            <g ref="wallsLayer2"></g>
            <g ref="topsLayer2"></g>
            <!-- ===== 中心文字 ===== -->
            <g class="center-text-group">
                <!-- 主文字 -->
                <text x="260" y="170" class="center-value" :style="`font-size: 34px`">{{ total }}</text>
                <text x="260" y="195" class="center-unit" :style="`font-size: 20px`">问题总数</text>
            </g>
        </svg>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import * as echarts from "echarts";
import axios from "../../assets/axios/visual.js"

let rawData = [];

const wallsLayer2 = ref(null);
const topsLayer2 = ref(null);

const cx = 260, cy = 180;
const outerR = 115, innerR = 70;
const thickness = 10;

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeRing(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    // 如果是完整圆环（360°），使用专用函数
    if (endAngle - startAngle >= 360 || rawData.length === 1) {
        return describeFullRing(x, y, innerRadius, outerRadius);
    }
    const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
    const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", startOuter.x, startOuter.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");
}
// ===== 【关键修复】支持单条数据的完整圆环 =====
function describeFullRing(x, y, innerRadius, outerRadius) {
    // 完整圆环 = 两个半弧拼接
    const r = outerRadius;
    const rInner = innerRadius;
    return [
        "M", x - r, y,
        "A", r, r, 0, 1, 1, x + r, y,
        "A", r, r, 0, 1, 1, x - r, y,
        "M", x - rInner, y,
        "A", rInner, rInner, 0, 1, 0, x + rInner, y,
        "A", rInner, rInner, 0, 1, 0, x - rInner, y,
        "Z"
    ].join(" ");
}

function describeWall(x, y, radius, thickness, startAngle, endAngle) {
    const sTop = polarToCartesian(x, y, radius, startAngle);
    const eTop = polarToCartesian(x, y, radius, endAngle);
    const sBottom = polarToCartesian(x, y + thickness, radius, startAngle);
    const eBottom = polarToCartesian(x, y + thickness, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", sTop.x, sTop.y,
        "A", radius, radius, 0, largeArcFlag, 1, eTop.x, eTop.y,
        "L", eBottom.x, eBottom.y,
        "A", radius, radius, 0, largeArcFlag, 0, sBottom.x, sBottom.y,
        "Z"
    ].join(" ");
}

let currentAngle = 0;
function initTaskChart() {
    const total = rawData.reduce((sum, item) => sum + item.value, 0);
    const reversedData = [...rawData].reverse();
    
    const slices = reversedData.map(item => {
        const sliceAngle = total === 0 ? 0 : (item.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;
        const middleAngle = (startAngle + endAngle) / 2;
        const percentage = total === 0 ? 0 : ((item.value / total) * 100).toFixed(0) + '%';
        return { ...item, startAngle, endAngle, middleAngle, percentage };
    });
    
    // 画家算法深度排序
    slices.sort((a, b) => {
        const cosA = Math.cos((a.middleAngle - 90) * Math.PI / 180);
        const cosB = Math.cos((b.middleAngle - 90) * Math.PI / 180);
        return cosA - cosB; 
    });
    
    slices.forEach((item) => {
        const parts = [];
        // 1. 底面
        const bottomPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        bottomPath.setAttribute("d", describeRing(cx, cy + thickness, innerR, outerR, item.startAngle, item.endAngle));
        bottomPath.setAttribute("fill", item.darkColor);
        bottomPath.setAttribute("class", "slice-piece");
        wallsLayer2.value.appendChild(bottomPath);
        parts.push(bottomPath);
    
        // 2. 内侧墙体
        const innerWall = document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerWall.setAttribute("d", describeWall(cx, cy, innerR, thickness, item.startAngle, item.endAngle));
        innerWall.setAttribute("fill", item.darkColor);
        innerWall.setAttribute("class", "slice-piece");
        innerWall.style.filter = "brightness(0.8)"; // 适当调亮背光面，消除暗沉感
        wallsLayer2.value.appendChild(innerWall);
        parts.push(innerWall);
    
        // 3. 外侧墙体
        const outerWall = document.createElementNS("http://www.w3.org/2000/svg", "path");
        outerWall.setAttribute("d", describeWall(cx, cy, outerR, thickness, item.startAngle, item.endAngle));
        outerWall.setAttribute("fill", item.darkColor);
        outerWall.setAttribute("class", "slice-piece");
        wallsLayer2.value.appendChild(outerWall);
        parts.push(outerWall);
    
        // 4. 高亮彩色顶面
        const topPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        topPath.setAttribute("d", describeRing(cx, cy, innerR, outerR, item.startAngle, item.endAngle));
        topPath.setAttribute("fill", item.color);
        topPath.setAttribute("vector-effect", "non-scaling-stroke");
        topPath.setAttribute("class", "slice-piece top-piece");
        topsLayer2.value.appendChild(topPath);
        parts.push(topPath);
        const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
        if (item.percentage > 0) {
            labelGroup.setAttribute("class", "label-group");
        
            const pStart = polarToCartesian(cx, cy, outerR - 5, item.middleAngle); 
            const pBreak = polarToCartesian(cx, cy, outerR + 25, item.middleAngle); 
            
            const isLeft = (item.middleAngle > 180); 
            const lineLength = 30; 
            const pEnd = { x: pBreak.x + (isLeft ? -lineLength : lineLength), y: pBreak.y };
        
            const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            polyline.setAttribute("points", `${pStart.x},${pStart.y} ${pBreak.x},${pBreak.y} ${pEnd.x},${pEnd.y}`);
            polyline.setAttribute("class", "label-line");
            polyline.setAttribute("stroke", item.color);
            polyline.setAttribute("fill", "none");
            polyline.style.opacity = "0.6";
            labelGroup.appendChild(polyline);
        
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", pEnd.x + (isLeft ? -6 : 6));
            text.setAttribute("y", pEnd.y + 4);
            text.setAttribute("text-anchor", isLeft ? "end" : "start");
            text.setAttribute("class", "label-text");
            text.innerHTML = `<tspan style="font-size:16px; font-weight:600; fill: #cbd5e1;">${item.label}：</tspan><tspan style="font-size:16px; fill: #ffffff; font-weight:600; font-family: monospace;">${item.percentage}</tspan>`;
            labelGroup.appendChild(text);
        
            topsLayer2.value.appendChild(labelGroup);
            parts.push(labelGroup); 
        }
        
        // 跨图层高精度 Hover 联动
        topPath.addEventListener('mouseenter', () => {
            parts.forEach(p => {
                p.style.transform = "scale(1.03) translateZ(1.5px)";
                if (p === topPath) {
                    p.style.filter = "brightness(1.15)"; 
                } else if (p === outerWall) {
                    p.style.filter = "brightness(1.12)";
                } else if (p === labelGroup) {
                    polyline.style.strokeWidth = "1.5px";
                    polyline.style.opacity = "1";
                }
            });
        });
    
        topPath.addEventListener('mouseleave', () => {
            parts.forEach(p => {
                p.style.transform = "none";
                if (p === topPath) {
                    p.style.filter = "none";
                } else if (p === innerWall) {
                    p.style.filter = "brightness(0.8)";
                } else if (p === labelGroup) {
                    polyline.style.strokeWidth = "1.2px";
                    polyline.style.opacity = "0.6";
                } else {
                    p.style.filter = "none";
                }
            });
        });
    });
}

const props = defineProps({
    projectList: {
        type: Array,
    },
    viewBox: {
        type: Boolean,
    },
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
const total = ref(0)

function getData() {
    let str = `viewName=CRRC_JSC_ZLWT`
    if(props.projectList.length > 0) {
        str += `&projectIds=${props.projectList.join(',')}`
    }
    axios.getFormData(str)
    .then(res => {
        let num = 0
        for (const key in res.data.data[0]) {
            if(key !== 'viewName') {
                num += res.data.data[0][key]
            }
        }
        total.value = num
        emit('changeQualityProblemTotal', num)
        rawData = [
            { value: res.data.data[0].YZGSL || 0, color: 'rgb(132, 208, 224)', darkColor: '#38BDF8', label: '已整改数量' }, // 数码靛蓝
            { value: res.data.data[0].WZGSL || 0, color: 'rgb(244, 130, 86)', darkColor: '#F59E0B', label: '未整改数量' }, // 晶耀香槟金
        ]
        rawData = rawData.filter(item => item.value > 0 || item.label === '已整改数量') // 过滤掉值为0的项
        initTaskChart()
        // initTaskChart(res.data.data[0])
    })
}

const qualityProblem = ref(null)
let taskStatusChart = null
const emit = defineEmits(['showTaskDetail', 'changeQualityProblemTotal'])

// function initTaskChart(val) {
//     let num = 0
//     for (const key in val) {
//         if(key !== 'viewName') {
//             num += val[key]
//         }
//     }
//     emit('changeQualityProblemTotal', num)
//     // 1. 初始化图表
//     taskStatusChart = echarts.init(qualityProblem.value);
// //     // 2. 设置配置项
// //     const option = {
// //         tooltip: {
// //             trigger: 'item'
// //         },
// //         graphic: [{
// //             type: 'text',
// //             left: 'center',
// //             top: 'center',
// //             style: {
// //                 text: `${num}\n问题总数`,  // 显示数值
// //                 fill: 'white',
// //                 fontSize: 32 * fontSize,
// //                 fontWeight: 'bold',
// //                 textAlign: 'center',
// //             },
// //             z: 100
// //         }],
// //         series: [
// //             {
// //                 type: 'pie',
// //                 center: ['50%', '50%'],
// //                 radius : ['65%', '90%'],
// //                 data: [
// //                     // { value: val.YZGSL, name: '已整改数量', itemStyle: {color: 'rgb(254, 146, 0)'}},
// //                     // { value: val.WZGSL, name: '未整改数量', itemStyle: {color: 'rgb(229, 229, 229)'}},
// //                     { value: val.YZGSL, name: '已整改数量', itemStyle: {color: '#00A8FF'}},
// //                     { value: val.WZGSL, name: '未整改数量', itemStyle: {color: '#60D040'}},
// //                 ],
// //                 label: {
// //                     // show: false,
// //                     formatter: (val) => {
// //                         if(val.data.value > 0 && val.data.name === '已整改数量')
// //                             return `${val.data.name}
// // ${val.data.value}
// // ${val.percent}%`
// //                         else return ''
// //                     },
// //                     position: 'inside',
// //                     textStyle: {
// //                         fontSize: 16 * fontSize,
// //                     }
// //                 },
// //                 itemStyle: {
// //                     // borderColor: "#fff",
// //                     borderColor: '#0F2449',
// //                     borderWidth: 3,
// //                     fontSize: 24 * fontSize,
// //                 },
// //             }
// //         ],
// //     };// 你的原始数据
//     const pieData = [
//         { value: val.YZGSL, name: '已整改数量', itemStyle: { color: '#00A8FF' } },
//         { value: val.WZGSL, name: '未整改数量', itemStyle: { color: '#60D040' } },
//     ];

//     // 1. 使用 getPie3D 生成包含多个 surface 系列的配置
//     // 第二个参数是内径占比，0.65 对应你原来的 '65%'
//     const option = getPie3D(pieData, 0.70);

//     // 2. 添加 3D 场景的控制和中间文字（graphic 保留）
//     option.graphic = [{
//         type: 'text',
//         left: 'center',
//         top: 'center',
//         style: {
//             text: `${num}\n问题总数`,
//             fill: 'white',
//             fontSize: 32 * fontSize,
//             fontWeight: 'bold',
//             textAlign: 'center',
//         },
//         z: 100 // 确保文字显示在最上层
//     }];
//     taskStatusChart.on('click', function(params) {
//         emit('showTaskDetail')
//     });
//     // 3. 渲染图表
//     taskStatusChart.setOption(option);
//     taskStatusChart.resize()
//     // 窗口变化时自适应
//     window.addEventListener('resize', taskStatusChartResize);
// }
// function getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, height) {
//   let midRatio = (startRatio + endRatio) / 2;
//   let startRadian = startRatio * Math.PI * 2;
//   let endRadian = endRatio * Math.PI * 2;
//   let midRadian = midRatio * Math.PI * 2;

//   if (startRatio === 0 && endRatio === 1) {
//     isSelected = false;
//   }
//   k = typeof k !== 'undefined' ? k : 1 / 3;

//   let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
//   let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
//   let hoverRate = isHovered ? 1.05 : 1;

//   return {
//     u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
//     v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
//     x: function(u, v) {
//       if (u < startRadian) {
//         return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
//       }
//       if (u > endRadian) {
//         return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
//       }
//       return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
//     },
//     y: function(u, v) {
//       if (u < startRadian) {
//         return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
//       }
//       if (u > endRadian) {
//         return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
//       }
//       return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
//     },
//     z: function(u, v) {
//       if (u < -Math.PI * 0.5) {
//         return Math.sin(u);
//       }
//       if (u > Math.PI * 2.5) {
//         return Math.sin(u);
//       }
//       return Math.sin(v) > 0 ? 1 * height : -1;
//     }
//   };
// }
// function getPie3D(pieData, internalDiameterRatio) {
//   let series = [];
//   let sumValue = 0;
//   let startValue = 0;
//   let endValue = 0;
//   let legendData = [];
//   let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;

//   // 首次遍历：计算总和，准备基础系列配置
//   for (let i = 0; i < pieData.length; i++) {
//     sumValue += pieData[i].value;
//     let seriesItem = {
//       name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
//       type: 'surface',
//       parametric: true,
//       wireframe: { show: false },
//       pieData: pieData[i],
//       pieStatus: { selected: false, hovered: false, k: k }
//     };
//     if (typeof pieData[i].itemStyle != 'undefined') {
//       let itemStyle = {};
//       typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
//       typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;
//       seriesItem.itemStyle = itemStyle;
//     }
//     series.push(seriesItem);
//   }

//   // 第二次遍历：为每个系列生成参数方程
//   for (let i = 0; i < series.length; i++) {
//     endValue = startValue + series[i].pieData.value;
//     series[i].pieData.startRatio = startValue / sumValue;
//     series[i].pieData.endRatio = endValue / sumValue;
//     // 高度用 value 值映射，你也可以固定为某个数值
//     // let height = series[i].pieData.value / sumValue * 2; 
//     let height = 1;
//     series[i].parametricEquation = getParametricEquation(
//       series[i].pieData.startRatio,
//       series[i].pieData.endRatio,
//       false,
//       false,
//       k,
//       height
//     );
//     startValue = endValue;
//     legendData.push(series[i].name);
//   }

//   // 组装完整的 option
//   let option = {
//     tooltip: {
//       formatter: params => {
//         if (params.seriesName !== 'mouseoutSeries') {
//           return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${option.series[params.seriesIndex].pieData.value}`;
//         }
//       }
//     },
//     // legend: {
//     //   data: legendData,
//     //   textStyle: { color: '#fff' }
//     // },
//     xAxis3D: { min: -0.5, max: 0.5 },
//     yAxis3D: { min: -0.5, max: 0.5 },
//     zAxis3D: { min: -0.5, max: 0.5 },
//     grid3D: {
//       show: false,
//       boxHeight: 15,
//       viewControl: {
//         distance: 300,
//         alpha: 75,
//         beta: -90,
//         // autoRotate: true // 自动旋转，让3D效果更酷
//       }
//     },
//     series: series
//   };
//   return option;
// }
// function taskStatusChartResize() {
//     // nextTick(() => {
//         taskStatusChart.resize()
//     // })
// }

defineExpose({
    getData
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
    width: 100%;
    height: 100%;
}
/* 3D精密流畅动画 */
:deep(.slice-piece) {
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease;
    transform-origin: 260px 180px;
}

:deep(.top-piece) {
    cursor: pointer;
}

/* 提亮版科技标签美学设计 */
:deep(.label-group) {
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease;
    transform-origin: 260px 180px;
    pointer-events: none;
}

:deep(.label-text) {
    font-size: 14px;
    font-weight: 500;
    fill: #94a3b8; /* 稍微提亮文本，增强暗光下的可读性 */
    letter-spacing: 0.8px;
    transition: fill 0.3s ease;
}

:deep(.label-line) {
    fill: none;
    stroke-width: 1.2;
    // stroke-dasharray: 3 3; 
    transition: stroke-width 0.3s ease, stroke 0.3s ease;
}
/* ------- 中心文字专属 ------- */
.center-text-group {
    pointer-events: none;
    transform-origin: 260px 180px;
    /* 让文字在3D透视中保持正向，避免被环形遮挡，提升科技层次 */
}
.center-value {
    fill: #ffffff;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: central;
    letter-spacing: 1px;
    text-shadow: 0 0 18px rgba(56, 189, 248, 0.5);
}
.center-unit {
    fill: #ffffff;
    font-weight: 400;
    text-anchor: middle;
    dominant-baseline: central;
    opacity: 0.9;
}
</style>