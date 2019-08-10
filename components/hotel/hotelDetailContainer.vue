<template>
  <div class="container">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          :to="{ path: '/hotel',query:{city:hotel.city.id,name:hotel.real_city }}"
        >{{hotel.big_cate}}</el-breadcrumb-item>
        <el-breadcrumb-item
          :to="{ path: '/hotel',query:{city:hotel.city.id,name:hotel.real_city }}"
        >{{hotel.real_city}}酒店</el-breadcrumb-item>
        <el-breadcrumb-item>{{hotel.name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 酒店头部信息 -->
    <el-row class="hotelHead">
      <el-col>
        <span class="bigFont">
          {{hotel.name}}
          <i class="iconfont iconhuangguan"></i>
        </span>
        &nbsp;&nbsp;&nbsp;
      </el-col>
      <el-col>{{hotel.alias}}</el-col>
      <el-col>
        <i class="iconfont iconlocation"></i>
        <span class="address">{{hotel.address}}</span>
      </el-col>
    </el-row>
    <!-- 酒店图片 -->
    <el-row type="flex" justify="space-between" class="hotelImg">
      <div class="hotelImgLeft">
        <img src="http://157.122.54.189:9093/images/hotel-pics/1.jpeg" alt />
      </div>
      <div class="hotelImgRight">
        <ul>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/1.jpeg" alt />
          </li>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/2.jpeg" alt />
          </li>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/3.jpeg" alt />
          </li>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/4.jpeg" alt />
          </li>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/5.jpeg" alt />
          </li>
          <li>
            <img src="http://157.122.54.189:9093/images/hotel-pics/6.jpeg" alt />
          </li>
        </ul>
      </div>
    </el-row>
    <!-- 酒店产品 -->
    <el-row class="hotelPrice">
      <el-col :span="8">价格来源</el-col>
      <el-col :span="8">低价房型</el-col>
      <el-col :span="8">最低价格/每晚</el-col>
    </el-row>
    <el-row class="hotelPro" v-for="(item,index) in hotel.products" :key="index">
      <el-col :span="8">{{item.name }}</el-col>
      <el-col :span="8">{{item.bestType}}</el-col>
      <el-col :span="8">
        <span class="roomPrice">￥{{item.price}}</span>&nbsp;起&nbsp;
        <span class="roomPrice">&gt;</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    hotelDetail: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      hotel: {
        city: {}
      }
    };
  },

  mounted() {
    setTimeout(() => {
      this.hotel = this.hotelDetail.data[0];
      console.log(this.hotel);
    }, 1000);
  }
};
</script>

<style lang='less' scoped>
.container {
  i {
    color: #f90;
  }
  .breadcrumb {
    font-size: 14px;
    margin: 10px 0;
  }
  .hotelHead {
    span {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
    .address {
      font-size: 14px;
      color: #666;
    }

    margin: 10px 0;
  }
  width: 1000px;
  margin: 0 auto;
  #container {
    width: 650px;
    height: 360px;
  }
  .hotelImg {
    .hotelImgLeft {
      width: 640px;
      height: 360px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hotelImgRight {
      width: 330px;
      height: 360px;
      img {
        width: 100%;
        height: 100%;
      }
      ul > li {
        float: left;
        width: 154px;
        height: 110px;
        margin: 0 10px 14px 0;
      }
    }
  }

  .hotelPro {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    font-size: 14px;
    &:hover {
      background-color: #f5f7fa;
    }
    .roomPrice {
      color: #f90;
      font-size: 20px;
      font-weight: 600;
    }
  }
  .hotelPrice {
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    padding: 0 10px 10px 10px;
  }
}
</style>

