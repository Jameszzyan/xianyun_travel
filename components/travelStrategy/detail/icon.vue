<template>
    <div class="icon-container">
            <i class="el-icon-edit-outline" >
                <div>评论({{detailInfo.commentNum}})</div>
            </i>
            <i class="el-icon-star-off" @click="postStar">
                <div>收藏</div>
            </i>
            <i class="el-icon-share">
                <div>分享</div>                            
            </i>
            <i class="el-icon-thumb" @click="postLike">
                <div>点赞({{detailInfo.like}})</div>
            </i>
    </div>
</template>
<script>
export default {
    props: ["detailInfo"],
    methods: {
        postStar(){
            this.$axios({
                url:'/posts/star',
                headers:{
                    Authorization: `Bearer ${this.$store.state.user.userInfo.token || 'NO TOKEN'}`
                },
                params:{
                    id:this.$route.query||4
                }
            }).then(res=>{
                if(res.status===100){
                    this.$message.success(res.message)
                }
            })
        },
        postLike(){
            this.$axios({
                url:'/posts/like',
                headers:{
                    Authorization: `Bearer ${this.$store.state.user.userInfo.token || 'NO TOKEN'}`
                },
                params:{
                    id:4
                }
            }).then(res=>{
                    if(res.status===100){
                    this.$message.success(res.message)
                }
            })
        },
        
    }
}
</script>
<style scoped>
    .icon-container{
        margin:30px auto;
        text-align: center;
    }
    i{
        text-align: center;
        font-size: 30px;
        width: 100px;
        height: 100px;
        color: #909399;
    }
    i>div{
        font-size: 16px;
    }
</style>
