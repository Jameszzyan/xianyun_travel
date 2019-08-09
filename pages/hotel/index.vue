<template>
    <div class="hotel">
        <!-- 头部选择预订信息 -->
        <div class="header">
            <hotel-header :data="webData"></hotel-header>
        </div>
        <!-- 酒店范围和酒店地图 -->
        <el-row :gutter="20" class="areaAndMap">
            <!-- 酒店范围 -->
            <el-col :span="12">
                <hotel-scope :data="webData" @changeArea="init"></hotel-scope>
            </el-col>
            <!-- 酒店地图 -->
            <el-col :span="12">
                <hotel-map :data="webData"></hotel-map>
            </el-col>
        </el-row>
        <!-- 酒店列表 -->
        <hotel-list :webData="webData"></hotel-list>
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
        hotelMap:()=>import('@/components/hotel/hotelMap.vue'),
        hotelList:()=>import('@/components/hotel/hotelList.vue')
    },

    methods:{
        // 获取页面整体渲染数据
        async init(val){
            let {city} = this.$route.query
            let result = await this.$axios({
                url:`hotels?&city=${city}`,
                method:'get'
            })
            this.webData = result.data
            // console.log(this.webData)
            if(val){
                if(val.indexOf('区域') > -1){
                   var arr = val.split(':')
                   if(arr[1] === '全部'){
                       arr[1] = ''
                   }
                   var selectedList = this.webData.data.filter((item)=>{
                       return item.area.indexOf(arr[1]) > -1
                   })
                   this.webData.data = selectedList
                   console.log(this.webData)
                }
            }
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


