<template>
    <div id="visual-title">
        <div class="title">
            <div></div>
            <div>{{title}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "visualTitle",
        props:{
            title: {
                type: String
            },
        }
    }
</script>

<style lang="scss" scoped>

    #visual-title > .title {
        display: flex;
        height: 35px;
        line-height: 35px;
        font-size: 22px;
        color: #FFFFFF;
        margin: 10px 0;
        div:first-child {
            width: 8px;
            margin-right: 5px;
            background-color: rgb(26, 154, 255);
        }
        div:last-child {
            width: 412px;
            padding-left: 20px;
            background: -moz-linear-gradient(left, rgb(26, 154, 255), rgba(26, 154, 255, 0)); /**/
            background: -webkit-linear-gradient(left, rgb(26, 154, 255), rgba(26, 154, 255, 0)); /**/
            background: -o-linear-gradient(left, rgb(26, 154, 255), rgba(26, 154, 255, 0)); /**/
            background: -ms-linear-gradient(left, rgb(26, 154, 255), rgba(26, 154, 255, 0)); /**/
            background: linear-gradient(to right, rgb(26, 154, 255), rgba(26, 154, 255, 0)); /*用线性渐变创建图像*/
        }
    }

    .datagraphic > div:nth-child(2) {
        background-color: rgba(0, 15, 36, 0.3);
        border: 1px solid rgba(73, 172, 255, .2);
    }

</style>