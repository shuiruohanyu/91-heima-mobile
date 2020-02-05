<template>
<!-- 评论列表组件 -->
  <div class="comment">
    <!-- 列表  上拉加载  loading  是否开启加载状态 finished 是否已经全部加载完成 -->
    <!-- van-list 组件可以完成上拉加载工作 -->
    <!-- 首页中 我们给van-list组件绑定了 @load事件 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <!--用过滤器 处理相对时间 -->
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <!-- 通过openReply方法 传递 点击的评论ID -->
            <van-tag plain @click="openReply(comment.com_id)">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复列表弹层 -->
    <van-action-sheet :round="false" v-model="showReply"  class="reply_dialog" title="回复评论">
      <!-- 回复列表组件  加载状态 finished finshed-text=""-->
      <!-- immediate-check 控制当前 van-list组件是否主动检查滚动  关闭了主动检查 第一次不会主动的去调用load事件对应的方法了 -->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <!-- 要循环的数据 -->
         <div class="item van-hairline--bottom van-hairline--top" v-for="reply in  reply.list" :key="reply.com_id.toString()">
          <!-- 用户头像 -->
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <!-- 用户昵称 -->
            <p><span class="name">{{ reply.aut_name }}</span></p>
            <!-- 评论内容 -->
            <p>{{ reply.content }}</p>
             <!--用过滤器 处理相对时间 -->
            <p><span class="time">{{ reply.pubdate | relTime }}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments } from '@/api/article' // 引入 封装的获取评论方法
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 用来存放评论列表的数据
      offset: null, // 表示分页依据 如果为空,表示从第一页开始 获取文章评论的分页依据 a
      showReply: false, // 控制回复列表组件的显示和隐藏
      reply: {
        // 专门用reply这个对象存放回复相关的数据
        loading: false, // 是回复列表组件的状态
        finished: false, // 是回复列表组件的结束状态
        offset: null, // 偏移量 获取评论的评论的分页依据 c
        list: [], // 用于存放 当前弹出的关于某个评论的回复列表的数据
        commentId: null // 用来存放 当前点击的评论Id
      }
    }
  },
  methods: {
    // 打开回复列表面板
    openReply (commentId) {
      this.showReply = true // 弹出面板
      // 进行若干操作
      this.reply.commentId = commentId // 存储当前点击的commentId
      this.reply.list = [] // 清空原有的数据
      this.reply.offset = null // 重置回复的偏移量 因为每个评论的评论都是从第一页开始
      this.reply.finished = false // 设置成原始状态
      this.reply.loading = true // 主动打开加载状态 因为这个时候没有了自动的检查
      // 开始加载第一页的数据了
      this.getReply() // 开始调用第一页的数据 前面的状态已经设置完毕了
    },
    // 获取评论的评论 也就是获取回复数据的方法
    async getReply () {
      // 加载逻辑
      let data = await getComments({
        type: 'c', // c代表获取评论的评论
        offset: this.reply.offset, // 偏移量
        source: this.reply.commentId.toString() // 代表获取的评论(id)的评论
      })
      this.reply.list.push(...data.results) // 将评论的评论加到数据尾部
      // 拿到的data只是请求的第一页的数据
      this.reply.loading = false // 评论的评论的加载状态关闭
      this.reply.finished = data.end_id === data.last_id // 如果last_id 等于end_id表示 没有数据可以再加载了
      if (!this.reply.finished) {
        //  意味着有下一页的数据
        this.reply.offset = data.last_id // 把当前页的最后一个id给偏移量 作为请求下一页的参数依据
      }
    },
    // 一级评论
    async  onLoad () {
      //  加载评论数据
      let data = await getComments({
        type: 'a', // 获取类型
        offset: this.offset, // 偏移量
        source: this.$route.query.articleId // 获取文章的id
      })
      this.comments.push(...data.results) // 将数据添加到当前评论列表的尾部
      this.loading = false // 关闭正在上拉加载的状态
      this.finished = data.last_id === data.end_id // 如果当前页ID等于整个评论最后一个id 表示 我们已经请求万了所有的数据
      if (!this.finished) {
        // 表示 last_id 和 end_id不等 不等的话表示 还有下一页数据
        this.offset = data.last_id // 将last_Id设置成下一页的请求依据
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
// 回复列表组件的样式
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
