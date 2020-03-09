<template>
    <div class="dialog" v-show="isShow">
        <div class="dialog-main">
            <span class="dialog-tip">与以下老师及时间段冲突</span>
            <div class="dialog-times">
                <div class="dialog-time" v-for="(time, index) in errorTimes" :key="index">
                    <span>{{time.teacherName}} {{time.time}}</span>
                </div>
            </div>
            <div class="dialog-btns">
                <span class="dialog-btn" @click="sureEvent">确定</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        errorTimes: {
            type: Array,
            default: () => []
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        sureEvent() {
            this.$emit('sure')
        }
    }
}
</script>
<style lang="less" scoped>
.dialog{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 9999;
}   
.dialog-main{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
} 
.dialog-tip{
    font-size: 12px;
    margin-bottom: 20px;
}
.dialog-time{
    font-size: 14px;
    margin-bottom: 10px;
}
.dialog-btns{
    display: flex;
    justify-content: flex-end;
}
.dialog-btn{
    padding: 5px 10px;
    background: #409eff;
    color: #fff;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}
</style>
