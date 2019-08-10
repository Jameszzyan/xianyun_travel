<template>
  <div class="hotelScope">
    <!-- 区域部分 -->
    <div class="area">
      <el-row :gutter="20">
        <el-col :span="4">区域：</el-col>
        <el-col :span="20">
          <!-- 区域数据展示(折叠) -->
          <div class="areaContent">
            <span class="areaName" :class="{active:currentArea === -1}" @click="changeArea(-1)">全部</span>
            <span
              class="areaName"
              v-for="(item,index) in area"
              :key="index"
              :class="{active:currentArea === index}"
              @click="changeArea(index)"
            >{{item}}</span>
          </div>
          <!-- 区域数据是否折叠 -->
          <div style="color:purple;margin-top:5px" v-if="isShow">
            <!-- 折叠显示内容 -->
            <i class="el-font el-icon-caret-bottom" v-show="isFold" @click="isFold = !isFold"></i>
            <span v-show="isFold">等{{area.length}}个区域</span>
            <!-- 未折叠显示内容 -->
            <i class="el-font el-icon-caret-top" v-show="!isFold" @click="isFold = !isFold"></i>
            <span v-show="!isFold">折叠</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 攻略部分 -->
    <div class="strategy">
      <el-row :gutter="20">
        <el-col :span="4">攻略：</el-col>
        <el-col
          :span="20"
          class="sketch"
        >这是一个你从没见过的城市，这里有热情似火的温泉，还有冷酷无情的天然滑雪场，让你体验冷热交替的极致享受！还想什么，赶紧拿起手机，叫上亲朋好友订购吧！</el-col>
      </el-row>
    </div>

    <!-- 均价部分 -->
    <div class="averagePrice">
      <el-row :gutter="20">
        <el-col :span="4">均价：</el-col>
        <el-col :span="20">
          <span v-for="(first,index) in avgPrice" :key="index" class="degree">
            <i class="iconfont iconhuangguan" v-for="second in first.amount" :key="second"></i>
            <span>￥{{first.value}}</span>
          </span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  // 使用props接收渲染数据
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {
      // 区域合集
      area: [],
      // 当前区域高亮（默认选择全部）
      currentArea: -1,
      // 是否折叠参数
      isFold: true,
      //  当折叠内容过少时取消折叠
      isShow: true,
      //  模拟均价部分
      avgPrice: [
        { amount: 3, value: 250 },
        { amount: 4, value: 666 },
        { amount: 5, value: 888 }
      ]
    };
  },

  // 要想操作props传过来的数据，使用watch进行深度监听
  watch: {
    data: {
      handler(newVal, oldVal) {
        // this.area.length = 0;
        // newVal.data.forEach(item => {
        //   this.area.push(item.area);
        // });
        // this.area = [...new Set(this.area)];
        // if (this.area.length <= 8) {
        //   this.isShow = false;
        // } else {
        //   this.isShow = true;
        // }
      },
      deep: true,
      immediate: true
    },

    // 路由更新重新渲染区域部分
    $route() {
      this.findCityData();
    },

    // 根据折叠情况展示不同的高度
    isFold(value) {
      let fold = document.querySelector(".areaContent");
      if (value) {
        fold.style.height = "50px";
      } else {
        fold.style.height = "100%";
      }
    }
  },

  methods: {
    // 渲染区域部分
    findCityData() {
      this.$axios({
        url: "/cities",
        method: "get",
        params: {
          name: this.$route.query.name
        }
      })
        .then(result => {
          let arr = result.data.data[0].scenics;
          // 先清空区域数组
          this.area = [];
          arr.forEach(item => {
            this.area.push(item.name);
          });
          // 每次更新都默认选择全部
          this.currentArea = -1
          // 获取该区域dom元素引用
          let fold = document.querySelector(".areaContent");
          // 判断如果没有数据，缩小展示区域高度
          if (this.area.length === 0) {
            fold.style.height = "30px";
            this.isShow = false;
          } else {
            this.isShow = true;
            fold.style.height = "50px";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 根据选中区域发送给父组件进行数据更新
    changeArea(index) {
      this.currentArea = index;
      this.$nextTick(() => {
        let selected = document.querySelector(".area .areaContent .active");
        this.$emit('sendArea',selected.innerText)
      });
    }
  },

  mounted() {
    this.findCityData();
  },

  updated() {
    
  }
};
</script>

<style lang="less" scoped>
.hotelScope {
  font-size: 14px;
  margin-top: 30px;
  .area {
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    .areaContent {
      height: 50px;
      overflow: hidden;
      .areaName {
        margin-right: 20px;
        margin-bottom: 5px;
        display: inline-block;
        padding: 0 5px;
        &:hover {
          cursor: pointer;
        }
      }
      .active {
        background: skyblue;
        color: white;
      }
    }
    .el-font {
      cursor: pointer;
    }
  }

  .strategy {
    margin-top: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
  }

  .averagePrice {
    margin-top: 20px;
    margin-bottom: 50px;
    .degree {
      margin-right: 20px;
      .iconfont {
        // background-color: orange;
        color:orange;
        margin-right: 2px;
      }
    }
  }
}
</style>

