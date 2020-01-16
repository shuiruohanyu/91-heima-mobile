<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <!-- trim自动去空格的修饰符 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toSearchResult(item)" icon="search" v-for="item in suggestList" :key="item">
        {{ item }}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <!-- 只有当有历史记录的时候 才显示整个历史的记录的盒子 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空所有历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- 循环生成历史记录  item是惟一的 搜索历史记录不应该重复 -->
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="item">
          <!-- item就是搜索的关键字 -->
          <a class="word_btn">{{ item }}</a>
          <!-- 给删除按钮注册删除事件 -->
          <!-- 事件修饰符 事件名.stop 表示 阻止了事件冒泡 -->
          <van-icon
            @click.stop="delHistory(index)"
            class="close_btn"
            slot="right-icon"
            name="cross"
          />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 用来当做存储 本地历史记录的key
import { suggestion } from '@/api/article'
const key = 'hm-91-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      q: '', // 查询内容
      historyList: [], // 存放历史记录的数据
      suggestList: [] // 存放联想建议的数组

    }
  },
  watch: {
    // 防抖搜索
    // q () {
    //   clearTimeout(this.timer)
    //   this.timer = setTimeout(async () => {
    //     // 搜索联想的词汇
    //     if (!this.q) {
    //       this.suggestList = [] // 当搜索关键字变成空的时候将 联想数组清空
    //           return false
    //     }
    //     let data = await suggestion({ q: this.q }) // 搜索联想建议
    //     this.suggestList = data.options
    //   }, 500)
    // }
    // 节流搜索
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null // 将定时器的标记清空
          // 搜索联想的词汇
          if (!this.q) {
            this.suggestList = [] // 当搜索关键字变成空的时候将 联想数组清空
            return false // 直接返回 下面不再执行
          }
          let data = await suggestion({ q: this.q }) // 搜索联想建议
          this.suggestList = data.options
        }, 500)
      }
    }
  },
  methods: {
    // 删除对应的历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除对应的历史记录
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
    },
    // 跳到搜索结果页面
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转到搜索结果界面
    },
    // 清空所有历史
    clear () {
      this.historyList = [] // 清空所有历史
      localStorage.setItem(key, '[]') // 写入缓存
    },
    // 什么时候触发 回车/虚拟键盘搜索
    onSearch () {
      // 跳转到搜索结果之前 应该把当前的搜索关键字 写入到历史记录
      if (!this.q) return // 如果q为空没有必要往下走
      // 如果不为空 要讲this.q加入到历史记录中去
      let obj = new Set(this.historyList) // 生成一个set变量  set对象自动去重
      obj.add(this.q)
      this.historyList = Array.from(obj) // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      //  也应该去搜索结果页面 而且 也要携带参数
      this.$router.push({ path: '/search/result', query: { q: this.q } }) // 直接跳转到搜索结果界面
    },
    // 点击联想搜索关键词 去跳转 => 先把点击的关键词放入历史记录 表示我搜索过
    toSearchResult (text) {
      // 放入历史记录
      let obj = new Set(this.historyList) // 生成一个set变量  set对象自动去重
      obj.add(text)
      this.historyList = Array.from(obj) // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转到搜索结果界面
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 读取本地化的内容
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
