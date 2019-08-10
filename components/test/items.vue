    <template>
    <div class="item">
       <div >
           <div class="item-container clearfix" v-if="data">
                <items v-if="data.parent" class="commentItem" :data="data.parent"></items>

                {{data.level}}楼 ({{data.account.nickname}}) : {{data.content}}
                <span style="float:right;">{{data.updated_at | setUpdata}}</span>
                <div class="clearfix">
                    <el-button class="button" style="float:right;margin:5px 0;" type="primary" size="mini">回复</el-button>
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
            newList:[]
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
                console.log(this.searchParent(newVal))
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
        }
    }

}
</script>

<style scoped>
/* .button{
    visibility: hidden;
}
.item:hover .button{
    visibility: visible;
} */
.item-container{
    border-bottom: 1px dashed #c0c0c0;
}

</style>
