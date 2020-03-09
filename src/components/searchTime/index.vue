<template>
    <div class="search-time">
        <span class="search-value">{{timeVal}}</span>
        <div class="search-options">
            <el-date-picker
                range-separator="至"
                @change="timeChange"
                v-model="selectedTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        timeVal: {
            type: String,
            default: ''
        },
        selectTime: {
            type: Array
        },
    },
    watch: {
        selectTime(newVal){
            this.selectedTime = newVal
        }
    },
    data() {
        return {
            selectedTime: []
        }
    },
    methods: {
        timeChange(val) {
            this.$emit('changeTime', {
                time: val
            })
        }
    }
}
</script>
<style lang="less" scoped>
.search-value{
    font-size: 14px;
    font-weight: 700;
    line-height: 25px;
    color: #606266;
}
</style>
