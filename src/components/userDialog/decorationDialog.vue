<template>
    <div class="decoration-dialog" v-show="isShow">
        <div class="decoration-dialog-box">
            <el-form
                :model="medalForm"
                :validate-on-rule-change="false"
                :rules="medalRules"
                ref="medalForm"
                label-width="110px"
            >
                <span class="decoration-dialog-title">请填写{{title}}</span>
                <div class="decoration-dialog-main">
                    <el-form-item label="勋章名称" prop="nameVal" v-show="title !== '删除备注'">
                        <el-select
                            v-model="medalForm.nameVal"
                            @change="changeName"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in nameData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="reason" prop="reasonValue">
                        <el-select
                            v-model="medalForm.reasonValue"
                            @change="changeReason"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.reasonId"
                                :label="item.reason"
                                :value="item.reasonId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="remarks">
                        <el-input
                            v-model="medalForm.remarksValue"
                            @change="changeRemarks"
                            maxlength="500"
                            placeholder="请输入备注"
                            type="textarea"
                            resize="none"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="decoration-dialog-btns">
                    <el-button size="small" @click="closeDialog">取消</el-button>
                    <el-button type="primary" size="small" @click="medalSure('medalForm')">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        reason: {
            type: String,
            default: '发放勋章原因'
        },
        reasonVal: {
            // eslint-disable-next-line
            type: Number | String,
            default: ''
        },
        remarks: {
            type: String,
            default: '发放勋章备注'
        },
        options: {
            type: Array
        },
        isShow: {
            type: Boolean,
            default: false
        },
        remarksVal: {
            type: String,
            default: ''
        },
        medalName: {
            // eslint-disable-next-line
            type: String | Number,
            default: ''
        },
        nameData: {
            type: Array
        }
    },
    watch: {
        title(newVal) {
            if (newVal === '发放勋章信息') {
                this.medalForm.nameVal = ''
                this.medalRules = {
                    nameVal: [
                        { required: true, message: '请选择勋章名称', trigger: 'change' }
                    ],
                    reasonValue: [
                        { required: true, message: `请选择${this.reason}`, trigger: 'change' }
                    ]
                }
            } else {
                this.medalRules = {
                    reasonValue: [
                        { required: true, message: `请选择${this.reason}`, trigger: 'change' }
                    ]
                }
            }
        },
        reasonVal(newVal) {
            this.medalForm.reasonValue = newVal
        },
        remarksVal(newVal) {
            this.medalForm.remarksValue = newVal
        },
        medalName(newVal) {
            this.medalForm.nameVal = newVal
        }
    },
    data() {
        return {
            medalForm: {
                nameVal: '',
                reasonValue: '',
                remarksValue: ''
            },
            medalRules: {}

        }
    },
    methods: {
        closeDialog() {
            this.$refs['medalForm'].resetFields();
            this.$emit('closeDialog', {
                currentShow: false
            })
        },
        medalSure(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.title === '删除备注') {
                        this.$emit('deleteSure', {
                            obj: this.medalForm
                        })
                    } else {
                        this.$emit('sendSure', {
                            obj: this.medalForm
                        })
                    }

                } else {
                    return false;
                }
            });
        },
        changeName(val) {
            this.$emit('changeName', {
                value: val
            })
        },
        changeReason(val) {
            this.$emit('changeReason', {
                value: val
            })
        },
        changeRemarks(val) {
            this.$emit('changeRemarks', {
                value: val
            })
        }
    },
}
</script>
<style lang="less">
.decoration-dialog {
    .el-input,
    .el-textarea {
        width: auto;
    }
}
</style>
<style lang="less" scoped>
.decoration-dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
    .decoration-dialog-box {
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        .decoration-dialog-title {
            font-size: 18px;
            font-weight: 700;
            color: #606266;
        }
        .decoration-dialog-main {
            display: flex;
            flex-direction: column;
            margin-top: 15px;
        }
        .decoration-dialog-btns {
            text-align: right;
        }
    }
}
</style>
