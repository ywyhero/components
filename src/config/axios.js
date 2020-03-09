/*
 * axios http请求配置
 * @baseURL 请求api地址
 * @headers 头文件设置
 * @timeout 超时时间
 */
import axios from 'axios'
import Env from './env.js'
import { Message } from 'element-ui'
axios.defaults.timeout = 10000;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.baseURL = Env.api || 'http://localhost:8080'

axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
    let jwtToken = ''
    if(window.sessionStorage.getItem('jwtToken')) {
        jwtToken = window.sessionStorage.getItem('jwtToken')
    }
    config.headers['Jwt-Token'] = jwtToken
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(res => {
    let jwtToken = '';
    if (jwtToken) {
        window.sessionStorage.setItem('jwtToken', jwtToken);
    }
    if (res.data.code === 401) {
        Message({
            type: 'error',
            message: '授权过期，请重新登录。',
            onClose: () => {
                window.sessionStorage.removeItem('jwtToken')
                window.sessionStorage.removeItem('userInfo')
                window.sessionStorage.removeItem('routeList')
                location.href = '/login'
            }
        })
        return
    }
    return res.data
}, error => {
    Message({
        type: 'error',
        message: '网络繁忙，请重试'
    })
    return Promise.reject(error)
})


export default axios
