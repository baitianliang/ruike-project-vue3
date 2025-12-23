<template>
    <div id="reduction">
        <div class="data-wrapper">
            <div class="reductionDetails">
                <div>
                    <div></div>
                    <div>润滑油油温</div>
                    <div>冷却水流量</div>
                    <div>冷却水水温</div>
                    <div>高速轴承温度</div>
                    <div>低速轴承温度</div>
                    <div>振动频率</div>
                    <div>冷却水水压</div>
                </div>
<!--                <div class="box">-->
<!--                        <div class="reductionDetails-r" v-for="item in reduction" :key="item.reducerDataId">-->
<!--                            <div>{{item.reducerName}}</div>-->
<!--                            <div>{{item.oilTemperature}}℃</div>-->
<!--                            <div>{{item.coldWaterFlow}}L/min</div>-->
<!--                            <div>{{item.coldWaterTemperature}}℃</div>-->
<!--                            <div>{{item.highSpeedTemperature}}℃</div>-->
<!--                            <div>{{item.lowSpeedTemperature }}℃</div>-->
<!--                            <div>{{item.shock}}赫兹/分</div>-->
<!--                            <div>{{item.coldWaterPressure}}map</div>-->
<!--                        </div>-->
<!--                </div>-->
                <swiper class="box" style="height: 100%" ref="mySwiper" :options="swiperOptions">
                    <swiper-slide class="reductionDetails-r" v-for="item in reduction" :key="item.reducerDataId">
                        <div>{{item.reducerName}}</div>
                        <div>{{item.oilTemperature}}℃</div>
                        <div>{{item.coldWaterFlow}}L/min</div>
                        <div>{{item.coldWaterTemperature}}℃</div>
                        <div>{{item.highSpeedTemperature}}℃</div>
                        <div>{{item.lowSpeedTemperature }}℃</div>
                        <div>{{item.shock}}赫兹/分</div>
                        <div>{{item.coldWaterPressure}}map</div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="backGTitle"></div>
    </div>
</template>

<script>
    import {Swiper, SwiperSlide, directive} from 'vue-awesome-swiper'
    // import 'swiper/swiper-bundle.css'
    import '../../assets/css/swiper-bundle.min.css'

    // 减速机数据
    export default {
        name: "reduction",
        props: {
            location: {
                type: Number,
            }
        },
        components: {
            Swiper,
            SwiperSlide
        },
        directives: {
            swiper: directive
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.$swiper
            }
        },

        data() {
            return {
                reduction: [
                    {}
                ],
                swiperOptions: {
                    slidesPerView: 4,
                },
            }
        },
        methods: {
            getData(location) {
                // this.axios({
                //     url: this.$host + '/reducer_data/now',
                //     method: 'get',
                //     params: {
                //         page: 1,
                //         rows_pre_page: 8,
                //         location_data: location,
                //     }
                // }).then(res => {
                //     if (res.data.data.content.length > 0) {
                //         this.reduction = JSON.parse(JSON.stringify(res.data.data.content)).reverse();
                //     }
                // })
            },

        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    #reduction {
        margin-top: 10px;
        position: relative;

        .data-wrapper {
            // height: 287px;
        }
    }

    .backGTitle{
        height: 31px;
        width: 100%;
        background-color: #00396a;
        position: absolute;
        top: 0;
        z-index: 0;
    }
    .reductionDetails {
        display: flex;
        font-size: 13px;
        text-align: center;
        line-height: 30px;
        color: #FFFFFF;
        background-color: rgba(0, 15, 36, 0.3);
        /*border: 1px solid rgba(73, 172, 255, .2);*/
    }

    .reductionDetails > div:first-child > div,
    .reductionDetails .reductionDetails-r > div {
        width: 90px;
        height: 30px;
        padding: 0 5px;
        margin: 5px 0;
    }

    .reductionDetails > div:first-child > div:first-child,
    .reductionDetails .reductionDetails-r > div:first-child {
        margin-top: 0;
    }

    .reductionDetails > div:first-child > div:nth-child(2),
    .reductionDetails .reductionDetails-r > div:nth-child(2) {
        margin-top: 10px;
    }

    .reductionDetails > div:first-child > div:last-child,
    .reductionDetails .reductionDetails-r > div:last-child {
        margin-bottom: 10px;
    }

    .reductionDetails > div:last-child {
        display: flex;
        width: 360px;
        overflow: hidden;
    }

    .reductionDetails > div:first-child > div:first-child,
    .reductionDetails .reductionDetails-r > div:first-child {
        background-color: #00396a;
        /*border-radius: 2px;*/
        color: #c4c554;
    }

    .box {
        height: 100%;
        display: flex;
    }
</style>