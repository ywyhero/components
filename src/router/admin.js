// 管理员页面
const admin = () => import('@/views/admin/admin.vue')
// 角色管理
const role = () => import('@/views/admin/role.vue')
// 参数管理
const parameter = () => import('@/views/admin/parameter.vue')
// 菜单管理
const menu = () => import('@/views/admin/menu.vue')

export default [
    {
        path: 'admin',
        name: '管理员管理',
        component: admin,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'role',
        name: '角色管理',
        component: role,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'parameter',
        name: '字典管理',
        component: parameter,
        meta: {
            keepAlive: false
        }
    }, {
        path: 'menu',
        name: '菜单管理',
        component: menu,
        meta: {
            keepAlive: false
        }
    }
]