<template>
  <div class='container'>
     <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- art_id有可能是大数字 超过一定长度会转成 BigNumber  要toString一下 -->
          <van-cell :to="`/article?articleId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 支持图片懒加载   当图片显示在当前可视区域的时候才去请求该图片的地址 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]"  />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]"  />
              </div>
              <div class="img_box" v-if="item.cover.type === 1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]"  />
              </div>
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{item.comm_count}}评论</span>
                <span>{{ item.pubdate | relTime }}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/article'
export default {
  name: 'searchResult',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载状态
      finished: false, // 是否已经完成了全部的加载
      articles: [], // 存放文章的列表
      page: {
        page: 1, // 表示当前的页码
        per_page: 10 // 表示每页请求10条数据
      }
    }
  },
  methods: {
    async onLoad () {
      let { q } = this.$route.query // 从地址栏解析查询参数
      let data = await searchArticle({ ...this.page, q })
      // 上拉加载的业务  =>  追加到队尾
      this.articles.push(...data.results)
      // 手动关闭加载状态
      this.upLoading = false // 关闭状态
      // 根据当前返回的 数组的长度 如果当前的长度为0 表示下一页肯定没有数据了
      if (data.results.length) {
        // 如果不为0
        this.page.page++ // 将页码加1 表示 还有下一页数据
      } else {
        this.finished = true // 表示加载结束
      }
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
