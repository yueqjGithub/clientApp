<template>
  <div class="pro-item bg-white q-pa-md">
    <div class="flex-row flex-space-between flex-align-center pro-tit" v-if="showTit">
      <div class="shop-name" @click="toShops">{{k.shop_name}}</div>
      <div class="shop-distance">{{k.distance_tag}}</div>
    </div>
    <div class="flex-row flex-nowrap flex-align-center" @click="goProduct">
      <div class="pro-img-div">
        <div class="img-tag tag-gold">限时抢购</div>
        <img :src="`https://${k.head_photo}`" alt="" class="pro-img">
      </div>
      <div class="pro-cont-div flex-column flex-space-around flex-align-start">
        <div class="product-name">{{k.product_name}}</div>
        <div class="flex-row flex-just-start flex-align-center">
          <span class="normal-word">低至</span>
          <span class="pro-price">{{userType === 1 ? k.member_sale_price : k.sale_price}}元</span>
          <span class="pro-old-price">门店价{{k.price}}元</span>
        </div>
        <div class="progress-div flex-row flex-just-start flex-align-center" v-if="status === 1 && k.inventory > 1">
          <div class="sale-progress flex-row flex-align-center flex-just-start">
            <div class="sale-out text-center" :style="{width: `${100 - k.inventory_progress}%`}"></div>
            <div class="sale-not">{{k.inventory_progress}}%</div>
          </div>
          <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory > 5">已抢{{k.sale_count}}件</div>
          <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory <= 5 && k.inventory > 0">仅剩{{k.sale_count}}件</div>
          <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory === 0">已售罄</div>
        </div>
        <div v-if="status===1 && k.inventory === 0 && !isFromLimit" class="text-black cus-font-12">
          明日11:00继续秒杀
        </div>
        <div v-if="isFromLimit && status !== 1" class="cus-font-12 text-black">
          每日11:00开始秒杀
        </div>
      </div>
      <div class="pro-btn-div flex-column flex-just-center flex-align-end">
        <q-btn label="即将开始" class='cus-btn-primary' size="sm" unelevated disable v-if="status === 0"></q-btn>
        <q-btn :label="isFromLimit ? '秒杀' : '马上抢'" class='cus-btn-primary-nb' size="sm" unelevated v-if="status === 1 && k.inventory > 0" @click.stop="auditOrder"></q-btn>
        <q-btn label="已抢光" class="cus-btn-light-grey" size="sm" unelevated disable v-if="status === 1 && k.inventory === 0"></q-btn>
        <q-btn label="明日再抢" class="cus-btn-light-grey" size="sm" unelevated disable v-if="status===2"></q-btn>
        <div class="flex-row flex-align-center flex-just-end full-width" v-if="isFromLimit && status === 1">
<!--          <span class="time-tit">距结束</span>-->
          <clock :status="1" :stamp="k.limit_end_mili"></clock>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import urls from '../api/urls'
import clock from 'src/components/clock'

export default {
  name: 'newItem',
  // props: ['k', 'status', 'userType'],
  components: {
    clock
  },
  props: {
    k: {},
    status: {
      default: undefined
    },
    userType: {
      default: undefined
    },
    isFromLimit: {
      default: false
    },
    showTit: {
      default: true
    }
  },
  methods: {
    toShops () { // 跳转门店详情
      // this.$router.push({ name: 'Shop', params: { 'shopid': this.k.shopid } })
      let obj = {
        'shopid': this.k.shopid
      }
      this.$store.commit('common/setSeeShop', obj)
      this.$router.push({ name: 'Shop' })
    },
    goProduct () {
      this.$store.commit('common/setSeeProduct', this.k)
      this.$router.push({ name: 'Product' })
    },
    auditOrder () {
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
          vm.$store.commit('common/setSeeOrder', info)
          vm.$router.push({ name: 'OrderSet' })
        } else {
          vm.$q.notify({ message: res.msg })
        }
      })
    }
  }
}
</script>

<style scoped>
.pro-item + .pro-item{margin-top: 1rem;}
.product-name,.shop-name{
  font-size: 1.4rem;
  color: #000000;
  font-weight: bold;
}
  .shop-distance{
    color: #999999;
    font-size: .8rem;
  }
  .pro-tit{padding-bottom: 0;}
.pro-img-div{
  width: 23vw;
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
  flex: 7;
  padding-left: 1rem;
  height: 23vw;
}
.pro-btn-div{flex: 3.7;height: 23vw;}
.img-tag{
  background: green;
  color: white;
  font-size: 1rem;
  position: absolute;
  top: -.4rem;
  left: -.4rem;
  border-radius: .4rem;
  padding: .6rem .4rem 0 .9rem;
  white-space: nowrap;
}
.tag-gold{
  background: #FF7E00;
}
.tag-green{
  background: #009D0F;
}
.tag-red{
  background: #DD0000;
}
.act-tag{
  border: 1px solid #F95860;
  border-radius: .2rem;
  font-size: 1.2rem;
  color: #f95860;
  margin-right: .5rem;
  line-height: 1.4rem;
  padding: 0px .4rem;
}
  .normal-word{color: #454C58;font-size: 1.2rem;}
  .pro-price{font-size: 1.2rem;color: #F95860;font-weight: bold;margin-left: .4rem;}
  .pro-old-price{color: #838D94;font-size: 1.2rem;text-decoration: line-through;margin-left: .8rem;}
/*-------------进度条-------------------*/
.progress-div{
  width: 80%;
  flex-wrap: nowrap;
}
.sale-progress{
  width: 60%;
  position: relative;
  /*border: .1rem solid #BFBFBF;*/
  height: 1.4rem;
  border-radius: .8rem;
  background: #FFDDDF;
  border: 1px solid #F95860;
}
.sale-out{
  font-size: 1rem;
  background: #F95860;
  color: white;
  height: 100%;
  border-radius: .7rem;
  line-height: 1.4rem;
  white-space: nowrap;
}
.sale-not{
  flex: 2;
  /*color: #BFBFBF;*/
  color: #ffffff;
  text-align: center;
  height: 100%;
  line-height: 1.4rem;
  font-size: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
  .time-tit{font-size: 1rem;color: #F6535B;margin-right: .4rem;}
</style>
