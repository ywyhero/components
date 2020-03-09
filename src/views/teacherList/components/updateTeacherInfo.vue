<template>
    <el-dialog
        :title="title"
        :visible.sync="isShow"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
        :before-close="closeDialog"
        v-if="isShow"
        width="40%"
    >
        <el-form
            ref="dialogInfo"
            :model="dialogInfo"
            :rules="rules"
            label-position="top"
            class="update-teacher-dialog"
        >
            <el-form-item label="请输入老师手机号" prop="mobile" required>
                <el-input
                    v-model.trim="dialogInfo.mobile"
                    placeholder="请输入老师手机号"
                    maxlength="11"
                    clearable
                    @input="changeMobile"
                    :disabled="!teacherPermission"
                ></el-input>
            </el-form-item>
            <el-form-item label="请输入老师昵称" prop="teacherName" required>
                <el-input
                    v-model.trim="dialogInfo.teacherName"
                    placeholder="请输入老师昵称"
                    type="text"
                    maxlength="19"
                    @input="changeName"
                    clearable
                ></el-input>
            </el-form-item>
        </el-form>
        <el-link type="primary" :underline="false" @click="resetPassword" v-if="isEdit && teacherPermission">重置密码</el-link>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog">取 消</el-button>
            <el-button size="small" type="primary" @click="confirmBtn" :loading="submitLoading">提 交</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { teacher } from '../../../service'
import { mapGetters } from 'vuex'
export default {
    name: 'updateTeacherInfo',
    components: {},
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '新增老师'
        },
        info: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            dialogInfo: {
                mobile: '',
                teacherName: ''
            },
            rules: {
                mobile: [
                    {
                        required: true,
                        message: '请输入老师手机号'
                    },
                    {
                        min: 11,
                        max: 11,
                        message: '请输入正确手机号'
                    }
                ],
                teacherName: [
                    {
                        required: true,
                        message: '请输入老师昵称'
                    },
                    {
                        validator: this.VALIDATE.checkName
                    }
                ]
            },
            submitLoading: false
        }
    },
    watch: {
        isShow() {
            if (this.isShow) {
                for (let key in this.info) {
                    this.dialogInfo[key] = this.info[key]
                }
            } else {
                this.$refs.dialogInfo.resetFields()
            }
        }
    },
    computed: {
        isEdit() {
            return this.title === '编辑老师信息'
        },
        ...mapGetters({
            userPermission: 'userPermission'
        }),
        teacherPermission() {
            return this.userPermission && this.userPermission['teacher.addStu.btn']
        }
    },
    created() {},
    mounted() {},
    methods: {
        changeMobile(value) {
            this.dialogInfo.mobile = value.replace(/[^0-9]/g, '')
        },
        changeName(value) {
            this.dialogInfo.teacherName = value.replace(
                /[^a-zA-Z0-9\u4e00-\u9fe5]/g,
                ''
            )
        },
        closeDialog() {
            this.$emit('closeDialog')
        },
        confirmBtn() {
            this.$refs.dialogInfo.validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    if (this.title === '新增老师') {
                        // 新建老师接口
                        this.addTeacherInfo()
                    } else if (this.title === '编辑老师信息') {
                        //编辑老师接口
                        this.editTeacherInfo()
                    }
                    this.submitLoading = false
                }
            })
        },
        // 重置密码
        async resetPassword() {
            try {
                await teacher.resetPassword({
                    teacherId: this.dialogInfo.teacherId
                })
                this.$message({ type: 'success', message: '密码已成功重置为123456' })
            } catch (e) {
                return e
            }
        },
        async addTeacherInfo() {
            try {
                await teacher.addTeacher(this.dialogInfo)
                this.$message({ type: 'success', message: '新增成功' })
                this.closeDialog()
                this.$emit('getTeacherList')
            } catch (e) {
                return e
            }
        },
        async editTeacherInfo() {
            try {
                await teacher.updateTeacher(this.dialogInfo)
                this.$message({ type: 'success', message: '编辑成功' })
                this.closeDialog()
                this.$emit('getTeacherList')
            } catch (e) {
                return e
            }
        },
    }
}
</script>
<style lang="less">
.update-teacher-dialog {
    .el-input,
    .el-textarea {
        width: 200px;
    }
}
</style>