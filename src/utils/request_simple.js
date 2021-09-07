import axios from 'axios'
import { MessageBox } from 'element-ui'
import { message } from '@/utils/message.js'
import router from '../router/index'
const TOKEN = localStorage.getItem('authorization')
const BASE_URL = '/api'
const service = axios.create({
  baseURL: BASE_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000
})

// request interceptor
service.interceptors.request.use(
  config => {
    console.log(config);
    if (!localStorage.getItem('authorization') && router.currentRoute.path != '/') {
      setTimeout(() => {
        router.push('/')
      }, 1000);
    }
    config.headers['authorization'] = localStorage.getItem('authorization')
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 2000
      })
      if (response.status === 500 || response.status === 502 || response.status === 504) {
        MessageBox.confirm('登录超时，是否需要返回重新登录？', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('authorization')
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    if (error.toString().indexOf('401') > -1) {
      error.message = 'token过期，请重新登陆'
      localStorage.removeItem('authorization')
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error)
  }
)

export default service
