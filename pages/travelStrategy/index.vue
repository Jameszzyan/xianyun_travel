// 这是旅游攻略首页
<template>
  <div class="contianer">
    <!-- <el-row type="flex" justify="space-between"> -->
    <el-row>
      <!-- 左边  导航和推荐城市部分 -->
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <Navigation :cityList="cityList" @setCityName="newCityName" />
        </div>
      </el-col>

      <!-- 右边 部分 -->
      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <TravelRecommend
            :recommendList="recommendList"
            :total="total"
            :cityname="cityName"
            @getRecommendList="getRecommendList"
            @setPage="newPage"
            @searchCity="getRecommendList"
          />
        </div>
      </el-col>
    </el-row>
    <!-- </el-row> -->
      

  </div>
</template>

<script>
import Navigation from "@/components/travelStrategy/navigation.vue";
import TravelRecommend from "@/components/travelStrategy/travelRecommend.vue";
export default {
  components: {
    Navigation,
    TravelRecommend
  },
  data() {
    return {
      cityName: "",
      cityList: [],
      recommendList: [],
      start: 0,
      limit: 3,
      total: 10
    };
  },

  methods: {
    // 获取城市名称(从子组件的导航处点击获取)
    newCityName(data) {
      // console.log(data,newCityName)
      this.cityName = data;
      this.getRecommendList();
    },
    // 获取页数后更新
    newPage(data) {
      // console.log(data,newPage);      
      this.start = data.currentPage,
      this.limit = data.pagesize,
        // console.log(data)
        this.getRecommendList();
    },
    // 获取城市菜单列表数据
    getCityList() {
      this.$axios({
        url: "/posts/cities"
      }).then(res => {
        // console.log(res,12345);
        this.cityList = res.data.data;
      });
    },
    // 获取右部推荐文章数据
    getRecommendList(v) {
      if (v) {
        var obj = {
          _start: this.start-1,
          _limit: this.limit,
          city: v
        };
        this.$axios({
          url: "/posts",
          params: obj
        }).then(res => {
          // console.log(res)
          // console.log(this.recommendList,1243)
          this.recommendList = res.data.data;
          this.total = res.data.total;
        });
      }
      if (this.cityName) {
        var obj = {
          _start: this.start,
          _limit: this.limit,
          city: this.cityName
        };
      } else {
        var obj = {
          _start: this.start,
          _limit: this.limit
        };
      }
      // console.log(this.start);
      // console.log(this.limit);
      this.$axios({
        url: "/posts",
        params: obj
      }).then(res => {
        // console.log(res)
        // console.log(this.recommendList,1243)
        this.recommendList = res.data.data;
        this.total = res.data.total;
      });
    }
  },


  mounted() {
    // this.newCityName();
    this.getCityList();
    // 获取路由拼接参数的值
    let city = this.$route.query.name
    this.$axios({
      url: "/posts",
      params: {
        _start: 0,
        _limit: 3,
        city
      }
    }).then(res => {
      console.log(res, 111);
      this.recommendList = res.data.data;
      this.total = res.data.total;
    });
  }
};
</script>

<style lang="less" scoped>
.contianer {
  width: 1000px;
  margin: 10px auto;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>


