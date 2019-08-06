<template>
  <div class="register">
    <el-form :model="registerForm" :rules="rules" ref="registerForm" status-icon class="form">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="用户名/手机"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-row>
          <el-input v-model="registerForm.captcha" placeholder="验证码">
            <el-button slot="append" @click.native="handleCaptcha">发送验证码</el-button>
          </el-input>
        </el-row>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="registerForm.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input v-model="registerForm.checkPassword" placeholder="确认密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit" @click.native="handleRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPassword !== "") {
          this.$refs.registerForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        checkPassword: "",
        nickname: "",
        captcha: ""
      },
      rules: {
        username: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
        password: [
             { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
             { validator: validatePass2, trigger: 'blur' }
        ],
        nickname: [{ required: true, message: "昵称不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleCaptcha() {
      if (this.registerForm.username === "") {
        this.$alert("手机不能为空", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: action => {
            this.$message({
              type: "info",
              message: `action: ${action}`
            });
          }
        });
      } else {
        this.$axios({
          url: "captchas",
          method: "post",
          data: {
            tel: this.registerForm.username
          }
        }).then(result => {
          console.log(result);
        });
      }
    },
    handleRegister() {
        this.$refs.registerForm.validate(valid=>{
            if(valid){
                var {checkPassword,...data} = this.registerForm
                this.$axios({
                    url:'accounts/register',
                    method:'post',
                    data
                }).then(result=>{
                    console.log(result)
                    this.$message({
                        type:'success',
                        message:'新用户注册成功'
                    })
                })
            }
            else{
                this.$message({
                      type:'error',
                      message:'请检查你的注册信息是否正确'
                  })
            }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  padding: 20px 20px 0 20px;
  .submit {
    width: 100%;
  }
}
</style>


