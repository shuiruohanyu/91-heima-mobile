<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 可选频道 -->
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel,i) in channels" :key="channel.id">
            <!-- 告诉父组件点击了哪个频道 -->
          <span @click="$emit('selectChannel', channel.id)" class="f12">{{channel.name}}</span>
          <!-- 通过编辑状态 来控制 叉号图标的显示和隐藏 -->
          <!-- 先控制第一个推荐频道不允许删除 -->
          <template v-if="i!==0">
              <!-- 再根据状态决定是否显示 删除叉号 -->
            <van-icon  v-show="editing" class="btn" name="cross"></van-icon>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="channel in optionalChannels" :key="channel.id">
          <span class="f12">{{channel.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 是否正在编辑
      allChannels: [] // 用来接收所有的频道
    }
  },
  props: {
    //   接收props数据
    channels: {
      type: Array,
      default: () => [] // eslint 要求我们必须用一个函数来声明数组类型 所以用箭头函数
    }
  },
  methods: {
    async  getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 给所有频道赋值
    }
  },
  computed: {
    //   可选频道 =  全部频道  - 当前的频道
    optionalChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels() // 获取所有频道
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
