<template>
    <div id="transmit">
        <visualTitle title="输送设备" v-if="titleShow"></visualTitle>
        <div class="data-wrapper">
            <div ref="transmit" style="width: 100%;height: 100%"></div>
            <div id="start">启动量</div>
            <div id="total">{{total}}</div>
            <div id="totalAll">设备总量：{{totalAll}}</div>
            <div id="unTotalAll">未启动量：{{unTotalAll}}</div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'
    // 输送设备
    export default {
        name: "transmit",
        components: {
            visualTitle
        },
        props:{
            titleShow:{
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                transmit: '',
                option: {
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params){
                            return params.seriesName + '<br/>'+ params.name+ ': '+ params.value +'('+ params.data.rate + '%)'
                        },
                    },
                    legend: {
                        type: 'scroll',
                        icon:"circle",
                        pageButtonPosition: 'end',
                        orient: 'vertical',
                        left: 0,
                        top: 20,
                        itemGap: 20,
                        textStyle: {
                            color: '#fff',
                            fontSize: 16
                        },
                        pageTextStyle: {
                            color: '#fff'
                        },
                        selectedMode: false,
                        data: []
                    },
                    color: ['#3dbb51', '#363899', '#e67819', '#57e1e1', '#d73332', '#1c65f3', '#fcf85c'],
                    series: [
                        {
                            name: '今日启动量',
                            type: 'pie',
                            radius: ['40%', '55%'],
                            center: ['62%', '55%'],
                            avoidLabelOverlap: true,
                            label: {
                                show: true,
                                color: '#fff',
                                formatter: function(params){
                                    return params.value  + ' (' + params.data.rate + '%)'
                                },
                                // padding:[0,-65],
                                // lineHeight: 16
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '13',
                                }
                            },
                            labelLine: {
                                show: true,
                                length: 5,
                                length2: 10,
                                // lineStyle: {
                                //    color: '#004d70',
                                // }
                            },
                            data: [],
                        }
                    ]
                },
                total: '',
                totalAll: '',
                unTotalAll: '',
            }
        },
        methods: {
            echartsInit() {
                let transmit = this.$echarts.init(this.$refs.transmit);
                window.addEventListener('resize', function () {
                    transmit.resize();
                });
                this.setTransmit(transmit);

            },
            setTransmit(transmit) {
                transmit.setOption(this.option);
            },
            getData(id) {
                this.axios({
                    url: this.$host + '/online_device/today',
                    method: 'get',
                    params: {
                        page: 1,
                        rows_pre_page: 9,
                        parentId: id,
                    }
                }).then(res => {
                    let result = JSON.parse(JSON.stringify(res.data.data.content));
                    this.option.legend.data = [];
                    // this.option.title.text = '';
                    this.option.series[0].data = [];
                    let total = 0;
                    let totalAll = 0;
                    result.forEach(data => {
                        totalAll = totalAll + data.onlineDeviceNumber;
                        // if (data.areaName !== '未启动设备') {
                            total = total + data.onlineDeviceNumber;
                            let group = {};
                            group.value = data.onlineDeviceNumber;
                            group.name = data.areaName;
                            group.rate = data.onlineRate * 100;
                            this.option.series[0].data.push(group);
                        // }else
                        //     {
                            this.unTotalAll = 0;
                        // }
                        this.option.legend.data.push(data.areaName);

                    })
                    this.total = total + '件';
                    this.totalAll = totalAll + '件';

                    // this.option.title.text = total + '件';
                    this.echartsInit();
                })
            },
        },
        mounted() {
            // this.getData(0);
        },
    }
</script>

<style lang="scss" scoped>
    .data-wrapper {
        // height: 270px;
        position: relative;
        padding-left: 10px;

        #start {
            position: absolute;
            top: 130px;
            right: 135px;
            font-size: 16px;
            color: #ffffff;
        }

        #total {
            width: 79px;
            position: absolute;
            top: 155px;
            right: 120px;
            color: #27D9C8;
            font-weight: bold;
            font-size: 20px;
            text-align: center;
        }

        #totalAll {
            position: absolute;
            top: 5px;
            left: 120px;
            font-size: 15px;
            color: #ffffff;
            border: 1px solid rgba(38, 133, 219, .3);
            background-color: rgba(38, 133, 219, .1);
            padding: 5px;
        }
        #unTotalAll {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 15px;
            color: #ffffff;
            border: 1px solid rgba(38, 133, 219, .3);
            background-color: rgba(38, 133, 219, .1);
            padding: 5px;
        }
    }
</style>
