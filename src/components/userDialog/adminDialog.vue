<template>
    <div class="admin-dialog" v-show="isShow">
        <div class="admin-dialog-box">
            <div class="admin-dialog-title">{{title}}</div>
            <div class="admin-dialog-main">
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        用户名
                    </span>
                    <el-input :disabled="title !== '新增'" v-model="username" @change="changeUserName" class="admin-dialog-input" placeholder="登录账号"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        机构名称
                    </span>
                    <el-input v-model="organName" @change="changeOrganName" class="admin-dialog-input" placeholder="机构名称"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        密码
                    </span>
                    <el-input v-model="password" @change="changePassword" class="admin-dialog-input" placeholder="密码"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        确认密码
                    </span>
                    <el-input v-model="rePassword" @change="changeRePassword" class="admin-dialog-input" placeholder="确认密码"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        邮箱
                    </span>
                    <el-input v-model="mail" @change="changeMail" class="admin-dialog-input" placeholder="邮箱"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">
                        <i class="admin-dialog-i">*</i>
                        手机号
                    </span>
                    <el-input v-model="phone" maxlength="11" @change="changePhone" class="admin-dialog-input" placeholder="手机号"></el-input>
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">角色</span>
                    <div class="admin-dialog-radios">
                        <el-radio-group v-model="selectRole" @change="changeRoles">
                            <el-radio v-for="(item, index) in roles" :key="index" :label="item.id">{{item.roleName}}</el-radio>
                        </el-radio-group>
                    </div>
                    
                </div>
                <div class="admin-dialog-list">
                    <span class="admin-dialog-val">状态</span>
                     <el-radio-group v-model="radio" @change="changeStatus">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                     </el-radio-group>
                </div>
            </div>
             <div class="admin-dialog-btns">
                <el-button @click="cancle" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="sure">确认</el-button>
            </div>
        </div>
       
    </div>
</template>
<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '新增'
        },
        pUsename: {
            type: String,
            default: ''
        },
        pOrganname: {
            type: String,
            default: ''
        },
        pPassword: {
            type: String,
            default: ''
        },
        pRepassword: {
            type: String,
            default: ''
        },
        pMail: {
            type: String,
            default: ''
        },
        pPhone: {
            type: String,
            default: ''
        },
        roles: {
            type: Array
        },
        pSelectRole: {
            type: Number,
            default: 0
        },
        pRadio: {
            type: String,
            default: ''
        },
        id: {
            type: Number,
            default: 0
        }
    },
    watch: {
        pSelectRole(newVal) {
            this.selectRole = newVal
        },
        pRadio(newVal) {
            this.radio = newVal
        },
        pPhone(newVal) {
            this.phone = newVal
        },
        pMail(newVal) {
            this.mail = newVal
        },
        pUsename(newVal) {
            this.username = newVal
        },
        pOrganname(newVal) {
            this.organName = newVal
        },
        pPassword(newVal) {
            this.password = newVal
        },
        pRepassword(newVal) {
            this.rePassword = newVal
        }
    },
    data() {
        return {
            radio: '1',
            username: '',
            organName: '',
            password: '',
            rePassword: '',
            mail: '',
            phone: '',
            currentShow: false,
            selectRole: 0
        }
    },
    methods: {
        changeUserName(val) {
            this.$emit('changeUserName', {
                value: val
            })
        },
        changeOrganName(val) {
            this.$emit('changeOrganName', {
                value: val
            })
        },
        changePassword(val) {
            this.$emit('changePassword', {
                value: val
            })
        },
        changeRePassword(val) {
            this.$emit('changeRePassword', {
                value: val
            })
        },
        changeMail(val) {
            this.$emit('changeMail', {
                value: val
            })
        },
        changePhone(val) {
            this.$emit('changePhone', {
                value: val
            })
        },
        changeRoles(val) {
            this.$emit('changeRoles', {
                value: val
            })
        },
        changeStatus(val) {
            this.$emit('changeStatus', {
                value: val
            })
        },
        cancle() {
            this.$emit('closeDialog', {
                currentShow: false
            })
        },
        sure() {
            if(this.username === '') {
                this.$message({
                    message: '用户名不能为空',
                    type: 'error'
                });
                return
            }
            if(this.organName === '') {
                this.$message({
                    message: '机构名称不能为空',
                    type: 'error'
                });
                return
            }
            if(this.password === '') {
                this.$message({
                    message: '密码不能为空',
                    type: 'error'
                });
                return
            }
            if(this.rePassword === '') {
                this.$message({
                    message: '确认密码不能为空',
                    type: 'error'
                });
                return
            }
            if(this.rePassword !== this.password) {
                this.$message({
                    message: '密码输入不一致',
                    type: 'error'
                });
                return
            }
            if(this.mail === '') {
                this.$message({
                    message: '邮箱不能为空',
                    type: 'error'
                });
                return
            }
            if(!this.mail.includes('@')) {
                this.$message({
                    message: '邮箱格式不正确',
                    type: 'error'
                });
                return
            }
            if(this.phone === '') {
                this.$message({
                    message: '手机号不能为空',
                    type: 'error'
                });
                return
            }
            if(this.phone.length < 11) {
                this.$message({
                    message: '手机号不能少于11位',
                    type: 'error'
                });
                return
            }
            // if(!(/^1[3456789]\d{9}$/.test(this.phone))) {
            //     this.$message({
            //         message: '手机号输入不正确',
            //         type: 'error'
            //     });
            //     return
            // }
            if(this.title === '新增') {
                this.$emit('user', {
                    username: this.username,
                    organName: this.organName,
                    password: this.password,
                    rePassword: this.rePassword,
                    mail: this.mail,
                    phone: this.phone,
                    status: this.radio,
                    role: this.selectRole,
                    id: this.id
                })
            } else if (this.title === '修改') {
                this.$emit('updateUser', {
                    username: this.username,
                    organName: this.organName,
                    password: this.password,
                    rePassword: this.rePassword,
                    mail: this.mail,
                    phone: this.phone,
                    status: this.radio,
                    role: this.selectRole,
                    id: this.id
                })
            }
        }
    }
}
</script>
<style lang="less">
.admin-dialog{
    .el-radio{
        line-height: 20px;
    }
}
</style>

<style lang="less" scoped>
.admin-dialog{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 99;
}
.admin-dialog-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    .admin-dialog-title{
        line-height: 24px;
        font-size: 18px;
        color: #303133;
    }
    .admin-dialog-main{
        padding: 30px 20px;
        color: #606266;
        line-height: 24px;
        font-size: 14px;
        .admin-dialog-list{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .admin-dialog-radios{
                flex: 1;
            }
            .admin-dialog-val{
                display: flex;
                justify-content: flex-end;
                margin-right: 20px;
                width: 72px;
                .admin-dialog-i{
                    color: red;
                }
            }
            .admin-dialog-input{
                width: 774px;
                height: 36px;
                line-height: 36px;
            }
        }
    }
    .admin-dialog-btns{
        padding-right: 20px;
        text-align: right;
    }
}
</style>
