<template>
    <div class="home">
        <common></common>
    </div>
</template>

<script>
import common from './../components/common'
export default {
    components: {
       common
    },
    methods: {
       
    },
    mounted() {
        if(this.$route.name == null && this.$route.path !== '/system/index') {
            this.$router.replace('/system/index')
        }
       
    },
}
</script>
<style lang="less" scoped>
.home{
    width: 100%;
    height: 100%;
}
</style>
