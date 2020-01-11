import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant' // 引入 vant组件库
import 'vant/lib/index.css' // 样式文件
Vue.use(Vant) // 一旦完成注册  在任意位置就可以使用 Vant组件库的组件
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
