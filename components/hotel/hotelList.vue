<template>
  <div class="container">
    <!-- 酒店筛选部分 -->
    <el-row class="hotelNav" type="flex" justify="space-between" align="middle">
      <!-- 左边价格部分 -->
      <el-col :span="5" type="flex" justify="space-between" align="middle" class="hotelNavLeft">
        <el-col :span="12">价格</el-col>
        <el-col :span="12">0-4000</el-col>
      </el-col>
      <!-- 右边筛选部分 -->
      <el-col :span="19" class="hotelNavRight">
        <el-row>
          <el-col :span="5" class="hotelLevel">
            <span style="display:block">住宿等级</span>
            <el-select v-model="level" placeholder="不限" multiple @change="handle" collapse-tags>
              <el-option
                v-for="item in options.levels"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6.33" class="hotelother" style="margin-right:15px">
            <span style="display:block">住宿类型</span>
            <el-select v-model="types" placeholder="不限" multiple collapse-tags>
              <el-option
                v-for="item in options.types"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6.33" class="hotelother" style="margin-right:15px">
            <span style="display:block">酒店设施</span>
            <el-select v-model="assets" placeholder="不限" multiple collapse-tags>
              <el-option
                v-for="item in options.assets"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6.33" class="hotelother">
            <span style="display:block">酒店品牌</span>
            <el-select v-model="brands" placeholder="不限" multiple collapse-tags>
              <el-option
                style="height:40px;"
                v-for="item in options.brands"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 酒店介绍部分 -->
    <el-row
      class="hotelInfo"
      type="flex"
      justify="space-between"
      v-for="(item,index) in selected"
      :key="index"
    >
      <el-row class="hotelInfoLeft">
        <img :src="`${item.photos}`" alt />
      </el-row>
      <el-row class="hotelInfoRight" type="flex" justify="space-between">
        <el-row class="hotelDetail">
          <h2>
            <nuxt-link :to="`/hotel/hotelDetail?id=${item.id}`">{{item.name}}</nuxt-link>
          </h2>
          <div>
            <span>{{item.alias}}</span>
            <i class="iconfont iconhuangguan"></i>
            <i class="iconfont iconhuangguan"></i>
            <i class="iconfont iconhuangguan"></i>
            <span>{{item.hoteltype.name}}</span>
          </div>
          <div style="padding:5px 0px">
            <i
              class="el-rate__icon el-icon-star-on"
              style="color: rgb(247, 186, 42);"
              v-for="(item3,index3) in Math.floor(item.stars)"
              :key="index3"
            ></i>

            <span class="number">{{item.all_remarks}}</span> &nbsp;条评价&nbsp;&nbsp;
            <span class="number">{{item.good_remarks}}</span> &nbsp;篇游记
          </div>
          <div>
            <p style="padding:10px 0px">
              <i class="iconfont iconlocation"></i>
              {{item.address}}
            </p>
            <p>
              <i class="el-icon-phone"></i>
              联系电话：{{item.phone}}
            </p>
            <p style="margin-top:10px;">
              <el-tag type="warning" v-for="(item2,index2) in item.hotelassets" :key="index2">
                <span style="font-size:14px;margin:5px;">{{item2.name}}</span>
              </el-tag>
            </p>
          </div>
        </el-row>
        <el-row class="travelInfo">
          <ul>
            <li v-for="(item1,index1) in item.products" :key="index1">
              <p>{{item1.name}}</p>
              <p>
                <span>￥{{item1.price}}</span>起&nbsp;&gt;
              </p>
            </li>
          </ul>
        </el-row>
      </el-row>
    </el-row>
    <div v-if="selected.length===0" class="noneList">sorry!暂无任何数据</div>
    <!-- 分页 -->
    <el-pagination @current-change="handlePageNum" layout="prev, pager, next" :total="200"></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // 酒店列表数据
    webData: {
      type: Object,
      default: {
        data: [],
        nextStart: 0,
        total: 0
      }
    }
  },
  data() {
    return {
      options: {}, //选项的对象，有四个属性，每个属性为数组
      level: [], //绑定星级筛选数组
      assets: [], //绑定设施筛选数组
      brands: [], //绑定品牌筛选数组
      types: [], //绑定类型筛选数组
      total: [], //列表总条数
      hotelList: [] // 缓存的酒店列表数组
    };
  },
  computed: {
    // 筛选属性：筛选缓存的酒店列表的数组
    selected() {
      // 统一处理返回的数组
      var dealArr = this.hotelList;

      // 处理施设筛选，当选中任意一个或多个选项执行
      if (this.assets.length > 0 && dealArr.length > 0) {
        // 创建空数组存放筛选后的数据
        var arr1 = [];
        // 遍历总数据获取每一间酒店的信息，里面有施设(数组)，品牌(数字)，星级(对象)，类型(对象)属性
        dealArr.forEach((item, index) => {
          // 创建新数组用来接收当前遍历的酒店设施有哪些
          var arr = [];
          // 定义开关判断多个选项时，当前遍历的酒店是否同时符合多个选项，num为0时则判断为符合
          var num = 1;
          // 遍历当前遍历的酒店下的设施数组
          item.hotelassets.forEach((item1, index1) => {
            // 把每个设施功能放进数组
            arr.push(item1.name);
          });
          // 遍历选项的数组
          this.assets.forEach((item2, index2) => {
            // 用存放设施功能数组检索选项数组的每一项,检索不到说明当前酒店不符合筛选，num为0
            if (arr.indexOf(item2) === -1) {
              num = 0;
            }
          });
          // 只有选项同时符合当前遍历酒店设施功能时才会放进返回的数组
          if (num) {
            arr1.push(item);
          }
        });
        dealArr = arr1;
      }

      // 处理品牌筛选，当选中任意一个或多个选项执行
      if (this.brands.length > 0 && dealArr.length > 0) {
        var arr1 = [];
        dealArr.forEach((item, index) => {
          // 避免品牌为null时报错
          if (item.hotelbrand) {
            this.brands.forEach((item1, index1) => {
              if (item.hotelbrand.name.indexOf(item1) > -1) {
                arr1.push(item);
              }
            });
          }
        });
        dealArr = arr1;
      }

      // 处理星级筛选，当选中任意一个或多个选项执行
      if (this.level.length > 0 && dealArr.length > 0) {
        var arr1 = [];
        dealArr.forEach((item, index) => {
          this.level.forEach((item1, index1) => {
            if (Math.floor(item.stars) === item1) {
              arr1.push(item);
            }
          });
        });
        dealArr = arr1;
      }

      // 处理类型筛选，当选中任意一个或多个选项执行
      if (this.types.length > 0 && dealArr.length > 0) {
        var arr1 = [];
        dealArr.forEach((item, index) => {
          this.types.forEach((item1, index1) => {
            if (item.hoteltype.name) {
              if (item.hoteltype.name.indexOf(item1) > -1) {
                arr1.push(item);
              }
            }
          });
        });
        dealArr = arr1;
      }
      return dealArr;
    }
  },
  methods: {
    handle(value) {
      console.log(123);
      console.log(value);
    },
    // 获取筛选选项接口
    async getOptions() {
      var res = await this.$axios({
        url: "hotels/options"
      });
      const { data } = res.data;
      this.options = data;
    },

    // 点击分页时调用接口
    async handlePageNum(v) {
      this.$router.push({
        path: "/hotel",
        query: {
          _start: (v - 1) * 5,
          city: 199 //this.$route.query.id
        }
      });
    }
  },
  mounted() {
    // 用定时器获取父组件传值，异步
    setTimeout(() => {
      this.hotelList = JSON.parse(JSON.stringify(this.webData.data));
    }, 1000);
    // 页面加载完获取筛选选项
    this.getOptions();
  }
};
</script>

<style lang='less' scoped>
.container {
  color: #666;
  width: 1000px;
  margin: 10px auto;
  font-size: 14px;
  .hotelNav {
    border: 1px solid #ddd;
    padding: 10px 5px 10px 5px;
    .hotelNavRight {
      //   border: 1px solid red;
      padding: 15px 0;
      .hotelLevel,
      .hotelother {
        padding: 5px 0 5px 7px;
        border-left: 1px solid #ddd;
        span {
          margin-bottom: 5px;
          i {
            padding-left: 50px;
          }
        }
      }
    }
  }
  .hotelInfo {
    padding-bottom: 20px;
    margin: 20px auto;
    border-bottom: 1px solid #ddd;
    .hotelInfoLeft {
      width: 320px;
      height: 210px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hotelInfoRight {
      .hotelDetail {
        h2 {
          font-size: 24px;
          font-weight: 500;
          color: #000;
        }
        i {
          color: #f90;
        }
        span {
          margin: 0 20px 10px 0;
          font-size: 16px;
        }
        .number {
          color: #f90;
          font-size: 18px;
          margin: 0;
        }
      }

      width: 660px;
    }
    .travelInfo {
      padding: 0 50px;
      ul > li {
        width: 150px;
        border-bottom: 1px solid #ddd;
        padding: 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p:nth-child(2) {
          span {
            font-size: 18px;
            color: #f90;
          }
        }
      }
    }
  }
  .noneList {
    font-size: 18px;
    text-align: center;
  }
}
/deep/ .el-input {
  width: 188px;
}
.hotelLevel {
  /deep/ .el-input {
    width: 130px;
  }
}

/deep/ .el-input__inner {
  height: 30px;
}
/deep/ .el-input__icon {
  line-height: 20px;
}
</style>
