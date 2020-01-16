<template>
  <div class='container'>
    <!-- 用户个人资料 -->
    <div class="user-profile">
      <div class="info">
        <!-- 头像 -->
        <van-image round :src="userInfo.photo" />
        <!-- 用户名 -->
        <h3 class="name">
          {{ userInfo.name }}
          <br />
          <van-tag size="mini">申请认证</van-tag>
        </h3>
      </div>
      <van-row>
        <van-col span="8">
          <p>{{ userInfo.art_count }}</p>
          <p>动态</p>
        </van-col>
        <van-col span="8">
          <p>{{ userInfo.follow_count }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="8">
          <p>{{userInfo.fans_count}}</p>
          <p>粉丝</p>
        </van-col>
      </van-row>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="newspaper-o" color="#7af"/>我的作品
      </van-col>
      <van-col span="8">
        <van-icon name="star-o" color="#f00"/>我的收藏
      </van-col>
      <van-col span="8">
        <van-icon name="tosend" color="#fa0"/>阅读历史
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="edit" title="编辑资料" to="/user/profile" is-link />
      <van-cell icon="chat-o" title="小智同学" to="/user/chat" is-link />
      <van-cell icon="setting-o" title="系统设置" is-link />
      <van-cell icon="warning-o" title="退出登录" @click="lgout" is-link />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { mapMutations } from 'vuex' // 引入辅助函数
export default {
  name: 'user',
  data () {
    return {
      userInfo: {} // 接收用户个人信息
    }
  },
  methods: {
    ...mapMutations(['clearUser']), // 映射vuex中的mutations方法
    // 获取用户个人信息
    async getUserInfo () {
      this.userInfo = await getUserInfo() // 将数据赋值给当前的userInfo
    },
    // 登出方法
    async lgout () {
      try {
      // 应该先友好的询问一下
        await this.$dialog.confirm({ message: '您确定要退出登录吗' })
        //  应该将之前的token给删除掉
        //  this.$store.commit('clearUser')
        this.clearUser() // 清除用户的token
        this.$router.push('/login') // 跳到登录页
      } catch (error) {

      }
    }
  },
  created () {
    // 调用获取数据的方法
    this.getUserInfo()
  }
}
</script>

<style lang='less' scoped>
.user {
  &-profile {
    width: 100%;
    height: 150px;
    display: block;
    background: #3296fa;
    color: #fff;
    .info {
      display: flex;
      padding: 20px;
      align-items: center;
      .van-image{
        width: 64px;
        height: 64px;
      }
      .name {
        font-size: 16px;
        font-weight: normal;
        margin-left: 10px;
      }
      .van-tag {
        background: #fff;
        color: #3296fa;
      }
    }
    p{
      margin: 0;
      text-align: center;
    }
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
      padding-bottom: 5px;
    }
  }
}
</style>
