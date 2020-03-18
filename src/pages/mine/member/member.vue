<template>
  <q-page>
    <q-header class="bg-transparent member-header">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            知了会员
          </div>
          <div class="cus-header-r">
          </div>
        </div>
        <div class="meb-top">
          <div class="meb-top-content q-pa-lg flex-row flex-just-start flex-align-center">
            <q-avatar rounded size="xl">
              <img :src="info.photo">
            </q-avatar>
            <div class="nick flex-column flex-space-around flex-align-start">
              <div class="flex-row flex-space-around flex-align-center">
                <div class="nick-name">{{info.nickname}}</div>
                <img src="https://pic.iidingyun.com/8696123/wxImg/index/vip/vip1.png" alt="" class="vip-icon" v-if="info.type === 1 && info.status === 0">
                <img src="https://pic.iidingyun.com/8696123/wxImg/index/vip/vip2.png" alt="" class="vip-icon" v-if="info.type === 1 && info.status === 1">
              </div>
              <span class="nick-tips">{{info.remark}}</span>
            </div>
          </div>
        </div>
      </div>
<!--      https://pic.iidingyun.com/8696123/wxImg/index/vip/bgi1.png-->
    </q-header>
    <!-------------------content-------------------->
    <div class="q-pa-sm">
      <div class="q-pa-sm">
        <div class="vip-cont-tit">会员特权</div>
      </div>
      <div class="q-pa-sm flex-row flex-space-between flex-nowrap flex-align-center">
        <item :tit="`专享会员价`" :content="`看得见的优惠`" :img="`https://pic.iidingyun.com/8696123/commonImg/c/diamond.png`"></item>
        <item :tit="`双倍`" :content="`消费返知了贝`" :img="`https://pic.iidingyun.com/8696123/commonImg/c/double.png`"></item>
        <item :tit="`更多福利`" :content="`敬请期待`" :img="`https://pic.iidingyun.com/8696123/commonImg/c/cash.png`"></item>
      </div>
    </div>
    <div class="q-pa-md">
<!--      <div class="q-pa-sm">-->
<!--        <div class="vip-cont-tit">购买会员</div>-->
<!--      </div>-->
      <div class="vip-div">
        <div class="change-pay-div flex-row flex-just-start flex-align-center btn-contain">
          <div class="change-pay" :class="payType === 'cash' ? 'change-pay-y' : 'change-pay-n'" @click="payType = 'cash'">现金购买</div>
          <div class="change-pay" :class="payType === 'dc' ? 'change-pay-y' : 'change-pay-n'" @click="payType = 'dc'">用贝支付</div>
        </div>
        <charge-item @subChargeType="getChargeType" :type="payType" :is-prize="isPrize"></charge-item>
      </div>
    </div>
    <div class="q-pa-lg">
      <div class="full-width">
        <q-btn :label="`立即支付${showPrice}${payType === 'cash' ? '元' : '贝'}`" rounded class="full-width charge-btn" unelevated
               v-if="showBtn"
               :loading="btnLoading"
               :disable="btnLoading"
               @click="payOrder"
        ></q-btn>
      </div>
    </div>
    <!-------续费弹窗--------->
    <q-dialog v-model="showTips" persistent :square="false">
      <tips :type="tipType"></tips>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import Item from './special'
import ChargeItem from './price'
import urls from '../../../api/urls'
import Tips from './tips'
export default {
  name: 'memeber',
  components: {
    Item,
    ChargeItem,
    Tips
  },
  data () {
    return {
      chargeType: {},
      showBtn: false,
      btnLoading: false,
      payType: 'cash',
      userType: undefined,
      showTips: false,
      tipType: 1,
      isPrize: false
    }
  },
  computed: {
    showPrice () {
      let num = 0
      if (this.payType === 'cash') {
        num = this.userType === 0 ? this.chargeType.price : this.chargeType.original_price
      } else {
        num = this.chargeType.dc
      }
      return num
    },
    ...mapState({
      info: state => state.common.mineInfo,
      vipStatus: state => state.common.vipStatus
    })
  },
  created () {
    this.isPrize = this.$route.params.isPrize
    if (this.isPrize) { // 如果是从抽奖过来的
      this.dealType()
      this.showTips = true
    }
    this.userType = this.$q.localStorage.getItem('loginInfo').type
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getChargeType (obj) {
      this.chargeType = {}
      for (let k in obj) {
        this.chargeType[k] = obj[k]
      }
      this.showBtn = true
    },
    dealType () { // 弹窗显示控制
      let beforeType = this.vipStatus.type // 0-普通 1-会员
      let beforeStatus = this.vipStatus.status // 0-过期 1-有效期内
      if (beforeType === 0) { // 之前是普通会员
        this.tipType = 1
      } else { // 之前成为过会员
        if (beforeStatus === 0) { // 会员过期情况
          this.tipType = 3
        } else {
          this.tipType = 2
        }
      }
    },
    payOrder () { // 支付
      let vm = this
      if (vm.payType === 'cash') { // 现金支付
        vm.$q.bottomSheet({
          message: '请选择支付方式',
          grid: true,
          actions: [
            {
              label: '微信支付',
              id: 'wx',
              icon: 'app:iconweixin',
              classes: 'wx-pay'
            }
            // {
            //   label: '支付宝',
            //   id: 'zfb',
            //   icon: 'app:iconzhifubao',
            //   classes: 'ali-pay'
            // }
          ]
        }).onOk(action => {
          switch (action.id) {
            case 'wx':
              vm.useWxPay()
              break
            case 'zfb':
              vm.useAliPay()
              break
          }
        })
      } else {
        vm.useDcPay()
      }
    },
    useDcPay () { // 贝支付
      let vm = this
      let param = {
        'member_typeid': this.chargeType.member_typeid, // 充值会员类型ID
        'price_dc': this.chargeType.dc // 贝数量
      }
      vm.$axios(urls.chargeByDc, param).then(res => {
        vm.$q.notify({ message: res.msg })
        let code = res.code
        if (code === 'success') {
          vm.dealType()
          this.showTips = true
        }
      }, () => {
        vm.$q.notify({ message: '充值失败，请检查网络是否畅通' })
      })
    },
    useWxPay () {
      let vm = this
      vm.btnLoading = true
      let param = {
        'member_typeid': vm.chargeType.member_typeid,
        'pay_amount': vm.chargeType.price
      }
      // console.log(param)
      vm.$axios(urls.chargeMember, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.toWxPay(res.payParam)
        } else {
          vm.$q.notify(res.msg)
        }
      }, err => {
        vm.$q.notify({ message: `${JSON.stringify(err)}` })
      })
    },
    toWxPay (param) {
      let vm = this
      /* eslint-disable */
      Wechat.sendPaymentRequest(param, function () {
        // 成功操作
        vm.$q.notify({ message: '支付成功' })
        vm.payBtnLoading = false
        vm.dealType()
        this.showTips = true
      }, function (reason) {
        vm.$q.notify({ message: reason })
        vm.payBtnLoading = false
      })
      /* eslint-disable */
    },
    useAliPay () {}
  }
}
</script>

<style scoped>
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    /*padding-bottom: .6rem;*/
  }
  .member-header{
    box-shadow: 0px 0px .2px 0px rgba(115,17,8,0.3);;
  }
  .meb-top{
    width: 89vw;
    height: 26.6vw;
    margin: 1rem auto 0 auto;
    background-image: url("../../../statics/tbIcon/vip-bg.png");
    background-size: 100% 100%;
  }
  .nick{margin-left: 1.5rem}
  .nick-name{font-size: 1.6rem;color: #ffffff;}
  .nick-tips{font-size: 1.2rem;color: #ffffff;}
  .vip-cont-tit{font-size: 1.8rem; color: #000000; font-weight: bold}
  .charge-btn{background: #F95860;color: #ffffff;}
  .vip-div{
    position: relative;
    border-radius: .4rem;
    box-shadow:0px 1px 8px 0px rgba(0, 0, 0, 0.08);
    padding: 3.6rem 1rem 1rem 1rem;
  }
  .btn-contain{}
  .change-pay-div{
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(0, -50%);
  }
  .change-pay{
    font-size: 1.5rem;
    padding: .4rem .9rem;
    border-radius: .5rem;
  }
  .change-pay + .change-pay{margin-left: .6rem;}
  .change-pay-y{
    color: #000000;
    background: linear-gradient(270deg,rgba(238,199,169,1) 0%,rgba(246,226,208,1) 100%);
  }
  .change-pay-n{
    color: #666666;
    background: #ECECEC;
  }
  .vip-icon{width: 2.4rem;display: block;margin-left: .4rem;}
</style>
