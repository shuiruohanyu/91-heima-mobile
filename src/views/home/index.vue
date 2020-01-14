<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable>
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
       <!-- 因为一个tab标签 对应一个article-list组件 -->
         <article-list></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav" />
    </span>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels } from '@/api/channels'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  data () {
    return {
      activeIndex: 0, // 默认启动第0 个标签
      channels: [] // 声明接收频道的数据
    }
  },
  components: {
    ArticleList
  },
  methods: {
    async  getMyChannels () {
      // 获取频道列表数据
      let data = await getMyChannels()
      this.channels = data.channels // 将频道赋值给声明的变量
    }
  },
  created () {
    this.getMyChannels() // 获取频道
  }
}
</script>

<style lang='less' scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>
