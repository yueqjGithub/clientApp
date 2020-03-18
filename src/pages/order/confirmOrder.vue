<template>
  <q-page class="bg-white">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            确认订单
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
      <!-----------------------top--------------------->
      <div class="bg-white q-pa-md flex-column flex-just-start flex-align-start">
        <div class="flex-row flex-space-between flex-align-center full-width">
          <div class="flex-row flex-just-start flex-align-center">
            <div class="conf-tit tit-just">门店</div>
            <div class="conf-tit">：</div>
            <div class="conf-info-bold">{{useShop.shop_name}}</div>
          </div>
          <div class="change-btn" @click="switchShop">切换门店></div>
        </div>
        <div class="flex-row flex-just-start flex-align-center">
          <div class="conf-tit tit-just">订单编号</div>
          <div class="conf-tit">：</div>
          <div class="conf-info-normal">{{info.orderid}}</div>
        </div>
        <div class="flex-row flex-just-start flex-align-center">
          <div class="conf-tit tit-just">菜品名称</div>
          <div class="conf-tit">：</div>
          <div class="conf-info-bold">{{info.product_name}}</div>
        </div>
        <div class="flex-row flex-just-start flex-align-center">
          <div class="conf-tit tit-just">菜品数量</div>
          <div class="conf-tit">：</div>
          <div class="conf-info-normal">{{info.total_amount}}</div>
        </div>
        <div class="flex-row flex-just-start flex-align-center">
          <div class="conf-tit tit-just">购买价格</div>
          <div class="conf-tit">：</div>
          <div class="conf-info-normal">￥{{info.pay_amount}}</div>
        </div>
      </div>
      <!----------------------------cont2------------------------>
      <div class="q-pa-md conf-cont-2">
        <div class="flex-row flex-just-start flex-align-end">
          <img src="https://pic.iidingyun.com/8696123/commonImg/c/use-ww.png" alt="" class="tap-tit-img">
          <div class="tap-tit-word">使用方式：</div>
        </div>
        <div class="tap-cont-intro q-pa-md">
          到店后，由
          <span class="tap-cont-tips">店员点击</span>
          下方按钮验证成功即可用餐。
          切勿自行点击，如因误操作导致本券无法使用，恕
          不补偿！
        </div>
<!--        <div class="tap-btn"></div>-->
        <div class="flex-row flex-just-center flex-align-center">
          <q-btn round class="cus-btn-primary use-btn" unelevated @click="sureOrder">
            <div>
              <div>由店员</div>
              <div>点击确认</div>
            </div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import urls from 'src/api/urls'
export default {
  name: 'confirmOrder',
  data () {
    return {
      info: {},
      showLoading: false,
      showDialog: false
    }
  },
  created () {
    let vm = this
    let param = {
      'orderid': vm.orderInfo.orderid
    }
    vm.showLoading = true
    vm.$axios(urls.confirmOrder, param).then(res => {
      // console.log(res)
      let code = res.code
      if (code === 'success') {
        let obj = {
          'shop_name': res.shop_name,
          'shopid': res.shopid
        }
        vm.$store.commit('common/setUseShop', obj)
        vm.info = res
      } else {
        vm.$q.notify({ message: res.msg })
      }
      vm.showLoading = false
    })
  },
  computed: {
    ...mapState({
      orderInfo: state => state.common.orderInfo,
      useShop: state => state.common.useShop // 选择的使用门店id和name保存在此
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    switchShop () {
      this.$store.commit('common/setCompanyid', this.info.companyid)
      this.$router.push({ name: 'SwitchShop', params: { cur: this.info.shopid } })
    },
    sureOrder () {
      // console.log(this.info)
      let vm = this
      let params = {
        'orderid': this.info.orderid,
        'shopid': this.info.shopid
      }
      vm.$axios(urls.useOrder, params).then(res => {
        let code = res.code
        if (code === 'success') {
          let info = {
            useTime: res.use_time,
            dc: res.dc,
            ...vm.info
          }
          vm.$router.push({ name: 'UseSuccess', params: { obj: info } })
        } else {
          vm.$q.notify({ message: res.msg })
        }
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
  .change-btn{font-size: 1.2rem;color: #f95860;text-align: right;}
  .tit-just{text-align: justify;text-align-last: justify;width: 7rem;}
  .conf-tit{color: #838D94;font-size: 1.4rem;padding-top: .4rem;padding-bottom: .4rem;}
  .conf-info-bold{color: #454C58;font-weight: bold;font-size: 1.4rem}
  .conf-info-normal{color: #333333;font-size: 1.2rem}
  .conf-cont-2{border-top: 1rem solid #f5f5f5;}
  .tap-tit-img{width: 3.4rem;margin-right: .8rem;}
  .tap-tit-word{font-size: 1.7rem;font-weight: bold;color: #000000;}
  .tap-cont-intro{background: #FFD9DB;border-radius: .3rem;font-size: 1.4rem;color: #333333;margin-top: .8rem;}
  .tap-cont-tips{color: #FF0000;font-size: 1.6rem;font-weight: bold;}
  .use-btn{width: 41vw;height: 41vw;font-size: 2.4rem;font-weight: bold;text-align: center;margin-top: 6rem;}
</style>
