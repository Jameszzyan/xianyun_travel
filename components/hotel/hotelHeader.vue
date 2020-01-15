<template>
  <div class="hotelHeader">
    <!-- 酒店预订介绍 -->
    <div class="introduce">
      <span>酒店</span>
      <span>
        <i class="el-font el-icon-arrow-right"></i>
      </span>
      <span>酒店预订</span>
    </div>

    <!-- 搜索城市位置（可切换至当前城市） -->
    <div class="citySearch">
      <span>搜索城市：</span>
      <el-autocomplete
        v-model="citySearch"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入城市名称"
        class="searchInput"
        @select="handleSelect"
        @keyup.enter.native="changeCity(citySearch)"
      ></el-autocomplete>
      <!-- 搜索按钮 -->
      <el-button type="primary" style="height:35px" @click.native="changeCity(citySearch)">搜索</el-button>
      <!-- 当前城市位置 -->
      <span class="changeCity" @click="changeLocalCity">
        <i class="el-font el-icon-position"></i>
        切换至当前城市&nbsp;[ {{myCity}} ]
      </span>
    </div>

    <!-- 入住时间以及入住人数 -->
    <div class="relativeData">
      <!-- 入住时间 -->
      <span>入住时间：</span>
      <el-date-picker
        v-model="stayTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="~"
        start-placeholder="入住日期"
        end-placeholder="离开日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <!-- 入住人数 -->
      <span class="bookerAmount">入住人数：</span>
      <el-input
        placeholder="选择入住人数"
        suffix-icon="el-icon-user-solid"
        v-model="bookerAmount"
        class="inputAmount"
      ></el-input>
      <!-- 查找按钮 -->
      <el-button type="primary" @click.native="dataFilter">查找酒店</el-button>
    </div>
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
      // 测试分支使用
      test: "",
      // 搜索城市
      citySearch: "",
      // 用户定位城市
      myCity: "",
      // 入住时间
      stayTime: "",
      // 入住时间相近时间
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        // 禁止选择当天之前的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      // 入住人数
      bookerAmount: ""
    };
  },

  watch: {
    // 要想操作props传过来的数据，使用watch进行深度监听
    data: {
      handler(newVal, oldVal) {
        this.citySearch = this.$route.query.name;
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 根据搜索城市跳转
    changeCity(city) {
      if (!city) {
        this.$alert("请输入搜索城市", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      } else {
        this.searchCity(city)
      }
    },

    // 跳转城市
    searchCity(city){
       // 根据搜索城市查找该城市id并进行跳转
        this.$axios({
          url: "/cities",
          method: "get",
          params: {
            name: city
          }
        })
          .then(result => {
            this.$router.push({
              path: "/hotel",
              query: {
                city: result.data.data[0].id,
                name: city
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
    },

    // 切换至当前定位的城市
    changeLocalCity() {
      this.citySearch = this.myCity;
      this.changeCity(this.citySearch);
    },

    // 根据用户选择日期及人数发送到父组件进行筛选
    dataFilter() {
      if (!this.stayTime) {
        this.$alert("请输入入住时间", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      } else if (!this.bookerAmount) {
        this.$alert("请输入入住人数", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      } else {
        let enter = new Date(this.stayTime[0]);
        let leave = new Date(this.stayTime[1]);
        let enterTime =
          enter.getFullYear() +
          "-" +
          this.improveDate(enter.getMonth() + 1) +
          "-" +
          this.improveDate(enter.getDate());
        let leftTime =
          leave.getFullYear() +
          "-" +
          this.improveDate(leave.getMonth() + 1) +
          "-" +
          this.improveDate(leave.getDate());
        var obj = {
          enterTime,
          leftTime,
          person: +this.bookerAmount
        };
        this.$emit("sendLiveData", obj);
      }
    },

    // 完善日期函数
    improveDate(val) {
      if (+val < 10) {
        return "0" + val;
      } else {
        return val;
      }
    },

    // 输入值后进行请求数据展示
    querySearchAsync(queryString, cb){
       if(queryString){
          this.$axios({
          url:'cities',
          method:'get',
          params:{
            name:queryString
          }
        }).then(result=>{
          let arr = result.data.data
          arr.forEach(item=>{
            for(var key in item){
              if(key === "name"){
                item.value = item.name.substring(0,item.name.length-1)
              }
            }
          })
          cb(arr)
        }).catch(err=>{
          console.log(err)
        })
       }
    },

    // 选择后进行跳转
    handleSelect(item){
        this.searchCity(item.value)
    }

  },

  mounted() {
    // 设置默认搜索城市
    this.citySearch = this.$route.query.name;
    let original = this;
    var citysearch = null;
    // 需要先进行插件注册
    AMap.plugin("AMap.CitySearch", function() {
      //实例化城市查询类
      citysearch = new AMap.CitySearch();
    });
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function(status, result) {
      if (status === "complete" && result.info === "OK") {
        if (result && result.city && result.bounds) {
          original.myCity = result.city.substring(0, result.city.length - 1);
        }
      } else {
        original.$alert(result.info, "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    });
  },

  updated() {}
};
</script>

<style lang="less" scoped>
.hotelHeader {
  width: 1000px;
  margin: 0 auto;
  .introduce {
    margin: 20px 0 20px 0;
    font-size: 16px;
  }

  .citySearch {
    margin-bottom: 20px;
    .searchInput {
      width: 150px;
      margin-right: 10px;
      /deep/ .el-input__inner {
        text-align: center;
        height: 30px;
        font-weight: 500;
      }
    }
    .changeCity {
      color: orange;
      font-size: 14px;
    }
    .changeCity:hover {
      cursor: pointer;
    }
  }

  .relativeData {
    margin-bottom: 20px;
    .bookerAmount {
      margin-left: 20px;
    }
    /deep/ .el-input--suffix {
      width: 200px;
      margin-right: 20px;
    }
  }
}
</style>


