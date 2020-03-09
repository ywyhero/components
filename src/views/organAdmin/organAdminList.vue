<template>
    <div class="role-list-wrapper" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="flex-row-between-center">
            <div class="flex-row-start-center role-list-query-form-wrapper">
                <el-form ref="queryForm" :model="queryForm" :rules="rules">
                    <el-form-item label="" prop="mobile">
                        <el-input
                            v-model.trim="queryForm.mobile"
                            placeholder="搜索教务手机号"
                            @input="changeQueryParam"
                            clearable
                            :maxLength="11"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="query-btn-wrapper">
                    <el-button type="primary" plain @click="queryBtn" size="small">搜索</el-button>
                </div>
            </div>
            <el-button type="primary" size="small" @click="updateRoleBtn">新增教务</el-button>
        </div>
        <el-table :data="tableData" class="table-wrapper" height="100%">
            <el-table-column prop="username" label="用户"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        :underline="false"
                        class="edit-role-btn"
                        @click="updateRoleBtn(scope.row)"
                    >修改</el-link>
                    <el-link type="danger" :underline="false" @click="deletRoleBtn(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-style">
            <el-pagination
                background=""
                layout="total, prev, pager, next"
                :total="totalCount"
                :page-size="pageSize"
                :current-page="pageNo"
                @current-change="currentChange"
                :hide-on-single-page="value"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import { organAdmin } from '../../service'
export default {
    name: 'roleList',
    data() {
        return {
            fullscreenLoading: false,
            queryForm: {
                mobile: ''
            },
            pagingParams: {
                mobile: ''
            },
            rules: {
                mobile: [
                    {
                        min: 11,
                        max: 11,
                        message: '请输入正确手机号'
                    }
                ]
            },
            pageNo: 1,
            pageSize: 20,
            tableData: [],
            totalCount: 0,
            value: false
        }
    },
    components: {},
    created() {
        this.getOrganAdminList()
    },
    mounted() {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeList =
                to.meta.routeList.length > 1
                    ? to.meta.routeList.splice(0, to.meta.routeList.length - 1)
                    : to.meta.routeList
        })
    },
    methods: {
        changeQueryParam(value) {
            this.queryForm.mobile = value.replace(/[^0-9]/g, '')
        },
        // 搜索按钮
        queryBtn() {
            this.$refs.queryForm.validate(valid => {
                if (valid) {
                    this.pagingParams.mobile = this.queryForm.mobile
                    this.pageNo = 1
                    this.getOrganAdminList()
                }
            })
        },

        // 更新教务按钮
        updateRoleBtn(row) {
            if (row.id) {
                this.$router.push({
                    path: 'editArganAdmin',
                    query: { id: row.id, mobile: row.mobile }
                })
            } else {
                this.$router.push({ path: 'addArganAdmin' })
            }
        },
        // 分页按钮
        currentChange(pageNo) {
            this.pageNo = pageNo
            this.getOrganAdminList()
        },

        // 删除教务按钮
        deletRoleBtn(row) {
            this.$confirm(
                '删除后需要再给教务排课，需要重新新增教务。',
                '确认要删除教务信息吗？',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(() => {
                    this.delOrganAdminApi(row)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
        },
        // 获取教务列表api
        async getOrganAdminList() {
            try {
                this.fullscreenLoading = true
                let queryParams = {
                    page: this.pageNo,
                    limit: this.pageSize,
                    mobile: this.pagingParams.mobile
                }
                let { data } = await organAdmin.getOrganAdminList(queryParams)
                if (
                    data.totalPage < data.currPage &&
                    data.list &&
                    data.list.length === 0 &&
                    this.pageNo !== 1
                ) {
                    --this.pageNo
                    this.getOrganAdminList();
                }
                let tableData = data.list
                this.tableData = tableData.map(item => ({
                    ...item
                }))
                this.totalCount = data.totalCount
                this.fullscreenLoading = false
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        // 删除教务api
        async delOrganAdminApi(row) {
            try {
                this.fullscreenLoading = true
                let params = {
                    id: row.id,
                    username: row.username,
                    mobile: row.mobile,
                    password: '111'
                }
                await organAdmin.delOrganAdmin(params)
                this.fullscreenLoading = false
                this.$message({ type: 'success', message: '删除成功' })
                this.getOrganAdminList()
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        }
    }
}
</script>
<style lang='less'>
.role-list-wrapper {
    .role-list-query-form-wrapper {
        .el-form-item {
            margin-bottom: 0;
        }
        .el-input {
            width: 234px;
        }
    }
}
</style>

<style lang='less' scoped>
.role-list-wrapper {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .query-btn-wrapper {
        margin-left: 20px;
    }
    .table-wrapper {
        margin-top: 20px;
        flex: 1;
        overflow-y: scroll;
    }
    .pagination-style {
        text-align: right;
        margin-top: 20px;
    }
    .edit-role-btn {
        margin-right: 10px;
    }
}
</style>
