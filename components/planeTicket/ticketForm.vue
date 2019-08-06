<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item,index) in tabs"
        :key="index"
        :class="{active:index === currentTab}"
        @click="handleClick(index)"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>
    <!-- 机票搜索表单 -->
    <el-form
      v-if="currentTab === 0"
      class="search-form-content"
      :model="ticketForm"
      ref="ticketForm"
      label-width="80px"
    >
      <el-form-item label="出发城市">
        <el-autocomplete
          v-model="ticketForm.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="ticketForm.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          class="el-autocomplete"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="出发时间">
        <el-date-picker v-model="ticketForm.departDate" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-button type="primary" class="search-button" @click.native="handleSearch">
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </el-button>

      <!-- 出发和到达城市互换按钮 -->
      <span class="reverse" @click="exchangeCity">换</span>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      ticketForm: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      },
    };
  },
  methods: {
    handleClick(index) {
      if (index === 1) {
        this.$confirm("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      } else {
        this.currentTab = index;
      }
    },

    querySearchAsync(queryString) {
      return new Promise((resolve, reject) => {
        if (queryString) {
          this.$axios({
            url: "/airs/city",
            method: "get",
            params: {
              name: queryString
            }
          })
            .then(result => {
              let { data } = result.data;
              data.forEach(item => {
                item.value = item.name.substring(0, item.name.length - 1);
              });
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        } else {
          resolve([]);
        }
      });
    },

    async queryDepartSearch(queryString,cb){
      let data = await this.querySearchAsync(queryString)
      if(data.length > 0){
        this.ticketForm.departCode = data[0].sort
      }
      cb(data)
    },
    async queryDestSearch(queryString,cb){
      let data = await this.querySearchAsync(queryString)
      if(data.length > 0){
        this.ticketForm.destCode = data[0].sort
      }
      cb(data)
    },

    handleDepartSelect(selected) {
     this.ticketForm.departCity = selected.value
     this.ticketForm.departCode = selected.sort
    },
    handleDestSelect(selected){
      this.ticketForm.destCity = selected.value
      this.ticketForm.destCode = selected.sort
    },

    exchangeCity(){
      let{departCity,departCode,destCity,destCode} = this.ticketForm
      this.ticketForm.departCity = destCity
      this.ticketForm.departCode = destCode
      this.ticketForm.destCity = departCity
      this.ticketForm.destCode = departCode
    },

    handleSearch(){
      let {departCity,destCity,departDate} = this.ticketForm
      if(!departCity){
        this.$alert('出发城市不能为空', '提示', {
          confirmButtonText: '确定',
          type:'warning',
        });
      }
      else if(!destCity){
        this.$alert('到达城市不能为空', '提示', {
          confirmButtonText: '确定',
          type:'warning',
        });
      }
      else if(!departDate){
         this.$alert('出发日期不能为空', '提示', {
          confirmButtonText: '确定',
          type:'warning',
        });
      }
      else{
         this.ticketForm.departDate = moment(this.ticketForm.departDate).format("YYYY-MM-DD")
         this.$store.dispatch('history/commitStoreHistory',this.ticketForm)
         this.$axios({
           url:'/airs',
           method:'get',
           params:this.ticketForm
         }).then(result=>{
           if(result.status === 200){
             this.$router.push({
               path:'/planeTicket/flights',
               query:this.ticketForm
             })
           }
         }).catch(err=>{
           console.log(err)
         })
      }
     
    }

  }
};
</script>

<style lang="less" scoped>
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
  .search-button {
    width: 230px;
    margin-left: 70px;
  }
  .reverse {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #999;
    color: #fff;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    top: 58px;
    right: 14px;
    cursor: pointer;
    &:before {
      content: "";
      height: 20px;
      width: 26px;
      border-right: 2px solid #999;
      border-top: 2px solid #999;
      position: absolute;
      left: -16px;
      top: -22px;
    }
    &:after {
      content: "";
      height: 20px;
      width: 26px;
      border-right: 2px solid #999;
      border-bottom: 2px solid #999;
      position: absolute;
      left: -16px;
      top: 20px;
    }
  }
}
</style>

