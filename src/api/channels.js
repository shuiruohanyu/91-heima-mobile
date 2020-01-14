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
