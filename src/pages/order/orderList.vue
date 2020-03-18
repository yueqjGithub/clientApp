<template>
  <div class="order-list-page">
    <div v-if="curTab !== myTab" class="q-pa-sm">
<!--      <no-info :message="'暂无数据'"></no-info>-->
      <div class="bg-white flex-row flex-space-between flex-align-start q-pa-sm">
        <q-skeleton size="20vw"></q-skeleton>
        <div style="margin-left: 5vw;height: 20vw;" class="flex-column flex-space-between">
          <q-skeleton width="40vw"></q-skeleton>
          <q-skeleton width="70vw"></q-skeleton>
          <q-skeleton width="70vw"></q-skeleton>
        </div>
      </div>
    </div>
    <div v-if="curTab === myTab">
      <div class="bg-white flex-row flex-space-between flex-align-start q-pa-sm" v-if="skeleton">
        <q-skeleton size="20vw"></q-skeleton>
        <div style="margin-left: 5vw;height: 20vw;" class="flex-column flex-space-between">
          <q-skeleton width="40vw"></q-skeleton>
          <q-skeleton width="70vw"></q-skeleton>
          <q-skeleton width="70vw"></q-skeleton>
        </div>
      </div>
      <div v-if="!skeleton">
        <q-pull-to-refresh @refresh="getFirstPage" v-if="list.length > 0">
          <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage">
            <order-item v-for="(k, index) in list" :key="k.orderid" :k="k" :status="curTab" @del="deleteOrder(index)"></order-item>
          </q-infinite-scroll>
          <q-inner-loading :showing="showLoading">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </q-pull-to-refresh>
        <no-info :message="'暂无数据'" v-if="list.length < 1"></no-info>
<!--        <div v-if="list.length < 1">当前暂无数据</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import orderItem from 'src/pages/order/orderItem'
import noInfo from 'src/components/non'
import urls from 'src/api/urls'
export default {
  name: 'orderList',
  components: {
    orderItem,
    noInfo
  },
  props: ['curTab', 'myTab'],
  data () {
    return {
      thisPage: 1,
      pageCount: 20,
      totalPage: 0,
      showLoading: false,
      lat: 0,
      lng: 0,
      list: [],
      skeleton: true
    }
  },
  created () {
    if (this.curTab === this.myTab) {
      this.getFirstPage()
    }
  },
  watch: {
    curTab (newVal, oldVal) {
      if (newVal === this.myTab) {
        this.getFirstPage()
      } else {
        this.skeleton = true
        this.list = []
        this.thisPage = 1
      }
    }
  },
  methods: {
    deleteOrder (index) {
      this.list.splice(index, 1)
      this.$q.notify({ message: '订单已删除' })
    },
    getFirstPage (done) { // 第一页
      let vm = this
      vm.thisPage = 1
      vm.totalPage = 0
      vm.showLoading = false
      let orderStatus
      if (vm.curTab === 'left') {
        orderStatus = 0
      } else if (vm.curTab === 'center') {
        orderStatus = 1
      } else if (vm.curTab === 'right') {
        orderStatus = 2
      }
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let param = {
          'lat': position.coords.latitude,
          'lng': position.coords.longitude,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount,
          'order_status': orderStatus
        }
        vm.queryInfo(param, true, done)
      }, () => {
        // vm.$q.notify('获取当前位置失败' + err.message)
        vm.lat = 30.546561
        vm.lng = 104.066529
        let param = {
          'lat': 30.546561,
          'lng': 104.066529,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount,
          'order_status': orderStatus
        }
        vm.queryInfo(param, true, done)
      })
    },
    addList (index, done) {
      let vm = this
      let orderStatus
      if (vm.curTab === 'left') {
        orderStatus = 0
      } else if (vm.curTab === 'center') {
        orderStatus = 1
      } else if (vm.curTab === 'right') {
        orderStatus = 2
      }
      let param = {
        'lat': vm.lat,
        'lng': vm.lng,
        'thisPage': vm.thisPage,
        'pageCount': vm.pageCount,
        'order_status': orderStatus
      }
      vm.queryInfo(param, false, done)
    },
    // 请求数据
    queryInfo (param, refresh, done) { // refresh--是否是刷新
      let vm = this
      vm.showLoading = true
      vm.$axios(urls.getOrderList, param).then(res => {
        let code = res.code
        if (code === 'success') {
          if (refresh) {
            vm.list = [...res.list]
            vm.totalPage = res.totalPage
          } else {
            if (res.list.length > 0) {
              vm.list = [...vm.list, ...res.list]
              vm.totalPage = res.totalPage
              vm.thisPage++
            } else {
              vm.thisPage++
              vm.showBottom = true
            }
          }
          if (done) {
            done()
          }
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
        vm.skeleton = false
      }, () => {
        vm.showLoading = false
        vm.skeleton = false
      })
    }
  }
}
</script>

<style scoped>
.order-list-page{
  width: 100vw;
  min-height: 90vh;
}
</style>
