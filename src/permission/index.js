// 路由的拦截  => 导航守卫
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入store
// 前置守卫 => 当你的路由发生改变之前触发
// to 到哪里去
// from 从哪里来
// next 函数 => 必须 next() => resolve 这个钩子  => 前面不执行next  => 后面永远不执行
// next(false) // 终止当前的跳转
// next(地址) // 跳到另外一个地址
// next() 放行
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    //  拦截 判断有无token  有token => 放行 没有token => 登录
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: to.path // 携带要去的地址到登录页 => 登录成功之后  有了权限 再回到刚才没有权限去的地址
      }
    }
    next(toPath)
  } else {
    next() // 直接放行
  }
})
// 后置守卫
export default router
