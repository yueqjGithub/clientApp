<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            订单详情
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div v-if="!showLoading">
      <div class="bg-white q-pa-md flex-row flex-just-start flex-align-center" @click="toProduct">
        <q-avatar rounded size="9rem">
          <img :src="`https://${order.head_photo}`">
        </q-avatar>
        <div class="det-top-info flex-column flex-space-around flex-align-start">
          <div class="det-name">{{order.product_name}}
            <q-btn flat unelevated icon="app:iconright" size="xs"></q-btn>
          </div>
          <div class="det-price">
            低至
            <span class="min-price">{{order.min_price}}</span>
            元
            <del class="old-price">门店价{{order.price}}元</del>
          </div>
        </div>
      </div>
      <!--------门店信息--------->
      <div class="bg-white q-pa-md shop-name-div">
        <div class="shop-name">
          {{order.shop_name}}
          <span class="to-shop" @click="toShop(order.shopid)" v-if="order.order_status<2">继续选购></span>
        </div>
      </div>
      <!-------------地址-------------->
      <div class="bg-white q-pa-md">
        <div class="normal-tit shop-address">门店地址</div>
        <location :distance="order.distance_tag" :address="order.address"
                  :now-location="{'lat': lat, 'lng': lng }"
                  :target="{'lat': order.lat, 'lng': order.lng }"
        ></location>
      </div>
      <!-------------info-------------------------------->
      <div class="order-bot bg-white">
        <div class="flex-row q-pa-md flex-space-between flex-align-center">
          <div class="self-tit flex-row flex-just-start flex-align-center">
            <img src="https://pic.iidingyun.com/8696123/commonImg/c/order-tit.png" alt="">
            <span>订单信息</span>
          </div>
          <div class="tit-status">
            <span v-if="order.order_status === 0">待使用</span>
            <span v-if="order.order_status === 1">已使用</span>
            <span v-if="order.order_status === 2">退款中</span>
            <span v-if="order.order_status === 3">已退款</span>
          </div>
        </div>
        <!-------------------详细信息----------------------->
        <div class="det-detail q-pa-md flex-row flex-align-end flex-space-between">
          <div class="detail-l">
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap">
              <span class="det-type-tit">订单编号</span>
              <span class="det-type-val">：{{order.orderid}}</span>
            </div>
            <!----------time--------------->
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap" v-if="order.order_status === 0">
              <span class="det-type-tit">支付时间</span>
              <span class="det-type-val">：{{order.create_time}}</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap" v-if="order.order_status === 1">
              <span class="det-type-tit">使用时间</span>
              <span class="det-type-val">：{{order.use_time}}</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap" v-if="order.order_status === 2">
              <span class="det-type-tit">申请退款时间</span>
              <span class="det-type-val">：{{order.apply_refund_time}}</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap" v-if="order.order_status === 3">
              <span class="det-type-tit">退款时间</span>
              <span class="det-type-val">：{{order.refund_time}}</span>
            </div>
            <!----------time--------------->
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap">
              <span class="det-type-tit">数量</span>
              <span class="det-type-val">：{{order.total_amount}}</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap">
              <span class="det-type-tit">总价</span>
              <span class="det-type-val">：{{order.total_fee}}元</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap">
              <span class="det-type-tit">贝抵扣</span>
              <span class="det-type-val">：{{order.dc}}元</span>
            </div>
            <div class="detail-type flex-row flex-just-start flex-align-center flex-nowrap">
              <span class="det-type-tit">实付金额</span>
              <span class="det-type-val">：{{order.pay_amount}}元</span>
            </div>
          </div>
          <div class="detail-r flex-row flex-just-end flex-align-end">
            <q-btn unelevated label="退款" class="cus-btn-grey" v-if="order.order_status === 0" size="sm" @click="toRefund"></q-btn>
          </div>
        </div>
      </div>
      <!-------------------------按钮组-------------------------------->
      <div v-if="order.order_status < 2" class="q-pa-lg">
        <div class="q-pa-lg">
          <q-btn unelevated label="去使用" class="full-width cus-btn-primary" v-if="order.order_status === 0" @click="toConfirm"></q-btn>
          <q-btn unelevated label="再来一单" class="full-width cus-btn-primary" v-if="order.order_status === 1" @click="toOrderSet"></q-btn>
        </div>
      </div>
      <div v-if="order.order_status > 1" class="order-bot bg-white">
        <div class="reason-tit q-pa-md">退款原因</div>
        <div class="q-pa-md m-tp">
          <q-input
            v-model="order.buyer_remark"
            filled
            disable
            type="textarea"
          />
        </div>
      </div>
    </div>
    <q-inner-loading :showing="showLoading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import urls from 'src/api/urls'
import location from 'src/components/location'
// import { date } from 'quasar'
export default {
  name: 'orderDetail',
  components: {
    location
  },
  data () {
    return {
      order: {},
      lat: 0,
      lng: 0,
      showLoading: false,
      btnLoading: false
    }
  },
  created () {
    let vm = this
    vm.showLoading = true
    navigator.geolocation.getCurrentPosition(position => {
      vm.lat = position.coords.latitude
      vm.lng = position.coords.longitude
      let param = {
        'lat': position.coords.latitude,
        'lng': position.coords.longitude,
        'orderid': vm.orderInfo.orderid
      }
      vm.$axios(urls.orderDetail, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.order = res
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      })
    }, () => {
      // vm.showLoading = false
      // vm.$q.notify({ message: '获取地理位置失败' })
      let param = {
        'lat': 30.546561,
        'lng': 104.066529,
        'orderid': vm.orderInfo.orderid
      }
      vm.$axios(urls.orderDetail, param).then(res => {
        let code = res.code
        if (code === 'success') {
          vm.order = res
        } else {
          vm.$q.notify({ message: res.msg })
        }
        vm.showLoading = false
      })
    })
  },
  computed: {
    ...mapState({
      orderInfo: state => state.common.orderInfo
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    toProduct () {
      this.$router.push({ name: 'Product', params: { 'shopid': this.orderInfo.shopid, 'productid': this.orderInfo.productid, 'shop_name': this.orderInfo.shop_name, type: 'detail' } })
    },
    toShop (id) { // 跳转门店详情
      this.$router.push({ name: 'Shop', params: { 'shopid': id } })
    },
    toOrderSet () {
      let vm = this
      let params = {
        'productid': this.order.productid
      }
      vm.$axios(urls.auditOrder, params).then(res => {
        let code = res.code
        if (code === 'success') {
          let info = {
            shop_name: this.order.shop_name,
            shopid: this.order.shopid,
            ...res
          }
          vm.$router.push({ name: 'OrderSet', params: { 'productInfo': info, type: 'orderdetail' } })
        } else {
          vm.$q.notify({ message: res.msg })
        }
      })
    },
    toConfirm () {
      let obj = {
        'orderid': this.order.orderid
      }
      this.$store.commit('common/saveOrderInfo', obj)
      this.$router.push({ name: 'ConfirmOrder' })
    },
    toRefund () {
      this.$router.push({ name: 'Refund', params: { order: this.order } })
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
  .det-top-info{margin-left: 1rem;}
  .det-name{font-size: 1.4rem;color: #000000;font-weight: bold;margin-bottom: .6rem;}
  .det-price{font-size: 1.2rem;color: #454C58;}
  .min-price{color: #F95860;font-size: 1.4rem;font-weight: bold}
  .old-price {color: #838D94;font-size: 1.2rem;text-decoration: line-through;}
  .shop-name-div{padding-bottom: 0;padding-top: 0;}
  .shop-name{font-size: 1.4rem;color: #000000; font-weight: bold;border-bottom: 1px dotted #999999;padding-bottom: 1rem;}
  .to-shop{font-size: 1.2rem;color: #F95860;font-weight: normal;}
  .normal-tit{font-size: 1.4rem;font-weight: bold;color: #000000;}
  /*-----info----*/
  .order-bot{margin-top: 1rem;}
  .self-tit img{width: 1.5rem; margin-right: .6rem;}
  .self-tit span{font-size: 1.4rem;color: #000000}
  .tit-status{font-size: 1.1rem;color: #999999;}
  .det-detail{border-top: 1px solid #f5f5f5;}
  .detail-l{flex: 3;}
  .detail-r{flex: 1}
  .detail-type:not(:last-of-type){
    padding: 0 0 1.5rem 0;
  }
  .det-type-tit{color: #666666;font-size: 1.2rem;min-width: 5rem;text-align: justify;text-align-last:justify;}
  .det-type-val{color: #333333;font-size: 1.2rem;}
  /*----退款原因-----*/
  .reason-tit{font-size: 1.3rem;color: #333333;font-weight: bold;padding-bottom: .6rem;}
  .m-tp{border-top: 1px solid #f5f5f5;padding-top: .6rem}
  .shop-address{margin-bottom: .6rem}
</style>
