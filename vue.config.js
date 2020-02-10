module.exports = {
  // 重写的样式配置
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  },
  configureWebpack: (config) => {
    // 这个config参数就是当前vue-cli项目的所有的webpack配置信息
    // 想要改动 直接改这个信息就可以
    // 判断下当前的环境是否是 生产环境
    if (process.env.NODE_ENV === 'production') {
      //  webpack 会在生产模式下运行
      // 把所有的console都删除掉 然后再打包
      // 这里的删除并不是删除源代码的console 而是删除打包出来的console
      // drop_console 这个意思是删除所有的console true => 表示删除所有的console
      // 百度 解决方案
      // 看当前项目的默认配置
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './' // 默认值是/ 改成
}
