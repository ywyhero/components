<template>
    <div class="role"
        v-loading.fullscreen.lock="loading">
        <div class="role-header">
            <el-input class="role-search" clearable v-model="searchVal" placeholder="角色名称"></el-input>
            <el-button @click="search" size="small">查询</el-button>
            <el-button type="primary" size="small" @click="addUser">新增</el-button>
            <el-button type="danger" size="small" @click="deleteUser" :disabled="isDisabled">批量删除</el-button>
        </div>
        <div class="role-main">
            <el-table
                :data="tableData"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column
                label="ID"
                width="120">
                <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column
                prop="roleName"
                label="角色名称"
                width="200">
                </el-table-column>
                <el-table-column
                width="400"
                prop="remark"
                label="备注"
                show-overflow-tooltip>
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
                        <div class="role-handle">
                            <span class="role-handle-edit" @click="editUser(scope.row)">修改</span>
                            <span class="role-handle-delete" @click="deleteUser(scope.row)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="role-pagination">
            <el-pagination
                :current-page="page"
                @current-change="currentChange"
                background
                :page-size="20"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
        <role-dialog 
            :id="id"
            :title="title" 
            :roleRemark="remark"
            :roleName="name"
            :data="menuLists"
            :isShow="isShow" 
            :defaultChecked="defaultChecked"
            @changeRoleName="changeRoleName"
            @changeRemark="changeRemark"
            @closeDialog="closeDialog" 
            @editRole="editRole"
            @addRole="addRole"></role-dialog>
    </div>
</template>
<script>
import roleDialog from './../../components/userDialog/roleDialog'
import { admin } from './../../service/index'
import { format } from './../../util/time'
import { treeDataTranslate } from './../../util/index'
export default {
    name: 'role',
    components: {
        roleDialog
    },
    data() {
        return {
            isShow: false, // 是否显示弹框
            title: '', // 弹框的头部名称
            searchVal: '', // 搜索的值
            searchSearchVal: '', // 搜索的值
            isDisabled: true, // 是否禁用按钮
            multipleSelection: [], // 选择的需要删除的角色
            tableData: [], // 角色列表
            total: 0, // 总共数据
            page: 1, // 当前页码
            remark: '', // 备注
            name: '', // 角色名称
            menuLists: [], // 授权列表
            defaultChecked: [], // 默认选择
            id: 0, // 当前修改的角色id
            loading: false
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm=>{
            vm.routeList = to.meta.routeList.length > 1 ? to.meta.routeList.splice(0, to.meta.routeList.length - 1) : to.meta.routeList
            // vm.getMenuLists()
            // vm.searchVal = '';
            // vm.search();
        })
    },
    created() {
        this.getRoles()
        this.getMenuLists()
    },
    methods: {
        async getRoles() {
            try{
                this.loading = true
                let { data } = await admin.roleLists({
                    limit: 20,
                    page: this.page,
                    roleName: this.searchSearchVal
                })
                this.total = data.totalCount
                this.tableData = data.list
                this.tableData = this.tableData.map(item => ({
                    ...item,
                    createTime: format(item.createTime, 8)
                }))
                this.loading = false
            }catch(e){
                this.loading = false
                return e
            }
           
        },
        async getMenuLists() {
            try{
                let { data } = await admin.menuLists()
                this.menuLists = treeDataTranslate(data)
            }catch(e){
                return e
            }
           
        },
        changeRoleName(e) {
            this.name = e.value
        },
        changeRemark(e) {
            this.remark = e.value
        },
        currentChange(page) {
            this.page = page
            this.getRoles()
        },
        search() {
            this.searchSearchVal = this.searchVal
            this.page = 1;
            this.getRoles()
        },
        addUser() {
            if(this.menuLists.length > 0) {
                this.defaultChecked = []
                this.isShow = true
                this.title = '新增'
                this.name = ''
                this.remark = ''
            }
        },
        async addRole(e) {
            try{
                await admin.addRole({
                    roleName: e.roleName,
                    remark: e.roleMark,
                    menuIdList: e.menuIdList,
                    halfMenuIdList: e.halfMenuIdList
                })
                this.isShow = false
                this.page = 1;
                this.getRoles()
                this.$message({
                    type: 'success',
                    message: '添加角色成功'
                })
            }catch(e){
                return e
            }
            
        },
        deleteUser(item) {
            if(item.id) {
                this.multipleSelection = [item.id]
            }
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.deleteRole(this.multipleSelection)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        async deleteRole(ids) {
            try{
                await admin.deleteRole({
                    id: ids
                })
                this.getRoles()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            } catch(e) {
                return e
            }
        },
        async editUser(item) {
            try{
                this.loading = true
                let { data } = await admin.roleAuth({
                    id: item.id
                })
                this.defaultChecked = data.menuIdList
                this.id = data.id
                this.title = '修改'
                this.isShow = true
                this.name = item.roleName
                this.remark = item.remark
                this.loading = false
            }catch(e){
                this.loading = false
                return e
            }
            
        },
        async editRole(e) {
            try{
                await admin.editRoleAuth({
                    "id": e.id,
                    "roleName": e.roleName,
                    "remark": e.roleMark,
                    "menuIdList": e.menuIdList,
                    "halfMenuIdList": e.halfMenuIdList
                })
                this.isShow = false
                this.getRoles()
                this.$message({
                    type: 'success',
                    message: '修改角色成功'
                })
            }catch(e){
                return e
            }
        },
        closeDialog(e) {
            this.isShow = e.currentShow
        },
        handleSelectionChange(val) {
            if(val.length > 0) {
                this.isDisabled = false
                val.forEach(v => {
                    this.multipleSelection.push(v.id)
                })
            } else {
                this.isDisabled = true
                this.multipleSelection = []
            }
        }
    }
}
</script>
<style lang="less" scoped>
.role{
    height: 100%;
    display: flex;
    flex-direction: column;
    .role-header{
        margin-bottom: 20px;
        .role-search{
            width: 180px;
            margin-right: 20px;
        }
    }
    .role-main{
        flex: 1;
        overflow-y: auto;
    }
    .role-handle{
        display: flex;
        .role-handle-edit{
            color: #409eff;
            cursor: pointer;
            margin-right: 10px;
        }
        .role-handle-delete{
            color: #f56c6c;
            cursor: pointer;
        }
    }
    .role-pagination{
        height: 40px;
        text-align: right;
        line-height: 40px;
        margin-top: 15px;
    }
}

</style>
