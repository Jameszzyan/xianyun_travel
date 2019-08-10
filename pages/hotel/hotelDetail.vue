<template>
  <div class="container">
    <!-- 酒店内容部分，把酒店详情数据传递 -->
      <HotelDetailContainer :hotelDetail='hotelDetail'/>
      <!-- 酒店风景与交通,地图 -->
    <HotelDetailMap :hotelDetail='hotelDetail'/>
    <!-- 评论部分 -->
    <HotelDetailComment :hotelDetail='hotelDetail'/>
  </div>
      
</template>

<script>
import HotelDetailContainer from '@/components/hotel/hotelDetailContainer'
import HotelDetailMap from '@/components/hotel/hotelDetailMap'
import HotelDetailComment from '@/components/hotel/hotelDetailComment'
export default {
  components:{
    HotelDetailContainer,
    HotelDetailMap,
    HotelDetailComment
  },
  data(){
    return {
      hotelDetail:{
      } ,//酒店详情总数据
    }
  },
  methods: {
    // 获取酒店详情页面
    async init() {
      var res =await this.$axios({
        url: "hotels",
        method: "get",
        params: {
          id: this.$route.query.id
        }
      });
      console.log(res);
      this.hotelDetail=res.data
    },
  },
  mounted() {
    this.init();
  }
};


</script>

<style lang='less' scoped>
.container {
  width: 1000px;
  margin: 0 auto;

}
</style>
