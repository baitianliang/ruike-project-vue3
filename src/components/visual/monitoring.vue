<template>
    <div id="monitoring">
        <visualTitle title="视频监控"></visualTitle>
        <div class="data-wrapper">
            <div class="monitoring-list">
                <div @click.stop="jiankong(1)">
                    <div>
                        <v-videoPlay videoUrl="http://videos.jthapp.com/mining/publicity.mp4" :autoPlay="false"></v-videoPlay>
                    </div>
                </div>
                <div @click="jiankong(2)">
                    <div>
                        <v-videoPlay videoUrl="http://sk.jthapp.com/videos/%E9%95%BF%E4%B9%9D%E5%B7%A8%E9%BE%99%20%20%E9%9C%87%E6%92%BC%E6%9D%A5%E8%A2%AD.MP4" :autoPlay="false"></v-videoPlay>
                    </div>
                </div>
                <div @click="jiankong(3)">
                    <div>
                        <v-videoPlay videoUrl="http://videos.jthapp.com/mining/publicity.mp4" :autoPlay="false"></v-videoPlay>
                    </div>
                </div>
                <div @click="jiankong(4)">
                    <div>
                        <v-videoPlay videoUrl="http://videos.jthapp.com/mining/publicity.mp4" :autoPlay="false"></v-videoPlay>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            v-model.sync="videoVisible"
            v-if="videoVisible"
            width="60%"
            :show-close="false"
            :modal-append-to-body="false"
            top="17vh"
            @close="handleClose">
            <div class="dialog_warp">
                <videoPlayer class="vjs-custom-skin videoPlayer" ref="videoPlayer" :options="playerOptions"
                            v-if="videoVisible"  :autoPlay="true"></videoPlayer>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    import 'video.js/dist/video-js.css'
    import {videoPlayer} from 'vue-video-player'
    import 'videojs-flash'
    import vVideoPlay from '../../components/visual/videoPlay'

    //监控
    export default {
        name: "monitoring",
        components: {
            visualTitle,
            videoPlayer,
            vVideoPlay,
        },
        data() {
            return {
                dialogVisible: false,
                videoVisible: false,
                videoUrl: '',
                playerOptions: {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: true, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/ogg" || "video/webm" || "video/mp4" || "application/x-mpegURL",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                        // src: require('../../assets/img/testVideo.mp4')//url地址
                        src: ''//url地址
                    }],
                    // poster: "../../static/images/test.jpg", //你的封面地址
                    // height: document.documentElement.clientHeight * 0.4,
                    height: 200,
                    // width: document.documentElement.clientWidth, //播放器宽度
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controls: false,
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    }
                },
            }
        },
        // computed: {
        //     player() {
        //         return this.$refs.videoPlayer.player
        //     }
        // },
        methods: {
            jiankong(val) {
                if (val === 2){
                    this.playerOptions.sources[0].src = 'http://sk.jthapp.com/videos/%E9%95%BF%E4%B9%9D%E5%B7%A8%E9%BE%99%20%20%E9%9C%87%E6%92%BC%E6%9D%A5%E8%A2%AD.MP4'
                }else{
                    this.playerOptions.sources[0].src = 'http://videos.jthapp.com/mining/publicity.mp4';
                }
                this.dialogVisible = true;
                this.videoVisible = true;
            },

            handleClose() {
                let timeout = setTimeout(() => {
                    this.videoVisible = false;
                    clearTimeout(timeout)
                }, 230)
            },
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .data-wrapper {
        // height: 260px;
    }

    .monitoring-list {
        padding: 20px 35px;

        > div {
            width: 175px;
            height: 100px;
            float: left;
            margin: 0 25px 20px 0;
            cursor: pointer;
        }

        > div:nth-child(2n) {
            margin-right: 0;
        }
    }

    .monitoring-list::after {
        content: '';
        height: 0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
    }

    .dialog_warp {
        padding: 10px;
        background-color: #091c27;
        border: 1px solid #00c4f5;
        position: relative;

        > span:nth-child(2) {
            position: absolute;
            left: -4px;
            top: -4px;
            padding: 12px;
            border-style: solid;
            border-color: rgb(57, 251, 246);
            border-width: 5px 0 0 5px;
        }

        > span:nth-child(3) {
            position: absolute;
            right: -4px;
            bottom: -4px;
            padding: 12px;
            border-style: solid;
            /*border-color: rgb(255, 127, 127);*/
            border-color: rgb(57, 251, 246);
            border-width: 0 5px 5px 0;
        }

        > span:nth-child(4) {
            position: absolute;
            right: -4px;
            top: -4px;
            padding: 12px;
            border-style: solid;
            /*border-color: rgb(255, 127, 127);*/
            border-color: rgb(57, 251, 246);
            border-width: 5px 5px 0 0;
        }

        > span:nth-child(5) {
            position: absolute;
            left: -4px;
            bottom: -4px;
            padding: 12px;
            border-style: solid;
            /*border-color: rgb(255, 127, 127);*/
            border-color: rgb(57, 251, 246);
            border-width: 0 0 5px 5px;
        }
    }

</style>
