<template>
  <div id="app">
    <keep-alive>
      <!-- 一级路由容器  将所有的一级路由组件 都进行了缓存-->
       <!--
         $route.meta.isAlive 如果为 true 就需要用keep-alive包裹 router-view
         如果为false 就必须把router-view 放置在 keep-alive组件之外
         v-if  条件渲染
         -->
         <!-- 如果为true  就包在里面 -->
         <!-- 可以保证只有 layout组件进行缓存 -->
      <router-view v-if="$route.meta.isAlive"  />
    </keep-alive>
    <!-- 如果为false就放在外面 -->
      <router-view v-if="!$route.meta.isAlive"  />
  </div>
</template>

<style lang="less">

</style>
