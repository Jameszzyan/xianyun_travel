<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场">
          <el-option :label="item" :value="item" v-for="item in data.options.airport" :key="item"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间">
          <el-option :label="`${item.from}:00-${item.to}:00`" :value="item.from +'~' + item.to"  v-for="(item,index) in data.options.flightTimes" :key="index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司">
          <el-option :label="item" :value="item" v-for="(item,index) in data.options.company" :key="index"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型">
          <el-option :label="item.size" :value="item.value" v-for="item in airSizeOptions" :key="item.size"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
      data:{
          type:Object,
          default:{},
      }
  },
  data() {
    return {
      airport: "",
      flightTimes: "",
      company: "",
      airSize: "",
      airSizeOptions:[
          {size:'大',value:'L'},
          {size:'中',value:'M'},
          {size:'小',value:'S'}
      ],
    };
  },
  methods: {
    handleFiltersCancel() {
        this.airport = '',
        this.flightTimes = '',
        this.company = '',
        this.airSize = ''
    }
  },
  computed:{
      filterData(){
          const infoList = this.data.flights
          var checkTime = this.flightTimes
          if(checkTime === ''){
              checkTime = '0~24'
          }
          var checkArr = checkTime.split('~')
          let filterList = infoList.filter(item=>{
              var time = item.dep_time
              var arr = time.split(':')
              return item.org_airport_name.indexOf(this.airport) !== -1 && item.airline_name.indexOf(this.company) !== -1 && item.plane_size.indexOf(this.airSize) !== -1 && +arr[0] >= +checkArr[0] && +arr[0] < +checkArr[1]
          })
          return filterList
      }
  },
  watch: {
    $route(to, from) {
      this.handleFiltersCancel();
    }
  },
  updated(){
      this.$emit('getFilterData',this.filterData)
  }
};
</script>

<style lang="less" scoped>
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>


