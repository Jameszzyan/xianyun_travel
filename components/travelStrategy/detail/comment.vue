<template>
    <div class="comment">
      <!-- 添加评论部分 -->
      <div class="add-comment clearfix">
        <div>评论</div>
        <!-- "http://157.122.54.189:9095/upload" -->
        <el-tag
         v-if="replyName"
          closable
          @close="handleClose()"
          type="info">
          回复{{replyName}}:
      </el-tag>
        <el-input v-model="commentObj.content" style="marginTop:10px;" placeholder="说点什么啊.." @keyup.native.enter="submitComment" v-focus="isFocus"></el-input>
        <el-button type="primary" style="float:right;marginTop:10px;" @click.native="submitComment">提交</el-button>
        <el-upload
        ref="upload"
        style="float:left;marginTop:10px;"
        action="http://157.122.54.189:9095/upload"
        name="files"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success='handleSucess'
        > 
        <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
        <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div class="comment-list">
        <div class="clearfix">
            <div v-for="(item,index) in list" :key="index" class="currentItem clearfix">
                <!-- 显示level最高的一条评论 -->
                <div style="paddingTop:20px;color:#606266;fontSize:14px;" class="clearfix" >
                    第{{item.level}}层 ({{item.account.nickname}}) : {{item.content}}
                    
                    <span style="float:right;">{{item.updated_at | setUpdata}}</span>
                    <img @click="showImg(picitem.url)" width="100px;height:100px" v-for="(picitem,picindex) in item.pics" :key="picindex" :src="`http://157.122.54.189:9095${picitem.url}`" alt="">
                    <el-dialog :visible.sync="dialogVisible" size="tiny">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                    <div>
                        <el-button style="float:right;marginTop:5px;" type="primary" size="mini" @click.native="replyTo(item.id,item.account.nickname)">回复</el-button>
                    </div>

                </div>
                <!-- 通过组件递归来显示该评论下面的父评论 -->
                <Item v-if="item.parent" class="parentItem" :data="item.parent" @setFollow="setFollow">

               </item>
            </div>
        </div>
      </div>
      <!-- 分页功能 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
</template>
<script>
import Item from "@/components/travelStrategy/detail/items"

export default {
    data() {
      return {
        // 被回复人的昵称
        replyName:'',
        // 文章id
        post:null,
        //   文件上传
        dialogImageUrl: '',
        dialogVisible: false,
        // 提交评论时传递的参数
        commentObj:{
          content:'',
          follow:null,
          pics:[],
          post:null
        },
        list: [],
        limit:2,
        currentPage:0,
        total:0,
        // 点击回复进行输入框聚焦
        isFocus:false
      }
    },

    // 自定义指令
    directives:{
        focus:{
          update:function(el,binding){
            if(binding.value){
              var input = document.querySelector(".el-input__inner")
              input.focus()
            }
          }
        }
    },

    methods: {
      // 点击小图显示图片大图
      showImg(url){
            this.dialogImageUrl='http://157.122.54.189:9095'+url
            this.dialogVisible=true
      },
      // 取消回复指定人后
      // 清除被回复人的nickname和follow
      handleClose(){
        this.commentObj.follow=null,
        this.replyName=''
      },
      // 获取item组件传过来的follow的值
      setFollow(value){
        if(value){
          this.commentObj.follow=value.id
          this.replyName=value.nickname
        }
        this.isFocus = true
      },  
      // 获取当前组件中点击回复按钮时的follow值
      replyTo(id,name){
        this.commentObj.follow=id
        this.replyName=name
        this.isFocus = true
      },
      // 提交评论
      submitComment(){
        this.commentObj.post=this.$route.query.id
        this.$axios({
          url:'comments',
          method:'post',
          data:this.commentObj,
          headers:{
              Authorization: `Bearer ${this.$store.state.user.userInfo.token || 'NO TOKEN'}`
          }
        }).then(res=>{
          this.$message({
            type:'info',
            message:res.data.message
          })
          this.commentObj={
          content:'',
          follow:null,
          pics:[],
          post:null
        }
        this.$refs.upload.clearFiles()
        this.replyName=''
        this.initComment()

        })
      },
      // 文件上传成功
      handleSucess(response, file, fileList){
            // 我们要的数据就在response，我们要将上传成功之后的图片的路径(相对路径)存储到commentObj的pics中
            this.commentObj.pics.push({
              id:response[0].id,
              name:response[0].name,
              hash:response[0].hash
              })
      },
      //文件上传时的移除事件
      handleRemove(file, fileList) {
            var current = file.response
            for (var i = 0; i < this.commentObj.pics.length; i++) {
                if (this.commentObj.pics[i].id === current[0].id) {
                    this.commentObj.pics.splice(i, 1)
                    break
                }
                
            }
      },
      // 改变评论页的条数
      handleSizeChange(val) {
        this.limit=val
        this.initComment()

      },
      // 改变当前页
      handleCurrentChange(val) {
        this.currentPage=val
        this.initComment()

      },
      // 初始化评论列表
      initComment(){
        this.$axios({
            url:'/posts/comments',
            params:{
                post:this.$route.query.id,
                _limit:this.limit,
                _start:(this.limit-1)*this.currentPage
            }
        }).then(res=>{
            this.list=res.data.data
            this.total=res.data.total
        }).catch(err=>{
            console.log(err)
        }) 
      }
    },
    mounted () {
      this.initComment()
    },
    components: {
        Item
    },
    filters: {
      // 处理时间格式
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
    },
    // 观察路由中参数的变化
    watch: {
        $route(to, from) {
        this.initComment()       
      },
    },

    // 组件的updated在指令的update之后
    updated(){
      this.isFocus = false
    }
}
</script>

<style scoped>
.currentItem{
    border: 1px solid #DCDFE6;
    margin-top: 10px;
    padding:10px 20px;
}
.parentItem{
    border: 2px dotted #E4E7ED;
    margin: 15px;
    padding:20px;
}
</style>
