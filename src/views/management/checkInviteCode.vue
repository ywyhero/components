<template>
    <div class="invite-code">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待处理" name="first">
                <div class="invite-code-search">
                    <el-input class="invite-code-search-input" v-model="waitMobile" placeholder="搜索注册手机号"></el-input>
                    <el-button type="primary" @click="waitSearch">搜索</el-button>
                </div>
                <div class="invite-code-table">
                    <el-table
                        :data="waitData"
                        style="100%"
                        @sort-change="waitSortChange"
                        >
                        <el-table-column
                            prop="createDate"
                            sortable
                            label="申请日期"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="organName"
                            label="机构名称">
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            label="负责人姓名">
                        </el-table-column>
                        <el-table-column
                            prop="usertitle"
                            label="负责人职务">
                        </el-table-column>
                        <el-table-column
                            prop="mobile"
                            label="手机号"
                            width="110">
                        </el-table-column>
                        <el-table-column
                            label="大众点评"
                            width="110">
                            <template slot-scope="scope">
                                <div>
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.dianpingUrl">
                                        <el-link type="primary" slot="reference" :underline="false" :href="scope.row.dianpingUrl" target="_blank">短链</el-link>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="可操作时长"
                            prop="day"
                            sortable>
                            <template slot-scope="scope">
                                <div>
                                    <span v-show="scope.row.todoDays > 0" :class="{'warning': scope.row.todoDays === 1}">{{scope.row.todoDays}}个工作日</span>
                                    <span v-show="scope.row.todoDays < 0" class="info">过期</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <div>
                                    <span class="success" @click="passEvent(scope.row.id)" v-show="scope.row.todoDays < 0">补通过</span>
                                    <el-button type="text" v-show="scope.row.todoDays > 0" @click="passEvent(scope.row.id)">通过</el-button>
                                    <el-button type="text" v-show="scope.row.todoDays > 0" @click="refused(scope.row.id)">拒绝</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="invite-code-pagination">
                    <el-pagination
                    @current-change="waitCurrentChange"
                    :page-size="pageSize"
                    :current-page="waitCurrentPage"
                    background
                    layout="total, prev, pager, next"
                    :total="waitTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已处理" name="second">
                <div class="invite-code-search">
                    <el-input class="invite-code-search-input" v-model="disposedMobile" placeholder="搜索注册手机号"></el-input>
                    <el-button type="primary" @click="disposedSearch">搜索</el-button>
                </div>
                <div class="invite-code-table">
                    <el-table
                        :data="disposedData"
                        style="100%"
                        @sort-change="disposedSortChange"
                        >
                        <el-table-column
                            prop="createDate"
                            sortable
                            label="申请日期"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="organName"
                            label="机构名称">
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            label="负责人姓名">
                        </el-table-column>
                        <el-table-column
                            prop="usertitle"
                            label="负责人职务">
                        </el-table-column>
                        <el-table-column
                            prop="mobile"
                            label="手机号"
                            width="110">
                        </el-table-column>
                        <el-table-column
                            label="大众点评"
                            width="110">
                            <template slot-scope="scope">
                                <div>
                                    <el-popover
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.dianpingUrl">
                                        <el-link type="primary" slot="reference" :underline="false" :href="scope.row.dianpingUrl" target="_blank">短链</el-link>
                                    </el-popover>
                                    
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="状态"
                            >
                            <template slot-scope="scope">
                                <div>
                                    <span class="success" v-show="scope.row.status === 1">已通过</span>
                                    <el-popover
                                        v-show="scope.row.status === 2"
                                        placement="top-start"
                                        width="200"
                                        trigger="hover"
                                        :content="scope.row.remark">
                                        <span slot="reference">已拒绝</span>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="auditUser"
                            label="处理人">
                        </el-table-column>
                        <el-table-column
                            prop="updateDate"
                            label="处理日期">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="invite-code-pagination">
                    <el-pagination
                    @current-change="disposedCurrentChange"
                    :page-size="pageSize"
                    :current-page="disposedCurrentPage"
                    background
                    layout="total, prev, pager, next"
                    :total="disposedTotal">
                    </el-pagination>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="过期" name="third">
                <div class="invite-code-search">
                    <el-input class="invite-code-search-input" v-model="overMobile" placeholder="搜索注册手机号"></el-input>
                    <el-button type="primary" @click="overSearch">搜索</el-button>
                </div>
                <div class="invite-code-table">
                    <el-table
                        :data="overData"
                        style="100%"
                        @sort-change="overSortChange"
                        >
                        <el-table-column
                            prop="date"
                            sortable
                            label="申请日期"
                            width="130">
                        </el-table-column>
                        <el-table-column
                            prop="organName"
                            label="机构名称">
                        </el-table-column>
                        <el-table-column
                            prop="username"
                            label="负责人姓名">
                        </el-table-column>
                        <el-table-column
                            prop="jobName"
                            label="负责人职务">
                        </el-table-column>
                        <el-table-column
                            prop="mobile"
                            label="手机号"
                            width="110">
                        </el-table-column>
                        <el-table-column
                            label="大众点评"
                            width="110">
                            <template slot-scope="scope">
                                <div>
                                    <el-link type="primary" :underline="false" :href="scope.row.link" target="_blank">短链</el-link>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            >
                            <template slot-scope="scope">
                                <div>
                                    <el-button type="text" @click="overClick(scope.row.id)">补通过</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="invite-code-pagination">
                    <el-pagination
                    @current-change="overCurrentChange"
                    :page-size="pageSize"
                    :current-page="overCurrentPage"
                    background
                    layout="total, prev, pager, next"
                    :total="overTotal">
                    </el-pagination>
                </div>
            </el-tab-pane> -->
        </el-tabs>
        <div class="invite-code-refuse" v-show="refuseShow">
            <div class="invite-code-refuse-box">
                <div class="invite-code-refuse-header">
                    <span class="invite-code-refuse-title">拒绝理由</span>
                    <span class="el-icon-close invite-code-refuse-close" @click="refuseClose"></span>
                </div>
                <div class="invite-code-refuse-main">
                    <el-checkbox-group class="invite-code-refuse-lists" v-model="checkList">
                        <el-checkbox class="invite-code-refuse-list" label="机构名称与链接不符合"></el-checkbox>
                        <el-checkbox class="invite-code-refuse-list"  label="该职务不符合申请要求"></el-checkbox>
                        <el-checkbox class="invite-code-refuse-list"  label="信息填写不全"></el-checkbox>
                        <el-checkbox class="invite-code-refuse-list"  label="竞品公司"></el-checkbox>
                        <el-checkbox class="invite-code-refuse-list"  label="其他"></el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="invite-code-refuse-btns">
                    <el-button size="small" @click="refuseClose">取消</el-button>
                    <el-button type="primary" size="small" @click="sureClick">确定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {Tabs, TabPane, Table, TableColumn, Input, Button, Link, CheckboxGroup, Checkbox, Popover} from 'element-ui'
import {checkInviteCode} from './../../service/index'
export default {
    data() {
        return {
            activeName: 'first',
            waitMobile: '',
            disposedMobile: '',
            overMobile: '',
            waitData: [],
            disposedData: [],
            overData: [
                {
                    date: '2020-2-26 13:00',
                    organName: 'vip陪练',
                    username: '王豆豆',
                    jobName: '教务',
                    mobile: 13213111111,
                    link: 'abc'
                },{
                    date: '2020-2-26 13:00',
                    organName: 'vip陪练',
                    username: '王豆豆',
                    jobName: '教务',
                    mobile: 13213111111,
                    link: 'abc'
                },
            ],
            waitTotal: 30,
            waitCurrentPage: 1,
            pageSize: 20,
            disposedTotal: 40,
            disposedCurrentPage: 1,
            overTotal: 50,
            overCurrentPage: 1,
            checkList: [],
            refuseShow: false,
            redisedId: '',
            waitOrder: 'desc',
            disposedOrder: 'desc',
            overOrder: 'desc',
        }
    },
    components: {
        'el-tabs': Tabs,
        'el-tab-pane': TabPane,
        'el-table': Table,
        'el-table-column': TableColumn,
        'el-input': Input,
        'el-button': Button,
        'el-link': Link,
        'el-checkbox-group': CheckboxGroup,
        'el-checkbox': Checkbox,
        'el-popover': Popover
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeList =
                to.meta.routeList.length > 1
                    ? to.meta.routeList.splice(0, to.meta.routeList.length - 1)
                    : to.meta.routeList
        })
    },
    created () {
        this.getTodoList()
    },
    methods: {
        // 格式化时间
        formatTime(time) {
            let year = new Date(time * 1000).getFullYear();
            let month = new Date(time * 1000).getMonth() + 1 >= 10 ? new Date(time * 1000).getMonth() + 1 : '0' + (new Date(time * 1000).getMonth() + 1);
            let day = new Date(time * 1000).getDate() < 10 ? '0' + new Date(time * 1000).getDate() : new Date(time * 1000).getDate();
            let week = new Date(time * 1000).getDay() === 0 ? 7 : new Date(time * 1000).getDay();
            let timeStamp = new Date(`${year}/${month}/${day}`).getTime() / 1000;
            let minutes = new Date(time * 1000).getMinutes() < 10 ? '0' + new Date(time * 1000).getMinutes() : new Date(time * 1000).getMinutes();
            let hour = new Date(time * 1000).getHours() < 10 ? '0' + new Date(time * 1000).getHours() : new Date(time * 1000).getHours();
            return {year, month, day, week, timeStamp, hour, minutes}
        },
        // tab切换事件
        handleClick(e) {
            this.waitMobile = ''
            this.disposedMobile = ''
            this.overMobile = ''
            this.waitCurrentPage = 1
            this.disposedCurrentPage = 1
            if(e.name === 'first') {
                this.getTodoList()
            } else if(e.name === 'second') {
                this.getDoneList()
            }
        },
        // 获取未处理的信息
        async getTodoList(sidx='create_time') {
            let { data } = await checkInviteCode.todoList({
                mobile: this.waitMobile,
                sidx: sidx,
                order: this.waitOrder,
                page: this.waitCurrentPage,
                limit: this.pageSize
            })
            this.waitData = data.list.map(v => {
                let {year,month,day, hour, minutes} = this.formatTime(new Date(v.createTime).getTime() / 1000);
                v.createDate = `${year}-${month}-${day} ${hour}:${minutes}`
                return v
            })
            this.waitTotal = data.totalCount
        },
        // 获取已处理的列表
        async getDoneList(sidx='create_time') {
            let { data } = await checkInviteCode.doneList({
                mobile: this.disposedMobile,
                sidx: sidx,
                order: this.disposedOrder,
                page: this.disposedCurrentPage,
                limit: this.pageSize
            })
            this.disposedData = data.list.map(v => {
                let {year,month,day, hour, minutes} = this.formatTime(new Date(v.createTime).getTime() / 1000);
                let updateTime = this.formatTime(new Date(v.updateTime).getTime() / 1000);
                v.createDate = `${year}-${month}-${day} ${hour}:${minutes}`
                v.updateDate = `${updateTime.year}-${updateTime.month}-${updateTime.day} ${updateTime.hour}:${updateTime.minutes}`
                return v
            })
            this.disposedTotal = data.totalCount
        },
        // 获取已过期的列表
        async getOverList() {

        },
        // 待处理排序事件
        waitSortChange(e) {
            if(e.prop === 'day') {
                if(e.order === "descending") {
                    this.waitOrder = 'desc'
                    this.getTodoList(sidx='todoDays')
                } else if(e.order === "ascending") {
                    this.waitOrder = 'asc'
                    this.getTodoList(sidx='todoDays')
                }
            } else {
                if(e.order === "descending") {
                    this.waitOrder = 'desc'
                    this.getTodoList()
                } else if(e.order === "ascending") {
                    this.waitOrder = 'asc'
                    this.getTodoList()
                }
            }
        },
        // 已处理排序事件
        disposedSortChange(e) {
            if(e.order === "descending") {
                this.disposedOrder = 'desc'
                this.getDoneList()
            } else if(e.order === "ascending") {
                this.disposedOrder = 'asc'
                this.getDoneList()
            }
        },
        // 已过期排序事件
        overSortChange(e) {
            if(e.order === "descending") {
                this.overOrder = 'desc'
                this.getOverList()
            } else if(e.order === "ascending") {
                this.overOrder = 'asc'
                this.getOverList()
            }
        },
        // 待处理搜索
        waitSearch() {
            this.waitCurrentPage = 1
            this.getTodoList();
        },
        // 已处理搜索
        disposedSearch() {
            this.disposedCurrentPage = 1
            this.getDoneList()
        },
        // 待处理分页事件
        waitCurrentChange(page) {
            this.waitCurrentPage = page
            this.getTodoList();
        },
        // 已处理分页事件
        disposedCurrentChange(page) {
            this.disposedCurrentPage = page
            this.getDoneList();
        },
        // 已过期分页事件
        overCurrentChange(page) {
            this.overCurrentPage = page
            this.getOverList();
        },
        // 通过审核
        async passEvent(id) {
            await checkInviteCode.pass({
                id: id
            })
            this.$message({
                type: 'success',
                message: '通过审核'
            })
            this.getTodoList()
        },
        // 拒绝审核
        refused(id) {
            this.redisedId = id
            this.refuseShow = true
        },
        
        overClick(id) {},
        //已过期搜索
        overSearch() {
            this.overCurrentPage = 1;
            this.getOverList();
        },
        // 拒绝弹框关闭事件
        refuseClose() {
            this.refuseShow = false
            this.checkList = []
        },
        // 拒绝理由确定事件
        async sureClick() {
            if(this.checkList.length === 0) {
                this.$message({
                    type: 'error',
                    message: '必须选择拒绝理由'
                })
                return
            }
            await checkInviteCode.reject({
                id: this.redisedId,
                rejectList: this.checkList
            })
            this.$message({
                type: 'success',
                message: '审核拒绝成功!'
            })
            this.getTodoList()
            this.refuseShow = false
            this.checkList = []
        }
    }
    
}
</script>
<style lang="less">
    .el-tabs{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .el-tabs__content{
        flex: 1
    }
    .el-tab-pane{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .el-button--text{
        padding: 0 0;
    }
</style>
<style lang="less" scoped>
    .invite-code-search{
        margin-bottom: 20px;
    }
    .invite-code-search-input{
        width: 240px;
        margin-right: 20px;
    }
    .warning{
        color: #F56C6C;
    }
    .success{
        color: #67C23A;
    }
    .info{
        color: #909399;
    }
    .invite-code-table{
        flex: 1;
        overflow-y: auto;
    }
    .invite-code-pagination{
        text-align: right;
        padding-top: 20px;
    }
    .invite-code-refuse{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 999;
        .invite-code-refuse-box{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            border-radius: 4px;
            width: 400px;
        }
        .invite-code-refuse-header{
            display: flex;
            justify-content: space-between;
            .invite-code-refuse-title{
                font-size: 16px;
                color: #303133;
                font-weight: 600;
            }
            .invite-code-refuse-close{
                cursor: pointer;
            }
        }
        .invite-code-refuse-main{
            margin-top: 30px;
            .invite-code-refuse-lists{
                display: flex;
                flex-direction: column;
                .invite-code-refuse-list{
                    margin-bottom: 10px;
                }
            }
        }
        .invite-code-refuse-btns{
            margin-top: 20px;
            text-align: right;
        }
        
    }
</style>