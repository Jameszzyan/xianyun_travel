<template>
    <div class="hotel">
        <!-- 头部选择预订信息 -->
        <div class="header">
            <hotel-header :data="webData" @changeCityData="init"></hotel-header>
        </div>
        <!-- 酒店范围和酒店地图 -->
        <el-row :gutter="20" class="areaAndMap">
            <!-- 酒店范围 -->
            <el-col :span="12">
                <hotel-scope :data="webData"></hotel-scope>
            </el-col>
            <!-- 酒店地图 -->
            <el-col :span="12">
                <hotel-map :data="webData"></hotel-map>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 传送到各个子组件的原始渲染数据
            webData:{
                data:[],
                nextstart:0,
                total:0
            }
        }
    },

    components:{
        // 懒加载各部分组件
        hotelHeader:()=>import('@/components/hotel/hotelHeader.vue'),
        hotelScope:()=>import('@/components/hotel/hotelScope.vue'),
        hotelMap:()=>import('@/components/hotel/hotelMap.vue')
    },

    methods:{
        // 获取页面整体渲染数据
        async init(val){
            let {city} = this.$route.query
            if(val){
                city = val
            }
            let result = await this.$axios({
                url:`hotels?&city=${city}`,
                method:'get'
            })
            this.webData = result.data
            // console.log(this.webData)
        },

    },

    watch:{
        // 路由更新数据重新获取渲染
        '$route'(){
            this.init()
        }
    },

    mounted(){
        // 页面首次加载渲染
        this.init()
        
    }
}
</script>

<style lang="less" scoped>
.hotel{
    width:1000px;
    margin:0 auto;
}
</style>


