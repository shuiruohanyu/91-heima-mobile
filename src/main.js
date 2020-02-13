import Vue from 'vue'
import App from './App.vue'
import router from './permission' // 经过权限处理的router
import store from './store'
import Vant, { Lazyload } from 'vant' // 引入 vant组件库  引入lazyload对象 (懒加载)
import plugin from '@/utils/plugin'
import 'vant/lib/index.less' // vant 样式文件 换成less
import '@/styles/index.less' // 引入全局的自定义样式  因为要覆盖vant的样式
import 'amfe-flexible' // 引入自动适配插件
Vue.use(Vant) // 一旦完成注册  在任意位置就可以使用 Vant组件库的组件
Vue.use(plugin) // 注册小插件 会调用插件中的install方法
Vue.use(Lazyload) // 完成懒加载对象的注册
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 处理 物理返回键的问题
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
