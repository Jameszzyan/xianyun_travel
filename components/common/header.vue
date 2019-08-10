<template>
  <div class="container">
    <div class="header">
      <el-row type="flex" :gutter="20">
        <el-col :span="4">
          <nuxt-link to="/">
            <img src="~assets/images/logo.jpg" class="logo" />
          </nuxt-link>
        </el-col>
        <el-col :span="16">
          <el-row class="middle">
            <el-col :span="3">
              <nuxt-link to="/">首页</nuxt-link>
            </el-col>
            <el-col :span="3">
              <nuxt-link to="/travelStrategy">旅游攻略</nuxt-link>
            </el-col>
            <el-col :span="3">
              <nuxt-link to="/hotel?city=199&name=深圳" :class="{active:isActive}">酒店</nuxt-link>
            </el-col>
            <el-col :span="3">
              <nuxt-link to="/planeTicket">国内机票</nuxt-link>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-dropdown v-if="$store.state.user.userInfo.token">
             <div>
               <img :src="$axios.defaults.baseURL+$store.state.user.userInfo.user.defaultAvatar" alt="" class="avatar">
               <span>{{$store.state.user.userInfo.user.nickname}}
                 <i class="el-icon-arrow-down el-icon--right"></i>
               </span>
             </div>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item>
                 <nuxt-link to="/user/personal">个人中心</nuxt-link>
               </el-dropdown-item>
               <el-dropdown-item @click.native="handleClick">
                 退出
               </el-dropdown-item>
             </el-dropdown-menu>
          </el-dropdown>
          <nuxt-link to="/user" v-else>
            <div>登录/注册</div>
          </nuxt-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive:false
    };
  },
  // 消除token值
  methods:{
    handleClick(){
      this.$store.dispatch('user/commitClearUserInfo')
      // 清除loaclStorage里面的值
      // localStorage.removeItem('store')
    }
  },
  
  watch:{
    // 监听路由变化改变高亮
    '$route'(to,from){
      if(to.path.indexOf('/hotel') > -1){
          this.isActive = true
      }
      else{
        this.isActive = false
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
    border-bottom:1px solid grey;
    box-shadow: 0 3px 0 #f5f5f5;
  .header {
    margin: 0 auto;
    width: 1000px;
    height: 60px;
    line-height: 60px;
    .logo {
      display: block;
      width: 156px;
      height: 42px;
      margin-top: 9px;
    }
    .middle {
      text-align: center;
      div {
        box-sizing: border-box;
        height: 60px;
        a {
          display: block;
        }
        &:hover {
          border-bottom: 5px solid rgb(64, 158, 255);
          color: rgb(64, 158, 255);
        }
        &:last-child {
          border-bottom: 0;
        }
      }
      /deep/ .nuxt-link-exact-active {
        background: #409eff;
        color: #fff !important;
      }
      .active{
        background: #409eff;
        color: #fff !important;
      }
    }
    .avatar{
      vertical-align: middle;
      height:32px;
      width:32px;
      border-radius:50%;
    }
  }
}
</style>


