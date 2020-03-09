// 老师列表页面
const teacherList = () => import('@/views/teacherList/teacherList.vue')
const scheduleDetail = () => import('@/views/teacherList/scheduleDetail.vue')
const teachSupervision = () => import('@/views/teacherList/teachSupervision.vue')
const playback = () => import('@/views/teacherList/playback.vue')

export default [
    {
        path: 'teacher/list',
        name: '教师排课',
        component: teacherList,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'teacher/detail',
        name: '排课详情',
        component: scheduleDetail,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'teacher/supervise',
        name: '教学监督',
        component: teachSupervision,
        meta: {
            keepAlive: true
        }
    }, {
        path: 'teacher/playback',
        name: '录音回放',
        component: playback,
        meta: {
            keepAlive: false
        }
    },
]