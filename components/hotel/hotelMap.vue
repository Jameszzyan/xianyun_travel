<template>
  <div class="hotelMap">
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  // 使用props引进父组件的渲染数据
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {
      renderData: {},
      hotelsLoaction: [],
      test: this.data
    };
  },

  watch: {
    // 要想操作props传过来的数据，使用watch进行深度监听
    data: {
      handler(newVal, oldVal) {
        this.renderData = newVal;
        var show = [];
        // 找出所有酒店的坐标并配置数字图标
        newVal.data.forEach((item, index) => {
          var arr = Object.values(item.location);
          var markerContent =
          `<div class="custom-content-marker">
          <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" class="point"><span class="text">${index+1}</span>
          </div>`;
          
          var obj = {
            content: markerContent,
            position: arr
          };
          show.push(obj);
        });
        this.hotelsLoaction = show;
      },
      deep: true,
      immediate: true
    },

    hotelsLoaction(val) {
      this.cityLocated(val);
    },

    // 监测路由变化展示地图
    $route() {
      this.cityLocated();
    }
  },

  methods: {
    // 根据搜索城市展示地图
    cityLocated(hotelsLoaction) {
      var hotelMap = new AMap.Map("container", {
        zoom: 11, //级别
        center: [116.397428, 39.90923] //中心点坐标
      });

      //   设置每个覆盖物
      //   需设置判断条件防止异步请求不到数据
      if (hotelsLoaction) {
        if (hotelsLoaction.length > 0) {
          hotelsLoaction.forEach(function(marker) {
            new AMap.Marker({
              map: hotelMap,
              content: marker.content,
              position: [marker.position[1], marker.position[0]],
              offset: new AMap.Pixel(-13, -30)
            });
          });
          hotelMap.setFitView();
        } else {
          hotelMap.setCity(this.$route.query.name);
        }
      }
    }
  },

  mounted() {}
};
</script>

<style lang="less" scoped>
#container {
  height: 300px;
  width: 480px;
  margin-top: 30px;
  /deep/ .amap-icon img {
    width: 25px;
    height: 34px;
  }
  /deep/ .point{
    height:40px;
    position:relative;
  }
  /deep/ .text{
      color:white;
      position:absolute;
      top:3px;
      left:10px;
      font-weight:400;
    }
}

</style>

