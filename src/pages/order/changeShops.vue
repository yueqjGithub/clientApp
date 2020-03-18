<template>
  <q-page class="cus-bg-grey full-width full-height">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            切换门店
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <!-----------------加载过度------------------>
    <q-inner-loading :showing="showLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
    <div v-if="!showLoading">
      <div v-for="k in shopList" :key="k.shopid" class="bg-white q-pa-md flex-row flex-space-between flex-align-center shop-item" @click="changeShops(k)">
        <div class="shop-name">{{k.shop_name}}</div>
        <div class="shop-distance">距离{{k.distance_tag}}</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import { mapState } from 'vuex'
export default {
  name: 'changeShops',
  data () {
    return {
      lat: '',
      lng: '',
      showLoading: false,
      shopList: []
    }
  },
  created () {
    let vm = this
    vm.showLoading = true
    navigator.geolocation.getCurrentPosition(position => {
      vm.lat = position.coords.latitude
      vm.lng = position.coords.longitude
      let params = {
        'companyid': vm.companyid,
        'lat': vm.lat,
        'lng': vm.lng
      }
      vm.$axios(urls.changeShop, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.shopList = [...res.list]
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      })
    }, () => {
      vm.showLoading = false
      vm.$q.notify({ message: '获取地理位置失败' })
      let param = {
        'lat': 30.546561,
        'lng': 104.066529,
        'companyid': vm.companyid
      }
      vm.$axios(urls.changeShop, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.shopList = [...res.list]
        }
      })
    })
  },
  computed: {
    ...mapState({
      companyid: state => state.common.companyid
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    changeShops (obj) {
      this.$store.commit('common/setUseShop', obj)
      this.$router.go(-1)
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
  .shop-item + .shop-item {
    margin-top: 1rem;
  }
  .shop-name{color: #454C58;font-size: 1.4rem;font-weight: bold}
  .shop-distance{font-size: 1.2rem;color: #838D94;}
</style>
