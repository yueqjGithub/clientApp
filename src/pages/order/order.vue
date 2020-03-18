<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round disable></q-btn>
          </div>
          <div class="cus-header-m text-center">
            订单
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <q-tabs
      v-model="tab"
      class="bg-white my-tab"
      narrow-indicator
      dense
      align="justify"
      indicator-color="primary"
    >
      <q-tab name="left" label="待使用" :ripple="false"/>
      <q-tab name="center" label="已使用" :ripple="false"/>
      <q-tab name="right" label="退款" :ripple="false"/>
    </q-tabs>
    <div class="cus-scroll-view">
      <div class="my-swiper-container flex-row flex-just-start flex-align-start" v-touch-pan.horizontal.prevent.mouse="handlePan"
      :style="{transform: `translate(${transX}px, 0)`}"
      >
        <order-list :curTab="tab" :my-tab="'left'"></order-list>
        <order-list :curTab="tab" :my-tab="'center'"></order-list>
        <order-list :curTab="tab" :my-tab="'right'"></order-list>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import { Screen } from 'quasar'
/* eslint-disable */
import orderList from './orderList'
export default {
  name: 'order',
  components: {
    orderList
  },
  data () {
    return {
      tab: 'left',
      transX: 0
    }
  },
  created () {
    let initTab = this.$route.params.init
    if (initTab) {
      this.tab = initTab
    }
  },
  methods: {
    handlePan ({ evt, ...info }) {
      let vm = this
      // console.log(this.$q.screen.width)
      let sw = this.$q.screen.width
      let halfSw = sw/2
      if (info.distance.x < halfSw) { // 拖动距离小于半屏
        if (info.isFinal) { // 拖动结束
          switch (info.direction) {
            case 'left':
              vm.transX += info.distance.x
              break
            case 'right':
              vm.transX -= info.distance.x
              break
          }
        } else {
          vm.myScroll(info.direction, info.delta.x)
        }
      } else { // 拖动距离大于半屏
        if (info.direction === 'left') {
          if (info.isFinal) {
            if (vm.tab === 'left') {
              vm.toCenter()
            } else if (vm.tab === 'center') {
              vm.toRight()
            } else if (vm.tab === 'right') {
              vm.toLeft()
            }
          } else {
            vm.myScroll(info.direction, info.delta.x)
          }
        } else {
          if (info.isFinal) {
            if (vm.tab === 'right') {
              vm.toCenter()
            } else if (vm.tab === 'center') {
              vm.toLeft()
            } else if (vm.tab === 'left') {
              vm.toRight()
            }
          } else {
            vm.myScroll(info.direction, info.delta.x)
          }
        }
      }
    },
    myScroll (direction, distance) {
      let vm = this
      vm.transX += distance
    },
    toLeft () {
      this.tab = 'left'
    },
    toCenter () {
      this.tab = 'center'
    },
    toRight () {
      this.tab = 'right'
    }
  },
  watch: {
    tab (newVal, oldVal) {
      if (newVal !== oldVal) {
        let vm = this
        let sw = this.$q.screen.width
        switch (newVal) {
          case 'left':
            vm.transX = 0
            break
          case 'center':
            vm.transX = -sw
            break
          case 'right':
            this.transX = -2*sw
            break
        }
      }
    }
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  .my-tab{
    padding-bottom: .4rem;
    padding-top: .4rem;
    margin-bottom: .2rem;
  }
  .cus-scroll-view{
    width: 100%;
    overflow: auto;
  }
  .my-swiper-container{
    width: 300%;
    /*padding-bottom: 1rem;*/
    /*transition:  1s linear;*/
  }
  .swiper-cont{
    min-height: 50vh;
    width: 100vw;
  }
</style>
