import Vue from 'vue'
import Router from 'vue-router'
import Index from './../views/index.vue'
import admin from './admin.js'
import teacher from './teacher'
import organAdmin from './organAdmin'
import store from './../store/index'
import error from './../router/error.js'
import management from './../router/management.js'
Vue.use(Router)
const Login = () => import('@/views/common/login.vue')
const Register = () => import('@/views/common/register.vue')
const sysIndex = () => import('@/views/sysIndex.vue')
let routers = [
  {
    path: '/',
    component: Login
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/register',
    component: Register
  }, {
    path: '/system',
    component: Index,
    children: [
      {
        path: 'index',
        component: sysIndex
      },
      ...admin,
      ...teacher,
      ...management,
      ...organAdmin
    ]
  },
  ...error
]
let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routers
})
let routeList = window.sessionStorage.getItem('routeList') ? JSON.parse(window.sessionStorage.getItem('routeList')) : [];
store.state.breadcrumbLists = routeList
router.beforeEach((to, from, next) => {
  if (to.path !== '/system/index') {
    let index = routeList.findIndex(v => v.name === to.name)
    if (index !== -1) {
      //如果存在路由列表，则把之后的路由都删掉
      routeList.splice(index + 1, routeList.length - index - 1)
    } else {
      routeList.push({
        name: to.name,
        path: to.fullPath
      })
    }
    to.meta.routeList = routeList;
    store.state.breadcrumbLists = routeList;
    window.sessionStorage.setItem('routeList', JSON.stringify(routeList))
  }
  next()
})
export default router
