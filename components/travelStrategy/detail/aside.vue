<template>
    <div class="aside">
        <div class="asideTitle">相关攻略</div>
                <el-col :span="24" v-for="(item, index) in recommendList" :key="index" @click.native="handleToLink(item.id)">
                    <el-card :body-style="{ padding: '0px' }" class="clearfix">
                        <img style="width:100px;height:80px;background:#ccc;margin:15px;" :src="item.images" class="image">
                        <div style="padding: 14px;float:right;" >
                            <span>{{item.title}}</span>
                            <div class="bottom clearfix" style="marginTop:20px;">
                            <time class="time" style="fontSize:12px;color:#909399">{{ item.updated_at | setUpdata }}</time>
                            <span style="fontSize:12px;color:#909399">阅读{{item.watch}}</span>
                            </div>
                        </div>
                    </el-card>
                </el-col>
    </div>
</template>
<script>
export default {
    data () {
        return {   
            recommendList:{}  
        }
    },
    methods: {
        handleToLink(id){
            this.$router.push({
                path:'/travelStrategy/details',
                query:{
                    id:id
                }
            })
        }
    },
    mounted () {
        this.$axios({
            url:'/posts/recommend',
            params:{
                id:this.$route.query.id||4
            }
        }).then(res=>{
            this.recommendList=res.data.data
        })
    },
    filters: {
        setUpdata(time){
            time = new Date()
            return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
        }
    }
}
</script>
<style scoped>
    .asideTitle{
        font-size: 20px;
        margin: 20px 0 20px 20px;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        
    }
</style>
