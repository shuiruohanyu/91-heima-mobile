// 封装request模块
// 为什么要封装 ? 因为 要在拦截器里处理  token统一注入, 响应数据的统一处理返回 处理大数字
// token失效
import axios from 'axios' // 引入axios插件
import JSONBig from 'json-bigint' // 处理大数字插件
import store from '@/store' // 引入vuex中的store实例
// 创建一个新的 插件实例
// 应该给request请求 一个默认的请求头  baseURL
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 设置一个常量的基础地址
  transformResponse: [function (data) {
    //  当后台 响应的字符串 回到axios请求时 就会触发
    //  data是一个字符串  把字符串转化成 对象并且返回 默认的是JSON.parse()
    // 如果data是一个空字符串  直接转化就会报错
    // return data ? JSONBig.parse(data) : {}
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data // 如果失败 就把字符串直接返回
    }
  }] // 处理后台返回的数据  字符串 => 对象  JSON.parse() => JSONBig.parse()  =>转化大数字类型
}) // 创建一个axios的请求 工具
// 拦截器
// 请求拦截器 => 发起请求 => 请求拦截器  => 服务器  => 统一注入token
// 响应拦截器 => 服务器  =>  响应拦截器   => then  await
instance.interceptors.request.use(function (config) {
// 应该在返回配置之前  往配置里塞入token
  if (store.state.user.token) {
    //   如果token存在 就要注入
    config.headers['Authorization'] = `Bearer ${store.state.user.token}` // 统一注入token
  }
  // 配置信息
  return config
}, function (error) {
  return Promise.reject(error) // 直接返回promise错误
})
// 响应拦截器
instance.interceptors.response.use(function (response) {
  // 响应数据  返回得到的响应数据  第一层data是axios默认包data, 第二个data是接口返回里面的包的data
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  // 错误的时候 token容易失效
  return Promise.reject(error)
})
export default instance // 导出request工具
