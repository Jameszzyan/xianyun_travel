<template>
    <div class="details">
        <el-container>
            <!-- 左边文章主体部分 -->
            <el-main class="left-container">
                <!-- 面包屑 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/travelStrategy' }">旅游攻略</el-breadcrumb-item>
                    <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
                </el-breadcrumb>
                <!-- 文章标题 -->
                <div class="title" style="margin:20px 0;">{{detailInfo.title}}</div>
                <hr style="background:#909399">
                <!-- 攻略、阅读 -->
                <div style="textAlign:right;fontSize:14px;color:#909399;paddingTop:20px;">
                    攻略：{{  detailInfo.updated_at |setUpdata }} 阅读：{{detailInfo.watch}}
                </div>
                <!-- 文章内容 -->
                <div v-html="detailInfo.content" style="margin:20px 0;overflow:hidden;">
                </div>
                <!-- 评论收藏点赞分享 -->
                <Icon :detailInfo="detailInfo"/>
                <!-- 评论模块 -->
                <Comment />
            </el-main>
            <!-- 右边侧边栏文章推荐部分 -->
            <el-aside>
                <Aside />
            </el-aside>
        </el-container> 
    </div>
</template>
<script>
import Comment from '@/components/travelStrategy/detail/comment'
import Aside from '@/components/travelStrategy/detail/aside'
import Icon from '@/components/travelStrategy/detail/icon'


export default {
    components: {
        Comment,
        Aside,
        Icon
    },
    data () {
        return {
            detailInfo:{}    
        }
    },
    methods:{
        initDetail(){
                this.$axios({
                url:'/posts',
                params:{
                    id:this.$route.query.id||4
                }
            }).then(res=>{
                this.detailInfo=res.data.data[0]
                this.detailInfo.commentNum=this.detailInfo.comments.length
            })
        }
    },
    mounted(){
        this.initDetail()
    },
    filters: {
        setUpdata(time){
            time = new Date()
            return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
        }
    },
    watch: {
        $route(to, from) {
        this.initDetail()            
    }
  }
}
</script>
<style scoped>
    .details{
        margin:0 auto;
        width: 1100px;
    }
    .title{
        font-size: 36px;
        font-weight: 600;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .left-container{
        width: 800px;
        overflow: hidden;
    }

</style>
