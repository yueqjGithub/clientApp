<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            限时秒杀
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
      <!------轮播----->
      <div class="full-width bg-white">
        <q-skeleton height="29vw" v-if="showSkeleton" animation="wave"></q-skeleton>
        <div class="full-width" v-else>
          <img :src="`https://${bannerList[0]}`" alt="" class="index-banner" v-if="bannerList.length < 2">
          <q-carousel
            v-else
            animated
            :navigation="false"
            v-model="slide"
            height="29vw"
            infinite
            autoplay
            transition-prev="slide-right"
            transition-next="slide-left"
          >
            <q-carousel-slide v-for="k in bannerList" :key="k" :name="k" :img-src="`https:${k}`" />
            <!--        <q-carousel-slide :name="bannerList[0]" :img-src="bannerList[0]"></q-carousel-slide>-->
            <!--        <q-carousel-slide :name="bannerList[1]" :img-src="bannerList[1]"></q-carousel-slide>-->
          </q-carousel>
          <!--------------计时器------------------>
          <div class="q-pa-sm flex-row flex-space-between flex-align-center limit-tab">
            <clock :stamp="stamp" :status="status"></clock>
<!--            <q-btn label="开抢提醒" size="sm" class="notice-btn" unelevated></q-btn>-->
          </div>
        </div>
      </div>
    </q-header>
    <list @subBanner="collectionBanner" @subTime="collectionTime"></list>
  </q-page>
</template>

<script>
import Clock from './clock'
import List from './list'
export default {
  name: 'limitBuy',
  components: {
    Clock,
    List
  },
  data () {
    return {
      slide: 1,
      bannerList: [],
      stamp: 50,
      showSkeleton: true,
      status: 0 // 决定当前抢购状态
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    collectionBanner (list) { // 绑定在列表上的收集banner函数
      if (Array.isArray(list)) {
        this.bannerList = [...list]
      } else {
        this.bannerList = [list]
      }
    },
    collectionTime (obj) { // 列表组建中计算出时间后返回到本组件内并传递到倒计时组件内
      // console.log(obj)
      this.showSkeleton = false
      this.stamp = obj.stamp
      this.status = obj.status
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
  .index-banner{
    width: 100%;
    margin-top: -0.2rem;
    max-height: 29vw;
  }
  .notice-btn{background: #FF9C00;color: #ffffff;}
  .limit-tab{border-bottom: 1px dotted #e1e1e1;}
</style>
