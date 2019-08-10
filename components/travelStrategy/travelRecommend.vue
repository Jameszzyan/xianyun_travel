<template>
  <div>
    <!-- 旅游攻略右侧部分 -->
    <!-- 上部搜索框部分 -->
    <div class="search-wrapper">
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入你想去的地方,比如'广州'" v-model="cityName" class="input-with-select" @keydown.enter.native="searchCity">
          <el-button slot="append" icon="el-icon-search" @click="searchCity"></el-button>
        </el-input>
      </div>
      <div class="search-recommend">
        推荐：
        <span v-for="(item4,index4) in commendCity" :key='index4' class="commendCity" @click="searchCitybyRecom(item4)">{{item4}} &ensp;</span>       
      </div>
    </div>

    <!-- 推荐攻略文章部分 -->
    <div class="travelRecommend">
      <!-- 推荐攻略的头部 -->
      <div class="post-title">
        <div class="title">推荐攻略</div>
        <el-button type="primary" icon="el-icon-edit" class="icon-edit" @click="WriteSomething()">写游记</el-button>
      </div>

      <!-- 推荐攻略的正文部分 -->
      <div class="post-body">
        <div v-for="(item,index) in recommendList" :key="index" @click="handleToLink(item.id)">
          <!-- 1 显示三张图片文章的部分 -->
          <div class="post-three" v-if="item.images.length >=3">
            <div class="post-three-content">
              <nuxt-link to>
                <h3>{{item.title}}</h3>
              </nuxt-link>
              <nuxt-link to>
                <p v-html="item.summary"></p>
              </nuxt-link>
            </div>
            <div class="post-three-pic">
              <nuxt-link v-for="(item1,index1) in item.images" :key="index1" to class="post-pic">
                <img :src="item1" />
              </nuxt-link>
            </div>
            <div class="post-three-bottom">
              <span>
                <i class="el-icon-location-outline"></i>
                {{item.city.name}}
              </span>&ensp;
              <span class="postAuthor">by {{item.account.nickname}}</span>&ensp;
              <span>
                <i class="el-icon-view"></i>
                {{item.watch}}
              </span>&ensp;
            </div>
            <span class="post-three-like">{{item.like}}赞</span>
          </div>

          <!-- 2 显示一张图片文章的部分-->
          <div class="post" v-else>
            <el-row type="flex">
              <el-col :span="8">
                <div class="grid-content">
                  <!-- <nuxt-link to class="post-pic">
                    <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" />
                  </nuxt-link>-->
                  <nuxt-link to class="post-pic">
                    <img :src="item.images" />
                  </nuxt-link>
                </div>
              </el-col>
              <!-- 2-1文章内部的右部内容部分 -->
              <el-col :span="16">
                <div class="grid-content">
                  <div class="post-content">
                    <nuxt-link to>
                      <h3>{{item.title}}</h3>
                    </nuxt-link>
                    <nuxt-link to>
                      <p>{{item.summary}}</p>
                    </nuxt-link>
                    <div class="post-bottom">
                      <span>
                        <i class="el-icon-location-outline"></i>
                        {{item.city.name}}
                      </span>&ensp;
                      <span class="postAuthor">by {{item.account.nickname}}</span>&ensp;
                      <span>
                        <i class="el-icon-view"></i>
                        {{item.watch}}
                      </span>&ensp;
                    </div>
                    <span class="post-like">{{item.like}}赞</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 分页部分 -->
        <div class="block">
          <span class="demonstration"></span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageObj.currentPage"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="pageObj.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commendCity:['广州','上海','北京'],
      cityName:"",
      // total:10,
      cityList: [],
      input: "",
      // 分页
      pageObj: {
        pagesize: 3,
        currentPage: 1
      }
    };
  },
  methods: {
    // 根据推荐城市搜索
    searchCitybyRecom(a){
      this.$emit("searchCity",a)
      this.$router.push({
        path:'/travelStrategy',
        query:{
          name:a
        }
      })
    },
    // 搜索城市名
    searchCity(){
      this.$emit("searchCity",this.cityName)  
    },
    // 写游记跳转
    WriteSomething(){
      this.$router.push({
        path: "/travelStrategy/addPost"
      });
    },
    // 跳转文章
    handleToLink(id) {
      this.$router.push({
        path: "/travelStrategy/details?id=" + id
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pageObj.pagesize = val;
      this.$emit("setPage", this.pageObj);
    },
    handleCurrentChange(val) {
      this.pageObj.currentPage = val;
      this.$emit("setPage", this.pageObj);
    }
  },
  // props:["recommendList","total"]
  props: {
    recommendList: {
      type: Array,
      default: []
    },
    total: {
      type: Number,
      default: 3
    },
    cityname:{
      type:String,
      default:""
    }
  }
};
</script>

<style lang="less" scoped>
// 搜索框样式
.el-input-group {
  border: 2px orange solid;
}
.search-recommend {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
// 推荐攻略文章部分样式
// 推荐攻略文章 头部样式
.post-title {
  width: 100%;
  height: 45px;
  margin: 10px 0;
  color: orange;
  border-bottom: 1px #ccc solid;
  .title {
    width: 70px;
    padding: 10px 0;
    border-bottom: 3px orange solid;
    float: left;
  }
  .icon-edit {
    float: right;
  }
}
// 推荐攻略文章列表样式(显示3张图片的文章)
.post-three {
  height: 330px;
  width: 100%;
  padding: 5px 0;
  overflow: hidden;
  box-sizing: border-box;
  border-bottom: 1px #ccc solid;
  position: relative;
  .post-three-content {
    h3 {
      width: 100%;
      height: 24px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    p {
      height: 90px;
      overflow: hidden;
    }
  }
  .post-three-pic {
    width: 100%;
    height: 170px;
    overflow: hidden;
    // position: relative;
    img {
      height: 170px;
      width: 32%;
      margin-right: 10px;
      text-align: center;

      // position:absolute;
      // bottom:10px;
    }
  }
  .post-three-bottom {
    font-size: 14px;
    width: 100%;
    position: absolute;
    bottom: 5px;
    .postAuthor {
      color: orange;
    }
  }
  .post-three-like {
    color: orange;
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
// 推荐攻略文章列表样式(显示1张图片的文章)
.post {
  height: 180px;
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px #ccc solid;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  .grid-content {
    word-wrap: break-word;
    .post-content {
      margin: 10px;
      h3 {
        width: 100%;
        height: 24px;
        overflow: hidden;
        margin-bottom: 10px;
      }
      p {
        height: 90px;
        overflow: hidden;
        margin-bottom: 10px;
      }
    }
    .post-pic {
      width: 100%;
      margin-top: 10px;
      img {
        width: 100%;
      }
    }
  }
  .post-bottom {
    font-size: 14px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    .postAuthor {
      color: orange;
    }
  }
  .post-like {
    color: orange;
    right: 5px;
    position: absolute;
    bottom: 0px;
  }
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.commendCity{
  cursor: pointer;
}
</style>
