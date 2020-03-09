// 错误页面
const Error = () => import('@/views/common/error.vue') // 错误页面
export default [
    // 404错误页面
    {
        path: '*',
        name: '',
        component: Error,
        meta: {
            title: '抱歉--访问出错了'
        }
    }
]