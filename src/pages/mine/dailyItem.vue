<template>
  <div class="q-pa-sm flex-row flex-space-between flex-align-center">
    <div class="n-item-left flex-row flex-just-start flex-align-center">
      <img :src="`https://${item.item_img}`" alt="" class="n-icon">
      <span class="n-name">{{item.item_name}}</span>
    </div>
    <div v-if="item.item_code === 'Invite_user_consume'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="share">{{item.status === 0 ? '去邀请' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'prize_task'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="toSug">{{item.status === 0 ? '去消费' : '已完成'}}</div>
    </div>
    <div v-if="item.item_code === 'daily_max_red_packet'">
      <div class="n-btn" :class="item.status === 0 ? 'btn-y' : 'btn-n'" @click="dailyCheck">{{item.status === 0 ? '去完成' : '已完成'}}</div>
    </div>
    <!----------------------------签到红包弹窗----------------------------->
    <!--    https://pic.iidingyun.com/8696123/wxImg/index/newRedpackage.png-->
    <q-dialog v-model="showCheckPrize" persistent :square="false">
      <div class="prize-window">
        <div class="check-prize-num">{{checkPrizeNum}}贝</div>
        <div class="member-btn" @click="getCheckDc"></div>
        <img src="https://pic.iidingyun.com/8696123/wxImg/index/signRedpackage.png" alt="">
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import urls from 'src/api/urls'
export default {
  name: 'dailyItem',
  props: ['item'],
  data () {
    return {
      showCheckPrize: false,
      checkPrizeNum: 0
    }
  },
  computed: {
    ...mapState({
      info: state => state.common.mineInfo
    })
  },
  created () {
  },
  methods: {
    getCheckDc () {
      let vm = this
      vm.showCheckPrize = false
      let obj = JSON.parse(JSON.stringify(vm.info))
      obj.balance = Number(obj.balance) + vm.checkPrizeNum
      vm.$store.commit('common/saveMineInfo', obj)
    },
    toSug () {
      this.$router.push({ name: 'Suggestion' })
    },
    // copyObject (obj, target) {
    //   for (let k in obj) {
    //     if (1) {
    //     }
    //   }
    // },
    dailyCheck () {
      let vm = this
      if (this.item.status === 0) {
        vm.$axios(urls.dailyCheck, {}).then(res => {
          let code = res.code
          if (code === 'success') {
            vm.showCheckPrize = true
            vm.checkPrizeNum = res.dc
            let newObj = JSON.parse(JSON.stringify(vm.info))
            newObj.balance = res.balance
            // newObj.daily.forEach((item, index) => {
            //   if (item.item_code === 'daily_max_red_packet') {
            //     item.status = 1
            //   }
            // })
            newObj.daily.find(item => item.item_code === 'daily_max_red_packet').status = 1
            vm.$store.commit('common/saveMineInfo', newObj)
          } else {
            vm.$q.notify({ message: res.msg })
          }
        })
      }
    },
    // 邀请
    share () {
      let vm = this
      let val = vm.info.daily.find(item => item.item_code === 'Invite_user_consume').dc_value
      vm.$store.commit('common/setShareDc', val)
      vm.$router.push({ name: 'Share' })
    }
  }
}
</script>

<style scoped>
  .n-icon{
    width: 2.4rem;
    height: 2.4rem;
    display: inline-block;
    margin-right: .4rem;
  }
  .n-name{font-size: 1.4rem;color: #454C58;}
  .n-btn{border-radius: .2rem;padding: .2rem .8rem;font-size: 1rem;}
  .btn-y{color: #FF847D;border: 1px solid #FF847D; }
  .btn-n{color: #999999;border: 1px solid #999999; background:#F3F3F3;}
  /*---------------签到红包--------------*/
  .prize-window{
    box-shadow: none !important;
    width: 80%;
    position: relative;
  }
  .prize-window img{
    width: 100%;
  }
  .member-btn{
    position: absolute;
    width: 46%;
    height: 12%;
    top: 79%;
    left: 26%;
  }
  .check-prize-num{
    position: absolute;
    font-size: 2.6rem;
    color: #EAC672;
    top: 60%;
    left: 35%;
  }
</style>
