<template>
  <q-tabs no-caps dense align="left" indicator-color="transparent" class="bg-white text-grey indexFooter shadow-4" active-color="black" shrink>
    <q-route-tab to="/app/index" label="首页" :icon="homeIcon" class="index-footer-icon"></q-route-tab>
    <q-route-tab to="/app/suggestion" label="推荐" :icon="sugIcon" class="index-footer-icon"></q-route-tab>
    <q-route-tab to="/app/order" label="订单" :icon="orderIcon" class="index-footer-icon"></q-route-tab>
    <q-route-tab to="/app/mine" label="我的" :icon="mineIcon" class="index-footer-icon"></q-route-tab>
  </q-tabs>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  name: 'commonFooter',
  data () {
    const imgHost = 'img:https://pic.iidingyun.com/8696123/commonImg/c/tabicon/'
    return {
      // indexUrl: '',
      imgHost: imgHost
    }
  },
  mounted () {
  },
  computed: {
    homeIcon () {
      let url = `${this.imgHost}4.png`
      if (this.$route.path === '/app/index') {
        url = `${this.imgHost}6.png`
      }
      return url
    },
    sugIcon () {
      let url = `${this.imgHost}2.png`
      if (this.$route.path === '/app/suggestion') {
        url = `${this.imgHost}8.png`
      }
      return url
    },
    orderIcon () {
      let url = `${this.imgHost}1.png`
      if (this.$route.path === '/app/order') {
        url = `${this.imgHost}5.png`
      }
      return url
    },
    mineIcon () {
      let url = `${this.imgHost}3.png`
      if (this.$route.path === '/app/mine') {
        url = `${this.imgHost}7.png`
      }
      return url
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.un-exact-color {
  color: #838d94;
}
</style>
