<template>
    <div class="search">
        <span class="search-value">{{searchVal}}</span>
        <div class="search-options">
            <el-input class="select-input" :maxlength="maxlength" @change="change" v-model="searchValue" :placeholder="placeholderVal" clearable></el-input>
        </div>
    </div>
</template>
<style lang="less" scoped>
.search-value{
    font-size: 14px;
    font-weight: 700;
    line-height: 25px;
    color: #606266;
}
.select-input{
    width: 200px;
}
</style>

<script>
export default {
    props: {
        searchVal: {
            type: String,
            default: ''
        },
        placeholderVal: {
            type: String,
            default: '请输入内容'
        },
        value: {
            // eslint-disable-next-line
            type: String | Number,
            default: ''
        },
        maxlength: {
            type: Number,
            default: 20
        }
    },
    data() {
        return {
            searchValue: ''
        }
    },
    watch: {
        value(newVal) {
            this.searchValue = newVal
        }
    },
    methods: {
        change(val) {
            this.$emit('change', {value: val})
        }
    }
}
</script>