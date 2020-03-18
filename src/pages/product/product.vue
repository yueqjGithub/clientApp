<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            菜品详情
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="shop-top q-pa-sm bg-white">
      <div class="top-tit flex-row flex-space-between flex-align-center">
        <div class="shop-name">
          <q-skeleton width="3rem" v-if="skeleton"></q-skeleton>
          {{product.product_name}}
        </div>
<!--        <div class="shop-qr" @click="toFaceShare">-->
<!--          <q-icon name="app:iconqr_code" style="color: #838D94"></q-icon>-->
<!--          <span>面对面扫一起吃</span>-->
<!--        </div>-->
        <div v-if="product.market_type === 2" class="my-bold-show">
          <div class="flex-row flex-just-end flex-align-center" v-if="product.status !== 2">
            <span class="cus-font-12 cus-ma-right" :class="product.status === 0 ? 'text-black' : 'text-primary-2'">{{product.status === 0 ? '即将开始' : '距离结束'}}</span>
            <clock :status="product.status" :stamp="product.status===0 ? product.limit_begin_mili : product.limit_end_mili"></clock>
          </div>
          <div v-if="product.status === 2" class="cus-font-12 text-black">
            抢购已结束
          </div>
        </div>
      </div>
      <div class="top-img">
        <q-skeleton height="38vw" v-if="skeleton"></q-skeleton>
        <img :src="`https://${Array.isArray(product.photo) ? product.photo[0] : product.photo}`" alt="" v-if="!skeleton" class="shop-photo">
      </div>
      <div class="shop-location">
        <div v-if="skeleton">
          <q-skeleton width="100%"></q-skeleton>
        </div>
        <div v-if="!skeleton">
          <div class="add-tit">{{shopName}}</div>
          <location :distance="product.distance_tag" :address="product.address"
                    :now-location="{'lat': lat, 'lng': lng }"
                    :target="{'lat': product.lat, 'lng': product.lng }"
          ></location>
        </div>
      </div>
    </div>
    <!-----------------list--------------------->
    <div class="list-div bg-white q-pa-sm" v-if="skeleton">
      <q-skeleton width="30%"></q-skeleton>
      <q-skeleton width="100%" style="margin-top: 1rem"></q-skeleton>
      <q-skeleton width="100%" style="margin-top: 1rem"></q-skeleton>
    </div>
    <div class="list-div" v-if="!skeleton">
      <div class="list-tit flex-row flex-space-between flex-align-center q-pa-sm bg-white">
        <div class="tit-word">菜品介绍</div>
        <div>
          <q-btn icon="app:iconaixin" size="xs" flat round :class="product.favorite ? 'fork-icon' : 'no-fork'" @click="collectionProduct"></q-btn>
          <q-btn icon="app:iconfenxiang" size="xs" flat round @click="shareShop" class="share-icon"></q-btn>
        </div>
      </div>
      <div class="q-pa-sm bg-white" v-if="Array.isArray(product.product_desc)">
        <div class="flex-row flex-space-between flex-align-center description-tit">
          <div class="desc-name-non description-tit-name">{{product.product_name}}</div>
          <div class="desc-price">{{product.price}}元</div>
        </div>
        <div v-if="product.product_desc.length > 0">
          <div v-for="k in product.product_desc" :key="k.product_name" class="flex-row flex-space-between flex-align-center pro-detail-item">
            <div class="desc-name flex-row flex-just-start flex-align-center">
              <div class="name-circle"></div>
              {{k.product_name}}</div>
            <div class="desc-price">{{k.price ? `${k.price}元` : ''}}</div>
          </div>
        </div>
      </div>
      <!--        <div v-else>-->
      <!--          <div class="flex-row flex-space-between flex-align-center">-->
      <!--            <div class="desc-name-non">{{product.product_name}}</div>-->
      <!--            <div class="desc-price">{{product.price}}元</div>-->
      <!--          </div>-->
      <!--        </div>-->
      <div v-else>
        <!--------------desc为null--------------------->
        <div class="flex-row flex-space-between flex-align-center">
          <div class="desc-name-non">{{product.product_name}}</div>
          <div class="desc-price">{{product.price}}元</div>
        </div>
      </div>
    </div>
    <div class="link-to-shop" @click="toShops">
      查看更多门店优惠菜品
      <q-icon name="app:iconright"></q-icon>
    </div>
    <!-----------------foot------------------->
    <q-footer class="bg-white q-pa-sm" v-if="!skeleton">
      <div class="full-width flex-row flex-space-between flex-align-center">
        <div class="flex-column flex-align-start flex-space-between">
          <div>
            <span class="bot-y">低至</span>
            <span class="bot-price" v-if="isVip === 1">{{(product.member_sale_price - product.dc).toFixed(2)}}</span>
            <span class="bot-price" v-if="isVip === 0">{{(product.sale_price - product.dc).toFixed(2)}}</span>
            <span class="bot-y">元</span>
<!--            <span class="bot-dc">+{{product.dc_value}}贝</span>-->
          </div>
          <div class="bot-old-price">
            门店价{{product.price}}元
          </div>
        </div>
        <q-btn size="md" label="立即抢购" class="cus-buy-btn" unelevated @click="toOrderDetail" v-if="product.market_type !== 2"></q-btn>
        <div v-if="product.market_type === 2">
          <div class="flex-row flex-just-end flex-align-center" v-if="product.status === 1">
            <div class="buy-tips" v-if="product.inventory > 5">已抢{{product.sale_count}}件</div>
            <div class="buy-tips" v-if="product.inventory <= 5 && product.inventory > 0">仅剩{{product.sale_count}}件</div>
            <div class="buy-tips" v-if="product.inventory === 0">已售罄</div>
          </div>
          <q-btn label="即将开始" class='cus-btn-primary' size="md" unelevated disable v-if="product.status === 0"></q-btn>
          <q-btn label="立即抢购" class='cus-btn-primary-nb' size="md"
                 unelevated v-if="product.status === 1 && product.inventory > 0" @click.stop="toOrderDetail"></q-btn>
          <q-btn label="明日再抢" class="cus-btn-light-grey" size="md" unelevated disable v-if="product.status===2"></q-btn>
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import Location from 'src/components/location'
import Clock from 'src/components/clock'
import { mapState } from 'vuex'
export default {
  name: 'product',
  components: {
    Location,
    Clock
  },
  data () {
    return {
      entryType: '',
      lat: 0,
      lng: 0,
      product: {},
      skeleton: false,
      shopName: '',
      backName: '' // 返回按钮路由name
    }
  },
  created () {
    this.shopName = this.localInfo.shop_name
    this.getLocationAndInfo()
  },
  computed: {
    isVip () {
      return this.$q.localStorage.getItem('loginInfo').type
    },
    ...mapState({
      localInfo: state => state.common.seeProduct // store中存储的产品信息
    })
  },
  methods: {
    toFaceShare () {
      let param = {
        'code': 'S',
        'shopid': this.product.shopid
      }
      this.$store.commit('common/setShareInfo', param)
      this.$router.push({ name: 'FaceShare' })
    },
    toOrderDetail () {
      let vm = this
      let params = {
        'productid': this.product.productid
      }
      vm.$axios(urls.auditOrder, params).then(res => {
        let code = res.code
        if (code === 'success') {
          let info = {
            shop_name: vm.product.shop_name,
            shopid: vm.product.shopid,
            ...res
          }
          vm.$store.commit('common/setSeeOrder', info)
          vm.$router.push({ name: 'OrderSet' })
        } else {
          vm.$q.notify({ message: res.msg })
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    toShops () { // 跳转门店详情
      // this.$router.push({ name: 'Shop', params: { 'shopid': this.localInfo.shopid, 'productid': this.product.productid, type: 1 } })
      let obj = {
        'shopid': this.localInfo.shopid,
        'productid': this.product.productid
      }
      this.$store.commit('common/setSeeShop', obj)
      this.$router.push({ name: 'Shop' })
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
            path: `/pages/goodDetails/goodDetails?productid=${vm.localInfo.productid}&shopid=${vm.localInfo.shopid}`, // 小程序的页面路径
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
    getLocationAndInfo () { // 请求菜品详情
      let vm = this
      this.skeleton = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'shopid': vm.localInfo.shopid,
          'productid': vm.localInfo.productid
        }
        vm.queryInfo(params)
      }, () => {
        // vm.$q.notify('获取当前位置失败' + err.message)
        vm.lat = 30.546561
        vm.lng = 104.066529
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'shopid': vm.localInfo.shopid,
          'productid': vm.localInfo.productid
        }
        vm.queryInfo(params)
      })
    },
    queryInfo (param) {
      let vm = this
      vm.$axios(urls.queryProductDetail, param).then(res => {
        vm.product = res
        vm.skeleton = false
      }, err => {
        vm.$q.notify({ message: `无法获取菜品信息，请稍后再试${JSON.stringify(err)}` })
      })
    },
    collectionProduct () { // 收藏
      let vm = this
      let param = {
        'productid': this.localInfo.productid,//产品ID
        'shopid': this.localInfo.shopid //产品ID
      }
      vm.product.favorite = !vm.product.favorite
      vm.$axios(urls.collection, param).then(res => {
        vm.$q.notify({ message: res.msg })
      }, err => {
        vm.$q.notify({ message: `收藏出错${JSON.stringify(err)}` })
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
  .shop-name{
    font-size: 1.4rem;
    color: #000000;
    font-weight: bold;
  }
  .shop-qr{
    font-size: 1.2rem;
    color: #838D94;
  }
  .top-img{
    margin-top: 1.2rem;
  }
  .shop-photo{
    width: 100%;
    height: 38vw;
    display: inline-block;
    border-radius: .8rem;
  }
  .shop-location{
    margin-top: 1.6rem;
  }
  .add-tit{
    font-size: 1.4rem;
    font-weight: bold;
    color: #000000;
  }
  .list-tit{
    margin-bottom: .2rem;
    margin-top: 1rem;
  }
  .tit-word{
    font-size: 1.4rem;
    font-weight: bold;
    color: #000000;
  }
  .desc-name{
    color: #838D94;
    font-size: 1.2rem;
  }
  .desc-price{
    color: #000000;
    font-size: 1.2rem;
  }
  .link-to-shop{
    width: 45vw;
    padding: 1rem;
    text-align: center;
    border: 1px dotted #F6535B;
    font-size: 1.2rem;
    color: #F6535B;
    border-radius: .2rem;
    margin: 6rem auto 0 auto;
  }
  .no-fork{
    color: #888888;
    background: #ececec;
  }
  .fork-icon{
    background: #FDEBED;
    color: #F94D78;
  }
  .share-icon{
    background: #DBF6E4;
    color: #006D26;
    margin-left: .2rem;
  }
  .bot-price{
    color: #F95860;
    font-size: 1.8rem;
    font-weight: bold;
  }
  .bot-y{
    color: #F95860;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .bot-dc{
    color: #666666;
    font-size: 1.4rem;
    font-weight: bold;
  }
  .bot-old-price{
    font-size: 1.2rem;
    color: #999999;
  }
  .buy-tips{font-size: 1.2rem;color: #FF8400;margin-right: .6rem;}
  .desc-name-non{color: #000000;}
  .name-circle{width: .4rem;height: .4rem;border-radius: 50%;background: #666666;margin-right: .6rem}
  .description-tit .description-tit-name{font-size: 1.3rem}
  .description-tit{margin-bottom: .6rem}
  .pro-detail-item + .pro-detail-item{margin-top: .4rem;}
</style>
