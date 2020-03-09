<template>
    <div class="admin-dialog">
        <!-- <img class="register-logo" src="./../assets/images/icon_logo.png" alt /> -->
        <div class="admin-dialog-box">
            <div class="admin-dialog-main">
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        邀请码
                    </span> -->
                    <div class="register-organ-code">
                        <el-input class="admin-dialog-input" v-model="organCode" placeholder="邀请码"></el-input>
                        <span class="apply-organ-code">无可不填</span>
                    </div>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        机构名称
                    </span> -->
                    <el-input v-model="organName" class="admin-dialog-input" placeholder="机构名称"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        机构名称
                    </span> -->
                    <el-input v-model="organUrl" class="admin-dialog-input" placeholder="大众点评"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        机构名称
                    </span> -->
                    <el-input v-model="username" class="admin-dialog-input" placeholder="申请人姓名"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        机构名称
                    </span> -->
                    <el-input v-model="jobName" class="admin-dialog-input" placeholder="申请人职务"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        手机号
                    </span> -->
                    <div class="admin-dialog-list-input">
                        <el-input
                            @input="changePhone"
                            v-model="phone"
                            maxlength="11"
                            class="admin-dialog-input"
                            placeholder="手机号"
                        ></el-input>
                        <span v-show="isCodeShow" class="admin-dialog-list-get-code" @click="getCode">获取验证码</span>
                        <span v-show="!isCodeShow" class="admin-dialog-list-countdown">{{seconds}}s</span>
                    </div>
                    
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        验证码
                    </span> -->
                    <el-input v-model="code" class="admin-dialog-input" placeholder="验证码"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <!-- <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        邮箱
                    </span> -->
                    <el-input v-model="mail" class="admin-dialog-input" placeholder="邮箱"></el-input>
                </div>
                
            </div>
            <div class="admin-dialog-btns">
                <el-button class="admin-dialog-btn" @click="login">申请注册</el-button>
            </div>
            <div class="register-val">
                已有账号？
                <span class="register-login" @click="toLogin">去登录</span>
            </div>
        </div>
        <el-alert
            class="register-alert"
            v-show="isShow"
            :title="title"
            :type="type"
            @close="close"
            :description="description"
            show-icon>
        </el-alert>
    </div>
</template>
<script>
import { home } from './../../service/index'
import {Alert} from 'element-ui'
export default {
    data() {
        return {
            organName: '',
            username: '',
            jobName: '',
            mail: '',
            phone: '',
            code: '',
            organUrl: '',
            organCode: '',
            seconds: 60,
            timer: null,
            isCodeShow: true,
            type: 'success',
            title: '您的申请已提交成功',
            description: '我们会在7个工作日内审核您的注册申请信息，届时你可以直接通过邮箱链接直接登录，请注意查收！',
            isShow: false
            // organPhone: ''
        }
    },
    components: {
        'el-alert': Alert
    },
    methods: {
        toLogin() {
            this.$router.replace('/login')
        },
        // changeOrganPhone(e) {
        //     let value = e
        //     value = value.replace(/[^\d]/g, '')
        //     this.organPhone = value
        // },
        changePhone(e) {
            let value = e
            value = value.replace(/[^\d]/g, '')
            this.phone = value
        },
        countDown() {
            this.timer = setInterval(() => {
                this.seconds -= 1;
                if(this.seconds === 0) {
                    this.seconds = 60;
                    this.isCodeShow = true;
                    clearInterval(this.timer)
                }
            }, 1000)
        },
        async getCode() {
            if (this.phone.trim() === '') {
                this.$message({
                    message: '手机号不能为空',
                    type: 'error'
                })
                return
            }
            if (this.phone.length < 11) {
                this.$message({
                    message: '手机号不能少于11位',
                    type: 'error'
                })
                return
            }
            if (!/^1[3456789]\d{9}$/.test(this.phone)) {
                this.$message({
                    message: '手机号输入不正确',
                    type: 'error'
                })
                return
            }
            try {
                await home.sendPhoneCode({
                    cellphone: this.phone,
                    areaCode: '+86'
                })
                this.isCodeShow = false
                this.countDown()
                this.$message({
                    type: 'success',
                    message: '验证码发送成功'
                })
            } catch(e) {
                if(e.data.code === 400003568) {
                    this.type = 'warning'
                    this.title = '您已提交过申请'
                    this.description = '您的申请已发出，请勿重复申请，正在审核中，耐心等待......'
                    this.isShow = true;
                } 
            }
            
        },
        async login() {
            if (this.organName === '') {
                this.$message({
                    message: '机构名称不能为空',
                    type: 'error'
                })
                return
            }
            if (this.organUrl === '') {
                this.$message({
                    message: '大众点评链接不能为空',
                    type: 'error'
                })
                return
            }
            if (this.username === '') {
                this.$message({
                    message: '申请人姓名不能为空',
                    type: 'error'
                })
                return
            }
            if (this.jobName === '') {
                this.$message({
                    message: '申请人职务不能为空',
                    type: 'error'
                })
                return
            }
            if (this.phone.trim() === '') {
                this.$message({
                    message: '手机号不能为空',
                    type: 'error'
                })
                return
            }
            if (this.phone.length < 11) {
                this.$message({
                    message: '手机号不能少于11位',
                    type: 'error'
                })
                return
            }
            if (!/^1[3456789]\d{9}$/.test(this.phone)) {
                this.$message({
                    message: '手机号输入不正确',
                    type: 'error'
                })
                return
            }
            if (this.code === '') {
                this.$message({
                    message: '验证码不能为空',
                    type: 'error'
                })
                return
            }
            if (this.mail === '') {
                this.$message({
                    message: '邮箱不能为空',
                    type: 'error'
                })
                return
            }
            if (!this.mail.includes('@')) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                })
                return
            }
            try {
                await home.register4({
                    organName: this.organName,
                    mobile: this.phone,
                    code: this.code,
                    email: this.mail,
                    inviteCode: this.organCode,
                    username: this.username,
                    usertitle: this.jobName,
                    dianpingUrl: this.organUrl
                })
                this.type = 'success'
                this.title = '您的申请已提交成功'
                this.description = '我们会在7个工作日内审核您的注册申请信息，届时你可以直接通过邮箱链接直接登录，请注意查收！'
                this.isShow = true;
            } catch(e) {
                if(e.data.code === 400003568) {
                    this.type = 'warning'
                    this.title = '您已提交过申请'
                    this.description = '您的申请已发出，请勿重复申请，正在审核中，耐心等待......'
                    this.isShow = true;
                } 
            }
        },
        close() {
            this.isShow = false
        },
    }
}
</script>

<style lang="less" scoped>
.admin-dialog {
    // position: fixed;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    background: #2e363f;
    // z-index: 99;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.register-alert{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 510px;
}
.register-logo {
    width: 150px;
    height: 150px;
    border-radius: 20%;
    margin-bottom: 20px;
}
.admin-dialog-box {
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // background: #fff;
    border-radius: 4px;
    .admin-dialog-main {
        color: #606266;
        line-height: 24px;
        font-size: 14px;
        .admin-dialog-list {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
            position: relative;
            .admin-dialog-list-input{
                position: relative;
            }
            .admin-dialog-list-get-code{
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: max-content;
                right: 10px;
                color: #409eff;
                cursor: pointer;
            }
            .admin-dialog-radios {
                flex: 1;
            }
            .admin-dialog-val {
                display: flex;
                color: #fff;
                font-weight: 600;
                .admin-dialog-i {
                    color: red;
                }
            }
            // .admin-dialog-input {
                // width: 360px;
                // height: 36px;
                // line-height: 36px;
            // }
        }
    }
    .admin-dialog-btn {
        margin-top: 20px;
        width: 360px;
        height: 40px;
        border-radius: 4px;
        background: #fd5e01;
        color: #fff;
        border: none;
        text-align: center;
    }
    .register-val {
        text-align: center;
        font-size: 12px;
        color: #fff;
        margin-top: 10px;
    }
    .register-login {
        color: #fd5e01;
        cursor: pointer;
    }
    .register-organ-code {
        position: relative;
        .apply-organ-code {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #909399;
            font-size: 13px;
        }
    }
}
.admin-dialog-list-countdown{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 5px 15px;
    border-radius: 4px;
    background: #C0C4CC;
    color: #fff;
    right: 10px;
}
</style>
