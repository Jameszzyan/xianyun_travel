<template>
    <div style="padding: 50px;">
        
        <div class="clearfix">
            <div v-for="(item,index) in list" :key="index" class="currentItem clearfix">
                <!-- 显示level最高的一条评论 -->
                <div style="paddingTop:20px;" class="clearfix">
                    {{item.level}}楼 ({{item.account.nickname}}) : {{item.content}}
                    
                    <span style="float:right;">{{item.updated_at | setUpdata}}</span>
                    <div>
                        <el-button style="float:right;marginTop:5px;" type="primary" size="mini">回复</el-button>
                    </div>

                </div>
                <!-- 通过组件递归来显示该评论下面的父评论 -->
                <Item v-if="item.parent" class="parentItem" :data="item.parent">

               </item>
            </div>
        </div>
    </div>
</template>

<script>
import Item from "@/components/test/items"
export default {

    data(){
        return {
            list: [],
            childList:[]
        }
    },
    mounted () {
          this.$axios({
          url:'/posts/comments',
          params:{
              post:4,
              _limit:10,
              _start:1
          }
      }).then(res=>{
          console.log(res)
          this.list=res.data.data
          this.list.forEach((item)=>{
              if(item.parent){
                  this.childList.push(item.parent)
              }
              else{
                  this.childList.push({})
              }
          })
          console.log(this.childList)
      }).catch(err=>{
          console.log(err)
      }) 
    },
    components: {
        Item
    },
    filters: {
        setUpdata(time){
            var date1 = new Date(time)

            var hour=date1.getHours(),
                min=date1.getMinutes(),
                sec=date1.getSeconds()

            if(date1.getHours()<10){
                hour='0'+date1.getHours()
            }
            if(date1.getMinutes()<10){
                min='0'+date1.getMinutes()
            }
            if(date1.getSeconds()<10){
                sec='0'+date1.getSeconds()
            }
            return date1.getFullYear() + '-' + (date1.getMonth() + 1) 
            + '-' + date1.getDate() +" "+hour+":"+min+":"+sec
        }
    }
}
</script>

<style>
.currentItem{
    border: 1px solid #c0c0c0;
    margin-top: 10px;
    padding:10px 20px;
}
.parentItem{
    border: 1px dotted #c0c0c0;
    margin: 15px;
    padding:20px;
}
</style>
