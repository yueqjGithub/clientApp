<template>
  <q-page class="full-width full-height carve-page">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            瓜分千万贝
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="crave-top-container q-pa-sm">
      <div class="c-top">
        <img src="../../statics/tbIcon/crave-top.png" alt="">
      </div>
      <!------------------正文-------------------->
      <div class="q-pa-sm flex-column flex-just-center flex-align-center carve-content">
        <div class="crave-time">每周一11时11分开奖</div>
        <img src="https://pic.iidingyun.com/8696123/wxImg/index/gf_img4.png" alt="" class="crave-mid-img">
        <btnGroup :status="info.status" :tip-name="info.name"
                  @join="join" @share="share" @joinNext="joinNext"
        ></btnGroup>
        <!----------日期----------->
        <div class="flex-row flex-space-between flex-align-center q-pa-md" v-if="info.status !== 3">
          <div v-for="(k, index) in weekList" :key="index" :class="k === 0 ? 'week-n' : 'week-y'"
               class="week-item flex-column flex-just-center flex-align-center">
            <div class="week-circle"></div>
            <div class="week-word">周{{wordList[keyList.indexOf(index)]}}</div>
          </div>
        </div>
        <div class="get-img" v-if="info.status === 3">
          <img src="https://pic.iidingyun.com/8696123/wxImg/index/gf_img8.png" alt="">
        </div>
      </div>
      <!------------------Loading-------------------->
      <q-inner-loading :showing="showLoading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
      <!---------------弹出层------------------->
      <q-dialog v-model="showSuc" persistent>
        <div class="prize-window" @click="joinNext">
          <img src="https://pic.iidingyun.com/8696123/wxImg/index/gf_img9.png" alt="">
          <div class="flex-row flex-just-center flex-align-baseline dc-val">
            <span class="dc-num">{{dc}}</span>
            <div class="dc-unit">贝</div>
          </div>
        </div>
      </q-dialog>
      <!---------------弹出层------------------->
      <q-dialog v-model="showFaild" persistent>
        <div class="prize-window" @click="joinNext">
          <img src="https://pic.iidingyun.com/8696123/wxImg/index/gf_img10.png" alt="">
        </div>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import urls from 'src/api/urls'
import btnGroup from './btnGroup'
export default {
  name: 'carve',
  components: {
    btnGroup
  },
  data () {
    return {
      info: {},
      weekList: [],
      keyList: [],
      wordList: ['一', '二', '三', '四', '五', '六', '日'],
      showLoading: false,
      dc: 1111,
      showSuc: false,
      showFaild: false
    }
  },
  created () {
    this.queryIndex()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    queryIndex () {
      let vm = this
      vm.showLoading = true
      vm.$axios(urls.partition, {}).then(res => {
        vm.info = { ...res }
        if (res.status === 5) {
          vm.showFaild = true
        }
        vm.weekList = res.week_share
        vm.keyList = Object.keys(res.week_share)
        vm.showLoading = false
      }, () => {
        vm.$q.notify({ message: '获取状态失败，请检查网络是否畅通' })
        vm.showLoading = false
      })
    },
    join () { // 立即参与
      let vm = this
      this.$axios(urls.joinParty, {}).then(res => {
        let code = res.code
        vm.$q.notify({ message: res.msg })
        if (code === 'success') {
          vm.queryIndex()
        }
      }, () => {
        vm.$q.notify({ message: '参与失败，请检查网络是否通畅' })
      })
    },
    share () { // 立即瓜分
      let vm = this
      this.$axios(urls.doShareDc, {}).then(res => {
        let code = res.code
        vm.$q.notify({ message: res.msg })
        if (code === 'success') {
          vm.dc = res.dc
          vm.showSuc = true
        }
      }, () => {
        vm.$q.notify({ message: '连接超时，请检查网络是否畅通' })
      })
    },
    joinNext () { // 参与下一期
      let vm = this
      vm.$axios(urls.joinNext, {}).then(res => {
        let code = res.code
        vm.$q.notify({ message: res.msg })
        if (code === 'success') {
          vm.showSuc = false
          vm.showFaild = false
          vm.queryIndex()
        }
      }, () => {
        vm.$q.notify({ message: '连接超时，请检查网络是否畅通' })
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
  .carve-page{
    background: #E1454D;
  }
  .crave-top-container{background: #F34D56;width: 100%;padding-top: 1px;padding-bottom: 2rem;}
  .c-top{
    width: 100%;
    margin-top: 1rem;
  }
  .c-top img{width: 100%;}
  .carve-content{
    background-image: url("https://pic.iidingyun.com/8696123/wxImg/index/gf_img2.png");
    background-size: 100% 100%;
    padding-bottom: 2.3rem;
  }
  .crave-time{width: 70%;text-align: center;
    color: #ffffff;font-size: 1.4rem;background: #E83945;border-radius: .5rem;padding: .4rem;
    margin: 3rem auto 1.5rem auto;
  }
  .crave-mid-img{width: 87%;margin-bottom: 3rem;}
  .prize-window{
    box-shadow: none !important;
    width: 80%;
    position: relative;
  }
  .prize-window img{
    width: 100%;
  }
  .dc-val{position: absolute;top: 50%;width: 100%;}
  .dc-num{font-size: 4rem; color: #000000;}
  .dc-unit{font-size: 1.1rem;color: white;width: 2rem;height: 2rem;border-radius: 50%;background: #CF470D;text-align: center;line-height: 2rem;
  margin-left: .8rem;}
  .week-item{margin: 0 1vw;}
  .week-n .week-circle{
    width: 9vw;
    height: 9vw;
    background: #F8E9DE;
    border: 1px solid #F34D56;
    border-radius: 50%;
  }
  .week-y .week-circle{
    width: 9vw;
    height: 9vw;
    background: #EA4839;
    border: 1px solid #EA4839;
    border-radius: 50%;
    position: relative;
  }
  .week-y .week-circle:after{
    font-family: 'iconfont';
    content: "\e681";
    font-size: 1.8rem;
    color: white;
    position: absolute;
    /* right: 0; */
    /* top: 0; */
    left: 50%;
    /* z-index: 1; */
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .week-word{font-size: 1.2rem;color: #999999;margin-top: .4rem;}
  .get-img{width: 70%;}
  .get-img img{width: 100%}
</style>
