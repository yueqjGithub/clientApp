<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">知了搜索</div>
          <div class="cus-header-r">
          </div>
        </div>
        <div class="index-search q-pa-sm">
          <q-input
            dense
            autofocus
            v-model="searchKey"
            borderless
            :debounce="1500"
            :bottom-slots="false"
            :hide-bottom-space="true"
            placeholder="请输入菜品/门店关键字"
            class="cus-search-input"
            input-class="text-white"
            @focus="openHots"
          >
            <template v-slot:prepend>
              <q-icon name="img:https://pic.iidingyun.com/8696123/commonImg/c/search_icon.png"/>
            </template>
          </q-input>
          <q-btn flat label="搜索" text-color="white" class="searchBtn" @click="getFirstPage"></q-btn>
        </div>
      </div>
      <q-slide-transition>
        <div class="bg-white" v-show="showHot">
          <div class="hot-key-div q-pa-sm">
            <div class="key-tit">热门搜索</div>
            <div class="q-pa-sm flex-row flex-wrap flex-just-start flex-align-start">
              <div  style="position: relative;height: 7rem;" class="full-width" v-if="searchLoading">
                <q-inner-loading :showing="searchLoading">
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </div>
              <div v-for="k in hotKeys" :key="k.word" class="key-word" @click="getWords(k.word)">{{k.word}}</div>
            </div>
            <div class="flex-row flex-space-between flex-align-center">
              <div class="key-tit">历史搜索</div>
              <q-icon name="app:iconlajitong" class="cus-font-14 text-black" @click="clearHistory"></q-icon>
            </div>
            <div class="q-pa-sm flex-row flex-wrap flex-just-start flex-align-start">
              <div v-for="k in history" :key="k.index" class="key-word" @click="getWords(k.word)">{{k.word}}</div>
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-header>
    <!-------------list----------------->
    <div v-if="showSug" class="sug-div" v-touch-swipe.mouse="hideHot">
      <div class="flex-row flex-space-between flex-align-center sug-tit q-pa-sm">知了推荐，好吃又省钱</div>
      <sug-list :show-tops="false"></sug-list>
    </div>
    <div class="list-cont-div" v-touch-swipe.mouse="hideHot" v-else>
      <q-infinite-scroll @load="turnPage" :offset="20" :disable="list.length < pageCount || page > totalPage">
        <list-item v-for="k in list" :key="k.productid" :k="k"></list-item>
      </q-infinite-scroll>
      <q-inner-loading :showing="showLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <div class="full-width flex-column flex-just-center flex-align-center" v-if="showNull">
        <img src="https://pic.iidingyun.com/8696123/commonImg/c/no_result.png" alt="">
        <p class="text-center">没有找到相关产品</p>
      </div>
      <div class="flex-row flex-just-center flex-align-center bottom-line-group" v-if="showBottom">
        <div class="bottom-line"></div>
        <div class="text-center bottom-word">我是有底线的</div>
        <div class="bottom-line"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import ListItem from 'src/components/productItem'
import sugList from 'src/pages/suggestion/productList'
export default {
  name: 'search',
  components: {
    ListItem,
    sugList
  },
  data () {
    return {
      showSug: true,
      showHot: false,
      hotKeys: [],
      history: [],
      searchKey: '',
      lat: 0,
      lng: 0,
      // 分页相关
      list: [],
      page: 1,
      pageCount: 20,
      totalPage: 0,
      showBottom: false,
      showNull: false,
      showLoading: false,
      searchLoading: false
    }
  },
  created () {
    let vm = this
    vm.searchLoading = true
    navigator.geolocation.getCurrentPosition(position => {
      vm.lat = position.coords.latitude
      vm.lng = position.coords.longitude
      let param = {
        'lat': position.coords.latitude,
        'lng': position.coords.longitude
      }
      vm.getHots(param)
    }, () => {
      // vm.$q.notify('获取当前位置失败' + err.message)
      vm.lat = 30.546561
      vm.lng = 104.066529
      let param = {
        'lat': 30.546561,
        'lng': 104.066529
      }
      vm.getHots(param)
    })
  },
  methods: {
    clearHistory () {
      this.history = []
      this.$q.localStorage.remove('historySearch')
    },
    openHots () {
      this.history = this.$q.localStorage.getItem('historySearch')
      this.showHot = true
    },
    offHots () {
      this.showHot = false
    },
    hideHot ({ evt, ...info }) {
      let vm = this
      if (info.direction === 'up') {
        vm.offHots()
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    getHots (param) {
      let vm = this
      this.$axios(urls.getHotSearch, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.hotKeys = [...res.list]
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.searchLoading = false
      }, err => {
        vm.$q.notify({ message: `获取搜索热词失败${JSON.stringify(err)}` })
        vm.searchLoading = false
      })
    },
    getWords (word) { // 点击热词
      this.searchKey = word
      this.getFirstPage()
    },
    getFirstPage () {
      let vm = this
      vm.page = 1
      vm.showBottom = false
      vm.showNull = false
      vm.list = []
      vm.showLoading = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.latitude
        let param = {
          lat: vm.lat,
          lng: vm.lng,
          thisPage: vm.page,
          pageCount: vm.pageCount,
          search: vm.searchKey
        }
        let history = vm.$q.localStorage.getItem('historySearch')
        if (vm.searchKey) { // 有搜索词时
          if (Array.isArray(history)) {
            if (history.length >= 10) { // 搜索历史存储>10条
              history.pop()
            }
            if (history.find(item => item.word === vm.searchKey)) { // 如果找出重复词
            } else {
              history.unshift({ 'word': vm.searchKey })
            }
          } else {
            history = [{ 'word': vm.searchKey }]
          }
        }
        vm.$q.localStorage.set('historySearch', history)
        vm.showLoading = true
        vm.$axios(urls.doSearch, param).then(res => {
          let code = res.code
          // pic.iidingyun.com/8696123/commonImg/c/no_result.png
          if (code === 'success') {
            vm.showSug = false
            if (res.list.length > 0) {
              vm.totalPage = res.totalPage
              vm.list = [...res.list]
              if (res.list.length < vm.pageCount) {
                vm.showBottom = true
              }
              vm.showHot = false
            } else {
              vm.showNull = true
            }
          } else {
            vm.$q.notify({ message: res.msg })
          }
          vm.showLoading = false
        }, err => {
          vm.showSug = false
          vm.$q.notify({ message: JSON.stringify(err) })
          vm.showLoading = false
        })
      }, () => {
        vm.lat = 30.546561
        vm.lng = 104.066529
        let param = {
          lat: vm.lat,
          lng: vm.lng,
          thisPage: vm.page,
          pageCount: vm.pageCount,
          search: vm.searchKey
        }
        let history = vm.$q.localStorage.getItem('historySearch')
        if (vm.searchKey) { // 有搜索词时
          if (Array.isArray(history)) {
            if (history.length >= 10) { // 搜索历史存储>10条
              history.pop()
            }
            if (history.find(item => item.word === vm.searchKey)) { // 如果找出重复词
            } else {
              history.unshift({ 'word': vm.searchKey })
            }
          } else {
            history = [{ 'word': vm.searchKey }]
          }
        }
        vm.$q.localStorage.set('historySearch', history)
        vm.showLoading = true
        vm.$axios(urls.doSearch, param).then(res => {
          let code = res.code
          // pic.iidingyun.com/8696123/commonImg/c/no_result.png
          if (code === 'success') {
            vm.showSug = false
            if (res.list.length > 0) {
              vm.totalPage = res.totalPage
              vm.list = [...res.list]
              if (res.list.length < vm.pageCount) {
                vm.showBottom = true
              }
              vm.showHot = false
            } else {
              vm.showNull = true
            }
          } else {
            vm.$q.notify({ message: res.msg })
          }
          vm.showLoading = false
        }, err => {
          vm.showSug = false
          vm.$q.notify({ message: JSON.stringify(err) })
          vm.showLoading = false
        })
      })
    },
    turnPage (index, done) {
      let vm = this
      let params = {
        'lat': vm.lat,
        'lng': vm.lng,
        'thisPage': vm.page + 1,
        'pageCount': vm.pageCount,
        'search': vm.searchKey
      }
      vm.showLoading = true
      vm.$axios(urls.doSearch, params).then(res => {
        let code = res.code
        if (code === 'success') {
          if (res.list.length > 0) {
            vm.list = [...vm.list, ...res.list]
            vm.totalPage = res.totalPage
            vm.page++
          } else {
            vm.page++
            // vm.showNull = true
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
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: 1rem;
  }
  .index-tit{
    font-size: 1.8rem;
    /*margin-top: 2rem;*/
  }
  .index-search{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .cus-search-input{
    flex: 4;
  }
  .searchBtn{
    flex: 1;
  }
  /*-----------------热门搜索----------------*/
  .key-tit{
    font-size: 1.2rem;
    font-weight: bold;
    color: #000000;
  }
  .key-word{
    color: #666666;
    padding: .5rem;
    min-width: 15%;
    background: #F5F5F5;
    margin-right: .5rem;
    margin-top: .5rem;
    border-radius: .3rem;
    text-align: center;
    font-size: 1.4rem;
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
  .list-cont-div{
    padding-top: 1rem;
  }
  .sug-div{padding-top: .1rem;}
  .sug-tit{font-size: 1.4rem;font-weight: bold;background: #ffffff;margin-top: 1rem;border-bottom: .2rem solid #f5f5f5;}
</style>
