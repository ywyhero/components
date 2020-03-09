<template>
    <div class="parameter-dialog" v-show="isShow">
        <div class="parameter-dialog-box">
            <div class="parameter-dialog-title">{{title}}</div>
            <div class="parameter-dialog-main">
                <div class="parameter-dialog-list">
                    <span class="parameter-dialog-val">
                        <i class="parameter-dialog-i">*</i>
                        参数名称
                    </span>
                    <el-input v-model="dataValue" @change="changeDataValue" class="parameter-dialog-input" placeholder="参数名称"></el-input>
                </div>
                <div class="parameter-dialog-list">
                    <span class="parameter-dialog-val">
                        <i class="parameter-dialog-i">*</i>
                        上级菜单
                    </span>
                    <div class="parameter-dialog-input parameter-dialog-model-input" @click="showTree">{{preParameter}}</div>
                    <div v-show="isShowTree" class="parameter-dialog-tree">
                        <el-tree
                            class="filter-tree"
                            :data="data"
                            :expand-on-click-node="false"
                            :props="defaultProps"
                            default-expand-all
                            @node-click="nodeClick"
                            >
                        </el-tree>
                    </div>
                </div>
                <div class="parameter-dialog-list">
                    <span class="parameter-dialog-val">
                        <i class="parameter-dialog-i">*</i>
                        数据类型
                    </span>
                    <el-input v-model="dataType" @change="changeDataType" class="parameter-dialog-input" placeholder="数据类型"></el-input>
                </div>
                <div class="parameter-dialog-list">
                    <span class="parameter-dialog-val">
                        <i class="parameter-dialog-i">*</i>
                        数据ID
                    </span>
                    <el-input v-model="dataCode" @change="changeDataCode" class="parameter-dialog-input" placeholder="数据ID"></el-input>
                </div>
                <div class="parameter-dialog-list">
                    <span class="parameter-dialog-val">
                        排序号
                    </span>
                    <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="0" :max="1000"></el-input-number>
                </div>
            </div>
            <div class="parameter-dialog-btns">
                <el-button @click="cancle" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="sure">确认</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '新增'
        },
        isShow: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array
        },
        name: {
            type: String,
            default: ''
        },
        orderNum: {
            type: Number,
            default: 0
        },
        parameterVal: {
            type: String,
            default: ''
        },
        parameterId: {
            type: String,
            default: ''
        },
        pId: {
            type: String,
            default: ''
        },
        parameterDataType: {
            type: String,
            default: ''
        },
        parameterDataCode: {
            type: String,
            default: ''
        },
        preParameterVal: {
            type: String,
            default: ''
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            num: 0,
            preParameter: '',
            preParameterId: '',
            currentShow: false,
            defaultProps: {
                children: 'kids',
                label: 'dataValue'
            },
            isShowTree: false,
            dataCode: '',
            dataValue: '',
            dataType: ''
        }
    },
    watch: {
        orderNum(newVal) {
            this.num = newVal
        },
        preParameterVal(newVal) {
            this.preParameter = newVal
        },
        parameterId(newVal) {
            this.preParameterId = newVal
        },
        parameterDataType(newVal) {
            this.dataType = newVal
        },
        parameterDataCode(newVal) {
            this.dataCode = newVal
        },

        parameterVal(newVal) {
            this.dataValue = newVal
        },
    },
    methods: {
        nodeClick(obj){
            this.preParameter = obj.dataValue
            this.preParameterId = obj.pcode
            this.isShowTree = false
            this.$emit('nodeClick', {
                value: obj.dataValue,
                pId: obj.dataCode,
                preParameterId: obj.pcode
            })
        },
        handleChange(val) {
            this.$emit('changeOrder', {
                value: val
            })
        },
        changeDataValue(val) {
            this.$emit('changeDataValue', { 
                value: val
            })
        },
        changeDataCode(val) {
            this.$emit('changeDataCode', { 
                value: val
            })
        },
        changeDataType(val) {
            this.$emit('changeDataType', { 
                value: val
            })
        },
        showTree() {
            this.isShowTree = !this.isShowTree
        },
        sure() {
            if(this.dataType === '' || this.dataValue === '' || this.dataCode === '') {
                this.$message({
                    type: 'error',
                    message: '有内容没有填写'
                })
                return
            }
            if(this.title === '新增') {
                this.$emit('addParameter', {
                    preParameter: this.preParameter,
                    num: this.num,
                    preParameterId: this.preParameterId,
                })
            } else if (this.title === '修改') {
                this.$emit('editParameter', {
                    id: this.id,
                    preParameter: this.preParameter,
                    num: this.num,
                    preParameterId: this.preParameterId
                })
            }
           
        },
        cancle() {
            this.$emit('closeDialog', {
                currentShow: false
            })
        } 
    }
}
</script>
<style lang="less" scoped>
.parameter-dialog{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 99;
    .parameter-dialog-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 4px;
        background: #fff;
        .parameter-dialog-title{
            line-height: 24px;
            font-size: 18px;
            color: #303133;
        }
        .parameter-dialog-main{
            padding: 30px 20px;
            color: #606266;
            line-height: 24px;
            font-size: 14px;
            .parameter-dialog-list{
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .parameter-dialog-val{
                    display: flex;
                    justify-content: flex-end;
                    margin-right: 20px;
                    width: 72px;
                    .parameter-dialog-i{
                        color: red;
                    }
                }
                .parameter-dialog-model-input{
                    -webkit-appearance: none;
                    background-color: #FFF;
                    background-image: none;
                    border-radius: 4px;
                    border: 1px solid #DCDFE6;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: #606266;
                    display: inline-block;
                    font-size: inherit;
                    height: 40px;
                    line-height: 40px;
                    outline: 0;
                    padding: 0 15px;
                    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
                    width: 100%;
                }
                .parameter-dialog-input{
                    width: 774px;
                    height: 36px;
                    line-height: 36px;
                }
                .parameter-dialog-tree{
                    position: absolute;
                    background: #fff;
                    box-shadow: 0px 2px 10px #f1f1f1;
                    z-index: 99;
                    top: 50px;
                    left: 90px;
                    padding: 10px;
                    border-radius: 4px;
                    max-height: 400px;
                    overflow-y: auto;
                }
            }
        }
        .parameter-dialog-btns{
            padding-right: 20px;
            text-align: right;
        }
    }
}

</style>

