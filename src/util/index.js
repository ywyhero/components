
/* eslint-disable */
export const treeDataTranslate = (data, id = "id", pid = "parentId") => {
    var res = [];
    var temp = {};
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]["kids"]) {
                temp[data[k][pid]]["kids"] = [];
            }
            if (!temp[data[k][pid]]["_level"]) {
                temp[data[k][pid]]["_level"] = 1;
            }
            data[k]["_level"] = temp[data[k][pid]]._level + 1;
            temp[data[k][pid]]["kids"].push(data[k]);
        } else {
            res.push(data[k]);
        }
    }
    return res;
}

export function fixdata(data) { //文件流转BinaryString
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
    return o;
}

export const multiply = (arg1, arg2) => {
    //乘法函数，用来得到精确的乘法结果
    let m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    } catch (e) { }
    try {
        m += s2.split(".")[1].length;
    } catch (e) { }
    return (
        (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
        Math.pow(10, m)
    );
}
export const division = (arg1, arg2) => {
    //除法函数，用来得到精确的乘法结果
    let t1 = 0,
        t2 = 0,
        r1,
        r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) { }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) { }

    r1 = Number(arg1.toString().replace(".", ""));

    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 正整数且不能大于某个值
const maxNumber = (value, max) => {
    if (/^[0-9]+$/.test(value) && value <= max) {
        return true
    }
    return false
}
//校验权重
export const validateWeight = (newWight, oldWeight) => {
    if (oldWeight === newWight || !maxNumber(newWight, 100000)) {
        return false
    } else {
        return true
    }
}
/**
 * @description     格式化时间
 * @param {*} time 
 */
export const formatTime = (time) => {
    let year = new Date(time * 1000).getFullYear();
    let month = new Date(time * 1000).getMonth() + 1 >= 10 ? new Date(time * 1000).getMonth() + 1 : '0' + (new Date(time * 1000).getMonth() + 1);
    let day = new Date(time * 1000).getDate() < 10 ? '0' + new Date(time * 1000).getDate() : new Date(time * 1000).getDate();
    let week = new Date(time * 1000).getDay() === 0 ? 7 : new Date(time * 1000).getDay();
    let timeStamp = new Date(`${year}/${month}/${day}`).getTime() / 1000;
    let minutes = new Date(time * 1000).getMinutes() < 10 ? '0' + new Date(time * 1000).getMinutes() : new Date(time * 1000).getMinutes();
    let hour = new Date(time * 1000).getHours() < 10 ? '0' + new Date(time * 1000).getHours() : new Date(time * 1000).getHours();
    return {year, month, day, week, timeStamp, hour, minutes}
}