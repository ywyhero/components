<template>
    <div class="menu-dialog" v-show="isShow">
        <div class="menu-dialog-box">
            <div class="menu-dialog-title">{{title}}</div>
            <div class="menu-dialog-main">
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        类型
                    </span>
                    <div class="menu-dialog-radios">
                        <el-radio-group v-model="radio" @change="changeType">
                            <el-radio :label="0">目录</el-radio>
                            <el-radio :label="1">菜单</el-radio>
                            <el-radio :label="2">按钮</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        <i class="menu-dialog-i">*</i>
                        菜单名称
                    </span>
                    <el-input v-model="menuName" @change="changeMenuName" class="menu-dialog-input" placeholder="菜单名称"></el-input>
                </div>
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        <i class="menu-dialog-i">*</i>
                        上级菜单
                    </span>
                    <div class="menu-dialog-input menu-dialog-model-input" @click="showTree">{{preMenu}}</div>
                    <div v-show="isShowTree" class="menu-dialog-tree">
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
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        <i class="menu-dialog-i">*</i>
                        菜单路由
                    </span>
                    <el-input v-model="menuRouter" @change="changeMenuRouter" class="menu-dialog-input" placeholder="菜单路由"></el-input>
                </div>
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        授权标识
                    </span>
                    <el-input v-model="menuTag" @change="changeMenuTag" class="menu-dialog-input" placeholder="多个用逗号分割"></el-input>
                </div>
                <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        排序号
                    </span>
                    <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="0" :max="1000"></el-input-number>
                </div>
                <!-- <div class="menu-dialog-list">
                    <span class="menu-dialog-val">
                        菜单图标
                    </span>
                    <el-input v-model="menuName" class="menu-dialog-input" placeholder="菜单图标名称"></el-input>
                </div> -->
            </div>
            <div class="menu-dialog-btns">
                <el-button size="small" @click="cancle">取消</el-button>
                <el-button size="small" type="primary" @click="sure">确认</el-button>
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
        typeRadio: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            default: ''
        },
        menuVal: {
            type: String,
            default: ''
        },
        menuUrl: {
            type: String,
            default: ''
        },
        tag: {
            type: String,
            default: ''
        },
        orderNum: {
            type: Number,
            default: 0
        },
        prePMenuId: {
            type: Number,
            default: 0
        },
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            menuName: '',
            radio: 0,
            num: 0,
            preMenu: '',
            menuRouter: '',
            menuTag: '',
            currentShow: false,
            defaultProps: {
                children: 'kids',
                label: 'name'
            },
            isShowTree: false,
            preMenuId: 0
        }
    },
    watch: {
        typeRadio(newVal) {
            this.radio = newVal
        },
        name(newVal) {
            this.menuName = newVal
        },
        menuVal(newVal) {
            this.preMenu = newVal
        },
        menuUrl(newVal) {
            this.menuRouter = newVal
        },
        tag(newVal) {
            this.menuTag = newVal
        },
        orderNum(newVal) {
            this.num = newVal
        },
        prePMenuId(newVal) {
            this.preMenuId = newVal
        },
    },
    methods: {
        nodeClick(obj){
            this.preMenu = obj.name
            this.preMenuId = obj.id
            this.isShowTree = false
            this.$emit('nodeClick', {
                value: obj.name,
                id: obj.id
            })
        },
        changeType(val) {
            this.$emit('changeType', {
                value: val
            })
        },
        changeMenuName(val) {
            this.$emit('changeMenuName', {
                value: val
            })
        },
        changeMenuRouter(val) {
            this.$emit('changeMenuRouter', {
                value: val
            })
        },
        changeMenuTag(val) {
            this.$emit('changeMenuTag', {
                value: val
            })
        },
        handleChange(val) {
            this.$emit('changeOrder', {
                value: val
            })
        },
        showTree() {
            this.isShowTree = !this.isShowTree
        },
        sure() {
            if(this.menuName === '') {
                this.$message({
                    type: 'error',
                    message: '菜单名称不能为空'
                })
                return
            }
            if(this.menuRouter === '') {
                this.$message({
                    type: 'error',
                    message: '菜单路由不能为空'
                })
                return
            }
            if(this.title === '新增') {
                this.$emit('addMenu', {
                    typeRadio: this.radio,
                    menuName: this.menuName,
                    preMenu: this.preMenu,
                    menuRouter: this.menuRouter,
                    menuTag: this.menuTag,
                    num: this.num,
                    preMenuId: this.preMenuId
                })
            } else if (this.title === '修改') {
                this.$emit('editMenu', {
                    id: this.id,
                    typeRadio: this.radio,
                    menuName: this.menuName,
                    preMenu: this.preMenu,
                    menuRouter: this.menuRouter,
                    menuTag: this.menuTag,
                    num: this.num,
                    preMenuId: this.preMenuId
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
.menu-dialog{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .3);
    z-index: 99;
    .menu-dialog-box{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 4px;
        background: #fff;
        .menu-dialog-title{
            line-height: 24px;
            font-size: 18px;
            color: #303133;
        }
        .menu-dialog-main{
            padding: 30px 20px;
            color: #606266;
            line-height: 24px;
            font-size: 14px;
            .menu-dialog-list{
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                .menu-dialog-val{
                    display: flex;
                    justify-content: flex-end;
                    margin-right: 20px;
                    width: 72px;
                    .menu-dialog-i{
                        color: red;
                    }
                }
                .menu-dialog-model-input{
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
                .menu-dialog-input{
                    width: 774px;
                    height: 36px;
                    line-height: 36px;
                }
                .menu-dialog-tree{
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
        .menu-dialog-btns{
            padding-right: 20px;
            text-align: right;
        }
    }
}

</style>

