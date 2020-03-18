<template>
  <div class="my-mem-tip bg-white">
    <div class="q-pa-md flex-column flex-space-around flex-align-start mem-tip-top">
      <div class="mem-tip-con">{{tit}}</div>
      <div class="mem-tip-sta">{{content}}</div>
      <div class="mem-tip-int">您将享受以下特权</div>
    </div>
    <div class="mem-tip-bot q-pa-md">
      <div class="mem-tip-opt flex-row flex-space-between flex-align-center">
        <div class="mem-opt-item flex-column flex-space-between flex-align-center">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/diamond-nbg.png" alt="">
          <div class="flex-column flex-space-around flex-align-center">
            <div class="mem-word-lg">专享会员价</div>
            <div class="mem-word-sm">享受折上折</div>
          </div>
        </div>
        <div class="mem-opt-item flex-column flex-space-between flex-align-center">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/double-nbg.png" alt="">
          <div class="flex-column flex-space-around flex-align-center">
            <div class="mem-word-lg">消费奖励贝</div>
            <div class="mem-word-sm">双倍奖励</div>
          </div>
        </div>
        <div class="mem-opt-item flex-column flex-space-between flex-align-center">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/cash-nbg.png" alt="">
          <div class="flex-column flex-space-around flex-align-center">
            <div class="mem-word-lg">更多福利</div>
            <div class="mem-word-sm">敬请期待</div>
          </div>
        </div>
      </div>
      <div class="mem-btn q-pa-lg">
        <q-btn class="bg-primary text-white full-width" label="朕知道了" rounded unelevated @click="goBack"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  name: 'tips',
  props: ['type'],
  data () {
    return {
      tit: '',
      content: ''
    }
  },
  created () {
    let vm = this
    console.log(vm.type)
    switch (vm.type) {
      case 1: // 首次开通
        vm.tit = '恭喜您'
        vm.content = '升级为知了会员'
        break
      case 2: // 有效期内续费
        vm.tit = '恭喜您'
        vm.content = '成功续费知了会员'
        break
      case 3: // 已过期续费
        vm.tit = '恭喜您再续前缘'
        vm.content = '升级为知了会员'
        break
    }
  },
  methods: {
    goBack () {
      // 处理local
      let old = this.$q.localStorage.getItem('loginInfo')
      old.type = 1
      this.$q.localStorage.set('loginInfo', old)
      let obj = {
        type: 1,
        status: 1
      }
      this.$store.commit('common/setVipStatus', obj)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.my-mem-tip{border-radius: .5rem;overflow: hidden;width: 95%;}
  .mem-tip-con{font-size: 2.3rem;color: #333333;font-weight: bold;}
  .mem-tip-sta{font-size: 1.8rem;color: #f95860;font-weight: bold;margin-top: 1.1rem;}
  .mem-tip-int{font-size: 1.2rem;color: #999999;margin-top: 1rem;}
  .mem-tip-bot{border-top: 1px solid #e6e6e6}
  .mem-opt-item{width: 28%;}
  .mem-opt-item img{width: 100%;display: block;margin-bottom: .8rem;}
  .mem-word-lg{font-size: 1.4rem;color: #000000;font-weight: bolder;}
  .mem-word-sm{font-size: 1.1rem;color: #333333;}
</style>
