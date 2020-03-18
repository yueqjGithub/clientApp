<template>
  <div class="flex-row flex-space-between flex-align-center" @click="toAddress">
    <div class="local-l">
      {{distance}}
      <span>|</span>
      {{address}}
    </div>
<!--    <q-btn flat class="local-r" icon-right="app:iconright"></q-btn>-->
    <div class="text-right local-r">
      <span>导航</span>
      <q-icon name="app:iconright"></q-icon>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Platform } from 'quasar'
/* eslint-disable */
export default {
  name: 'location',
  props: ['distance', 'address', 'nowLocation', 'target'],
  data () {
    return {
      link: ''
    }
  },
  methods: {
    toAddress () {
      let vm = this
      vm.$q.bottomSheet({
        message: '',
        actions: [
          {
            label: '百度地图',
            id: 'baidu',
            classes: 'text-left'
          }
        ]
      }).onOk(action => {
        if (action.id === 'baidu') {
          appAvailability.check("com.baidu.BaiduMap",() => {
            if (vm.$q.platform.is.android) {
              vm.link = `bdapp://map/walknavi?origin=${vm.nowLocation.lat},${vm.nowLocation.lng}&destination=${vm.target.lat},${vm.target.lng}&coord_type=gcj02&src=org.mteb.cl`
            } else if (vm.$q.platform.is.ios) {
              vm.link = `baidumap://map/walknavi?destination=${vm.target.lat},${vm.target.lng}&coord_type=gcj02&src=ios.mteb.cicada`
            }
            let a = document.createElement('a')
            a.href = vm.link
            a.click()
          }, () => {
            vm.$q.notify('您尚未安装百度地图')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.local-l{
  color: #999999;
  font-size: 1.2rem;
}
.local-r{
  color: #999999;
  font-size: 1.2rem;
}
</style>
