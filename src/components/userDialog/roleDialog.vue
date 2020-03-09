<template>
    <div class="role-dialog" v-show="isShow">
        <div class="role-dialog-box">
            <div class="role-dialog-title">{{title}}</div>
            <div class="role-dialog-main">
                <div class="role-dialog-list">
                    <span class="role-dialog-val">
                        <i class="role-dialog-i">*</i>
                        角色名称
                    </span>
                    <el-input
                        @change="changeRoleName"
                        v-model="name"
                        class="role-dialog-input"
                        placeholder="角色名称"
                    ></el-input>
                </div>
                <div class="role-dialog-list">
                    <span class="role-dialog-val">备注</span>
                    <el-input
                        @change="changeRemark"
                        v-model="remark"
                        class="role-dialog-input"
                        placeholder="备注"
                    ></el-input>
                </div>
                <div class="role-dialog-auth">
                    <span class="role-dialog-val">授权</span>
                    <el-tree
                        ref="tree"
                        :data="data"
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="defaultKeys"
                        :default-checked-keys="defaultChecked"
                        :props="defaultProps"
                        @check="check"
                    ></el-tree>
                </div>
            </div>
            <div class="role-dialog-btns">
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
        roleName: {
            type: String,
            default: ''
        },
        roleRemark: {
            type: String,
            default: ''
        },
        data: {
            type: Array
        },
        defaultChecked: {
            type: Array
        },
        id: {
            type: Number,
            default: 0
        }
    },
    watch: {
        isShow(newVal) {
            if (newVal) {
                this.$refs.tree.setCheckedKeys(this.defaultChecked)
                this.checkedKeys = this.defaultChecked;
                this.halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
            }
        },
        roleName(newVal) {
            this.name = newVal
        },
        roleRemark(newVal) {
            this.remark = newVal
        },
        data(newVal) {
            this.defaultKeys = this.getDefaultKeys(newVal)
        }

    },
    data() {
        return {
            name: '',
            remark: '',
            defaultProps: {
                children: 'kids',
                label: 'name'
            },

            defaultKeys: [],
            halfCheckedKeys: [],
        }
    },
    methods: {
        getDefaultKeys(arr) {
            let defaultKeys = []
            arr.forEach(v => {
                if (v.kids) {
                    let kidArr = v.kids;
                    kidArr.forEach(i => {
                        defaultKeys.push(i.id)
                    })
                }
            })
            return defaultKeys
        },
        changeRoleName(val) {
            this.$emit('changeRoleName', {
                value: val
            })
        },
        changeRemark(val) {
            this.$emit('changeRemark', {
                value: val
            })
        },
        sure() {
            if (this.title === '新增') {
                this.$emit('addRole', {
                    roleName: this.name,
                    roleMark: this.remark,
                    menuIdList: this.checkedKeys,
                    halfMenuIdList: this.halfCheckedKeys
                })
            } else if (this.title === '修改') {
                this.$emit('editRole', {
                    id: this.id,
                    roleName: this.name,
                    roleMark: this.remark,
                    menuIdList: this.checkedKeys,
                    halfMenuIdList: this.halfCheckedKeys
                })
            }
        },
        cancle() {
            this.$emit('closeDialog', {
                currentShow: false
            })
        },
        check(e, i) {
            this.checkedKeys = i.checkedKeys;
            this.halfCheckedKeys = i.halfCheckedKeys;
        }
    }
}
</script>
<style lang="less" scoped>
.role-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
}
.role-dialog-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    .role-dialog-title {
        line-height: 24px;
        font-size: 18px;
        color: #303133;
    }
    .role-dialog-main {
        padding: 30px 20px;
        color: #606266;
        line-height: 24px;
        font-size: 14px;
        .role-dialog-list {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .role-dialog-val {
                display: flex;
                justify-content: flex-end;
                margin-right: 20px;
                width: 72px;
                .role-dialog-i {
                    color: red;
                }
            }
            .role-dialog-input {
                width: 774px;
                height: 36px;
                line-height: 36px;
            }
        }
        .role-dialog-auth {
            display: flex;
            max-height: 400px;
            overflow-y: auto;
            .role-dialog-val {
                display: inline-block;
                margin-right: 20px;
                width: 72px;
                text-align: right;
            }
        }
    }
    .role-dialog-btns {
        padding-right: 20px;
        text-align: right;
    }
}
</style>
