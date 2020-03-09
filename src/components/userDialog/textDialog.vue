<template>
    <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :before-close="closeDialog"
        class="user-address-dialog"
        width="40%"
        :visible.sync="isShowGrowthReason"
    >
        <slot class="text-dialog-wrapper" name="text-wrapper"></slot>
    </el-dialog>
</template>

<script>
export default {
    name: '',
    components: {},
    data() {
        return {
        }
    },
    props: {
        isShowGrowthReason: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '标题'
        }
    },
    watch: {},
    computed: {},
    methods: {
        closeDialog() {
            this.$emit('closeTextDialog', false); // 直接修改父组件的属性
        }
    },
    created() { },
    mounted() { }
}
</script>
<style lang="less" scoped>
.text-dialog-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
}
</style>