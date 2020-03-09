import axios from './axios.js'

export const httpRequest = (type, url, params={}) => {
    url = `${axios.defaults.baseURL}${url}`
    type = type.toUpperCase()
    if(type === 'GET') {
        return new Promise((resolve, reject) => {
            axios.get(url, params)
                .then(res => {
                    resolve(res)
                }, error => {
                    reject(error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    } else if(type === 'POST') {
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(res => {
                    resolve(res)
                }, error => {
                    reject(error)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
