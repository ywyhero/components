<template>
    <div class="teach-supervise-main">
        <div class="teach-supervise-table">
            <el-table
            height="100%"
            :data="lists">
                <el-table-column
                    label="课程状态"
                    width="80">
                    <template slot-scope="scope">
                        <div class="teach-supervise-status">
                            <i class="teach-supervise-status-icon" :class="scope.row.status === 0 ? 'unstart' : scope.row.status === 1 ? 'start': scope.row.status === 3 ? 'error' : 'end'"></i>
                            <span class="teach-supervise-status-value" :class="scope.row.status === 0 ? 'active' : ''">{{scope.row.status === 0 ? '未开始' : scope.row.status === 1 ? '进行中' : scope.row.status === 3 ? '异常课' : '已完成'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    width="76"
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    label="上课时长"
                    width="76">
                    <template slot-scope="scope">
                        <div class="teach-supervise-val">
                            <span>{{scope.row.class_duration}}min</span>
                            <span class="teach-supervise-actural-duration">{{scope.row.realDuration}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="上课老师">
                    <template slot-scope="scope">
                        <div class="teach-supervise-val">
                            <span>{{scope.row.teacherName}}</span>
                            <span class="teach-supervise-12">{{scope.row.teacherMobile}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="老师信号">
                    <template slot-scope="scope">
                        <div class="teach-supervise-signal" v-show="scope.row.teacherSignal !== 0">
                            <mk-signal :value="scope.row.teacherSignal"></mk-signal>
                            <span class="teach-supervise-12" v-show="scope.row.status !== 1">{{scope.row.teacherTimeIn}}-{{scope.row.teacherTimeOut}}</span>
                            <span class="teach-supervise-12" v-show="scope.row.status === 1">{{scope.row.teacherTimeIn}}进教室</span>
                        </div>
                        <span v-show="scope.row.teacher_in_time !== 0 && scope.row.teacherSignal === 0">未知</span>
                        <span v-show="scope.row.teacher_in_time === 0" :class="`${scope.row.status === 3 ? 'bad' : ''} ${scope.row.status === 0 ? 'info' : ''}`">{{scope.row.status === 0 ? '尚' : ''}}未进入教室</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="学生">
                    <template slot-scope="scope">
                        <div class="teach-supervise-val">
                            <span>{{scope.row.studentName}}</span>
                            <span class="teach-supervise-12">{{scope.row.studentMobile}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="学生信号">
                    <template slot-scope="scope">
                        <div class="teach-supervise-signal">
                            <div class="teach-supervise-signal" v-show="scope.row.studentSignal !== 0">
                                <mk-signal :value="scope.row.studentSignal"></mk-signal>
                                <!-- <span class="teach-supervise-12">{{scope.row.studentTime}}</span> -->
                                <span class="teach-supervise-12" v-show="scope.row.status === 2">{{scope.row.studentTimeIn}}-{{scope.row.studentTimeOut}}</span>
                                <span class="teach-supervise-12" v-show="scope.row.status === 1">{{scope.row.studentTimeIn}}进教室</span>
                            </div>
                            <span v-show="scope.row.student_in_time === 0" :class="`${scope.row.status === 3 ? 'bad' : ''} ${scope.row.status === 0 ? 'info' : ''}`">{{scope.row.status === 0 ? '尚' : ''}}未进入教室</span>
                            <span v-show="scope.row.student_in_time !== 0 && scope.row.studentSignal === 0">未知</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <div class="teach-supervise-btns">
                            <span class="teach-supervise-btn" v-show="!scope.row.classAudioUrl">无录音</span>
                            <el-button class="teach-supervise-btn" type="text" v-show="scope.row.classAudioUrl" @click="toAudio(scope.row.classAudioUrl)">录音回放</el-button>
                            <span class="teach-supervise-btn" v-show="!scope.row.classRecordUrl">等待课后单</span>
                            <el-link class="teach-supervise-btn" v-show="scope.row.classRecordUrl" type="primary" :href="scope.row.classRecordUrl" :underline="false" target="_blank">课后单</el-link>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="teach-supervise-pagination">
            <el-pagination
            background
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total"
            :current-page="currentPage"
            @current-change="currentChange">
            </el-pagination>
        </div>

    </div>
</template>
<script>
import signal from './signal'
import {Link} from 'element-ui'
import {teacher} from './../../../service/index'
export default {
    props: {
        currentPage: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            lists: [],
            pageSize: 20,
            total: 0,
        }
    },
    components: {
        'mk-signal': signal,
        'el-link': Link
    },
    mounted(){
        // this.getClassLists()
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
        // 获取课程数据
        /**
         * statusType： tab类型 1-全部 2-进行中 3-已完成 4-一场课
         * startTime： 开始时间
         * endTime： 结束事件
         * page： 当前页数
         */
        async getClassLists(statusType=1, startTime, endTime, page=1) {
            let { data } = await teacher.getSuperviseClassList({
                institution: this.$store.state.userInfo.deptId,
                status_type: statusType,
                start_time: startTime,
                end_time: endTime,
                page: page,
                per_page: this.pageSize
            })
            this.lists = data.class_list.map( v => {
                // 格式化数据
                let {hour, minutes} = this.formatTime(v.time_class);
                v.startTime = `${hour}:${minutes}`
                if(v.teacher_in_time !== 0) {
                    let teacherInTime = this.formatTime(v.teacher_in_time)
                    v.teacherTimeIn = `${teacherInTime.hour}:${teacherInTime.minutes}`
                }
                if(v.teacherOutTime !== 0) {
                    let teacherOutTime = this.formatTime(v.teacherOutTime)
                    v.teacherTimeOut = `${teacherOutTime.hour}:${teacherOutTime.minutes}`
                }
                if(v.studnetOutTime !== 0) {
                    let studentOutTime = this.formatTime(v.studnetOutTime)
                    v.studentTimeOut = `${studentOutTime.hour}:${studentOutTime.minutes}`
                }
                if(v.student_in_time !== 0) {
                    let studentInTime = this.formatTime(v.student_in_time)
                    v.studentTimeIn = `${studentInTime.hour}:${studentInTime.minutes}`
                }
                if(v.classRealDuration) {
                    let classRealDuration = v.classRealDuration
                    let minutes = Math.floor(classRealDuration / 60) < 10 ? '0' + Math.floor(classRealDuration / 60) : Math.floor(classRealDuration / 60);
                    let seconds = classRealDuration % 60 < 10 ? '0' + classRealDuration % 60 : classRealDuration % 60;
                    v.realDuration = `${minutes}:${seconds}`
                } else {
                    v.realDuration = '00:00'
                }
                return v
            })
            this.total = data.total_count;
        },
        async toAudio(classAudioUrl) {
            let {data} = await teacher.getClassAudioUrl({
                classAudioUrl: classAudioUrl
            })

            window.sessionStorage.setItem('classAudioUrl', data.newClassAudioUrl)
            this.$router.push(`/system/teacher/playback`)
        },
        // 点击分页的时候暴露切换事件
        currentChange(page) {
            this.$emit('currentChange', {page: page})
        }
    }
}
</script>
<style lang="less" scoped>
    .teach-supervise-main{
        font-size: 12px;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .teach-supervise-table{
        flex: 1;
        overflow-y: auto;
    }
    .teach-supervise-val{
        display: flex;
        flex-direction: column;
    }
    .teach-supervise-status{
        display: flex;
        align-items: center;
    }
    .teach-supervise-status-icon{
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #67C23A;
        margin-right: 5px;
    }
    .teach-supervise-status-icon.unstart{
        background: #909399;
    }
    .teach-supervise-status-icon.start{
        background: #67C23A;
    }
    .teach-supervise-status-icon.end{
        background: #409EFF;
    }
    .teach-supervise-status-icon.error{
        background: #F56C6C;
    }
    .teach-supervise-status-value.active {
        color: #909399;
    }
    .teach-supervise-actural-duration{
        color: #909399;
    }
    .teach-supervise-btns{
        display: flex;
        flex-wrap: wrap;
    }
    .teach-supervise-btn{
        font-size: 12px;
        margin-right: 5px;
    }
    .teach-supervise-btn:last-child{
        margin-right: 0px;
    }
    .info{
        color: #909399;
    }
    .good {
        color: #67C23A;
    }
    .warn{
        color: #E6A23C;
    }
    .bad{
        color: #F56C6C;
    }
    .teach-supervise-signal{
        display: flex;
        align-items: flex-end;
    }
    .teach-supervise-pagination{
        padding-top: 20px;
        text-align: right;
    }
    .teach-supervise-12{
        font-size: 12px;
        height: 16px;
    }
</style>
