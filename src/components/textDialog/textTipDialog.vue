<template>
    <el-dialog
        :title="title"
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
        v-if="isShow"
        class="cancel-order-dialog"
        width="40%"
    >
        <div>{{content}}</div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="confirmBtn">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'textTipDialog',
    components: {},
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        }
    },
    watch: {},
    computed: {},
    methods: {
        confirmBtn() {
            this.$emit('confirmBtn');
        }
    },
    created() { },
    mounted() { }
}
</script>
<style lang="less" scoped>
</style>