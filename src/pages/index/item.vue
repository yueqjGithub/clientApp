<template>
  <div class="shop-item" @click='toShop'>
    <img :src="`https:${k.head_photo}`" alt="" class="shop-img">
    <div class="q-pa-sm shop-word flex-column flex-space-between flex-align-start">
      <div class="shop-name">{{k.shop_name}}</div>
      <div class="shop-introduce">{{k.shop_desc}}</div>
      <div class="full-width shop-last flex-row flex-space-between flex-align-center">
        <div class="shop-price">最多省
          <span>{{k.max_price}}元</span>
        </div>
        <div class="shop-distance">{{k.distance_tag}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: ['k'],
  methods: {
    toShop () {
      let obj = {
        'shopid': this.k.id
      }
      this.$store.commit('common/setSeeShop', obj)
      this.$router.push({ name: 'Shop' })
    }
  }
}
</script>

<style scoped>
.shop-item{
  width: 48%;
  height: 48vw;
  border-radius: .6rem;
  background: #ffffff;
  margin-top: 1rem;
  overflow: hidden;
  box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.03);
}
  .shop-img{width: 100%;display: block;height: 55%;}
  .shop-word{height: 44%}
  .shop-name{font-size: 1.2rem;color: #000000;}
  .shop-introduce{font-size: 1rem;color: #999999;margin-top: .9rem}
  .shop-price{font-size: 1rem;color: #666666;}
  .shop-price span{font-weight: bold;color: #f95860;font-size: 1.1rem;}
  .shop-distance{font-size: .9rem;color: #b5bdc4}
</style>
