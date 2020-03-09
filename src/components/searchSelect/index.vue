<template>
    <div class="search">
        <span class="search-value">{{searchVal}}</span>
        <div class="search-options" v-if="isType==='common'">
            <el-select
                class="search-select"
                :multiple="isMultiple"
                collapse-tags
                v-model="searchValue"
                :placeholder="placeholderVal"
                @change="change"
            >
                <el-option
                    v-for="item in options"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                ></el-option>
            </el-select>
        </div>
        <div class="search-options" v-if="isType==='code'">
            <el-select
                class="search-select"
                :multiple="isMultiple"
                collapse-tags
                v-model="searchValue"
                :placeholder="placeholderVal"
                @change="change"
            >
                <el-option
                    v-for="item in options"
                    :key="item.code"
                    :label="item.code"
                    :value="item.code"
                ></el-option>
            </el-select>
        </div>
        <div class="search-options" v-if="isType==='operateReason'">
            <el-select
                class="search-select"
                :multiple="isMultiple"
                collapse-tags
                v-model="searchValue"
                :placeholder="placeholderVal"
                @change="change"
            >
                <el-option
                    v-for="item in options"
                    :key="item.reasonId"
                    :label="item.reason"
                    :value="item.reasonId"
                ></el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        placeholderVal: {
            type: String,
            default: '请选择'
        },
        value: {
            // eslint-disable-next-line
            type: Array | String,
            default: []
        },
        options: {
            type: Array
        },
        searchVal: {
            type: String,
            default: ''
        },
        isMultiple: {
            type: Boolean,
            default: true
        },
        isType: {
            type: String,
            default: 'common'
        },
        operateReason: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchValue: []
        }
    },
    watch: {
        value(newVal) {
            this.searchValue = newVal
        }
    },
    methods: {
        change(val) {
            this.$emit('change', { value: val })
        }
    }
}
</script>
<style lang="less" scoped>
.search-select {
    width: 200px;
}
.search-value {
    font-size: 14px;
    font-weight: 700;
    line-height: 25px;
    color: #606266;
}
</style>
