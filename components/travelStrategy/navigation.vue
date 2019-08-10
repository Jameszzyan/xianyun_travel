// 这是旅游攻略左侧导航组件
<template>
  <div class="contianer">
    <div class="menus-wrapper">
      <!-- 旅游攻略左侧 导航 -->
      <div class="menus">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="vertical"
          @select="handleSelect"
          :collapse="true"
        >
          <el-submenu :index="''+index" v-for="(item,index) in cityList" :key="index">
            <template slot="title">{{item.type}}</template>
            <el-menu-item index="item2.index" v-for="(item2,index2) in item.children" :key="index2" @click.native="getCityName(item2)">              
              <span class="post-city">
                <span>{{index2+1}}</span>
                {{item2.city}}
              </span>
              <span>{{item2.desc}}</span>
            </el-menu-item>           
          </el-submenu>

        </el-menu>
        <div class="line"></div>
      </div>

      <!-- 旅游攻略左侧 推荐城市 -->
      <div class="aside-recommend">
        <h4 class="aside-title">推荐城市</h4>
        <nuxt-link to="/post" class="aside-recommend-item">
          <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" />
        </nuxt-link>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  data() {
    return {
    
      // 左侧导航栏
      activeIndex: '1',
      activeIndex2: '1',
    };
  },
  methods: {
    // 点击导航中的城市
    getCityName(item){
      console.log(item)
      this.$emit("setCityName",item.city) 
      this.$router.push({
        path:'/travelStrategy',
        query:{
          name:item.city
        }
      })
    },
    // 左侧导航栏
    handleSelect(key, keyPath) {
    console.log(key, keyPath);
    }
  },
  props:{
    cityList:{
      type:Array,
      default:[]
    }
  }
};
</script>

<style lang="less" scoped>
// 左侧导航样式
.contianer {
  width:1000px;
  margin: 20px auto;
}
.el-menu-demo{
  border:1px #ccc solid;
  width: 200px;
}
.el-menu[data-v-ff99aa00] {
    border-right: 1px #ccc solid;
}
.el-menu{
  border-right:0;
}
.el-menu--collapse .el-submenu{
      width: 200px;
}
// 左侧(下)推荐城市样式
.aside-recommend {
  width: 200px;
  h4 {
    padding: 10px;
    border-bottom: 1px #ccc solid;
  }
}
.el-menu--collapse .el-submenu{
  border-right: 1px #ccc solid;
}
.aside-recommend-item{
  width: 250px;
  left: 270px;
  margin-top: 20px;
  img {
  width: 100%;
  margin-top: 10px;
  }
}
.post-city{
  font-size: 18px;
  color:orangered;
  padding-right:10px;
  font-style: italic;
  font-weight: bold;
}
</style>
