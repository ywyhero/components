
const checkInviteCode = () => import('@/views/management/checkInviteCode.vue') 
const studentShow = () => import('@/views/management/studentShow.vue')
export default [ {
        path: 'checkinvitecode',
        name: '邀请码审核',
        component: checkInviteCode,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'studentshow',
        name: '学生展示',
        component: studentShow,
        meta: {
            keepAlive: false
        }
    }
]