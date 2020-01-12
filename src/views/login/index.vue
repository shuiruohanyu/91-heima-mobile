<template>
  <div class='container'>
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 手机号  验证码  登录按钮 -->
    <van-cell-group>
      <van-field  label="手机号" placeholder="请输入手机号"></van-field>
      <van-field  label="验证码" placeholder="请输入验证码">
        <!-- slot指定给哪个坑填内容 -->
        <van-button  slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class='btn-box'>
      <van-button type="info" size="small" round block>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style scoped>
   .btn-box {
     padding: 20px;
   }
</style>
