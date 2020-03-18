<template>
  <div>
    <q-pull-to-refresh @refresh="getFirstPage">
      <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage" v-if="list.length > 0">
        <item v-for="k in list" :key="k.id" :k="k" :userType="userType" :status="status"></item>
        <!--        <list-item v-for="k in list" :key="k.productid" :k="k"></list-item>-->
      </q-infinite-scroll>
      <no-info :message="`当前暂无数据`" v-if="showNo"></no-info>
      <q-inner-loading :showing="showLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <div class="flex-row flex-just-center flex-align-center list-bottom-line-group" v-if="showBottom">
        <div class="list-bottom-line"></div>
        <div class="text-center list-bottom-word">我是有底线的</div>
        <div class="list-bottom-line"></div>
      </div>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import urls from 'src/api/urls'
import Item from 'src/components/newItem'
export default {
  name: 'list',
  components: {
    Item
  },
  data () {
    return {
      lat: 0,
      lng: 0,
      thisPage: 1,
      totalPage: 0,
      pageCount: 20,
      list: [],
      showBottom: false,
      showNo: false,
      showLoading: false,
      userType: undefined,
      status: undefined
    }
  },
  created () {
    let loginInfo = this.$q.localStorage.getItem('loginInfo')
    this.userType = loginInfo.type
    this.getFirstPage()
  },
  methods: {
    getFirstPage (done) { // 获取第一页
      let vm = this
      vm.thisPage = 1
      vm.totalPage = 0
      vm.showBottom = false
      vm.showNo = false
      vm.showLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let param = {
          'lat': position.coords.latitude,
          'lng': position.coords.longitude,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount
        }
        vm.queryList(param, true, done)
      }, () => {
        vm.lat = 30.546561
        vm.lng = 104.066529
        let param = {
          'lat': 30.546561,
          'lng': 104.066529,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount,
          ...vm.opt
        }
        vm.queryList(param, true, done)
      })
    },
    addList (index, done) {
      let vm = this
      let params = {
        'lat': vm.lat,
        'lng': vm.lng,
        'thisPage': vm.thisPage + 1,
        'pageCount': vm.pageCount
      }
      vm.queryList(params, false, done)
    },
    queryList (param, refresh, done) {
      let vm = this
      vm.$axios(urls.limitIndex, param).then(res => {
        let code = res.code
        if (code === 'success') {
          if (refresh) { // 刷新时
            vm.list = [...res.list]
            vm.status = res.status
            if (res.list.length < vm.pageCount && res.list.length > 0) { // 不足一页时
              vm.showBottom = true
            } else if (res.list.length < 1) {
              vm.showNo = true
            }
            vm.totalPage = res.totalPage
            // 上交banner
            vm.$emit('subBanner', res.banner)
            // 上交status-状态，stamps-时间戳
            let obj = {
              status: res.status
            }
            if (res.status === 0) { // 未开始
              obj['stamp'] = res.limit_begin_mili
            } else if (res.status === 1) {
              obj['stamp'] = res.limit_end_mili
            } else {
              obj['stamp'] = 0
            }
            vm.$emit('subTime', obj)
          } else { // 翻页时
            vm.list = [...vm.list, res.list]
            vm.status = res.status
            if (res.list.length < vm.pageCount && res.list.length > 0) { // 不足一页时
              vm.showBottom = true
            }
            vm.this.page++
          }
          if (done) {
            done()
          }
        } else { // 服务器返回错误
          vm.showNo = true
        }
        vm.showLoading = false
      }, () => {
        vm.showLoading = false
        vm.showNo = true
        vm.$q.notify({ message: '获取数据失败，请检查网络是否畅通' })
      })
    }
  }
}
</script>

<style scoped>

</style>
