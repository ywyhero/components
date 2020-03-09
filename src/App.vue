<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
// import common from './components/common'
export default {
    name: 'app',
    components: {
        // common
    },
    provide() {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
        }
    },
    methods: {
        reload() {

        }
    },
    created() {
    }
}
</script>

<style>
@import url("./assets/css/common.css");
</style>
