<template>
    <div class="page">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                background
                :current-page="page"
                :page-sizes="[1,10, 20, 30, 40, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props:{
            total:{
                type: Number,
                default: 0
            }
        },
        data(){
            return{
                page: 1,
                pageSize: 10,//每页条数
            }
        },
        methods:{
            //页数发生改变
            handleCurrentChange(val) {
                this.page = val;
                let obj = {
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.$emit('paginationChange',obj)
            },
            //每页显示条数改变
            handleSizeChange(val) {
                this.pageSize = val;
                let obj = {
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.$emit('paginationChange',obj)
            },
            //重置页数
            reset(){
                this.page = 1;
                let obj = {
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.$emit('paginationChange',obj)
            },
        }
    }
</script>

<style scoped>
    .page {
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }
</style>
