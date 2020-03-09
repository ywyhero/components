// 学生列表页面
const organAdminList = () => import('@/views/organAdmin/organAdminList.vue')

export default [
    {
        path: 'organAdmin',
        name: '角色与权限',
        component: organAdminList,
        meta: {
            keepAlive: false
        }
    },
]