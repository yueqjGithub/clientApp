<template>
  <div class="cus-card q-pa-md pro-item">
    <div class="flex-row flex-space-between flex-align-center" v-if="showTit">
      <div class="product-name" @click="toShops">{{k.shop_name}}</div>
      <div class="product-distance">
        <q-icon name="app:iconlocation" color="#999999"></q-icon>
        <span>{{k.distance_tag}}</span>
      </div>
    </div>
    <div class="flex-row flex-just-start flex-align-center" :class="showTit ? 'item-bt' : ''" @click="goProduct">
      <div class="pro-img-div">
        <div class="img-tag" v-if="k.auto_tag" :class="k.auto_tags === '热销' ? 'tag-red' : 'tag-green'">{{k.auto_tags}}</div>
        <img :src="`https://${k.head_photo}`" alt="" class="pro-img">
      </div>
      <div class="pro-cont-div flex-column flex-space-between flex-align-start">
        <div class="flex-row flex-space-between flex-align-center full-width" style="flex: 1">
          <div class="flex-row flex-just-start flex-align-center">
            <div class="act-tag" v-if="k.market_type === 1">特惠</div>
            <div class="product-name">{{k.product_name}}</div>
          </div>
          <q-btn icon="app:iconfenxiang" size="xs" flat round class="share-icon" @click="shareShop" v-if="showShare"></q-btn>
          <!--                <div>抢购时间预留</div>-->
<!--          <div v-if="k.limit_end_time" class="flex-row flex-just-start flex-align-center">-->
<!--            <span class="limit-buy">限时抢购</span>-->
<!--            <div>-->
<!--              <span class="limit-time">{{k.limit_end_time.split(':')[0]}}</span>-->
<!--              <span>:</span>-->
<!--              <span class="limit-time">{{k.limit_end_time.split(':')[1]}}</span>-->
<!--            </div>-->
<!--          </div>-->
        </div>
        <div style="flex: 1">
          <span class="buy-price" v-if="isVip === 1">低至{{(k.member_sale_price - k.dc).toFixed(2)}}元</span>
          <span class="buy-price" v-if="isVip === 0">低至{{(k.sale_price - k.dc).toFixed(2)}}元</span>
          <span class="pro-old-price">门店价{{k.price}}元</span>
        </div>
        <!-----------进度条------------>
        <div class="flex-row flex-space-between flex-align-end full-width">
          <div class="progress-div flex-row flex-just-start flex-align-center" v-if="k.market_type !== 0">
            <div class="sale-progress flex-row flex-align-center flex-just-start">
              <div class="sale-out text-center" :style="{width: `${100 - k.inventory_progress}%`}"></div>
              <div class="sale-not">{{k.inventory_progress}}%</div>
            </div>
            <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory > 5">已抢{{k.sale_count}}件</div>
            <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory <= 5 && k.inventory > 0">仅剩{{k.sale_count}}件</div>
            <div style="font-size: 1rem;color: #999999;margin-left: .4rem" v-if="k.inventory === 0">已售罄</div>
          </div>
          <div style="flex:3.7;" v-if="k.market_type===0"></div>
          <!----------抢购按钮---------->
          <div style="flex: 3.7;" class="flex-row flex-align-end flex-just-end">
            <q-btn class="cus-btn-primary-nb" unelevated size="sm" @click.stop="auditOrder">抢购</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import urls from 'src/api/urls'
export default {
  name: 'productItem',
  data () {
    return {
      isVip: 0
    }
  },
  props: {
    k: {},
    showTit: {
      default: true
    },
    showShare: {
      default: false
    }
  },
  created () {
    this.isVip = this.$q.localStorage.getItem('loginInfo').type
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
      // let type = this.$route.name
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
    },
    shareShop () { // 分享到微信
      let vm = this
      /* eslint-disable */
      Wechat.share({
        message: {
          title: '知了推荐，好吃又省钱',
          description: '知了贝',
          thumb: 'https://pic.iidingyun.com/8696123/commonImg/c/logo.png',
          media: {
            type: Wechat.Type.MINI,
            webpageUrl: 'mteb.com',
            userName: 'gh_f20003f8875c',
            path: `/pages/goodDetails/goodDetails?productid=${vm.k.productid}&shopid=${vm.k.shopid}`, // 小程序的页面路径
            hdImageData: 'https://pic.iidingyun.com/8696123/commonImg/c/logo.png', // 程序新版本的预览图二进制数据 不超过128kb 支持 地址 base64 temp
            withShareTicket: true, // 是否使用带shareTicket的分享
            miniprogramType: Wechat.Mini.RELEASE
          }
        },
        scene: Wechat.Scene.SESSION
      }, function () {
        // vm.$q.notify({ message: '分享成功' })
      }, function (reason) {
        vm.$q.notify({ message: '分享出错' })
      })
      /* eslint-disable */
    },
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
  .item-bt{
    /*margin-top: 1.1rem;*/
  }
  .product-name{
    font-size: 1.4rem;
    color: #000000;
    font-weight: bold;
  }
  .product-distance{
    color: #999999;
    font-size: .8rem;
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
  .act-tag{
    border: 1px solid #F95860;
    border-radius: .2rem;
    font-size: 1.2rem;
    color: #f95860;
    margin-right: .5rem;
    line-height: 1.4rem;
    padding: 0px .4rem;
  }
  .progress-div{
    /*width: 70%;*/
    flex: 7;
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
  /*---------------价格显示---------------*/
  .buy-price{
    color: #F95860;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .dc-price{
    color: #666666;
    font-size: 1.2rem;
  }
  /*------------------------限时抢购----------------*/
  .limit-buy{
    color: #F6535B;
    font-size: 1.2rem;
    margin-right: .5rem;
    margin-left: .5rem;
  }
  .limit-time{
    background: black;
    color: white;
    border-radius: .5rem;
    font-size: 1.2rem;
    display: inline-block;
    padding: 0 .2rem;
    margin: 0 .2rem;
  }
  .share-icon{
    background: #DBF6E4;
    color: #006D26;
    margin-left: .2rem;
    justify-self: flex-end;
  }
  .pro-old-price{color: #838D94;font-size: 1.2rem;text-decoration: line-through;margin-left: .8rem;}
</style>
