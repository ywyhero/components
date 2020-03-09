<template>
    <div class="index">
        <div class="index-show">
            <span class="index-tile">Hello!</span>
            <span class="inde-desc">欢迎使用音乐云课堂管理系统</span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            userInfo: {},
        }
    },
    components: {
    },
    created() {
        this.userInfo = this.$store.state.userInfo;
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
.index{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .index-show{
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .index-tile{
        font-size: 60px;
        font-weight: 700;
        color: #409EFF;
        
    }
    .inde-desc{
        font-size: 56px;
        font-weight: 700;
        margin-top: 20px;
    }
    .inde-desc.active{
        font-size: 30px;
        margin-bottom: 30px;
    }
    .index-tips{
        position: absolute;
        top: 0;
        display: flex;
        width: 100%;
        padding: 5px 10px;
        border: 1px solid rgb(179, 216, 255);
        background: rgb(217, 236, 255);
        justify-content: space-between;
        border-radius: 4px;
    }
    .index-tip{
        display: flex;
        align-items: center;
        color: #606266;
    }
    .index-tip-icon{
        margin-right: 5px;
        color: #409EFF;
    }
    .index-tip-btn{
        cursor: pointer;
        color: #409EFF;
        font-weight: 700;
    }
}
.index-alert{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 510px;
    padding: 30px
}
.index-tag{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.index-set{
    font-size: 40px;
    font-weight: 700;
}
.index-tag-title{
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 40px;
}
.index-tag-main{
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 40px;
}
.index-tag-import{
    color: #F56C6C;
}
.index-tag-btn{
    margin-right: 40px;
}
.change-password {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
    .change-password-box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 4px;
        padding: 20px;
        .change-password-title {
            font-weight: 600;
            font-size: 16px;
            color: #303133;
        }
        .change-password-main {
            margin-top: 15px;
            .change-password-list {
                position: relative;
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
                width: 420px;
                .change-password-val {
                    margin-bottom: 10px;
                    color: #606266;
                }
                .change-password-input {
                    width: 200px;
                }
            }
        }
        .change-password-btns {
            text-align: right;
        }
    }
    .change-password-tip{
        position: absolute;
        width: 200px;
        font-size: 14px;
        bottom: -12px;
        color: #303133;
        right: 0;
        display: flex;
        padding: 5px 10px;
        border: 1px solid rgb(179, 216, 255);
        background: rgb(217, 236, 255);
        justify-content: space-between;
        border-radius: 4px;
    }
    .change-password-tip-icon{
        color: #409EFF;
        margin-top: 5px;
        margin-right: 5px;
    }
    
}
</style>
