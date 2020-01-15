// 专门处理频道的请求
import request from '@/utils/request'
import store from '@/store'
// 本地缓存 需要key
const CACHE_CHANNEL_T = 'hm-91-toutiao-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-91-toutiao-u' // 登录用户的key
/*
获取我的频道
**/
export function getMyChannels () {
  // 返回一个Promise  axios默认就是get类型
  // 首先我们应该 先从缓存中读取 看看缓存中没没有 如果缓存中有的话 用缓存的数据 如果缓存中没有 才去查询
  // return request({
  //   url: '/user/channels'
  // })
  return new Promise(async function (resolve, reject) {
    // 做我们的逻辑
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      //  如果str存在 表示缓存中有数据
      resolve({ channels: JSON.parse(str) }) // 表示从缓存中获取的数据 通过执行链下发给下一个promise
    } else {
      // 如果没有数据
      const data = await request({ url: '/user/channels' }) // 从线上拉取数据
      localStorage.setItem(key, JSON.stringify(data.channels)) // 将线上数据写入缓存
      resolve(data) // 将线上获取的数据释放下给promise
    }
  })
}
/***
 * 获取所有频道
 * ***/
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/****
 *删除频道
 * ***/
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先也需要做判断  是删除 游客的频道还是删除登录的频道
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T // 用于缓存的key
    let channels = JSON.parse(localStorage.getItem(key)) // 得到缓存结果 缓存中一定是有数据的
    let index = channels.findIndex(item => item.id === id) // 找到对应频道的索引
    if (index > -1) {
      // 删除数据
      channels.splice(index, 1) // 直接删除原数组中的数据  第一种方式
      // channels = channels.filter(item => item.id !== id) // 新数组模式去除要删除的频道 第二种方式
      // 应该重新写入缓存
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入 缓存
      resolve()
    } else {
      reject(new Error('找不到对应的频道'))
    }
  })
}
