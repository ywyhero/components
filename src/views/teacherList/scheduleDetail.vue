<template>
    <div class="schedule-detail pos-sticky-relative">
        <!--  -->
        <div class="schedule-detail-info">
            <div class="schedule-detail-box">
                <span class="schedule-detail-info-value">{{teacherNum}}</span>
                <span class="schedule-detail-info-val">老师编号</span>
            </div>
            <div class="schedule-detail-box">
                <input class="schedule-detail-info-value schedule-detail-info-input schedule-detail-info-phone"  maxlength="11" @input="changeTeacherPhoe" :value="teacherPhone" v-show="isEidt"/>
                <span class="schedule-detail-info-value" v-show="!isEidt">{{teacherPhone}}</span>
                <span class="schedule-detail-info-val">注册手机号</span>
            </div>
            <div class="schedule-detail-box">
                <input class="schedule-detail-info-value schedule-detail-info-input" maxlength="20" @input="changeTeacherName" v-model="teacherName" v-show="isEidt"/>
                <span class="schedule-detail-info-value" v-show="!isEidt">{{teacherName}}</span>
                <span class="schedule-detail-info-val">显示昵称</span>
            </div>
            <!-- <span class="schedule-detail-edit" @click="edit">{{editValue}}</span> -->
        </div>
        
        <div class="schedule-detail-main ">
            <div class="schedule-detail-left">
                <!-- <div class="schedule-detail-left-value">教师课表</div> -->
                <div class="schedule-detail-left-main">
                    <div class="schedule-detail-calendar">
                        <mk-calendar
                            v-loading="isRenderCalender"
                            :courses="courses"
                            :startDayTime="startTime"
                            ref="$calendar" 
                            :teacherId="teacherId" 
                            :taskEvent="courseEdit"
                            :cellEvent="courseAdd"
                            :changeStartDay="changeStartDay"
                            :deleteTaskEvent="batchDeleteCourses"
                            @drop="batchDragCourses"
                            @preWeek="preWeek"
                            @nextWeek="nextWeek"
                            @nowWeek="nowWeek"></mk-calendar>
                    </div>
                </div>
            </div>
            <!-- 关联学生 update 2020-02-20 -->
            <div class="schedule-detail-right pos-sticky" v-loading="isUpdateRelationStudents">
                <div class="student-hd">
                    <span>关联学生</span>
                    <div>
                        <button class="btn-add-student" @click="gotoBatchImport" v-if="teacherPermission">批量导入</button>
                        <button class="btn-add-student" @click="addStudent" v-if="teacherPermission">{{isAddStudent ? '收起' : `新增学生`}}</button>
                    </div>
                    
                </div>
                <div class="student-box" v-show="!isAddStudent">
                    
                    <div class="student-list">
                        <span 
                            class="item"
                            v-for="(item, index) in relationStudents"
                            :key="index">{{item.userName}}<i class="icon-delete" @click="deleteStudent(item)" v-if="teacherPermission"></i></span>
                    </div>
                </div>
                <div class="student-add-box" v-show="isAddStudent">
                    <div class="student-input">
                        <el-input
                            placeholder="请输入姓名或手机号"
                            v-model="searchStudent"
                            suffix-icon="el-icon-search"
                            clearable
                            @input="gotoSearchStudent">
                        </el-input>
                    </div>
                    
                    <div class="student-list">
                        <div class="select-box">
                            <el-checkbox-group 
                                v-model="selectedRelationStudents"
                                @change="changeSelectedRelationStudents">
                                <div 
                                    class="select-item" 
                                    v-for="(item,index) in studentOptions" 
                                    :key="index"
                                    v-show="item.isShow">
                                    <el-checkbox :label="item" :checked="item.checked">{{`${item.userName} ${item.mobile}`}}</el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="student-foot">
                        <button class="btn-cancel" @click="closeAddStudent">取消</button>
                        <button class="btn-submit" @click="updateRelationStudents">确定</button>
                    </div>
                </div>
                <!-- <div class="schedule-detail-right-add" @click="addStudent" v-show="isShow">新增学生</div> -->
                
            </div>
        </div>
        <!-- 新增和编辑课程滑块 -->
        <el-drawer
            title="我是标题"
            @close="cancelCourseDrawer"
            :visible.sync="isOpenCourseDrawer"
            size="580px"
            class="schedule-detail-drawer"
            :with-header="false">
            <div class="schedule-detail-right-student">
                <div class="schedule-detail-right-student-info">
                    <div class="schedule-detail-right-student-name">
                        <span class="schedule-detail-right-student-name-val">选择学生</span>
                        <el-select v-model="studentName" :disabled="studentDisabled" @change="changeStudent" placeholder="请选择">
                            <el-option
                                v-for="item in selectStudentsOptions"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <input type="text" style="position: absolute; left: -9999999px">
                    </div>
                    <div class="schedule-detail-right-student-phone">
                        <span class="schedule-detail-right-student-name-val">联系手机号</span>
                        <el-input v-model="phone" :disabled="phoneDisabled" @change="changePhone" placeholder="请输入手机号"/>
                    </div>
                </div>
                <div class="course-add" v-show="courseMode === 'add'">
                    <!-- 新增模式下选择排课类型 -->
                    <div class="course-type-box">
                        <el-radio 
                            v-model="courseType" 
                            label="1" 
                            @change="courseTypeChange">自由排课</el-radio>
                        <el-radio 
                            v-model="courseType" 
                            label="2"
                            @change="courseTypeChange">循环排课</el-radio>
                    </div>
                    <!-- 自由排课 -->
                    <div class="course-free-box" v-show="courseType === '1'">
                        <div class="course-date-box">
                            <span>选择课程日期</span>
                            <div class="course-mutiple-date-box">
                                <div class="">
                                    <button class="btn-course-date" @click="openCourseMutipleDate">选择日期</button>
                                    <el-date-picker
                                        ref="$courseMultipleDate"
                                        class="course-mutiple-date"
                                        type="dates"
                                        :clearable="false"
                                        :editable="false"
                                        :picker-options="pickOptions"
                                        v-model="courseMultipleDate"
                                        placeholder="选择一个或多个日期">
                                    </el-date-picker>
                                </div>
                                <span class="selected-course">已选中{{courseMultipleDate.length}}天</span>
                            </div>
                            
                        </div>

                        <div class="course-datetime-box">
                            <span>选择上课时间段</span>
                            <div class="course-time">
                                <el-time-select
                                    class="course-time-picker"
                                    v-model="curCourse.startTime"
                                    :default-value="defaultValue"
                                    :picker-options="{
                                        start: '07:00',
                                        step: '00:15',
                                        end: '22:00'
                                    }"
                                    :clearable="false"
                                    @change="changeMutipleStartTime"
                                    placeholder="开始时间">
                                </el-time-select>
                                <el-select 
                                    v-model="curCourse.courseDuration" 
                                    @change="changeMutipleDuration" 
                                    placeholder="请选择" 
                                    class="course-duration-picker">
                                    <el-option
                                    v-for="item in selectMinutes"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <span class="schedule-detail-right-select-val">min</span>
                            </div>
                        </div>

                        <div class="foot">
                            <button class="btn-cancel" @click="cancelCourseDrawer">取消</button>
                            <button class="btn-submit" @click="validateFreeCourse">保存</button>
                        </div>
                    </div>
                    <!-- 循环排课 -->
                    <div class="course-free-box course-free-loop" v-show="courseType === '2'">
                        <div class="course-date-box">
                            <span>选择课程日期</span>
                            <div class="course-mutiple-date-box">
                                <div class="">
                                    <el-date-picker
                                        v-model="courseLoopDate"
                                        :picker-options="pickOptions"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :clearable="false"
                                       >
                                    </el-date-picker>
                                    
                                </div>
                            </div>
                            
                        </div>

                        <div class="course-datetime-box">
                            <span style="margin-bottom: 10px;">选择上课时间段</span>
                            <div class="course-rows">
                                <div class="course-row" v-for="(item, index) in datetimes" :key="index">
                                    <div class="course-day">
                                        <el-select 
                                            v-model="item.dateValue" 
                                            @change="changeLoopWeek($event, index)" 
                                            placeholder="请选择" 
                                            :name="`course_weekday_${index}`"
                                            class="course-day-picker">
                                            <el-option
                                                v-for="item in weekOptions"
                                                :key="item.id"
                                                :label="item.value"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-time-select
                                            class="course-time-picker"
                                            v-model="item.timeValue"
                                            :name="`course_time_${index}`"
                                            @change="changeTime($event, index)"
                                            :default-value="defaultValue"
                                            :picker-options="{
                                                start: '07:00',
                                                step: '00:15',
                                                end: '22:00'
                                            }"
                                            :clearable="false"
                                            placeholder="开始时间">
                                        </el-time-select>
                                        <el-select 
                                            v-model="item.minValue" 
                                            @change="changeMinute($event, index)" 
                                            placeholder="请选择" 
                                            class="schedule-detail-right-select-picker schedule-detail-right-select-min">
                                            <el-option
                                            v-for="item in selectMinutes"
                                            :key="item.id"
                                            :label="item.value"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span class="schedule-detail-right-select-val">min</span>
                                    </div>
                                    <span @click="datetimeAdd" class="el-icon-circle-plus-outline schedule-detail-right-select-add"></span>
                                    <span v-show="index > 0" @click="datetimeDelete" :data-index="index" class="el-icon-circle-close schedule-detail-right-select-close"></span>
                                </div>
                            </div>
                        </div>
                        <div class="foot">
                            <button class="btn-cancel" @click="cancelCourseDrawer">取消</button>
                            <button class="btn-submit" @click="validateLoopCourse">保存</button>
                        </div>
                    </div>
                </div>
                <!-- 自助排课编辑模式 -->
                <div class="course-edit" v-show="courseMode === 'edit'">
                    <div class="course-free-box">
                        <div class="course-date-box">
                            <span>选择课程日期</span>
                            <div class="course-mutiple-date-box">
                                <div class="">
                                    <el-date-picker
                                        v-model="editCourse.dayTime"
                                        type="date"
                                        :picker-options="pickOptions"
                                        :clearable="false"
                                        @change="changeEditDate"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>

                        <div class="course-datetime-box">
                            <span>选择上课时间段</span>
                            <div class="course-time">
                                <el-time-select
                                    class="course-time-picker"
                                    v-model="editCourse.startTime"
                                    :default-value="defaultValue"
                                    :picker-options="{
                                        start: '07:00',
                                        step: '00:15',
                                        end: '22:00'
                                    }"
                                    :clearable="false"
                                    @change="changeEditStartTime"
                                    placeholder="开始时间">
                                </el-time-select>
                                <el-select 
                                    v-model="editCourse.courseDuration" 
                                    @change="changeEditDuration" 
                                    placeholder="请选择" 
                                    :clearable="false"
                                    class="course-duration-picker">
                                    <el-option
                                    v-for="item in selectMinutes"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                <span class="schedule-detail-right-select-val">min</span>
                            </div>
                        </div>

                        <div class="foot">
                            <button class="btn-cancel" @click="cancelCourseDrawer">取消</button>
                            <button class="btn-submit" @click="saveEditCourse">保存</button>
                        </div>
                    </div>
                </div>
                <!-- 循环排课编辑模式 -->
                <div class="course-edit" v-show="courseMode === 'loopEdit'">
                    <div class="course-free-box course-free-loop">
                        <div class="course-date-box">
                            <span>选择课程日期</span>
                            <div class="course-mutiple-date-box">
                                <div class="">
                                    <el-date-picker
                                        v-model="courseLoopDate"
                                        :picker-options="pickOptions"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :clearable="false"
                                       >
                                    </el-date-picker>
                                    
                                </div>
                            </div>
                            
                        </div>

                        <div class="course-datetime-box">
                            <span style="margin-bottom: 10px;">选择上课时间段</span>
                            <div class="course-rows">
                                <div class="course-row" v-for="(item, index) in datetimes" :key="index">
                                    <div class="course-day">
                                        <el-select 
                                            v-model="item.dateValue" 
                                            @change="changeLoopWeek($event, index)" 
                                            placeholder="请选择" 
                                            :name="`course_weekday_${index}`"
                                            class="course-day-picker">
                                            <el-option
                                                v-for="item in weekOptions"
                                                :key="item.id"
                                                :label="item.value"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-time-select
                                            class="course-time-picker"
                                            v-model="item.timeValue"
                                            :name="`course_time_${index}`"
                                            @change="changeTime($event, index)"
                                            :default-value="defaultValue"
                                            :picker-options="{
                                                start: '07:00',
                                                step: '00:15',
                                                end: '22:00'
                                            }"
                                            :clearable="false"
                                            placeholder="开始时间">
                                        </el-time-select>
                                        <el-select 
                                            v-model="item.minValue" 
                                            @change="changeMinute($event, index)" 
                                            placeholder="请选择" 
                                            class="schedule-detail-right-select-picker schedule-detail-right-select-min">
                                            <el-option
                                            v-for="item in selectMinutes"
                                            :key="item.id"
                                            :label="item.value"
                                            :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <span class="schedule-detail-right-select-val">min</span>
                                    </div>
                                    <span @click="datetimeAdd" class="el-icon-circle-plus-outline schedule-detail-right-select-add"></span>
                                    <span v-show="index > 0" @click="datetimeDelete" :data-index="index" class="el-icon-circle-close schedule-detail-right-select-close"></span>
                                </div>
                            </div>
                        </div>

                        <div class="foot">
                            <button class="btn-cancel" @click="cancelCourseDrawer">取消</button>
                            <button class="btn-submit" @click="validateLoopCourse">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <mk-dialog :isShow="isDialogShow" @sure="sureEvent" :errorTimes="errors"></mk-dialog>
        
        <!-- 点击课程后弹出课程相关信息框 -->
        <el-dialog 
            :title="currentClassInfo.name" 
            class="course-card"
            width="400px"
            :visible.sync="cancelShow"
            @close="closeEvent">
            <div class="course-body">
                <!-- <span class="name">{{currentClassInfo.name}}</span> -->
                <div class="course-info">
                    <div class="content">
                        <span class="cell">{{currentClassInfo.datetime}}</span>
                        <span class="cell">{{currentClassInfo.week}}</span> 
                        <span class="cell">{{currentClassInfo.time}}</span>
                        <span class="cell">{{currentClassInfo.duration}}min</span>
                    </div>
                    <div class="status">
                        <p class="not-begin" v-if="currentClassInfo.currentStatus === 0">课程未开始</p>
                        <p class="in-progress" v-else-if="currentClassInfo.currentStatus === 1">课程进行中</p>
                        <p class="finish" v-else-if="currentClassInfo.currentStatus === 2 && currentClassInfo.classStatus === 1">课程已完成，共计上课时长：<span>[ {{currentClassInfo.realClassTime}} ]</span></p>
                        <p class="abnormal" v-else-if="currentClassInfo.currentStatus === 2 && currentClassInfo.classStatus === 0">课程为异常课</p>
                        <!-- <span>课程{{currentClassInfo.currentStatus === 0 ? '未开始' : currentClassInfo.currentStatus === 1 ? '进行中' : '已完成'}}</span> -->
                    </div>
                </div>
            </div>
            <div slot="footer" class="course-footer">
                <div class="toolbar" v-if="currentClassInfo.currentStatus === 2 || currentClassInfo.currentStatus === 1">
                    <button class="btn-ok" @click="cancelShow = !1">确定</button>
                </div>
                <div class="toolbar" v-else-if="currentClassInfo.currentStatus === 0 ">
                    <button class="btn-cancel" @click="cancelClass">取消课程</button>
                    <!-- 自主排课 -->
                    <div class="" v-if="currentClassInfo.isFixedClass === 0">
                        <button class="btn-ok" @click="editClass">编辑课程</button>
                    </div>
                    <!-- 循环排课 -->
                    <div class="" v-else-if="currentClassInfo.isFixedClass === 1">
                        <button class="btn-ok" @click="editClass">编辑当前课程</button>
                        <button class="btn-ok" @click="gotoEditLoopCourse">编辑循环课程</button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 自主排课校验后弹窗 -->
        <el-dialog 
            title="自主排课存在冲突课" 
            class="conflict-dialog"
            width="500px"
            :visible.sync="freeCourseDialogShow"
            @close="freeCourseDialogShow = !1">
            <div class="bd">
                <div class="info">
                    <div class="content">
                        <p>可覆盖（已调整后为准）</p>
                        <div class="class-box">
                            
                            <ul class="class-list">
                                <li class="item" v-for="(item, index) in conflictCoverCourses" :key="index">
                                    <span class="cell name">{{item.userName}}</span>
                                    <span class="cell">{{item.date}}</span>
                                    <span class="cell">{{item.week}}</span>
                                    <span class="cell">{{item.time}}</span>
                                    <span class="cell">{{item.duration}}min</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="content">
                        <p>不可覆盖（该时段存在其他学生的课或此学生目前时段有其他课）</p>
                        <div class="class-box not-cover">
                            <p v-if="!conflictNotCoverCourses.length">没有不可覆盖课程</p>
                            <ul class="class-list" v-else>
                                <li class="item" v-for="(item, index) in conflictNotCoverCourses" :key="index">
                                    <span class="cell">{{item.userName}}</span>
                                    <span class="cell">{{item.date}}</span>
                                    <span class="cell">{{item.week}}</span>
                                    <span class="cell">{{item.time}}</span>
                                    <span class="cell">{{item.duration}}min</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="footer">
                <button class="btn-cancel" @click="freeCourseDialogShow = !1">取消</button>
                <button class="btn-ok" @click="saveFreeCourses">确定</button>
            </div>
        </el-dialog>
        <!-- 循环排课校验后弹窗 -->
        <el-dialog 
            title="循环排课存在冲突课" 
            class="conflict-dialog"
            width="500px"
            :visible.sync="loopCourseDialogShow"
            @close="loopCourseDialogShow = !1">
            <div class="bd">
                <div class="info">
                    <!-- <div class="content">
                        <p class="title">调整后冲突的课程覆盖吗？</p>
                        <p class="msg">调整后存在<span class="conflict">{{conflictCourses.length}}</span>节冲突课，其中可覆盖<span class="conflict">{{conflictCoverCourses.length}}</span>节课，不可覆盖<span class="conflict">{{conflictNotCoverCourses.length}}</span>节课，确定覆盖后，课表将更新为新课表，如果不调整冲突课，请取消重新编辑。</p>
                    </div> -->
                    <div class="content">
                        <p>可覆盖（已调整后为准）</p>
                        <div class="class-box">
                            
                            <ul class="class-list">
                                <li class="item" v-for="(item, index) in conflictCoverCourses" :key="index">
                                    <span class="cell name">{{item.userName}}</span>
                                    <span class="cell">{{item.date}}</span>
                                    <span class="cell">{{item.week}}</span>
                                    <span class="cell">{{item.time}}</span>
                                    <span class="cell">{{item.duration}}min</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="content">
                        <p>不可覆盖（该时段存在其他学生的课或此学生目前时段有其他课）</p>
                        <div class="class-box not-cover">
                            <p v-if="!conflictNotCoverCourses.length">没有不可覆盖课程</p>
                            <ul class="class-list" v-else>
                                <li class="item" v-for="(item, index) in conflictNotCoverCourses" :key="index">
                                    <span class="cell">{{item.userName}}</span>
                                    <span class="cell">{{item.date}}</span>
                                    <span class="cell">{{item.week}}</span>
                                    <span class="cell">{{item.time}}</span>
                                    <span class="cell">{{item.duration}}min</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="footer">
                <button class="btn-cancel" @click="loopCourseDialogShow = !1">取消</button>
                <button class="btn-ok" @click="saveLoopCourses">确定</button>
            </div>
        </el-dialog>
        <!-- 批量导入关联学生 -->
        <el-dialog 
            title="批量导入关联学生" 
            class="import-dialog"
            width="550px"
            :visible.sync="importDialogShow"
            @close="closeImportDialog">
            <div class="bd">
                <div class="info" >
                    <p class="" v-if="importStatus === 0">注意：批量导入需按本系统标准模板填写，请先下载<a class="btn-download" :href="xlsxTemp" download="老师关联学生信息模板" target="_blank">老师关联学生信息模板</a></p>
                    <p class="" v-if="importStatus === 1">正在导入中...</p>
                    <p class="" v-if="importStatus === 2">共<span>{{batchImportData.length}}</span>条数据，成功导入{{batchImportData.length}}条。</p>
                    <div class="error-box" v-if="importStatus === -1">
                        <ul class="error-list" >
                            <li class="item" v-for="(error, index) in errorList" :key="index">{{error}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div slot="footer" class="footer">
                <button 
                    v-if="importStatus === 0 || importStatus === -1"
                    class="btn-cancel" 
                    @click="closeImportDialog">取消</button>
                <button 
                    v-if="importStatus === 0 || importStatus === -1"
                    class="btn-ok" 
                    @click="readyBatchImport">直接导入</button>
                <button 
                    v-if="importStatus === 2"
                    class="btn-ok" 
                    @click="closeImportDialog">确定</button>
                <input 
                    ref="$batchImport"
                    class="btn-import" 
                    @change="changeImportFile"
                    type="file"
                    accept=".xls, .xlsx"
                    value="上传文件" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Calendar  from './components/calendar';
import Dialog  from './components/dialog';
import { Select, Option, DatePicker, TimeSelect, Drawer } from 'element-ui';
import { format } from '../../util/time';
import { mapGetters } from 'vuex';
import XLSX from 'xlsx';
import { assignTeacherUser } from '../../util/mapList';
import env from '../../config/env';


const relationStudent = {
    teacherId: 'wweq',
    userId: 'asdsad',
    userName: '张三丰',
    mobile: '13232323232',
}

export default {
    data(){
        return {
            pickOptions: {
                disabledDate(time) {
                    let year = new Date().getFullYear();
                    let month = new Date().getMonth() + 1;
                    let day = new Date().getDate();
                    return time.getTime() < new Date(`${year}/${month}/${day} 00:00`);
                },
            },
            studentDisabled: false,
            phoneDisabled: false,
            cancelShow: false,
            isShow: false,
            isEidt: false,
            editValue: "编辑",
            teacherPhone: 13823232323,
            today: `${new Date().getFullYear()}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate()}`,
            studentName: '',
            students: [],
            phone: '',
            datetimes: [{ 
                dateValue: '',
                timeValue: '',
                minValue: 25}],
            teacherId: '',
            teacherName: '',
            teacherNum: '',
            isDetailShow: false,
            studentId: 0,
            classes: [],
            errors: [], // 排课冲突时间
            isDialogShow: false, // 是否展示错误时间列表
            startTime: 0, 
            endTime: 0,
            selectMinutes: [],
            selectMinute: 25,
            defaultValue: '',
            weekOptions: [{id: 1, value: '周一'},{id: 2, value: '周二'},{id: 3, value: '周三'},{id: 4, value: '周四'},{id: 5, value: '周五'},{id: 6, value: '周六'},{id: 7, value: '周日'}],
            courseMode: '',     // 排课模式：编辑或新增
            // 排课课程列表
            courses: [],
            curCourse: {
                startTime: '',
                courseDuration: 25
            },// 当前选中的课程
            editCourse: {
                dayTime: '',
                startTime: '',
                courseDuration: 25
            },
            loopEditCourses: [

            ],
            // 当日日期时间戳
            dayTime: 0,

            studentOptions: [],        // 所有学生筛选项
            studentOptionsCache: [],        // 缓存上一次筛选项状态
            isSearchStudent: !1,           // 是否在搜索关联学生状态
            searchStudent: '',      // 新增关联学生搜索文字
            selectedRelationStudents: [],       // 已选关联学生
            selectedRelationStudentsCache: [],      // 缓存已选关联学生数据
            relationStudents: [],       // 关联学生
            classDurationList: [],       // 当前机构下排课时长集合
            searchRelationStudents: [],         // 模糊搜索学生数据
            
            isAddStudent: !1,   // 新增关联学生显示状态
            isUpdateRelationStudents: !1,   // 是否正在更新状态

            isOpenCourseDrawer: !1,     // 新增或编辑课程滑块显示状态
            courseType: '2',              // 排课形式
            courseMultipleDate: '',         // 自由选择日期
            courseMultipleTime: '',         // 自由排课开始时间
            courseMultipleDuration: '',     // 自由排课单节课时长
            courseLoopDate: [],         // 循环排期日期
            currentClassInfo: {},   // 当前课程的信息

            isRenderCalender: !1,       // 渲染日历状态
            freeCourseDialogShow: !1,       // 自主排课校验弹窗显示状态
            loopCourseDialogShow: !1,       // 循环排课编辑前校验弹窗显示状态
            conflictCourses: [],        // 循环排课编辑校验的冲突课程集合
            conflictCoverCourses: [],    // 循环排课编辑校验的可覆盖课程
            conflictNotCoverCourses: [],    // 循环排课编辑校验的不可覆盖课程
            freeCoursesParam: null,         // 自主排课校验参数
            loopCoursesParam: null,        // 循环排课编辑参数

            importDialogShow: !1,           // 批量导入弹框状态
            importStatus: 0,           // 导入状态：0-未开始，1-进行中，2-成功，-1-失败
            batchImportData: [],        // 批量导入数据
            errorList: [],              // 导入失败的错误数据集合

            xlsxTemp: `${env.api}/app/downloadTeacherAssignUserTemplate`,       // 模板下载地址
        }
    },
    computed: {
        filterRelationStudents () {
            return this.isSearchStudent ? this.searchRelationStudents : this.studentOptions
        },
        ...mapGetters({
            userPermission: 'userPermission'
        }),
        teacherPermission() {
            return this.userPermission && this.userPermission['teacher.addStu.btn']
        },
        // 新增或编辑中选择学生下拉选项
        selectStudentsOptions() {
            return this.teacherPermission ? this.students : this.relationStudents;
        }
    },
    async created() {
        let query = this.$route.query
        this.teacherId = Number(query.teacherId)
        this.queryAllUserInfo()
        this.getCurrentWeek()
        await this.getTeacherInfoById()
        await this.getRelationStudents();
        await this.teacherTime();
    },
    components: {
        'mk-calendar': Calendar,
        'mk-dialog': Dialog,
        'el-select': Select,
        'el-option': Option,
        'el-date-picker': DatePicker,
        'el-time-select': TimeSelect,
        'el-drawer': Drawer
    },
    methods: {
        timeDuration(time) {
            let hour = new Date(time * 1000).getHours() >= 10 ? new Date(time * 1000).getHours() : '0' + new Date(time * 1000).getHours()
            let min = new Date(time * 1000).getMinutes() >= 10 ? new Date(time * 1000).getMinutes() : '0' + new Date(time * 1000).getMinutes();
            return `${hour}:${min}`
        },

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
        formatWeek(week) {
            let day = ''
            switch(week){
                case 7:
                    day = '周日'
                    break;
                case 1:
                    day = '周一'
                    break; 
                case 2:
                    day = '周二'
                    break; 
                case 3:
                    day = '周三'
                    break; 
                case 4:
                    day = '周四'
                    break; 
                case 5:
                    day = '周五'
                    break; 
                case 6:
                    day = '周六'
                    break;    
            }
            return day;
        },
        /**
         * @description     
         */
        async changeStartDay (startDay) {
            // 如果没有设置起始日，则取当天为起始日
            if (!startDay) {
                let { week } = this.formatTime(new Date().getTime() / 1000);
                startDay = week;
            } 
            this.getCurrentWeek(startDay);
            await this.teacherTime();
        },
        /**
         * @description     批量取消课程
         */
        batchDeleteCourses (params, success = f => f, fail = f => f) {
            return teacher.batchDeleteCourses(params)
                .then(res => {
                    console.log(res);
                    let { code, msg, data } = res;
                    let message = '';
                    if (code === 200) {
                        this.teacherTime();
                        success(res);
                        this.$message({type: 'success', message: '已选课程已成功删除'});
                    } else {
                        this.$message({type: 'warning', message: msg});
                        fail();
                    }
                })
                .catch(err => {
                    fail();
                });;
        },
        /**
         * @description     自由拖拽编辑课程
         */
        batchDragCourses (params, success = f => f, fail = f => f) {
            teacher.batchDragCourses({ teacher_id: this.teacherId, ...params})
                .then(res => {
                    console.log(res);
                    let { code, msg, data } = res;
                    let message = '';
                    if (code === 200) {
                        this.teacherTime();
                        success(res);
                    } else {
                        this.$message({type: 'warning', message: msg});
                        fail();
                    }
                    
                })
                .catch(err => {
                    fail();
                });
        },
        /**
         * @description     更新当前周数据
         * @param   {number}    startWeek   日历起始周天，从周一开始，起始为1
         * @return  {number}    起始天的时间戳
         */
        getCurrentWeek(startWeek = 1) {
            let nowTimeStamp = new Date().getTime() / 1000;
            let { week, timeStamp } = this.formatTime(nowTimeStamp);
            this.nowTimeStamp = timeStamp
            this.startTime = timeStamp - (week - startWeek) * 24 * 60 * 60;
            this.endTime = this.startTime + (7 * 24 * 60 * 60 - 1);
        },
        async getTeacherInfoById() {
            const {data} = await teacher.getTeacherInfoById({
                teacherId: this.teacherId
            })
            this.teacherName = data.teacherName
            this.teacherNum = data.teacherNum
            this.teacherPhone = data.mobile
        },
        // 获取老师时间表
        async teacherTime() {
            this.isRenderCalender = !0;
            let {data} = await teacher.teacherTime({
                teacher_id: this.teacherId,
                start_time: this.startTime,
                end_time: this.endTime
            });
            try {
                data && (
                    // this.courses = data
                    this.courses = data.map(d => {
                        return { 
                            ...d, 
                            class_list: d.class_list.map(course => {
                                // 根据当前时间计算课程状态
                                let now = new Date().getTime();
                                let duration = course.duration * 60 * 1000;
                                let startTime = course.time_class * 1000;
                                // 0：未开始；1：进行中；2：已完成
                                let courseStatus = startTime > now ? 0 : startTime === now || (startTime > now && startTime + duration <= now) ? 1 : 2;
                                return {
                                    ...course,
                                    courseStatus
                                }
                            })
                        }
                    })
                );
                this.isRenderCalender = !1;
            } catch(err) {
                this.isRenderCalender = !1;
            }
            
        },
        preWeek(e) {
            this.startTime = e.startTime;
            this.endTime = e.endTime;
            this.teacherTime()
        },
        nowWeek(e) {
            this.startTime = e.startTime;
            this.endTime = e.endTime;
            this.teacherTime()
        },
        nextWeek(e) {
            this.startTime = e.startTime;
            this.endTime = e.endTime;
            this.teacherTime()
        },
        // 获取学生信息
        async queryAllUserInfo() {
            const {data} = await student.queryAllUserInfo()
            this.students = data;
        },
        changeStudent(e) {
            this.studentId = e;
            let index = this.selectStudentsOptions.findIndex(v => v.id === e)
            this.phone = this.selectStudentsOptions[index].mobile;
            // this.getStudentClassLists()
        },
        changePhone(e) {
            let index = this.selectStudentsOptions.findIndex(v => v.mobile == e)
            if(index > -1) {
                this.studentName = this.selectStudentsOptions[index].userName;
                this.studentId = this.selectStudentsOptions[index].id;
                // this.getStudentClassLists()
            } else {
                this.$message({
                    type: 'error',
                    message: '该手机号还没有注册'
                })
            }
            
        },
        changeTeacherName(e) {
            let value = e.target.value;
            value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
            this.teacherName = value;
        },
        changeTeacherPhoe(e) {
            this.teacherPhone = e.target.value;
        },
        changeMinute(e, index) {
            this.selectMinute = e;
            let time = this.datetimes[index].timeValue.split('-')[0];
            this.changeTime(time, index)
        },
        /**
         * @description     新增课程
         * @param   {object}    item    日历单元数据
         */
        async courseAdd (cell = {}) {
            // let time = cell.datetime;
            // let startTime = new Date(`${time.year}/${time.month}/${time.day} ${cell.hour}:00`).getTime();
            this.curCourse = {
                startTime: '',
                courseDuration: this.selectMinute
            };
           
            this.datetimes = [{
                dateValue: '',
                timeValue: '',
                minValue: this.selectMinute
            }]
            // 完成后排课类型设置成循环排课
            this.courseType = '2';
            let defaultDate = new Date(cell.timeStamp * 1000);
            this.courseMultipleDate = [defaultDate];
            // this.changeTime(`${cell.hour}:00`, 0);

            let hour = cell.hour;
            if(this.selectMinute >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                this.curCourse.startTime = `${cell.hour}:00-${hour}:00`;
                this.datetimes[0].timeValue = `${cell.hour}:00-${hour}:00`;
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                this.curCourse.startTime = `${cell.hour}:00-${cell.hour}:${this.selectMinute}`;
                this.datetimes[0].timeValue = `${cell.hour}:00-${cell.hour}:${this.selectMinute}`;

            }
            // this.curCourse.startTime = `${cell.hour}:00-${cell.hour}:25`;
            
            this.datetimes[0].dateValue = cell.week;
            // this.datetimes[0].timeValue = `${cell.hour}:00-${cell.hour}:25`;
            this.courseMode = 'add';
            this.isOpenCourseDrawer = !0;
            this.studentDisabled = false;
            this.phoneDisabled = false;
        },
        closeEvent() {
            this.cancelShow = false
        },
        async cancelClass() {
            this.cancelShow = false
            await teacher.cancelClass({
                class_id: this.currentClassInfo.classId,
                cancel_type: 30,
                cancel_reason: '客服取消',
                operator_type: 10,
                platform: 1
            })
            this.$message({
                type: 'success',
                message: '课程取消成功'
            })
            this.teacherTime()
            
        },
        /**
         * @description     编辑单节课
         */
        editClass() {
            this.courseMode = 'edit'
            this.studentDisabled = true;
            this.phoneDisabled = true;
            this.isOpenCourseDrawer = !0;
            let {year,month,day} = this.formatTime(this.currentClassInfo.dayTime);
            this.studentName = this.currentClassInfo.name;
            this.studentId = this.currentClassInfo.studentId;
            this.phone = this.currentClassInfo.studentMobile;
            // this.editCourse = { ...this.currentClassInfo };
            this.editCourse.courseDuration = this.currentClassInfo.duration;
            this.editCourse.startTime = this.currentClassInfo.time;
            this.editCourse.dayTime = `${year}-${month}-${day}`
            
            this.cancelShow = false;
            console.log(this.currentClassInfo)
        },
        /**
         * @description     编辑循环课程
         */
        gotoEditLoopCourse () {
            this.courseMode = 'loopEdit';
            this.studentDisabled = true;
            this.phoneDisabled = true;
            this.isOpenCourseDrawer = !0;   // 打开右侧滑区
            let {year,month,day} = this.formatTime(this.currentClassInfo.dayTime);
            this.studentName = this.currentClassInfo.name;
            this.studentId = this.currentClassInfo.studentId;
            this.phone = this.currentClassInfo.studentMobile;
            this.selectMinute = this.currentClassInfo.duration;

            // this.courseLoopDate = [new Date(1582128000000), new Date(1584633600000)]
            // console.log(this.courseLoopDate)
            // let fixClass = [
            //     {fix_id: 1232313, week: 2, time: '10:15', end_time: '10:40', class_duration: 25}
            // ]
            // this.datetimes = fixClass.map(course => {
            //     let week = this.weekOptions.find(week => week.id === course.week) || this.weekOptions[0];
            //     // let [hour, minute] = course.time.split(':');console.log(hour);

            //     return {
            //         dateValue: week.value,
            //         timeValue: `${course.time}-${course.end_time}`,
            //         minValue: course.class_duration
            //     }
            // })

            // 获取当前循环课程数据
            teacher.fetchLoopCourseInfo({ class_id: this.currentClassInfo.classId })
                .then(res => {
                    console.log(res)
                    let { code, data, msg } = res;
                    if (code === 200) {
                        let fixClass = data.fix_list;
                        fixClass.length && (
                            this.loopCoursesParam ? 
                            this.loopCoursesParam.schedule_id = fixClass[0].schedule_id : this.loopCoursesParam = {schedule_id: fixClass[0].schedule_id});
                        this.datetimes = fixClass.map(course => {
                            let week = this.weekOptions.find(week => week.id === Number(course.week)) || this.weekOptions[0];
                            // let [hour, minute] = course.time.split(':');console.log(hour);
                            return {
                                dateValue: week.value,
                                timeValue: `${course.time}-${course.end_time}`,
                                minValue: course.class_duration
                            }
                        });
                        this.courseLoopDate = [new Date(data.start_time * 1000), new Date(data.end_time * 1000)]
                    }
                })
                .catch(err => {
                    console.warn(err)
                });
            
            this.cancelShow = !1
        },
        /**
         * @description     编辑课程
         * @param   {object}    item    日历上已排课程数据
         */
        courseEdit(item = {}) {
            // 完成后排课类型设置成循环排课
            this.courseType = '2';
            let now = new Date().getTime();
            let duration = item.duration * 60 * 1000;
            let startTime = item.timeClass * 1000;
            // 0：未开始；1：进行中；2：已完成
            let currentStatus = startTime > now ? 0 : 
                startTime === now || (now - startTime <= duration) ? 1 : 2
            this.currentClassInfo = { 
                ...item,
                currentStatus: currentStatus
            };
            console.log('course', this.currentClassInfo)
            // 如果已经完成上课，获取实际上课时长
            currentStatus === 2 && teacher.fetchRealCourseTime({classId: this.currentClassInfo.classId})
                .then(res => {
                    let { code, data, msg } = res;
                    if (code === 200) {
                        let sec = data.realClassTime;
                        let second = Math.floor(sec % 60);
                        let hour = Math.floor(sec / 3600 % 24);
                        var min = Math.floor(sec / 60 % 60);
                        let hourStr = hour ? `${hour}小时` : '';
                        let minStr = min ? `${min}分` : '';
                        let secStr = second ? `${second}秒` : '';
                        let realClassTime =`${hourStr}${minStr}${secStr}`;console.log(realClassTime)
                        this.currentClassInfo = { 
                            ...this.currentClassInfo,
                            realClassTime,
                            classStatus: data.classStatus
                        };
                    } else {

                    }
                })
                .catch(err => {
                    console.warn(err)
                })
            this.cancelShow = true;
        },
        //  查询学生的课程信息
        // studentClass(item) {
        //     this.isShow = false;
        //     this.studentId = item.student_id;
        //     // this.getStudentClassLists()
        //     this.studentName = item.student_name;
        //     let index = this.students.findIndex(v => v.id == this.studentId);
        //     this.phone = this.students[index].mobile;
            
        // },
        // 查询学生课程
        async getStudentClassLists() {
            const {data} = await teacher.getStudentClassLists({
                teacher_id: this.teacherId,
                student_id: this.studentId
            })
            this.datetimes = []
            let arr = data;
            if(arr.length > 0) {
                arr.sort((a, b) => {
                    return a['time_class'] - b['time_class'];
                })
                for(let item of arr) {
                    let {week} = this.formatTime(item.time_class);
                    let start = this.timeDuration(item.time_class)
                    let end = this.timeDuration(item.time_end)
                    this.datetimes.push({
                        dateValue: this.formatWeek(week),
                        timeValue: `${start}-${end}`,
                        minValue: item.class_duration
                    })
                }
            } else {
                this.datetimes.push({
                    dateValue: ``,
                    timeValue: ``,
                    minValue: this.selectMinute
                })
            }
            
        },
        // 新增排课时间
        datetimeAdd() {
            let date = this.datetimes[this.datetimes.length - 1].dateValue;           
            let time = this.datetimes[this.datetimes.length - 1].timeValue;

            if(!date) {
                this.$message({
                    type: 'error',
                    message: '周几不能为空'
                })
                return
            }
            if(!time) {
                this.$message({
                    type: 'error',
                    message: '开始时间不能为空'
                })
                return
            }
            this.datetimes.push({
                dateValue: date,
                timeValue: time,
                minValue: this.selectMinute
            });
        },
        // 删除排课时间
        datetimeDelete(e) {
            let index = e.target.dataset.index;
            this.datetimes.length > 1 && this.datetimes.splice(index, 1);
        },
        changeDate(e, index){ 
            let timeStamp = new Date(e).getTime() / 1000;
            let {year, month, day} = this.formatTime(timeStamp)
            this.datetimes[index].dateValue = `${year}-${month}-${day}`;
        },
        changeTime(e, index) {
            if(!e) {
                return
            } 
            this.defaultValue = e;
            let hour = Number(e.split(':')[0]);
            let min = Number(e.split(':')[1]);
            if(min + this.selectMinute >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                min = (min + this.selectMinute - 60 >= 10 ? min + this.selectMinute - 60 : '0' + (min + this.selectMinute - 60));
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                min = min + this.selectMinute

            }
            this.datetimes[index].timeValue = `${e}-${hour}:${min}`
        },
        cancelEvent() {
            // this.isDetailShow = false;
            this.isShow = true
            this.phone = ''
            this.studentName = ''
            this.datetimes = [{
                dateValue: '',
                timeValue: '',
                minValue: this.selectMinute,
            }]
        },
        sureEvent() {
            this.isDialogShow = false
        },
        /**
         * @description     排课形式切换
         * @param   {}  type    排课形式
         */
        courseTypeChange (type) {
            this.courseType = type;
        },

        openCourseMutipleDate () {
            this.$refs.$courseMultipleDate.focus();
        },
        changeMutipleStartTime(e) {
            let duration = this.curCourse.courseDuration;
            let hour = Number(e.split(':')[0]);
            let min = Number(e.split(':')[1]);
            if(min + duration >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                min = (min + duration - 60 >= 10 ? min + duration - 60 : '0' + (min + duration - 60));
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                min = min + duration
            }
            this.curCourse.startTime = `${e}-${hour}:${min}`
        },
        changeEditStartTime(e) {
            let duration = this.editCourse.courseDuration;
            let hour = Number(e.split(':')[0]);
            let min = Number(e.split(':')[1]);
            if(min + duration >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                min = (min + duration - 60 >= 10 ? min + duration - 60 : '0' + (min + duration - 60));
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                min = min + duration
            }
            this.editCourse.startTime = `${e}-${hour}:${min}`
        },
        changeMutipleDuration (e) {
            let time = this.curCourse.startTime.split('-')[0];
            let hour = Number(time.split(':')[0]);
            let min = Number(time.split(':')[1]);
            if(min + e >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                min = (min + e - 60 >= 10 ? min + e - 60 : '0' + (min + e - 60));
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                min = min + e
            }
            this.curCourse.startTime = `${time}-${hour}:${min}`
            this.curCourse.courseDuration = e;
        },
        changeEditDuration (e) {
            let time = this.editCourse.startTime.split('-')[0];
            let hour = Number(time.split(':')[0]);
            let min = Number(time.split(':')[1]);
            if(min + e >= 60) {
                hour = hour + 1 < 10 ? '0' + (hour + 1) : hour + 1;
                hour = hour === 24 ? '00' : hour;
                min = (min + e - 60 >= 10 ? min + e - 60 : '0' + (min + e - 60));
            } else {
                hour = hour < 10 ? '0' + hour : hour;
                min = min + e
            }
            this.editCourse.startTime = `${time}-${hour}:${min}`
            this.editCourse.courseDuration = e;
        },
        changeEditDate(e) {
            let {year, month, day} = this.formatTime(new Date(e).getTime()/1000);
            this.editCourse.dayTime = `${year}-${month}-${day}`
        },
        changeLoopWeek (week, index) {
            this.$set(this.datetimes[index], 'dateValue', week);
        },
        // 退出课程编辑滑块并清空缓存数据
        cancelCourseDrawer () {
            this.isOpenCourseDrawer = !1;
            this.courseLoopDate = [];
            // this.selectMinute = 0;
            // 清空面板数据
            this.editCourse = {
                dayTime: '',
                startTime: '',
                courseDuration: this.selectMinute
            };
            this.studentName = '';
            this.studentId = 0;
            this.phone = '';
            this.courseType = '2'
            this.datetimes = [{
                dateValue: '',
                timeValue: '',
                minValue: this.selectMinute
            }];
            this.loopCoursesParam = null;
            this.freeCoursesParam = null;
            this.conflictCourses = [];
            this.conflictCoverCourses = [];
            this.conflictNotCoverCourses = [];
            this.studentDisabled = false
            this.phoneDisabled = false
        },
        showErrorClass(e) {
            if(e.data.code === 300003059) {
                let errorClasses = e.data.data.conflict_list;
                let errors = [];
                for(let errorClass of errorClasses) {
                    let {year, month, day} = this.formatTime(errorClass.time_class)
                    let startTime = this.timeDuration(errorClass.time_class)
                    let endTime = this.timeDuration(errorClass.time_end)
                    let obj = {
                        teacherName: errorClass.teacher_name,
                        time: `${year}-${month}-${day} ${startTime}-${endTime}`
                    }
                    errors.push(obj)
                }
                this.errors = errors
                this.isDialogShow = true
            }
        },
        
        /**
         * @description     提交循环排课编辑数据
         */
        saveLoopCourses () {
            // if(this.studentName === '') {
            //     return this.$message({
            //         type: 'error',
            //         message: '学生姓名不能为空'
            //     }) 
            // }
            // if(this.courseLoopDate === '') {
            //     return this.$message({
            //         type: 'error',
            //         message: '课程日期不能为空'
            //     })
            // }
            
            if (this.loopCoursesParam) {
                // 学生id为0表示未选择学生，退出并提示
                if(this.loopCoursesParam.student_id === 0) {
                    return this.$message({ type: 'warning', message: '请选择学生' });
                }
                if (!this.loopCoursesParam.start_time || !this.loopCoursesParam.end_time) {
                    return this.$message({ type: 'warning', message: '请选择课程日期' });
                }
                teacher.circleSave(this.loopCoursesParam)
                    .then(res => {
                        let { code, data, msg } = res;
                        if (code === 200) {
                            this.$message({
                                type: 'success',
                                message: msg
                            })
                            this.teacherTime();
                            this.getRelationStudents();
                            this.cancelLoopCoursesDialog();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: msg
                            });
                            // 非200只关闭信息弹窗
                            // this.loopCourseDialogShow = !1;
                        }
                        // this.isOpenCourseDrawer = false;
                        
                    }).catch(e => {
                        console.warn(err);
                    });
            }
        },
        /**
         * @description     校验循环排课 
         */
        async validateLoopCourse() {
            let startTime = new Date(this.courseLoopDate[0]).getTime() / 1000;
            let endTime = new Date(this.courseLoopDate[1]).getTime() / 1000 + (24 * 60 * 60 - 1);
            let circleList = [];
            for(let time of this.datetimes) {
                let index = this.weekOptions.findIndex(v => v.value === time.dateValue);
                let week = this.weekOptions[index].id;
                let obj = {
                    fix_id: 1,
                    week: week,
                    time_class: time.timeValue.split('-')[0],
                    duration: Number(time.minValue)
                }
                circleList.push(obj)
            }
            // 循环课程校验参数
            let params = {
                student_id: this.studentId,
                teacher_id: this.teacherId,
                start_time: startTime,
                end_time: endTime,
                instrument_id: 1,
                circle_list: circleList,
            }
            let saveType = this.courseMode === 'add' ? 1 : this.courseMode === 'loopEdit' ? 2 : 1;
            // 缓存循环排课编辑数据
            this.loopCoursesParam = {
                save_type: saveType,
                ...this.loopCoursesParam,
                ...params
            }
            // 学生id为0表示未选择学生，退出并提示
            if(this.loopCoursesParam.student_id === 0) {
                return this.$message({ type: 'warning', message: '请选择学生' });
            }
            if (!this.loopCoursesParam.start_time || !this.loopCoursesParam.end_time) {
                return this.$message({ type: 'warning', message: '请选择课程日期' });
            }
            teacher.validateLoopCourse(params)
                .then(res => {
                    let { code, data, msg } = res;
                    if (code === 200) {
                        let cover = [
                            ...data.same_student_same_teacher.cover,
                            ...data.same_student_diff_teacher.cover,
                            ...data.diff_student_same_teacher.cover,
                        ];
                        let notCover = [
                            ...data.same_student_same_teacher.not_cover,
                            ...data.same_student_diff_teacher.not_cover,
                            ...data.diff_student_same_teacher.not_cover,
                        ]
                        
                        this.conflictCoverCourses = [ ...cover ].map(course => {
                            let {year, month, day, week, timeStamp, hour, minutes} = this.formatTime(course.time_class);
                            let startTime = this.timeDuration(course.time_class)
                            let endTime = this.timeDuration(course.time_end)
                            return {
                                userName: course.user_name,
                                date: `${year}-${month}-${day}`,
                                week: this.formatWeek(week),
                                time: `${startTime}-${endTime}`,
                                duration: `${course.class_duration}`
                            }
                        });
                        this.conflictNotCoverCourses = [ ...notCover ].map(course => {
                            let {year, month, day, week, timeStamp, hour, minutes} = this.formatTime(course.time_class);
                            let startTime = this.timeDuration(course.time_class)
                            let endTime = this.timeDuration(course.time_end)
                            return {
                                userName: course.user_name,
                                date: `${year}-${month}-${day}`,
                                week: this.formatWeek(week),
                                time: `${startTime}-${endTime}`,
                                duration: `${course.class_duration}`
                            }
                        });
                        this.conflictCourses = [ ...this.conflictCoverCourses, ...this.conflictNotCoverCourses ];
                        // 存在冲突就弹出提示窗口，待用户做后续操作，否则直接保存提交
                        if (this.conflictCourses.length) {
                            this.loopCourseDialogShow = !0;
                        } else {
                            this.saveLoopCourses();
                        }
                        
                    } else {

                    }
                })
                .catch(err => {
                    console.warn(err);
                });
        },
        // 关闭循环课程编辑弹窗，并清空对应数据
        cancelLoopCoursesDialog () {
            // 关闭弹窗，清空循环课程编辑缓存数据
            this.loopCourseDialogShow = !1;
            this.loopCoursesParam = null;
            this.conflictCourses = [];
            this.conflictCoverCourses = [];
            this.conflictNotCoverCourses = [];
            // 关闭右侧滑区，并清空对应排课编辑数据
            this.cancelCourseDrawer();
        },

        // 提交自由排课数据
        saveFreeCourses () {
            // if(this.studentName === '' || this.studentId === 0) {
            //     return this.$message({ type: 'warning', message: '请选择学生' })
            // }
            // let class_list = [];
            // let selectedTime = this.courseMultipleDate;
            // let startTime = this.curCourse.startTime.split('-')[0]
            // let endTime = this.curCourse.startTime.split('-')[1];
            // for(let time of selectedTime) {
            //     let {year, month, day} = this.formatTime(new Date(time).getTime() / 1000)
            //     let time_class = new Date(`${year}/${month}/${day} ${startTime}`).getTime()/1000
            //     let time_end = new Date(`${year}/${month}/${day} ${endTime}`).getTime()/1000
            //     let obj =  {
            //         time_class: time_class,
            //         time_end: time_end
            //     }
            //     class_list.push(obj)
            // }
            // try {
            //     await teacher.freeSave({
            //         student_id: this.studentId,
            //         teacher_id: this.teacherId,
            //         instrument_id: 1,
            //         operator_type: 10,
            //         platform: 1,
            //         class_list: class_list
            //     })
            //     this.$message({
            //         type: 'success',
            //         message: '排课成功'
            //     })
            //     this.teacherTime()
            //     this.getRelationStudents()
            //     this.isOpenCourseDrawer = false
            // } catch(e) {
            //     this.showErrorClass(e)
            // }
            if (this.freeCoursesParam) {
                // 学生id为0表示未选择学生，退出并提示
                if(this.freeCoursesParam.student_id === 0) {
                    return this.$message({ type: 'warning', message: '请选择学生' });
                }
                if (this.courseMode === 'add') {
                    teacher.freeSave(this.freeCoursesParam)
                        .then(res => {
                            let { code, data, msg } = res;
                            if (code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: msg
                                })
                                this.teacherTime();
                                this.getRelationStudents();
                                this.cancelFreeCoursesDialog();
                            }                      
                        }).catch(err => {
                            // http请求状态判断，200与非200
                            if (err.status === 200) {
                                let { code, data, msg } = err.data;
                                if (code !== 200) {
                                    // this.$message({
                                    //     type: 'warning',
                                    //     message: msg
                                    // });
                                }
                            } 
                            // 非200表示http请求失败
                            else if (err.status !== 200) {
                                
                            }
                        });
                } else if (this.courseMode === 'edit') {
                    teacher.saveEditClass(this.freeCoursesParam)
                        .then(res => {
                            let { code, data, msg } = res;
                            if (code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: msg
                                })
                                this.teacherTime();
                                this.getRelationStudents();
                                this.cancelFreeCoursesDialog();
                            } else {
                                
                            }                        
                        }).catch(err => {
                            // http请求状态判断，200与非200
                            if (err.status === 200) {
                                let { code, data, msg } = err.data;
                                if (code !== 200) {
                                    // this.$message({
                                    //     type: 'warning',
                                    //     message: msg
                                    // });
                                }
                            } 
                            // 非200表示http请求失败
                            else if (err.status !== 200) {
                                
                            }
                        });
                }
            }
        },
        /**
         * @description     
         */
        validateFreeCourse () {
            // if(this.studentName === '' || this.studentId === 0) {
            //     return this.$message({ type: 'warning', message: '请选择学生' })
            // }
            let class_list = [];
            let curCourse = [];
            let selectedTime = [];
            let params = {
                student_id: this.studentId,
                teacher_id: this.teacherId,
            };
            if ( this.courseMode === 'add') {
                curCourse = this.curCourse;
                selectedTime = this.courseMultipleDate;
                
            } else if (this.courseMode === 'edit') {
                curCourse = this.editCourse;
                selectedTime = [curCourse.dayTime];
                let year = curCourse.dayTime.split('-')[0]
                let month = curCourse.dayTime.split('-')[1]
                let day = curCourse.dayTime.split('-')[2]
                let hour = curCourse.startTime.split('-')[0]
                let timeStart = new Date(`${year}/${month}/${day} ${hour}`).getTime() / 1000;
                params.time_class = timeStart;
                params.duration = curCourse.courseDuration;
                params.class_id = this.currentClassInfo.classId;
            }
            // console.log();
            let duration = curCourse.courseDuration;
            let startTime = curCourse.startTime.split('-')[0];
            let endTime = curCourse.startTime.split('-')[1];
            
            for(let time of selectedTime) {
                let {year, month, day} = this.formatTime(new Date(time).getTime() / 1000)
                let time_class = new Date(`${year}/${month}/${day} ${startTime}`).getTime()/1000
                let time_end = new Date(`${year}/${month}/${day} ${endTime}`).getTime()/1000
                let obj =  {
                    time_class: time_class,
                    time_end: time_end,
                    duration,
                }
                class_list.push(obj);
            }
            console.log(class_list)
            // let curCourse = this.courseMode === 'add' ? this.curCourse : this.courseMode === 'edit' ? this.editCourse : this.curCourse;
            
            // 自主课程校验参数
            let freeValidateParams = { 
                student_id: this.studentId,
                teacher_id: this.teacherId,
                class_list
            }
            let saveType = this.freeCourseMode === 'add' ? 1 : 2;
            // 缓存自主排课数据
            if ( this.courseMode === 'add') {
                this.freeCoursesParam = { ...params, class_list }
            } else if (this.courseMode === 'edit') {
                this.freeCoursesParam = { 
                    ...params,                    
                    instrument_id: 1,
                    operator_type: 10,
                    platform: 1
                }
            }
            
            // 学生id为0表示未选择学生，退出并提示
            if(this.freeCoursesParam.student_id === 0) {
                return this.$message({ type: 'warning', message: '请选择学生' });
            }
        },

        // 关闭自主排课编辑弹窗，并清空对应数据
        cancelFreeCoursesDialog () {
            // 关闭弹窗，清空循环课程编辑缓存数据
            this.freeCourseDialogShow = !1;
            this.freeCoursesParam = null;
            this.conflictCourses = [];
            this.conflictCoverCourses = [];
            this.conflictNotCoverCourses = [];
            // 关闭右侧滑区，并清空对应排课编辑数据
            this.cancelCourseDrawer();
        },

        // 提交编辑单节课程
        async saveEditCourse() {
            try{
                let year = this.editCourse.dayTime.split('-')[0]
                let month = this.editCourse.dayTime.split('-')[1]
                let day = this.editCourse.dayTime.split('-')[2]
                let hour = this.editCourse.startTime.split('-')[0]
                let timeStart = new Date(`${year}/${month}/${day} ${hour}`).getTime() / 1000;
                
                await teacher.saveEditClass({
                    class_id: this.currentClassInfo.classId,
                    student_id: this.currentClassInfo.studentId,
                    teacher_id: this.teacherId,
                    time_class: timeStart,
                    duration: this.editCourse.courseDuration,
                    instrument_id: 1,
                    operator_type: 10,
                    platform: 1
                })
                this.$message({
                    type: 'success',
                    message: "修改排课成功"
                })
                this.teacherTime()
                this.getRelationStudents()
                this.cancelCourseDrawer()
            }catch(e) {
                this.showErrorClass(e)
            }
        },
        
        /**
         * @description     查询关联学生
         */
        async getRelationStudents() {
            const {data} = await teacher.fetchRelationStudents({
                teacherId: this.teacherId
            });
            this.relationStudents = data.users;
            // 初始化课程时长
            this.selectMinutes = data.sysClassRoomTimeDtos.map((it, index) => {
                return {
                    id: index, 
                    value: it.timeValue
                }
            });
            this.selectMinute = this.selectMinutes[0] && this.selectMinutes[0].value || 25;

            
            if (this.studentOptions.length) {

            } else {
                this.studentOptions = this.students.map(it => {
                    let student = { isShow: !0, ...it };
                    if (this.relationStudents.find(rel => rel.id === student.id)) {
                        student.checked = !0;
                    } else {
                        student.checked = !1;
                    }
                    
                    return student;
                });
            }
            
            // this.selectedRelationStudents = this.relationStudents.map(it => (it.checked = !0, it))
            // this.studentOptions.forEach(it => {
            //     if (this.relationStudents.find(rel => rel.id === student.id)) {
            //         it.checked = !0;
            //     }
            // });
        },
        // 新增学生排课
        addStudent() {
            // 清空搜索框
            this.searchStudent = '';
            this.isAddStudent = !this.isAddStudent;
            this.isAddStudent === !0 && this.cacheStudentOptions();
            this.isAddStudent === !1 && this.resetSelectedRelationStudents();
        },
        
        // 取消新增关联学生
        closeAddStudent () {
            // 清空搜索框
            this.searchStudent = '';    
            this.isAddStudent = !1;
            this.resetSelectedRelationStudents();
            

            // let selIndex = this.selectedRelationStudents.findIndex(it => student.id === it.id);
            // if (idx === -1) return;
            // let curOption = this.studentOptions[idx];
            // this.studentOptions[idx].checked = !1;
            // this.selectedRelationStudents.splice(selIndex, 1);
        },
        // 回撤到上一次数据快照
        resetSelectedRelationStudents () {
            this.studentOptions.forEach(option => {
                if (this.selectedRelationStudentsCache.find(it => option.id === it.id)) {
                    option.checked = !0;
                } else {
                    option.checked = !1;
                }
            });
            this.selectedRelationStudents.splice(0, this.selectedRelationStudents.length, ...this.selectedRelationStudentsCache);
            // 重置筛选项显示状态
            this.resetSelectStudenOptions()
        },
        resetSelectStudenOptions () {
            // 重置筛选项显示状态
            this.studentOptions.forEach(it => {
                it.isShow = !0;
            });
        },
        changeSelectedRelationStudents () {
            
        },
        /**
         * @description     更新关联学生
         */
        updateRelationStudents (event, selected) {
            // let selectedRelationStudents = Array.isArray(selected) ? selected : this.selectedRelationStudents; 
            let updateStudens = this.selectedRelationStudents.map(student => ({
                teacherId: this.teacherId,
                userId: student.id,
                userName: student.userName,
                mobile: student.mobile,
            }));
            // console.log('更新已选的学生', this.selectedRelationStudents);
            this.isUpdateRelationStudents = !0;
            teacher.updateRelationStudents({teacherId: this.teacherId, userInfoList: updateStudens})
                .then(async res => {
                    if (res.code === 200) {
                        await this.getRelationStudents();
                        this.isUpdateRelationStudents = !1;
                        this.isAddStudent = !1;
                        this.$message({type: 'success', message: '操作成功，关联学生已更新'});
                        this.resetSelectStudenOptions()
                    }
                    
                })
                .catch(err => {
                    this.isUpdateRelationStudents = !1;
                    this.isAddStudent = !1;
                    this.resetSelectStudenOptions();
                });
            
        },
        // 缓存学生筛选项状态
        cacheStudentOptions () {
            // this.studentOptionsCache = this.studentOptions.map(it => ({ ...it }));
            this.selectedRelationStudentsCache = this.selectedRelationStudents.map(it => it);
        },
        /**
         * @description     删除关联学生
         */
        deleteStudent (student) {
            // 调用删除接口
            // let selectedRelationStudents = this.selectedRelationStudents.filter(rel => rel.id !== student.id);
            if (!student) return;

            let updateStudens = this.relationStudents.filter(it => student.id !== it.id).map(student => ({
                teacherId: this.teacherId,
                userId: student.id,
                userName: student.userName,
                mobile: student.mobile,
            }));

            this.isUpdateRelationStudents = !0;
            teacher.updateRelationStudents({teacherId: this.teacherId, userInfoList: updateStudens})
                .then(async res => {
                    if (res.code === 200) {
                        await this.getRelationStudents();
                        this.isUpdateRelationStudents = !1;
                        // 手动同步筛选框筛选状态
                        this.$nextTick(() => {
                            let idx = this.studentOptions.findIndex(it => student.id === it.id);
                            let selIndex = this.selectedRelationStudents.findIndex(it => student.id === it.id);
                            // console.log(idx, selIndex);
                            if (idx === -1) return;
                            let curOption = this.studentOptions[idx];
                            this.studentOptions[idx].checked = !1;
                            this.selectedRelationStudents.splice(selIndex, 1);

                            // console.log('更新筛选项', this.studentOptions);
                            // console.log('更新已选', this.selectedRelationStudents);
                        });
                        this.$message({type: 'success', message: '关联学生删除成功'});
                    }
                })
                .catch(err => {
                    this.$message({type: 'warn', message: '删除失败，请联系管理员'});
                    this.studentOptions = this.studentOptionsCache;
                    this.isUpdateRelationStudents = !1;
                });
        },
        /**
         * @description     关联学生搜索change事件
         */
        changeSearchStudent () {
            this.isSearchStudent = !1;
        },
        /**
         * @description     模糊搜索关联学生
         */
        gotoSearchStudent (value) {
            this.isSearchStudent = !!value.trim();
            this.studentOptions.forEach(it => {
                if (it.mobile.indexOf(value) > -1 || it.userName.indexOf(value) > -1) {
                    it.isShow = !0;
                } else {
                    it.isShow = !1;
                }
            });
            // this.searchRelationStudents = this.studentOptions.filter(it => {
            //     return it.mobile.indexOf(value) > -1 || it.userName.indexOf(value) > -1;
            // });
        },
        /**
         * @description     脱离搜索框
         */
        outSearchStudent () {
            this.isSearchStudent = !1;
            
        },
        /**
         * @description     批量处理
         */
        gotoBatchImport () {
            // 上传状态设为未上传
            this.importStatus = 0;
            this.errorList = [];
            this.importDialogShow = !0;
        },
        /**
         * @description     关闭上传窗口
         */
        closeImportDialog () {
            if (this.importStatus === 1) {
                return;
            }
            // 上传状态设为未上传
            this.importStatus = 0;
            this.errorList = [];
            this.batchImportData = [];
            this.importDialogShow = !1;
            this.$refs.$batchImport.value = '';
        },
        /**
         * @description     准备导入操作
         */
        readyBatchImport (e) {
            this.$refs.$batchImport.click();
        },
        /**
         * @description     每次选择新文件时回调
         */
        changeImportFile (e) {
            let target = e.target;
            let files = target.files;
            this.batchImportData = [];
            this.excel2Json(files, (fileData) => {
                if (fileData && fileData.length) {
                    fileData = fileData.map(row => {
                        // 每条数据都先插入当前老师id
                        let file = {teacherId: this.teacherId}
                        for (let [key, value] of Object.entries(row)) {
                            file[assignTeacherUser[key]] = value;
                        }
                        return file;
                    });
                    // 开始上传
                    if (fileData.length) {
                        this.importStatus = 1;
                       
                    }
                }
            });
        },
        /**
         * @description     excel数据转换为json
         * @param       {Array}     files
         */
        excel2Json (files = [], callback = f => f) {
            
            // let target = e.target;
            let wb = '';
            let rABS = false;
            // let files = target.files;
            if (!files.length) {
                return;
            }
            let file = files[0];
            // this.fileName = file.name;
            // eventBus.$emit('fileCheckData', {fileName: f.name});
            let reader = new FileReader();
            // let _this = this
            reader.onload = (e) => {
                let data = e.target.result;
                if (rABS) {
                    wb = XLSX.read(btoa(fixdata(data)), {//手动转化
                        type: 'base64'
                    });
                } else {
                    wb = XLSX.read(data, {
                        type: 'binary',
                        raw: true
                    });
                }
                //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                //wb.Sheets[Sheet名]获取第一个Sheet的数据
                let json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
                console.log(json)
                // if(json && json.length) {
                //     json.shift();
                //     this.importStatus = !0;
                // }
                
                
                if (json.length > 200) {
                    // this.importStatus = !1;
                    this.$message({ message: '单次最多200条', type: 'warning' });
                    return;
                } 
                this.batchImportData = json;
                callback(json);
            }
            if (rABS) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsBinaryString(file);
            }
            
        },
    },
    
    
}
</script>
<style lang="less">

    .el-calendar-table .el-calendar-day{
        height: 50px;
    }
    .el-calendar-table:not(.is-range) td.next .el-calendar-day .schedule-detail-calendar-val, .el-calendar-table:not(.is-range) td.prev .el-calendar-day .schedule-detail-calendar-val{
            color: #C0C4CC;
    }
    .el-drawer__open .el-drawer.rtl{
        overflow-y: auto;
    }
    .el-drawer__body{
        height: 100%;
        overflow: hidden;
    }
</style>
<style lang="less" scoped>
@import '../../assets/css/mixin';
    .schedule-detail{
        padding: 0 20px 20px;
    }
    .schedule-detail-info{
        display: flex;
        background: rgb(217, 236, 255);
        padding: 15px;
        width: max-content;
        position: relative;
    }
    .course-add,
    .course-edit{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .schedule-detail-box{
        margin-right: 40px;
        display: flex;
        flex-direction: column;
    }
    .schedule-detail-info-value{
        font-size: 24px;
        font-weight: 600;
        line-height: 28px;
    }
    .schedule-detail-info-input{
        width: 100px;
        border: 1px solid #c1c1c1;
        border-radius: 3px;
        background: transparent;
    }
    .schedule-detail-info-phone{
        width: 147px;
    }
    .schedule-detail-info-val{
        font-size: 12px;
        color: #606266;
    }
    .schedule-detail-edit{
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        color: #409EFF;
    }
    .schedule-detail-main{
        .flex(flex-start, flex-start);
        // display: flex;
    }
    .schedule-detail-left{
       width: 760px;
       min-width: 700px;
    }
    .schedule-detail-left-main{
        display: flex;
        width: 100%;
    }
    .schedule-detail-left-value{
        line-height: 24px;
        color: #333;
        font-weight: 600;
        margin-top: 20px;
        padding-left: 20px;
    }
    .schedule-detail-calendar{
        width: 100%;
    }
    .schedule-detail-calendar-day{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .schedule-detail-calendar-val{
        color: #333;
        font-weight: 600;
    }
    .schedule-detail-calendar-val.active{
        color: #fd5e01;
    }
    .schedule-detail-calendar-class {
        color: #C0C4CC;
        font-size: 12px;
    }
    .schedule-detail-day-detail{
        margin-left: 20px;
        margin-top: 54px;
        padding: 20px 20px 0 20px;
        background: #f3dddd;
        max-height: 335px;
        overflow-y: auto;
       
    }
    .schedule-detail-day-val{
        font-size: 12px;
        color: #606266;
        width: 160px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        
    }
    .schedule-detail-day-title{
        flex: 1;
    }
    .schedule-detail-day-class{
        margin-bottom: 20px;
        font-size: 12px;
        display: flex;

    }
    .schedule-detail-day-class-val{
        flex: 1;
    }
    .schedule-detail-day-name{
        color: #409eff;
        cursor: pointer;
        font-weight: 600;
    }

    .schedule-detail-right{
        margin-left: 30px;
        width: 360px;
        min-width: 300px;
    }
    
    .schedule-detail-right-add{
        background: #409eff;
        cursor: pointer;
        color: #fff;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 2px;
        font-weight: 600;
    }
    .schedule-detail-right-student{
        height: 100%;
        display: flex; 
        flex-direction: column;
    }
    .schedule-detail-right-student-info{
        display: flex;
    }
    .schedule-detail-right-student-name,
    .schedule-detail-right-student-phone{
        display: flex;
        flex-direction: column;
    }
    .schedule-detail-right-student-name-val{
        color: #c0c4cc;
        margin-bottom: 10px;
    }
    .schedule-detail-right-student-phone{
        margin-left: 20px;
    }
    .schedule-detail-right-time{
        margin-top: 60px;
        max-height: 240px;
        overflow-y: auto;
    }
    .schedule-detail-right-selects{
        margin-top: 10px;
    }
    .schedule-detail-right-select{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .schedule-detail-right-select-picker{
        width: 150px;
    }
    .schedule-detail-right-select-time{
        // margin-left: 10px;
    }
    .schedule-detail-right-select-min{
         width: 100px;
    }
    .schedule-detail-right-select-val{
        margin: 0 0 0 5px;
        // padding: 10px;
        // background: #ccc;
        // border-radius: 4px;
        font-size: 12px;
        // cursor: pointer;
    }
    
    .schedule-detail-right-select-add{
        margin-left: 10px;
        color: #409eff;
        cursor: pointer;
    }
    .schedule-detail-right-select-close{
        color: #F56C6C;
        margin-left: 10px;
        cursor: pointer;
    }
    .schedule-detail-btns{
        display: flex;
        justify-content: flex-end;
    }
    .schedule-detail-btn{
        margin: 20px 0;
        padding: 5px 10px;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
    }
    .schedule-detail-cancel{
        margin-right: 10px;
        border: 1px solid #ccc;
    }
    .schedule-detail-save{
        background: #409eff;
        border: 1px solid #409eff;
        color: #fff;

    }
    .schedule-detail-day-detail-empty{
        width: 200px;
        height: 335px;
    }
    .schedule-detail-right-no{
        background: #f0f2f5;
        font-size: 14px;
        line-height: 16px;
        color: #737070;
        padding: 10px;
        margin-top: 10px;
    }


    // 2020-02-19
    .pos-sticky-relative {
        position: relative;
    }
    .pos-sticky {
        position: sticky;
        top: 0;
    }
    
    .student-hd{
        padding: 0 10px;
        .flex(space-between);
        // margin: 0 0 10px;
        height: 36px;
        // line-height: 24px;
        color: #333;
        font-weight: 600;
        border-color: #ddd;
        border-width: 1px 1px 0;
        border-style: solid;
        background-color: #fcfcfc;
        .btn-add-student {
            margin: 0 0 0 10px;
            .wh(60px; 24px);
            background-color: #409eff;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
        }
    }
    .student-box {
        padding: 10px;
        height: 260px;
        border: #ddd solid 1px;
        // background-color: #fefefe;
        overflow-y: auto;
        .student-list {
            .item {
                margin: 0 8px 8px 0;
                padding: 0 6px;
                display: inline-block;
                background-color: #E7F7FF;
                border: #409EFF solid 1px;
                border-radius: 3px;
                line-height: 20px;
                color: #409EFF;
                font-size: 12px;
                cursor: pointer;
                .icon-delete {
                    margin: 3px 0 0 8px;
                    display: inline-block;
                    .wh(10px, 14px);
                }
                .icon-delete::before {
                    // position: absolute;
                    display: block;
                    content: '×';
                    margin: 0;
                    line-height: 14px;
                    font-size: 14px;
                    color: #999;
                }

                .icon-delete:hover::before {
                    color: #D10915;
                }
            }
            .item:hover {
                background-color: #dff5ff;
                color: #2a91f9;
            }
        }
    }
    .student-add-box {
        padding: 10px;
        // height: 400px;
        border: #ddd solid 1px;
        .student-input {
            // padding: 10px 0 0;
        }
        .student-list {
            margin: 10px 0;
            overflow-y: auto;
            overflow-x: hidden;
            height: 180px;
            .select-box {
                // padding: 10px 0 0;
                .select-item {
                    padding: 5px;
                }
                .select-item:hover {
                    background-color: #E7F7FF
                }
            }
        }
        .student-foot {
            .flex(flex-end);
            padding: 10px 0 0;
            border-top: #ddd solid 1px;
            button {
                margin: 0 10px 0 0;
                .wh(60px; 28px);
                border-radius: 4px;
                cursor: pointer;
            }
            .btn-cancel {
                border: #ddd solid 1px;
            }
            .btn-submit {
                background-color: #409EFF;
                color: #fff;
            }
        }
    }
    .schedule-detail-right-student {
        padding: 20px;
    }
    .course-type-box {
        margin: 10px 0 0;
        padding: 10px 0;
    }
    .course-free-box {
        .foot {
            margin: 20px 0 0;
            padding: 20px 0 0;
            border-top: #ddd solid 1px;
            .flex();
            .btn-cancel,
            .btn-submit {
                .wh(60px; 30px;);
                border-radius: 5px;
                cursor: pointer;
            }
            .btn-cancel {
                margin: 0 10px 0 0;
                border: #ddd solid 1px;
            }
            .btn-submit {
                background-color: #409eff;
                color: #fff;
            }
        }
    }
    .course-free-loop{
        flex: 1;
        display: flex;
        flex-direction:column;
        overflow: hidden;
    }
    .course-date-box {
        margin: 10px 0 0;
    }
    .course-mutiple-date-box {
        position: relative;
        .flex();
        margin: 10px 0 0;
        .course-mutiple-date {
            .wh(80px; 30px;);
            overflow: hidden;
        }
        .btn-course-date {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            .wh(80px; 32px;);
            background-color: #409eff;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
        }
        .selected-course {
            margin: 0 0 0 10px;
            font-size: 12px;
        }
    }
    .course-datetime-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 20px 0 0;
        overflow: hidden;
        .course-time {
            margin: 10px 0 0;
        }
    }
    .course-rows{
        flex: 1;
        overflow-y: auto;
    }
    .course-row {
        .flex();
        margin-bottom: 10px;
    }
    .course-day-picker,
    .course-time-picker,
    .course-duration-picker {
        margin: 0 10px 0 0;
        width: 120px;
    }
    .course-time-picker {
        width: 150px;
    }
    .cancel-class{
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 9999;
    }
    .cancel-class-main{
        position: absolute;
        padding: 20px;
        top: 50%; 
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        width: 420px;
        padding-bottom: 10px;
        vertical-align: middle;
        border-radius: 4px;
        border: 1px solid #EBEEF5;
        font-size: 18px;
    }
    .cancel-class-title{
        display: flex;
        justify-content: flex-end;
        span {
            width: max-content;
            cursor: pointer;
        }
    }
    .cancel-class-content{
        display: flex;
        flex-direction: column;
    }
    .cancel-class-name{
        font-size: 16px;
        color: #409eff;
        margin-bottom: 10px;
    }
    .cancel-class-time{
        font-size: 14px;
        display: flex;
        align-items: center;
        span{
            margin-right: 5px;
        }
        span:last-child{
            margin-right: 0px;
        }
    }
    .cancel-class-btns{
        margin-top: 10px;
        display: flex;
        font-size: 12px;
        justify-content: flex-end;
    }
    

    // 2020-02-26
    .course-card {
        .course-body {
            width: 100%;
        }
        .course-info {
            .content {
                display: flex;
            }
            .cell {
                margin: 0 20px 0 0;
                padding: 0 2px;
                line-height: 24px;
                border-bottom: #ddd solid 2px;
            }
            .status {
                margin: 15px 0 0;
                line-height: 20px;
                .not-begin,
                .in-progress,
                .finish,
                .abnormal {
                    position: relative;
                    padding: 0 0 0 20px;
                }
                .not-begin:before,
                .in-progress:before,
                .finish:before,
                .abnormal:before {
                    position: absolute;
                    left: 3px;
                    top: 5px;
                    content: '';
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #ddd;
                }
                .in-progress:before {
                    background-color: #1aa260;
                }
                .finish:before {
                    background-color: #409eff;
                }
                .abnormal:before {
                    background-color: #de001a;
                }
            }
        }
        .course-footer {
            // display: flex;
            // justify-content: flex-end;
            height: 30px;
            .toolbar {
                display: flex;
                justify-content: flex-end;
            }
            // .cancel-class-btn{
            //     padding: 5px 10px;
            //     background: #409eff;
                
            //     border-radius: 4px;
            //     cursor: pointer;
            //     color: #fff;
            // }
            // .cancel-class-cancel{
            //     background-color: #fff;
            //     border: 1px solid #EBEEF5;
            // }
            .btn-cancel, 
            .btn-ok {
                margin: 0 0 0 5px;
                padding: 5px 10px;
                background-color: #409eff;
                
                border-radius: 4px;
                cursor: pointer;
                color: #fff;
            }
            .btn-cancel {
                background-color: #de001a;
                // border: 1px solid #ddd;
                color: #fff;
            }
        }
    }

    .conflict-dialog,
    .import-dialog {
        .bd {
            width: 100%;
        }
        .info {
            .content {
                // display: flex;
            }
            
            .title {
                margin: 0 0 10px;
                font-size: 16px;
                font-weight: 600;
            }
            .msg {
                .conflict {
                    margin: 0 2px;
                    font-weight: 600;
                    color: #409eff;
                }
            }
        }
        .footer {
            // display: flex;
            // justify-content: flex-end;
            height: 30px;
            .toolbar {
                display: flex;
                justify-content: flex-end;
            }
            .btn-cancel, 
            .btn-ok {
                margin: 0 0 0 5px;
                // padding: 5px 10px;
                width: 60px;
                line-height: 30px;
                background-color: #409eff;
                border-radius: 4px;
                cursor: pointer;
                color: #fff;
            }
            .btn-cancel {
                background-color: #fff;
                border: 1px solid #ddd;
                color: #666;
            }
            .btn-import {
                display: none;
            }
        }
    }
    .conflict-dialog {
        .info {
            // display: flex;
        }
        .content {
            margin: 0 0 5px;
            // width: 50%;
            p {
                font-size: 13px;
                font-weight: 500;
            }
        }
        .class-box {
            margin: 10px 0;
            padding: 10px;
            height: 150px;
            background-color: #e6f7ff;
            border: #91d5ff solid 1px;
            overflow-y: auto;
        }
        .class-box.not-cover {
            background-color: #f6f6f6;
            border: #ccc solid 1px;
        }
        .class-list {
            
            li {
                // margin: 5px 0 0;
                // padding: 0 10px;
                height: 28px;
                display: flex;
                line-height: 28px;
                font-size: 13px;
                .cell {
                    margin: 0 15px 0 0;
                }
                .cell.name {
                    min-width: 60px;
                    max-width: 150px;
                    white-space:nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .cell:last-child {
                    margin: 0;
                }
            }
        }
    }
        
    .import-dialog {
        .btn-download {
            display: inline-block;
            margin: 0 0 0 5px;
            padding: 0 5px;
            background-color: #409eff;
            border-radius: 3px;
            line-height: 20px;
            font-size: 13px;
            color: #fff;
        }
        .footer {
            display: flex;
            justify-content: flex-end;
        }
    }
    .error-box {
        padding: 10px;
        min-height: 50px;
        max-height: 200px;
        background-color: #f6f6f6;
        overflow-y: auto;
    }
    .error-list {
        li {
            // margin: 0 0 5px;
            padding: 0 10px;
            line-height: 28px;
            border-bottom: #ddd dashed 1px;
            background-color: #fff;
        }
    }
</style>