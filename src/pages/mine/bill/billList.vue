<template>
  <div>
    <q-pull-to-refresh @refresh="getFirstPage">
      <q-infinite-scroll @load="addList" :offset="20" :disable="list.length < pageCount || thisPage > totalPage" v-if="list.length > 0">
        <div v-for="k in list" :key="k.index" class="q-pa-md dc-item bg-white">
          <div class="flex-row flex-space-between flex-align-start">
            <div class="dc-remark">{{k.remark}}</div>
            <div class="dc-amount" :class="k.direction === 1 ? 'dc-in' : 'dc-out'">{{k.direction === 1 ? `+${k.amount}` : `-${k.amount}`}}</div>
          </div>
          <div class="flex-row flex-just-start flex-align-center">
            <div class="dc-time">{{k.create_time}}</div>
          </div>
        </div>
      </q-infinite-scroll>
      <no-info v-if="list.length < 1" :message="'暂时没有记录噢'"></no-info>
      <q-inner-loading :showing="showLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import urls from 'src/api/urls'
import noInfo from 'src/components/non'
export default {
  name: 'billList',
  props: ['queryType'], // getType = 查询类型
  components: {
    noInfo
  },
  data () {
    return {
      thisPage: 1,
      pageCount: 20,
      totalPage: 0,
      showLoading: false,
      list: []
    }
  },
  created () {
    this.getFirstPage()
  },
  methods: {
    getFirstPage (done) {
      this.thisPage = 1
      this.totalPage = 0
      this.showLoading = false
      let param = {
        'direction': this.queryType,
        'thisPage': this.thisPage,
        'pageCount': this.pageCount
      }
      this.queryList(param, true, done)
    },
    addList (index, done) {
      let param = {
        'direction': this.queryType,
        'thisPage': this.thisPage,
        'pageCount': this.pageCount
      }
      this.queryList(param, true, done)
    },
    queryList (param, refresh, done) {
      let vm = this
      vm.showLoading = true
      vm.$axios(urls.queryDCRecorder, param).then(res => {
        let code = res.code
        if (code === 'success') {
          if (refresh) {
            vm.list = [...res.list]
            vm.totalPage = res.totalPage
            vm.$emit('subBalance', res.balance)
          } else {
            if (res.list.length > 0) {
              vm.list = [...vm.list, ...res.list]
              vm.totalPage = res.totalPage
              vm.$emit('subBalance', res.balance)
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
  .dc-item{margin-top: 1rem}
  .dc-remark{font-size: 1.4rem;color: #333333;}
  .dc-amount{font-size: 1.5rem;font-weight: bold;}
  .dc-in{color: #10e100;}
  .dc-out{color: #F95860;}
  .dc-time{font-size: 1rem;color: #838d94;margin-top: 1rem;}
</style>
