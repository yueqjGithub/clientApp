<template>
  <q-page class="bg-white">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round disable></q-btn>
          </div>
          <div class="cus-header-m text-center">
            使用成功
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="q-pa-lg">
      <div class="t-font-sm text-center q-pa-sm">
        订单号：{{info.orderid}}
      </div>
      <div class="t-font-md text-center q-pa-sm">
        {{info.shop_name}}
      </div>
      <div class="text-center q-pa-sm">
        <span class="t-font-count">{{info.total_amount}}份</span>
        <span>{{info.product_name}}</span>
      </div>
      <div class="text-center">
        <img src="https://pic.iidingyun.com/8696123/commonImg/c/success.png" alt="" class="suc-img">
      </div>
      <div class="t-font-lg text-center q-pa-sm">
        使用成功 可以上菜了
      </div>
      <div class="t-font-sm text-center q-pa-sm">
        使用时间：{{info.useTime}}
      </div>
      <div class="t-font-sm text-center s-cus-ma">
        此次消费获得+{{info.dc}}贝
      </div>
      <div class="q-pa-sm text-center">
        <div class="s-btn-div">
          <q-btn class="cus-btn-primary full-width" label="返回列表" unelevated @click="toOrderList"></q-btn>
        </div>
      </div>
      <div class="t-font-share text-center flex-row flex-just-center flex-align-center">
        分享赚贝
        <img src="https://pic.iidingyun.com/8696123/wxImg/image/share1.png" alt="" class="share-img" @click="share">
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'useSuc',
  data () {
    return {
      info: {}
    }
  },
  created () {
    this.info = { ...this.$route.params.obj }
  },
  mounted () {
    let vm = this
    document.addEventListener('backbutton', vm.toOrderList, false)
  },
  methods: {
    share () {
      let vm = this
      let loginInfo = vm.$q.localStorage.getItem('loginInfo')
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
            path: `/pages/index/index?openid=${loginInfo.openid}`, // 小程序的页面路径
            hdImageData: 'https://pic.iidingyun.com/8696123/commonImg/c/logo.png', // 程序新版本的预览图二进制数据 不超过128kb 支持 地址 base64 temp
            withShareTicket: true, // 是否使用带shareTicket的分享
            miniprogramType: Wechat.Mini.RELEASE
          }
        },
        scene: Wechat.Scene.SESSION
      }, function () {
        // vm.$q.notify({ message: '分享成功' })
      }, function (reason) {
        vm.$q.notify({ message: reason })
      })
    },
    toOrderList () {
      this.$router.push({ name: 'Order' })
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
  .t-font-sm{color: #666666;font-size: 1.2rem;}
  .t-font-md{color: #000000;font-size: 1.4rem;font-weight: bold;}
  .t-font-lg{color: #333333;font-size: 2.1rem;font-weight: bold;}
  .t-font-count{color: #F95860;font-size: 2.1rem;}
  .suc-img{display: inline-block;width: 6rem;margin-top: 2rem;margin-bottom: 2rem;}
  .s-cus-ma{margin-top: 6rem;}
  .s-btn-div{width: 65%;margin: 0 auto;}
  .t-font-share{font-size: 1.4rem;color: #000000;margin-top: 3rem;}
  .share-img{width: 1.4rem;margin-left: .3rem;}
</style>
