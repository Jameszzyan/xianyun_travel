<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
          <order-form :insurances="insurances" @addPassenger="sendAmount"></order-form>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <order-aside :data="data" :amount="amount"></order-aside>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
        insurances:[],
        data:{
          seat_infos:{}
        },
        amount:1
    };
  },
  components:{
      orderForm:()=>import('@/components/planeTicket/orderForm.vue'),
      orderAside:()=>import('@/components/planeTicket/orderAside.vue')
  },
  methods:{
      getInsuranceData(){
          let{id,seat_xid} = this.$route.query
          this.$axios({
              url:`/airs/${id}`,
              method:'get',
              params:{
                  seat_xid
              }
          }).then(result=>{
              console.log(result)
              this.data = result.data
              this.insurances = result.data.insurances
          }).catch(err=>{
              console.log(err)
          })
      },

      sendAmount(val){
        this.amount = val
      }
  },
  mounted(){
      this.getInsuranceData()
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>


