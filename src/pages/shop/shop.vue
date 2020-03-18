<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            门店详情
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
          {{shop.shop_name}}
        </div>
        <div class="shop-qr" @click="toFaceShare">
          <q-icon name="app:iconqr_code" style="color: #838D94"></q-icon>
          <span>面对面扫一起吃</span>
        </div>
      </div>
      <div class="top-img">
        <q-skeleton height="38vw" v-if="skeleton"></q-skeleton>
        <img :src="`https://${Array.isArray(shop.photo) ? shop.photo[0] : shop.photo}`" alt="" v-if="!skeleton" class="shop-photo">
      </div>
      <div class="shop-location">
        <div v-if="skeleton">
          <q-skeleton width="100%"></q-skeleton>
        </div>
        <div v-if="!skeleton">
          <div class="add-tit">门店地址</div>
          <location :distance="shop.distance_tag" :address="shop.address"
          :now-location="{'lat': lat, 'lng': lng }"
          :target="{'lat': shop.lat, 'lng': shop.lng }"
          ></location>
        </div>
      </div>
    </div>
    <!-----------------list--------------------->
    <div class="list-div">
      <div class="list-tit flex-row flex-space-between flex-align-center q-pa-sm bg-white">
        <div class="tit-word">知了推荐（好吃又省钱）</div>
        <q-btn icon="app:iconfenxiang" size="xs" flat round @click="shareShop" class="share-icon"></q-btn>
      </div>
      <div v-if="shop.product && shop.product.length > 0">
        <div v-for="k in shop.product" :key="k.productid" class="control-ma-list">
          <list-item :k="k" v-if="k.market_type !== 2" :show-tit="false"></list-item>
          <new-item :k="k" :status="k.status" v-if="k.market_type === 2" :is-from-limit="true" :show-tit="false"></new-item>
        </div>
<!--        <list-item v-for="k in shop.product" :key="k.productid" :k="k" :show-tit="false"></list-item>-->
      </div>
      <no-product :message="'当前暂无商品'" v-if="!shop.product"></no-product>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import Location from 'src/components/location'
import ListItem from 'src/components/productItem'
import newItem from 'src/components/newItem'
import NoProduct from 'src/components/non'
import { mapState } from 'vuex'
export default {
  name: 'shop',
  components: {
    Location,
    ListItem,
    newItem,
    NoProduct
  },
  data () {
    return {
      lat: 0,
      lng: 0,
      shop: {},
      skeleton: false,
      entryType: ''
    }
  },
  created () {
    // this.entryType = this.$route.params.type
    this.getLocationAndInfo()
  },
  computed: {
    ...mapState({
      localInfo: state => state.common.seeShop // store中存储的shop信息
    })
  },
  methods: {
    toFaceShare () {
      let param = {
        'code': 'S',
        'shopid': this.shop.shopid
      }
      this.$store.commit('common/setShareInfo', param)
      this.$router.push({ name: 'FaceShare' })
    },
    goBack () {
      this.$router.go(-1)
      // this.$router.go(-1)
    },
    shareShop () {
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
            path: `/pages/shops/shops?shopid=${vm.shop.shopid}`, // 小程序的页面路径
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
    getLocationAndInfo () { // 请求门店详情
      let vm = this
      this.skeleton = true
      navigator.geolocation.getCurrentPosition(position => {
        vm.lat = position.coords.latitude
        vm.lng = position.coords.longitude
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'shopid': vm.localInfo.shopid
        }
        vm.queryInfo(params)
      }, () => {
        // vm.$q.notify('获取当前位置失败' + err.message)
        vm.lat = 30.546561
        vm.lng = 104.066529
        let params = {
          'lat': vm.lat,
          'lng': vm.lng,
          'shopid': vm.localInfo.shopid
        }
        vm.queryInfo(params)
      })
    },
    queryInfo (param) {
      let vm = this
      vm.$axios(urls.queryShopDetail, param).then(res => {
        vm.shop = res
        vm.skeleton = false
      }, err => {
        vm.$q.notify({ message: `无法获取门店信息，请稍后再试${JSON.stringify(err)}` })
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
    display: block;
    border-radius: .8rem;
  }
  .shop-location{
    margin-top: 1rem;
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
  .share-icon{
    background: #DBF6E4;
    color: #006D26;
    margin-left: .2rem;
  }
  .control-ma-list + .control-ma-list{
    margin-top: 1rem;
  }
</style>
