<template>
    <div class="login" v-loading.fullscreen.lock="loading">
        <!-- <img class="login-logo" src="./../assets/images/icon_logo.png" alt /> -->
        <span class="login-val">音乐云课堂后台管理系统</span>
        <el-input
            class="login-input login-username"
            v-model="username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名/手机号"
            clearable
        ></el-input>
        <div class="login-password">   
            <el-input
                class="login-input"
                v-model="pwd"
                prefix-icon="el-icon-unlock"
                placeholder="密码"
                type="password"
                @keyup.enter.native="login"
            ></el-input>
            <span class="login-forget" @click="forgetEvent">忘记密码</span>
        </div>
        <span class="login-btn" @click="login">登录</span>
        <div class="login-value">还没有账号？<span class="login-register" @click="toRegister">去注册</span></div>
        <div class="login-organ" v-show="organShow">
            <div class="login-organ-main">
                <div class="login-organ-header">
                    <span class="login-organ-header-title">您的手机号绑定了多个机构，请选择登陆:</span>
                    <span class="el-icon-close login-organ-close" @click="closeOrgan"></span>
                </div>
                <div class="login-organ-lists">
                    <el-radio class="login-organ-list" v-for="(item, index) in organLists" :key="index" v-model="radio" :label="item.deptId">{{item.deptName}}</el-radio>
                </div>
                <div class="login-organ-btns">
                    <el-button class="login-organ-btn" type="primary" @click="organSure">确定</el-button>
                </div>
                
            </div>
        </div>
    </div>
</template>
<script>
import { home } from './../../service/index'
import { Radio, Button } from 'element-ui'
export default {
    data() {
        return {
            username: '',
            pwd: '',
            loading: false,
            radio: '',
            organShow: false,
            organLists: []
        }
    },
    components: {
        'el-radio': Radio,
        'el-button': Button
    },
    methods: {
        toRegister() {
            this.$router.push('/register');
        },
        forgetEvent() {
            this.$router.push('/changepwd')
        },
        async login() {
            try {
                if (this.username === '') {
                    this.$message({
                        type: 'error',
                        message: '用户名不能为空'
                    });
                    return
                }
                if (this.pwd === '') {
                    this.$message({
                        type: 'error',
                        message: '密码不能为空'
                    });
                    return
                }
                this.loading = true
                let { data } = await home.login2({
                    username: this.username,
                    password: this.pwd
                })
                this.loading = false
                window.sessionStorage.setItem('jwtToken', data["Jwt-Token"])
                if(data.organList) {
                    this.organLists = data.organList
                    this.organShow = true;
                    return
                }
                
                if(data.profile) {
                    window.sessionStorage.setItem('userInfo', JSON.stringify(data.profile))
                }
                this.$message({
                    type: 'success',
                    message: '登录成功',
                    duration: 1000,
                    onClose: () => {
                        this.$router.push('/system/index')
                    }
                })
                // this.loading = false
            } catch (e) {
                this.loading = false
                return e
            }

        },
        async organSure() {
            let index = this.organLists.findIndex(v => v.deptId === this.radio)
            let organ = this.organLists[index]
            let { data } = await home.changeOrgan({
                id: organ.id,
                userId: organ.userId,
                deptId: organ.deptId,
                roleId: organ.roleId,
                userName: organ.userName,
                userTitle: organ.userTitle,
                deptName: organ.deptName,
                roleName: organ.roleName
            })
            this.$store.state.userInfo = data
            window.sessionStorage.setItem('userInfo', JSON.stringify(data))
            this.organShow = false
            this.$router.push('/system/index')
        },
        closeOrgan() {
            this.organShow = false
        }
    }
}
</script>
<style lang="less" scoped>
.login {
    height: 100%;
    width: 100%;
    padding-top: 10%;
    background: #2e363f;
    display: flex;
    flex-direction: column;
    align-items: center;
    .login-logo {
        width: 150px;
        height: 150px;
        border-radius: 20%;
    }
    .login-val {
        display: block;
        font-size: 36px;
        line-height: 1.1;
        color: #fff;
        padding: 40px 0;
    }
    .login-password{
        position: relative;
    }
    .login-forget{
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #409eff;
        font-size: 13px;
        cursor: pointer;
    }
    .login-input {
        width: 360px;
        // height: 36px;
    }
    .login-username {
        margin-bottom: 40px;
    }
    .login-btn {
        cursor: pointer;
        margin-top: 40px;
        width: 360px;
        height: 40px;
        border-radius: 4px;
        background: #fd5e01;
        color: #fff;
        line-height: 40px;
        text-align: center;
    }
    .login-value{
        text-align: center;
        font-size: 12px;
        color: #fff;
        margin-top: 10px;
    }
    .login-register{
        color: #fd5e01;
        cursor: pointer;
    }
}
.login-organ{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2e363f;
    z-index: 999;
}
.login-organ-main{
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    width: 400px;
}
.login-organ-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.login-organ-header-title{
    font-weight: 600;
    font-size: 14px;
}
.login-organ-close{
    cursor: pointer;
}
.login-organ-lists{
    display: flex;
    margin-top: 40px;
    flex-direction: column;
}
.login-organ-list{
    margin-bottom: 20px;
}
.login-organ-btns{
    text-align: right;
}
</style>
