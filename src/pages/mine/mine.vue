<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round disable></q-btn>
          </div>
          <div class="cus-header-m text-center">
            我的
          </div>
          <div class="cus-header-r">
          </div>
        </div>
        <!----头像---->
        <div class="my-avator flex-row flex-space-between flex-align-center q-pa-md">
          <div class="avatar-left flex-row flex-just-start flex-align-center">
            <q-avatar rounded size="xl">
              <img :src="rightInfo.photo">
            </q-avatar>
            <div class="nick flex-column flex-space-around flex-align-start">
              <div class="flex-row flex-space-around flex-align-center">
                <div class="nick-name">{{rightInfo.nickname}}</div>
                <img src="https://pic.iidingyun.com/8696123/wxImg/index/vip/vip1.png" alt="" class="vip-icon" v-if="rightInfo.type === 1 && rightInfo.status === 0">
                <img src="https://pic.iidingyun.com/8696123/wxImg/index/vip/vip2.png" alt="" class="vip-icon" v-if="rightInfo.type === 1 && rightInfo.status === 1">
              </div>
              <span class="nick-tips">{{rightInfo.remark}}</span>
            </div>
          </div>
<!--          <q-btn label="签到" class="check-in-btn" text-color="white" rounded size="sm" unelevated-->
<!--            v-if="showMark"-->
<!--           @click="toDailyCheck"-->
<!--          ></q-btn>-->
        </div>
      </div>
    </q-header>
    <!---------------正文--------------->
    <preview :dc="rightInfo.balance" :memberCountent="rightInfo.type" :memeberStatus="rightInfo.status"></preview>
    <novice :list="rightInfo.novice" v-if="showNovice"></novice>
    <daily :list="rightInfo.daily"></daily>
    <div class="q-pa-sm flex-row flex-space-between flex-align-center">
      <div class="mine-bot flex-column flex-just-center flex-align-center" @click="toFeedback">
<!--        https://pic.iidingyun.com/8696123/wxImg/my/feed-back.png-->
        <img src="https://pic.iidingyun.com/8696123/wxImg/my/feed-back.png" alt="">
        <p>意见反馈</p>
      </div>
      <div class="mine-bot flex-column flex-just-center flex-align-center" @click="serviceTel">
<!--        https://pic.iidingyun.com/8696123/wxImg/my/service.png-->
        <img src="https://pic.iidingyun.com/8696123/wxImg/my/service.png" alt="">
        <p>客服电话</p>
        <a :href="'tel:02881479072'" style="display: block;" ref="telBtn"></a>
      </div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import Preview from './preview'
import Novice from './novice'
import daily from './daily'
import { mapState } from 'vuex'
export default {
  name: 'mine',
  components: {
    Preview,
    Novice,
    daily
  },
  data () {
    return {
      info: {},
      showNovice: false
    }
  },
  created () {
    let vm = this
    vm.$axios(urls.queryMyInfo, { type: 'app' }).then(res => {
      let code = res.code
      if (code === 'success') {
        // console.log(res)
        for (let k in res.novice) {
          if (res.novice[k].status === 0) {
            vm.showNovice = true
          }
        }
        vm.$store.commit('common/saveMineInfo', res)
        vm.info = res
      }
    }, err => {
      vm.$q.notify({ message: `获取个人信息失败:${JSON.stringify(err)}` })
    })
  },
  computed: {
    showMark () {
      let status = false
      if (this.info.daily) {
        status = this.rightInfo.daily.find(item => item.item_code === 'daily_max_red_packet').status === 0
      }
      return status
    },
    ...mapState({
      rightInfo: state => state.common.mineInfo
    })
    // showNovice () {
    //   let vm = this
    //   let status = false
    //   for (let k in vm.rightInfo.novice) {
    //     if (vm.rightInfo.novice[k] === 0) {
    //       status = true
    //     }
    //   }
    //   return status
    // }
  },
  methods: {
    toDailyCheck () {
      let vm = this
      vm.$axios(urls.dailyCheck, {}).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.$q.notify({
            message: `签到成功，获得${res.dc}`,
            icon: 'done'
          })
          let newObj = JSON.parse(JSON.stringify(vm.rightInfo))
          newObj.balance = res.balance
          newObj.daily.find(item => item.item_code === 'daily_max_red_packet').status = 1
          vm.$store.commit('common/saveMineInfo', newObj)
        } else {
          vm.$q.notify({ message: res.msg })
        }
      })
    },
    serviceTel () {
      this.$refs['telBtn'].click()
    },
    toFeedback () {
      this.$router.push({ name: 'Feedback' })
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
  .nick{margin-left: 1.5rem}
  .nick-name{font-size: 1.6rem;color: #ffffff;}
  .nick-tips{font-size: 1.2rem;color: #FEAAAE;}
  .check-in-btn{background: #FFA800;}
  .vip-icon{width: 2.4rem; display: block; margin-left: .4rem;}
  .mine-bot{width: 48%; height: 8rem;background: #ffffff;}
  .mine-bot img{width: 1.6rem;display: inline-block;}
  .mine-bot p{font-size: 1.4rem;color: #000000;margin: 0;}
</style>
