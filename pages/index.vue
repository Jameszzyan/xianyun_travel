<template>
  <div class="container">
    <!-- 轮播图 -->
    <el-carousel trigger="click" height="700px">
      <el-carousel-item v-for="(item,index) in carouselList" :key="index">
        <div
          :style="`background:url(${$axios.defaults.baseURL}${item.url}) no-repeat center center;background-size:contain contain;height:700px`"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <!-- 首页搜索框 -->
    <div class="banner-content">
      <div class="search-bar">
        <!-- tab栏 -->
        <el-row type="flex" class="search-tab">
          <span
            v-for="(item,index) in searchList"
            :key="index"
            :class="{active:current === index}"
            @click="handleChange(index)"
          >
            <i>{{item.name}}</i>
          </span>
        </el-row>

        <!-- 输入框 -->
        <el-row type="flex" align="middle" class="search-input">
          <el-autocomplete
            v-model="inputContent"
            :fetch-suggestions="querySearchAsync"
            :placeholder="searchList[current].placeholder"
            @select="handleSelect"
            @keyup.enter.native="clickSearch"
          ></el-autocomplete>
          <i class="el-icon-search" @click="clickSearch"></i>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:1337'
export default {
  // 初始化之前异步请求数据
  // async asyncData(context){
  //   let result = await axios({
  //     url:'/scenics/banners',
  //     method:'get'
  //   })
  //   let {data} = result.data
  //   console.log(context)
  //   return {
  //     carouselList:data
  //   }
  // },
  data() {
    return {
      carouselList: [],
      searchList: [
        {
          name: "攻略",
          placeholder: "搜索城市"
        },
        {
          name: "酒店",
          placeholder: "请输入城市搜索酒店"
        },
        {
          name: "机票",
          placeholder: ""
        }
      ],
      current: 0,
      // 输入框内容
      inputContent: ""
    };
  },
  methods: {
    // tab栏切换
    handleChange(index) {
      if (index < 2) {
        this.current = index;
      } else {
        this.$router.push({
          path: "/planeTicket"
        });
      }
    },

    // 当用户输入内容后进行搜索
    clickSearch() {
      // 内容不为空时进行查找
      if (this.inputContent) {
        this.jumpTo()
      }
      // 提示输入搜索内容
      else {
        this.$alert("请输入搜索内容", "提示", {
          confirmButtonText: "确定",
          type: "warning"
        });
      }
    },

    // 根据输入值查找城市
    querySearchAsync(queryString, cb) {
      if (queryString) {
        this.$axios({
          url: "cities",
          method: "get",
          params: {
            name: queryString
          }
        })
          .then(result => {
            let arr = result.data.data;
            arr.forEach(item => {
              for (var key in item) {
                if (key === "name") {
                  item.value = item.name.substring(0, item.name.length - 1);
                }
              }
            });
            cb(arr);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    // 当选定内容后进行跳转
    handleSelect() {
      this.jumpTo();
    },


    // 城市和攻略部分跳转
    jumpTo(){
        var index = this.current;
        var name = this.searchList[index].name;
        // 攻略及酒店跳转
        if (name === "酒店") {
          this.$axios({
            url: "/cities",
            method: "get",
            params: {
              name: this.inputContent
            }
          })
            .then(async result => {
              this.$router.push({
                path: "/hotel",
                query: {
                  city: result.data.data[0].id,
                  name: this.inputContent
                }
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
        else if(name === "攻略"){
          this.$router.push({
            path:'/travelStrategy',
            query:{
              name:this.inputContent
            }
          })
        }
    },

  },

  mounted() {
    // 请求轮播图所需图片的地址
    this.$axios({
      url: "/scenics/banners",
      method: "get"
    })
      .then(result => {
        let { data } = result.data;
        this.carouselList = data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="less" scoped>
.container {
  .banner-content {
    z-index: 9;
    width: 1000px;
    position: absolute;
    left: 50%;
    top: 45%;
    margin-left: -500px;
    border-top: 1px transparent solid;

    .search-bar {
      width: 552px;
      margin: 0 auto;
    }

    .search-tab {
      .active {
        i {
          color: #333;
        }
        &::after {
          background: #eee;
        }
      }

      span {
        width: 82px;
        height: 36px;
        display: block;
        position: relative;
        margin-right: 8px;
        cursor: pointer;

        i {
          position: absolute;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }

        &:after {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          content: "";
          width: 100%;
          height: 100%;
          border: 1px rgba(255, 255, 255, 0.2) solid;
          border-bottom: none;
          transform: scale(1.1, 1.3) perspective(0.7em) rotateX(2.2deg);
          transform-origin: bottom left;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 1px 2px 0 0;
          box-sizing: border-box;
        }
      }
    }

    .search-input {
      width: 550px;
      height: 46px;
      background: #fff;
      border-radius: 0 4px 4px 4px;
      border: 1px rgba(255, 255, 255, 0.2) solid;
      border-top: none;
      box-sizing: unset;

      /deep/ .el-input .el-input__inner {
        flex: 1;
        height: 20px;
        padding: 13px 15px;
        outline: none;
        border: 0;
        font-size: 16px;
        width:510px;
        height:46px;
      }

      .el-icon-search {
        cursor: pointer;
        font-size: 22px;
        padding: 0 10px;
        font-weight: bold;
      }
    }
  }
}
</style>
