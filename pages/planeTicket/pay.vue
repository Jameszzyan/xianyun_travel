<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ 1000</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";

export default {
  data() {
    return {
      timer: null
    };
  },
  methods: {
    async init() {
      let original = this;
      let { id } = this.$route.query;
      let { token } = this.$store.state.user.userInfo;
      let result = await this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let { payInfo, price } = result.data;
      let canvas = document.getElementById("qrcode-stage");
      QRCode.toCanvas(canvas, payInfo.code_url, function(error) {
        if (error) console.error(error);
      });
      this.timer = setInterval(() => {
        this.$axios({
          url: "/airorders/checkpay",
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            id: original.$route.query.id,
            nonce_str: payInfo.nonce_str,
            out_trade_no: payInfo.order_no
          }
        }).then(result=>{
            if(result.data.statusTxt === '支付完成'){
                clearInterval(original.timer)
                original.$message.success('支付完成')
                original.$router.push({
                    path:'/'
                })
            }
        })
      }, 3000);
    }
  },

  mounted() {
    setTimeout(() => {
      this.init();
    }, 200);
  },

  destoryed() {
      clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>


