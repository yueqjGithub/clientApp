<template>
  <div class="sug-list-div">
    <q-pull-to-refresh @refresh="getFirstPage">
      <!-----轮播------------>
      <div v-if="showTops">
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
      <!--      typelist-->
      <div style="width: 100%;height: 0;" class="cus-bg-grey" ref="comType" v-if="showTops"></div>
      <div :class="scrollPosition > changePosition ? 'cus-abs' : ''" :style="{'top': `${truePosition}px`}" v-if="showTops">
        <type-list :list="typeList" v-if="typeList.length > 1" @filterList="changeOpt" style="position: relative;"></type-list>
      </div>
      <!--      typelist-->
      <div style="position: relative;">
        <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage" v-if="list.length > 0">
          <list-item v-for="k in list" :key="k.productid" :k="k"></list-item>
        </q-infinite-scroll>
        <q-inner-loading :showing="showLoading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
        <div class="flex-row flex-just-center flex-align-center bottom-line-group" v-if="showBottom">
          <div class="bottom-line"></div>
          <div class="text-center bottom-word">我是有底线的</div>
          <div class="bottom-line"></div>
        </div>
        <no-info :message="`没有对应推荐产品，555~~`" v-if="showNull"></no-info>
      </div>
    </q-pull-to-refresh>
    <q-scroll-observer @scroll="test" />
  </div>
</template>

<script>
import ListItem from './productItem'
import noInfo from 'src/components/non'
import typeList from './newType'
import urls from 'src/api/urls'
export default {
  name: 'productList',
  components: {
    ListItem,
    noInfo,
    typeList
  },
  // props: ['finalPosition'],
  props: {
    finalPosition: {},
    showTops: {
      default: true
    }
  },
  data () {
    return {
      showLoading: false,
      showBottom: false,
      list: [],
      thisPage: 1,
      pageCount: 10,
      totalPage: 0,
      lat: '',
      lng: '',
      showNull: false,
      // banner
      showSkeleton: true,
      slide: 1,
      bannerList: [],
      // type
      typeList: [],
      opt: {},
      scrollPosition: 0,
      changePosition: 0
    }
  },
  created () {
    this.getFirstPage()
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
            'typeid': [...list]
          }
        }
      } else {
        this.opt = {
          'typeid': list
        }
      }
    },
    getFirstPage (done) { // 首次请求
      let vm = this
      vm.totalPage = 0
      vm.thisPage = 1
      vm.showBottom = false
      vm.showLoading = true
      vm.showNull = false
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
        vm.queryList(urls.getSugFirst, param, true, done)
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
        vm.queryList(urls.getSugFirst, param, true, done)
      })
    },
    addList (index, done) {
      let vm = this
      let param = {
        'lat': vm.lat,
        'lng': vm.lng,
        ...vm.opt
      }
      vm.queryList(urls.sugPage, param, false, done)
    },
    queryWath (url, param) {
      let vm = this
      vm.$axios(url, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.list = [...res.list]
          vm.totalPage = res.totalPage
          if (res.list.length <= vm.pageCount && res.list.length > 0) {
            vm.showBottom = true
          } else if (res.list.length === 0) {
            vm.showNull = true
          }
          // vm.$emit('setBanner', res.banner)
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      })
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
    queryList (url, params, refresh, done) {
      let vm = this
      vm.$axios(url, params).then(res => {
        let code = res.code
        if (refresh) { // 加载第一页
          if (code === 'success') {
            vm.list = [...res.list]
            vm.totalPage = res.totalPage
            if (res.list.length <= vm.pageCount && res.list.length > 0) {
              vm.showBottom = true
            } else if (res.list.length === 0) {
              vm.showNull = true
            }
            // banner
            vm.setBanner(res.banner)
            // type
            vm.typeList = res.type_list
            if (done) {
              done()
            }
          } else {
            vm.$q.notify({ message: res.msg })
          }
          vm.showLoading = false
        } else { // 翻页
          if (code === 'success') {
            if (res.list.length > 0) {
              vm.list = [...vm.list, ...res.list]
              vm.totalPage = res.totalPage
              vm.thisPage++
              if (res.list.length < vm.pageCount) {
                vm.showBottom = true
              }
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
        }
      }, err => {
        vm.$q.notify({ message: JSON.stringify(err) })
        vm.showLoading = true
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
        vm.showNull = false
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
          vm.queryWath(urls.sugPage, param, done)
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
          vm.queryWath(urls.sugPage, param, done)
        })
      }
    }
  }
}
</script>

<style scoped>
  .sug-list-div{
    /*margin-top: .2rem;*/
  }
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
  .cus-abs{
    position: fixed;
    z-index:2;
    width: 100vw;
    overflow: auto;
  }
  .index-banner{
    width: 100%;
    max-height: 29vw;
    display: block;
  }
</style>
