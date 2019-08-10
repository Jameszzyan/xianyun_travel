    <template>
    <div class="item">
       <div >
           <div class="item-container clearfix" v-if="renderData" style="color:#606266;fontSize:14px;">
                <items v-if="renderData.parent" class="commentItem" :renderData="data.parent"></items>

                第{{renderData.level}}层 ({{renderData.account.nickname}}) : {{renderData.content}}
                <span style="float:right;">{{renderData.updated_at | setUpdata}}</span>
                <!-- 评论中的图片 -->
                <img  width="100px;height:100px" v-for="(picitem,index) in renderData.pics" :key="index" :src="`http://157.122.54.189:9095${picitem.url}`" alt="">
                <div class="clearfix">
                    <el-button class="button" style="float:right;margin:5px 0;" type="primary">回复</el-button>
                </div>

           </div>       
       </div>
    </div>
</template>

<script>
export default {
    // 组件名字，组件内部可以通过该属性自己调用自己
    name: "items",
    props: ['data'],
    data () {
        return {
            newList:[],
            renderData:{}
            // dialogImageUrl: 'http://157.122.54.189:9095/uploads/89653dd21c71402babe60eb9f759f7e2.png'
        }
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
    },

    watch:{
        data:{
            handler(newVal,oldVal){
                this.renderData = newVal
                if(newVal){
                    this.renderData = newVal
                    console.log(this.renderData)
                    if(this.renderData.pics.length > 0) console.log(this.renderData.pics[0])
                }

            },
            immediate:true,
            deep:true
        }
    },

    methods:{
        searchParent(obj){
            if(obj){
                if(obj.parent){
                    return this.searchParent(obj.parent)
                }
                else{
                    var name = obj.account.nickname
                    var id = obj.account.id
                    var content = obj.content
                    return id + "." +name + ": " + content
                }
            }
            else{
                return 123
            }
        },
        // handlePictureCardPreview(file) {
        //     this.dialogImageUrl = file.url;
        // }
    },
    
}
</script>

<style scoped>


</style>
