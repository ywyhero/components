<template>
    <div class="common">
        <el-container :style="{height: height + 'px'}" style="border-left: 1px solid #545c64">
            <div class="common-left">
                <div class="sys-name">
                   <!-- <img class="login-logo" src="./../assets/images/title_icon.png" alt /> -->
                    <span>音乐云课堂</span>
                </div>
                <el-aside width="200px" style="background-color: #545c64">
                    <el-menu
                        :default-openeds="defaultOpeneds"
                        background-color="#304156"
                        text-color="#fff"
                        active-text-color="#1890FF"
                        :default-active="defaultActive"
                    >
                        <el-submenu v-for="(item, index) in navLists" :key="index" :index="item.id">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                {{item.name}}
                            </template>
                            <div v-for="(itm, idx) in item.list" :key="idx">
                                <el-submenu v-if="itm.list" :index="itm.id">
                                    <template slot="title">{{itm.name}}</template>
                                    <el-menu-item
                                        v-for="(it, ix) in itm.list"
                                        :key="ix"
                                        @click="clickEvent(it)"
                                        :index="it.id"
                                    >{{it.name}}</el-menu-item>
                                </el-submenu>
                                <el-menu-item-group v-else>
                                    <el-menu-item
                                        :index="itm.id"
                                        @click="clickEvent(itm)"
                                    >{{itm.name}}</el-menu-item>
                                </el-menu-item-group>
                            </div>
                        </el-submenu>
                    </el-menu>
                </el-aside>
            </div>
            <el-container>
                <el-header class="header">
                    <el-button type="text" class="header-btn" @click="downloadClick">下载中心</el-button>
                    <el-button type="text" class="header-btn" @click="newGuide">新手引导</el-button>
                    <el-dropdown @command="changeInfo">
                        
                       <div class="header-personal">
                            <span class="el-icon-val">{{username}}</span>
                            <span class="user-role">【{{userrole}}】</span>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </div>

                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="changeMobile">修改手机号</el-dropdown-item>
                            <el-dropdown-item command="changePassword">修改登陆密码</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span class="el-icon-val header-logout" @click="logout">退出</span>
                </el-header>
                <el-main class="common-main">
                    <div class="common-main-router">
                        <div class="common-main-breadcrumb" v-show="show">
                            <el-breadcrumb separator="/">
                                <el-breadcrumb-item :to="{ path: '/system/index' }">音乐云课堂</el-breadcrumb-item>
                                <el-breadcrumb-item
                                    class="common-main-breadcrumb-item"
                                    v-for="(item, index) in breadcrumbLists"
                                    :key="index"
                                    :to="item.path"
                                >{{item.name}}</el-breadcrumb-item>
                            </el-breadcrumb>
                            <el-button
                                size="small"
                                type="primary"
                                class="back-user-list"
                                @click="backUserList"
                                v-if="userPermission['mall:student:list'] && path === '/system/userDetail'"
                            >查看用户列表</el-button>
                        </div>
                        <!-- <transition name="fade-transform" mode="out-in">
                            
                        </transition>-->
                        <keep-alive>
                            <router-view
                                class="common-main-view keepAlive"
                                v-if="$route.meta.keepAlive"
                            ></router-view>
                        </keep-alive>
                        <router-view class="common-main-view" v-if="!$route.meta.keepAlive"></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <div class="change-password" v-show="isShow">
            <div class="change-password-box">
                <span class="change-password-title">修改登录密码</span>
                <div class="change-password-main">
                    <div class="change-password-list">
                        <span class="change-password-val">
                            原登录密码
                        </span>
                        <el-input
                            class="change-password-input"
                            type="password"
                            auto-complete="new-password"
                            v-model="oldPwd"
                            placeholder="请输入旧密码"
                        ></el-input>
                    </div>
                    <div class="change-password-list">
                        <span class="change-password-val">
                            设置新登录密码
                        </span>
                        <el-input
                            class="change-password-input"
                            v-model="newPwd"
                            auto-complete="new-password"
                            placeholder="请输入新密码"
                            @input="changePassword"
                            type="password"
                        ></el-input>
                        <div class="change-password-tip">
                            <i class="el-icon-warning change-password-tip-icon"></i>
                            <span>此密码与登录教师端APP时使用的密码相同。</span>
                        </div>
                    </div>
                    <div class="change-password-list">
                        <span class="change-password-val">
                            确认新登录密码
                        </span>
                        <el-input
                            class="change-password-input"
                            type="password"
                            @input="changeRePassword"
                            auto-complete="new-password"
                            v-model="sureNewPwd"
                            placeholder="请再输入一次新密码"
                        ></el-input>
                    </div>
                </div>
                <div class="change-password-btns">
                    <el-button @click="cancle">取消</el-button>
                    <el-button type="primary" @click="sure">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
.common {
    .el-header {
        line-height: 60px;
    }
    .el-menu {
        border-right: none;
    }
    .el-menu-item-group__title {
        padding: 0;
    }
    .common-main {
        width: 100%;
        height: 100%;
        background: #f1f1f1;
        padding: 10px;
    }
    .common-main-router {
        width: 100%;
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
    }
    .common-main-view {
        flex: 1;
        overflow-y: auto;
        padding: 0 20px 20px 20px;
    }
    .sys-name {
        width: 200px;
        height: 60px;
        // line-height: 60px;
        font-size: 20px;
        color: #fff;
        background: #304156;
        text-align: center;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .common-left {
        display: flex;
        flex-direction: column;
    }
    .el-aside {
        flex: 1;
        background-color: #304156 !important;
    }
    .login-logo {
        width: 30px;
        height: 30px;
        margin-right: 6px;
    }
    .header {
        text-align: right;
        color: #333;
        font-size: 14px;
        background: #fff;
        .header-personal {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 60px;
            cursor: pointer;
        }
        
    }
    .header-logout{
        margin-left: 20px; 
        color: #333;
        cursor: pointer;
    }
    .el-icon-val {
        color: #409EFF;
        font-weight: 600;
    }
    .el-icon-arrow-down{
        color: #409EFF;
    }
    .user-role{
        color:#484848;
    }
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all 0.5s;
    }
    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }
    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    
}
</style>
<style lang="less" scoped>
.common-main-breadcrumb-item {
    cursor: pointer;
}
.common-main-breadcrumb-name {
    color: #606266;
    font-size: 14px;
}
.common-main-breadcrumb {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #333;
    // padding-top: 20px;
    // margin-left: 20px;
    // padding-bottom: 10px;
    .back-user-list {
        margin-top: -8px;
    }
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
 .header-btn{
    margin-right: 40px;
}
</style>
<script>
import { home } from './../service/index'
import { mapGetters, mapActions } from 'vuex'
import {Button} from 'element-ui'
export default {
    data() {
        return {
            height: 0,
            navLists: [],
            oldPwd: '',
            newPwd: '',
            sureNewPwd: '',
            newCode: '',
            newMobile: '',
            loginPassword: '',
            isShow: false,
            isPhoneShow: false,
            username: '',
            defaultActive: '0',
            defaultOpeneds: [],
            breadcrumbLists: [],
            path: '',
            show: false,
            userrole:'',
            isCodeShow: true,
            seconds: 60
        }
    },
    components: {
        'el-button': Button
    },
    watch: {
        getMenus(newVal) {
            this.navLists = this.changeString(newVal)
            this.navLists.forEach(v => {
                this.defaultOpeneds.push(v.id)
            })
        },
        getBreadcrumbs(newVal) {
            this.breadcrumbLists = newVal
        },
        getUserInfo(newVal) {
            this.userrole = newVal.roleName
            this.username = newVal.username
        },
        '$route'(to) {
            let path = to.path
            this.path = path
            this.show = (this.path !== '/system/index');
            this.getId(this.navLists, path)
        },
    },
    computed: {
        ...mapGetters({
            getMenus: 'getMenus',
            getBreadcrumbs: 'getBreadcrumbs',
            userPermission: 'userPermission',
            getUserInfo: 'getUserInfo'
        })
    },
    created() {
        if (window.sessionStorage.getItem('userInfo')){
            this.$store.state.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        }
    },
    methods: {
        ...mapActions({
            getMenuLists: 'getMenuLists',
            checkPermission: 'checkPermission',
            getOperationReasonList: 'getOperationReasonList',
            changeUserInfo: 'changeUserInfo'
            // getAddressList: 'getAddressList',
            // getQiniuToken: 'getQiniuToken'
        }),
        newGuide() {
            this.$router.push('/system/newguide')
        },
        downloadClick() {
            this.$router.push('/system/download')
        },
        changePassword(e) {
            let value = e;
            value = value.replace(/[^\w_]/g,'');
            this.newPwd = value
        },
        changeRePassword(e) {
            let value = e;
            value = value.replace(/[^\w_]/g,'');
            this.sureNewPwd = value
        },
        getId(arr, path) {
            arr.forEach(item => {
                if (item.list) {
                    this.getId(item.list, path)
                }
                if (item.url === path) {
                    this.defaultActive = item.id
                }
            })
        },
        clickEvent(item) {
            if(this.$route.path === item.url) {
                return
            }
            this.$router.replace(item.url)
        },
        async logout(){
            try {
                await home.logout();
                this.$message({
                    type: 'success',
                    message: '退出成功',
                });
                this.$router.replace('/login')
                window.sessionStorage.removeItem('jwtToken')
                window.sessionStorage.removeItem('userInfo')
                window.sessionStorage.removeItem('routeList')
            } catch (e) {
                return e
            }
        },
        
        async getInfo() {
            let {data} = await home.getUserInfo({})
            this.changeUserInfo(data)
        },
        async changeInfo(e) {
            if (e === 'changeMobile') {
                this.isPhoneShow = true
            } else if (e === 'changePassword') {
                this.isShow = true
            }
        },
        changeString(arr) {
            arr.forEach(v => {
                v.id = `${v.id}`
                v.parentId = `${v.parentId}`
                if (v.list) {
                    this.changeString(v.list)
                }
            });
            return arr
        },
        cancle() {
            this.isShow = false
            this.oldPwd = ''
            this.newPwd = ''
            this.sureNewPwd = ''
        },
        async sure() {
            if (this.oldPwd === '') {
                this.$message({
                    type: 'error',
                    message: '旧密码不能为空'
                })
                return
            }
            if (this.newPwd === '') {
                this.$message({
                    type: 'error',
                    message: '新密码不能为空'
                })
                return
            }
            if (this.newPwd.trim() === '') {
                this.$message({
                    type: 'error',
                    message: '密码不能只输入空格'
                })
                return
            }
            if (this.newPwd !== this.sureNewPwd) {
                this.$message({
                    type: 'error',
                    message: '两次密码输入不一致'
                })
                return
            }
            try {
                await home.updateUserPwd({
                    password: this.oldPwd,
                    newPassword: this.newPwd
                })
                this.$message({
                    type: 'success',
                    message: '密码修改成功'
                })
                this.oldPwd = ''
                this.newPwd = ''
                this.sureNewPwd = ''
                this.isShow = false
                this.$router.replace('/login');
                window.sessionStorage.removeItem('jwtToken')
                window.sessionStorage.removeItem('userInfo')
                window.sessionStorage.removeItem('routeList')
            } catch (e) {
                return e
            }

        },
        navigateTo(item) {
            this.$router.replace(item.path)
        },
        // 返回用户列表的按钮
        backUserList() {
            // if (this.$route.query.username) {
            this.$router.replace({ path: '/system/user' })
            // } else {
            //     this.$router.go(-1);
            // }
        }
    },
    async mounted() {
        let height = window.innerHeight;
        this.height = height;
        await this.getMenuLists()
        this.checkPermission()
        this.path = this.$route.path;
        this.show = (this.path !== '/system/index');
        this.getId(this.navLists, this.path)
        this.breadcrumbLists = this.$store.state.breadcrumbLists;
        // this.getQiniuToken(); //获取七牛云token
        // this.getAddressList();
    },
}
</script>