<template>
    <div class="user-score" v-if="scoreShow">
        <div class="user-score-box">
            <el-form
                :model="ruleForm"
                :rules="rules"
                label-width="78px"
                ref="ruleForm"
                label-position="left"
            >
                <div class="user-score-title">请填写{{title}}操作信息</div>
                <div class="user-score-info">
                    <span class="user-score-val">
                        您正在操作
                        <span
                            class="user-score-name"
                        >{{`${userInfo.studentName}-${userInfo.studentId}`}}</span>
                        的{{title}}
                    </span>
                    <div class="user-score-current" v-if="title === '积分'">
                        <span class="user-score-current-val">
                            当前积分值为:
                            <span class="user-score-current-num">{{userInfo.yxPoints}}</span>
                        </span>
                        <span class="user-score-current-val">
                            当前冻结积分值为:
                            <span class="user-score-current-num">{{userInfo.djPoints}}</span>
                        </span>
                    </div>
                </div>
                <div class="user-score-main">
                    <el-form-item label="操作内容">
                        <el-radio-group v-model="ruleForm.radio" @change="changeRadio">
                            <el-radio
                                v-for="(item, index) in scoreRadios"
                                :key="index"
                                :label="item.key"
                            >{{item.value}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="操作原因" prop="reason">
                        <el-select
                            v-model="ruleForm.reason"
                            @change="changeReason"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in reasonData"
                                :key="item.reasonId"
                                :label="item.reason"
                                :value="item.reasonId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作值" prop="score">
                        <el-input
                            maxlength="10"
                            @change="changeScore"
                            v-model.number="ruleForm.score"
                            placeholder="请输入内容"
                            suffix-icon="el-icon-date"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="操作备注" prop="remark">
                        <el-input
                            maxlength="500"
                            @change="changeRemarks"
                            v-model="ruleForm.remarks"
                            type="textarea"
                            resize="none"
                            placeholder="请输入内容"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="user-score-btns">
                    <el-button @click="scoreCancle" size="small">取消</el-button>
                    <el-button type="primary" size="small" @click="submitForm('ruleForm')">确定</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: '积分'
        },
        scoreShow: {
            type: Boolean,
            default: false
        },
        scoreRadios: {
            type: Array
        },
        scoreRadio: {
            type: Number,
            default: 0
        },
        userInfo: {
            type: Object
        },
        reasonVal: {
            // eslint-disable-next-line
            type: String | Number
        },
        scoreVal: {
            // eslint-disable-next-line
            type: String | Number
        },
        remarksVal: {
            type: String,
            default: ''
        },
        reasonData: {
            type: Array
        }
    },
    data() {
        return {
            ruleForm: {
                radio: 1,
                reason: '',
                score: 0,
                remarks: '',
            },
            rules: {
                reason: [
                    { required: true, message: '请选择操作原因', trigger: 'change' }
                ],
                score: []
            },
            title: '积分'
        }
    },
    watch: {
        scoreRadio(newVal) {
            if (this.title === '积分') {
                this.scoreRules(newVal)
            }
            this.ruleForm.radio = newVal
        },
        reasonVal(newVal) {
            this.ruleForm.reason = newVal
        },
        scoreVal(newVal) {
            this.ruleForm.score = isNaN(Number(newVal)) ? newVal : Number(newVal)
        },
        remarksVal(newVal) {
            this.ruleForm.remarks = newVal
        },
        type(newVal) {
            this.title = newVal
            this.changeRules()
        },
        scoreShow() {
            if (!this.scoreShow) {
                this.$refs.ruleForm.resetFields();
            }
        }
    },
    created() {
        this.changeRules()
    },
    methods: {
        changeRules() {
            if (this.title === '成长值') {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (Number(value) <= 0 || Number(value) > 1000) {
                                callback(new Error('增加成长值范围为1-1000'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            } else {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (Number(value) <= 0 || Number(value) > 10000) {
                                callback(new Error('增加积分范围为1-10000'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    },
                ]
            }
        },
        scoreCancle() {
            this.$refs['ruleForm'].resetFields();
            this.$emit('closeDialog', {
                currentShow: false
            })
        },
        scoreRules(val) {
            if (val === 1) {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (Number(value) <= 0 || Number(value) > 10000) {
                                callback(new Error('增加积分范围为1-10000'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            } else if (val === 2) {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (this.userInfo.yxPoints === 0) {
                                callback(new Error(`无可减少积分`));
                            } else if ((Number(value) <= 0 || Number(value) > this.userInfo.yxPoints) && this.userInfo.yxPoints > 0) {
                                callback(new Error(`减少范围为1-${this.userInfo.yxPoints}`));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            } else if (val === 3) {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (this.userInfo.yxPoints === 0) {
                                callback(new Error(`无可冻结积分`));
                            } else if (Number(value) <= 0 || Number(value) > this.userInfo.yxPoints) {
                                callback(new Error(`冻结积分范围为1-${this.userInfo.yxPoints}`));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            } else if (val === 4) {
                this.rules.score = [
                    { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                    {                        validator: (rule, value, callback) => {
                            if (this.userInfo.djPoints === 0) {
                                callback(new Error(`无可解冻积分`));
                            } else if (Number(value) <= 0 || Number(value) > this.userInfo.djPoints) {
                                callback(new Error(`解冻积分范围为1-${this.userInfo.djPoints}`));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'                    }
                ]
            }
        },
        changeRadio(val) {
            this.$refs['ruleForm'].resetFields();
            this.ruleForm.radio = val
            if (this.type === '成长值') {
                if (val === 2) {
                    this.rules.score = [
                        { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                        {                            validator: (rule, value, callback) => {
                                if (Number(value) <= 0 || Number(value) > 1000) {
                                    callback(new Error('增加成长值范围为1-1000'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'                        },
                    ]
                } else {
                    this.rules.score = [
                        { type: 'number', required: true, message: '请填入操作值(必须为数字类型)', trigger: 'blur' },
                        {                            validator: (rule, value, callback) => {
                                if (Number(value) <= 0) {
                                    callback(new Error('减少成长值必须大于0'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'                        },
                    ]
                }
            } else {
                this.scoreRules(val)
            }

            this.$emit('changeRadio', {
                radio: val
            })
        },
        changeReason(val) {
            this.$emit('changeReason', {
                value: val
            })
        },
        changeScore(val) {
            this.$emit('changeScore', {
                value: isNaN(Number(val)) ? val : Number(val)
            })
        },
        changeRemarks(val) {
            this.$emit('changeRemarks', {
                value: val
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.type === '积分') {
                        this.$emit('sure', {
                            obj: this.ruleForm
                        })
                    } else {
                        this.$emit('growthSure', {
                            obj: this.ruleForm
                        })
                    }

                } else {
                    return false;
                }
            });
        },
    }
}
</script>
<style lang="less">
.user-score {
    .el-input__prefix,
    .el-input__suffix {
        color: #ffffff;
    }
    .el-input,
    .el-textarea {
        width: auto;
    }
}
</style>
<style lang="less" scoped>
.user-score {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
    .user-score-box {
        width: 580px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background: #fff;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        .user-score-title {
            font-size: 18px;
            font-weight: 700;
            color: #606266;
            margin-bottom: 20px;
        }
        .user-score-info {
            margin-top: 15px;
            margin-bottom: 10px;
            font-size: 15px;
            .user-score-name {
                color: #f56c6c;
                font-weight: 700;
            }
            .user-score-current {
                margin-top: 5px;
                display: flex;
                .user-score-current-val {
                    margin-right: 40px;
                }
                .user-score-current-num {
                    font-weight: 700;
                }
            }
        }
        .user-score-main {
            display: flex;
            flex-direction: column;
        }
        .user-score-btns {
            text-align: right;
        }
    }
}
</style>
