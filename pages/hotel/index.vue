<template>
  <div>
    <!-- 酒店列表组件 -->
    <HotelList :webData="webData" />
  </div>
</template>

<script>
import HotelList from "@/components/hotel/hotelList";
export default {
  components: {
    HotelList
  },
  data() {
    return {
      webData: {}
    };
  },

  methods: {
    async init() {
      let { city } = this.$route.query;
      let result = await this.$axios({
        url: `hotels?&city=199`,
        method: "get"
      });
      this.webData = result.data;
      console.log(this.webData);
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
</style>


