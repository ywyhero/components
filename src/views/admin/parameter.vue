<template>
    <div class="parameter"
        v-loading.fullscreen.lock="loading">
        <div class="parameter-header">
        <el-button type="primary" size="small" @click="addDict">新增</el-button>
        </div>
        <div class="parameter-main">
           <el-table v-if="dataList.length > 0" :data="dataList" border style="width: 100%;">
                <el-table-column prop="id" width="80" label="ID"></el-table-column>
                <table-tree-column
                prop="dataValue"
                treeKey="dataCode"
                parentKey="pcode"
                width="150"
                label="名称"
                ></table-tree-column>
                <el-table-column
                prop="orderNum"
                label="排序号">
                </el-table-column>
                <el-table-column
                prop="createTime"
                label="创建时间">
                </el-table-column>
                 <el-table-column
                prop="updateTime"
                label="修改时间">
                </el-table-column>
                <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button
                    type="text"
                    class="parameter-handle-edit"
                    @click="addOrUpdateHandle(scope.row)"
                    >修改</el-button>
                    <el-button
                    class="parameter-handle-delete"
                    type="text"
                    @click="deleteHandle(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <parameter-dialog
         v-if="dictSelectLists.length > 0" 
        :title="title" 
        :isShow="isShow" 
        :data="dictSelectLists"
        :parameterVal="dataValue"
        :parameterId="preParameterId"
        :preParameterVal="preParameter"
        :parameterDataCode="dataCode"
        :parameterDataType="dataType"
        :pId="pId"
        :id="id"
        :orderNum="orderNum"
        @changeDataType="changeDataType"
        @changeDataCode="changeDataCode"
        @changeDataValue="changeDataValue"
        @nodeClick="nodeClick"
        @changeOrder="changeOrder"
        @addParameter="addNewParameter"
        @editParameter="editParameter"
        @closeDialog="closeDialog"></parameter-dialog>
    </div>
</template>
<script>
import TableTreeColumn from "./../../components/table-tree-column/index";
import parameterDialog from './../../components/userDialog/parameterDialog'
import {admin} from './../../service/index'
import { treeDataTranslate } from './../../util/index'
import { format } from './../../util//time'
export default {
    name: 'parameter',
    components: {
        parameterDialog,
        TableTreeColumn
    },
    data() {
        return {
            title: '', // 弹框头部名称
            isShow: false, // 是否显示弹框
            dataList: [], // 字典列表
            dictSelectLists: [], // 字典选择列表
            preParameter: '', // 上一级字典
            preParameterId: '', // 上一级字典id
            pId: '', // 上一级字典的datacode
            id: 0, // 当前修改的字典id
            orderNum: 0, // 排序号
            dataCode: '', // 当前字典的dataCode
            dataValue: '', // 当前字典的名称
            dataType: '', // 当前的数据类型
            loading: false // 是否显示loading
        }
    },
    created () {
        this.getDictList()
        this.getDictSelectLists()
    },
    // 面包屑
    beforeRouteEnter(to, from, next) {
        next(vm=>{
            vm.routeList = to.meta.routeList.length > 1 ? to.meta.routeList.splice(0, to.meta.routeList.length - 1) : to.meta.routeList
        })
    },
    methods: {
        async getDictList(){
            try{
                let {data} = await admin.dictLists()
                this.dataList = treeDataTranslate(data, "dataCode", "pcode")
                this.dataList = this.formatTime(this.dataList)
            }catch(e){
                return e
            }
        },
        // 处理时间
        formatTime(arr) {
            for(let i = 0; i < arr.length; i++) {
                if(arr[i].kids) {
                  this.formatTime(arr[i].kids)
                }
                arr[i].createTime = format(arr[i].createTime, 8)
                arr[i].updateTime = format(arr[i].updateTime, 8)
            }
            return arr
        },
        async getDictSelectLists() {
            try{
                let {data} = await admin.dictSelectLists()
                this.dictSelectLists = treeDataTranslate(data, "dataCode", "pcode");
            }catch(e){
                return e
            }
        },
        async addDict() {
            this.loading = true
            await this.getDictSelectLists()
            this.title = "新增";
            this.isShow = true;
            this.preParameter = this.dictSelectLists[0].dataValue
            this.pId = this.dictSelectLists[0].dataCode
            this.preParameterId = this.dictSelectLists[0].pcode
            this.dataValue = ''
            this.dataCode = ''
            this.dataType = ''
            this.orderNum = 0
            this.loading = false
        },
        changeDataType(e){
            this.dataType = e.value
        },
        changeDataCode(e){
            this.dataCode = e.value
        },
        changeDataValue(e){
            this.dataValue = e.value
        },
        addOrUpdateHandle(item) {
            this.isShow = true
            this.title = "修改";
            this.dataValue = item.dataValue
            this.preParameterId = item.pcode
            this.preParameter = item.parentValue ? item.parentValue  : '一级字典'
            this.orderNum = item.orderNum
            this.dataCode = item.dataCode
            this.dataType = item.dataType
            this.id = item.id
        },
        nodeClick(e) {
            this.preParameter = e.value
            this.pId = e.pId
            this.preParameterId = e.preParameterId
        },
        changeOrder(e) {
            this.orderNum = e.value
        },
        async addNewParameter(e) {
            try{
                await admin.dictSave({
                    "pcode": this.pId,
                    "dataType": this.dataType,
                    "dataCode": this.dataCode,
                    "dataValue": this.dataValue,
                    "orderNum": e.num,
                })
                this.getDictList()
                this.isShow = false
            }catch(e){
                return e
            }
        },
        async editParameter(item) {
            try{
                await admin.editDict({
                    id: item.id,
                    pcode: this.preParameterId,
                    dataType: this.dataType,
                    dataCode: this.dataCode,
                    dataValue: this.dataValue,
                    orderNum: item.num,
                })
                this.getDictList()
                this.isShow = false
            }catch(e){
                return e
            }
        },
        async deleteDict(item) {
            await admin.deleteDict({
                id: item.id
            })
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            this.getDictList()
        },
        deleteHandle(item) {
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteDict(item)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        closeDialog(e) {
            this.isShow = e.currentShow
        }
    }
}
</script>
<style lang="less" scoped>
.parameter{
    height: 100%;
    display: flex;
    flex-direction: column;
    .parameter-header{
        margin-bottom: 20px;
        .parameter-search{
            width: 180px;
            margin-right: 20px;
        }
    }
    .parameter-main{
        flex: 1;
        overflow-y: auto;
    }
    .parameter-handle{
        display: flex;
        .parameter-handle-edit{
            color: #409eff;
            cursor: pointer;
            margin-right: 10px;
        }
        .parameter-handle-delete{
            color: #f56c6c;
            cursor: pointer;
        }
    }
    .parameter-pagination{
        height: 40px;
        text-align: right;
        line-height: 40px;
        margin-top: 15px;
    }
}

</style>
