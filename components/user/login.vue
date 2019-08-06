<template>
  <div class="login">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" status-icon class="form">
          <el-form-item prop="username" class="form-item">
              <el-input v-model="loginForm.username" placeholder="用户名/手机"></el-input>
          </el-form-item>
           <el-form-item prop="password" class="form-item">
              <el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" class="submit" @click="handleClick">登录</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules:{
          username:[
              {required:true,message:"用户名不能为空",trigger:"blur"}
          ],
           password:[
              {required:true,message:"密码不能为空",trigger:"blur"}
          ]
      }
    };
  },
  methods:{
      handleClick(){
          this.$refs.loginForm.validate((valid)=>{
              if(valid){
                  this.$axios({
                      url:'/accounts/login',
                      method:'post',
                      data:this.loginForm
                  }).then(result=>{
                      console.log(result)
                   if(result.status === 200){
                         this.$store.dispatch('user/commitStoreUserInfo',result.data)
                         this.$message({
                             type:'success',
                             message:'登录成功'
                         })
                         this.$router.push({
                             path:'/'
                         })
                   }
                  }).catch(err=>{
                      console.log(err)
                  })
              }
              else{
                  this.$message({
                      type:'error',
                      message:'请检查你的登录信息是否正确'
                  })
              }
          })
      }
  }
};
</script>

<style lang="less" scoped>
.form{
    padding:20px 20px 0 20px;
    .submit{
        width:100%;
    }
}
</style>


