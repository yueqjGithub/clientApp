<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            中奖纪录
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div style="padding-bottom: 2rem;">
      <q-pull-to-refresh @refresh="getFirstPage" v-if="list.length > 0">
        <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage">
          <div v-for="k in list" :key="k.lotteryid" class="lottery-item bg-white q-pa-md flex-row flex-space-between flex-align-center">
            <div class="lottery-time">{{k.create_time}}</div>
            <div class="lottery-name">{{k.prize_name}}</div>
          </div>
        </q-infinite-scroll>
        <q-inner-loading :showing="showLoading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
        <no-info v-if="showBottom"></no-info>
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import noInfo from 'src/components/non'
export default {
  name: 'prizeRecord',
  components: {
    noInfo
  },
  data () {
    return {
      list: [],
      showLoading: false,
      showBottom: false,
      thisPage: 1,
      pageCount: 30,
      totalPage: 0
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
      vm.thisPage = 1
      vm.totalPage = 0
      vm.showBottom = false
      let params = {
        thisPage: vm.thisPage,
        pageCount: vm.pageCount
      }
      vm.queryInfo(params, true)
    },
    addList (index, done) {
      let vm = this
      let params = {
        thisPage: vm.thisPage,
        pageCount: vm.pageCount
      }
      vm.queryInfo(params, false)
    },
    queryInfo (params, refresh, done) {
      let vm = this
      vm.showLoading = true
      this.$axios(urls.prizeRecord, params).then(res => {
        let code = res.code
        if (code === 'success') {
          if (refresh) { // 第一页
            if (res.list.length > 0) {
              vm.list = [...res.list]
              vm.totalPage = res.totalPage
              if (done) {
                done()
              }
            } else {
              vm.showBottom = true
            }
          } else {
            if (res.list.length > 0) {
              vm.list = [...vm.list, ...res.list]
              vm.totalPage = res.totalPage
              vm.thisPage++
            } else {
              vm.$q.notify({ message: '没有更多啦' })
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
      }, err => {
        vm.$q.notify({ message: `${JSON.stringify(err)}` })
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
  .lottery-item + .lottery-item{margin-top: 1rem;}
  .lottery-time{font-size: 1.2rem;color: #999999;}
  .lottery-name{font-size: 1.3rem;color: #333333;}
</style>
