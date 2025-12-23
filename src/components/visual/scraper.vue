<template>
    <div id="scraper">
        <visualTitle title="刮板机数据"></visualTitle>
        <div class="data-wrapper">
            <div class="scrapers" v-if="scraper.length > 0">
                <div>
                    <div>
                        {{scraper[0].power}}Kw
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div>
                        {{scraper[0].tension}}KN
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="graphicTable">
                    <div>
                        <div>耐磨板厚度</div>
                        <div>耐磨板磨损量</div>
                        <div>剩余生命</div>
                    </div>
                    <div v-for="(item,index) in scraper" :key="index">
                        <div>30mm</div>
                        <div>{{(30 - item.plate).toFixed(1)}}mm</div>
                        <div>{{((item.plate - 15).toFixed(1) / 15 * 100).toFixed(1)}}%</div>
                    </div>
                </div>
            </div>
            <div class="scrapers" v-else>
                <i class="el-icon-loading"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import visualTitle from '../common/visualTitle'

    // 刮板机数据
    export default {
        name: "scraper",
        components: {
            visualTitle
        },
        data() {
            return {
                power: 0,
                tension: 0,
                scraper:[],
            }
        },
        props:{
            location:{
                type:Number
            }
        },
        methods: {
            getData(location){
                // this.axios({
                //     url: this.$host + '/scraper_data/now',
                //     method: 'get',
                //     params: {
                //         page:1,
                //         rows_pre_page: 4,
                //         location_data: location,
                //     }
                // }).then(res =>{
                //     if (res.data.data.content.length > 0) {
                //         this.scraper = JSON.parse(JSON.stringify(res.data.data.content));
                //         this.power = this.scraper[0].power;
                //         this.tension = this.scraper[0].tension;
                //     }
                // })
            },
        },
        mounted() {

        },


    }
</script>

<style scoped>
    .data-wrapper{
        /* height: 292px; */
    }
    .scrapers {
        padding: 20px 13px;
    }
    .scrapers i{
        font-size: 20px;
        text-align: center;
        width: 100%;
        height: 252px;
        line-height: 252px;
    }

    .scrapers > div:first-child {
        display: flex;
        justify-content: space-between;
    }

    .scrapers > div:first-child > div {
        width: 48%;
        height: 60px;
        position: relative;
        color: rgb(20, 201, 94);
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        font-weight: 600;
        box-shadow: 0 0 15px rgb(38, 133, 219) inset
    }

    .scrapers > div:first-child > div > span:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        padding: 8px;
        border-style: solid;
        /*border-color: rgb(255, 127, 127);*/
        border-color: rgb(20, 201, 94);
        border-width: 3px 0 0 3px;
    }

    /*.scrapers > div:first-child > div > span:nth-child(2) {*/
    /*    position: absolute;*/
    /*    right: 0px;*/
    /*    top: 0px;*/
    /*    padding: 8px;*/
    /*    border-style: solid;*/
    /*    !*border-color: rgb(255, 127, 127);*!*/
    /*    border-color: rgb(20, 201, 94);*/
    /*    border-width: 3px 3px 0 0;*/
    /*}*/

    .scrapers > div:first-child > div > span:nth-child(3) {
        position: absolute;
        right: 0px;
        bottom: 0px;
        padding: 8px;
        border-style: solid;
        /*border-color: rgb(255, 127, 127);*/
        border-color: rgb(20, 201, 94);
        border-width: 0 3px 3px 0;
    }

    /*.scrapers > div:first-child > div > span:nth-child(4) {*/
    /*    position: absolute;*/
    /*    left: 0px;*/
    /*    bottom: 0px;*/
    /*    padding: 8px;*/
    /*    border-style: solid;*/
    /*    !*border-color: rgb(255, 127, 127);*!*/
    /*    border-color: rgb(20, 201, 94);*/
    /*    border-width: 0 0 3px 3px;*/
    /*}*/

    /*.scrapers > div:first-child > div:nth-child(2) {*/
    /*    color: rgb(20, 201, 94);*/
    /*}*/

    /*.scrapers > div:first-child > div:nth-child(2) > span {*/
    /*    border-color: rgb(20, 201, 94);*/
    /*}*/

    .scrapers > div:first-child > div:last-child {
        color: rgb(0, 161, 234);
    }

    .scrapers > div:first-child > div:last-child > span {
        border-color: rgb(0, 161, 234);
    }

    .graphicTable {
        margin-top: 20px;
    }

    .graphicTable > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(0, 120, 255,.6) inset;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
    }

    .graphicTable > div:first-child {
        background-color: #00396a;
        color: #c4c554;
        box-shadow: none;
    }

    .graphicTable > div > div {
        width: 33%;
        text-align: center;
    }
</style>