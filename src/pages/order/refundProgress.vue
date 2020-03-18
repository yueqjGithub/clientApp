<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            退款进度
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="q-pa-sm flex-row flex-just-end flex-space-between re-tit">{{order.order_status === 2 ? '退款中' : '已退款'}}</div>
    <div class="bg-white q-pa-sm flex-column flex-space-between flex-align-start">
      <div class="re-item flex-row flex-just-start flex-align-center">
        <div class="re-item-tit">退款金额</div>
        <div class="re-cont">{{order.pay_amount}}</div>
      </div>
      <div class="re-item flex-row flex-just-start flex-align-center">
        <div class="re-item-tit">退回账户</div>
        <div class="re-cont">微信支付账户</div>
      </div>
      <div class="re-item flex-row flex-just-start flex-align-center">
        <div class="re-item-tit">到账时间</div>
        <div class="re-cont">预计最晚24h之内到账</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'refundProgress',
  props: {
    info: {}
  },
  computed: {
    ...mapState({
      order: state => state.common.seeOrder
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
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
  .re-tit{font-size: 1.4rem;color: #666666;}
  .re-item-tit{font-size: 1.2rem;color: #666666;margin-right: .9rem;}
  .re-item{margin-top: 1rem;width: 100%;}
  .re-cont{color: #000000;font-size: 1.2rem;}
</style>
