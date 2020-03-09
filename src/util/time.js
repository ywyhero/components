export const format = (time, type) => {
    // 时间格式化
    if (time == 0) return '';
    let d = new Date();
    d.setTime(time * 1000);
    let _year = d.getFullYear(time)
    let _month = d.getMonth(time) + 1;
    let _date = d.getDate(time);
    let week = d.getDay(time);
    let _hours = d.getHours(time);
    let _min = d.getMinutes(time);
    let _seconds = d.getSeconds(time);
    let _week;
    if (week == 0) {
        _week = "周日";
    } else if (week == 1) {
        _week = "周一";
    } else if (week == 2) {
        _week = "周二";
    } else if (week == 3) {
        _week = "周三";
    } else if (week == 4) {
        _week = "周四";
    } else if (week == 5) {
        _week = "周五";
    } else if (week == 6) {
        _week = "周六";
    }
    let add = ((m) => {
        return m < 10 ? '0' + m : m;
    });
    //type 1 表示返回3月27 周二 21:14格式
    //type 2 表示返回21:14
    //type 3 表示返回12-19 16:30:33
    //type 4 表示返回2018-08-08
    //type 5 表示返回2018.08.08
    //type 6 表示返回8月8号
    //type 7 表示返回2018年08月08日
    //type 8 表示返回2018/08/09 16:30:33
    //type week 表示返回周几
    if (type == 1) {
        let time = `${_month}月${add(_date)}日 ${_week} ${add(_hours)}:${add(_min)}`;
        return time;
    } else if (type == 2) {
        let time = `${add(_hours)}:${add(_min)}`;
        return time;
    } else if (type == 3) {
        let time = `${add(_month)}-${add(_date)} ${add(_hours)}:${add(_min)}:${add(_seconds)}`;
        return time
    } else if (type == 4) {
        let time = `${_year}-${add(_month)}-${add(_date)}`;
        return time
    } else if (type == 5) {
        let time = `${_year}.${_month}.${_date}`;
        return time;
    } else if (type == 6) {
        let time = `${_month}月${_date}日`;
        return time;
    } else if (type === 'week') {
        return _week
    } else if (type == 7) {
        let time = `${_year}年${_month}月${add(_date)}日`;
        return time;
    } else if (type == 8) {
        let time = `${_year}/${_month}/${add(_date)} ${add(_hours)}:${add(_min)}`;
        return time;
    } else if (type == 9) {
        let time = `${_year}年${_month}月${add(_date)}日${add(_hours)}时${add(_min)}分`;
        return time;
    }
}
