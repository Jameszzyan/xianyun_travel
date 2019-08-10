<template>
  <div class="hotel">
    <!-- 头部选择预订信息 -->
    <div class="header">
      <hotel-header :data="webData" @sendLiveData="sendLiveData"></hotel-header>
    </div>
    <!-- 酒店范围和酒店地图 -->
    <el-row :gutter="20" class="areaAndMap">
      <!-- 酒店范围 -->
      <el-col :span="12">
        <hotel-scope :data="webData" @sendArea="sendArea"></hotel-scope>
      </el-col>
      <!-- 酒店地图 -->
      <el-col :span="12">
        <hotel-map :data="webData"></hotel-map>
      </el-col>
    </el-row>
    <!-- 酒店列表 -->
    <hotel-list :webData="webData" @sendPage="sendPage"></hotel-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 传送到各个子组件的原始渲染数据
      webData: {
        data: [],
        nextstart: 0,
        total: 0
      },
      // 传递各组件数据到父组件
      liveData: {
        enterTime: "",
        leftTime: "",
        person: 0,
        _start: 0
      },
      // 传递区域到各个子组件
      area: "全部",
    };
  },

  components: {
    // 懒加载各部分组件
    hotelHeader: () => import("@/components/hotel/hotelHeader.vue"),
    hotelScope: () => import("@/components/hotel/hotelScope.vue"),
    hotelMap: () => import("@/components/hotel/hotelMap.vue"),
    hotelList: () => import("@/components/hotel/hotelList.vue")
  },

  methods: {
    // 获取页面整体渲染数据
    async init() {
      let { city } = this.$route.query;
      let obj = this.liveData;
      let finalArr = {
        city
      };
      for (var key in obj) {
        if (obj[key] && key !="person") {
          finalArr[key] = obj[key];
        }
      }
      let result = await this.$axios({
        url: "/hotels",
        method: "get",
        params: finalArr
      });
      let data = result.data
      if(this.area !== "全部"){
          this.webData.data = data.data.filter((item)=>{
              return item.area.indexOf(this.area) > -1
          })
      }
      else{
          this.webData = data
      }
      
    },

    // 传递酒店头部数据
    sendLiveData(val) {
      this.liveData.enterTime = val.enterTime;
      this.liveData.leftTime = val.leftTime;
      this.liveData.person = val.person;
      this.init();
    },

    // 传递选中区域
    sendArea(val) {
      this.area = val;
      this.init();
    },

    // 传递分页页码
    sendPage(val) {
      this.liveData._start = val;
      this.init();
    }
  },

  watch: {
    // 路由更新数据重新获取渲染
    $route() {
      this.init();
    }
  },

  mounted() {
    // 页面首次加载渲染
    this.init();
    // this.axios({
    //     url:'hotels',
    //     method:'get',
    // })
  }
};
</script>

<style lang="less" scoped>
.hotel {
  width: 1000px;
  margin: 0 auto;
}
</style>


