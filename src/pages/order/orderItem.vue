<template>
  <div class="q-pa-sm cus-card" @click="toDetail(k)">
    <div class="flex-row flex-space-between flex-align-center" v-if="showTit">
      <div class="product-name">{{k.shop_name}}
        <span v-if="status === 'left'" class="tit-word-btn" @click.stop="toShop(k.shopid)">继续选购></span>
        <span v-if="status !== 'left'" class="tit-word-btn" @click.stop="toShop(k.shopid)">去选购></span>
      </div>
      <div class="product-distance" v-if="status !== 'right'">
        <q-icon name="app:iconlocation" color="#999999"></q-icon>
        <span>{{k.distance_tag}}</span>
      </div>
      <div class="product-distance" v-if="status === 'right'">
        <span v-if="k.order_status === 2">退款中</span>
        <span v-if="k.order_status === 3">已退款</span>
      </div>
    </div>
    <div class="flex-row flex-just-start flex-align-center" :class="showTit ? 'item-bt' : ''">
      <div class="pro-img-div">
        <div class="img-tag" v-if="k.auto_tag" :class="k.auto_tag === '热销' ? 'tag-red' : 'tag-green'">{{k.auto_tag}}</div>
        <img :src="`https://${k.head_photo}`" alt="" class="pro-img">
      </div>
      <div class="pro-cont-div flex-column flex-space-between flex-align-start">
        <div class="flex-row flex-space-between flex-align-center">
          <div class="flex-column flex-space-between flex-align-start">
            <div class="product-name">{{k.product_name}}</div>
            <div class="product-name">数量：{{k.total_amount}}</div>
          </div>
        </div>
        <div class="flex-row flex-space-between flex-align-end full-width">
          <div class="flex-column flex-space-between flex-align-start">
            <div class="flex-row flex-just-start flex-align-center">
              <del class="old-price">门店总价{{k.total_fee}}</del>
              <div class="price-ys">已省</div>
              <div class="price-dismount">{{k.discount}}元</div>
            </div>
            <div class="flex-row flex-just-start flex-align-center pay-time">
              <span v-if="status === 'left'">支付时间：{{k.create_time}}</span>
              <span v-if="status === 'center'">使用时间：{{k.use_time}}</span>
              <span v-if="status === 'right'">退款时间：{{k.refund_time}}</span>
            </div>
          </div>
          <!--------------按钮组------------------->
          <div class="flex-row flex-space-between flex-align-center flex-nowrap order-btn-grp">
            <q-btn label="删除订单" class="cus-btn-grey cus-pd-sm-btn" size="sm" unelevated v-if="status !== 'left'" @click.stop="deleteOrder"></q-btn>
            <q-btn label="再来一单" class="cus-btn-primary cus-pd-sm-btn" size="sm" unelevated v-if="status === 'center'" @click.stop="toOrderSet"></q-btn>
            <q-btn label="退款进度" class="cus-btn-primary cus-pd-sm-btn" size="sm" unelevated v-if="status === 'right'" @click.stop="toProgress"></q-btn>
            <q-btn label="去使用" class="cus-use-btn" size="lg" unelevated v-if="status === 'left'" @click.stop="toConfirm(k)"></q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'orderItem',
  props: {
    k: {},
    showTit: {
      default: true
    },
    status: {
      default: 'left'
    }
  },
  data () {
    return {}
  },
  methods: {
    toConfirm (k) {
      let obj = {
        'orderid': k.orderid
      }
      this.$store.commit('common/saveOrderInfo', obj)
      this.$router.push({ name: 'ConfirmOrder' })
    },
    toDetail (k) {
      let obj = {
        'orderid': k.orderid
      }
      this.$store.commit('common/saveOrderInfo', obj)
      this.$router.push({ name: 'OrderDetail' })
    },
    toShop (id) { // 跳转门店详情
      let obj = {
        'shopid': id
      }
      this.$store.commit('common/setSeeShop', obj)
      this.$router.push({ name: 'Shop' })
    },
    deleteOrder () {
      let params = {
        'orderid': this.k.orderid
      }
      this.$axios(urls.deleteOrder, params).then(res => {
        let code = res.code
        if (code === 'success') {
          this.$emit('del')
        } else {
          this.$q.notify({ message: res.msg })
        }
      })
    },
    toOrderSet () {
      let vm = this
      let params = {
        'productid': this.k.productid
      }
      vm.$axios(urls.auditOrder, params).then(res => {
        let code = res.code
        if (code === 'success') {
          let info = {
            shop_name: this.k.shop_name,
            shopid: this.k.shopid,
            ...res
          }
          this.$store.commit('common/setSeeOrder', info)
          vm.$router.push({ name: 'OrderSet' })
        } else {
          vm.$q.notify({ message: res.msg })
        }
      })
    },
    toProgress () {
      this.$store.commit('common/setSeeOrder', this.k)
      this.$router.push({ name: 'RefundProgress' })
    }
  }
}
</script>

<style scoped>
  .cus-card{
    background: white;
  }
  .cus-card + .cus-card {
    margin-top: 1rem;
  }
  .product-name{
    font-size: 1.4rem;
    color: #000000;
    font-weight: bold;
  }
  .tit-word-btn{
    font-size: 1.2rem;
    color: #F95860;
    font-weight: normal;
  }
  .product-distance{
    color: #999999;
    font-size: .8rem;
  }
  .img-tag{
    background: green;
    color: white;
    font-size: 1.2rem;
    position: absolute;
    top: -.4rem;
    left: -.4rem;
    border-radius: .4rem;
    padding: .6rem .4rem 0 .9rem;
    white-space: nowrap;
  }
  .tag-green{
    background: #009D0F;
  }
  .tag-red{
    background: #DD0000;
  }
  .pro-img-div{
    flex: 1;
    height: 23vw;
    position: relative;
    border-radius: .5rem;
    overflow: hidden;
  }
  .pro-img-div .pro-img{
    width: 100%;
    height: 100%;
  }
  .pro-cont-div{
    flex: 3;
    margin-left: 1rem;
    height: 23vw;
  }
  .product-name{
    font-size: 1.4rem;
    color: #000000;
    font-weight: bold;
  }
  .old-price{
    color: #838D94;
    font-size: 1rem;
    text-decoration: line-through;
  }
  .price-ys{
    color: #454C58;
    font-size: 1rem;
    margin-left: .8rem;
  }
  .price-dismount{
    color: #F95860;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .pay-time{
    color: #B5BDC4;
    font-size: 1rem;
  }
  .cus-btn-primary{
    margin-left: .2rem;
  }
  .order-btn-grp{
    position: relative;
  }
  .cus-use-btn{
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(0, -130%);
    background: #F9595F;
    color: #ffffff;
    padding: .2rem .1rem;
  }
</style>
