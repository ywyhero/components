<template>
    <div class="teacher-list-wrapper" v-loading.fullscreen.lock="fullscreenLoading">
        <div class="flex-row-between-center" v-if="teacherPermission">
            <div class="flex-row-start-center teacher-list-query-form-wrapper">
                <el-form ref="queryForm" :model="queryForm" :rules="rules">
                    <el-form-item label prop="queryParam">
                        <el-input
                            v-model.trim="queryForm.queryParam"
                            placeholder="搜索老师姓名/手机号"
                            clearable
                            :maxLength="19"
                            @input="changeQueryParam"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="query-btn-wrapper">
                    <el-button type="primary" plain @click="queryBtn" size="small">搜索</el-button>
                </div>
            </div>
            <div class="">
                <el-button type="primary" size="small" @click="gotoBatchImport">批量导入</el-button>
                <el-button type="primary" size="small" @click="updateTeacherBtn">新增老师</el-button>
            </div>
            
        </div>
        <el-table :data="tableData" class="table-wrapper" height="100%">
            <el-table-column prop="teacherNum" label="老师编号"></el-table-column>
            <el-table-column prop="teacherMobile" label="注册手机号"></el-table-column>
            <el-table-column prop="teacherName" label="显示昵称"></el-table-column>
            <el-table-column prop="nextClassTime" label="下节课时间"></el-table-column>
            <el-table-column prop="userName" label="下节课学生"></el-table-column>
            <el-table-column prop="mobile" label="联系手机号"></el-table-column>
            <el-table-column prop="mobile" label="自主排课" v-if="teacherPermission">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.autoClass"
                        :active-value="1"
                        :inactive-value="0"
                        @change="authorizeClass(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="邀请学员" v-if="teacherPermission">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.inviteUser"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                        @change="inviteStudent(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="240px">
                <template slot-scope="scope">
                    <el-link
                        type="primary"
                        :underline="false"
                        class="edit-teacher-btn"
                        @click="toDetail(scope.row)"
                    >排课详情</el-link>
                    <el-link
                        type="success"
                        :underline="false"
                        class="edit-teacher-btn"
                        @click="toAfterClassReportDetail(scope.row)"
                    >课后单</el-link>
                    <el-link
                        type="primary"
                        :underline="false"
                        class="edit-teacher-btn"
                        @click="updateTeacherBtn(scope.row)"
                    >修改</el-link>
                    <el-link
                        type="danger"
                        :underline="false"
                        @click="deleteTeacherBtn(scope.row)"
                        v-if="teacherPermission"
                    >删除老师</el-link>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-style" v-if="teacherPermission">
            <el-pagination
                background
                layout="total, prev, pager, next"
                :total="totalCount"
                :page-size="pageSize"
                :current-page="pageNo"
                @current-change="currentChange"
                :hide-on-single-page="value"
            ></el-pagination>
        </div>
        <update-teacher-info
            :isShow="isShowDialog"
            :title="dialogTitle"
            :info="dialogInfo"
            @closeDialog="closeDialog"
            @getTeacherList="getTeacherList"></update-teacher-info>
    </div>
</template>

<script>
import updateTeacherInfo from './components/updateTeacherInfo'
import { teacher } from '../../service'
import { format } from '../../util/time'
import { mapGetters } from 'vuex'
import env from '../../config/env';
import XLSX from 'xlsx';

export default {
    name: 'teacherList',
    data() {
        return {
            fullscreenLoading: false,
            queryForm: {
                queryParam: ''
            },
            pagingParams: {
                queryParam: ''
            },
            rules: {
                queryParam: [
                    {
                        validator: this.VALIDATE.checkName
                    }
                ]
            },
            pageNo: 1,
            pageSize: 20,
            tableData: [],
            totalCount: 0,
            value: false,
            isShowDialog: false,
            dialogTitle: '新增老师',
            dialogInfo: {},

            importDialogShow: !1,           // 批量导入弹框状态
            importStatus: 0,           // 导入状态：0-未开始，1-进行中，2-成功，-1-失败
            batchImportData: [],        // 批量导入数据
            errorList: [],              // 导入失败的错误数据集合
            xlsxTemp: `${env.api}/app/downloadTeacherTemplate`,       // 模板下载地址
        }
    },
    components: {
        updateTeacherInfo
    },
    computed: {
        ...mapGetters({
            userPermission: 'userPermission'
        }),
        teacherPermission() {
            return this.userPermission && this.userPermission['teacher.addStu.btn']
        }
    },
    created() {
        this.getTeacherList()
    },
    mounted() { },
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
            this.queryForm.queryParam = value.replace(
                /[^a-zA-Z0-9\u4e00-\u9fe5]/g,
                ''
            )
        },
        // 搜索按钮
        queryBtn() {
            this.$refs.queryForm.validate(valid => {
                if (valid) {
                    // if (!this.queryForm.queryParam) {
                    //     this.$message.error('搜索框不能为空')
                    // } else {
                    this.pagingParams.queryParam = this.queryForm.queryParam
                    this.pageNo = 1
                    this.getTeacherList()
                    // }
                }
            })
        },

        // 更新老师按钮
        updateTeacherBtn(row) {
            if (row.teacherId) {
                this.dialogTitle = '编辑老师信息'
                this.dialogInfo.teacherId = row.teacherId
                this.dialogInfo.teacherName = row.teacherName || row.teacherNum
                this.dialogInfo.mobile = row.teacherMobile
            } else {
                this.dialogTitle = '新增老师'
                this.dialogInfo.teacherName = ''
                this.dialogInfo.mobile = null
            }
            this.isShowDialog = true
        },
        // 分页按钮
        currentChange(pageNo) {
            this.pageNo = pageNo
            this.getTeacherList()
        },
        closeDialog() {
            this.isShowDialog = false
        },
        // 跳转到排课详情
        toDetail(item) {
            this.$router.push(
                `/system/teacher/detail?teacherId=${item.teacherId}`
            )
        },
        // 打开课后单详情页面
        toAfterClassReportDetail(row) {
            let params = {
                teacherId: row.teacherId,
                userName: row.teacherName,
                mobile: row.teacherMobile
            }
            this.$router.push({
                path: 'afterClassReportList',
                query: params
            })
        },
        // 删除老师按钮
        deleteTeacherBtn(row) {
            this.$confirm(
                '删除后需要再给这位老师排课，需要重新新增老师。',
                '确认要删除这位老师信息吗？',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
                .then(() => {
                    this.deletTeacherApi(row.teacherId)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
        },
        async addTeacherInfo(dialogInfo) {
            try {
                this.fullscreenLoading = true
                await teacher.addTeacher(dialogInfo)
                this.fullscreenLoading = false
                this.isShowDialog = false
                this.$message({ type: 'success', message: '新增成功' })
                this.getTeacherList()
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        async editTeacherInfo(dialogInfo) {
            try {
                this.fullscreenLoading = true
                await teacher.updateTeacher(dialogInfo)
                this.fullscreenLoading = false
                this.isShowDialog = false
                this.$message({ type: 'success', message: '编辑成功' })
                this.getTeacherList()
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        async getTeacherList() {
            try {
                this.fullscreenLoading = true
                let queryParams = {
                    page: this.pageNo,
                    limit: this.pageSize,
                    queryParam: this.pagingParams.queryParam
                }
                let { data } = await teacher.queryTeacherInfo(queryParams)
                let tableData = data.list
                this.tableData = tableData.map(item => ({
                    ...item,
                    nextClassTime: item.nextClassTime
                        ? format(item.nextClassTime, 8)
                        : '尚未排课',
                    teacherName: item.teacherName || item.teacherNum,
                    teacherMobile: item.teacherMobile || '/',
                    userName: item.userName || '/',
                    mobile: item.mobile || '/'
                }))
                this.totalCount = data.totalCount
                this.fullscreenLoading = false
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        // 删除老师api
        async deletTeacherApi(teacherId) {
            try {
                this.fullscreenLoading = true
                let params = {
                    teacherId
                }
                await teacher.deleteTeacher(params)
                this.fullscreenLoading = false
                this.$message({ type: 'success', message: '删除成功' })
                this.getTeacherList()
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        // 授权自主排课
        async authorizeClass(row) {
            try {
                this.fullscreenLoading = true

                let params = {
                    mobile: row.teacherMobile,
                    status: row.autoClass
                }
                let data = await teacher.authorizeClass(params)
                this.fullscreenLoading = false
                if (data.code === 200) {
                    if (row.autoClass === 1 && row.inviteUser === 0) {
                        let params = {
                            inviteUser: row.inviteUser === 0 ? 1 : 0,
                            teacherId: row.teacherId
                        }
                        this.inviteStudent(params);
                    } else {
                        this.$message({ type: 'success', message: '操作成功' })
                        this.getTeacherList()
                    }
                } else {
                    this.$message({ type: 'danger', message: data.msg })
                }
            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },
        // 邀请学员
        async inviteStudent(row) {
            try {
                this.fullscreenLoading = true

                let params = {
                    teacherId: row.teacherId,
                    isOpen: row.inviteUser
                }
                let data = await teacher.authInviteUser(params);
                this.fullscreenLoading = false
                if (data.code === 200) {
                    this.$message({ type: 'success', message: '操作成功' })
                    this.getTeacherList()
                } else {
                    this.$message({ type: 'danger', message: data.msg })
                }

            } catch (e) {
                this.fullscreenLoading = false
                return e
            }
        },

        /**
         * @description     批量处理
         */
        gotoBatchImport () {
            // 上传状态设为未上传
            this.importStatus = 0;
            this.errorList = [];
            this.importDialogShow = !0;
        },
        /**
         * @description     关闭上传窗口
         */
        closeImportDialog () {
            if (this.importStatus === 1) {
                return;
            }
            // 上传状态设为未上传
            this.importStatus = 0;
            this.errorList = [];
            this.batchImportData = [];
            this.importDialogShow = !1;
            this.$refs.$batchImport.value = '';
        },
        /**
         * @description     准备导入操作
         */
        readyBatchImport (e) {
            this.$refs.$batchImport.click();
        },
        /**
         * @description     excel数据转换为json
         * @param       {Array}     files
         */
        excel2Json (files = [], callback = f => f) {
            
            // let target = e.target;
            let wb = '';
            let rABS = false;
            // let files = target.files;
            if (!files.length) {
                return;
            }
            let file = files[0];
            // this.fileName = file.name;
            // eventBus.$emit('fileCheckData', {fileName: f.name});
            let reader = new FileReader();
            // let _this = this
            reader.onload = (e) => {
                let data = e.target.result;
                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary',
                        raw: true
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                console.log(json)
                // if(json && json.length) {
                //     json.shift();
                //     this.importStatus = !0;
                // }
                
                
                if (json.length > 200) {
                    // this.importStatus = !1;
                    this.$message({ message: '单次最多200条', type: 'warning' });
                    return;
                } 
                this.batchImportData = json;
                callback(json);
            }
            if (rABS) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsBinaryString(file);
            }
            
        },
    }
}
</script>
<style lang='less'>
.teacher-list-wrapper {
    .teacher-list-query-form-wrapper {
        .el-form-item {
            margin-bottom: 0;
        }
    }
}
</style>

<style lang='less' scoped>
.teacher-list-wrapper {
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
    .edit-teacher-btn {
        margin-right: 10px;
    }
}
.import-dialog {
    .bd {
        width: 100%;
    }
    .info {
        .content {
            // display: flex;
        }
        
        .title {
            margin: 0 0 10px;
            font-size: 16px;
            font-weight: 600;
        }
        .msg {
            .conflict {
                margin: 0 2px;
                font-weight: 600;
                color: #409eff;
            }
        }
    }
    .footer {
        // display: flex;
        // justify-content: flex-end;
        height: 30px;
        .toolbar {
            display: flex;
            justify-content: flex-end;
        }
        .btn-cancel, 
        .btn-ok {
            margin: 0 0 0 5px;
            // padding: 5px 10px;
            width: 60px;
            line-height: 30px;
            background-color: #409eff;
            border-radius: 4px;
            cursor: pointer;
            color: #fff;
        }
        .btn-cancel {
            background-color: #fff;
            border: 1px solid #ddd;
            color: #666;
        }
        .btn-import {
            display: none;
        }
    }

    .btn-download {
        display: inline-block;
        margin: 0 0 0 5px;
        padding: 0 5px;
        background-color: #409eff;
        border-radius: 3px;
        line-height: 20px;
        font-size: 13px;
        color: #fff;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
    }
    .error-box {
        padding: 10px;
        min-height: 50px;
        max-height: 200px;
        background-color: #f6f6f6;
        overflow-y: auto;
    }
    .error-list {
        li {
            // margin: 0 0 5px;
            padding: 0 10px;
            line-height: 28px;
            border-bottom: #ddd dashed 1px;
            background-color: #fff;
        }
    }
}
        
</style>
