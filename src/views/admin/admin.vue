<template>
    <div class="admin"
        v-loading.fullscreen.lock="loading">
        <div class="admin-header">
            <el-input class="admin-search" clearable v-model="searchVal" placeholder="请输入用户名"></el-input>
            <el-button size="small" @click="search">查询</el-button>
            <el-button size="small" type="primary" @click="addUser">新增</el-button>
        </div>
        <div class="admin-main">
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
               >
                <el-table-column
                label="ID"
                width="120">
                <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column
                prop="username"
                label="用户名"
                width="120">
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="mobile"
                label="手机号"
                >
                </el-table-column>
                <el-table-column
                prop="status"
                label="状态"
                >
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status === 1 ? 'primary' : 'danger'"
                    disable-transitions>{{scope.row.status === 1 ? '正常' : '禁用'}}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                prop="createTime"
                label="创建时间"
                >
                </el-table-column>
                <el-table-column
                label="操作"
                >
                    <template slot-scope="scope">
                        <div class="admin-handle">
                            <span class="admin-handle-edit" @click="editUser(scope.row)">修改</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="admin-pagination">
            <el-pagination
                background
                :page-size="20"
                layout="total, prev, pager, next"
                :total="total"
                :current-page="page"
                @current-change="currentChange">
            </el-pagination>
        </div>
        <admin-dialog 
            v-if="roles.length > 0"
            :title="title" 
            :isShow="isShow" 
            :id="id"
            :pSelectRole="selectRole"
            :pUsename="username"
            :pOrganname="organName"
            :pPassword="password"
            :pRepassword="rePassword"
            :pMail="mail"
            :pRadio='radio'
            :pPhone="phone"
            :roles="roles"
            @changeUserName="changeUserName($event)"
            @changeOrganName="changeOrganName($event)"
            @changePassword="changePassword($event)"
            @changeRePassword="changeRePassword($event)"
            @changeMail="changeMail($event)"
            @changePhone="changePhone($event)"
            @changeRoles="changeRoles($event)"
            @changeStatus="changeStatus($event)"
            @closeDialog="closeDialog"
            @user="getUserInfo" 
            @updateUser="updateUser"></admin-dialog>
    </div>
</template>
<script>
import adminDialog from './../../components/userDialog/adminDialog'
import { format } from './../../util/time'
import { admin } from './../../service/index'
export default {
    name: 'admin',
    components: {
        adminDialog
    },
    data() {
        return {
            isShow: false, // 是否显示弹框
            title: '', // 弹框名称
            searchVal: '', // 搜索值
            tableData: [], // 表的数据
            total: 0, // 总页数
            page: 1, // 页数
            loading: false,  // 是否显示loading
            selectRole: 0, // 选择的角色
            username: '', // 用户名
            password: '', // 密码
            rePassword: '', // 确认密码
            mail: '', // 邮箱
            phone: '', // 电话
            roles: [], // 角色列表
            radio: '', // 角色选择
            id: 0, // 当前修改用户的id
            searchSearchVal: '',
            organName: ''
        }
    },
    // 面包屑路由进入的操作
    beforeRouteEnter(to, from, next) {
        next(vm=>{
            vm.routeList = to.meta.routeList.length > 1 ? to.meta.routeList.splice(0, to.meta.routeList.length - 1) : to.meta.routeList
        })
    },
    created() {
        // 获取用户列表
        this.getUserLists()
        // 获取角色列表
        this.getRoles()
    },
    methods: {
        async getUserLists() {
            try{
                let { data} = await admin.userLists({
                    username: this.searchSearchVal,
                    page: this.page,
                    limit: 20
                })
                this.total = data.totalCount;
                this.tableData = data.list;
                this.tableData = this.tableData.map(item => ({
                    ...item,
                    createTime: format(item.createTime, 8)
                }))
            }catch(e){
                return e
            }
            
        },
        async getRoles() {
            try{
                let { data } = await admin.roles()
                this.roles = data
            }catch(e) {
                return e
            }
        },
        // 查询事件
        search() {
            this.searchSearchVal = this.searchVal
            this.page = 1;
            this.getUserLists()
        },
        changePassword(e) {
            this.password = e.value
        },
        changeRePassword(e) {
            this.rePassword = e.value
        },
        changeMail(e) {
            this.mail = e.value
        },
        changePhone(e) {
            this.phone = e.value
        },
        changeRoles(e) {
            this.selectRole = e.value
        },
        changeUserName(e) {
            this.username = e.value
        },
        changeOrganName(e) {
            this.organName = e.value
        },
        changeStatus(e) {
            this.radio = e.value
        },
        currentChange(page) {
            this.page = page
            this.getUserLists()
        },
        // 新增用户弹窗显示
        addUser() {
            if(this.roles.length === 0) {

                this.$message({
                    type: 'error',
                    message: '没有角色列表，请在角色管理先添加角色。'
                })
                return
            }
            this.title = '新增'
            this.isShow = true
            this.username = ''
            this.organName = ''
            this.mail = ''
            this.phone = ''
            this.radio = '1'
            this.password = ''
            this.rePassword = ''
            this.selectRole = this.roles.length > 0 ? this.roles[0].id : null
        },
        // 修改用户弹窗显示
        async editUser(item) {
            
            try{
                if(this.roles.length === 0) {
                    this.$message({
                        message: '没有角色列表，请在角色管理先添加角色。',
                        type: 'error'
                    })
                    return
                }
                let { data } = await admin.infoById({
                    id: item.id
                })
                this.title = '修改'
                this.id = item.id
                this.username = item.username
                this.organName = item.organName
                this.mail = item.email
                this.phone = item.mobile
                this.radio = `${item.status}`
                this.password = ''
                this.rePassword = ''
                this.selectRole = data.roleIdList[0] || null
                this.isShow = true
            } catch(e){
                return e
            }
        },
        closeDialog(e) {
            this.isShow = e.currentShow
        },
        // 确认新增用户事件
        async getUserInfo(e) {
            try {
                this.loading = true
                await admin.addUser({
                    username: e.username,
                    organName: e.organName,
                    password: e.password,
                    mobile: e.phone,
                    email: e.mail,
                    status: e.status,
                    roleIdList: [e.role]
                })
                this.loading = false
                this.$message({
                    type: 'success',
                    message: '添加用户成功'
                })
                this.isShow = false
                this.page = 1
                this.getUserLists()
            } catch(e) {
                this.loading = false
            } 
        },
        // 确认修改用户事件
        async updateUser(e) {
            try {
                this.loading = true
                await admin.updateUser({
                    id: e.id,
                    username: e.username,
                    organName: e.organName,
                    password: e.password,
                    mobile: e.phone,
                    email: e.mail,
                    status: e.status,
                    roleIdList: [e.role]
                })
                this.loading = false
                this.$message({
                    type: 'success',
                    message: '修改用户成功'
                })
                this.isShow = false
                this.getUserLists()
            } catch(e) {
                this.loading = false
            } 
        } 
    }
}
</script>
<style lang="less" scoped>
.admin{
    height: 100%;
    display: flex;
    flex-direction: column;
    .admin-header{
        margin-bottom: 20px;
        .admin-search{
            width: 180px;
            margin-right: 20px;
        }
    }
    .admin-main{
        flex: 1;
        overflow-y: auto;
    }
    .admin-handle{
        display: flex;
        .admin-handle-edit{
            color: #409eff;
            cursor: pointer;
            margin-right: 10px;
        }
        .admin-handle-delete{
            color: #f56c6c;
            cursor: pointer;
        }
    }
    .admin-pagination{
        text-align: right;
        margin-top: 15px;
    }
}

</style>
