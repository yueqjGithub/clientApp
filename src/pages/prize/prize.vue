<template>
  <q-page>
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            每日幸运抽奖
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="pr-content">
      <div class="top-bg">
        <notice :list="noticeList"></notice>
        <div class="top-right flex-column flex-space-around flex-align-start">
          <q-btn class="trans-btn" label="抽奖规则" unelevated rounded size="sm" @click="openRule"></q-btn>
          <q-btn class="trans-btn" label="中奖纪录" unelevated rounded size="sm" @click="toLottery"></q-btn>
        </div>
        <img src="../../statics/tbIcon/prize-top.png" alt="" class="top-img">
      </div>
      <div class="getDc flex-column flex-just-center flex-align-center">
        <div class="dc-img" @click="toMine">
          <img src="https://pic.iidingyun.com/8696123/wxImg/index/lottery_go.png" alt="">
          <span class="my-dest">{{dest}}</span>
        </div>
        <div class="prize-count">剩余抽奖次数：<span>{{isFirst ? info.total_count - info.count : info.count}}次</span></div>
      </div>
      <module @subNotice="getObj" @subDc="getDc"></module>
    </div>
    <!-------------------规则弹窗------------->
    <q-dialog v-model="showRule" persistent>
      <rule :times="info.total_count" @close="closeRule"></rule>
    </q-dialog>
    <q-dialog v-model="showPrize" persistent :square="false">
      <div v-if="prize_type===0" class="prize-window" @click="closePrize">
        <img src="../../statics/tbIcon/normal-dialog.png" alt="">
        <div class="prize-dc-word text-center flex-column flex-space-around flex-align-center">
          <span>恭喜你抽中</span>
          <span class="prize-dc-word-val">{{prizeDCvalue}}贝</span>
        </div>
      </div>
      <!--------抽中会员弹窗------------->
      <div v-if="prize_type===1" class="prize-window">
        <div class="member-btn" @click="toMember"></div>
        <img src="../../statics/tbIcon/member.png" alt="">
        <div class="prize-member-word">{{prizeMember}}</div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import module from './module'
import notice from './notice'
import rule from './rule'
import urls from '../../api/urls'
export default {
  name: 'prize',
  components: {
    module,
    notice,
    rule
  },
  data () {
    return {
      isFirst: true,
      info: {},
      noticeList: [],
      showRule: false,
      showPrize: false,
      dest: 0,
      prize_type: 0,
      prizeDCvalue: 0,
      prizeMember: '一个月会员'
    }
  },
  created () {
    let vm = this
    vm.$axios(urls.getChargeType, {}).then(res => {
      let code = res.code
      if (code === 'success') {
        let obj = {
          type: res.type,
          status: res.status
        }
        vm.$store.commit('common/setVipStatus', obj)
      } else {
        vm.$q.notify({ message: res.msg })
      }
    }, err => {
      vm.$q.notify({ message: JSON.stringify(err) })
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    toMine () {
      this.$router.push({ name: 'Mine' })
    },
    getDc (num) {
      this.isFirst = false
      this.info.count = num.count
      this.dest = num.balance
      this.prize_type = num.prize_type
      if (num.prize_type === 0) {
        this.showPrize = true
        this.prizeDCvalue = num.prize_dc
      } else if (num.prize_type === 1) {
        this.showPrize = true
        this.prizeMember = num.prize_name
      } else {
        this.$q.notify({ message: num.prize_name })
      }
    },
    getObj (list) {
      this.info = { ...list }
      this.noticeList = list.user_prize
      this.dest = list.balance
    },
    openRule () {
      this.showRule = true
    },
    closeRule () {
      this.showRule = false
    },
    toLottery () {
      this.$router.push({ name: 'Lottery' })
    },
    closePrize () {
      this.showPrize = false
    },
    toMember () {
      this.$router.push({ name: 'Member', params: { isPrize: true } })
    }
  }
}
</script>

<style scoped>
  .trans-btn{background: rgba(0,0,0,0.6);color: #ffffff;}
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  .pr-content{
    width: 100vw;
    min-height: calc(100vh - 5.6rem);
    padding-bottom: 4rem;
    background-image: url("../../statics/tbIcon/prize-bg.png");
    background-size: 100% 100%;
    padding-top: 1px;
  }
  .top-bg{position: relative;overflow: hidden}
  .top-img{width: 100%;height: auto;margin-bottom: -20%;}
  .top-right{position: absolute;right: -.8rem;top: 3vh;height: 8rem;}
  .getDc{
    /*background-image: url("https://pic.iidingyun.com/8696123/wxImg/index/lottery_go.png");*/
    /*background-size: 100% 100%;*/
    width: 94vw;
    margin: 0 auto;
  }
  .dc-img{width: 100%;position: relative;}
  .dc-img img{width: 100%;height: auto;}
  .my-dest{color: #DD1D0F;font-size: 1.6rem;font-weight: bold;position: absolute;top: 45%;left:37%;}
  .prize-count{background: #C80E00;color: white;font-size: 1.2rem;padding: .2rem 1rem;}
  .prize-count span{color: #FFDA0B;}
  /*-------------奖品弹窗----------------*/
  .prize-window{
    box-shadow: none !important;
    width: 80%;
    position: relative;
  }
  .prize-window img{
    width: 100%;
  }
  .prize-dc-word{width:100%;font-size: 1.8rem;font-weight: bold;color: #FFDC98;position: absolute;top: 40%;}
  .prize-dc-word-val{font-size: 2.2rem;margin-top: 2rem;}
  .prize-member-word{position: absolute;top: 35%;left: 30%;font-size: 1.6rem;font-weight: bold;color: #000000;}
  .member-btn{position: absolute;width: 46%;height: 15%;top: 71%;left: 32%;background: transparent;}
</style>
