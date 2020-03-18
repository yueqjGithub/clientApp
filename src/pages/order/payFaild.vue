<template>
  <q-page class="bg-white">
    <q-header class="bg-transparent">
      <div class="index-top">
        <div class="cus-header flex-row">
          <div class="cus-header-l">
            <q-btn flat round icon="app:iconcc-left" @click="goBack"></q-btn>
          </div>
          <div class="cus-header-m text-center">
            {{info.shopName}}
          </div>
          <div class="cus-header-r">
          </div>
        </div>
      </div>
    </q-header>
    <div class="flex-column flex-just-start flex-align-center content-div">
      <div class="fail-tit text-center">支付失败</div>
      <img src="https://pic.iidingyun.com/8696123/wxImg/icons/pay-fail.png" alt="" class="fail-img">
      <div class="text-center">
        {{info.product_name}}(门店{{info.price}}元)
      </div>
      <div class="text-center">已为您省{{info.discont}}元</div>
      <div class="btn-grp flex-row flex-space-around flex-align-center">
        <q-btn label="返回首页" to="/app/index" class="btn-green text-white" unelevated></q-btn>
        <q-btn label="再次支付" @click="goBack" class="cus-btn-primary" unelevated></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'payFaild',
  data () {
    return {
      info: {}
    }
  },
  created () {
    this.info = { ...this.$route.params.info }
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
.content-div{
  padding: 6rem 4rem;
}
  .fail-tit{font-size: 1.4rem;color: #000000;font-weight: bold;margin-bottom: 2rem;}
  .fail-img{display: inline-block;width: 6rem;margin-bottom: 3rem;}
  .btn-grp{padding: 8rem 4rem;width: 100%;}
  .btn-green{background: #09C063;border-radius: .5rem;border: 1px solid #029D4E;}
</style>
