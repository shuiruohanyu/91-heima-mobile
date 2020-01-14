<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
       <!-- 放置list组件list组件可以实现 上拉加载 -->
       <van-list v-model="upLoading" :finished="finished"  finished-text="没有了" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载
      finished: false // 是否已经完成全部的数据加载
    }
  },
  methods: {
    //   上拉加载方法
    onLoad () {
      console.log('开始加载数据')
    }
  }
}
</script>

<style>
</style>
