<template>
    <div class="calendar">
        <div class="calendar-header">
            <span class="calendar-month">{{year}}年{{month}}月</span>
            <div class="calendar-change-btns">
                <span class="calendar-change-btn" @click="preMonth">上个月</span>
                <span class="calendar-change-btn select" @click="today">今日</span>
                <span class="calendar-change-btn" @click="nextMonth">下个月</span>
            </div>
        </div>
        <div class="calendar-main">
            <div class="calendar-week">
                <span class="calendar-week-day" v-for="(item, index) in weeks" :key="index">{{item}}</span>
            </div>
            <div class="calendar-days"> 
                <div class="calendar-day" @click="dayClick($event, item)" :class="item.month !== month ? 'active' : ''" v-for="(item, index) in calendar" :key="index">
                    <span class="calendar-day-empty"></span>
                    <span class="calendar-day-val" :class="new Date(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`).getTime() === item.timeStamp ? 'active' : ''">{{item.day}}</span>
                    <span class="calendar-day-class">{{item.classNum}}节</span>
                    <!-- <slot name="custom-cell"></slot> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { teacher } from './../../../service/index'
export default{
    name: 'Calendar',
    props: {
        teacherId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            calendar: [],
            year: 2020,
            month: 2,
            day: 1,
            selectTimeStamp: 0
        }
    },
    async created() {
        await this.renderCalendar()
    },
    mounted() {
        this.today();
    },
    methods: {
        formatTime(time) {
            let year = new Date(time * 1000).getFullYear();
            let month = new Date(time * 1000).getMonth() + 1 >= 10 ? new Date(time * 1000).getMonth() + 1 : '0' + (new Date(time * 1000).getMonth() + 1);
            let day = new Date(time * 1000).getDate() < 10 ? '0' + new Date(time * 1000).getDate() : new Date(time * 1000).getDate();
            return {year, month, day}
        },
        async getTeacherTime(startTime, endTime) {
            const {data} = await teacher.teacherTime({
                institution: this.$store.state.userInfo.deptId,
                start_time: startTime / 1000,
                end_time: endTime / 1000
            })
            for(let i = 0; i < data.length; i++) {
                let index = this.calendar.findIndex(v => v.timeStamp / 1000 === data[i].day_time);
                if(index > -1) {
                    this.calendar[index].classNum =  data[i].class_list.length;
                }
            }
        },
        async renderCalendar() {
            let {year, month, day} = this.formatTime(new Date().getTime() / 1000)
            let week = new Date(`${year}/${month}/01`).getDay() === 0 ? 7 : new Date(`${year}/${month}/01`).getDay();
            this.year = year;
            this.month = month;
            this.day = day;
            await this.getCalendar(year, month, day, week);
        },
        selectChange(e) {
            let elems = document.querySelectorAll('.calendar-change-btn');
            this.removeClass(elems)
            e.target.className += ' select';
        },
        selectDayChange() {
            let elems = document.querySelectorAll('.calendar-day');
            this.removeClass(elems)
            let index = this.calendar.findIndex( v => v.timeStamp / 1000 === this.selectTimeStamp);
            if(index === -1) {
                return
            }
            elems[index].className += ' select';
        },
        // 上个月
        async preMonth(e) {
            if(e) {
                this.selectChange(e)
            }
            let month = Number(this.month) - 1 > 0 ? Number(this.month) - 1 : 12;
            let year = Number(this.month) - 1 < 1 ? Number(this.year) - 1 : Number(this.year); 
            let day = this.day;
            this.year = year;
            this.month = month < 10 ? '0' + month : month;
            let week = new Date(`${year}/${this.month}/01`).getDay() === 0 ? 7 : new Date(`${year}/${this.month}/01`).getDay();
            await this.getCalendar(year, this.month, day, week);
            setTimeout(() => {
                this.selectDayChange()
            }, 60)
            
        },
        // 今天
        today(e) {
            if(e && e.target) {
                this.selectChange(e)
                this.renderCalendar()
            }
            this.selectTimeStamp = new Date(new Date().toLocaleDateString()).getTime() / 1000
            setTimeout(() => {
                this.selectDayChange(this.selectTimeStamp)
            }, 60)
            this.$emit('dayClick', {timeStamp: this.selectTimeStamp * 1000})
            
        },
        // 下个月
        async nextMonth(e) {
            if(e) {
                this.selectChange(e)
            }
            let month = Number(this.month) + 1 > 12 ?  1 : Number(this.month) + 1;
            let year = Number(this.month) + 1 > 12 ? this.year + 1 : this.year; 
            let day = this.day;
            this.year = year;
            this.month = month < 10 ? '0' + month : month;
            let week = new Date(`${year}/${this.month}/01`).getDay() === 0 ? 7 : new Date(`${year}-${this.month}-01`).getDay();
            await this.getCalendar(year, this.month, day, week);
            setTimeout(() => {
                this.selectDayChange()
            }, 60)
        },
        // 日历表
        async getCalendar(year, month, day, week) {
            let calendar = [];
            let startTime = new Date(`${year}/${month}/01`).getTime() - (week - 1) * 24 * 60 * 60 * 1000;
            let d = new Date();
            let currentTime = this.formatTime(d.getTime() / 1000);
            for (let i = 0; i < 42; i++) {
                let calenDarTime = this.formatTime((startTime + i * 24 * 60 * 60 * 1000) / 1000);
                calendar.push({
                    timeStamp: startTime + i * 24 * 60 * 60 * 1000,
                    year: calenDarTime.year,
                    month: calenDarTime.month,
                    classNum: 0,
                    day: new Date(`${currentTime.year}/${currentTime.month}/${currentTime.day}`).getTime() === startTime + i * 24 * 60 * 60 * 1000 ? '今' : calenDarTime.day
                })
            }
            let endTime = calendar[calendar.length - 1].timeStamp + (24 * 60 * 60 - 1) * 1000;
            this.calendar = calendar;
            await this.getTeacherTime(startTime, endTime)
        },
        // 删除选中状态
        removeClass(elems) {
            for(let elem of elems) {
                let className = elem.className;
                if(className.includes('select')) {
                    elem.className = className.replace("select", "");
                }
            }
        },
        // 日期点击事件
        dayClick(e, item) {
            this.selectTimeStamp = item.timeStamp / 1000;
            let dayElems = document.querySelectorAll('.calendar-day');
            this.removeClass(dayElems)
            if(e.target.className.includes('calendar-day-empty')) {
                e.target.parentNode.className += ' select';
            } else {
                e.target.className += ' select';
            }
            let elems = document.querySelectorAll('.calendar-change-btn');
            if(item.day === '今') {
                this.removeClass(elems)
                elems[1].className += ' select'
            } else {
                this.removeClass(elems)
            }
            if(Number(item.month) + 1 === Number(this.month)  || (Number(item.year) < Number(this.year) && Number(item.month) + 1 === 13)) {
                this.removeClass(elems)
                elems[0].className += ' select'
                this.preMonth()
            }
            if(Number(item.month) - 1 === Number(this.month)  || (Number(item.year) > Number(this.year) && Number(item.month) + 1 === 2)) {
                this.removeClass(elems)
                elems[2].className += ' select'
                this.nextMonth()
            }
            this.$emit('dayClick', item)
           
        }
    }
}
</script>
<style lang="less" scoped>
    .calendar{
        width: 100%;
    }
    .calendar-header{
        display: flex;
        justify-content: space-between;
        padding: 12px 20px;
        border-bottom: 1px solid #ebeef5;
        .calendar-month{
            color: #000;
            align-self: center;
            font-weight: 600;
        }
        .calendar-change-btn{
            cursor: pointer;
            padding: 7px 15px;
            font-size: 12px;
            border-radius: 3px;
            background: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;
        }
        .calendar-change-btn.select{
            color: #409eff;
            background-color: #ecf5ff;
        }
        .calendar-change-btn:not(:last-child) {
            margin-right: -1px;
        }
        .calendar-change-btn:first-child {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .calendar-change-btn:not(:first-child):not(:last-child) {
            border-radius: 0;
        }
        .calendar-change-btn:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .calendar-change-btn:hover{
            color: #409eff;
            border-color: #c6e2ff;
            background-color: #ecf5ff;
        }
    }
    
    .calendar-main{
        .calendar-week{
            display: flex;
        }
        .calendar-week-day{
            flex: 7;
            text-align: center;
            padding: 12px 0;
            color: #606266;
            font-weight: 400;
        }
        .calendar-days{
            display: flex;
            flex-wrap: wrap;
        }
        .calendar-day:nth-of-type(7n + 1) {
            border-left: 1px solid #ebeef5;
        }
        .calendar-day:nth-of-type(1),
        .calendar-day:nth-of-type(2),
        .calendar-day:nth-of-type(3),
        .calendar-day:nth-of-type(4),
        .calendar-day:nth-of-type(5),
        .calendar-day:nth-of-type(6),
        .calendar-day:nth-of-type(7),{
            border-top: 1px solid #ebeef5;
        }
        .calendar-day-empty{
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 1;
            cursor: pointer;
        }
        .calendar-day{
            position: relative;
            width: calc(100% / 7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 50px;
            border-bottom: 1px solid #ebeef5;
            border-right: 1px solid #ebeef5;
            font-weight: 600;
            cursor: pointer;
        }
        .calendar-day:hover{
            background-color: #ecf5ff;
        }
        .calendar-day.active{
            color: #c0c4cc;
            font-weight: 400;
        }
        .calendar-day.select{
            color: #409eff;
            background-color: #ecf5ff;
        }
        .calendar-day-val.active{
            color: #fd5e02;
        }
        .calendar-day-class{
            font-size: 12px;
            color: #c0c4cc;
        }
    }
</style>
