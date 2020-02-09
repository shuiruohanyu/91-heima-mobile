<template>
<!-- 小智同学的页面结构 -->
 <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list"  ref="myList">
      <!-- list的数据分两种 一种是小智同学说的 一种是我自己说的 -->
      <!-- 这个div 要展示两种场景 小智的场景 左边  我的场景 右边 -->
      <!-- 根据当前 name的值 决定 样式 是left 还是right  -->
      <!--  v-bind绑定class的对象语法  当前的样式left还是right -->
      <div :class="{ left: item.name === 'xz', right: item.name!='xz' }"  class="chat-item" v-for="(item,index)  in list" :key="index">
        <!-- 小智同学的图片 -->
        <!-- 需要根据item中的name值 决定是否显示 左侧的图片 或者右侧的图片 -->
        <van-image v-if="item.name === 'xz'" fit="cover" round  :src="XZImg" />
        <div class="chat-pao">{{ item.msg }}</div>
        <!-- 右边再放置一个图片 -->
        <van-image  v-if="item.name !== 'xz'" fit="cover" round :src="photo" />
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <!-- 进度条的目的是 控制用户输入内容的频率 -->
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <!-- 点击发送 给小智同学 发消息-->
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">发送</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/images/xz.png' // 引入小智同学的头像
import { mapState } from 'vuex' // 引入辅助函数
import io from 'socket.io-client' // 引入socket.io的客户端代码
export default {
  data () {
    return {
      value: '', // 用来绑定用户的谈话内容
      loading: false,
      XZImg, // 在data中定义一个变量
      list: [] // 专门存放聊天的内容 一条记录 代表一个消息内容
    }
  },
  methods: {
    // 滚动到底部
    scrollBottom () {
      // 需要通过获取滚动条高度 和设置滚动条距离来滚动
      // 滚动条的位置是通过什么属性来控制的
      // scrollTop  滚动条位置距离顶部距离属性来控制
      // 需要将位置滚动底部
      // 想要保证这个方法执行的时候 数据的视图已经更新完毕
      // $nextTick 会在上一次数据更新 并且视图完成渲染之后执行
      this.$nextTick(() => {
        // 可以保证 在滚动的时候 视图已经更新完毕
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
      })
      // this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight
    },
    async  send () {
    // 发送消息的时候 要做什么事情?
    // 获取要发送的内容
      if (!this.value) return false // 如果为空字符串 就直接返回 不继续往下走了
      this.loading = true // 先打开加载状态
      // 设置一下时间的间隔
      await this.$sleep() // 默认时间是500毫秒
      // 如果不为空 继续发送
      // emit 发送消息 on接收消息
      let obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 时间戳给什么 应该给当前的时间戳
      }
      // 发送这条消息
      this.socket.emit('message', obj) // 发送消息
      // 发出消息之后应该做什么事情
      // 应该把刚发送的消息 加到 消息列表里面
      this.list.push(obj) // 在数据中加了一条记录 渲染视图 9 条数 => 10条
      // 清空本身的消息内容
      this.value = '' // 清空内容
      this.loading = false // 回复状态
      this.scrollBottom() // 消息发送完毕  滚动条设置距离
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 映射vuex中的公共变量
  },
  // 实例创建完毕之后执行的函数
  created () {
    // 建立和websocket和服务器的连接
    // 原生方式  new WebSocket()
    // 封装的socket.io
    // io(连接地址, { 额外参数 })
    this.socket = io('http://ttapi.research.itcast.cn', {
      // query参数
      query: {
        token: this.user.token // 从vuex中获取用户的token
      }
    }) // 用this.socket 接收了一个socketIO的实例对象
    this.socket.on('connect', () => {
      console.log('和服务器建立连接成功!!!')
      // 先让小智同学和用户说一句话 模拟说话
      this.list.push({ msg: '秃头小王子,你好,跟我唠唠呗', name: 'xz' }) // name:xz 表示这句话是小智同学说的
    })
    //  如何知道建立连接成功
    // 需要监听 小智同学回复的消息 回到参数中是参数的
    // data =>  msg (小智同学回复的内容)
    // timestmp (小智同学回复的时间戳)
    // 这个位置 只有小智同学回复的时候才会调用
    this.socket.on('message', (data) => {
      this.list.push({ ...data, name: 'xz' }) // name:xz相当于 给我们的消息记录一下 谁发了这个消息
      this.scrollBottom() // 接收消息的时候 也要设置 滚动条距离
    })
  },
  // 页面销毁之前的钩子函数
  beforeDestory () {
    // 销毁连接
    this.socket.close() // 销毁连接
  }

}
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
