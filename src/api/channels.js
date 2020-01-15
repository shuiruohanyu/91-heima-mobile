// 专门处理频道的请求
import request from '@/utils/request'
/*
获取我的频道
**/
export function getMyChannels () {
  // 返回一个Promise  axios默认就是get类型
  return request({
    url: '/user/channels'

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
