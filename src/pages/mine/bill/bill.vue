<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            我的贝
          </div>
          <div class="cus-header-r">
          </div>
        </div>
        <div>
          <div class="top-total">
            <div class="flex-row flex-just-start flex-align-center q-pa-md">
              <span>余额</span>
              <img src="https://pic.iidingyun.com/8696123/wxImg/my/yu-e.png" alt="">
            </div>
            <div class="flex-row flex-just-center flex-align-center">
              <span class="balance-num">{{balance}}</span>
              <span>贝</span>
            </div>
          </div>
        </div>
      </div>
    </q-header>
    <q-tabs
      v-model="tab"
      class="bg-white my-tab"
      narrow-indicator
      dense
      align="justify"
      indicator-color="primary"
    >
      <q-tab name="left" label="收入" :ripple="false"/>
      <q-tab name="right" label="支出" :ripple="false"/>
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      swipeable
      keep-alive
      class="dc-tab"
    >
      <q-tab-panel name="left">
        <list :queryType="1" @subBalance="getBalance" v-if="tab === 'left'"></list>
      </q-tab-panel>
      <q-tab-panel name="right">
        <list :queryType="2" @subBalance="getBalance" v-if="tab === 'right'"></list>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import List from 'src/pages/mine/bill/billList'
export default {
  name: 'dcRecorder',
  components: {
    List
  },
  data () {
    return {
      balance: 0,
      tab: 'left'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getBalance (num) {
      this.balance = num
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
  .top-total{
    background-image: url("https://pic.iidingyun.com/8696123/wxImg/my/bg-bei.png");
    background-size: 100% 100%;
    width: 94vw;
    height: 33.8vw;
    margin: 1.6rem auto;
  }
  .top-total span{
    font-size: 1.4rem;
    margin-right: .4rem;
  }
  .top-total img{
    width: 1.4rem;
    height: 1.4rem;
  }
  .balance-num{font-size: 3.8rem !important;color: #ffffff;font-weight: bold;}
  .balance-num + span {font-size: 2rem !important;color: #ffffff}
  .my-tab{
    padding-bottom: .4rem;
    padding-top: .4rem;
    margin-bottom: .2rem;
  }
</style>
