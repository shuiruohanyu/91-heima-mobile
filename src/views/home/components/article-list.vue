<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <!-- 放置list组件list组件可以实现 上拉加载 -->
      <van-list v-model="upLoading" :finished="finished" finished-text="没有了" @load="onLoad">
        <!-- v-for 渲染数据 -->
        <van-cell v-for="article in articles" :key="article.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{ article.title }}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type === 3">
              <van-image class="w33" fit="cover" :src="article.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="article.cover.images[2]" />
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="article.cover.type === 1">
              <van-image class="w100" fit="cover" :src="article.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{ article.aut_name }}</span>
              <span>{{ article.comm_count }}评论</span>
              <span>{{ article.pubdate }}</span>
              <span class="close">
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新状态
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否已经完成全部的数据加载
      articles: [], // 定义一个数据来接收上拉加载的数据
      refreshSuccessText: '', // 下拉成功显示的文本
      timestamp: null // 定义一个时间戳 这个时间戳用来告诉服务器 现在我要求什么样的时间的数据
    }
  },
  props: {
    channel_id: {
      type: Number, // 指定要传的props的类型
      required: true, // 要求props必须传
      default: null // 给props一个默认值
    }
  },
  methods: {
    //   上拉加载方法
    async onLoad () {
      // console.log('获取数据')
      // setTimeout(() => {
      //   //   给数据设置一个上限  不超过50条 如果50 条
      //   if (this.articles.length < 50) {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => this.articles.length + index + 1
      //     )
      //     this.articles.push(...arr)
      //     //   关掉状态
      //     this.upLoading = false
      //   } else {
      //     this.finished = true // 告诉list组件  我已经加载完了 不要再去触发onLoad事件了
      //   }
      // }, 1000)
      // 请求数据  注意如果 时间戳为就传当前时间
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      this.articles.push(...data.results)

      // 关掉加载的状态
      this.upLoading = false // 关掉状态
      // 判断历史时间戳 如果你有历史 表示我还可以继续往下看 否则就不看了
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 否则认为 没有历史了 木有必要继续加载了
        this.finished = true // 告诉list组件  我已经加载完了 不要再去触发onLoad事件了
      }
    },
    // 下拉刷新方法
    async onRefresh () {
      // 触发下拉刷新
      // console.log('下拉刷新')
      // setTimeout(() => {
      //   let arr = Array.from(Array(10), (value, index) => '追加' + (index + 1))
      //   this.articles.unshift(...arr) // 将数据添加到队首
      //   this.downLoading = false // 关掉下拉状态
      //   this.refreshSuccessText = `更新了${arr.length}条数据`
      // }, 1000)
      // 下拉刷新永远拉取的是最新的数据
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      this.downLoading = false // 关掉下拉状态
      // 有可能 最新没有推荐数据
      if (data.results.length) {
        // 如果长度大于0 表示有数据
        this.articles = data.results // 将历史数据全都覆盖掉了
        // 假如你之前 已经将 上拉加载设置成finished设置成true了
        // 表示 我们还需要继续往下拉 就需要把原来的状态再次打开
        this.finished = false
        // 注意我们依然需要获取此次的历史事件戳
        this.timestamp = data.pre_timestamp // 赋值历史时间戳 因为当你下拉刷新之后 上拉加载的时候 要用到这个历史事件戳
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
      //  如果没有数据更新  什么都不需要变化
        this.refreshSuccessText = '已是最新数据'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
