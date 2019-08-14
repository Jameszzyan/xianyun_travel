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
    },
    // 接受多选选项的数据进行地图更新
    filterData: {
      type: Object,
      default: {
        data: []
      }
    }
  },

  data() {
    return {
      renderData: {},
      hotelsLoaction: [],
      test: this.data,
      // 地图中心图标
      center: [116.397428, 39.90923],
      // 地图缩放程度
      zoom: 11
    };
  },

  watch: {
    // 要想操作props传过来的数据，使用watch进行深度监听
    data: {
      handler(newVal, oldVal) {
        this.renderData = newVal;
        this.hotelsLoaction = this.setLocation(newVal);
      },
      deep: true,
      immediate: true
    },

    // 监听多选选择的数据进行更新
    filterData: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal.data) {
            this.hotelsLoaction = this.setLocation(newVal);
          }
        }
      },
      deep: true,
      immediate: true
    },

    // 监听变化进行地图更新
    hotelsLoaction(val) {
      this.cityLocated(val);
    },

    // 监测路由变化展示地图
    $route() {
      this.cityLocated();
    }
  },

  methods: {
    // 整理酒店坐标
    setLocation(newVal) {
      console.log(newVal);
      var show = [];
      // 找出所有酒店的坐标并配置数字图标
      newVal.data.forEach((item, index) => {
        var arr = Object.values(item.location);
        // 数据处理，写入正确的经纬度
        var longitude = arr[1];
        var latitude = arr[0];
        arr[0] = longitude;
        arr[1] = latitude;
        // 传递酒店的相关信息
        let { name, address, phone, hours, id } = item;
        var info = {
          name,
          address,
          phone,
          hours,
          id,
          position: arr
        };

        // 使用marker定义的内容
        // var markerContent = `<div class="custom-content-marker">
        //   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" class="point"><span class="text">${index +
        //     1}</span>
        //   </div>`;

        // var obj = {
        //   content: markerContent,
        //   position: arr
        // };
        // show.push(obj);

        // 使用simpleMarker时的数据内容
        show.push(info);
      });
      return show;
    },

    // 根据搜索城市展示地图
    cityLocated(hotelsLoaction) {
      var hotelMap = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: this.zoom, //级别
        center: this.center //中心点坐标
      });

      //   设置每个覆盖物
      //   需设置判断条件防止异步请求不到数据
      if (hotelsLoaction) {
        if (hotelsLoaction.length > 0) {
          // 使用amap的marker
          // hotelsLoaction.forEach(function(marker) {
          //   new AMap.Marker({
          //     map: hotelMap,
          //     content: marker.content,
          //     position: item.position,
          //     offset: new AMap.Pixel(-13, -30)
          //   });
          // });

          // 使用amap组件simpleMarker
          AMapUI.loadUI(
            ["overlay/SimpleMarker", "overlay/SimpleInfoWindow"],
            function(SimpleMarker, SimpleInfoWindow) {
              hotelsLoaction.forEach((item, index) => {
                // 设置展示坐标点
                var marker = new SimpleMarker({
                  //设置图标样式
                  iconLabel: {
                    //普通文本
                    innerHTML: `${index + 1}`,
                    //设置样式
                    style: {
                      color: "#fff",
                      fontSize: "120%",
                      marginTop: "2px",
                      fontWeight: "400"
                    }
                  },
                  iconStyle: {
                    src:
                      "https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
                    style: {
                      width: "30px"
                    }
                  },
                  map: hotelMap,
                  position: item.position
                });
                // 设置酒店信息窗
                var infoWindow = new SimpleInfoWindow({
                  infoTitle: `<div style="margin-bottom:5px;font-size:14px" ><a href="/hotel/hotelDetail?id=${item.id}"><strong>${item.name}</strong></a></div>`,
                  infoBody: `
                  <div style="font-size:14px;width:300px;margin-bottom:5px">
                  <span style="display:inline-block">酒店电话：</span>
                  <span style="display:inline-block;width:200px">${item.phone}</span>
                  </div>
                  <div style="font-size:14px;width:300px">
                    <span style="display:block;float:left">酒店地址：</span>
                    <span style="display:block;width:200px;float:left;margin-bottom:5px">${item.address}</span>
                  </div>
                  <div style="font-size:14px;width:300px;margin-bottom:5px">
                    <span style="display:inline-block">营业时间：</span>
                    <span style="display:inline-block;width:200px">24小时营业</span>
                  </div>
                  `,
                  //基点指向marker的头部位置
                  offset: new AMap.Pixel(0, -31)
                });
                // 设置鼠标事件
                marker.on("mouseover", event => {
                  // 改变背景图片以及宽高
                  marker.setIconStyle({
                    src:
                      "https://webapi.amap.com/theme/v1.3/markers/b/mark_r.png",
                    style: {
                      width: "34px"
                    }
                  });
                  // 展示信息窗
                  infoWindow.open(hotelMap, marker.getPosition());
                });
                marker.on("mouseout", event => {
                  // 恢复背景图片以及宽高
                  marker.setIconStyle({
                    src:
                      "https://webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
                    style: {
                      width: "30px"
                    }
                  });
                  // 关闭信息窗
                  infoWindow.close();
                });
              });
            }
          );

          // 由于simpleMarker组件创建的点无法自适应，需要使用隐藏的多边形进行显示
          var allLocations = [];
          hotelsLoaction.forEach(item => {
            allLocations.push(item.position);
          });
          var polygon = new AMap.Polygon({
            path: allLocations, //以所有的坐标创建一个隐藏的多边形
            map: hotelMap,
            strokeOpacity: 0, //透明
            fillOpacity: 0, //透明
            bubble: true //事件穿透到地图
          });
          var overlaysList = hotelMap.getAllOverlays("polygon"); //获取多边形图层

          //2.使用setFitView方法
          hotelMap.setFitView(overlaysList); //自适应显示

          // 添加信息弹框
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
  // 使用marker定义的样式
  /deep/ .point {
    height: 40px;
    position: relative;
  }
  /deep/ .text {
    color: white;
    position: absolute;
    top: 3px;
    left: 10px;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>

