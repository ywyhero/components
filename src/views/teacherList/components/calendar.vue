<template>
    <div class="week-calendar">
        <div class="week-calendar-title week-calendar-toolbar-sticky">
            <!-- 左侧翻页及日期 -->
            <div class="lf">
                <div class="week-calendar-btns" v-if="!isDragDrop">
                    <span class="week-calendar-btn btn-prev" @click="preWeek">上一周</span>
                    <span class="week-calendar-btn btn-current " @click="nowWeek">{{currentWeekVal}}</span>
                    <span class="week-calendar-btn" @click="nextWeek">下一周</span>
                </div>
                <span class="week-calendar-date" v-if="!isDragDrop">{{year}}年 第{{week}}周 {{date}}</span>
                <div class="" v-if="isDragDrop">已选<span class="delete-selected">{{deleteSelectedCourses.length}}</span>节课</div>
            </div>
            <!-- 右侧操作区 -->
            <div class="rt">
                <button 
                    v-if="!isDragDrop"
                    class="btn-batch-operate" 
                    @click="gotoBatchOperation">批量修改</button>
                <button 
                    v-if="isDragDrop"
                    class="btn-save " 
                    :disabled="!deleteSelectedCourses.length"
                    @click="batchDeleteCourses">批量取消课程</button>
                <button 
                    v-if="isDragDrop"
                    class="btn-cancel" 
                    @click="cancelBatchOperation">退出</button>
            </div>
            
        </div>
        <div class="week-calendar-header week-calendar-header-sticky">
            <div class="week-calendar-header-time">
                <span class="week-calendar-value">时间</span>
                <div 
                    class="week-calendar-val week-thead" 
                    :class="nowTimeStamp === item.timeStamp ? 'active' : ''" 
                    v-for="(item, index) in weekCalendar" 
                    :key="index">
                    <div class="week-thead-drag" 
                        :class="{
                            'drag-active': currentDragColumn.timeStamp === item.timeStamp
                        }"
                        v-if="isDragDrop" 
                        @click="gotoDragColumn(item, $event)">
                        <span class="week-calendar-val-day">{{item.day}}</span>
                        <span class="week-calendar-val-week">{{item.week}}</span>
                        <el-checkbox 
                            v-if="isDragDrop && item.courses.length" 
                            class="column-delete-select" 
                            v-model="item.isSelectedColumnCourses"
                            :indeterminate="item.selectedColumnIndeterminate"
                            @change="selectColumnCourse(item, index, $event)"></el-checkbox>
                    </div>
                    <div class="" v-else>
                        <span class="week-calendar-val-day">{{item.day}}</span>
                        <span class="week-calendar-val-week">{{item.week}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="week-calendar-main" 
            :class="{
                'undraggable-box': !isDragDrop,
                'draggable-box': isDragDrop,
            }">
            <div class="week-calendar-main-time">
                <div class="week-calendar-main-hour" 
                    v-for="(item, index) in hours" 
                    :key="index">
                    <!-- 一刻钟刻度 -->
                    <div class="quarter-box" v-if="isDragDrop && dragDropMode === 'cell'">
                        <span 
                            class="quarter-cell"
                            :class="{
                                'active': currentEnterQuater.hour === item.value && currentEnterQuater.quarterIndex === qIndex
                            }"
                            v-for="(quarter, qIndex) in quarters" 
                            :key="qIndex" 
                            v-show="qIndex > 0">
                            {{`${item.hour}:${quarter}`}}
                        </span>
                    </div>
                    <!-- 小时刻度 -->
                    <div 
                        class="hour-cell" 
                        :class="{
                            'active': currentEnterQuater.startHour === item.value && currentEnterQuater.quarterIndex === 0,
                            
                        }"
                        v-if="index !== (hours.length - 1)">{{item.value}}</div>
                </div>
            </div>
            <div class="week-calendar-main-days" ref="$calendarBox">
                <div class="week-calendar-main-day" 
                    :class="{
                        'colomn-active': isDragDrop && currentDragColumn.timeStamp === item.timeStamp,
                        'active': nowTimeStamp === item.timeStamp,
                        'column-hover': isDragDrop && dragDropMode === 'column' && currentEnterColumn.timeStamp === item.timeStamp
                    }" 
                    v-for="(item, index) in weekCalendar" 
                    :key="index"
                    :draggable="isDragDrop && dragDropMode === 'column' && currentDragColumn.timeStamp === item.timeStamp"
                    @drop="columnDrop(item, index, $event)"
                    @dragstart="dragColumnStart(item, index, $event)"
                    @dragenter="dragColumnEnter(item, index, $event)"
                    @dragleave="dragColumnLeave(item, index, $event)"
                    @dragover.prevent>
                    <div class="week-calendar-day-hours"
                        :class="{
                            'drag-active': currentEnterQuater.date === item.timeStamp
                        }">
                        <!-- 拖拽 -->
                        <div 
                            class="week-calendar-day-hour droppable" 
                            :class="{ 
                                'active': currentEnterQuater.date === item.timeStamp && currentEnterQuater.hour === itm.value && itm.startHour <= 22,
                                'disabled': itm.startHour > 22
                            }"
                            v-for="(itm, idx) in hours" 
                            @click="handleCellEvent(item, itm, $event)" 
                            :key="idx">
                            <div 
                                v-show="isDragDrop && dragDropMode === 'cell'"
                                class="quarter" 
                                v-for="(quarter, qIndex) in quarters" 
                                :class="{ 
                                    'cell-hover': currentEnterQuater.hour === itm.value && currentEnterQuater.quarter === quarter && (itm.startHour < 22 || itm.startHour === 22 && quarter === '00'),
                                    'disabled': itm.startHour > 22 || itm.startHour === 22 && quarter !== '00'
                                }"
                                :key="qIndex"
                                
                                @drop="quarterDrop(item, itm, quarter, idx, qIndex, $event)"
                                @dragenter="dragCellEnter(item, itm, quarter, idx, qIndex, $event)"
                                @dragleave="dragCellLeave(item, itm, quarter, idx, qIndex, $event)"
                                @dragover.prevent>
                            </div>
                            <!-- <div class="week-calendar-day-half-hour"></div> -->
                        </div>
                    </div>
                    <div class="week-calendar-day-calsses" v-show="item.courses.length > 0">
                        <div 
                            class="week-calendar-day-calss draggable" 
                            @dragstart="dragCellStart(item, itm, courseIndex, $event)"
                            @dragend="dragCellEnd"
                            @click="handleTaskEvent(item, itm, $event)"
                            v-for="(itm, courseIndex) in item.courses" 
                            :key="courseIndex"
                            :class="{
                                'week-calendar-day-calss-25': itm.duration === 25,
                                'week-calendar-day-calss-30': itm.duration === 30,
                                'week-calendar-day-calss-35': itm.duration === 35,
                                'week-calendar-day-calss-40': itm.duration === 40,
                                'week-calendar-day-calss-45': itm.duration === 45,
                                'week-calendar-day-calss-50': itm.duration === 50,
                                'week-calendar-day-calss-55': itm.duration === 55,
                                'week-calendar-day-calss-60': itm.duration === 60,
                                'week-calendar-day-calss-65': itm.duration === 65,
                                'week-calendar-day-calss-70': itm.duration === 70,
                                'week-calendar-day-calss-75': itm.duration === 75,
                                'course-end': itm.courseStatus === 2,
                                'course-in-progress': itm.courseStatus === 1,
                                'course-not-start': item.courseStatus === 0,
                                'dragging': currentDragItem.course && currentDragItem.course.classId === itm.classId,
                                'draggable-cell': isDragDrop && dragDropMode === 'cell',
                            }"
                            :style="{top: itm.top + 'px'}"
                            :draggable="isDragDrop && dragDropMode === 'cell'">
                                <p class="name">{{itm.name}}</p>
                                <p class="time">{{itm.time}}</p>
                                <!-- <i class="delete-select">
                                    <span class=""></span>
                                </i> -->
                                <el-checkbox 
                                    v-if="isDragDrop" 
                                    class="delete-select" 
                                    v-model="itm.selected"
                                    @change="selectCourse(item, itm, $event )"></el-checkbox>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { teacher } from '../../../service';
    export default {
        props: {
            // 开始日期时间戳
            startDayTime: {
                type: Number,
                required: !1,
            },
            // 排课课程列表
            courses: {
                type: Array | Object,
                required: !0,
                default: [],
            },
            // 单元事件
            cellEvent: {
                type: Function,
                required: !1,
                default: f => f
            },
            // 任务事件
            taskEvent: {
                type: Function,
                required: !1,
                default: f => f
            },
            // 切换开始日期
            changeStartDay: {
                type: Function,
                required: !1,
                default: f => f
            },
            // 任务删除事件
            deleteTaskEvent: {
                type: Function,
                required: !1,
                default: f => f
            }
        },
        data() {
            return {
                weekCalendar: [], // 周数据数组
                quarters: ['00', '15', '30', '45'],     // 刻度
                hours: [ 
                    { value: '08:00', hour: '07', startHour: 7 },
                    { value: '09:00', hour: '08', startHour: 8 },
                    { value: '10:00', hour: '09', startHour: 9 },
                    { value: '11:00', hour: '10', startHour: 10 },
                    { value: '12:00', hour: '11', startHour: 11 },
                    { value: '13:00', hour: '12', startHour: 12 },
                    { value: '14:00', hour: '13', startHour: 13 },
                    { value: '15:00', hour: '14', startHour: 14 },
                    { value: '16:00', hour: '15', startHour: 15 },
                    { value: '17:00', hour: '16', startHour: 16 },
                    { value: '18:00', hour: '17', startHour: 17 },
                    { value: '19:00', hour: '18', startHour: 18 },
                    { value: '20:00', hour: '19', startHour: 19 },
                    { value: '21:00', hour: '20', startHour: 20 },
                    { value: '22:00', hour: '21', startHour: 21 },
                    { value: '23:00', hour: '22', startHour: 22 },
                    { value: '24:00', hour: '23', startHour: 23 }
                ], // 左侧小时表
                defaultStartTime: 0,         // 初始化默认起始时间
                nowTimeStamp: 0, // 当前的时间戳
                startTime: 0, // 开始时间
                endTime: 0, // 结束时间
                year: 2020, // 本年
                date: '', // 日期
                week: 0, // 第几周
                ratio: 20, // 高度倍数（top计算用）
                currentCourses: [], // 当前的课程
                currentWeekVal: '本周',

                currentDragItem: {},        // 当前拖拽的元素
                currentDragColumn: {},          // 当前拖拽列
                currentEnterColumn: {},     // 拖拽列时经过的列
                currentEnterQuater: {},     // 拖拽课程经过的单元
                isDragDrop: !1,             // 是否可拖拽编辑状态
                dragDropMode: 'cell',   // 操作模式：cell - 操作单元格；column - 操作列
            }
        },
        created() {
            // 配置日历
            this.configWeek();
            this.$nextTick(() => {
                
            });
        },
        mounted () {

        },
        computed: {
            deleteSelectedCourses () {
                return (this.weekCalendar.reduce((prev, cur, index) => {
                    
                    return [ ...prev, ...cur.courses.filter(it => it.selected) ]
                }, []) || []);
            }
            // startTime () {
            //     return this.startDayTime && this.startDayTime < 9999999999 ? this.startDayTime * 1000 : this.startDayTime;
            // }
        },
        watch: {
            courses(newVal) {
                // this.currentCourses = newVal
                this.calenderUpdate();          
            }
        },
        methods: {

            /**
             * @description     设置当前周默认数据
             * @param   {number}    startWeek   日历起始周天，从周一开始，起始为1
             * @return  {number}    起始天的时间戳
             */
            configWeek(startWeek = 1) {
                let nowTimeStamp = new Date().getTime() / 1000;
                let { week, timeStamp } = this.formatTime(nowTimeStamp);
                this.nowTimeStamp = timeStamp
                let startTime = timeStamp * 1000 - (week - startWeek) * 24 * 60 * 60 * 1000;
                this.startTime = this.defaultStartTime = startTime;
                // console.log(startTime)
                // this.calenderUpdate();
            },
            /**
             * @description     更新日历数据
             */
            calenderUpdate(startTime = this.startDayTime) {
                // 
                startTime = startTime ? startTime < 9999999999 ? startTime * 1000 : startTime : this.defaultStartTime;
                let weekCalendar = [];
                let data = [];
                let { year, month, day, week, timeStamp } = this.formatTime(startTime / 1000);
                this.week = this.getYearWeek(year, month, day)
                if(this.courses.length < 0) {
                    return
                }
                for(let course of this.courses) {
                    for(let list of course.class_list) {
                        data.push(list)
                    }
                }
                for(let i = 0; i < 7; i++) {
                    let tempTimeStamp = startTime + i * 24 * 60 * 60 * 1000;
                    let dayEndTimeStamp = startTime + i * 24 * 60 * 60 * 1000 + (24 * 60 * 60 - 1)* 1000;
                    let tempTime = this.formatTime(tempTimeStamp / 1000);
                    let courses = [];
                    for(let item of data) {
                        if(item.time_class * 1000 > tempTimeStamp && item.time_class * 1000 < dayEndTimeStamp ) {
                            let {hour,minutes} = this.formatTime(item.time_class);
                            let endTime = this.formatTime(item.time_end);
                            let top = (Number(hour) - 7) * 60 * 20 / 10 + Number(minutes) * 20 / 10;
                            let classObj = {
                                top: top ,
                                name:           item.student_name,      // 学生名
                                studentId:      item.student_id,        // 学生id
                                studentMobile:  item.student_mobile,
                                time:           `${hour}:${minutes}-${endTime.hour}:${endTime.minutes}`,
                                duration:       item.class_duration,
                                isFixedClass:   item.is_fix_class,
                                timeClass:      item.time_class,
                                classId:        item.class_id,
                                selected:       !1,
                                courseStatus:   item.courseStatus,      // 初始化时课程状态
                            }
                            courses.push(classObj)
                        }
                    }
                    
                    let obj = {
                        day: tempTime.day,
                        month: tempTime.month,
                        week: this.formatWeek(tempTime.week),
                        timeStamp: tempTime.timeStamp,
                        startTime: tempTimeStamp,
                        datetime: tempTime,
                        courses: courses,
                        isSelectedColumnCourses: !1,
                        selectedColumnIndeterminate: !1
                    }
                    weekCalendar.push(obj)
                } 
                
                let endTime = weekCalendar[weekCalendar.length - 1].timeStamp * 1000 + (24 * 60 * 60 - 1) * 1000;
                let startDate = this.formatTime(startTime / 1000);
                let endDate = this.formatTime(endTime / 1000);
                this.year = startDate.year;
                this.endTime = endTime
                this.date = `${startDate.month}月${startDate.day}日-${endDate.month}月${endDate.day}日`
                this.weekCalendar = weekCalendar
                console.log('update', weekCalendar)
            },
            /**
             * @description     开始批量操作
             */
            async gotoBatchOperation () {
                
                let isDragDrop = this.isDragDrop;
                this.isDragDrop = !0;
                this.dragDropMode = 'cell';
                
                if (this.isDragDrop) {
                    this.$message({
                        type: 'warning',
                        message: '本次修改支持今日起7日内的批量修改'
                    });
                    await this.changeStartDay();
                } else {

                }
            },
            /**
             * @description     保存批量取消课程
             */
            batchDeleteCourses () {
                let deleteSelectedCourses = this.deleteSelectedCourses.map(course => course.classId)
                console.log(deleteSelectedCourses)
                deleteSelectedCourses.length && 
                    this.deleteTaskEvent({
                        class_ids: deleteSelectedCourses,
                        cancel_type: 40,
                        cancel_reason: '客服批量取消',
                        operator_type: 10,
                        platform: 1,
                    }).then(res => {
                        console.log(res)
                    }).catch(err => {
                        
                    });
                // this.isDragDrop = !1;
                // this.dragDropMode = 'cell';
                // this.currentDragColumn = {};
                // this.currentEnterColumn = {};
            },
            /**
             * @description     取消批量操作
             */
            async cancelBatchOperation () {
                this.isDragDrop = !1;
                this.dragDropMode = 'cell';
                this.currentDragColumn = {};
                this.currentEnterColumn = {};
                // 重置开始日期并请求对应数据
                await this.changeStartDay(1);
                this.startTime = this.defaultStartTime;
                this.currentWeekVal = "本周";
            },
            /**
             * @description     
             */
            gotoDragColumn (column, e) {
                if (this.dragDropMode === 'cell') {
                    // 所选日期下无排课就退出
                    if (!column.courses.length) {
                        return this.$message({
                            type: 'warning',
                            message: '所选日期下没有排课'
                        });
                    }
                    this.dragDropMode = 'column';
                    this.currentDragColumn = column;
                } else if (this.dragDropMode === 'column') {
                    if (this.currentDragColumn.timeStamp === column.timeStamp) {
                        this.dragDropMode = 'cell';
                        this.currentDragColumn = {};
                    } else {
                        this.currentDragColumn = column;
                    }
                }
                this.currentEnterColumn = {};
            },
            /**
             * @description     开始拖拽单元
             */
            dragCellStart(column, course, index, e) {console.log('单节课拖拽开始', course)
                // 为了兼容vue在火狐下能支持拖拽事件
                e.dataTransfer.setData('dragdrop',null);
                let target = e.target;
                if ( target.classList.contains('draggable') ) {
                    this.currentDragItem = {
                        day: column,
                        course,
                        index,
                    };
                }
            },
            /**
             * @description     拖拽单元进入事件
             * @param   {object}    column
             * @param   {object}    hour
             * @param   {number}    index
             */
            dragCellEnter(column, hour, quarter, hourIndex, quarterIndex, e) {
                let target = e.target;
                if (hour.startHour === 23 && quarter !== '00') return;
                this.currentEnterQuater = { 
                    target, 
                    date: column.timeStamp, 
                    hour: hour.value,
                    quarter: `${quarterIndex === 0 ? '00' : 15 * quarterIndex }`,
                    hourIndex,
                    quarterIndex,
                    startHour: `${hour.hour}:00`,
                    cellData: column
                };console.log(this.currentEnterQuater)
            },
            /**
             * @description     拖拽单元离开事件
             * @param   {object}    item
             * @param   {object}    hour
             * @param   {number}    hIndex
             */
            dragCellLeave(column, hour, quarter, hIndex, qIndex, e) {
                let target = e.target;
                if (this.currentEnterQuater && this.currentEnterQuater.target === target) { 
                    return this.currentEnterQuater = {}; 
                }
            },
            /**
             * @description     拖拽单元结束事件
             */
            dragCellEnd(e) {
                let target = e.target;
                // if ( target.classList.contains('draggable') ) {
                    // console.log(target.getBoundingClientRect())
                // }
                this.currentDragItem = {};
                console.log('dragend')
            },
            /**
             * @description     课程单元拖拽放下事件
             */
            quarterDrop(column, dropHour, dropQuarter, hIndex, qIndex, e) {
                if (dropHour.startHour >= 22 && dropQuarter !== '00') {
                    return this.$message({
                        type: 'warning',
                        message: '排课时间不能超过22：00'
                    });
                }
                let target = e.target;
                let courses = column.courses;
                let currentDragCourse = this.currentDragItem;
                let currentEnterQuater = this.currentEnterQuater;
                this.currentEnterQuater = {};
                let { cellData } = currentEnterQuater;
                let time = dropHour.value;
                let hour = (Number(time.split(':')[0]) - 1) < 10 ?  '0' + (Number(time.split(':')[0]) - 1) : (Number(time.split(':')[0]) - 1) ;
                let beforeDatetime = cellData.timeStamp + (Number(hour) + 1) * 60 * 60;
                if (beforeDatetime < new Date().getTime() / 1000) {
                    return this.$message({
                        type: 'warning',
                        message: '不能在过去的时间中约课'
                    });
                }
                
                // 计算从拖动起点到终点后时间戳
                let startColumn = currentDragCourse.column;
                let currentCourses = currentDragCourse.course;
                let startTime = Number(column.timeStamp);
                let startHour = dropHour.startHour * 60 * 60;
                let startQuarter = dropQuarter * 60;
                let dropStartTime = startTime + startHour + startQuarter;
                let dropEndTime = dropStartTime + currentCourses.duration * 60;
                let courseId = currentCourses.classId;
                let studentId = currentCourses.studentId;
                console.log('拖拽放下', dropHour, dropQuarter);

                // 调用自由拖拽排课接口
                this.$emit('drop', {
                    class_list: [
                        {
                            class_id: courseId,
                            student_id: studentId,
                            time_class: dropStartTime,
                            time_end: dropEndTime,
                        }
                    ],
                    operator_type: 10,
                    platform: 1,
                }, () => {
                    console.log('单个课程拖拽排课成功')
                }, () => {
                    console.log('单个课程拖拽排课失败')
                });

                // let date = `${cellData.month}-${cellData.day} ${cellData.week}`;
                // this.$alert(`目标日期：${date} 时间：${hour}:${dropQuarter}`, '', {
                //     confirmButtonText: '确定',
                //     callback: action => {

                //         this.changeStartDay();
                //     }
                // });       
            },
            // dragOver(e) {
            //     e.preventDefault();
            // },
            
            /**
             * @description     开始拖拽单元
             */
            dragColumnStart(column, index, e) {
                let target = e.target;
                
            },
            /**
             * @description     拖拽列进入事件
             * @param   {object}    item
             * @param   {object}    hour
             * @param   {number}    index
             */
            dragColumnEnter(column, index, e) {
                if (this.currentDragColumn.timeStamp === column.timeStamp) {
                    return;
                }
                let target = e.target;
                this.currentEnterColumn = { 
                    target, 
                    ...column,
                    // date: item.timeStamp, 
                    // hour: hour.value,
                    // quarter: 15 * index,
                    // cellData: item
                };
            },
            /**
             * @description     拖拽列离开事件
             * @param   {object}    item
             * @param   {object}    hour
             * @param   {number}    index
             */
            dragColumnLeave(column, index, e) {
                let target = e.target;
                if (this.currentEnterColumn && this.currentEnterColumn.target === target) { 
                    return this.currentEnterColumn = {}; 
                }
            },
            /**
             * @description     拖拽列放下事件
             */
            columnDrop(column, index, e) {
                // 非列拖拽模式及目标是自身退出
                if (this.isDragDrop && ( this.dragDropMode !== 'column' || this.currentDragColumn.timeStamp === column.timeStamp)) {
                    return;
                }
                let target = e.target;
                let currentEnterColumn = this.currentEnterColumn;
                let currentDragColumn = this.currentDragColumn;
                // 计算出变化的天数
                let dragDaysTimes = Number(column.timeStamp) - Number(currentDragColumn.timeStamp);
                let courses = currentDragColumn.courses.map(course => {
                    let classId = course.classId;
                    let studentId = course.studentId;
                    let timeClass = course.timeClass + dragDaysTimes;
                    let timeEnd = timeClass + Number(course.duration) * 60;
                    console.log('拖拽列课程时间', currentDragColumn, course.timeClass, dragDaysTimes);
                    return {
                        class_id: classId,
                        student_id: studentId,
                        time_class: timeClass,
                        time_end: timeEnd,
                    }
                })

                // 调用自由拖拽排课接口
                this.$emit('drop', {
                    class_list: courses,
                    operator_type: 10,
                    platform: 1,
                }, () => {
                    // 成功处理
                    this.currentEnterColumn = {};
                    this.currentDragColumn = {};
                    this.dragDropMode = 'cell';
                })

                
                
                // console.log('拖拽列放下', currentDragColumn, column, courses);
                // this.$alert(`拖拽日期：${currentDragColumn.day} 目标日期：${column.day}`, '', {
                //     confirmButtonText: '确定',
                //     callback: action => {}
                // });   
            },
            /**
             * @description     
             */
            selectCourse (column, course, value) {
                if (!!value) {
                    let isSelectedColumnCourses = column.courses.find(course => !course.selected);
                    this.$set(column, 'isSelectedColumnCourses', !isSelectedColumnCourses);
                } else {
                    this.$set(column, 'isSelectedColumnCourses', value);
                }
                let selectedColumnIndeterminate = column.courses.filter(course => course.selected);
                selectedColumnIndeterminate = selectedColumnIndeterminate.length > 0 && selectedColumnIndeterminate.length < column.courses.length;
                this.$set(column, 'selectedColumnIndeterminate', selectedColumnIndeterminate);
            },
            /**
             * @description     选择当前列课程
             */
            selectColumnCourse (column, index, value) {
                column.courses && (
                    column.courses.forEach(course => course.selected = !!value),
                    this.$set(column, 'isSelectedColumnCourses', !!value),
                    this.$set(column, 'selectedColumnIndeterminate', !1)
                )
            },
            
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
            // 格式化周
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
            getYearWeek (year, month, day) {
                /*
                date1是当前日期
                date2是当年第一天
                d是当前日期是今年第多少天
                用d + 当前年的第一天的周差距的和在除以7就是本年第几周
                */
                let date1 = new Date(`${year}/${month}/${day}`), date2 = new Date(`${year}/1/1`),
                d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
                return Math.ceil(
                (d + ((date2.getDay() + 1) - 1)) / 7
                )  === 53 ? 1 : Math.ceil(
                (d + ((date2.getDay() + 1) - 1)) / 7
                );
            },
            /**
             * @description     处理日历单元事件
             * 
             */
            handleCellEvent (item, itm, event) {
                // 拖拽模式下不可触发
                if (this.isDragDrop) return;
                if (itm.startHour > 22) {
                    return this.$message({type: 'warning', message: '排课时间不能超过22：00'});
                }
                let hour = (Number(itm.value.split(':')[0]) - 1) < 10 ?  '0' + (Number(itm.value.split(':')[0]) - 1) : (Number(itm.value.split(':')[0]) - 1) ;
                let obj = Object.assign(item, {hour: hour})
                let nowTimeStamp = item.timeStamp + (Number(hour) + 1) * 60 * 60;
                if(nowTimeStamp < new Date().getTime() / 1000) {
                    this.$message({
                        type: 'error',
                        message: '不能在过去的时间中约课'
                    })
                    return
                }
                this.cellEvent(obj);
            },
            /**
             * @description     处理任务事件
             * 
             */
            handleTaskEvent (colomn, course, event) {
                // 拖拽模式下不可触发，右上取消选择框不可触发
                if (this.isDragDrop || !event.target.classList.contains('week-calendar-day-calss')) {    
                    return;
                }
                // if(course.timeClass < new Date().getTime() / 1000) {
                //     this.$message({
                //         type: 'error',
                //         message: '已开始或已结束的课程不能编辑或取消'
                //     })
                //     return
                // }
                let times = course.time.split('-');
                let {year, month, day, week} = this.formatTime(colomn.timeStamp);
                
                this.taskEvent({
                    dayTime: colomn.timeStamp, 
                    datetime: `${year}-${month}-${day}`,
                    week: this.formatWeek(week),
                    startTime: times[0],
                    endTime: times[1],
                    courseDuration: `${course.duration} min`,
                    ...course,
                });
            },
            
            // 上一周数据
            preWeek() {
                this.startTime = this.startTime - 7 * 24 * 60 * 60 * 1000;
                let {year, month, day, week} = this.formatTime(new Date().getTime() / 1000);
                let timeStamp = new Date(`${year}/${month}/${day}`).getTime();
                let nowStartTime = timeStamp - (week - 1) * 24 * 60 * 60 * 1000;
                if(this.startTime !== nowStartTime) {
                    this.currentWeekVal = "返回本周"
                } else {
                    this.currentWeekVal = "本周"
                }
                this.calenderUpdate(this.startTime);
                this.$emit('preWeek', {
                    startTime: this.startTime / 1000,
                    endTime: this.endTime / 1000
                })
            },
            // 本周数据
            nowWeek() {
                this.currentWeekVal = "本周";
                this.startTime = this.defaultStartTime;
                this.calenderUpdate(this.startTime)
                this.$emit('nowWeek', {
                    startTime: this.defaultStartTime / 1000,
                    endTime: this.endTime / 1000
                })
            },
            // 下一周数据
            nextWeek() {
                this.startTime = this.startTime + 7 * 24 * 60 * 60 * 1000;
                let {year, month, day, week} = this.formatTime(new Date().getTime() / 1000);
                let timeStamp = new Date(`${year}/${month}/${day}`).getTime();
                let nowStartTime = timeStamp - (week - 1) * 24 * 60 * 60 * 1000;
                if(this.startTime !== nowStartTime) {
                    this.currentWeekVal = "返回本周"
                } else {
                    this.currentWeekVal = "本周"
                }
                this.calenderUpdate(this.startTime);
                this.$emit('nextWeek', {
                    startTime: this.startTime / 1000,
                    endTime: this.endTime / 1000
                })
            },
            
        }
    }
</script>
<style lang="less">
.el-date-editor .el-range-separator {
    width: 8%;
}
</style>
<style lang="less" scoped>
    .week-calendar{
        width: 100%;
    }
    .week-calendar-title{
        display: flex;
        justify-content: space-between;
        align-items: center; 
        height: 50px;
        background-color: #fff;
        .lf, .rt {
            display: flex;
        }
        .btn-batch-operate,
        .btn-save,
        .btn-cancel {
            margin: 0 0 0 10px;
            padding: 0 10px;
            // width: 66px;
            height: 30px;
            background-color: #409eff;
            border-radius: 4px;
            color: #fff;
        }
        .btn-save[disabled] {
            background-color: #eee;
            color: #999;
            cursor: not-allowed;
        }
        .btn-cancel {
            background-color: #f6f6f6;
            border: #ddd solid 1px;
            color: #666;
        }
    }
    .week-calendar-date{
        margin: 0 0 0 10px;
        font-size: 16px;
        font-weight: 500;
    }
    .week-calendar-btns{
        display: flex;
    }
    .week-calendar-btn{
        margin: 0 5px 0 0;
        padding: 0 8px;
        line-height: 24px;
        border: 1px solid  #e3e7ea;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
    }
    .week-calendar-header-time{
        width: 100%;
        display: flex;
    }
    .week-calendar-val{
        flex: 7;
        text-align: center;
        line-height: 40px;
        border-top: 1px solid #e3e7ea;
        border-right: 1px solid #e3e7ea;
        border-bottom: 1px solid #e3e7ea;
        background: #f1f1f1;
    }
    .week-calendar-val.active .week-calendar-val-day,
    .week-calendar-val.active .week-calendar-val-week{
        color: #409eff;
    }
    .week-calendar-val-day{
        font-size: 18px;
        font-weight: 700;
    }
    .week-calendar-val-week{
        font-size: 12px;
        margin-left: 5px;
        color: #7f838a;
    }
    .week-calendar-value{
        width: 60px;
        text-align: center; 
        line-height: 40px;
        border: 1px solid #e3e7ea;
        background: #f1f1f1;
    }
    .week-calendar-main{
        display: flex;
    }
    
    .week-calendar-main-time{
        display: flex;
        width: 60px;
        flex-direction: column;
        background: #f1f1f1;
    }
    
    .week-calendar-main-hour:first-child{
        // margin-top: 6px;
    }
    .week-calendar-main-hour:last-child{
        // margin-top: -6px;
    }
    .week-calendar-main-days{
        flex: 1;
        display: flex;
    }
    .week-calendar-main-day{
        position: relative;
        flex: 1;
        border-right: 1px solid #e3e7ea;
    }
    .week-calendar-main-day.active{
        background: #f4f7ff;
    }
    
    
    
    // v1.2 拖拽测试
    .week-calendar-main-hour{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60px;
        height: 120px;
        justify-content: center;
        .quarter-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            // margin: 15px 0 0;
            width: 100%;
            height: 90px;
        }
        .quarter-cell {
            position: relative;
            width: 100%;
            height: 30px;
            text-align: center;
            line-height: 30px;
            font-size: 13px;
            color: #868686;
        }
        .quarter-cell.active {
            font-weight: 600;
            color: #409eff;
        }
        .quarter-cell.active:before {
            position: absolute;
            top: 50%;
            left: 1px;
            content: '';
            width: 8px;
            border-top: #409eff solid 1px;
        }
        .quarter-cell.active:after {
            position: absolute;
            top: 50%;
            right: 1px;
            content: '';
            width: 8px;
            border-top: #409eff solid 1px;
        }
        .hour-cell {
            position: absolute;
            bottom: -10px;
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            // font-size: 15px;
            font-weight: 600;
            color: #666;
        }
        .hour-cell:before {
            position: absolute;
            top: calc(50% - 1px);
            left: 0;
            content: '';
            width: 8px;
            border-top: #ccc solid 1px;
        }
        .hour-cell:after {
            position: absolute;
            top: calc(50% - 1px);
            right: 0;
            content: '';
            width: 8px;
            border-top: #ccc solid 1px;
        }
        .hour-cell.active {
            color: #409eff;
        }
        .hour-cell.active:before,
        .hour-cell.active:after {
            border-color: #409eff;
            color: #409eff;
        }
    }
    
    .week-thead-drag {
        display: flex;
        justify-content: center;
        align-items: center; 
        cursor: pointer;
        .column-delete-select {
            margin: 0 0 0 5px;
        }
    }
    .week-thead-drag:hover {
        background-color: #f6fbff;
    }
    .week-thead-drag.drag-active {
        background-color: #f6fbff;
    }
    .week-calendar-main-day.colomn-active {
        // width: 97px;
        border: #409eff dashed 2px;
        // border-width: 0 2px;
        // border-style: dashed;
        // border-color: #409eff;
        background-color: #f6fbff;
    }
    .week-calendar-main-day.column-hover {
        background-color: #d0e8ff!important;
    }
    .week-calendar-day-hours {
        height: 100%;
    }
    .week-calendar-day-hours.drag-active {
        // background-color: #f6fbff;
    }
    .week-calendar-day-hour {
        position: relative;
        height: 120px;
        // border-bottom: 1px solid #e3e7ea;
        cursor: pointer;
        .quarter {
            position: relative;
            height: 30px;
            background-color: #fff;
            border-bottom:1px dashed #e3e7ea;
            cursor: pointer;
        }
        .quarter.disabled {
            background-color: #f6f6f6;
        }
    }
    .week-calendar-day-hour.disabled {
        background-color: #f6f6f6;
    }
    
    
    .week-calendar-day-hour.active .quarter.cell-hover {
        background-color: #d0e8ff!important;
        // background-color: #a4d2ff!important;
        
    }
    .week-calendar-day-hour .quarter.cell-hover {
        // height: 29px;
        // border-width: 1px 0 1px;
        // border-style: dashed;
        // border-color: #409eff;
        background-color: #f6fbff;
        border-top: #409eff dashed 1px;
    }
    
    .week-calendar-day-hour:hover::after {
       content: "+";
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       font-size: 20px;
       color: #F08434;
    }
    .draggable-box .week-calendar-day-hour:hover::after {
        display: none;
    }
    .week-calendar-day-hour .cell-hover.quarter:hover::after  {
        display: none;
    }
    .week-calendar-day-calss-25{ height: 50px; }
    .week-calendar-day-calss-30{ height: 60px; }
    .week-calendar-day-calss-35{ height: 70px; }
    .week-calendar-day-calss-40{ height: 80px; }
    .week-calendar-day-calss-45{ height: 90px; }
    .week-calendar-day-calss-50{ height: 100px; }
    .week-calendar-day-calss-55{ height: 110px; }
    .week-calendar-day-calss-60{ height: 120px; }
    .week-calendar-day-calss-65{ height: 130px; }
    .week-calendar-day-calss-70{ height: 140px; }
    .week-calendar-day-calss-75{ height: 150px; }
    

    .week-calendar-day-calss{
        position: relative;
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 2;
        background: #DBEDFE;
        border-left: #4BA4FC solid 2px;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        line-height: 14px;
        font-weight: 500;
        .name {
            color: #4BA4FC;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 90%;
            text-align: center;
            pointer-events: none;
        }
        .time {
            color: #666;
            pointer-events: none;
        }
        .delete-select {
            position: absolute;
            top: 0;
            right: 0;
            width: 14px;
            height: 14px;
            // border: #4BA4FC solid 1px;
            background-color: #fff;
            cursor: pointer;
            
        }
        // .delete-select.selected:before {
        //     content: '';
        //     width: 100%;
        //     height: 100%;
        //     background-color: #4BA4FC;
        // }
    }
    .draggable-cell {
        border: #4BA4FC dashed 2px;
        // border-left: dashed!important;
    }
    
    .undraggable-box {
        .week-calendar-day-hour {
            border-bottom: 1px solid #e3e7ea;
        }
        .week-calendar-day-hour:hover {
            background: #FCE6D6;
        }
        .week-calendar-day-hour::before {
            position: absolute;
            content: '';
            top: 50%;
            width: 100%;
            border-top:1px dashed #e3e7ea;
        }
    }
    .week-calendar-toolbar-sticky {
        position: sticky;
        top: 0;
        z-index: 10;
    }
    .week-calendar-header-sticky {
        position: sticky;
        top: 50px;
        z-index: 10;
    }
    // -------- end
    
    
    

    .week-calendar-day-half-hour{
        height: 40px;
        border-bottom: 1px dashed #e3e7ea;
    }
    .week-calendar-day-calss{
        cursor: pointer;
    }
</style>