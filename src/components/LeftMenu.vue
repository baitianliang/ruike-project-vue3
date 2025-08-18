<template>
    <div class="left_menu">
        <div class="menu_title">
            阶段与模块
        </div>
        <div v-for="(item, index) in props.menuList" :key="index">
            <div>
                <el-button v-if="item.status === '已完成'" round class="top_menu" @click="changePage(item)">
                    <span class="menu_status status_ed"></span>
                    {{ item.name }}
                </el-button>
                <el-button v-else-if="item.status === '进行中'" round class="top_menu" @click="changePage(item)">
                    <span class="menu_status status_ing"></span>
                    {{ item.name }}
                </el-button>
                <el-button v-else round class="top_menu" @click="changePage(item)">
                    <span class="menu_status status_un"></span>
                    {{ item.name }}
                </el-button>
                <div class="next_menu">
                    <div v-for="(item2, index2) in item.nextList" :key="index2">
                        <el-button v-if="item2.status === '已完成'" round @click="changePage(item2, item)">
                            <span class="menu_status status_ed"></span>
                            {{ item2.name }}
                        </el-button>
                        <el-button v-else-if="item2.status === '进行中'" round @click="changePage(item2, item)">
                            <span class="menu_status status_ing"></span>
                            {{ item2.name }}
                        </el-button>
                        <el-button v-else round @click="changePage(item2, item)">
                            <span class="menu_status status_un"></span>
                            {{ item2.name }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    menuList: {
        type: Object,
        requied: true
    }
})
const emit = defineEmits(['update:menuList'])
function changePage(val1, val2) {
    const obj = { ...val1 }
    if(!obj.nextList) {
        obj._name = obj.name
        obj.name =  `${val2.name} > ${obj.name}`
    }
    emit('update:menuList', obj)
}
</script>

<style lang="scss">
.left_menu {
    margin: 16px;
    .menu_title {
        color: rgba(31, 41, 55);
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
        margin-bottom: 16px;
    }
    .el-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    .el-button {
        padding-right: 14px!important;
        margin-bottom: 15px;
        span {
            display: flex;
            .menu_status {
                line-height: 28px;
                margin: auto;
                margin-left: -10px;
                margin-right: 10px;
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            span {
                font-weight: 500;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .top_menu {
        margin-bottom: 10px;
    }
    .next_menu {
        margin-left: 30px;
        padding-left: 15px;
        border-left: 2px dashed #ddd;
        div >.el-button {
            border: 0px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        div:last-child {
            margin-bottom: 15px;
            .el-button {
                margin-bottom: 0px;
            }
        }
    }
}

</style>