import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)
// vuex  和缓存数据的同步 redux
export default new Vuex.Store({
  // 放置数据的地方  初始化的时候直接将用户信息给我们的公共状态
  state: {
    user: auth.getUser() // 从缓存中
  },
  // state数据修改必须通过谁
  // payload 载荷中携带 user
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user // 更新数据
      auth.setUser(payload.user) // 将数据同步设置到本地存储中
    },
    // 清空User
    clearUser (state) {
      state.user = {}
      auth.delUser() // 将缓存中的数据也清空
    }
  },
  actions: {
  },
  modules: {
  }
})
