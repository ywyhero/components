<template>
  <div class="calendar">
    <div class="calendar-fixed">
      <div class="calendar-weeks">
        <span class="calendar-week" v-for="(item, index) in weeks" :key="index">{{item.value}}</span>
      </div>
    </div>
    <div class="calendar-main" @scroll="scroll">
      <div class="calendar-months">
        <div class="calendar-month" v-for="(item, index) in calendar" :key="index">
          <span class="calendar-month-val">{{item.year}}年{{item.month}}月</span>
          <div class="calendar-days">
            <div
              class="calendar-day-box"
              :class="`${itm.isDuration ? 'duration' : ''}`"
              v-for="(itm, idx) in item.days"
              :key="idx"
            >
              <span
                class="calendar-day"
                :class="`${itm.canClick ? '' : 'notClick'} ${itm.isSelect ? 'active' : ''} `"
                @click="dayClick(item,itm,index,idx)"
              >{{itm.day}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="calendar-date">{{date}}</span>
  </div>
</template>

<script>
export default {
  props: {
    type: { // 排课类型
      type: String,
      default: "freedom"
    },
    dates: { // 默认选中的数据
      type: Array,
      default: []
    }
  },
    data() {
        return {
        weeks: [
            {
            value: "周一"
            },
            {
            value: "周二"
            },
            {
            value: "周三"
            },
            {
            value: "周四"
            },
            {
            value: "周五"
            },
            {
            value: "周六"
            },
            {
            value: "周日"
            }
        ], // 一周的显示
        date: "2020年03月", // 显示的日期
        calendar: [], // 日历数据
        selectDays: [] // 选择的日期
    };
  },
    created() {
        // 获取日历数据
        this.getCalendar();
        if(this.dates.length > 0) {
            if (this.type === "loop") {
                // 当循环排课时日历默认选择区间
                for (let i = 0; i < this.calendar.length; i++) {
                    for (let j = 0; j < this.calendar[i].days.length; j++) {
                        if(this.calendar[i].days[j].timeStamp === this.dates[0].timeStamp || this.calendar[i].days[j].timeStamp === this.dates[1].timeStamp) {
                            this.calendar[i].days[j].isSelect = true;
                        }
                        if (this.calendar[i].days[j].timeStamp > this.dates[0].timeStamp && this.calendar[i].days[j].timeStamp < this.dates[1].timeStamp) {
                            this.calendar[i].days[j].isDuration = true;
                        }
                    }
                }
            } else if(this.type === 'freedom') {
                // 当自由排课时日历默认选中
                for (let i = 0; i < this.calendar.length; i++) {
                    for (let j = 0; j < this.calendar[i].days.length; j++) {
                        for(let k = 0; k < this.dates.length; k++) {
                            if(this.dates[k].timeStamp === this.calendar[i].days[j].timeStamp) {
                                this.calendar[i].days[j].isSelect = true
                            }
                        }
                    }
                }
            }
            this.selectDays = this.dates;
        }
        
    },
    methods: {
        // 格式化日球
        formatTime(time) {
            let year = new Date(time * 1000).getFullYear();
            let month = new Date(time * 1000).getMonth() + 1 >= 10 ? new Date(time * 1000).getMonth() + 1 : "0" + (new Date(time * 1000).getMonth() + 1);
            let day = new Date(time * 1000).getDate() < 10 ? "0" + new Date(time * 1000).getDate() : new Date(time * 1000).getDate();
            let week = new Date(time * 1000).getDay() === 0 ? 7 : new Date(time * 1000).getDay();
            let timeStamp = new Date(`${year}/${month}/${day}`).getTime() / 1000;
            return { year, month, day, week, timeStamp };
        },
        // 最大日期
        getMaxDate(addDay) {
            let d = new Date();
            d.setDate(d.getDate() + addDay);
            let maxCurrentTimeStamp = d.getTime() / 1000;
            let { year, month, day, week, timeStamp } = this.formatTime(
                maxCurrentTimeStamp
            );
            return {
                maxYear: year,
                maxMonth: month,
                maxDay: day,
                maxWeek: week,
                maxTimeStamp: timeStamp
            };
        },
        // 获取日期表
        getCalendar() {
            let currentTimeStamp = new Date().getTime() / 1000;
            let currentDate = this.formatTime(currentTimeStamp);
            let currentMonthFirstDayTimeStamp =
                new Date(`${currentDate.year}/${currentDate.month}/01`).getTime() /
                1000;
            let currentMonthInfo = this.formatTime(currentMonthFirstDayTimeStamp);
            let currernMonthWeek = currentMonthInfo.week;
            // 获取最大日期的信息
            let maxDate = this.getMaxDate(180);
            let currentMonth = Number(currentDate.month);
            let maxMonth = Number(maxDate.maxMonth);
            // 计算最大月份和当前月份相差几个月
            let monthCount = 12 - maxMonth + currentMonth + 1;
            let calendar = [];
            for (let i = 0; i < monthCount; i++) {
                let finalMonth = currentMonth + i > 12 ? 1 : currentMonth + i;
                let finalYear =
                currentMonth + i > 12 ? currentDate.year + 1 : currentDate.year;
                let months = {
                    year: finalYear,
                    month: finalMonth < 10 ? "0" + finalMonth : finalMonth,
                    days: []
                };
                // 获取每个月份第一周周一的时间戳
                let startTime = new Date(`${currentDate.year}/${finalMonth}/01`).getTime() - (currentDate.week - 1) * 24 * 60 * 60 * 1000;
                for (let j = 0; j < 42; j++) {
                    let dayTime = this.formatTime(startTime / 1000 + j * 24 * 60 * 60);
                    let canClick = true;
                    // 只需要月份以内的数据以及不能大于180天的数据
                    if (Number(dayTime.month) === Number(months.month) && maxDate.maxTimeStamp >= startTime / 1000 + j * 24 * 60 * 60) {
                        if (dayTime.timeStamp < currentDate.timeStamp) {
                            canClick = false;
                        }
                        let obj = {
                            year: dayTime.year,
                            month: dayTime.month,
                            day: dayTime.day,
                            week: dayTime.week,
                            timeStamp: dayTime.timeStamp,
                            canClick: canClick,
                            isSelect: false,
                            isDuration: false
                        };
                        months.days.push(obj);
                    }
                }
                // 获取每月1号的信息
                let monthFirstDayInfo = this.formatTime(
                new Date(`${months.year}/${months.month}/01`).getTime() / 1000
                );
                // 每月一号之前周几补充空格
                for (let k = 0; k < monthFirstDayInfo.week - 1; k++) {
                    months.days.unshift({
                        year: "",
                        month: "",
                        day: ""
                    });
                }
                calendar.push(months);
            }
            this.calendar = calendar;
            this.date = `${this.calendar[0].year}年${this.calendar[0].month}月`;
        },
        // 获取选择的时间数组
        dayClick(item, itm, index, idx) {
            if (!this.calendar[index].days[idx].canClick) {
                return;
            }
            // 循环排课的事件
            if (this.type === "loop") {
                // 如果点击的时候已经选择两个数据先清空原有数据
                if (this.selectDays.length === 2) {
                    for (let i = 0; i < this.calendar.length; i++) {
                        for (let j = 0; j < this.calendar[i].days.length; j++) {
                            this.calendar[i].days[j].isSelect = false;
                            this.calendar[i].days[j].isDuration = false;
                        }
                    }
                    this.selectDays = [];
                }
                // 如果选择的数据已经在数组中 则删除该数据
                let findIndex = this.selectDays.findIndex(v => v.timeStamp === itm.timeStamp);
                if (findIndex > -1) {
                    this.selectDays.splice(findIndex, 1);
                }
                if (this.selectDays.length < 2) {
                    this.calendar[index].days[idx].isSelect = !this.calendar[index].days[idx].isSelect;
                    if (this.calendar[index].days[idx].isSelect) {
                        this.selectDays.push(this.calendar[index].days[idx]);
                    }
                }
                // 将两次选择的日期做个排序
                this.selectDays.sort((a, b) => a.timeStamp - b.timeStamp);
                // 给两个数据的区间数据加个标识
                if (this.selectDays.length === 2) {
                    for (let i = 0; i < this.calendar.length; i++) {
                        for (let j = 0; j < this.calendar[i].days.length; j++) {
                            if (this.calendar[i].days[j].timeStamp > this.selectDays[0].timeStamp && this.calendar[i].days[j].timeStamp < this.selectDays[1].timeStamp) {
                                this.calendar[i].days[j].isDuration = true;
                            }
                        }
                    }
                }
            }
            // 自由排课的事件
            if (this.type === "freedom") {
                this.calendar[index].days[idx].isSelect = !this.calendar[index].days[idx].isSelect;
                let findIndex = this.selectDays.findIndex( v => v.timeStamp === itm.timeStamp);
                if (findIndex > -1) {
                    this.selectDays.splice(findIndex, 1);
                } else {
                    this.selectDays.push(this.calendar[index].days[idx]);
                }
            }
            this.$emit("dayClick", {
                selectDays: this.selectDays
            });
        },
        // 滚动事件
        scroll() {
            let calendarDom = document.querySelector(".calendar-main");
            let monthDoms = document.querySelectorAll(".calendar-month-val");
            for (let i = 0; i < monthDoms.length; i++) {
                if (calendarDom.scrollTop >= monthDoms[i].offsetTop - 45) {
                    this.date = monthDoms[i].innerHTML;
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
@baseFontSize: 75; //基于视觉稿横屏尺寸/100得出的基准font-size
.px2rem(@name, @px) {
  @{name}: @px / @baseFontSize * 1rem;
}
.calendar {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.calendar-fixed {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.calendar-main {
  flex: 1;
  overflow-y: auto;
}
.calendar-weeks {
  display: flex;
}
.calendar-week {
  flex: 7;
  text-align: center;
  .px2rem(line-height, 90);
  .px2rem(font-size, 24);
  color: #9b9b9b;
}
.calendar-date {
  position: absolute;
  width: 100%;
  .px2rem(top, 88);
  .px2rem(line-height, 72);
  .px2rem(font-size, 36);
  font-weight: 600;
  color: #333;
  text-align: center;
  background: #fff;
}
.calendar-month {
  display: flex;
  flex-direction: column;
}
.calendar-month-val {
  width: 100%;
  text-align: center;
  .px2rem(line-height, 92);
  .px2rem(font-size, 36);
  color: #333;
  font-weight: 600;
}
.calendar-days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .px2rem(padding-left, 21);
  .px2rem(padding-right, 21);
  border-bottom: 1px solid rgba(233, 233, 233, 1);
}
.calendar-day-box {
  width: calc(100% / 7);
  display: flex;
  align-items: center;
  justify-content: center;
  .px2rem(margin-bottom, 30);
}
.calendar-day {
  .px2rem(width, 72);
  .px2rem(height, 72);
  .px2rem(line-height, 72);
  // .px2rem(margin-right, 34);

  text-align: center;
  color: #333;
}
.calendar-day:nth-of-type(7n) {
  .px2rem(margin-right, 0);
}
.calendar-day.notClick {
  color: #cbcbcb;
}
.calendar-day.active {
  background: rgba(254, 216, 70, 1);
  border-radius: 4px;
}
.duration {
  background: rgba(254, 216, 70, 0.2);
}
</style>
