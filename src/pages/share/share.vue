<template>
  <q-page class="bg-cus">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            邀请有礼
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="full-width full-height share-bg">
      <img src="https://pic.iidingyun.com/8696123/wxImg/my/my_yaoqing.png" alt="" class="share-bg-img">
      <!----------贝显示------------------>
      <div class="dc-div flex-row flex-just-center flex-align-baseline">
        <div class="dc-val">{{dcVal}}</div>
        <div class="dc-unit">贝</div>
      </div>
      <!-------立即邀请按钮-------------->
      <div class="rn-btn" @click="shareToWx"></div>
      <div class="face-btn" @click="toFaceShare"></div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'share',
  computed: {
    ...mapState({
      dcVal: state => state.common.shareDc
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    toFaceShare () {
      let vm = this
      let loginInfo = vm.$q.localStorage.getItem('loginInfo')
      let param = {
        'code': 'U',
        'openid': loginInfo.openid
      }
      vm.$store.commit('common/setShareInfo', param)
      vm.$router.push({ name: 'FaceShare' })
      // setShareInfo
    },
    shareToWx () {
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
      /* eslint-disable */
    }
  }
}
</script>

<style scoped>
  .bg-cus{background: #FFC483;}
  .index-top{
    background-image: linear-gradient(to bottom, #F55059, #E63541);
    padding-top: .6rem;
    padding-bottom: .6rem;
  }
  .share-bg{position: relative}
  .share-bg-img{width: 100%;}
  .dc-val{font-size: 9rem;color: #E13324;}
  .dc-unit{
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 50%;
    font-size: 1.6rem;
    color: #fbefdf;
    line-height: 2.7rem;
    text-align: center;
    background: linear-gradient(to bottom,#ED785C,#FF7B5D,#EE3929);
  }
  .dc-div{
    position: absolute;
    top: 34%;
    left: 23%;
  }
  .rn-btn{
    width: 58%;
    height: 6.2%;
    position: absolute;
    top: 64%;
    left: 21%;
  }
  .face-btn{
    width: 58%;
    height: 6.2%;
    position: absolute;
    top: 72.2%;
    left: 21%;
  }
</style>
