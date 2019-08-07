<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form
        class="member-info"
        v-for="(item,index) in order.users"
        :key="index"
        :model="item"
        :rules="rules"
        :ref="`userForm` + index"
      >
        <!-- 乘机人类型 -->
        <div class="member-info-item">
          <el-form-item label="乘机人类型" prop="username">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!-- 乘机人证件 -->
          <el-form-item label="证件类型" prop="id">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!-- 删除第二位往后的乘机人信息 -->
          <span class="delete-user" @click="handleDeleteUser(index)" v-if="index !== 0">-</span>
        </div>
      </el-form>
      <!-- 添加第二位往后的乘机人信息 -->
      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>
    <!-- 乘机人保险（同时购买） -->
    <div class="air-column">
      <h2>保险</h2>
      <div>
        <el-checkbox-group v-model="order.insurances">
           <div class="insurance-item" v-for="(item,index) in insurances" :key="index">
          <el-checkbox
            :label="item.id"
            border
          >{{item.type}}：￥{{item.price}}/份×{{insurancesAmount}}  最高赔付{{item.compensation}}</el-checkbox>
        </div>
        </el-checkbox-group>
       
      </div>
    </div>
    <!-- 联系人信息 -->
    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="80px" :rules="rules" ref="contactForm" :model="order">
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="order.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input placeholder="请输入内容" v-model="order.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="order.captcha"></el-input>
          </el-form-item>
        </el-form>
        <!-- 提交订单 -->
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    insurances: {
      type: Array,
      defalut: []
    }
  },
  data() {
    return {
      order: {
        users: [{ username: "", id: "" }],
        insurances: [],
        contactName: "",
        contactPhone: "",
        invoice: false,
        seat_xid: "",
        air: "",
        captcha:""
      },
      rules: {
        username: [
          { required: true, message: "乘机人姓名不能为空", trigger: "blur" }
        ],
        id: [
          {
            required: true,
            message: "乘机人身份证号码不能为空",
            trigger: "blur"
          }
        ],
        contactName: [
          { required: true, message: "联系人姓名不能为空", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "联系人电话不能为空", trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    insurancesAmount() {
      return this.order.users.length;
    }
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      if (this.order.users.length <= 2) {
        var obj = {
          username: "",
          id: ""
        };
        this.order.users.push(obj);
        this.$emit('addPassenger',this.order.users.length)
      } else {
        this.$alert("不能选择超过三人的机票", "提示", {
          confirmButtonText: "确定",
          type: "warn"
        });
      }
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.order.users.splice(index, 1);
      this.$emit('addPassenger',this.order.users.length)
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (this.order.contactPhone) {
        this.$axios({
          url: "/captchas",
          method: "post",
          data: {
            tel: this.order.contactPhone
          }
        })
          .then(result => {
            console.log(result);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$alert("联系人电话不能为空", "提示", {
          confirmButtonText: "确定",
          type: "warn"
        });
      }
    },

    // 提交订单
    async handleSubmit() {
      for(var index = 0; index < this.order.users.length; index++){
          try {
          let contactResult = await this.$refs["userForm" + index][0].validate();
        } catch (err) {
          if (!err) {
            this.$alert("请完善乘机人信息", "提示", {
              confirmButtonText: "确定",
              type: "warn"
            })
            return
          }
        }
      }
     

      try {
        let result = await this.$refs.contactForm.validate();
      } catch (err) {
        if (!err) {
          this.$alert("请完善联系人信息", "提示", {
            confirmButtonText: "确定",
            type: "warn"
          })
          return
        }
      }
      let {userInfo} = this.$store.state.user
      this.order.air = this.$route.query.id
      this.order.seat_xid = this.$route.query.seat_xid
      console.log(this.order)
      this.$axios({
          url:'/airorders',
          method:'post',
          data:this.order,
          headers:{
              Authorization: `Bearer ${userInfo.token || 'NO TOKEN'}`
          }
      }).then(result=>{
        console.log(result)
          this.$router.push({
            path:'/planeTicket/pay',
            query:{
              id:result.data.data.id
            }
          })
      }).catch(err=>{
          console.log(err)
      })
    }
  }
};
</script>

<style lang="less" scoped>
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;
  /deep/ .el-form-item__error {
    margin-left: 130px;
  }

  //   &:first-child {
  //     .delete-user {
  //       display: none;
  //     }
  //   }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>


