import { httpRequest } from '../config/http.js'

export const home = {
    // 登录接口
    login(params) {
        return httpRequest('POST', `/sys/login`, params)
    },
    // 登录接口
    login2(params) {
        return httpRequest('POST', `/sys/login2`, params)
    },
    // 用户选择机构接口
    changeOrgan(params) {
        return httpRequest('POST', `/sys/changeOrgan`, params)
    },
    // 机构管理员认证接口
    validateOrgan(params) {
        return httpRequest('POST', `/v2/sys/user/validateOrgan`, params)
    },
    // 机构信息修改接口
    updateOrgan(params) {
        return httpRequest('POST', `/v2/sys/user/updateOrgan`, params)
    },
    
    // 获取验证码
    getCode(params) {
        return httpRequest('POST', `/sys/phone-code`, params)
    },
    // 修改密码
    updatePass(params) {
        return httpRequest('POST', `/sys/update-pass`, params)
    },
    // 新注册用户修改登录密码
    setLoginPwd(params) {
        return httpRequest('POST', `/v2/sys/user/setLoginPwd`, params)
    },
    // 获取七牛云token
    getQiNiuToken(params) {
        return httpRequest('POST', `/organInfo/getQiniuToken`, params)
    },
    // 获取模版
    downloadTemplate(params) {
        return httpRequest('POST', `/organ/downloadTemplate`, params)
    },
    
    // 注册接口
    register(params) {
        return httpRequest('POST', `/sys/register2`, params)
    },
    // 机构注册第三版接口（/sys/register3）
    register3(params) {
        return httpRequest('POST', `/sys/register3`, params)
    },
    // 机构注册第四版接口（/sys/register4）
    register4(params) {
        return httpRequest('POST', `/sys/register4`, params)
    },
    
    // 机构注册接口
    applyInviteCode(params) {
        return httpRequest('POST', `/sys/applyInviteCode`, params)
    },
    // 机构邀请码验证接口
    validate(params) {
        return httpRequest('POST', `/sys/validate`, params)
    },
    // 注册发送短信验证码接口
    sendPhoneCode(params) {
        return httpRequest('POST', `/sys/sendPhoneCode`, params)
    },
    //用户认证发送短信验证码接口
    sendVlidatePhoneCode(params) {
        return httpRequest('POST', `/v2/sys/user/sendVlidatePhoneCode`, params)
    },
    //用户认证接口
    validateMobile(params) {
        return httpRequest('POST', `/v2/sys/user/validateMobile`, params)
    },
    //修改密码发送短信验证码接口
    sendUpdatePhoneCode(params) {
        return httpRequest('POST', `/v2/sys/user/sendUpdatePhoneCode`, params)
    },
    //修改密码发送短信验证码接口
    sendUpdatePhoneCode2(params) {
        return httpRequest('POST', `/v2/sys/user/sendUpdatePhoneCode2`, params)
    },
    //修改手机接口
    updateMobile(params) {
        return httpRequest('POST', `/v2/sys/user/updateMobile`, params)
    },
    //修改手机接口
    updateMobile2(params) {
        return httpRequest('POST', `/v2/sys/user/updateMobile2`, params)
    },
    //修改密码接口
    updateUserPwd(params) {
        return httpRequest('POST', `/v2/sys/user/updateUserPwd`, params)
    },
    
    // 获取机构信息
    getUserInfo(params) {
        return httpRequest('POST', `/v2/sys/user/getUserInfo`, params)
    },
    // 保存机构信息
    saveAdmin(params) {
        return httpRequest('POST', `/sys/dept/saveAdmin`, params)
    },
    // 获取菜单列表
    getNavLists(params) {
        return httpRequest('POST', `/sys/menu/nav`, params)
    },
    // 退出
    logout(params) {
        return httpRequest('POST', `/sys/logout`, params)
    },
    // 修改密码
    updatePwd(params) {
        return httpRequest('POST', `/sys/user/updatePwd`, params)
    }
}

export const admin = {
    // 用户管理列表查询
    userLists(params) {
        return httpRequest('POST', `/sys/user/list`, params)
    },
    // 新增用户
    addUser(params) {
        return httpRequest('POST', `/sys/user/save`, params)
    },
    // 角色
    roles(params) {
        return httpRequest('POST', `/sys/role/select`, params)
    },
    // 修改用户
    updateUser(params) {
        return httpRequest('POST', `/sys/user/update`, params)
    },
    // 查询角色
    infoById(params) {
        return httpRequest('POST', `/sys/user/infoById`, params)
    },
    // 角色列表
    roleLists(params) {
        return httpRequest('POST', `/sys/role/list`, params)
    },
    // 菜单树
    menuLists(params) {
        return httpRequest('POST', `/sys/menu/list`, params)
    },
    //增加角色
    addRole(params) {
        return httpRequest('POST', `/sys/role/save`, params)
    },
    //角色权限
    roleAuth(params) {
        return httpRequest('POST', `/sys/role/info`, params)
    },
    //修改角色权限
    editRoleAuth(params) {
        return httpRequest('POST', `/sys/role/update`, params)
    },
    //删除角色
    deleteRole(params) {
        return httpRequest('POST', `/sys/role/delete`, params)
    },
    // 新增菜单
    addMenu(params) {
        return httpRequest('POST', `/sys/menu/save`, params)
    },
    // 新增菜单列表
    addMenuLists(params) {
        return httpRequest('POST', `/sys/menu/select`, params)
    },
    editMenu(params) {
        return httpRequest('POST', `/sys/menu/update`, params)
    },
    //删除菜单
    deleteMenu(params) {
        return httpRequest('POST', `/sys/menu/delete`, params)
    },
    // 参数列表
    dictLists(params) {
        return httpRequest('POST', `/sys/dict/list`, params)
    },
    // 参数列表
    dictSelectLists(params) {
        return httpRequest('POST', `/sys/dict/select`, params)
    },
    // 增加参数
    dictSave(params) {
        return httpRequest('POST', `/sys/dict/save`, params)
    },
    // 增加参数
    editDict(params) {
        return httpRequest('POST', `/sys/dict/update`, params)
    },
    // 删除参数
    deleteDict(params) {
        return httpRequest('POST', `/sys/dict/delete`, params)
    },
    // 用户管理——检查是否有此操作权限
    checkPermission(params) {
        return httpRequest('POST', `/sys/user/checkPermission`, params)
    },
    // 成长值、勋章、积分的操作原因字典
    operationReasonList(params) {
        return httpRequest('POST', `/sys/dict/operationReasonList`, params)
    },
}

export const qiniu = {
    getQiniuToken() {
        return httpRequest('POST', `/sys/getQiniuToken`)
    }
}
export const student = {
    // 新增学生
    addUser(params) {
        return httpRequest('POST', `/manage/user/addUser`, params)
    },
    // 删除学生
    deleteUser(params) {
        return httpRequest('POST', `/manage/user/deleteUser`, params)
    },
    // 编辑学生
    updateUser(params) {
        return httpRequest('POST', `/manage/user/updateUser`, params)
    },
    // 查询学生列表
    queryUserInfo(params) {
        return httpRequest('POST', `/manage/user/queryUserInfo`, params)
    },
    // 查询所有学生列表
    queryAllUserInfo(params) {
        return httpRequest('POST', `/manage/user/queryTeacherUserInfo`, params)
    },
     // 查询关联的学生列表
     queryTeacherUserInfo(params) {
        return httpRequest('POST', `/manage/user/queryTeacherUserInfo`, params)
    },
    
}
export const teacher = {
    // 新增老师
    addTeacher(params) {
        return httpRequest('POST', `/manage/teacher/addTeacher`, params)
    },
    // 删除老师
    deleteTeacher(params) {
        return httpRequest('POST', `/manage/teacher/deleteTeacher`, params)
    },
    // 编辑老师
    updateTeacher(params) {
        return httpRequest('POST', `/manage/teacher/updateTeacher`, params)
    },
    // 查询老师列表
    queryTeacherInfo(params) {
        return httpRequest('POST', `/manage/teacher/queryTeacherInfo`, params)
    },
    // 查询老师信息
    getTeacherInfoById(params) {
        return httpRequest('POST', `/manage/teacher/getTeacherInfoById`, params)
    },
    // 查询老师时间表
    teacherTime(params) {
        return httpRequest('POST', `/teacher/get-teacher-classes-by-days`, params)
    },
    // 保存排课
    save(params) {
        return httpRequest('POST', `/teacher/classSave`, params)
    },
    // 保存自由排课
    freeSave(params) {
        return httpRequest('POST', `/class/free-save`, params)
    },
    // 保存循环排课
    circleSave(params) {
        return httpRequest('POST', `/class/circle-save`, params)
    },
    // 保存编辑课程
    saveEditClass(params) {
        return httpRequest('POST', `/class/edit-class`, params)
    },
    // 获取监督课程列表
    getSuperviseClassList(params) {
        return httpRequest('POST', `/teacher/get-supervise-class-list`, params)
    },
    // 取消课程
    cancelClass(params) {
        return httpRequest('POST', `/teacher/cancel-class`, params)
    },
    // 获取待上课程列表
    getClassLists(params) {
        return httpRequest('POST', `/teacher/get-teacher-classes-list`, params)
    },
    // 获取学生待上课程列表
    getStudentClassLists(params) {
        return httpRequest('POST', `/teacher/get-teacher-student-class-list`, params)
    },
    // 重置老师密码
    resetPassword(params) {
        return httpRequest('POST', `/manage/teacher/resetPassword`, params)
    },
    // 授权自主排课
    authorizeClass(params) {
        return httpRequest('POST', `/sys/dept/autoClass`, params)
    },
    // 查询学生或者老师下所有完课信息(课后单信息)
    getFinishedClassList(params) {
        return httpRequest('POST', `/teacher/get-finished-class-list`, params)
    },
    // 教师排课详情：获取关联学生
    fetchRelationStudents (params) {
        return httpRequest('POST', `/manage/teacher/queryUsersByTeacherId`, params)
    },
    // 教师排课详情：更新关联学生
    updateRelationStudents (params) {
        return httpRequest('POST', `/teacher/assignTeacherUser`, params)
    },
    // 邀请排课开关
    authInviteUser (params) {
        return httpRequest('POST', `/manage/teacher/authInviteUser`, params)
    },

    // 获取课程录音链接
    getClassAudioUrl(params) {
        return httpRequest('POST', `/teacher/get-class-audio-url`, params)
    },
    // 获取循环排课信息
    fetchLoopCourseInfo (params) {
        return httpRequest('post', '/class/get-template-schedule-info', params)
    },
    // 批量取消课程
    batchDeleteCourses (params) {
        return httpRequest('post', '/class/batch-cancel-class', params)
    },
    // 批量自由编辑课程（拖拽）
    batchDragCourses (params) {
        return httpRequest('post', '/class/free-edit', params);
    },
    // 查询当前课程实际上课时长
    fetchRealCourseTime (params) {
        return httpRequest('post', '/class/getRealClassTime', params);
    },
    // 获取循环排课冲突信息
    validateLoopCourse (params) {
        return httpRequest('post', '/class/get-circle-conflict-class-list', params);
    }
}
export const organAdmin = {
    // 查询角色权限列表
    getOrganAdminList(params) {
        return httpRequest('POST', `/sys/dept/list`, params)
    },
    // 新增教务
    addOrganAdmin(params) {
        return httpRequest('POST', `/sys/dept/save`, params)
    },
    // 修改教务
    editOrganAdmin(params) {
        return httpRequest('POST', `/sys/dept/update`, params)
    },
    // 删除教务
    delOrganAdmin(params) {
        return httpRequest('POST', `/sys/dept/delete`, params)
    },
}

export const checkInviteCode = {
    // 邀请码审核未处理接口
    todoList(params) {
        return httpRequest('POST', `/sys/invite/todoList`, params)
    },
    // 邀请码审核已处理接口
    doneList(params) {
        return httpRequest('POST', `/sys/invite/doneList`, params)
    },
    // 邀请码审核通过接口
    pass(params) {
        return httpRequest('POST', `/sys/invite/pass`, params)
    },
    // 邀请码审核拒绝接口
    reject(params) {
        return httpRequest('POST', `/sys/invite/reject`, params)
    },
    
    
    
    
}

export const customCourse = {
    // 教室明细接口
    classRoomConfig(params) {
        return httpRequest('POST', `/sys/classRoomConfig/info`, params)
    },
    // 时长配置接口
    getTimeConfigList(params) {
        return httpRequest('POST', `/sys/classRoomConfig/getTimeConfigList`, params)
    },
    // 修改时长配置接口
    updateTimeList(params) {
        return httpRequest('POST', `/sys/classRoomConfig/updateTimeList`, params)
    },
    
    
}

export const studentShow = {
    // 学生展示获取接口
    getOrganInfo(params) {
        return httpRequest('POST', `/organInfo/getOrganInfo`, params)
    },
    // 学生展示保存接口
    setOrganInfo(params) {
        return httpRequest('POST', `/organInfo/setOrganInfo`, params)
    },
}