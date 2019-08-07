<template>
    <div>
        
    </div>
</template>

<script>
export default {
    data(){
        return {
            webData:{}
        }
    },

    methods:{
        async init(){
            let {city} = this.$route.query
            let result = await this.$axios({
                url:`hotels?&city=${city}`,
                method:'get'
            })
            this.webData = result.data
            console.log(this.webData)
        }
    },

    mounted(){
        this.init()
    }
}
</script>

<style lang="less" scoped>

</style>


