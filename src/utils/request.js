import axios from 'axios'
import qs from 'qs'
import router from '../router/index'
import { message as Message } from '@/utils/message.js'
import { Loading } from 'element-ui'
import { parseTime } from './index'

const TOKEN = 'authorization'
const MAX_TIMEOUT = 20000
const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded;charset=UTF-8'
const CONTENT_TYPE_JSON = 'application/json;charset=UTF-8'
let reqList = []  //定义请求列表 实现请求不能重复请求
let cancelList = []  //存放正在请求的取消方法 


function getToken() {
  return localStorage.getItem(TOKEN)
}

function jumToLogin() {
  router.push('/')
}

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMsg - 请求中断时需要显示的错误信息
 */
function stopRepeatRequest(reqList, url, cancel, errorMsg, allowRepeatRequest) {
  const errMsg = errorMsg || ''
  cancelList.push(cancel)
  if (reqList.indexOf(url) > -1 && !allowRepeatRequest) {
    //如果该请求已经发起过，就把该请求取消
    cancel(errMsg)
    return
  }
  reqList.push(url)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
function allowRequest(reqList, url,) {
  let reqIndex = reqList.findIndex(exitUrl => exitUrl == url)
  reqList.splice(reqIndex, 1)
}

/** 
取消所有正在进行的请求 比如切换页面了 将当前还在进行的请求取消掉 
*/
function cancelReq() {
  cancelList.forEach(func => func('取消请求'))
}

/**
 * 相当于一个异步并发 控制请求的数量 当每个请求请求体都很大时 同时发起多个请求可能导致网页崩溃
 * @param {Array} reqList 所有请求的请求列表
 * @param {Number} max 最大同时请求数量
 * @returns 
 */
export function sendRequest(reqList, max = 4) {
  let len = reqList.length
  let counter = 0

  return new Promise((resolve, reject) => {
    async function start() {
      let options = {
        allowRepeatRequest: true
      }
      while (counter < len && max > 0) {
        max--
        let { url, data } = reqList[counter]
        counter++
        post(url, data, options).then(res => {
          max++
          if (counter === len) {
            resolve('请求列表执行完毕')
          } else {
            start()
          }
        }).catch(err => {
          max++
          reject(err)
          start()
        })
      }
    }
    start()
  })
}

/**
 * 
 * @param {*} params 
 * @returns 
 */


/** 
 * @param {object} params
*/
function buildHttpClient(params) {
  const service = axios.create({
    baseURL: params.baseURL,
    withCredentials: true,//允许带cookie
    timeout: MAX_TIMEOUT,
  })

  let commonParams = {}
  service.interceptors.request.use(config => {
    let cancel
    config.cancelToken = new axios.CancelToken(c => cancel = c)

    config.onUploadProgress = function (e) {
      //可以通过store将值传回使用的页面
      return parseInt(e.loaded / e.total)
    }
    //为请求加上公共请求参数 比如某些请求需要加上统一的key或者secretId等情况
    if (config.method === 'post') {
      let data = qs.parse(config.data)
      Object.assign(data, commonParams)
      config.data = data
    }
    if (config.method === 'get') {
      if (config.params) {
        Object.assign(config.params, commonParams)
      } else {
        config.params = Object.assign({}, commonParams)
      }
    }
    if (params.cancelExitRequest) {
      cancelReq()
    }
    stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求太频繁了`, params.allowRepeatRequest)
    config.headers[TOKEN] = getToken()
    config.headers['Content-type'] = params.ContentType === 'json' ? CONTENT_TYPE_JSON : CONTENT_TYPE_FORM
    return config
  })

  //前后端可以约定返回的数据结构形式,这里需要根据公司情况而定，比如：
  /* {
    code:0 //成功
    data:data,
    msg:'成功'
  } */
  service.interceptors.response.use(response => {
    //  设置延时是因为不让短时间内多次请求一个接口
    setTimeout(() => {
      allowRequest(reqList, response.config.url)
    }, 300);
    if (response.status !== 200) {
      Message({
        message: response.message || '请求失败',
        type: 'error',
        duration: 2000
      })
      if (response.status === 500 || response.status === 502 || response.status === 504) {
        MessageBox.confirm('登录超时，是否需要返回重新登录？', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem(TOKEN)
          location.reload()
        })
      }
      return Promise.reject(new Error(response.message || 'Error'))
    } else {
      return response.data
    }

  }, error => {
    //失败了也要把reqList中该请求删除
    setTimeout(() => {
      console.log(error);
      allowRequest(reqList, error.config ? error.config.url : '')
    }, 300);
    if (error.toString().indexOf('401') > -1) {
      error.message = 'token过期，请重新登陆'
      setTimeout(() => {
        jumToLogin()
      }, 200);
      localStorage.removeItem(TOKEN)
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 1000
    })
    return Promise.reject(error)
  })

  service.setCommonParams = function (params = {}, merge = false) {
    commonParams = merge ? Object.assign(commonParams, params) : Object.assign({}, params)
  }

  return service
}

/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} options 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param showError 本次是否显示错误
 * @param ContentType post请求的请求头
 * @param baseUrl  项目中如果想使用mock数据，直接将baseUrl改为mock，单独配置mock的proxy即可
 * @param setCommonData  可以根据此字段来设置统一的请求参数
 * @param commonParams  配合setCommonParams设置通用params
 * @param cancelExitRequest  是否要取消正在进行的请求
 * @param allowRepeatRequest  是否允许重复请求
 */
function request(url, params, method, options) {
  let defaultOptions = {
    loading: false,
    showError: true,
    ContentType: 'json',
    baseURL: '/api',
    setCommonData: false,
    commonParams: {},
    cancelExitRequest: false,
    allowRepeatRequest: true
  }
  options = Object.assign(defaultOptions, options)
  let loadingInstance
  let instance = buildHttpClient(options)
  /* 
  可以通过options的参数来设置统一的参数
  instance.setCommonParams({ appId: '123456' }) 
  */

  if (options.loading) {
    loadingInstance = Loading.service()
  }
  return new Promise((resolve, reject) => {
    let data
    if (method === 'get') {
      data = { params }
    }
    if (method === 'post') {
      data = { data: params }
    }
    instance({
      url,
      method,
      ...data
    }).then(res => {
      //这里可以对返回的数据结构进行处理，比如日期，金额，数字等等
      /* if (res.code === 0) {
        let data = delTime(res.data)  //将返回的时间处理为时间字符串
        resolve(data)
      } else {
        if (options.showError) {
          Message.error(res.message)
        }
        reject(res)
      } */
      resolve(res)
    }).catch(err => {
      Message.error(err.message || '请求失败')
      reject(err)
    }).finally(() => {
      if (loadingInstance) {
        loadingInstance.close()
      }
    })
  })
}

/**
 * 处理时间戳 这里是个演示的例子
 * @param data 传入全部数据 将时间戳转为时间字符串
 * */

function delTime(data) {
  if (!data || typeof (data) != 'object') {
    return
  }
  let result = Array.isArray(data) ? [] : {}
  Object.keys(data).forEach(key => {
    if (data[key] && typeof (data[key]) === 'object') {
      result[key] = delTime(data[key])
    } else {
      if (typeof (data[key]) === 'number' && data[key].length == 13) {
        data[key] = parseTime(data[key])
      }
      result[key] = data[key]
    }
  })
  return result
}

/**
 * 创建post请求
 * @param {object} requestParams
 * @param {string} url  请求地址
 * @param {object} params 请求参数
 * @param {object} options? 本次请求配置 可不写 
 * 
 */
export function post(requestParams) {
  let { url, data, options } = requestParams
  return request(url, data, 'post', options)
}
/**
 * 创建get请求
 * @param {requestParams}
 * 
 */
export function get(requestParams) {
  let { url, params, options } = requestParams
  return request(url, params, 'get', options)
}

