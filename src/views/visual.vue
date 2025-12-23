<template>
    <div class="visual bg" ref="visualBg">
        <div id="visual" ref="visual">
        <!-- <el-scrollbar style="height: 100%;width: 100%;"
                      :wrap-style="[{overflowX:'hidden'}]"
                      :no-resize="true"
        > -->
            <visualNav :index="0" :locationText="locationText"></visualNav>
            <div class="main">
                <div>
                    <div class="datagraphic">
                        <v-support ref="support"></v-support>
                    </div>
                </div>
                <div>
                    <div class="datagraphic">
                        <v-support ref="support"></v-support>
                    </div>
                </div>
                <!-- <div>
                    <div class="datagraphic">
                        <v-monitoring></v-monitoring>
                    </div>
                </div> -->
            </div>
            <div class="main">
                <div>
                    <div class="datagraphic transmitBlock">
                        <v-transmit ref="transmit"></v-transmit>
                    </div>
                </div>
                <div>
                    <div class="datagraphic">
                        <v-scraper ref="scraper"></v-scraper>
                    </div>
                </div>
            </div>
            <div class="main">
                <div>
                    <div class="datagraphic">
                        <v-support ref="support1" title="采掘设备"></v-support>
                    </div>
                </div>
                <div>
                    <div class="datagraphic">
                        <v-reduction ref="reduction"></v-reduction>
                    </div>
                </div>
            </div>
            <div class="main">
                <div>
                    <div class="datagraphic">
                        <v-support ref="support"></v-support>
                    </div>
                </div>
                <div>
                    <div class="datagraphic">
                        <v-monitoring></v-monitoring>
                    </div>
                </div>
            </div>
        <!-- </el-scrollbar> -->
        </div>
    </div>
</template>

<script>
    import visualNav from '../components/common/visualNav'
    import visualTitle from '../components/common/visualTitle'
    import vReduction from '../components/visual/reduction'
    import vScraper from '../components/visual/scraper'
    import vSupport from '../components/visual/support'
    import vTransmit from '../components/visual/transmit'
    import vMonitoring from '../components/visual/monitoring'

    export default {
        name: 'visual',
        components: {
            visualNav,
            visualTitle,
            vReduction,
            vScraper,
            vSupport,
            vTransmit,
            vMonitoring
        },
        data() {
            return {
                locationText: '总包事业部管理驾驶舱',
            }
        },
        methods: {
        },
        mounted() {
        },
    }
</script>

<style lang="scss" scoped>
    .bg{
        height: 100%;
        background-image: url("../assets/img/bg.jpg");
        background-size: 100% auto;
        background-attachment: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #visual {
        color: #ffffff;
        width: 100%;
        height: 100%;
        // width: 1920px;
        // height: 1080px;
    }

    .main {
        // width: 1920px;
        height: calc((100% - 62px) / 4 - 15px);
        display: flex;
        justify-content: space-between;
        padding: 0 30px 15px 30px;
    }

    // .main > div:first-child {
    //     width: 430px;
    //     margin-top: 20px;
    // }

    // .main > div:nth-child(2) {
    //     width: 920px;
    // }

    // .main > div:last-child {
    //     width: 450px;
    //     margin-top: 20px;
    // }

    #warning {
        /*background: dodgerblue;*/
        width: 46px;
        height: 46px;
        position: absolute;
        top: 45px;
        left: 30px;
        color: #F97A79;
        cursor: pointer;
    }
</style>
