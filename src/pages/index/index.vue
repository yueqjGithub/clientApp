<template>
  <q-page class="cus-bg-grey">
    <q-header class="bg-transparent" ref="comHeader">
      <div class="index-top">
        <div class="text-left text-white q-pa-sm index-tit">知了贝</div>
        <div class="index-search q-pa-sm">
          <q-input
            dense
            borderless
            :bottom-slots="false"
            :hide-bottom-space="true"
            placeholder="请输入菜品/门店关键字"
            class="cus-search-input"
            input-class="text-white"
            @focus="toSearch"
          >
            <template v-slot:prepend>
              <q-icon name="img:https://pic.iidingyun.com/8696123/commonImg/c/search_icon.png" />
            </template>
          </q-input>
        </div>
      </div>
    </q-header>
    <!------轮播----->
    <div>
<!--      <div class="full-width bg-white">-->
<!--        <q-skeleton height="29vw" v-if="showSkeleton" animation="wave"></q-skeleton>-->
<!--        <div class="full-width" v-else>-->
<!--          <img :src="`https://${bannerList[0]}`" alt="" class="index-banner" v-if="bannerList.length < 2">-->
<!--          <q-carousel-->
<!--            v-else-->
<!--            animated-->
<!--            :navigation="false"-->
<!--            v-model="slide"-->
<!--            height="29vw"-->
<!--            infinite-->
<!--            autoplay-->
<!--            transition-prev="slide-right"-->
<!--            transition-next="slide-left"-->
<!--          >-->
<!--            <q-carousel-slide v-for="k in bannerList" :key="k" :name="k" :img-src="`https:${k}`" />-->
<!--            &lt;!&ndash;        <q-carousel-slide :name="bannerList[0]" :img-src="bannerList[0]"></q-carousel-slide>&ndash;&gt;-->
<!--            &lt;!&ndash;        <q-carousel-slide :name="bannerList[1]" :img-src="bannerList[1]"></q-carousel-slide>&ndash;&gt;-->
<!--          </q-carousel>-->
<!--        </div>-->
<!--      </div>-->
      <!----tab----->
<!--      <tab-list :tabs="tabList"></tab-list>-->
      <!-------------垫层--------------------->
<!--      <div style="width: 100%;height: .8rem;" class="cus-bg-grey" ref="comType"></div>-->
<!--      <div :class="scrollPosition > changePosition ? 'cus-abs' : ''" :style="{'top': `${truePosition}px`}">-->
<!--        <type-list :list="typeList" v-if="typeList.length > 1" @filterList="changeOpt" style="position: relative;"></type-list>-->
<!--      </div>-->
      <!--    <link-part></link-part>-->
      <product-list :opt="listOpt" @setType="setType" ref="forFresh" :finalPosition="finalPosition"></product-list>
    </div>
    <!----------------------------新人红包弹窗----------------------------->
<!--    https://pic.iidingyun.com/8696123/wxImg/index/newRedpackage.png-->
    <q-dialog v-model="showPrize" persistent :square="false">
      <div class="prize-window">
        <div class="check-prize-num">{{prizeNum}}贝</div>
        <div class="member-btn" @click="reciveDc"></div>
        <img src="https://pic.iidingyun.com/8696123/wxImg/index/newRedpackage.png" alt="">
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
// import LinkPart from 'src/pages/index/linkPart'
// import TypeDrawer from 'src/pages/index/typeDrawer'
import productList from './productList'
// import TabList from './newTab'
// import typeList from './newType'
export default {
  name: 'index',
  components: {
    // LinkPart,
    // TypeDrawer,
    productList
    // TabList
    // typeList
  },
  data () {
    return {
      showDrawer: false,
      listOpt: {},
      bannerList: [],
      tabList: [],
      typeList: [],
      slide: 1,
      showSkeleton: true,
      finalPosition: 0,
      showPrize: false,
      prizeNum: 0
    }
  },
  created () {
    let vm = this
    let num = this.$q.localStorage.getItem('loginInfo').dc
    if (num > 0) { // 登录赠送dc大于0---》新人
      vm.prizeNum = num
      vm.showPrize = true
    }
  },
  mounted () {
    // console.log(this.$refs['comHeader'].size)
    this.finalPosition = this.$refs['comHeader'].size
    // console.log(this.$route)
  },
  computed: {
    // truePosition () {
    //   let num = 0
    //   if (this.scrollPosition > this.changePosition) {
    //     num = this.finalPosition
    //   }
    //   return num
    // }
  },
  methods: {
    reciveDc () { // 领取新人红包
      let vm = this
      vm.$q.notify({ message: '领取成功' })
      // 变更本地存储中的dc值
      let oldObj = vm.$q.localStorage.getItem('loginInfo')
      oldObj['dc'] = 0
      vm.$q.localStorage.set('loginInfo', oldObj)
      vm.showPrize = false
    },
    // setBanner (list) {
    //   if (Array.isArray(list)) {
    //     this.bannerList = list
    //   } else {
    //     this.bannerList.push(list)
    //   }
    //   this.showSkeleton = false
    //   this.slide = list[0]
    // },
    setTabs (list) { // 设置tab栏
      this.tabList = [...list]
    },
    setType (list) { // 设置类型参数
      // let vm = this
      // vm.changePosition = vm.$refs['comType'].$el.offsetTop
      this.typeList = [...list]
    },
    openDrawer () {
      this.showDrawer = true
    },
    toSearch () {
      this.$router.push({ name: 'Search' })
    },
    changeOpt (list) {
      if (Array.isArray(list)) {
        if (list.length > 0) {
          this.listOpt = {
            'shop_typeid': [...list]
          }
        } else {
          this.listOpt = {}
        }
      }
      this.showDrawer = false
    }
  }
}
</script>

<style scoped>
.index-top{
  background-image: linear-gradient(to bottom, #F55059, #E63541);
  padding-top: 2rem;
}
.index-tit{
  font-size: 1.8rem;
  /*margin-top: 2rem;*/
}
.index-banner{
  width: 100%;
  margin-top: -0.2rem;
  max-height: 29vw;
}
.cus-abs{
  position: fixed;
  z-index:2;
  width: 100vw;
  overflow: auto;
}
  /*-------------------新人红包----------------*/
.prize-window{
  box-shadow: none !important;
  width: 80%;
  position: relative;
}
.prize-window img{
  width: 100%;
}
  .member-btn{
    position: absolute;
    width: 46%;
    height: 12%;
    top: 79%;
    left: 26%;
  }
.check-prize-num{
  position: absolute;
  font-size: 2.6rem;
  color: #EAC672;
  top: 60%;
  left: 35%;
}
</style>
