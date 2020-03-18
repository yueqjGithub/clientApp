<template>
  <div class="prize-tips flex-row flex-align-center flex-just-start">
    <img src="https://pic.iidingyun.com/8696123/commonImg/c/prize-notice.png" alt="" class="notice-img">
    <div class="notice-word" v-if="list.length > 0">{{list[rand].user_name}}抽中了{{list[rand].prize_name}}</div>
  </div>
</template>

<script>
export default {
  name: 'notice',
  props: ['list'],
  data () {
    return {
      rand: 0,
      myInt: ''
    }
  },
  created () {
    this.setRand()
  },
  methods: {
    setRand () {
      let vm = this
      this.myInt = setInterval(() => {
        vm.rand = Math.floor(Math.random() * vm.list.length)
      }, 3000)
    }
  }
}
</script>

<style scoped>
.prize-tips{width: 16rem;position: absolute;top: 3vh;left: 3vw;background: rgba(0,0,0,0.5);border-radius: 1.4rem;height: 2.8rem;}
.notice-img{width: 1.6rem;margin-left: 1rem;}
  .notice-word{font-size: 1.3rem;color: white;margin-left: .6rem;white-space:nowrap; text-overflow:ellipsis; overflow:hidden; width: 13rem;}
</style>
