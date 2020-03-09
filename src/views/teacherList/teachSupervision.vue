<template>
    <div class="teach-supervise">
        <div class="teach-supervise-left">
            <mk-canlendar @dayClick="dayClick"></mk-canlendar>
        </div>
        <div class="teach-supervise-right">
            <el-tabs class="teach-supervise-tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="1">
                   <mk-teach-table ref="all" @currentChange="allCurrentChange" :currentPage="page"></mk-teach-table>
                </el-tab-pane>
                <el-tab-pane label="进行中" name="2">
                    <mk-teach-table ref="now" @currentChange="nowCurrentChange" :currentPage="page"></mk-teach-table>
                </el-tab-pane>
                <el-tab-pane label="已完成" name="3">
                    <mk-teach-table ref="over" @currentChange="overCurrentChange" :currentPage="page"></mk-teach-table>
                </el-tab-pane>
                <el-tab-pane label="异常课" name="4">
                    <mk-teach-table ref="error" @currentChange="errorCurrentChange" :currentPage="page"></mk-teach-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import monthCalendar from './components/monthCalendar'
import teachTable from './components/teachTable'
import { Tabs, TabPane } from 'element-ui'
export default {
    data() {
        return {
            activeName: '1',
            statusType: 1,
            startTime: 0,
            endTime: 0,
            page: 1,
        }
    },
    components: {
        'mk-canlendar':monthCalendar,
        'el-tab-pane': TabPane,
        'mk-teach-table': teachTable,
        'el-tabs': Tabs
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.routeList =
                to.meta.routeList.length > 1
                    ? to.meta.routeList.splice(0, to.meta.routeList.length - 1)
                    : to.meta.routeList
        })
    },
    methods: {
        //点击日历事件
        dayClick(e) {
            this.startTime = e.timeStamp / 1000;
            this.endTime = this.startTime + (24 * 60 * 60 - 1);
            this.page = 1
            if(this.statusType === 1) {
                this.$refs.all.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 2) {
                this.$refs.now.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 3) {
                this.$refs.over.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 4) {
                this.$refs.error.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            }
        },
        // 点击tab事件
        handleClick(e) {
            this.statusType = Number(e.name)
            this.page = 1
            if(this.statusType === 1) {
                this.$refs.all.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 2) {
                this.$refs.now.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 3) {
                this.$refs.over.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            } else if(this.statusType === 4) {
                this.$refs.error.getClassLists(this.statusType, this.startTime, this.endTime, this.page)
            }
        },
        // 点击全部分页
        allCurrentChange(e) {
            this.page = e.page
            this.$refs.all.getClassLists(this.statusType, this.startTime, this.endTime, e.page)
        },
        // 点击进行中分页
        nowCurrentChange(e) {
            this.page = e.page
            this.$refs.now.getClassLists(this.statusType, this.startTime, this.endTime, e.page)
        },
        // 点击已完成分页
        overCurrentChange(e) {
            this.page = e.page
            this.$refs.over.getClassLists(this.statusType, this.startTime, this.endTime, e.page)
        },
        // 点击异常课分页
        errorCurrentChange(e) {
            this.page = e.page
            this.$refs.error.getClassLists(this.statusType, this.startTime, this.endTime, e.page)
        }
    }
}
</script>
<style lang="less">
    .el-tabs__content{
        flex: 1;
    }
    .el-tab-pane{
        height: 100%;
    }
</style>
<style lang="less" scoped>
    .teach-supervise{
        display: flex;
    }
    .teach-supervise-left{
        width: 30%;
        margin-right: 20px;
    }
    .teach-supervise-right{
        flex: 1;
        height: 100%;
    }
    .teach-supervise-tabs{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>
