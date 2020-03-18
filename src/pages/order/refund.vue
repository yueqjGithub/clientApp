<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            申请退款
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <!-----------------------content-------------------------->
    <div class="bg-white refund-div">
      <div class="q-pa-sm refund-tit">
        退款内容
      </div>
      <div class="refund-cont q-pa-sm">
        <div class="refund-row flex-row flex-align-center flex-just-start">
          <div class="refund-key">现金</div>
          <div class="refund-icon">：</div>
          <div class="refund-val">{{order.pay_amount}}元</div>
        </div>
        <div class="refund-row flex-row flex-align-center flex-just-start">
          <div class="refund-key">知了贝</div>
          <div class="refund-icon">：</div>
          <div class="refund-val">{{order.dc}}</div>
        </div>
      </div>
    </div>
    <!---------------------------退款方式--------------------------->
    <div class="bg-white refund-div">
      <div class="q-pa-sm refund-tit">
        退款方式
      </div>
      <div class="r-font-sm q-pa-sm">原路退回（1-3个工作日内退款到原支付方）</div>
    </div>
    <!-----------------------退款原因------------------------>
    <div class="bg-white refund-div">
      <div class="q-pa-sm refund-tit flex-row">
        退款原因
        <div class="r-font-sm">（至少选择一个）</div>
      </div>
      <div class="refund-cont q-pa-sm">
        <div v-for="k in reasonList" :key="k.id" class="reason-item flex-row flex-just-start flex-align-center" :class="chooseReason.indexOf(k.id) === -1 ? '' : 'reason-y'" @click="dealReason(k.id)">
          <div class="reason-icon flex-row flex-just-center flex-align-center">
            <div></div>
          </div>
          <div class="r-font-sm reason-description">{{k.label}}</div>
        </div>
      </div>
    </div>
    <!-------------------按钮---------------------->
    <div class="q-pa-lg">
      <div class="q-pa-lg">
        <q-btn unelevated class="cus-btn-primary full-width" label="申请退款" @click="doRefund"></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'refund',
  data () {
    return {
      order: {},
      reasonList: [{ label: '计划有变,没时间消费', id: 1 }, { label: '店里活动更优惠', id: 2 },
        { label: '商家营业但不接待', id: 3 }, { label: '商家停业/装修/转让', id: 4 }, { label: '买多了/买错了', id: 5 }
      ],
      chooseReason: []
    }
  },
  created () {
    this.order = { ...this.$route.params.order }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    dealReason (id) {
      let vm = this
      if (vm.chooseReason.indexOf(id) !== -1) {
        let num = vm.chooseReason.indexOf(id)
        vm.chooseReason.splice(num, 1)
      } else {
        vm.chooseReason.push(id)
      }
    },
    doRefund () {
      let vm = this
      if (vm.chooseReason.length < 1) {
        vm.$q.notify({ message: '请至少选择一个原因' })
        return false
      }
      let str = ''
      for (let k in vm.chooseReason) {
        str += `${vm.reasonList[vm.chooseReason[k]].label};`
      }
      let params = {
        'orderid': vm.order.orderid,
        'remark': str
      }
      vm.$axios(urls.refund, params).then(res => {
        vm.$q.notify({ message: res.msg })
        let code = res.code
        if (code === 'success') {
          vm.$router.push({ name: 'Order', params: { init: 'right' } })
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
  .refund-div + .refund-div{margin-top: 1rem;}
  .refund-tit{font-size: 1.4rem;font-weight: bold;color: #000000;margin-right: .4rem;}
  .refund-cont{border-top: 1px solid #f5f5f5;}
  .refund-row + .refund-row{margin-top: 1rem;}
  .refund-key{font-size: 1.2rem;color: #838D94;width: 4rem;text-align: justify;text-align-last: justify;}
  .refund-icon{font-size: 1.2rem;color: #838D94;}
  .refund-val{color: #454C58;font-size: 1.2rem;font-weight: bold;}
  .r-font-sm{font-size: 1.2rem;color: #838D94;}
  /*E64239*/
  .reason-icon{width: 1.4rem; height: 1.4rem;border-radius: 50%;border: 1px solid #838d94;}
  .reason-icon div{width: 50%;height: 50%;border-radius: 50%;background: #838D94;}
  .reason-y .reason-icon{border:1px solid #e64239;}
  .reason-y .reason-icon div{background:#e64239;}
  .reason-item + .reason-item {margin-top: .6rem;}
  .reason-description{margin-left: .6rem;font-size: 1.4rem;}
</style>
