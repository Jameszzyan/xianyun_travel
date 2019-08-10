<template>
  <!-- 酒店风景与交通 -->
  <div class="scenery">
    <!-- 地图盒子 -->
    <div id="container"></div>
    <el-tabs v-model="activeName">
      <!-- 风景 -->
      <el-tab-pane label="风景" name="first">
        <ul style=" overflow:scroll;height:309px">
          <li
            v-for="(item1,index1) in hotel.scenic"
            :key="index1"
            @mouseenter="showMap({longitude:118+index1*0.01,latitude:31+index1*0.01})"
          >{{item1.name}}</li>
        </ul>
      </el-tab-pane>
      <!-- 交通 -->
      <el-tab-pane label="交通" name="second">
        <ul style=" overflow:scroll;height:309px">
          <li v-for="(item2,index2) in hotel.scenic" :key="index2">{{item2.name}}</li>
        </ul>
      </el-tab-pane>
    </el-tabs>
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
      hotel: {},
      activeName: "first" //默认tab栏显示第一行
    };
  },
  methods: {
    getMap(obj) {
      var map = new AMap.Map("container", {
        zoom: 12, //级别
        center: [obj.longitude, obj.latitude] //中心点坐标
      });
      // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: new AMap.LngLat(obj.longitude, obj.latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: "北京"
      });
      // 将创建的点标记添加到已有的地图实例：
      map.add(marker);
    },
    showMap(obj) {
      this.getMap(obj);
    }
  },
  watch: {
    hotel(newValue, oldValue) {
      this.getMap(this.hotel.location);
    }
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
  #container {
    width: 650px;
    height: 360px;
  }
  .scenery {
    display: flex;
    justify-content: space-around;
    margin: 50px 0;
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
