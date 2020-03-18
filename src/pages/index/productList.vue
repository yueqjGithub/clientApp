<template>
  <div class="my-list-bar">
    <q-pull-to-refresh @refresh="getFirstPage">
      <!-----轮播------------>
      <div>
        <div class="full-width bg-white">
          <q-skeleton height="29vw" v-if="showSkeleton" animation="wave"></q-skeleton>
          <div class="full-width" v-else>
            <img :src="`https://${bannerList[0]}`" alt="" class="index-banner" v-if="bannerList.length < 2">
            <q-carousel
              v-else
              animated
              :navigation="false"
              v-model="slide"
              height="29vw"
              infinite
              autoplay
              transition-prev="slide-right"
              transition-next="slide-left"
            >
              <q-carousel-slide v-for="k in bannerList" :key="k" :name="k" :img-src="`https:${k}`" />
              <!--        <q-carousel-slide :name="bannerList[0]" :img-src="bannerList[0]"></q-carousel-slide>-->
              <!--        <q-carousel-slide :name="bannerList[1]" :img-src="bannerList[1]"></q-carousel-slide>-->
            </q-carousel>
          </div>
        </div>
      </div>
      <tab-list :tabs="tabList"></tab-list>
      <!--      typelist-->
      <div style="width: 100%;height: .8rem;" class="cus-bg-grey" ref="comType"></div>
      <div :class="scrollPosition > changePosition ? 'cus-abs' : ''" :style="{'top': `${truePosition}px`}">
        <type-list :list="typeList" v-if="typeList.length > 1" @filterList="changeOpt" style="position: relative;"></type-list>
      </div>
      <!--      typelist-->
      <div style="position: relative;">
        <q-inner-loading :showing="showLoading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
        <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage" v-if="list.length > 0">
          <div class="flex-row flex-space-between flex-align-center item-container flex-wrap q-pa-md">
            <item v-for="k in list" :key="k.shop_id" :k="k"></item>
          </div>
          <!--        <list-item v-for="k in list" :key="k.productid" :k="k"></list-item>-->
        </q-infinite-scroll>
        <no-info :message="`当前暂无数据`" v-if="showNo"></no-info>
        <div class="flex-row flex-just-center flex-align-center bottom-line-group" v-if="showBottom">
          <div class="bottom-line"></div>
          <div class="text-center bottom-word">我是有底线的</div>
          <div class="bottom-line"></div>
        </div>
      </div>
    </q-pull-to-refresh>
<!--    <div class="text-center text-grey-14" v-else>当前暂无数据</div>-->
    <q-scroll-observer @scroll="test" />
  </div>
</template>

<script>
import urls from 'src/api/urls'
import Item from './item'
import noInfo from 'src/components/non'
import typeList from './newType'
import TabList from './newTab'
// import ListItem from 'src/components/productItem'
export default {
  name: 'productList',
  props: ['finalPosition'],
  components: {
    // ListItem
    TabList,
    typeList,
    Item,
    noInfo
  },
  data () {
    return {
      showLoading: false,
      showBottom: false,
      list: [],
      thisPage: 1,
      pageCount: 20,
      totalPage: 0,
      lat: '',
      lng: '',
      showNo: false,
      scrollPosition: 0,
      changePosition: 0,
      typeList: [],
      opt: {},
      // tab
      tabList: [],
      // banner
      showSkeleton: true,
      slide: 1,
      bannerList: []
    }
  },
  mounted () {
    this.getFirstPage()
    // 104.066529,30.546561
    // 调试
    // this.lat = 30.546561
    // this.lng = 104.066529
    // let param = {
    //   'lat': 30.546561,
    //   'lng': 104.066529,
    //   'thisPage': 1,
    //   'pageCount': this.pageCount
    // }
    // this.queryList(param)
  },
  computed: {
    truePosition () {
      let num = 0
      if (this.scrollPosition > this.changePosition) {
        num = this.finalPosition
      }
      return num
    }
  },
  methods: {
    test (info) {
      // console.log(this.$refs['comType'].offsetTop)
      this.changePosition = this.$refs['comType'].offsetTop
      this.scrollPosition = info.position
    },
    changeOpt (list) {
      if (Array.isArray(list)) {
        if (list.length > 0) {
          this.opt = {
            'shop_typeid': [...list]
          }
        } else {
          this.opt = {}
        }
      } else {
        this.opt = {
          'shop_typeid': list
        }
      }
    },
    setBanner (list) {
      if (Array.isArray(list)) {
        this.bannerList = list
      } else {
        this.bannerList.push(list)
      }
      this.showSkeleton = false
      this.slide = list[0]
    },
    openDrawer () {
      this.$emit('open')
    },
    getFirstPage (done) { // 首次请求
      let vm = this
      vm.totalPage = 0
      vm.thisPage = 1
      vm.showBottom = false
      vm.showLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let param = {
          'lat': position.coords.latitude,
          'lng': position.coords.longitude,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount,
          ...vm.opt
        }
        vm.queryList(param, done)
      }, () => {
        // vm.$q.notify('获取当前位置失败' + err.message)
        vm.lat = 30.546561
        vm.lng = 104.066529
        let param = {
          'lat': 30.546561,
          'lng': 104.066529,
          'thisPage': vm.thisPage,
          'pageCount': vm.pageCount,
          ...vm.opt
        }
        vm.queryList(param, done)
      })
    },
    queryList (params, done) { // 覆盖式拉取列表
      let vm = this
      vm.$axios(urls.queryIndexList, params).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.list = res.list
          vm.totalPage = res.totalPage
          if (res.list.length < vm.pageCount && res.list.length > 0) {
            vm.showBottom = true
          }
          if (res.list.length < 1) {
            vm.showNo = true
          } else {
            vm.showNo = false
          }
          // vm.$emit('setBanner', res.banner)
          vm.setBanner(res.banner)
          // vm.$emit('setTabs', res.activity)
          vm.tabList = res.activity
          // vm.$emit('setType', res.shop_type)
          vm.typeList = res.shop_type
          if (done) {
            done()
          }
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
        vm.showLoading = false
      })
    },
    addList (index, done) { // 增长式拉取列表
      let vm = this
      let params = {
        'lat': vm.lat,
        'lng': vm.lng,
        'thisPage': vm.thisPage + 1,
        'pageCount': vm.pageCount,
        ...vm.opt
      }
      vm.showLoading = true
      vm.$axios(urls.addIndexList, params).then(res => {
        let code = res.code
        if (code === 'success') {
          if (res.list.length > 0) {
            vm.list = [...vm.list, ...res.list]
            vm.totalPage = res.totalPage
            vm.thisPage++
          } else {
            vm.thisPage++
            vm.showBottom = true
          }
          // console.log(done)
          if (done) {
            done()
          }
          vm.showLoading = false
        } else {
          vm.$q.notify({ message: res.msg })
          vm.showLoading = false
        }
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
      })
    }
  },
  watch: {
    opt (newval, oldval, done) {
      if (newval !== oldval) {
        let vm = this
        vm.totalPage = 0
        vm.thisPage = 1
        vm.showBottom = false
        vm.showLoading = true
        vm.showLoading = true
        navigator.geolocation.getCurrentPosition(position => {
          vm.lat = position.coords.latitude
          vm.lng = position.coords.longitude
          let param = {
            'lat': position.coords.latitude,
            'lng': position.coords.longitude,
            'thisPage': vm.thisPage,
            'pageCount': vm.pageCount,
            ...vm.opt
          }
          vm.$axios(urls.addIndexList, param).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.list = res.list
              vm.totalPage = res.totalPage
              if (res.list.length <= vm.pageCount && res.list.length > 0) {
                vm.showBottom = true
              }
              if (res.list.length < 1) {
                vm.showNo = true
              } else {
                vm.showNo = false
              }
              if (done) {
                done()
              }
            } else {
              vm.$q.notify({ message: res.msg })
            }
            vm.showLoading = false
          }, err => {
            vm.$q.notify({ message: JSON.stringify(err) })
            vm.showLoading = false
          })
        }, () => {
          // vm.$q.notify('获取当前位置失败' + err.message)
          vm.lat = 30.546561
          vm.lng = 104.066529
          let param = {
            'lat': 30.546561,
            'lng': 104.066529,
            'thisPage': vm.thisPage,
            'pageCount': vm.pageCount,
            ...vm.opt
          }
          vm.$axios(urls.addIndexList, param).then(res => {
            let code = res.code
            if (code === 'success') {
              vm.list = res.list
              vm.totalPage = res.totalPage
              if (res.list.length < vm.pageCount && res.list.length > 0) {
                vm.showBottom = true
              }
              if (res.list.length < 1) {
                vm.showNo = true
              } else {
                vm.showNo = false
              }
              if (done) {
                done()
              }
            } else {
              vm.$q.notify({ message: res.msg })
            }
            vm.showLoading = false
          }, err => {
            vm.$q.notify({ message: JSON.stringify(err) })
            vm.showLoading = false
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.my-list-bar{
  /*margin-top: .7rem;*/
}
.myFilter{
  color: #666666;
}
.tit-img{
  max-width: 20vw;
}
.list-tit-row{
  /*position: sticky;*/
  /*top: .7rem;*/
}
/*------------------卡片样式-----------------*/
.bottom-line-group{
  margin: .8rem auto 0 auto;
}
.bottom-line{
  width: 20%;
  border: 1px solid #5B5B5B;
  margin-left: 5%;
  margin-right: 5%;
}
.bottom-word{
  color: #5B5B5B;
}
/*-------------------------item 样式-----------------*/
  .item-container{
    width: 100%;
  }
.cus-abs{
  position: fixed;
  z-index:2;
  width: 100vw;
  overflow: auto;
}
.index-banner{
  width: 100%;
  display: block;
  max-height: 29vw;
}
</style>
