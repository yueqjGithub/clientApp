<template>
  <q-page>
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            面对面邀请
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="bg-white flex-column flex-just-center flex-align-center code-content-div">
      <img :src="berry" alt="" class="code-img">
      <div class="code-word">扫码和朋友一起吃</div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import urls from '../../api/urls'
export default {
  name: 'faceShare',
  data () {
    return {
      berry: ''
    }
  },
  mounted () {
    let vm = this
    let param = {
      ...vm.info
    }
    vm.$blobPost(urls.faceCode, param, { responseType: 'arraybuffer' }).then(res => {
      return 'data:image/png;base64,' + btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    }).then(data => {
      vm.berry = data // 图片地址 <img src='data' />
    })
  },
  computed: {
    ...mapState({
      info: state => state.common.shareInfo
    })
  },
  methods: {
    goBack () {
      this.$router.go(-1)
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
  .code-content-div{width: 100%;height: 80vh;}
  .code-img{width: 45%;}
  .code-word{font-size: 1.4rem;color: #666666;margin-top: 3rem;}
</style>
