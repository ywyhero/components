
// 正整数且不能大于某个值
// const maxNumber = (value, max) => {
//     if (/^[0-9]+$/.test(value) && value <= max) {
//         return true
//     }
//     return false
// }
// // 正整数且不能小于某个值
// const minNumber = (value, min) => {
//     if (/^[0-9]+$/.test(value) && value >= min) {
//         return true
//     }
//     return false
// }
// 正整数且长度不能超过多少位
const maxNumberLength = (value, length) => {
    if (/^[0-9]+$/.test(value) && value.length <= length) {
        return true
    }
    return false
}



// 用户ID
const validateStudentsId = (rule, value, callback) => {
    if (!maxNumberLength(value, 11)) {
        callback(new Error('id必须是整数，并且最长11位'));
    } else {
        callback();
    }
};

// 最长20位整数
const validateTwentyNumber = (rule, value, callback) => {
    if (value) {
        if (!maxNumberLength(value, 20)) {
            callback(new Error('请输入整数，并且最长20位'));
        } else {
            callback();
        }
    } else {
        callback()
    }
};


// 手机号校验
const phoneReg = (rule, value, callback) => {
    if (value) {
        if (value.match("^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$")) {
            callback();
        } else {
            callback(new Error('手机号码不正确'));
        }
    } else {
        callback();
    }
};
const noBlank = (rule, value, callback) => {
    if (/^\s+$/gi.test(value)) {
        callback(new Error('不能全为空格'));
    } else {
        callback();
    }
}


// 不能输入特殊字符和表情
const specialCharacterOrEmoji = (rule, value, callback) => {
    // 判断是否含有emoji表情
    let reg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|\uA9|\uAE|\u3030/ig
    if (reg.test(value)) {
        callback(new Error(`请输入中英文及标点符号，不支持emoji及特殊字符`));
    } else {
        callback()
    }
}

// 只能输入中英文和数字
const checkName = (rule, value, callback) => {
    let reg = /[^a-zA-Z0-9\u4e00-\u9fe5]/g
    if (reg.test(value)) {
        callback(new Error(`只能输入中英文和数字`));
    } else {
        callback()
    }
}
// 确认密码是否和原密码相等
const checkPassword = (password) => {
    return (rule, value, callback) => {
        if(value !== password){
            callback(new Error(`两次输入密码不一致`));
        }else{
            callback();
        }
    }
};


export default {
    phoneReg,
    validateStudentsId,
    validateTwentyNumber,
    noBlank,
    specialCharacterOrEmoji,
    checkName,
    checkPassword
}