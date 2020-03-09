import Vue from 'vue'
import Vuex from 'vuex'
import { home, admin, qiniu } from '../service/index'
import * as types from './types'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        menuLists: [],
        breadcrumbLists: [],
        userPermission: {}, //用户权限
        operationReasonList: [],
        qiniuData: null,
        userInfo: {}
    },
    mutations: {
        [types.MENU_LISTS](state, res) {
            state.menuLists = res.menuList
        },
        [types.CHECK_PERMISSION](state, res) {
            state.userPermission = res
        },
        [types.GET_OPERATION_REASON_LIST](state, res) {
            state.operationReasonList = res
        },
        [types.GET_QINIU_DATA](state, res) {
            state.qiniuData = res
        },
        [types.GET_USER_INFO](state, res) {
            state.userInfo = null;
            state.userInfo = res
        },
    },
    getters: {
        getMenus: state => state.menuLists,
        getBreadcrumbs: state => state.breadcrumbLists,
        userPermission: state => state.userPermission,
        operationReasonList: state => state.operationReasonList,
        qiniuData: state => state.qiniuData,
        getUserInfo: state => state.userInfo
    },
    actions: {
        async getMenuLists({ commit }) {
            let { data } = await home.getNavLists()
            commit(types.MENU_LISTS, data)
        },
        changeUserInfo({commit}, res) {
            
            commit(types.GET_USER_INFO, res)
        },
        async checkPermission({ commit }) {
            try {
                let params = {
                    permissions: []
                }
                let { data } = await admin.checkPermission(params)
                commit(types.CHECK_PERMISSION, data)
            } catch (e) {
                return e
            }
        },
        async getOperationReasonList({ commit }) {
            try {
                let { data } = await admin.operationReasonList()
                commit(types.GET_OPERATION_REASON_LIST, data)
            } catch (e) {
                return e
            }
        },
       
        async getQiniuToken({ commit }) {
            try {
                let { data } = await qiniu.getQiniuToken({});
                commit(types.GET_QINIU_DATA, data)
            } catch (e) {
                return e
            }
        },
    }
})
