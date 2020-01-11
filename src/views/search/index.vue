<template>
  <div class='container'>
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title='搜索中心' @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
  </div>
</template>

<script>
export default {
  name: 'search'
}
</script>

<style>

</style>
