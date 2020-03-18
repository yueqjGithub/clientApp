<template>
<div class="flex-row flex-space-between flex-align-center flex-nowrap text-black"
     :class="{'clock-wait': status === 0, 'clock-start': status === 1, 'clock-end': status === 2}"
>
  <div class="clock-show">{{hours}}</div>
  <div class="clock-unit">:</div>
  <div class="clock-show">{{min}}</div>
  <div class="clock-unit">:</div>
  <div class="clock-show">{{sec}}</div>
</div>
</template>

<script>
export default {
  name: 'clock',
  props: ['stamp', 'status'],
  data () {
    return {
      steps: 0,
      int: ''
    }
  },
  created () {
    this.steps = this.stamp / 1000
    this.changeTime()
  },
  computed: {
    sec () {
      let vm = this
      let num = vm.steps % 60
      let str
      if (num < 10) {
        str = `0${num}`
      } else {
        str = `${num}`
      }
      return str
    },
    min () {
      let vm = this
      let num = Math.floor(vm.steps / 60)
      let minNUm = num % 60
      let str
      if (minNUm < 10) {
        str = `0${minNUm}`
      } else {
        str = `${minNUm}`
      }
      return str
    },
    hours () {
      let vm = this
      let num = Math.floor(vm.steps / 3600)
      if (num < 10) {
        return `0${num}`
      } else {
        return `${num}`
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.int)
  },
  methods: {
    changeTime () {
      let vm = this
      vm.int = setInterval(() => {
        if (vm.steps > 0) {
          vm.steps--
        }
      }, 1000)
    }
  },
  watch: {
    steps (newVal, oldVal) {
      let vm = this
      if (newVal !== oldVal) {
        if (newVal === 0) {
          if (vm.status !== 2) { // 进行中或即将开始
            // 触发视图更新
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .clock-show{font-size: 1.2rem;border-radius: 15%;}
  .clock-unit{font-size: 1.2rem;margin-left: .3rem;margin-right: .3rem;font-weight: bold;}
  .clock-end .clock-show{
    color: #000000;
  }
  .clock-end .clock-unit{color: #000000}
  .clock-start .clock-show{color: #F6535B;}
  .clock-start .clock-unit{color: #F6535B;}
</style>
