<template>
    <div id="support">
        <visualTitle :title="title"></visualTitle>
        <div class="data-wrapper">
            <div ref="support" style="width: 100%;height: 100%"></div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'
    // 支护设备
    export default {
        name: "support",
        components: {
            visualTitle
        },
        props: {
            title: {
                type: String,
                default: '支护设备'
            }
        },
        data() {
            return {
                support: '',
                option: {
                    title: {
                        text: '',
                        textStyle: {
                            color: '#fff',
                            fontSize: 12,
                        },
                        top: 10,
                        left: 20,
                    },
                    legend: {
                        top: 6,
                        right: 5,
                        icon: "circle",
                        textStyle: {
                            color: '#fff',
                            fontSize: 14,
                        },
                        selectedMode: false,
                    },
                    tooltip: {},
                    color: ['#00c4f5', '#1bc85e', '#ff8a3c', '#fcf85c', '#d73332'],
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {       //y轴
                            show: true,
                            lineStyle: {
                                color: '#004d70'
                            }
                        },
                        data: [],
                        minorTick: {
                            show: false,
                        },
                        axisLabel: {
                            color: '#fff',
                            interval: 0,
                        }
                    },
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {       //y轴
                                show: false,
                                lineStyle: {
                                    color: '#004d70'
                                }
                                // 分割线设置
                            },
                            minorTick: {
                                show: false
                            },
                            axisLabel: {
                                color: '#fff',
                            },
                            splitLine: {
                                show: true,  //显示分割线
                                lineStyle: {
                                    color: '#004d70'
                                }
                            },
                        }, {
                            type: 'value',
                            min: 0,
                            max: 100,
                            splitNumber: 5,
                            axisLine: {       //y轴
                                show: false,
                                lineStyle: {
                                    color: '#004d70'
                                }
                                // 分割线设置
                            },
                            splitLine: {
                                show: false,  //显示分割线
                                lineStyle: {
                                    color: '#004d70'
                                }
                            },
                            axisLabel: {
                                color: '#fff',
                                formatter: '{value} %'
                            }
                        }],
                    series: [],
                },
            }
        },
        methods: {
            echartsInit() {
                let support = this.$echarts.init(this.$refs.support);
                window.addEventListener('resize', function () {
                    support.resize();
                })
                this.setSupport(support);
            },
            setSupport(support) {
                // console.log(this.$echarts.getInstanceByDom(this.$refs.support).getModel().getComponent('yAxis').axis.scale._extent)
                // console.log(this.$echarts.getInstanceByDom(this.$refs.support)._api.getModel())
                support.setOption(this.option);
            },
            getData(id) {
                this.axios({
                    url: this.$host + '/new_support_device/list',
                    method: 'get',
                    params: {
                        page: 1,
                        rows_pre_page: 9999,
                        eId: id,
                    }
                }).then(res => {
                    let result = res.data.data.content;
                    let data = [
                        {
                            name: '使用量',
                            type: 'bar',
                            data: [],
                        },
                        {
                            name: '出库量',
                            type: 'bar',
                            data: [],
                        },
                        {
                            name: '一次维修',
                            type: 'bar',
                            data: [],

                        },
                        {
                            name: '二次维修',
                            type: 'bar',
                            data: [],
                        },
                        {
                            name: '完好率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: [],
                        },
                    ];
                    let xData = [];
                    let max = 0;
                    result.forEach(item => {
                        if(this.title === '采掘设备'){
                            xData.push(item.productionDate);
                            data[0].data.push(parseInt(item.productionNum * 0.75));
                            data[1].data.push(parseInt(item.outBoundNum * 0.75));
                            data[2].data.push(parseInt(item.firstRepairNum * 0.75));
                            data[3].data.push(parseInt(item.secondRepairNum * 0.75));
                            data[4].data.push(item.rate * 100);
                            if (item.outBoundNum  * 0.75 > max){
                                max = item.outBoundNum * 0.75
                            }
                        }else{
                            xData.push(item.productionDate);
                            data[0].data.push(item.productionNum);
                            data[1].data.push(item.outBoundNum);
                            data[2].data.push(item.firstRepairNum);
                            data[3].data.push(item.secondRepairNum);
                            data[4].data.push(item.rate * 100);
                            if (item.outBoundNum > max){
                                max = item.outBoundNum
                            }
                        }

                    });
                    max = parseInt(max * 1.1).toString();
                    max = max.split('');
                    if(max.length === 1){
                        max[0] = 1;
                        max[1] = 0;
                    }else if (max.length === 2){
                        max.forEach((item,index) =>{
                            if (index === 0){
                                max[index] = parseInt(item) + 1;
                            }else{
                                max[index] = 0
                            }
                        });
                    } else if (max.length > 2) {
                        max.forEach((item,index) =>{
                            if(index === 0){
                            }else if (index === 1){
                                if (parseInt(item)+ 1 === 10){
                                    max[0]++;
                                    max[1] = 0;
                                } else {
                                    max[index] = parseInt(item) + 1;
                                }
                            }else{
                                max[index] = 0
                            }
                        });
                    }
                    max = parseInt(max.join(''));
                    this.option.yAxis[0].max = max;
                    this.option.yAxis[0].interval = max / 5;
                    this.option.xAxis.data = xData;
                    this.option.series = data;
                    this.echartsInit();
                })
            },
        },
        mounted() {
            // this.getData(0);
        },
    }
</script>

<style scoped>
    .data-wrapper {
        /* height: 274px; 292 */
    }
</style>
