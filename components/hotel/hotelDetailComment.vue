<template>
  <div>
    <!-- 酒店信息 -->
    <el-row class="hotelInfo">
      <el-col>
        <el-row class="hotelInfoCommon">
          <el-col :span="4">基本信息</el-col>
          <el-col :span="20" class="fontColor">
            <el-tag type="danger">入住时间: 14:00之后</el-tag>
            <el-tag type="danger">离店时间: 12:00之前</el-tag>
            <el-tag type="danger">{{hotel.creation_time}}</el-tag>
            <el-tag type="danger">{{hotel.renovat_time}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row class="hotelInfoCommon">
          <el-col :span="4">主要设施</el-col>
          <el-col :span="20" class="fontColor">
            <el-tag
              type="danger"
              v-for="(item,index) in hotel.hotelassets"
              :key="index"
            >{{item.name}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row class="hotelInfoCommon">
          <el-col :span="4">停车服务</el-col>
          <el-col :span="20" class="fontColor">---</el-col>
        </el-row>
      </el-col>
      <el-col>
        <el-row class="hotelInfoCommon">
          <el-col :span="4">品牌信息</el-col>
          <el-col :span="20" class="fontColor">---</el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 用户评论 -->
    <div class="comment">
      <p>0条真实用户评论</p>
      <el-row type="flex" justify="space-between">
        <ul>
          <li>总评数：9</li>
          <li>好评数：1</li>
          <li>差评数：2</li>
        </ul>
        <div></div>
      </el-row>
    </div>
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
      hotel: {}
    };
  },
  mounted() {
    setTimeout(() => {
      this.hotel = this.hotelDetail.data[0];
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

  .hotelPrice {
    margin-top: 20px;
    border-bottom: 1px solid #ddd;
    padding: 0 10px 10px 10px;
  }
  .hotelInfo {
    margin: 30px 0;
    .fontColor {
      color: #666;
    }
  }
  .hotelInfoCommon {
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
  .comment {
    p {
      color: black;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
}
/deep/ .el-tabs {
  width: 330px;
  height: 360px;
}
/deep/ .el-tag {
  margin-right: 20px;
}
</style>
