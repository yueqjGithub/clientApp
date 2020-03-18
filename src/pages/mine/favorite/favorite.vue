<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            我的收藏
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div>
      <q-pull-to-refresh @refresh="getFirstPage">
        <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage" v-if="list.length > 0">
          <list-item v-for="k in list" :key="k.index" :k="k" :show-share="true"></list-item>
        </q-infinite-scroll>
        <no-info v-if="list.length < 1" :message="'暂时没有收藏噢'"></no-info>
        <q-inner-loading :showing="showLoading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import noInfo from 'src/components/non'
import ListItem from 'src/components/productItem'
export default {
  name: 'favorite',
  components: {
    noInfo,
    ListItem
  },
  data () {
    return {
      thisPage: 1,
      pageCount: 20,
      totalPage: 0,
      showLoading: false,
      list: [],
      lat: 0,
      lng: 0
    }
  },
  created () {
    this.getFirstPage()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getFirstPage (done) {
      let vm = this
      this.thisPage = 1
      this.totalPage = 0
      this.showLoading = false
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let param = {
          'lat': position.coords.latitude,
          'lng': position.coords.longitude
        }
        vm.queryList(param, true, done)
      }, () => {
        // vm.$q.notify('获取当前位置失败' + err.message)
        vm.lat = 30.546561
        vm.lng = 104.066529
        let param = {
          'lat': vm.lat,
          'lng': vm.lng
        }
        vm.queryList(param, true, done)
      })
    },
    addList (index, done) {
      let vm = this
      let param = {
        'lat': vm.lat,
        'lng': vm.lng
      }
      this.queryList(param, true, done)
    },
    queryList (param, refresh, done) {
      let vm = this
      vm.showLoading = true
      vm.$axios(urls.myFavorite, param).then(res => {
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
            }
          }
          if (done) {
            done()
          }
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      })
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
</style>
