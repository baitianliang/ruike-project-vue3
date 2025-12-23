<template>
    <div id="nav">
        <div class="bloc">
            <!-- <div :class="index===0?'is-active':''" @click="navClick(0)">{{locationText}}</div>
            <div :class="index===1?'is-active':''" @click="navClick(1)">3D巷道图展示</div> -->
        </div>
        <div class="visualTitle">
            <span>总包事业部管理驾驶舱</span>
        </div>
        <div class="bloc">
            <!--                    <div>兖州煤矿集团</div>-->
            <!--                    <div>菏泽煤矿集团</div>-->
            <!--                    <div>郑州煤矿集团</div>-->
            <!--                    <div v-show="false"></div>-->
        </div>
        <div class="zqLogo">
            <!-- <img src="../../assets/img/zqLogo2.png" alt=""> -->
<!--            天津卓启科技有限公司-->
        </div>
        <div class="kdLogo">
            <!-- <img src="../../assets/img/kdxf2.png" alt=""> -->
<!--            科大讯飞-->
        </div>
        <!-- <div class="back" @click="fullScreenEvent()">
            <img src="../../assets/img/back.png" alt="">
            返回
        </div> -->
    </div>
</template>

<script>
    export default {
        name: "visualNav",
        props:{
            index:{
                type: Number,
                default: 0
            },
            locationText:{
                type:String,
                default: ''
            }
        },
        data() {
            return {}
        },
        methods: {
            fullScreenEvent() {
                // let el = document.documentElement;
                // if (this.isFullScren) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                // } else {
                //     if (el.requestFullscreen) {
                //         el.requestFullscreen();
                //     } else if (el.mozRequestFullScreen) {
                //         el.mozRequestFullScreen();
                //     } else if (el.webkitRequestFullScreen) {
                //         el.webkitRequestFullScreen();
                //     } else if (el.msRequestFullscreen) {
                //         el.msRequestFullscreen();
                //     }
                // }
                // document.getElementById('app').style.width = this.$store.state.offsetWidth + 'px'
                this.$router.push('/department');
            },
            fullInit() {
                let isFullscreen =
                    document.fullscreenElement ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement ||
                    document.fullScreen ||
                    document.mozFullScreen ||
                    document.webkitIsFullScreen;
                isFullscreen = !!isFullscreen;
                let that = this;
                document.addEventListener("fullscreenchange", () => {
                    that.isFullScren = !that.isFullScren;
                });
                document.addEventListener("mozfullscreenchange", () => {
                    that.isFullScren = !that.isFullScren;
                });
                document.addEventListener("webkitfullscreenchange", () => {
                    that.isFullScren = !that.isFullScren;
                });
                document.addEventListener("msfullscreenchange", () => {
                    that.isFullScren = !that.isFullScren;
                });
            },
            navClick(index) {
                if (index === 0){
                    let is3D = sessionStorage.getItem('is3D');
                    if (is3D === 'true'){
                        this.$router.push('/visual3D')
                    }else{
                        this.$router.push('/visual')
                    }

                } else if (index === 1){
                    this.$router.push('/tunnel')
                }

            },
        },
        mounted() {
            this.fullInit();
        },
    }
</script>

<style lang="scss" scoped>
    #nav {
        height: 62px;
        text-align: center;
        background-image: url("../../assets/img/bgTitle.png");
        background-repeat: no-repeat;
        background-size: 705px 67px;
        background-position: center;
        display: flex;
        justify-content: center;
        position: relative;
        /*margin-bottom: 10px;*/
        border-bottom: 1px solid #1d48c0;
        color: #b0e4fd;

        > div {
            display: flex;
            width: 560px;
        }

        .visualTitle {
            width: 720px;
        }

        .bloc {
            font-size: 16px;

            div {
                position: relative;
                top: 32px;
                height: 30px;
                line-height: 30px;
                min-width: 110px;
                padding: 0 8px;
                cursor: pointer;
            }

            .is-active {
                background-image: url("../../assets/img/clockBg.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
            }
        }

        span {
            background: linear-gradient(to right, rgb(0, 115, 255), rgb(0, 235, 255), rgb(0, 115, 255));
            -webkit-background-clip: text;
            color: transparent;
            font-size: 25px;
            font-weight: bold;
            line-height: 63px;
            letter-spacing: 5px;
            margin: 0 auto;
        }

        .back {
            width: 50px;
            font-size: 14px;
            position: absolute;
            bottom: 2px;
            right: 50px;
            cursor: pointer;

            img {
                width: 20px;
                height: 20px;
                vertical-align: middle;
                position: relative;
                top: -3px;
                right: 5px;
            }
        }
        .zqLogo {
            /*width: 150px;*/
            width: auto;
            height: 23px;
            position: absolute;
            bottom: 10px;
            right: 140px;
            line-height: 23px;
            color: #ffffff;
            img{
                width: auto;
                height: 27px;
                margin-right: 5px;
            }
        }
        .kdLogo{
            width: auto;
            height: 23px;
            position: absolute;
            bottom: 10px;
            right: 270px;
            line-height: 23px;
            color: #ffffff;
            img{
                /*width: 60px;*/
                width: auto;
                height: 27px;
                margin-right: 5px;
            }
        }
    }
</style>
